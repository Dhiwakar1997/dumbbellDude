import { exercise, set, workout } from '../test/builders';
import { currentStreak, localDayKey, weekSummary } from './streak';

const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).toISOString();
const w = (iso: string, finished = true) => workout(iso, [exercise('bench', [set(50, 10)])], { finished });

describe('localDayKey', () => {
  it('formats local dates', () => {
    expect(localDayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});

describe('currentStreak', () => {
  const today = new Date(2026, 10, 1, 9);

  it('is 0 without workouts or when the last one was before yesterday', () => {
    expect(currentStreak([], today)).toBe(0);
    expect(currentStreak([w(at(2026, 10, 30))], today)).toBe(0);
  });

  it('counts consecutive days ending today or yesterday, once per day', () => {
    const list = [w(at(2026, 11, 1)), w(at(2026, 10, 31)), w(at(2026, 10, 31, 7)), w(at(2026, 10, 30))];
    expect(currentStreak(list, today)).toBe(3);
    expect(currentStreak([w(at(2026, 10, 31)), w(at(2026, 10, 30))], today)).toBe(2);
  });

  it('ignores active workouts', () => {
    expect(currentStreak([w(at(2026, 11, 1), false)], today)).toBe(0);
  });
});

describe('weekSummary', () => {
  it('counts finished workouts from Monday', () => {
    const now = new Date(2026, 10, 1, 12); // Sunday
    const list = [w(at(2026, 10, 26)), w(at(2026, 10, 29)), w(at(2026, 10, 25)), w(at(2026, 10, 30), false)];
    expect(weekSummary(list, now)).toEqual({ workouts: 2, volumeKg: 1000 });
    expect(weekSummary([], now)).toEqual({ workouts: 0, volumeKg: 0 });
  });
});
