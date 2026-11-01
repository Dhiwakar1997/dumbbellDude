// trussel: T-E24YQR6FMX@1
// Validation rules for user input. Each returns a user-facing message, or null when valid.
import type { RoutineExercise, SetEntry } from './model';

// trussel: T-3PGVK54KPC@1
export function validateSetEntry(set: Pick<SetEntry, 'weightKg' | 'reps'>): string | null {
  if (!Number.isInteger(set.reps) || set.reps < 1) return 'Reps must be at least 1. Nice try.';
  if (set.reps > 999) return "That's not a set, that's a lifestyle. Max 999 reps.";
  if (!Number.isFinite(set.weightKg) || set.weightKg < 0) return "Weight can't be negative.";
  if (set.weightKg > 1000) return 'Easy, Hercules. Max 1000 kg.';
  return null;
}

// trussel: T-7BTK5EH7S4@1
export function validateName(name: string, what: 'routine' | 'exercise'): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return what === 'routine' ? 'A routine needs a name. "Untitled" is not a vibe.' : 'Give it a name, Dude.';
  }
  if (trimmed.length > 60) return 'Keep it under 60 characters.';
  return null;
}

// trussel: T-1QP3QQVJGE@1
export function validateRoutineTargets(exercise: RoutineExercise): string | null {
  if (!Number.isInteger(exercise.targetSets) || exercise.targetSets < 1 || exercise.targetSets > 20) {
    return 'Sets must be 1–20.';
  }
  if (!Number.isInteger(exercise.targetReps) || exercise.targetReps < 1 || exercise.targetReps > 100) {
    return 'Reps must be 1–100.';
  }
  return null;
}
