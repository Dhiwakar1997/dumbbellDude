// trussel: T-6BXMGQG9D3@1
import { DEFAULT_SETTINGS, EQUIPMENT, MUSCLE_GROUPS, ValidationError } from '../domain/model';
import type { Exercise, Routine, Settings, Workout } from '../domain/model';
import type { Clock, ExerciseRepository, RoutineRepository, SettingsRepository, WorkoutRepository } from './ports';

export const EXPORT_APP = 'dumbbell-dude';
export const EXPORT_SCHEMA_VERSION = 1;

export interface ExportFile {
  app: typeof EXPORT_APP;
  schemaVersion: number;
  exportedAt: string;
  settings: Settings;
  customExercises: Exercise[];
  routines: Routine[];
  workouts: Workout[];
}

export interface ImportPreview {
  workouts: number;
  routines: number;
  customExercises: number;
  data: ExportFile;
}

type Rec = Record<string, unknown>;
const isObj = (x: unknown): x is Rec => typeof x === 'object' && x !== null && !Array.isArray(x);
const isStr = (x: unknown): x is string => typeof x === 'string' && x.length > 0;
const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const isIso = (x: unknown): x is string => isStr(x) && !Number.isNaN(Date.parse(x));

function isExercise(x: unknown): x is Exercise {
  return (
    isObj(x) &&
    isStr(x.id) &&
    isStr(x.name) &&
    MUSCLE_GROUPS.includes(x.muscleGroup as never) &&
    EQUIPMENT.includes(x.equipment as never) &&
    typeof x.isCustom === 'boolean'
  );
}

function isRoutine(x: unknown): x is Routine {
  return (
    isObj(x) &&
    isStr(x.id) &&
    isStr(x.name) &&
    isIso(x.createdAt) &&
    isIso(x.updatedAt) &&
    Array.isArray(x.exercises) &&
    x.exercises.every(
      (e) => isObj(e) && isStr(e.exerciseId) && Number.isInteger(e.targetSets) && Number.isInteger(e.targetReps),
    )
  );
}

function isFinishedWorkout(x: unknown): x is Workout {
  return (
    isObj(x) &&
    isStr(x.id) &&
    typeof x.name === 'string' &&
    isIso(x.startedAt) &&
    isIso(x.finishedAt) &&
    Array.isArray(x.exercises) &&
    x.exercises.every(
      (e) =>
        isObj(e) &&
        isStr(e.id) &&
        isStr(e.exerciseId) &&
        typeof e.exerciseName === 'string' &&
        MUSCLE_GROUPS.includes(e.muscleGroup as never) &&
        Array.isArray(e.sets) &&
        e.sets.every(
          (s) =>
            isObj(s) &&
            isStr(s.id) &&
            isNum(s.weightKg) &&
            s.weightKg >= 0 &&
            Number.isInteger(s.reps) &&
            (s.reps as number) >= 0 &&
            typeof s.done === 'boolean',
        ),
    )
  );
}

function isSettings(x: unknown): x is Settings {
  return (
    isObj(x) &&
    (x.units === 'kg' || x.units === 'lb') &&
    Number.isInteger(x.defaultRestSeconds) &&
    (x.defaultRestSeconds as number) >= 0 &&
    (x.defaultRestSeconds as number) <= 600
  );
}

// trussel: T-4CSKCX4AWE@1
export class DataTransferService {
  constructor(
    private readonly workouts: WorkoutRepository,
    private readonly routines: RoutineRepository,
    private readonly exercises: ExerciseRepository,
    private readonly settings: SettingsRepository,
    private readonly clock: Clock,
  ) {}

  // trussel: T-9TD1E9B5TC@1
  exportData(): { filename: string; json: string } {
    const now = this.clock.now();
    const file: ExportFile = {
      app: EXPORT_APP,
      schemaVersion: EXPORT_SCHEMA_VERSION,
      exportedAt: now.toISOString(),
      settings: this.settings.get(),
      customExercises: this.exercises.listCustom(),
      routines: this.routines.list(),
      workouts: this.workouts.list(),
    };
    const day = now.toISOString().slice(0, 10);
    return { filename: `dumbbell-dude-${day}.json`, json: JSON.stringify(file, null, 2) };
  }

  // trussel: T-472B0E2M0D@1
  parseImport(text: string): ImportPreview {
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      throw new ValidationError("That file isn't JSON.");
    }
    if (!isObj(raw) || raw.app !== EXPORT_APP || !isNum(raw.schemaVersion) || raw.schemaVersion > EXPORT_SCHEMA_VERSION) {
      throw new ValidationError('Not a Dumbbell Dude backup.');
    }
    const settings = raw.settings === undefined ? DEFAULT_SETTINGS : raw.settings;
    const customExercises = raw.customExercises ?? [];
    const routines = raw.routines ?? [];
    const workouts = raw.workouts ?? [];
    if (
      !isSettings(settings) ||
      !Array.isArray(customExercises) ||
      !customExercises.every((e) => isExercise(e) && e.isCustom) ||
      !Array.isArray(routines) ||
      !routines.every(isRoutine) ||
      !Array.isArray(workouts) ||
      !workouts.every(isFinishedWorkout)
    ) {
      throw new ValidationError('This backup is damaged. Nothing was imported.');
    }
    const data: ExportFile = {
      app: EXPORT_APP,
      schemaVersion: raw.schemaVersion,
      exportedAt: isIso(raw.exportedAt) ? raw.exportedAt : this.clock.now().toISOString(),
      settings,
      customExercises,
      routines,
      workouts,
    };
    return { workouts: workouts.length, routines: routines.length, customExercises: customExercises.length, data };
  }

  // trussel: T-CFMZ4DX6K8@1
  applyImport(preview: ImportPreview): void {
    const { data } = preview;
    this.settings.save(data.settings);
    this.exercises.replaceCustom(data.customExercises);
    this.routines.replaceAll(data.routines);
    this.workouts.replaceAll(data.workouts);
    this.workouts.clearActive();
  }

  // trussel: T-6E4HQVR6WF@1
  resetAll(): void {
    this.workouts.clear();
    this.routines.clear();
    this.exercises.clear();
    this.settings.clear();
  }
}
