// trussel: T-7KJVT27YYS@1
import type { Routine } from '../domain/model';
import type { RoutineRepository } from '../application/ports';
import { isRoutineArray } from './guards';
import { LocalStorageStore } from './storage';

const ROUTINES = 'routines';

// trussel: T-151H7JE8N7@1
export class LocalStorageRoutineRepository implements RoutineRepository {
  constructor(private readonly store: LocalStorageStore) {}

  private all(): Routine[] {
    return this.store.read<Routine[]>(ROUTINES, [], isRoutineArray);
  }

  list(): Routine[] {
    return this.all().sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }

  get(id: string): Routine | null {
    return this.all().find((r) => r.id === id) ?? null;
  }

  save(routine: Routine): void {
    this.store.write(ROUTINES, [...this.all().filter((r) => r.id !== routine.id), routine]);
  }

  remove(id: string): void {
    this.store.write(
      ROUTINES,
      this.all().filter((r) => r.id !== id),
    );
  }

  replaceAll(routines: Routine[]): void {
    this.store.write(ROUTINES, routines);
  }

  clear(): void {
    this.store.remove(ROUTINES);
  }
}
