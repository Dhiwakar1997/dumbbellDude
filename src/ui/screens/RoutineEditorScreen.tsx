// trussel: T-45W0B435KE@1
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import { ValidationError } from '../../domain/model';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { RoutineExerciseRow } from '../components/RoutineExerciseRow';
import { SectionTitle } from '../components/SectionTitle';
import { StickyFooter } from '../components/StickyFooter';
import { TextField } from '../components/TextField';

export interface EditorDraft {
  name: string;
  rows: { exerciseId: string; sets: string; reps: string }[];
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Implements S-EAA9SRC6AG Routine editor (state "Name missing").
// trussel: T-AW2FV75YDX@1
export function RoutineEditorScreen(): JSX.Element {
  const { routines, exercises } = useServices();
  const navigate = useNavigate();
  const { id = 'new' } = useParams();
  const location = useLocation();
  const isNew = id === 'new';
  const existing = isNew ? null : routines.get(id);

  const [draft, setDraft] = useState<EditorDraft>(() => {
    const fromPicker = (location.state as { draft?: EditorDraft } | null)?.draft;
    if (fromPicker) return fromPicker;
    if (existing) {
      return {
        name: existing.name,
        rows: existing.exercises.map((e) => ({ exerciseId: e.exerciseId, sets: String(e.targetSets), reps: String(e.targetReps) })),
      };
    }
    return { name: '', rows: [] };
  });
  const [nameError, setNameError] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isNew && !existing) {
    return (
      <div className="screen">
        <AppHeader eyebrow="Edit routine" title="Routines" action={{ label: 'Back', onClick: () => navigate('/routines') }} />
        <EmptyState title="Routine not found." body="It may have been deleted. Happens to the best of us." />
      </div>
    );
  }

  const updateRows = (rows: EditorDraft['rows']) => {
    setDraft((d) => ({ ...d, rows }));
    setRowErrors({});
  };
  const move = (from: number, to: number) => {
    const rows = draft.rows.slice();
    const [item] = rows.splice(from, 1);
    if (item) rows.splice(to, 0, item);
    updateRows(rows);
  };

  const save = () => {
    try {
      routines.save({
        id: isNew ? undefined : id,
        name: draft.name,
        exercises: draft.rows.map((r) => ({
          exerciseId: r.exerciseId,
          targetSets: Number(r.sets),
          targetReps: Number(r.reps),
        })),
      });
      navigate('/routines', { replace: true });
    } catch (e) {
      if (!(e instanceof ValidationError)) throw e;
      if (e.field === 'name') setNameError(e.message);
      else if (e.field?.startsWith('exercises.')) setRowErrors({ [Number(e.field.split('.')[1])]: e.message });
      else setNameError(e.message);
    }
  };

  return (
    <div className="screen">
      <AppHeader
        eyebrow={isNew ? 'New routine' : 'Edit routine'}
        title={draft.name.trim() || 'New routine'}
        action={{ label: 'Cancel', onClick: () => navigate('/routines') }}
      />
      <div className="screen-body">
        <TextField
          label="Routine name"
          value={draft.name}
          placeholder="Push Day"
          error={nameError}
          onChange={(v) => {
            setDraft((d) => ({ ...d, name: v }));
            setNameError(null);
          }}
        />
        <SectionTitle title="Exercises · sets × reps" />
        {draft.rows.length === 0 && <p className="hint">No exercises yet. Add a few — the bar won't lift itself.</p>}
        {draft.rows.map((row, i) => {
          const ex = exercises.getExercise(row.exerciseId);
          return (
            <RoutineExerciseRow
              key={`${row.exerciseId}-${i}`}
              order={i + 1}
              name={ex?.name ?? 'Unknown exercise'}
              muscle={ex ? `${capitalize(ex.muscleGroup)} · ${capitalize(ex.equipment)}` : ''}
              sets={row.sets}
              reps={row.reps}
              error={rowErrors[i] ?? null}
              canMoveUp={i > 0}
              canMoveDown={i < draft.rows.length - 1}
              onSetsChange={(v) => updateRows(draft.rows.map((r, j) => (j === i ? { ...r, sets: v } : r)))}
              onRepsChange={(v) => updateRows(draft.rows.map((r, j) => (j === i ? { ...r, reps: v } : r)))}
              onMoveUp={() => move(i, i - 1)}
              onMoveDown={() => move(i, i + 1)}
              onRemove={() => updateRows(draft.rows.filter((_, j) => j !== i))}
            />
          );
        })}
        <SecondaryButton onClick={() => navigate(`/routines/${id}/add`, { state: { draft } })}>+ Add exercise</SecondaryButton>
        {!isNew && (
          <SecondaryButton danger onClick={() => setConfirmDelete(true)}>
            Delete routine
          </SecondaryButton>
        )}
      </div>
      <StickyFooter>
        <PrimaryButton onClick={save}>Save routine</PrimaryButton>
      </StickyFooter>
      <Modal
        open={confirmDelete}
        danger
        title="Delete this routine?"
        message="Past workouts stay in your history. The plan goes in the bin."
        confirmLabel="Delete"
        cancelLabel="Keep it"
        onConfirm={() => {
          routines.remove(id);
          navigate('/routines', { replace: true });
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
