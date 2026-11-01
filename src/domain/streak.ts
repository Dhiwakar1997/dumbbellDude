// trussel: T-GDCE0YVFSZ@1
// Training streak and this-week summary. Pure: the current date is passed in. Local calendar days, Monday weeks.
import type { Workout } from './model';
import { workoutVolume } from './volume';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

// trussel: T-W54919TP9S@1
export function localDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

// trussel: T-SMH9K7PTMK@1
export function currentStreak(workouts: Workout[], today: Date): number {
  const days = new Set(
    workouts
      .filter((w) => Boolean(w.finishedAt))
      .map((w) => new Date(w.startedAt))
      .filter((d) => !Number.isNaN(d.getTime()))
      .map(localDayKey),
  );
  let cursor = days.has(localDayKey(today)) ? today : addDays(today, -1);
  if (!days.has(localDayKey(cursor))) return 0;
  let count = 0;
  while (days.has(localDayKey(cursor))) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - offset);
  return d;
}

// trussel: T-3Q6GMV65P7@1
export function weekSummary(workouts: Workout[], now: Date): { workouts: number; volumeKg: number } {
  const start = startOfWeek(now).getTime();
  const end = addDays(startOfWeek(now), 7).getTime();
  const inWeek = workouts.filter((w) => {
    if (!w.finishedAt) return false;
    const t = Date.parse(w.startedAt);
    return t >= start && t < end;
  });
  return { workouts: inWeek.length, volumeKg: inWeek.reduce((sum, w) => sum + workoutVolume(w), 0) };
}
