// trussel: T-4FP39ZW7Q4@1
import { ValidationError } from '../domain/model';
import type { Equipment, Exercise, MuscleGroup } from '../domain/model';
import { validateName } from '../domain/validation';
import type { ExerciseRepository, IdGenerator } from './ports';

// trussel: T-R58S4ZBRH0@1
export class ExerciseService {
  constructor(
    private readonly exercises: ExerciseRepository,
    private readonly ids: IdGenerator,
  ) {}

  // trussel: T-SZGVR2SGC9@1
  search(filter: { query?: string; muscleGroup?: MuscleGroup | 'all' } = {}): Exercise[] {
    const query = (filter.query ?? '').trim().toLowerCase();
    const group = filter.muscleGroup ?? 'all';
    return this.exercises
      .list()
      .filter((e) => (group === 'all' ? true : e.muscleGroup === group))
      .filter((e) => (query ? e.name.toLowerCase().includes(query) : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // trussel: T-TXHAK9REYR@1
  getExercise(exerciseId: string): Exercise | null {
    return this.exercises.get(exerciseId);
  }

  // trussel: T-TVNV40N2N7@1
  createCustom(input: { name: string; muscleGroup: MuscleGroup; equipment: Equipment }): Exercise {
    const error = validateName(input.name, 'exercise');
    if (error) throw new ValidationError(error, 'name');
    const name = input.name.trim();
    const clash = this.exercises.list().some((e) => e.name.trim().toLowerCase() === name.toLowerCase());
    if (clash) throw new ValidationError('You already have that one.', 'name');
    const exercise: Exercise = {
      id: this.ids.next(),
      name,
      muscleGroup: input.muscleGroup,
      equipment: input.equipment,
      isCustom: true,
    };
    this.exercises.saveCustom(exercise);
    return exercise;
  }
}
