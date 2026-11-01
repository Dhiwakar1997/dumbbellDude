// In-memory fakes of the application ports, for service and screen tests (and the repository contract suite).
import { DEFAULT_SETTINGS } from '../domain/model';
import type { Exercise, Routine, Settings, Workout } from '../domain/model';
import type {
  Clock,
  ExerciseRepository,
  IdGenerator,
  RoutineRepository,
  SettingsRepository,
  WorkoutRepository,
} from '../application/ports';

const clone = <T>(x: T): T => structuredClone(x);

export class InMemoryWorkoutRepository implements WorkoutRepository {
  private workouts: Workout[] = [];
  private active: Workout | null = null;
  list(): Workout[] {
    return clone(this.workouts).sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
  }
  get(id: string): Workout | null {
    return clone(this.workouts.find((w) => w.id === id) ?? null);
  }
  save(workout: Workout): void {
    this.workouts = [...this.workouts.filter((w) => w.id !== workout.id), clone(workout)];
  }
  getActive(): Workout | null {
    return clone(this.active);
  }
  saveActive(workout: Workout): void {
    this.active = clone(workout);
  }
  clearActive(): void {
    this.active = null;
  }
  replaceAll(workouts: Workout[]): void {
    this.workouts = clone(workouts);
  }
  clear(): void {
    this.workouts = [];
    this.active = null;
  }
}

export class InMemoryRoutineRepository implements RoutineRepository {
  private routines: Routine[] = [];
  list(): Routine[] {
    return clone(this.routines).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }
  get(id: string): Routine | null {
    return clone(this.routines.find((r) => r.id === id) ?? null);
  }
  save(routine: Routine): void {
    this.routines = [...this.routines.filter((r) => r.id !== routine.id), clone(routine)];
  }
  remove(id: string): void {
    this.routines = this.routines.filter((r) => r.id !== id);
  }
  replaceAll(routines: Routine[]): void {
    this.routines = clone(routines);
  }
  clear(): void {
    this.routines = [];
  }
}

export const TEST_SEED: Exercise[] = [
  { id: 'seed-bench-press', name: 'Bench Press', muscleGroup: 'chest', equipment: 'barbell', isCustom: false },
  { id: 'seed-overhead-press', name: 'Overhead Press', muscleGroup: 'shoulders', equipment: 'barbell', isCustom: false },
  { id: 'seed-back-squat', name: 'Back Squat', muscleGroup: 'legs', equipment: 'barbell', isCustom: false },
  { id: 'seed-deadlift', name: 'Deadlift', muscleGroup: 'back', equipment: 'barbell', isCustom: false },
  { id: 'seed-dips', name: 'Dips', muscleGroup: 'chest', equipment: 'bodyweight', isCustom: false },
];

export class InMemoryExerciseRepository implements ExerciseRepository {
  private custom: Exercise[] = [];
  constructor(private readonly seed: Exercise[] = TEST_SEED) {}
  list(): Exercise[] {
    return clone([...this.seed, ...this.custom]).sort((a, b) => a.name.localeCompare(b.name));
  }
  get(id: string): Exercise | null {
    return clone([...this.seed, ...this.custom].find((e) => e.id === id) ?? null);
  }
  saveCustom(exercise: Exercise): void {
    if (!exercise.isCustom || this.seed.some((s) => s.id === exercise.id)) {
      throw new Error('Only custom exercises can be saved.');
    }
    this.custom = [...this.custom.filter((e) => e.id !== exercise.id), clone(exercise)];
  }
  listCustom(): Exercise[] {
    return clone(this.custom);
  }
  replaceCustom(exercises: Exercise[]): void {
    this.custom = clone(exercises);
  }
  clear(): void {
    this.custom = [];
  }
}

export class InMemorySettingsRepository implements SettingsRepository {
  private settings: Settings = { ...DEFAULT_SETTINGS };
  get(): Settings {
    return { ...this.settings };
  }
  save(settings: Settings): void {
    this.settings = { ...settings };
  }
  clear(): void {
    this.settings = { ...DEFAULT_SETTINGS };
  }
}

export class FakeClock implements Clock {
  constructor(private current: Date = new Date('2026-11-01T12:00:00Z')) {}
  now(): Date {
    return new Date(this.current);
  }
  set(date: Date | string): void {
    this.current = new Date(date);
  }
  advanceMinutes(minutes: number): void {
    this.current = new Date(this.current.getTime() + minutes * 60000);
  }
}

export class CounterIds implements IdGenerator {
  private n = 0;
  next(): string {
    this.n += 1;
    return `id-${this.n}`;
  }
}

export function makeFakePorts() {
  return {
    workouts: new InMemoryWorkoutRepository(),
    routines: new InMemoryRoutineRepository(),
    exercises: new InMemoryExerciseRepository(),
    settings: new InMemorySettingsRepository(),
    clock: new FakeClock(),
    ids: new CounterIds(),
  };
}
