import type { SetEntry, Workout, WorkoutExercise } from '../domain/model';

let counter = 0;
export function nextId(prefix = 'id'): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function set(weightKg: number, reps: number, done = true): SetEntry {
  return { id: nextId('set'), weightKg, reps, done };
}

export function exercise(exerciseId: string, sets: SetEntry[], name = exerciseId): WorkoutExercise {
  return { id: nextId('we'), exerciseId, exerciseName: name, muscleGroup: 'chest', sets };
}

export function workout(
  startedAt: string,
  exercises: WorkoutExercise[],
  options: { finished?: boolean; id?: string; minutes?: number; name?: string } = {},
): Workout {
  const finished = options.finished ?? true;
  const minutes = options.minutes ?? 60;
  return {
    id: options.id ?? nextId('w'),
    name: options.name ?? 'Workout',
    startedAt,
    finishedAt: finished ? new Date(Date.parse(startedAt) + minutes * 60000).toISOString() : undefined,
    exercises,
  };
}
