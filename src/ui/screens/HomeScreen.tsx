// trussel: T-KWBRFF4683@1
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import { formatWeight } from '../../domain/units';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/Buttons';
import { EmptyState } from '../components/EmptyState';
import { SectionTitle } from '../components/SectionTitle';
import { StatRow } from '../components/StatRow';
import { StatTile } from '../components/StatTile';
import { StickyFooter } from '../components/StickyFooter';
import { StreakBanner } from '../components/StreakBanner';
import { WorkoutCard } from '../components/WorkoutCard';
import { formatLongDate, formatMinutes, formatShortDate } from '../format';

function greeting(hour: number): string {
  if (hour < 12) return 'Morning, Dude.';
  if (hour < 18) return 'Afternoon, Dude.';
  return 'Evening, Dude.';
}

function splitWeight(text: string): [string, string] {
  const i = text.lastIndexOf(' ');
  return [text.slice(0, i), text.slice(i + 1)];
}

// Implements S-VCG8FMQQZQ Home and S-T350ZXWASA Home — empty.
// trussel: T-FXPBWB3GST@1
export function HomeScreen(): JSX.Element {
  const { workouts, settings } = useServices();
  const navigate = useNavigate();
  const summary = workouts.homeSummary();
  const units = settings.getSettings().units;
  const now = new Date();
  const last = summary.lastWorkout;
  const empty = last === null;
  const [volumeValue, volumeUnit] = splitWeight(formatWeight(summary.week.volumeKg, units, { compact: true }));

  return (
    <div className="screen">
      <AppHeader
        eyebrow={formatLongDate(now)}
        title={empty ? 'Hey, new Dude.' : greeting(now.getHours())}
        action={{ label: 'Routines', onClick: () => navigate('/routines') }}
      />
      <div className="screen-body">
        <StreakBanner days={summary.streakDays} />
        {empty ? (
          <EmptyState
            title="No workouts yet."
            body="The dumbbells miss you. Log your first session and we'll start keeping score."
          />
        ) : (
          <>
            <StatRow>
              <StatTile label="This week" value={String(summary.week.workouts)} unit={summary.week.workouts === 1 ? 'workout' : 'workouts'} />
              <StatTile label="Volume" value={volumeValue} unit={volumeUnit} />
            </StatRow>
            <SectionTitle title="Last workout" link={{ label: 'See all', onClick: () => navigate('/history') }} />
            <WorkoutCard
              date={formatShortDate(last.workout.startedAt)}
              title={last.workout.name}
              exercises={last.workout.exercises.map((e) => e.exerciseName).join(' · ')}
              duration={formatMinutes(last.durationMinutes)}
              sets={last.doneSets}
              volume={formatWeight(last.volumeKg, units)}
              prCount={last.prCount}
              onClick={() => navigate(`/history/${last.workout.id}`)}
            />
          </>
        )}
      </div>
      <StickyFooter aboveTabs>
        {summary.hasActive ? (
          <PrimaryButton onClick={() => navigate('/workout')}>Resume workout</PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => navigate('/start')}>{empty ? 'Start your first workout' : 'Start workout'}</PrimaryButton>
        )}
      </StickyFooter>
    </div>
  );
}
