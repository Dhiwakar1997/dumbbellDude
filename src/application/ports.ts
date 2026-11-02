// trussel: T-K8G26A943X@1
// Ports the use-case services need. Synchronous by design (localStorage is synchronous).
import type { Exercise, Routine, Settings, Workout } from '../domain/model';

// trussel: T-Q3KJ0FD12W@1
export interface WorkoutRepository {
  /** Finished workouts, newest startedAt first. */
  list(): Workout[];
  get(id: string): Workout | null;
  save(workout: Workout): void;
  getActive(): Workout | null;
  saveActive(workout: Workout): void;
  clearActive(): void;
  replaceAll(workouts: Workout[]): void;
  clear(): void;
}

// trussel: T-AFZX8743KX@1
export interface RoutineRepository {
  list(): Routine[];
  get(id: string): Routine | null;
  save(routine: Routine): void;
  remove(id: string): void;
  replaceAll(routines: Routine[]): void;
  clear(): void;
}

// trussel: T-K497X0TA0F@1
export interface ExerciseRepository {
  /** Seed + custom exercises sorted by name. */
  list(): Exercise[];
  get(id: string): Exercise | null;
  saveCustom(exercise: Exercise): void;
  listCustom(): Exercise[];
  replaceCustom(exercises: Exercise[]): void;
  /** Drops custom exercises only; the seed list always remains. */
  clear(): void;
}

// trussel: T-KVN1AP4N82@1
export interface SettingsRepository {
  get(): Settings;
  save(settings: Settings): void;
  clear(): void;
}

// trussel: T-ZBRG887BYQ@1
export interface Clock {
  now(): Date;
}

// trussel: T-4J2TWE9EC0@1
export interface IdGenerator {
  next(): string;
}
