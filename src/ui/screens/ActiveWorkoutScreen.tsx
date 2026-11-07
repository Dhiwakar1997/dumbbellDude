// trussel: T-51BQCCA91K@1
import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import { ValidationError } from '../../domain/model';
import type { Workout } from '../../domain/model';
import { formatWeight, fromDisplayWeight, toDisplayWeight } from '../../domain/units';
import { countDoneSets, workoutDurationMinutes, workoutVolume } from '../../domain/volume';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { EmptyState } from '../components/EmptyState';
import { AddSetButton, ExerciseBlockHeader, SetRow } from '../components/ExerciseBlock';
import { Modal } from '../components/Modal';
import { RestTimerOverlay } from '../components/RestTimerOverlay';
import { StickyFooter } from '../components/StickyFooter';
import { WorkoutTimerBar } from '../components/WorkoutTimerBar';
import { formatElapsed, formatMinutes } from '../format';

interface RestState {
  remaining: number;
  total: number;
  next: string;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function nextUp(workout: Workout): string {
  for (const e of workout.exercises) {
    const i = e.sets.findIndex((s) => !s.done);
    if (i >= 0) return `Next: ${e.exerciseName} · set ${i + 1}`;
  }
  return 'All sets done. Finish strong.';
}

// Implements S-YKPWM78WME Active workout, S-Q9Y1MWY28B set error, overlays S-BGYY020JSP rest timer,
// S-7WGZZXGG5G finish confirm and S-ZYJ11ET1CP discard confirm.
// trussel: T-JF27E1HQ7C@1
export function ActiveWorkoutScreen(): JSX.Element {
  const { workouts, settings, exercises, refresh } = useServices();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(() => workouts.getActive());
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rest, setRest] = useState<RestState | null>(null);
  const [modal, setModal] = useState<'finish' | 'discard' | null>(null);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const { units, defaultRestSeconds } = settings.getSettings();

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const resting = rest !== null && rest.remaining > 0;
  useEffect(() => {
    if (!resting) return;
    const t = setInterval(() => setRest((r) => (r ? { ...r, remaining: Math.max(0, r.remaining - 1) } : r)), 1000);
    return () => clearInterval(t);
  }, [resting]);

  const closeModal = useCallback(() => {
    setModal(null);
    setFinishError(null);
  }, []);

  if (!workout) return <Navigate to="/start" replace />;

  const clearError = (setId: string) =>
    setErrors((e) => {
      if (!(setId in e)) return e;
      const { [setId]: _gone, ...rest } = e;
      void _gone;
      return rest;
    });

  const editWeight = (blockId: string, setId: string, text: string) => {
    setDrafts((d) => ({ ...d, [`${setId}:w`]: text }));
    clearError(setId);
    const value = text.trim() === '' ? 0 : Number.parseFloat(text.replace(',', '.'));
    if (Number.isFinite(value)) setWorkout(workouts.updateSet(blockId, setId, { weightKg: fromDisplayWeight(value, units) }));
  };

  const editReps = (blockId: string, setId: string, text: string) => {
    setDrafts((d) => ({ ...d, [`${setId}:r`]: text }));
    clearError(setId);
    const value = text.trim() === '' ? 0 : Number.parseInt(text, 10);
    if (Number.isFinite(value)) setWorkout(workouts.updateSet(blockId, setId, { reps: value }));
  };

  const toggle = (blockId: string, setId: string) => {
    try {
      const result = workouts.toggleSetDone(blockId, setId);
      setWorkout(result.workout);
      clearError(setId);
      if (result.nowDone && defaultRestSeconds > 0) {
        setRest({ remaining: defaultRestSeconds, total: defaultRestSeconds, next: nextUp(result.workout) });
      }
    } catch (e) {
      if (e instanceof ValidationError) setErrors((errs) => ({ ...errs, [setId]: e.message }));
      else throw e;
    }
  };

