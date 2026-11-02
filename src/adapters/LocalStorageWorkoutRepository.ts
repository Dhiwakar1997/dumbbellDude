// trussel: T-30V5HB73GS@1
import type { Workout } from '../domain/model';
import type { WorkoutRepository } from '../application/ports';
import { LocalStorageStore } from './storage';

const WORKOUTS = 'workouts';
const ACTIVE = 'activeWorkout';


// Shape guard(s) for data read back from storage; anything failing is treated as absent.
type Rec = Record<string, unknown>;
const isObj = (x: unknown): x is Rec => typeof x === 'object' && x !== null && !Array.isArray(x);
const isStr = (x: unknown): x is string => typeof x === 'string';
function isWorkout(x: unknown): x is Workout {
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

function isWorkoutArray(x: unknown): x is Workout[] {
  return Array.isArray(x) && x.every(isWorkout);
}

function isWorkoutOrNull(x: unknown): x is Workout | null {
  return x === null || isWorkout(x);
}

// trussel: T-64Z5RJATJ4@1
export class LocalStorageWorkoutRepository implements WorkoutRepository {
  constructor(private readonly store: LocalStorageStore) {}

  private all(): Workout[] {
    return this.store.read<Workout[]>(WORKOUTS, [], isWorkoutArray);
  }

  list(): Workout[] {
    return this.all().sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
  }

  get(id: string): Workout | null {
    return this.all().find((w) => w.id === id) ?? null;
  }

  save(workout: Workout): void {
    this.store.write(WORKOUTS, [...this.all().filter((w) => w.id !== workout.id), workout]);
  }

  getActive(): Workout | null {
    return this.store.read<Workout | null>(ACTIVE, null, isWorkoutOrNull);
  }

  saveActive(workout: Workout): void {
    this.store.write(ACTIVE, workout);
  }

  clearActive(): void {
    this.store.remove(ACTIVE);
  }

  replaceAll(workouts: Workout[]): void {
    this.store.write(WORKOUTS, workouts);
  }

  clear(): void {
    this.store.remove(WORKOUTS);
    this.store.remove(ACTIVE);
  }
}
