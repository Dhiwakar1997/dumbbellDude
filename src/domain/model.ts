// trussel: T-EV4A831W55@1
// Domain entities and value types. Types and constants only — no I/O, no React.

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
export const MUSCLE_GROUPS: readonly MuscleGroup[] = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];

export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'kettlebell' | 'other';
export const EQUIPMENT: readonly Equipment[] = [
  'barbell',
  'dumbbell',
  'machine',
  'cable',
  'bodyweight',
  'kettlebell',
  'other',
];

export type Units = 'kg' | 'lb';

export type PRKind = 'heaviestWeight' | 'bestOneRepMax' | 'mostReps' | 'bestSetVolume';

// trussel: T-7PRESQS732@1
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  isCustom: boolean;
}

// trussel: T-EW7JNYHDSS@1
export interface SetEntry {
  id: string;
  /** Always stored in kilograms; 0 = bodyweight / zero-weight set. */
  weightKg: number;
  reps: number;
  done: boolean;
  completedAt?: string;
}

// trussel: T-TZMD43754B@1
export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  /** Snapshot of the exercise name when logged, so history survives renames. */
  exerciseName: string;
  muscleGroup: MuscleGroup;
  sets: SetEntry[];
}

// trussel: T-DB1T0BBWSA@1
export interface Workout {
  id: string;
  name: string;
  routineId?: string;
  startedAt: string;
  /** Absent while the workout is active. */
  finishedAt?: string;
  exercises: WorkoutExercise[];
}

// trussel: T-Q2SES3BY6X@1
export interface RoutineExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
}

// trussel: T-XCVF8WSBWD@1
export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: string;
  updatedAt: string;
}

// trussel: T-SBBZ5NF3PW@1
export interface Settings {
  units: Units;
  defaultRestSeconds: number;
}

export const DEFAULT_SETTINGS: Settings = { units: 'kg', defaultRestSeconds: 90 };

// trussel: T-AF11X1FNYP@1
export interface PersonalRecord {
  exerciseId: string;
  kind: PRKind;
  value: number;
  weightKg: number;
  reps: number;
  workoutId: string;
  setId: string;
  achievedAt: string;
}

// trussel: T-ZT2QS66GSN@1
export class ValidationError extends Error {
  readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
