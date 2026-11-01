// Shape guards for data read back from localStorage (adapter-internal helpers; anything failing is treated as absent).
import type { Exercise, Routine, Workout } from '../domain/model';

type Rec = Record<string, unknown>;
const isObj = (x: unknown): x is Rec => typeof x === 'object' && x !== null && !Array.isArray(x);
const isStr = (x: unknown): x is string => typeof x === 'string';

export function isWorkout(x: unknown): x is Workout {
  return (
    isObj(x) &&
    isStr(x.id) &&
    isStr(x.name) &&
    isStr(x.startedAt) &&
    (x.finishedAt === undefined || isStr(x.finishedAt)) &&
    Array.isArray(x.exercises) &&
    x.exercises.every((e) => isObj(e) && isStr(e.id) && isStr(e.exerciseId) && Array.isArray(e.sets))
  );
}

export function isWorkoutArray(x: unknown): x is Workout[] {
  return Array.isArray(x) && x.every(isWorkout);
}

export function isWorkoutOrNull(x: unknown): x is Workout | null {
  return x === null || isWorkout(x);
}

export function isRoutineArray(x: unknown): x is Routine[] {
  return (
    Array.isArray(x) &&
    x.every((r) => isObj(r) && isStr(r.id) && isStr(r.name) && Array.isArray(r.exercises))
  );
}

export function isExerciseArray(x: unknown): x is Exercise[] {
  return Array.isArray(x) && x.every((e) => isObj(e) && isStr(e.id) && isStr(e.name) && isStr(e.muscleGroup));
}

export function isRecord(x: unknown): x is Rec {
  return isObj(x);
}
