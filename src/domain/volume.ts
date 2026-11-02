// trussel: T-1V5TZEAQE7@1
// Volume, set counts and duration. Only done sets count towards volume; never returns NaN.
import type { SetEntry, Workout, WorkoutExercise } from './model';

function nonNeg(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// trussel: T-HR3PXA52C1@1
export function setVolume(set: SetEntry): number {
  return nonNeg(set.weightKg) * nonNeg(set.reps);
}

// trussel: T-3GMFXWNJ2S@1
export function exerciseVolume(exercise: WorkoutExercise): number {
  return exercise.sets.filter((s) => s.done).reduce((sum, s) => sum + setVolume(s), 0);
}

// trussel: T-KHVTMKD9EN@1
export function workoutVolume(workout: Workout): number {
  return workout.exercises.reduce((sum, e) => sum + exerciseVolume(e), 0);
}

// trussel: T-V1YEPJZA7Z@1
export function countDoneSets(workout: Workout): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const e of workout.exercises) {
    for (const s of e.sets) {
      total += 1;
      if (s.done) done += 1;
    }
  }
  return { done, total };
}

// trussel: T-YBSYRNQ29N@1
export function workoutDurationMinutes(workout: Workout, now: Date): number {
  const start = Date.parse(workout.startedAt);
  const end = workout.finishedAt ? Date.parse(workout.finishedAt) : now.getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(0, Math.round((end - start) / 60000));
}
