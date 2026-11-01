// trussel: T-WH7R0WMPZY@1
import type { Exercise } from '../domain/model';
import type { ExerciseRepository } from '../application/ports';
import { isExerciseArray } from './guards';
import { seedExercises } from './seedExercises';
import { LocalStorageStore } from './storage';

const CUSTOM = 'customExercises';

// trussel: T-QFW2Q4HMKV@1
export class LocalStorageExerciseRepository implements ExerciseRepository {
  constructor(
    private readonly store: LocalStorageStore,
    private readonly seed: Exercise[] = seedExercises(),
  ) {}

  listCustom(): Exercise[] {
    return this.store.read<Exercise[]>(CUSTOM, [], isExerciseArray);
  }

  list(): Exercise[] {
    return [...this.seed, ...this.listCustom()].sort((a, b) => a.name.localeCompare(b.name));
  }

  get(id: string): Exercise | null {
    return this.seed.find((e) => e.id === id) ?? this.listCustom().find((e) => e.id === id) ?? null;
  }

  saveCustom(exercise: Exercise): void {
    if (!exercise.isCustom || this.seed.some((s) => s.id === exercise.id)) {
      throw new Error('Only custom exercises can be saved.');
    }
    this.store.write(CUSTOM, [...this.listCustom().filter((e) => e.id !== exercise.id), exercise]);
  }

  replaceCustom(exercises: Exercise[]): void {
    this.store.write(CUSTOM, exercises);
  }

  clear(): void {
    this.store.remove(CUSTOM);
  }
}
