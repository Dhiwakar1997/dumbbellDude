// trussel: T-B45EZD1Z9E@1
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import { AppHeader } from '../components/AppHeader';
import { SecondaryButton } from '../components/Buttons';
import { EmptyState } from '../components/EmptyState';
import { RoutineCard } from '../components/RoutineCard';

// Implements S-FV8H80157X Routines.
// trussel: T-8K9D1PVFFY@1
export function RoutinesScreen(): JSX.Element {
  const { routines } = useServices();
  const navigate = useNavigate();
  const list = routines.list();
  return (
    <div className="screen">
      <AppHeader eyebrow="Plans" title="Routines" action={{ label: '+ New', onClick: () => navigate('/routines/new') }} />
      {list.length === 0 && <EmptyState title="No routines yet." body="Plan it once, lift it forever." />}
      {list.map((v) => (
        <RoutineCard
          key={v.routine.id}
          name={v.routine.name}
          exercises={v.exerciseNames.join(', ') || 'No exercises yet'}
          meta={`${v.routine.exercises.length} exercises · ${v.totalSets} sets`}
          actionLabel="Edit"
          onAction={() => navigate(`/routines/${v.routine.id}`)}
        />
      ))}
      <SecondaryButton onClick={() => navigate('/routines/new')}>+ New routine</SecondaryButton>
    </div>
  );
}