  const finish = () => {
    try {
      const done = workouts.finish();
      refresh();
      navigate(`/history/${done.id}`, { replace: true });
    } catch (e) {
      if (e instanceof ValidationError) setFinishError(e.message);
      else throw e;
    }
  };

  const discard = () => {
    workouts.discard();
    refresh();
    navigate('/', { replace: true });
  };

  const elapsed = (now - Date.parse(workout.startedAt)) / 1000;
  const counts = countDoneSets(workout);
  const finishMessage = `${counts.done} of ${counts.total} sets done · ${formatMinutes(
    workoutDurationMinutes(workout, new Date(now)),
  )} · ${formatWeight(workoutVolume(workout), units)}. Unticked sets won't be saved.`;

  return (
    <div className={`screen${rest !== null ? ' is-resting' : ''}`}>
      <WorkoutTimerBar
        name={workout.name}
        elapsed={formatElapsed(elapsed)}
        onDiscard={() => setModal('discard')}
        onFinish={() => setModal('finish')}
      />
      <div className="screen-body">
        {workout.exercises.length === 0 && (
          <EmptyState title="No exercises yet." body="Add one and get moving." />
        )}
        {workout.exercises.map((block) => {
          const previous = workouts.previousSets(block.exerciseId);
          const equipment = exercises.getExercise(block.exerciseId)?.equipment;
          const muscle = capitalize(block.muscleGroup) + (equipment ? ` · ${capitalize(equipment)}` : '');
          return (
            <div key={block.id}>
              <ExerciseBlockHeader name={block.exerciseName} muscle={muscle} unitLabel={units} />
              {block.sets.map((s, i) => {
                const prev = previous[i];
                return (
                  <SetRow
                    key={s.id}
                    index={i}
                    previous={prev ? `${toDisplayWeight(prev.weightKg, units)} × ${prev.reps}` : '—'}
                    weight={drafts[`${s.id}:w`] ?? String(toDisplayWeight(s.weightKg, units))}
                    reps={drafts[`${s.id}:r`] ?? String(s.reps)}
                    done={s.done}
                    error={errors[s.id] ?? null}
                    onWeightChange={(v) => editWeight(block.id, s.id, v)}
                    onRepsChange={(v) => editReps(block.id, s.id, v)}
                    onToggleDone={() => toggle(block.id, s.id)}
                  />
                );
              })}
              <AddSetButton onClick={() => setWorkout(workouts.addSet(block.id))} />
            </div>
          );
        })}
        <SecondaryButton onClick={() => navigate('/workout/add')}>+ Add exercise</SecondaryButton>
      </div>
      <StickyFooter>
        <PrimaryButton onClick={() => setModal('finish')}>Finish workout</PrimaryButton>
      </StickyFooter>
      <RestTimerOverlay
        open={rest !== null}
        remainingSeconds={rest?.remaining ?? 0}
        totalSeconds={rest?.total ?? 0}
        next={rest?.next ?? ''}
        onMinus={() => setRest((r) => (r ? { ...r, remaining: Math.max(0, r.remaining - 15) } : r))}
        onPlus={() => setRest((r) => (r ? { ...r, remaining: r.remaining + 15, total: Math.max(r.total, r.remaining + 15) } : r))}
        onSkip={() => setRest(null)}
      />
      <Modal
        open={modal === 'finish'}
        title="Finish workout?"
        message={finishMessage}
        confirmLabel="Finish"
        cancelLabel="Keep lifting"
        onConfirm={finish}
        onCancel={closeModal}
      >
        {finishError && (
          <p className="textfield-error" role="alert">
            {finishError}
          </p>
        )}
      </Modal>
      <Modal
        open={modal === 'discard'}
        danger
        title="Discard this workout?"
        message={`${workoutDurationMinutes(workout, new Date(now))} minutes of gains, gone. This can't be undone.`}
        confirmLabel="Discard"
        cancelLabel="Keep it"
        onConfirm={discard}
        onCancel={closeModal}
      />
    </div>
  );
}
