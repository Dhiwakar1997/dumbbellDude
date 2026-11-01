// One contract suite per port, run against both the in-memory fake and the LocalStorage adapter.
import type { ExerciseRepository, RoutineRepository, SettingsRepository, WorkoutRepository } from '../application/ports';
import type { Routine } from '../domain/model';
import { exercise, set, workout } from '../test/builders';
import {
  InMemoryExerciseRepository,
  InMemoryRoutineRepository,
  InMemorySettingsRepository,
  InMemoryWorkoutRepository,
  TEST_SEED,
} from '../test/fakes';
import { LocalStorageExerciseRepository } from './LocalStorageExerciseRepository';
import { LocalStorageRoutineRepository } from './LocalStorageRoutineRepository';
import { LocalStorageSettingsRepository } from './LocalStorageSettingsRepository';
import { LocalStorageWorkoutRepository } from './LocalStorageWorkoutRepository';
import { LocalStorageStore, MemoryStorage } from './storage';

const store = () => new LocalStorageStore(new MemoryStorage());

const workoutImpls: [string, () => WorkoutRepository][] = [
  ['InMemoryWorkoutRepository', () => new InMemoryWorkoutRepository()],
  ['LocalStorageWorkoutRepository', () => new LocalStorageWorkoutRepository(store())],
];

describe.each(workoutImpls)('WorkoutRepository contract: %s', (_name, make) => {
  it('lists finished workouts newest first, upserts by id, gets by id', () => {
    const repo = make();
    expect(repo.list()).toEqual([]);
    const a = workout('2026-10-01T10:00:00Z', [exercise('bench', [set(60, 8)])], { id: 'a' });
    const b = workout('2026-10-08T10:00:00Z', [], { id: 'b' });
    repo.save(a);
    repo.save(b);
    expect(repo.list().map((w) => w.id)).toEqual(['b', 'a']);
    repo.save({ ...a, name: 'Renamed' });
    expect(repo.list()).toHaveLength(2);
    expect(repo.get('a')?.name).toBe('Renamed');
    expect(repo.get('zzz')).toBeNull();
  });

  it('stores one active workout separately', () => {
    const repo = make();
    expect(repo.getActive()).toBeNull();
    const active = workout('2026-11-01T10:00:00Z', [], { finished: false, id: 'act' });
    repo.saveActive(active);
    expect(repo.getActive()?.id).toBe('act');
    expect(repo.list()).toEqual([]);
    repo.clearActive();
    expect(repo.getActive()).toBeNull();
  });

  it('replaces all and clears (including active)', () => {
    const repo = make();
    repo.save(workout('2026-10-01T10:00:00Z', [], { id: 'old' }));
    repo.replaceAll([workout('2026-10-02T10:00:00Z', [], { id: 'new' })]);
    expect(repo.list().map((w) => w.id)).toEqual(['new']);
    repo.saveActive(workout('2026-11-01T10:00:00Z', [], { finished: false }));
    repo.clear();
    expect(repo.list()).toEqual([]);
    expect(repo.getActive()).toBeNull();
  });

  it('returns copies that callers cannot mutate', () => {
    const repo = make();
    repo.save(workout('2026-10-01T10:00:00Z', [], { id: 'a', name: 'A' }));
    const got = repo.get('a')!;
    got.name = 'mutated';
    expect(repo.get('a')!.name).toBe('A');
  });
});

const routine = (id: string, name: string): Routine => ({
  id,
  name,
  exercises: [{ exerciseId: 'seed-bench-press', targetSets: 3, targetReps: 8 }],
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
});

const routineImpls: [string, () => RoutineRepository][] = [
  ['InMemoryRoutineRepository', () => new InMemoryRoutineRepository()],
  ['LocalStorageRoutineRepository', () => new LocalStorageRoutineRepository(store())],
];

describe.each(routineImpls)('RoutineRepository contract: %s', (_name, make) => {
  it('saves, sorts by name, removes, replaces and clears', () => {
    const repo = make();
    repo.save(routine('1', 'push'));
    repo.save(routine('2', 'Legs'));
    expect(repo.list().map((r) => r.name)).toEqual(['Legs', 'push']);
    repo.save({ ...routine('1', 'Push Day') });
    expect(repo.get('1')?.name).toBe('Push Day');
    repo.remove('1');
    repo.remove('missing');
    expect(repo.list().map((r) => r.id)).toEqual(['2']);
    repo.replaceAll([routine('3', 'Pull')]);
    expect(repo.list().map((r) => r.id)).toEqual(['3']);
    repo.clear();
    expect(repo.list()).toEqual([]);
  });
});

