// trussel: T-EPMKZ1Z88E@1
// Composition root: the only place that knows the concrete adapters.
import { LocalStorageExerciseRepository } from '../adapters/LocalStorageExerciseRepository';
import { LocalStorageRoutineRepository } from '../adapters/LocalStorageRoutineRepository';
import { LocalStorageSettingsRepository } from '../adapters/LocalStorageSettingsRepository';
import { LocalStorageWorkoutRepository } from '../adapters/LocalStorageWorkoutRepository';
import { LocalStorageStore } from '../adapters/storage';
import type { KeyValueStorage } from '../adapters/storage';
import { SystemClock, UuidGenerator } from '../adapters/system';
import { DataTransferService } from '../application/DataTransferService';
import { ExerciseService } from '../application/ExerciseService';
import type { Clock, IdGenerator } from '../application/ports';
import { ProgressService } from '../application/ProgressService';
import { RoutineService } from '../application/RoutineService';
import { SettingsService } from '../application/SettingsService';
import { WorkoutService } from '../application/WorkoutService';
import type { Services } from './ServicesContext';

export type { Services } from './ServicesContext';

// trussel: T-D66YY49PVF@1
export function createServices(options: { storage?: KeyValueStorage; clock?: Clock; ids?: IdGenerator } = {}): Services {
  const store = new LocalStorageStore(options.storage);
  const workoutRepo = new LocalStorageWorkoutRepository(store);
  const routineRepo = new LocalStorageRoutineRepository(store);
  const exerciseRepo = new LocalStorageExerciseRepository(store);
  const settingsRepo = new LocalStorageSettingsRepository(store);
  const clock = options.clock ?? new SystemClock();
  const ids = options.ids ?? new UuidGenerator();
  return {
    workouts: new WorkoutService(workoutRepo, exerciseRepo, routineRepo, clock, ids),
    routines: new RoutineService(routineRepo, exerciseRepo, clock, ids),
    exercises: new ExerciseService(exerciseRepo, ids),
    progress: new ProgressService(workoutRepo, exerciseRepo),
    settings: new SettingsService(settingsRepo),
    dataTransfer: new DataTransferService(workoutRepo, routineRepo, exerciseRepo, settingsRepo, clock),
  };
}
