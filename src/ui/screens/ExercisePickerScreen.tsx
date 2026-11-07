// trussel: T-2YVSMWM8JC@1
import { useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import { MUSCLE_GROUPS } from '../../domain/model';
import type { MuscleGroup } from '../../domain/model';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/Buttons';
import { ChipFilter } from '../components/ChipFilter';
import { EmptyState } from '../components/EmptyState';
import { ExerciseRow } from '../components/ExerciseRow';
import { SearchField } from '../components/SearchField';
import { StickyFooter } from '../components/StickyFooter';
import { useBack } from '../useBack';
import type { EditorDraft } from './RoutineEditorScreen';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const MUSCLE_OPTIONS = [
  { value: 'all', label: 'All' },
  ...MUSCLE_GROUPS.map((g) => ({ value: g, label: capitalize(g) })),
];

// Implements S-2RERWN3QTT Add exercise to workout (picker); also used to add exercises to a routine draft.
// trussel: T-T8JTYK2GZ0@1
export function ExercisePickerScreen(): JSX.Element {
  const { workouts, exercises } = useServices();
  const navigate = useNavigate();
  const { id: routineId } = useParams();
  const location = useLocation();
  const draft = (location.state as { draft?: EditorDraft } | null)?.draft;
  const forRoutine = routineId !== undefined;
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  // The workout picker steps back to the workout it was opened from, so no extra /workout entry is left in history.
  const backToWorkout = useBack('/workout');

  const active = forRoutine ? null : workouts.getActive();
  if (!forRoutine && !active) return <Navigate to="/start" replace />;

  const already = new Set(
    forRoutine ? (draft?.rows ?? []).map((r) => r.exerciseId) : (active?.exercises ?? []).map((e) => e.exerciseId),
  );
  const results = exercises.search({ query, muscleGroup: group as MuscleGroup | 'all' });

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const confirm = () => {
    if (forRoutine) {
      const base: EditorDraft = draft ?? { name: '', rows: [] };
      const rows = [...base.rows, ...selected.map((exerciseId) => ({ exerciseId, sets: '3', reps: '10' }))];
      navigate(`/routines/${routineId}`, { replace: true, state: { draft: { ...base, rows } } });
    } else {
      workouts.addExercises(selected);
      backToWorkout();
    }
  };

  const back = () =>
    forRoutine ? navigate(`/routines/${routineId}`, { replace: true, state: { draft } }) : backToWorkout();

  const n = selected.length;
  return (
    <div className="screen">
      <AppHeader eyebrow={forRoutine ? 'Routine' : 'Active workout'} title="Add exercise" action={{ label: 'Cancel', onClick: back }} />
      <SearchField value={query} onChange={setQuery} placeholder="Search 40+ exercises" />
      <ChipFilter label="Filter by muscle group" options={MUSCLE_OPTIONS} value={group} onChange={setGroup} />
      <div className="screen-body">
        {results.length === 0 ? (
          <EmptyState title="No exercises match." body="Try another word, or add it as a custom one in the Library." />
        ) : (
          results.map((e) => (
            <ExerciseRow
              key={e.id}
              name={e.name}
              meta={`${capitalize(e.muscleGroup)} · ${capitalize(e.equipment)}${already.has(e.id) ? ' · already added' : ''}`}
              custom={e.isCustom}
              mode="pick"
              selected={selected.includes(e.id)}
              onClick={() => toggle(e.id)}
            />
          ))
        )}
      </div>
      <StickyFooter>
        <PrimaryButton disabled={n === 0} onClick={confirm}>
          {n === 0 ? 'Pick an exercise' : `Add ${n} exercise${n === 1 ? '' : 's'}`}
        </PrimaryButton>
      </StickyFooter>
    </div>
  );
}
