// trussel: T-HE4BBNG508@1
import { ValidationError } from '../domain/model';
import type { SetEntry, Workout, WorkoutExercise } from '../domain/model';
import { findPersonalRecordSetIds } from '../domain/records';
import { currentStreak, weekSummary } from '../domain/streak';
import { validateSetEntry } from '../domain/validation';
import { countDoneSets, workoutDurationMinutes, workoutVolume } from '../domain/volume';
import type { Clock, ExerciseRepository, IdGenerator, RoutineRepository, WorkoutRepository } from './ports';

export interface WorkoutSummary {
  workout: Workout;
  volumeKg: number;
  doneSets: number;
  durationMinutes: number;
  prCount: number;
}

export interface HomeSummary {
  streakDays: number;
  week: { workouts: number; volumeKg: number };
  lastWorkout: WorkoutSummary | null;
  hasActive: boolean;
}

function cleanNumber(n: number | undefined, integer: boolean): number | undefined {
  if (n === undefined) return undefined;
  if (!Number.isFinite(n) || n < 0) return 0;
  return integer ? Math.floor(n) : n;
}

// trussel: T-N3DR6WH6FJ@1
export class WorkoutService {
  constructor(
    private readonly workouts: WorkoutRepository,
    private readonly exercises: ExerciseRepository,
    private readonly routines: RoutineRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  // trussel: T-DKNVXNHJHV@1
  getActive(): Workout | null {
    return this.workouts.getActive();
  }

  // trussel: T-YSJX4VNKHB@1
  startEmpty(): Workout {
    this.assertNoActive();
    const workout: Workout = {
      id: this.ids.next(),
      name: 'Workout',
      startedAt: this.clock.now().toISOString(),
      exercises: [],
    };
    this.workouts.saveActive(workout);
    return workout;
  }

  // trussel: T-YD1QG556DJ@1
  startFromRoutine(routineId: string): Workout {
    this.assertNoActive();
    const routine = this.routines.get(routineId);
    if (!routine) throw new ValidationError('That routine is gone.');
    const exercises: WorkoutExercise[] = [];
    for (const target of routine.exercises) {
      const exercise = this.exercises.get(target.exerciseId);
      if (!exercise) continue;
      const previous = this.previousSets(exercise.id);
      const sets: SetEntry[] = Array.from({ length: target.targetSets }, (_, i) => ({
        id: this.ids.next(),
        weightKg: previous[i]?.weightKg ?? previous[previous.length - 1]?.weightKg ?? 0,
        reps: target.targetReps,
        done: false,
      }));
      exercises.push({
        id: this.ids.next(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets,
      });
    }
    const workout: Workout = {
      id: this.ids.next(),
      name: routine.name,
      routineId: routine.id,
      startedAt: this.clock.now().toISOString(),
      exercises,
    };
    this.workouts.saveActive(workout);
    return workout;
  }

  // trussel: T-D891B41X1B@1
  addExercises(exerciseIds: string[]): Workout {
    const active = this.requireActive();
    const added: WorkoutExercise[] = [];
    for (const id of exerciseIds) {
      const exercise = this.exercises.get(id);
      if (!exercise) continue;
      const prev = this.previousSets(id)[0];
      added.push({
        id: this.ids.next(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: [{ id: this.ids.next(), weightKg: prev?.weightKg ?? 0, reps: prev?.reps ?? 0, done: false }],
      });
    }
    return this.save({ ...active, exercises: [...active.exercises, ...added] });
  }

  // trussel: T-955TG1P0FW@1
  addSet(workoutExerciseId: string): Workout {
    return this.updateBlock(workoutExerciseId, (block) => {
      const last = block.sets[block.sets.length - 1];
      const set: SetEntry = { id: this.ids.next(), weightKg: last?.weightKg ?? 0, reps: last?.reps ?? 0, done: false };
      return { ...block, sets: [...block.sets, set] };
    });
  }

  // trussel: T-65CR34TBS8@1
  updateSet(workoutExerciseId: string, setId: string, patch: { weightKg?: number; reps?: number }): Workout {
    return this.updateBlock(workoutExerciseId, (block) => ({
      ...block,
      sets: block.sets.map((s) => {
        if (s.id !== setId) return s;
        const weightKg = cleanNumber(patch.weightKg, false) ?? s.weightKg;
        const reps = cleanNumber(patch.reps, true) ?? s.reps;
        const next: SetEntry = { ...s, weightKg, reps };
        if (next.done && validateSetEntry(next)) {
          next.done = false;
          delete next.completedAt;
        }
        return next;
      }),
    }));
  }

  // trussel: T-3CWYR32D3B@1
  toggleSetDone(workoutExerciseId: string, setId: string): { workout: Workout; nowDone: boolean } {
    let nowDone = false;
    const workout = this.updateBlock(workoutExerciseId, (block) => ({
      ...block,
      sets: block.sets.map((s) => {
        if (s.id !== setId) return s;
        if (s.done) {
          const { completedAt: _drop, ...rest } = s;
          void _drop;
          return { ...rest, done: false };
        }
        const error = validateSetEntry(s);
        if (error) throw new ValidationError(error, /rep/i.test(error) ? 'reps' : 'weight');
        nowDone = true;
        return { ...s, done: true, completedAt: this.clock.now().toISOString() };
      }),
    }));
    return { workout, nowDone };
  }

  // trussel: T-CXER9149Q5@1
  finish(): Workout {
    const active = this.requireActive();
    if (countDoneSets(active).done === 0) throw new ValidationError('Tick at least one set, or discard it.');
    const exercises = active.exercises
      .map((e) => ({ ...e, sets: e.sets.filter((s) => s.done) }))
      .filter((e) => e.sets.length > 0);
    const finished: Workout = { ...active, exercises, finishedAt: this.clock.now().toISOString() };
    this.workouts.save(finished);
    this.workouts.clearActive();
    return finished;
  }

  // trussel: T-GTPVCZ9G8H@1
  discard(): void {
    this.workouts.clearActive();
  }

  // trussel: T-EFA3G0P2B7@1
  listHistory(): WorkoutSummary[] {
    const all = this.workouts.list();
    return all.map((w) => this.summarise(w, all));
  }

  // trussel: T-AZGEG9MM7S@1
  getWorkoutDetail(workoutId: string): { summary: WorkoutSummary; prSetIds: Set<string> } | null {
    const all = this.workouts.list();
    const workout = all.find((w) => w.id === workoutId);
    if (!workout) return null;
    return { summary: this.summarise(workout, all), prSetIds: findPersonalRecordSetIds(workout, all) };
  }

  // trussel: T-6JW8DG3JSQ@1
  homeSummary(): HomeSummary {
    const all = this.workouts.list();
    const now = this.clock.now();
    const history = this.listHistory();
    return {
      streakDays: currentStreak(all, now),
      week: weekSummary(all, now),
      lastWorkout: history[0] ?? null,
      hasActive: this.workouts.getActive() !== null,
    };
  }

  // trussel: T-RKJNSQV10T@1
  previousSets(exerciseId: string): SetEntry[] {
    for (const workout of this.workouts.list()) {
      const sets = workout.exercises.filter((e) => e.exerciseId === exerciseId).flatMap((e) => e.sets.filter((s) => s.done));
      if (sets.length > 0) return sets;
    }
    return [];
  }

  private summarise(workout: Workout, all: Workout[]): WorkoutSummary {
    return {
      workout,
      volumeKg: workoutVolume(workout),
      doneSets: countDoneSets(workout).done,
      durationMinutes: workoutDurationMinutes(workout, this.clock.now()),
      prCount: findPersonalRecordSetIds(workout, all).size,
    };
  }

  private assertNoActive(): void {
    if (this.workouts.getActive()) throw new ValidationError('Finish or discard your current workout first.');
  }

  private requireActive(): Workout {
    const active = this.workouts.getActive();
    if (!active) throw new ValidationError('No workout in progress.');
    return active;
  }

  private updateBlock(workoutExerciseId: string, update: (block: WorkoutExercise) => WorkoutExercise): Workout {
    const active = this.requireActive();
    if (!active.exercises.some((e) => e.id === workoutExerciseId)) {
      throw new ValidationError('That exercise is not in this workout.');
    }
    return this.save({
      ...active,
      exercises: active.exercises.map((e) => (e.id === workoutExerciseId ? update(e) : e)),
    });
  }

  private save(workout: Workout): Workout {
    this.workouts.saveActive(workout);
    return workout;
  }
}
