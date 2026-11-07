// trussel: T-2031468DDQ@1
import { useSearchParams } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import type { PersonalRecord, PRKind, Units } from '../../domain/model';
import { formatWeight, toDisplayWeight } from '../../domain/units';
import { AppHeader } from '../components/AppHeader';
import { EmptyState } from '../components/EmptyState';
import { LineChart } from '../components/LineChart';
import { PRRow } from '../components/PRRow';
import { SectionTitle } from '../components/SectionTitle';
import { TextField } from '../components/TextField';
import { formatShortDate } from '../format';

const PR_LABELS: Record<PRKind, string> = {
  heaviestWeight: 'Heaviest weight',
  bestOneRepMax: 'Best est. 1RM',
  mostReps: 'Most reps',
  bestSetVolume: 'Best set volume',
};

function prValue(r: PersonalRecord, units: Units): string {
  const w = r.weightKg > 0 ? `${toDisplayWeight(r.weightKg, units)} ${units}` : 'BW';
  switch (r.kind) {
    case 'heaviestWeight':
    case 'mostReps':
      return `${w} × ${r.reps}`;
    default:
      return formatWeight(r.value, units);
  }
}

function axisLabel(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-GB', { month: 'short' })} ${d.getDate()}`;
}

function deltaText(first: { date: string; value: number }, last: { date: string; value: number }, units: Units): string {
  const diff = Math.round((last.value - first.value) * 10) / 10;
  const days = Math.max(0, Math.round((Date.parse(last.date) - Date.parse(first.date)) / 86_400_000));
  const span = days >= 14 ? `${Math.round(days / 7)} weeks` : `${days} day${days === 1 ? '' : 's'}`;
  return `${diff >= 0 ? '+' : '−'}${Math.abs(diff)} ${units} in ${span}`;
}

// Implements S-XJ9Y32E8SM Progress (state "No data yet").
// trussel: T-NZQ3A6N3T9@1
export function ProgressScreen(): JSX.Element {
  const { progress, settings, exercises } = useServices();
  const [params, setParams] = useSearchParams();
  const units = settings.getSettings().units;
  const logged = progress.loggedExercises();
  const wanted = params.get('exercise');
  // An exercise asked for by link (e.g. from the Library) stays selected even before it has been logged.
  const requested = wanted ? exercises.getExercise(wanted) : null;
  const selected = logged.find((l) => l.exercise.id === wanted)?.exercise ?? requested ?? logged[0]?.exercise ?? null;

  if (!selected) {
    return (
      <div className="screen">
        <AppHeader eyebrow="Progress" title="Getting stronger" />
        <EmptyState title="No lifts logged yet." body="Progress needs something to progress from." />
      </div>
    );
  }

  const options = logged.map((l) => ({ value: l.exercise.id, label: l.exercise.name }));
  const exercisePicker = (
    <TextField
      label="Exercise"
      as="select"
      value={selected.id}
      options={options.some((o) => o.value === selected.id) ? options : [{ value: selected.id, label: selected.name }, ...options]}
      onChange={(v) => setParams({ exercise: v }, { replace: true })}
    />
  );

  if (!logged.some((l) => l.exercise.id === selected.id)) {
    return (
      <div className="screen">
        <AppHeader eyebrow="Progress" title="Getting stronger" />
        {exercisePicker}
        <EmptyState title={`No ${selected.name} logged yet.`} body="Tick a set of it in a workout and its progress starts here." />
      </div>
    );
  }

  const series = progress.seriesFor(selected.id).map((p) => ({ date: p.date, value: toDisplayWeight(p.oneRepMaxKg, units) }));
  // The design (S-XJ9Y32E8SM) lists three PR kinds; best set volume is kept in the domain but not shown here.
  const records = progress.recordsFor(selected.id).filter((r) => r.kind !== 'bestSetVolume');
  const first = series[0];
  const last = series[series.length - 1];

  return (
    <div className="screen">
      <AppHeader eyebrow="Progress" title="Getting stronger" />
      {exercisePicker}
      <LineChart
        title="Best set (est. 1RM)"
        unit={units}
        points={series.map((p) => ({ label: axisLabel(p.date), value: p.value }))}
        delta={first && last && series.length > 1 ? deltaText(first, last, units) : undefined}
        emptyText="Log this lift twice to see a trend line."
      />
      <SectionTitle title="Personal records" />
      <ul className="list">
        {records.map((r) => (
          <PRRow key={r.kind} kind={PR_LABELS[r.kind]} date={formatShortDate(r.achievedAt)} value={prValue(r, units)} />
        ))}
      </ul>
    </div>
  );
}
