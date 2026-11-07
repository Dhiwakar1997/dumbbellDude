// trussel: T-45W0B435KE@1
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import { ValidationError } from '../../domain/model';
import { validateRoutineTargets } from '../../domain/validation';
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

/** Which target input a row's validation error is about, using the same rule the service applies. */
function targetErrorField(row: EditorDraft['rows'][number]): 'sets' | 'reps' | undefined {
  const sets = Number(row.sets);
  if (validateRoutineTargets({ exerciseId: row.exerciseId, targetSets: sets, targetReps: 1 })) return 'sets';
  if (validateRoutineTargets({ exerciseId: row.exerciseId, targetSets: 1, targetReps: Number(row.reps) })) return 'reps';
  return undefined;
}

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
  const [moved, setMoved] = useState<{ index: number; direction: 'up' | 'down' } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Reordering re-renders the rows; keep focus on the moved row's arrow (or its other arrow at either end)
  // so a keyboard user can press it again.
  useEffect(() => {
    if (!moved) return;
    const row = bodyRef.current?.querySelectorAll('[data-testid="routine-row"]')[moved.index];
    const [up, down] = [...(row?.querySelectorAll<HTMLButtonElement>('.rexrow-move button') ?? [])];
    const preferred = moved.direction === 'up' ? up : down;
    (preferred && !preferred.disabled ? preferred : moved.direction === 'up' ? down : up)?.focus();
  }, [moved]);

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
    setMoved({ index: to, direction: to < from ? 'up' : 'down' });
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
      <div className="screen-body" ref={bodyRef}>
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
              errorField={targetErrorField(row)}
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
