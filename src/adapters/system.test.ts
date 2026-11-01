import { seedExercises } from './seedExercises';
import { SystemClock, UuidGenerator } from './system';

describe('system adapters', () => {
  it('SystemClock returns the current time', () => {
    const before = Date.now();
    const t = new SystemClock().now().getTime();
    expect(t).toBeGreaterThanOrEqual(before);
  });

  it('UuidGenerator returns unique v4 ids, with a fallback', () => {
    const ids = new UuidGenerator();
    const a = ids.next();
    expect(a).toMatch(/^[0-9a-f-]{36}$/);
    expect(ids.next()).not.toBe(a);
    const original = globalThis.crypto;
    vi.stubGlobal('crypto', undefined);
    expect(new UuidGenerator().next()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    vi.stubGlobal('crypto', original);
  });
});

describe('seedExercises', () => {
  it('has ~40 exercises with stable unique ids across all muscle groups', () => {
    const seed = seedExercises();
    expect(seed.length).toBeGreaterThanOrEqual(40);
    expect(new Set(seed.map((e) => e.id)).size).toBe(seed.length);
    expect(seed.find((e) => e.name === 'Bench Press')?.id).toBe('seed-bench-press');
    expect(new Set(seed.map((e) => e.muscleGroup))).toEqual(new Set(['chest', 'back', 'legs', 'shoulders', 'arms', 'core']));
    expect(seed.every((e) => !e.isCustom)).toBe(true);
    expect(seedExercises()).not.toBe(seed);
  });
});
