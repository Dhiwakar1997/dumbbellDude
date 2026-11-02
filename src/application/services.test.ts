import { ValidationError } from '../domain/model';
import { exercise, set, workout } from '../test/builders';
import { makeFakePorts } from '../test/fakes';
import { DataTransferService } from './DataTransferService';
import { ExerciseService } from './ExerciseService';
import { ProgressService } from './ProgressService';
import { RoutineService } from './RoutineService';
import { SettingsService } from './SettingsService';

describe('RoutineService', () => {
  const setup = () => {
    const p = makeFakePorts();
    return { ...p, service: new RoutineService(p.routines, p.exercises, p.clock, p.ids) };
  };

  it('validates name and targets with fields', () => {
    const { service } = setup();
    expect(() => service.save({ name: ' ', exercises: [] })).toThrow(
      expect.objectContaining({ field: 'name', message: 'A routine needs a name. "Untitled" is not a vibe.' }),
    );
    expect(() =>
      service.save({ name: 'Push', exercises: [{ exerciseId: 'seed-bench-press', targetSets: 0, targetReps: 8 }] }),
    ).toThrow(expect.objectContaining({ field: 'exercises.0' }));
    expect(() =>
      service.save({ name: 'Push', exercises: [{ exerciseId: 'nope', targetSets: 3, targetReps: 8 }] }),
    ).toThrow(ValidationError);
  });

  it('creates, updates keeping createdAt, lists with names and totals, removes', () => {
    const { service, clock } = setup();
    const created = service.save({
      name: '  Push Day ',
      exercises: [
        { exerciseId: 'seed-bench-press', targetSets: 4, targetReps: 8 },
        { exerciseId: 'seed-dips', targetSets: 3, targetReps: 12 },
      ],
    });
    expect(created.name).toBe('Push Day');
    clock.advanceMinutes(10);
    const updated = service.save({ id: created.id, name: 'Push Day', exercises: [] });
    expect(updated.createdAt).toBe(created.createdAt);
    expect(updated.updatedAt).not.toBe(created.updatedAt);
    service.save({ name: 'arms', exercises: [{ exerciseId: 'seed-dips', targetSets: 2, targetReps: 10 }] });
    const views = service.list();
    expect(views.map((v) => v.routine.name)).toEqual(['arms', 'Push Day']);
    expect(views[0]).toMatchObject({ exerciseNames: ['Dips'], totalSets: 2 });
    service.remove(created.id);
    expect(service.get(created.id)).toBeNull();
  });
});

describe('ExerciseService', () => {
  const setup = () => {
    const p = makeFakePorts();
    return { ...p, service: new ExerciseService(p.exercises, p.ids) };
  };

  it('searches by name and muscle group', () => {
    const { service } = setup();
    expect(service.search({ query: 'press' }).map((e) => e.name)).toEqual(['Bench Press', 'Overhead Press']);
    expect(service.search({ muscleGroup: 'chest' }).map((e) => e.name)).toEqual(['Bench Press', 'Dips']);
    expect(service.search({ query: '  zzz ' })).toEqual([]);
    expect(service.search().length).toBe(5);
    expect(service.getExercise('seed-dips')?.name).toBe('Dips');
  });

  it('creates custom exercises with validation', () => {
    const { service } = setup();
    expect(() => service.createCustom({ name: '', muscleGroup: 'chest', equipment: 'barbell' })).toThrow('Give it a name, Dude.');
    expect(() => service.createCustom({ name: ' bench press ', muscleGroup: 'chest', equipment: 'barbell' })).toThrow(
      'You already have that one.',
    );
    const e = service.createCustom({ name: ' Landmine Press ', muscleGroup: 'shoulders', equipment: 'barbell' });
    expect(e).toMatchObject({ name: 'Landmine Press', isCustom: true });
    expect(service.search({ query: 'landmine' })).toHaveLength(1);
  });
});

describe('ProgressService', () => {
  it('lists logged exercises most recent first and delegates series/records', () => {
    const p = makeFakePorts();
    p.workouts.save(workout('2026-10-01T10:00:00Z', [exercise('seed-bench-press', [set(80, 5)])]));
    p.workouts.save(workout('2026-10-08T10:00:00Z', [exercise('seed-back-squat', [set(100, 5)]), exercise('seed-bench-press', [set(85, 5)])]));
    p.workouts.save(workout('2026-10-09T10:00:00Z', [exercise('custom-gone', [set(10, 10)], 'Old Thing')]));
    p.workouts.save(workout('2026-10-10T10:00:00Z', [exercise('seed-deadlift', [set(100, 5, false)])]));
    const service = new ProgressService(p.workouts, p.exercises);
    expect(service.loggedExercises().map((x) => x.exercise.name)).toEqual(['Old Thing', 'Back Squat', 'Bench Press']);
    expect(service.seriesFor('seed-bench-press')).toHaveLength(2);
    expect(service.recordsFor('seed-bench-press')[0]).toMatchObject({ kind: 'heaviestWeight', value: 85 });
    expect(service.seriesFor('seed-dips')).toEqual([]);
  });
});

