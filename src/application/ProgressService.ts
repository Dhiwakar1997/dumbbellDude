// trussel: T-9H8ST2Y8EC@1
import type { Exercise, PersonalRecord } from '../domain/model';
import { bestSetSeries, personalRecords } from '../domain/records';
import type { BestSetPoint } from '../domain/records';
import type { ExerciseRepository, WorkoutRepository } from './ports';

// trussel: T-QPQSNMBA45@1
export class ProgressService {
  constructor(
    private readonly workouts: WorkoutRepository,
    private readonly exercises: ExerciseRepository,
  ) {}

  // trussel: T-HDN3691W00@1
  loggedExercises(): { exercise: Exercise; lastLoggedAt: string }[] {
    const seen = new Map<string, { exercise: Exercise; lastLoggedAt: string }>();
    // list() is newest first, so the first sighting is the most recent.
    for (const workout of this.workouts.list()) {
      for (const we of workout.exercises) {
        if (seen.has(we.exerciseId) || !we.sets.some((s) => s.done)) continue;
        const exercise = this.exercises.get(we.exerciseId) ?? {
          id: we.exerciseId,
          name: we.exerciseName,
          muscleGroup: we.muscleGroup,
          equipment: 'other' as const,
          isCustom: true,
        };
        seen.set(we.exerciseId, { exercise, lastLoggedAt: workout.startedAt });
      }
    }
    return Array.from(seen.values());
  }

  // trussel: T-GR6MVGW51Z@1
  seriesFor(exerciseId: string): BestSetPoint[] {
    return bestSetSeries(exerciseId, this.workouts.list());
  }

  // trussel: T-59X77W9JJJ@1
  recordsFor(exerciseId: string): PersonalRecord[] {
    return personalRecords(exerciseId, this.workouts.list());
  }
}
