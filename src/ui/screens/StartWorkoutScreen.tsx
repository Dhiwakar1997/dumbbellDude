// trussel: T-QNDP4PEJ1Y@1
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import { ValidationError } from '../../domain/model';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { RoutineCard } from '../components/RoutineCard';
import { SectionTitle } from '../components/SectionTitle';
import { useBack } from '../useBack';

// Implements S-2YJQSZFD9R Start workout.
// trussel: T-RT5HEJZJER@1
export function StartWorkoutScreen(): JSX.Element {
  const { workouts, routines } = useServices();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const cancel = useBack('/');

  if (workouts.getActive()) return <Navigate to="/workout" replace />;
  const list = routines.list();

  const run = (start: () => void) => {
    try {
      start();
      // Replace Start: once the workout runs, Back should not lead to Start again (e.g. after finishing).
      navigate('/workout', { replace: true });
    } catch (e) {
      if (e instanceof ValidationError) setError(e.message);
      else throw e;
    }
  };

  return (
    <div className="screen">
      <AppHeader eyebrow="New session" title="Start workout" action={{ label: 'Cancel', onClick: cancel }} />
      <PrimaryButton onClick={() => run(() => workouts.startEmpty())}>Start empty workout</PrimaryButton>
      {error && (
        <p className="inline-error" role="alert">
          {error}
        </p>
      )}
      {list.length > 0 ? (
        <>
          <SectionTitle title="Pick a routine" link={{ label: 'Manage', onClick: () => navigate('/routines') }} />
          {list.map((v) => (
            <RoutineCard
              key={v.routine.id}
              name={v.routine.name}
              exercises={v.exerciseNames.join(', ') || 'No exercises yet'}
              meta={`${v.routine.exercises.length} exercises · ${v.totalSets} sets`}
              actionLabel="Start"
              onAction={() => run(() => workouts.startFromRoutine(v.routine.id))}
            />
          ))}
        </>
      ) : (
        <p className="hint">No routines yet — build one and future-you will thank you.</p>
      )}
      <SecondaryButton onClick={() => navigate('/routines/new')}>+ New routine</SecondaryButton>
    </div>
  );
}
