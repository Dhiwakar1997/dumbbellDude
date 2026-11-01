// trussel: T-119M3CRVT0@1
import { useNavigate, useParams } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import { formatWeight, toDisplayWeight } from '../../domain/units';
import { exerciseVolume, setVolume } from '../../domain/volume';
import { AppHeader } from '../components/AppHeader';
import { EmptyState } from '../components/EmptyState';
import { ExerciseSummaryHeader, SetSummaryLine } from '../components/ExerciseSummary';
import { StatRow } from '../components/StatRow';
import { StatTile } from '../components/StatTile';
import { formatShortDate, formatTimeOfDay } from '../format';

function splitWeight(text: string): [string, string] {
  const i = text.lastIndexOf(' ');
  return [text.slice(0, i), text.slice(i + 1)];
}

// Implements S-53X1CJ7X9F Workout detail.
// trussel: T-2E754EAKBM@1
export function WorkoutDetailScreen(): JSX.Element {
  const { workouts, settings } = useServices();
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const units = settings.getSettings().units;
  const detail = workouts.getWorkoutDetail(id);
  const back = { label: 'Back', onClick: () => navigate(-1) };

  if (!detail) {
    return (
      <div className="screen">
        <AppHeader eyebrow="History" title="Workout" action={back} />
        <EmptyState title="Workout not found." body="Either it never happened, or it was reset into oblivion." />
      </div>
    );
  }
  const { summary, prSetIds } = detail;
  const w = summary.workout;
  const [volValue, volUnit] = splitWeight(formatWeight(summary.volumeKg, units, { compact: true }));

  return (
    <div className="screen">
      <AppHeader eyebrow={`${formatShortDate(w.startedAt)} · ${formatTimeOfDay(w.startedAt)}`} title={w.name} action={back} />
      <StatRow>
        <StatTile label="Time" value={String(summary.durationMinutes)} unit="min" />
        <StatTile label="Volume" value={volValue} unit={volUnit} />
        <StatTile label="PRs" value={String(summary.prCount)} unit="new" accent={summary.prCount > 0} />
      </StatRow>
      {w.exercises.map((e) => {
        const total = exerciseVolume(e);
        return (
          <div key={e.id}>
            <ExerciseSummaryHeader name={e.exerciseName} total={total > 0 ? formatWeight(total, units) : 'Bodyweight'} />
            {e.sets.map((s, i) => (
              <SetSummaryLine
                key={s.id}
                index={i}
                weight={s.weightKg > 0 ? `${toDisplayWeight(s.weightKg, units)} ${units}` : 'BW'}
                reps={s.reps}
                volume={formatWeight(setVolume(s), units)}
                pr={prSetIds.has(s.id)}
                last={i === e.sets.length - 1}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
