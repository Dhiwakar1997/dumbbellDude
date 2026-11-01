// trussel: T-W6XY30YQZK@1
// Personal-record detection and best-set history. Only done sets of finished workouts count.
// A record must be strictly better than the previous one (ties keep the earliest).
import type { PersonalRecord, PRKind, SetEntry, Workout } from './model';
import { setVolume } from './volume';

export interface BestSetPoint {
  date: string;
  workoutId: string;
  oneRepMaxKg: number;
  weightKg: number;
  reps: number;
}

interface DoneSet {
  set: SetEntry;
  workout: Workout;
}

function chronological(workouts: Workout[]): Workout[] {
  return workouts
    .filter((w) => Boolean(w.finishedAt))
    .slice()
    .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
}

function doneSetsFor(exerciseId: string, workout: Workout): SetEntry[] {
  return workout.exercises
    .filter((e) => e.exerciseId === exerciseId)
    .flatMap((e) => e.sets.filter((s) => s.done));
}

// trussel: T-89YXE4QAVF@1
export function estimateOneRepMax(weightKg: number, reps: number): number {
  if (!(weightKg > 0) || !(reps > 0)) return 0;
  const value = reps === 1 ? weightKg : weightKg * (1 + reps / 30);
  return Math.round(value * 10) / 10;
}

const KIND_ORDER: PRKind[] = ['heaviestWeight', 'bestOneRepMax', 'mostReps', 'bestSetVolume'];

function metric(kind: PRKind, set: SetEntry): number {
  switch (kind) {
    case 'heaviestWeight':
      return set.weightKg > 0 ? set.weightKg : 0;
    case 'bestOneRepMax':
      return estimateOneRepMax(set.weightKg, set.reps);
    case 'mostReps':
      return set.reps > 0 ? set.reps : 0;
    case 'bestSetVolume':
      return setVolume(set);
  }
}

// trussel: T-5ZMHXM46FK@1
export function personalRecords(exerciseId: string, workouts: Workout[]): PersonalRecord[] {
  const sets: DoneSet[] = chronological(workouts).flatMap((workout) =>
    doneSetsFor(exerciseId, workout).map((set) => ({ set, workout })),
  );
  const records: PersonalRecord[] = [];
  for (const kind of KIND_ORDER) {
    let best: DoneSet | null = null;
    let bestValue = 0;
    for (const entry of sets) {
      const value = metric(kind, entry.set);
      if (value > bestValue) {
        best = entry;
        bestValue = value;
      }
    }
    if (best) {
      records.push({
        exerciseId,
        kind,
        value: bestValue,
        weightKg: best.set.weightKg,
        reps: best.set.reps,
        workoutId: best.workout.id,
        setId: best.set.id,
        achievedAt: best.set.completedAt ?? best.workout.startedAt,
      });
    }
  }
  return records;
}

// trussel: T-JN94BZS6DV@1
export function findPersonalRecordSetIds(workout: Workout, allWorkouts: Workout[]): Set<string> {
  const result = new Set<string>();
  const start = Date.parse(workout.startedAt);
  const earlier = chronological(allWorkouts).filter(
    (w) => w.id !== workout.id && Date.parse(w.startedAt) < start,
  );
  const exerciseIds = Array.from(new Set(workout.exercises.map((e) => e.exerciseId)));

  for (const exerciseId of exerciseIds) {
    const history = earlier.flatMap((w) => doneSetsFor(exerciseId, w));
    const current = doneSetsFor(exerciseId, workout);
    if (current.length === 0) continue;

    if (history.length === 0) {
      // First time this lift is logged: only the single best set earns the badge.
      let best: SetEntry | null = null;
      for (const s of current) {
        const score = estimateOneRepMax(s.weightKg, s.reps) || s.reps;
        const bestScore = best ? estimateOneRepMax(best.weightKg, best.reps) || best.reps : 0;
        if (score > bestScore) best = s;
      }
      if (best) result.add(best.id);
      continue;
    }

    let maxWeight = Math.max(0, ...history.map((s) => metric('heaviestWeight', s)));
    let maxE1rm = Math.max(0, ...history.map((s) => metric('bestOneRepMax', s)));
    let maxReps = Math.max(0, ...history.map((s) => metric('mostReps', s)));
    for (const s of current) {
      const w = metric('heaviestWeight', s);
      const e = metric('bestOneRepMax', s);
      const r = metric('mostReps', s);
      if (w > maxWeight || e > maxE1rm || r > maxReps) result.add(s.id);
      maxWeight = Math.max(maxWeight, w);
      maxE1rm = Math.max(maxE1rm, e);
      maxReps = Math.max(maxReps, r);
    }
  }
  return result;
}

// trussel: T-JM1HCD8NST@1
export function bestSetSeries(exerciseId: string, workouts: Workout[]): BestSetPoint[] {
  const points: BestSetPoint[] = [];
  for (const workout of chronological(workouts)) {
    let best: SetEntry | null = null;
    let bestValue = 0;
    for (const s of doneSetsFor(exerciseId, workout)) {
      const value = estimateOneRepMax(s.weightKg, s.reps);
      if (value > bestValue) {
        best = s;
        bestValue = value;
      }
    }
    if (best) {
      points.push({
        date: workout.startedAt,
        workoutId: workout.id,
        oneRepMaxKg: bestValue,
        weightKg: best.weightKg,
        reps: best.reps,
      });
    }
  }
  return points;
}
