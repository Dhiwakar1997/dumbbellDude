import { ValidationError } from '../domain/model';
import { makeFakePorts } from '../test/fakes';
import { WorkoutService } from './WorkoutService';

function setup() {
  const p = makeFakePorts();
  const service = new WorkoutService(p.workouts, p.exercises, p.routines, p.clock, p.ids);
  return { ...p, service };
}

describe('WorkoutService', () => {
  it('starts an empty workout and refuses a second active one', () => {
    const { service } = setup();
    const w = service.startEmpty();
    expect(w.exercises).toEqual([]);
    expect(service.getActive()?.id).toBe(w.id);
    expect(() => service.startEmpty()).toThrow(ValidationError);
  });

  it('starts from a routine using last weights and target reps', () => {
    const { service, routines } = setup();
    routines.save({
      id: 'r1',
      name: 'Push Day',
      exercises: [
        { exerciseId: 'seed-bench-press', targetSets: 3, targetReps: 8 },
        { exerciseId: 'gone', targetSets: 2, targetReps: 5 },
      ],
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-01T00:00:00Z',
    });
    // history: bench 60 then 62.5
    service.startEmpty();
    let w = service.addExercises(['seed-bench-press']);
    const block = w.exercises[0]!;
    w = service.updateSet(block.id, block.sets[0]!.id, { weightKg: 60, reps: 8 });
    w = service.addSet(block.id);
    w = service.updateSet(block.id, w.exercises[0]!.sets[1]!.id, { weightKg: 62.5 });
    for (const s of w.exercises[0]!.sets) service.toggleSetDone(block.id, s.id);
    service.finish();

    const started = service.startFromRoutine('r1');
    expect(started.name).toBe('Push Day');
    expect(started.routineId).toBe('r1');
    expect(started.exercises).toHaveLength(1);
    expect(started.exercises[0]!.sets.map((s) => [s.weightKg, s.reps, s.done])).toEqual([
      [60, 8, false],
      [62.5, 8, false],
      [62.5, 8, false],
    ]);
    expect(() => service.startFromRoutine('nope')).toThrow(ValidationError);
  });

  it('rejects ticking an invalid set and does not save it', () => {
    const { service } = setup();
    service.startEmpty();
    const w = service.addExercises(['seed-bench-press']);
    const block = w.exercises[0]!;
    const setId = block.sets[0]!.id;
    try {
      service.toggleSetDone(block.id, setId);
      throw new Error('expected throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      expect((e as ValidationError).field).toBe('reps');
      expect((e as ValidationError).message).toBe('Reps must be at least 1. Nice try.');
    }
    expect(service.getActive()!.exercises[0]!.sets[0]!.done).toBe(false);
  });

  it('ticks, unticks, and un-ticks automatically when an edit makes the set invalid', () => {
    const { service } = setup();
    service.startEmpty();
    const block = service.addExercises(['seed-dips']).exercises[0]!;
    const setId = block.sets[0]!.id;
    service.updateSet(block.id, setId, { reps: 12 }); // 0 kg bodyweight is fine
    const ticked = service.toggleSetDone(block.id, setId);
    expect(ticked.nowDone).toBe(true);
    expect(ticked.workout.exercises[0]!.sets[0]!.completedAt).toBeDefined();
    const unticked = service.toggleSetDone(block.id, setId);
    expect(unticked.nowDone).toBe(false);
    expect(unticked.workout.exercises[0]!.sets[0]!.completedAt).toBeUndefined();
    service.toggleSetDone(block.id, setId);
    const edited = service.updateSet(block.id, setId, { reps: 0 });
    expect(edited.exercises[0]!.sets[0]!.done).toBe(false);
  });

  it('clamps bad numbers on update', () => {
    const { service } = setup();
    service.startEmpty();
    const block = service.addExercises(['seed-bench-press']).exercises[0]!;
    const w = service.updateSet(block.id, block.sets[0]!.id, { weightKg: -5, reps: 7.8 });
    expect(w.exercises[0]!.sets[0]).toMatchObject({ weightKg: 0, reps: 7 });
  });

  it('finishes: drops undone sets/empty exercises and refuses with no done sets', () => {
    const { service, clock, workouts } = setup();
    service.startEmpty();
    expect(() => service.finish()).toThrow('Tick at least one set, or discard it.');
    let w = service.addExercises(['seed-bench-press', 'seed-back-squat', 'unknown']);
    expect(w.exercises).toHaveLength(2);
    const bench = w.exercises[0]!;
    w = service.updateSet(bench.id, bench.sets[0]!.id, { weightKg: 80, reps: 5 });
    w = service.addSet(bench.id);
    service.toggleSetDone(bench.id, bench.sets[0]!.id);
    clock.advanceMinutes(52);
    const finished = service.finish();
    expect(finished.finishedAt).toBe(clock.now().toISOString());
    expect(finished.exercises).toHaveLength(1);
    expect(finished.exercises[0]!.sets).toHaveLength(1);
    expect(workouts.getActive()).toBeNull();
    expect(service.listHistory()[0]).toMatchObject({ volumeKg: 400, doneSets: 1, durationMinutes: 52, prCount: 1 });
  });

  it('discards the active workout without touching history', () => {
    const { service } = setup();
    service.startEmpty();
    service.discard();
    expect(service.getActive()).toBeNull();
    expect(service.listHistory()).toEqual([]);
    expect(() => service.addSet('x')).toThrow('No workout in progress.');
  });

  it('summarises home and detail and finds previous sets', () => {
    const { service, clock } = setup();
    expect(service.homeSummary()).toEqual({ streakDays: 0, week: { workouts: 0, volumeKg: 0 }, lastWorkout: null, hasActive: false });
    service.startEmpty();
    const block = service.addExercises(['seed-bench-press']).exercises[0]!;
    service.updateSet(block.id, block.sets[0]!.id, { weightKg: 60, reps: 8 });
    service.toggleSetDone(block.id, block.sets[0]!.id);
    const finished = service.finish();
    clock.advanceMinutes(5);
    const home = service.homeSummary();
    expect(home.streakDays).toBe(1);
    expect(home.week.workouts).toBe(1);
    expect(home.week.volumeKg).toBe(480);
    expect(home.lastWorkout?.workout.id).toBe(finished.id);
    expect(service.previousSets('seed-bench-press').map((s) => s.reps)).toEqual([8]);
    expect(service.previousSets('seed-deadlift')).toEqual([]);
    const detail = service.getWorkoutDetail(finished.id);
    expect(detail?.prSetIds.size).toBe(1);
    expect(service.getWorkoutDetail('missing')).toBeNull();
  });
});
