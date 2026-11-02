import { exercise, set, workout } from '../test/builders';
import { bestSetSeries, estimateOneRepMax, findPersonalRecordSetIds, personalRecords } from './records';

describe('estimateOneRepMax', () => {
  it('uses Epley and handles edge cases', () => {
    expect(estimateOneRepMax(100, 1)).toBe(100);
    expect(estimateOneRepMax(80, 5)).toBe(93.3);
    expect(estimateOneRepMax(0, 10)).toBe(0);
    expect(estimateOneRepMax(80, 0)).toBe(0);
  });
});

describe('personalRecords', () => {
  const w1 = workout('2026-10-01T10:00:00Z', [exercise('bench', [set(80, 5), set(60, 15)])], { id: 'w1' });
  const w2 = workout('2026-10-08T10:00:00Z', [exercise('bench', [set(85, 5), set(80, 5)])], { id: 'w2' });
  const active = workout('2026-10-09T10:00:00Z', [exercise('bench', [set(200, 1)])], { finished: false });

  it('returns the best of each kind, ignoring active workouts', () => {
    const records = personalRecords('bench', [w2, w1, active]);
    const byKind = Object.fromEntries(records.map((r) => [r.kind, r]));
    expect(byKind.heaviestWeight?.value).toBe(85);
    expect(byKind.heaviestWeight?.workoutId).toBe('w2');
    expect(byKind.bestOneRepMax?.value).toBe(99.2);
    expect(byKind.mostReps?.value).toBe(15);
    expect(byKind.bestSetVolume?.value).toBe(900);
  });

  it('keeps the earliest on ties and returns [] without history', () => {
    const tie = workout('2026-10-15T10:00:00Z', [exercise('bench', [set(85, 5)])]);
    const heaviest = personalRecords('bench', [w1, w2, tie]).find((r) => r.kind === 'heaviestWeight');
    expect(heaviest?.workoutId).toBe('w2');
    expect(personalRecords('squat', [w1])).toEqual([]);
  });

  it('skips zero-weight sets for heaviest weight but counts their reps', () => {
    const bw = workout('2026-10-01T10:00:00Z', [exercise('dips', [set(0, 12)])]);
    const records = personalRecords('dips', [bw]);
    expect(records.map((r) => r.kind)).toEqual(['mostReps']);
  });
});

describe('findPersonalRecordSetIds', () => {
  it('marks only the best set the first time a lift is logged', () => {
    const a = set(60, 8);
    const b = set(65, 7);
    const w = workout('2026-10-01T10:00:00Z', [exercise('bench', [a, b])]);
    expect(Array.from(findPersonalRecordSetIds(w, [w]))).toEqual([b.id]);
  });

  it('marks sets that beat earlier history and earlier sets', () => {
    const old = workout('2026-10-01T10:00:00Z', [exercise('bench', [set(80, 5)])]);
    const s1 = set(80, 5);
    const s2 = set(82.5, 5);
    const s3 = set(82.5, 5);
    const undone = set(200, 1, false);
    const now = workout('2026-10-08T10:00:00Z', [exercise('bench', [s1, s2, s3, undone])]);
    const ids = findPersonalRecordSetIds(now, [old, now]);
    expect(ids.has(s1.id)).toBe(false);
    expect(ids.has(s2.id)).toBe(true);
    expect(ids.has(s3.id)).toBe(false);
    expect(ids.has(undone.id)).toBe(false);
  });

  it('ignores later workouts when judging an older one', () => {
    const s = set(80, 5);
    const older = workout('2026-10-01T10:00:00Z', [exercise('bench', [s])]);
    const newer = workout('2026-10-08T10:00:00Z', [exercise('bench', [set(100, 5)])]);
    expect(findPersonalRecordSetIds(older, [older, newer]).has(s.id)).toBe(true);
  });
});

describe('bestSetSeries', () => {
  it('returns one best point per finished workout, oldest first', () => {
    const w1 = workout('2026-10-08T10:00:00Z', [exercise('bench', [set(80, 5), set(70, 10)])], { id: 'b' });
    const w0 = workout('2026-10-01T10:00:00Z', [exercise('bench', [set(75, 5)])], { id: 'a' });
    const other = workout('2026-10-05T10:00:00Z', [exercise('squat', [set(100, 5)])]);
    const series = bestSetSeries('bench', [w1, other, w0]);
    expect(series.map((p) => p.workoutId)).toEqual(['a', 'b']);
    expect(series[1]?.oneRepMaxKg).toBe(93.3);
  });
});
