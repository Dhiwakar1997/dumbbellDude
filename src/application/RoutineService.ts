// trussel: T-390N43Z0CP@1
import { ValidationError } from '../domain/model';
import type { Routine, RoutineExercise } from '../domain/model';
import { validateName, validateRoutineTargets } from '../domain/validation';
import type { Clock, ExerciseRepository, IdGenerator, RoutineRepository } from './ports';

export interface RoutineView {
  routine: Routine;
  exerciseNames: string[];
  totalSets: number;
}

export interface RoutineDraft {
  id?: string;
  name: string;
  exercises: RoutineExercise[];
}

// trussel: T-PMYF6RDQTS@1
export class RoutineService {
  constructor(
    private readonly routines: RoutineRepository,
    private readonly exercises: ExerciseRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  // trussel: T-P533N6ZQ18@1
  list(): RoutineView[] {
    return this.routines
      .list()
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
      .map((routine) => ({
        routine,
        exerciseNames: routine.exercises.map((e) => this.exercises.get(e.exerciseId)?.name ?? 'Unknown exercise'),
        totalSets: routine.exercises.reduce((sum, e) => sum + e.targetSets, 0),
      }));
  }

  // trussel: T-ZTFRRQDW60@1
  get(routineId: string): Routine | null {
    return this.routines.get(routineId);
  }

  // trussel: T-XT27BGKT3M@1
  save(draft: RoutineDraft): Routine {
    const nameError = validateName(draft.name, 'routine');
    if (nameError) throw new ValidationError(nameError, 'name');
    draft.exercises.forEach((e, i) => {
      const error = validateRoutineTargets(e);
      if (error) throw new ValidationError(error, `exercises.${i}`);
      if (!this.exercises.get(e.exerciseId)) throw new ValidationError('That exercise no longer exists.', `exercises.${i}`);
    });
    const now = this.clock.now().toISOString();
    const existing = draft.id ? this.routines.get(draft.id) : null;
    const routine: Routine = {
      id: existing?.id ?? draft.id ?? this.ids.next(),
      name: draft.name.trim(),
      exercises: draft.exercises.map((e) => ({ ...e })),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    this.routines.save(routine);
    return routine;
  }

  // trussel: T-HPEXAPWW41@1
  remove(routineId: string): void {
    this.routines.remove(routineId);
  }
}