const exerciseImpls: [string, () => ExerciseRepository][] = [
  ['InMemoryExerciseRepository', () => new InMemoryExerciseRepository(TEST_SEED)],
  ['LocalStorageExerciseRepository', () => new LocalStorageExerciseRepository(store(), TEST_SEED)],
];

describe.each(exerciseImpls)('ExerciseRepository contract: %s', (_name, make) => {
  const custom = { id: 'c1', name: 'Arnold Press X', muscleGroup: 'shoulders' as const, equipment: 'dumbbell' as const, isCustom: true };

  it('merges seed and custom, sorted by name', () => {
    const repo = make();
    expect(repo.list()).toHaveLength(TEST_SEED.length);
    repo.saveCustom(custom);
    expect(repo.list().map((e) => e.name)[0]).toBe('Arnold Press X');
    expect(repo.get('c1')?.isCustom).toBe(true);
    expect(repo.get('seed-dips')?.name).toBe('Dips');
    expect(repo.listCustom()).toHaveLength(1);
  });

  it('refuses to save seed or non-custom exercises', () => {
    const repo = make();
    expect(() => repo.saveCustom({ ...custom, isCustom: false })).toThrow();
    expect(() => repo.saveCustom({ ...TEST_SEED[0]!, isCustom: true })).toThrow();
  });

  it('replaces and clears custom only', () => {
    const repo = make();
    repo.saveCustom(custom);
    repo.replaceCustom([{ ...custom, id: 'c2', name: 'Zercher Squat' }]);
    expect(repo.listCustom().map((e) => e.id)).toEqual(['c2']);
    repo.clear();
    expect(repo.listCustom()).toEqual([]);
    expect(repo.list()).toHaveLength(TEST_SEED.length);
  });
});

const settingsImpls: [string, () => SettingsRepository][] = [
  ['InMemorySettingsRepository', () => new InMemorySettingsRepository()],
  ['LocalStorageSettingsRepository', () => new LocalStorageSettingsRepository(store())],
];

describe.each(settingsImpls)('SettingsRepository contract: %s', (_name, make) => {
  it('defaults, saves and clears', () => {
    const repo = make();
    expect(repo.get()).toEqual({ units: 'kg', defaultRestSeconds: 90 });
    repo.save({ units: 'lb', defaultRestSeconds: 120 });
    expect(repo.get()).toEqual({ units: 'lb', defaultRestSeconds: 120 });
    repo.clear();
    expect(repo.get()).toEqual({ units: 'kg', defaultRestSeconds: 90 });
  });
});

describe('LocalStorage specifics', () => {
  it('uses versioned keys and a schema envelope', () => {
    const storage = new MemoryStorage();
    const repo = new LocalStorageSettingsRepository(new LocalStorageStore(storage));
    repo.save({ units: 'lb', defaultRestSeconds: 60 });
    const raw = storage.getItem('dumbbelldude:v1:settings');
    expect(JSON.parse(raw!)).toEqual({ schemaVersion: 1, data: { units: 'lb', defaultRestSeconds: 60 } });
  });

  it('survives corrupt JSON, wrong schema and wrong shapes without throwing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = new MemoryStorage();
    const s = new LocalStorageStore(storage);
    storage.setItem('dumbbelldude:v1:workouts', '{oops');
    storage.setItem('dumbbelldude:v1:routines', JSON.stringify({ schemaVersion: 99, data: [] }));
    storage.setItem('dumbbelldude:v1:customExercises', JSON.stringify({ schemaVersion: 1, data: 'nope' }));
    storage.setItem('dumbbelldude:v1:settings', JSON.stringify({ schemaVersion: 1, data: { units: 'stone', defaultRestSeconds: 9999 } }));
    expect(new LocalStorageWorkoutRepository(s).list()).toEqual([]);
    expect(new LocalStorageRoutineRepository(s).list()).toEqual([]);
    expect(new LocalStorageExerciseRepository(s, TEST_SEED).listCustom()).toEqual([]);
    expect(new LocalStorageSettingsRepository(s).get()).toEqual({ units: 'kg', defaultRestSeconds: 90 });
    expect(storage.getItem('dumbbelldude:v1:workouts')).toBe('{oops'); // left in place
    warn.mockRestore();
  });

  it('turns quota errors into a friendly message', () => {
    const storage = new MemoryStorage();
    storage.setItem = () => {
      throw new DOMException('full', 'QuotaExceededError');
    };
    expect(() => new LocalStorageStore(storage).write('x', 1)).toThrow('Storage is full.');
  });
});