describe('SettingsService', () => {
  it('switches units without touching stored weights and bounds rest time', () => {
    const p = makeFakePorts();
    p.workouts.save(workout('2026-10-01T10:00:00Z', [exercise('seed-bench-press', [set(62.5, 5)])], { id: 'w' }));
    const service = new SettingsService(p.settings);
    expect(service.getSettings()).toEqual({ units: 'kg', defaultRestSeconds: 90 });
    expect(service.setUnits('lb').units).toBe('lb');
    expect(p.workouts.get('w')!.exercises[0]!.sets[0]!.weightKg).toBe(62.5);
    expect(service.setDefaultRest(120).defaultRestSeconds).toBe(120);
    expect(() => service.setDefaultRest(601)).toThrow('Rest between 0 and 10 minutes.');
    expect(() => service.setUnits('stone' as never)).toThrow(ValidationError);
  });
});

describe('DataTransferService', () => {
  const setup = () => {
    const p = makeFakePorts();
    return { ...p, service: new DataTransferService(p.workouts, p.routines, p.exercises, p.settings, p.clock) };
  };

  it('round-trips export → import', () => {
    const a = setup();
    a.settings.save({ units: 'lb', defaultRestSeconds: 120 });
    a.exercises.saveCustom({ id: 'c1', name: 'Landmine Press', muscleGroup: 'shoulders', equipment: 'barbell', isCustom: true });
    a.routines.save({ id: 'r1', name: 'Push', exercises: [{ exerciseId: 'c1', targetSets: 3, targetReps: 8 }], createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z' });
    a.workouts.save(workout('2026-10-01T10:00:00Z', [exercise('c1', [set(40, 8)])]));
    a.workouts.saveActive(workout('2026-11-01T10:00:00Z', [], { finished: false }));
    const { filename, json } = a.service.exportData();
    expect(filename).toBe('dumbbell-dude-2026-11-01.json');

    const b = setup();
    b.workouts.saveActive(workout('2026-11-01T09:00:00Z', [], { finished: false }));
    const preview = b.service.parseImport(json);
    expect(preview).toMatchObject({ workouts: 1, routines: 1, customExercises: 1 });
    expect(b.workouts.list()).toEqual([]); // parse writes nothing
    b.service.applyImport(preview);
    expect(b.settings.get().units).toBe('lb');
    expect(b.exercises.get('c1')?.name).toBe('Landmine Press');
    expect(b.routines.list()).toHaveLength(1);
    expect(b.workouts.list()).toHaveLength(1);
    expect(b.workouts.getActive()).toBeNull();
  });

  it('rejects bad files with friendly messages', () => {
    const { service } = setup();
    expect(() => service.parseImport('{not json')).toThrow("That file isn't JSON.");
    expect(() => service.parseImport('{"app":"other","schemaVersion":1}')).toThrow('Not a Dumbbell Dude backup.');
    expect(() => service.parseImport('{"app":"dumbbell-dude","schemaVersion":2}')).toThrow('Not a Dumbbell Dude backup.');
    const badSet = {
      app: 'dumbbell-dude',
      schemaVersion: 1,
      workouts: [{ ...workout('2026-10-01T10:00:00Z', [exercise('a', [{ id: 's', weightKg: -1, reps: 5, done: true }])]) }],
    };
    expect(() => service.parseImport(JSON.stringify(badSet))).toThrow('This backup is damaged. Nothing was imported.');
    const unfinished = { app: 'dumbbell-dude', schemaVersion: 1, workouts: [workout('2026-10-01T10:00:00Z', [], { finished: false })] };
    expect(() => service.parseImport(JSON.stringify(unfinished))).toThrow(ValidationError);
    expect(service.parseImport('{"app":"dumbbell-dude","schemaVersion":1}')).toMatchObject({ workouts: 0, routines: 0 });
  });

  it('resets everything except the seed', () => {
    const { service, workouts, exercises, routines, settings } = setup();
    workouts.save(workout('2026-10-01T10:00:00Z', []));
    exercises.saveCustom({ id: 'c1', name: 'X', muscleGroup: 'core', equipment: 'other', isCustom: true });
    settings.save({ units: 'lb', defaultRestSeconds: 30 });
    service.resetAll();
    expect(workouts.list()).toEqual([]);
    expect(routines.list()).toEqual([]);
    expect(exercises.listCustom()).toEqual([]);
    expect(exercises.list().length).toBe(5);
    expect(settings.get()).toEqual({ units: 'kg', defaultRestSeconds: 90 });
  });
});
