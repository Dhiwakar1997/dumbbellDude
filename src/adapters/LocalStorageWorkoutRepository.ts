// trussel: T-30V5HB73GS@1
import type { Workout } from '../domain/model';
import type { WorkoutRepository } from '../application/ports';
import { isWorkoutArray, isWorkoutOrNull } from './guards';
import { LocalStorageStore } from './storage';

const WORKOUTS = 'workouts';
const ACTIVE = 'activeWorkout';

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
