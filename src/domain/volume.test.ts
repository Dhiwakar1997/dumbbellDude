import { exercise, set, workout } from '../test/builders';
import { countDoneSets, exerciseVolume, setVolume, workoutDurationMinutes, workoutVolume } from './volume';

describe('volume', () => {
  it('multiplies weight by reps and clamps bad input', () => {
    expect(setVolume(set(60, 8))).toBe(480);
    expect(setVolume(set(0, 12))).toBe(0);
    expect(setVolume({ id: 'x', weightKg: -10, reps: 5, done: true })).toBe(0);
    expect(setVolume({ id: 'x', weightKg: Number.NaN, reps: 5, done: true })).toBe(0);
  });

  it('counts only done sets', () => {
    const e = exercise('bench', [set(60, 8), set(62.5, 8), set(65, 7, false)]);
    expect(exerciseVolume(e)).toBe(980);
  });

  it('sums workout volume and handles empty workouts', () => {
    const w = workout('2026-10-29T12:35:00Z', [
      exercise('bench', [set(60, 8)]),
      exercise('ohp', [set(40, 8), set(0, 10)]),
    ]);
    expect(workoutVolume(w)).toBe(800);
    expect(workoutVolume(workout('2026-10-29T12:35:00Z', []))).toBe(0);
  });

  it('counts done vs total sets', () => {
    const w = workout('2026-10-29T12:35:00Z', [exercise('bench', [set(60, 8), set(60, 8, false)])]);
    expect(countDoneSets(w)).toEqual({ done: 1, total: 2 });
    expect(countDoneSets(workout('2026-10-29T12:35:00Z', []))).toEqual({ done: 0, total: 0 });
  });

  it('computes duration for finished and active workouts', () => {
    const finished = workout('2026-10-29T12:00:00Z', [], { minutes: 58 });
    expect(workoutDurationMinutes(finished, new Date())).toBe(58);
    const active = workout('2026-10-29T12:00:00Z', [], { finished: false });
    expect(workoutDurationMinutes(active, new Date('2026-10-29T12:42:18Z'))).toBe(42);
    expect(workoutDurationMinutes({ ...active, startedAt: 'nope' }, new Date())).toBe(0);
    expect(workoutDurationMinutes(active, new Date('2026-10-29T11:00:00Z'))).toBe(0);
  });
});
