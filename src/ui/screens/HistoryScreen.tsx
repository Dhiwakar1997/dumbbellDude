// trussel: T-3VJY0RQC51@1
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import type { WorkoutSummary } from '../../application/WorkoutService';
import { formatWeight } from '../../domain/units';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/Buttons';
import { EmptyState } from '../components/EmptyState';
import { SectionTitle } from '../components/SectionTitle';
import { WorkoutCard } from '../components/WorkoutCard';
import { formatMinutes, formatShortDate, weekGroupLabel } from '../format';

// Implements S-GFFTPCESPF History and S-W5H4SKMCAG History — empty.
// trussel: T-65FPQVHV8P@1
export function HistoryScreen(): JSX.Element {
  const { workouts, settings } = useServices();
  const navigate = useNavigate();
  const units = settings.getSettings().units;
  const history = workouts.listHistory();
  const now = new Date();

  const groups: { label: string; items: WorkoutSummary[] }[] = [];
  for (const item of history) {
    const label = weekGroupLabel(item.workout.startedAt, now);
    const group = groups[groups.length - 1];
    if (group && group.label === label) group.items.push(item);
    else groups.push({ label, items: [item] });
  }

  return (
    <div className="screen">
      <AppHeader eyebrow="History" title="Your lifts" />
      {history.length === 0 ? (
        <>
          <EmptyState title="Nothing logged yet." body="History is written by those who lift. Go make some." />
          <PrimaryButton onClick={() => navigate('/start')}>Start workout</PrimaryButton>
        </>
      ) : (
        groups.map((g) => (
          <section key={g.label}>
            <SectionTitle title={g.label} />
            {g.items.map((s) => (
              <WorkoutCard
                key={s.workout.id}
                date={formatShortDate(s.workout.startedAt)}
                title={s.workout.name}
                exercises={s.workout.exercises.map((e) => e.exerciseName).join(' · ')}
                duration={formatMinutes(s.durationMinutes)}
                sets={s.doneSets}
                volume={formatWeight(s.volumeKg, units)}
                prCount={s.prCount}
                onClick={() => navigate(`/history/${s.workout.id}`)}
              />
            ))}
          </section>
        ))
      )}
    </div>
  );
}
