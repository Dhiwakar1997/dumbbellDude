import { ValidationError } from './model';
import { validateName, validateRoutineTargets, validateSetEntry } from './validation';

describe('validateSetEntry', () => {
  it('requires at least one rep', () => {
    expect(validateSetEntry({ weightKg: 62.5, reps: 0 })).toBe('Reps must be at least 1. Nice try.');
    expect(validateSetEntry({ weightKg: 62.5, reps: 1.5 })).toBe('Reps must be at least 1. Nice try.');
  });
  it('allows zero weight and rejects silly values', () => {
    expect(validateSetEntry({ weightKg: 0, reps: 12 })).toBeNull();
    expect(validateSetEntry({ weightKg: -1, reps: 5 })).toBe("Weight can't be negative.");
    expect(validateSetEntry({ weightKg: 1001, reps: 5 })).toMatch(/Hercules/);
    expect(validateSetEntry({ weightKg: 20, reps: 1000 })).toMatch(/999/);
  });
});

describe('validateName', () => {
  it('uses the design copy', () => {
    expect(validateName('  ', 'routine')).toBe('A routine needs a name. "Untitled" is not a vibe.');
    expect(validateName('', 'exercise')).toBe('Give it a name, Dude.');
    expect(validateName('x'.repeat(61), 'routine')).toBe('Keep it under 60 characters.');
    expect(validateName(' Push Day ', 'routine')).toBeNull();
  });
});

describe('validateRoutineTargets', () => {
  it('bounds sets and reps', () => {
    expect(validateRoutineTargets({ exerciseId: 'a', targetSets: 0, targetReps: 8 })).toBe('Sets must be 1–20.');
    expect(validateRoutineTargets({ exerciseId: 'a', targetSets: 4, targetReps: 101 })).toBe('Reps must be 1–100.');
    expect(validateRoutineTargets({ exerciseId: 'a', targetSets: 4, targetReps: 8 })).toBeNull();
  });
});

describe('ValidationError', () => {
  it('carries the field', () => {
    const e = new ValidationError('nope', 'reps');
    expect(e).toBeInstanceOf(Error);
    expect(e.name).toBe('ValidationError');
    expect(e.field).toBe('reps');
  });
});
