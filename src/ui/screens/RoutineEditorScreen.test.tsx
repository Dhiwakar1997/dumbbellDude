import { fireEvent, screen, within } from '@testing-library/react';
import { makeTestServices, renderAt } from '../../test/renderWithServices';
import { ExercisePickerScreen } from './ExercisePickerScreen';
import { RoutineEditorScreen } from './RoutineEditorScreen';

const routes = [
  { path: '/routines/:id', element: <RoutineEditorScreen /> },
  { path: '/routines/:id/add', element: <ExercisePickerScreen /> },
];

describe('RoutineEditorScreen', () => {
  it('shows the "Name missing" error when saving without a name', () => {
    const { services } = makeTestServices();
    renderAt(services, routes, '/routines/new');
    fireEvent.click(screen.getByRole('button', { name: 'Save routine' }));
    expect(screen.getByRole('alert')).toHaveTextContent('A routine needs a name. "Untitled" is not a vibe.');
    expect(screen.getByLabelText('Routine name')).toHaveAttribute('aria-invalid', 'true');
    expect(services.routines.list()).toEqual([]);
  });

  it('adds exercises through the picker, reorders them, edits targets and saves in order', () => {
    const { services } = makeTestServices();
    renderAt(services, routes, '/routines/new');
    fireEvent.change(screen.getByLabelText('Routine name'), { target: { value: 'Push Day' } });
    fireEvent.click(screen.getByRole('button', { name: '+ Add exercise' }));

    // picker
    fireEvent.click(screen.getByRole('button', { name: /Bench Press/ }));
    fireEvent.click(screen.getByRole('button', { name: /Dips/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Add 2 exercises' }));

    // back in the editor, name kept
    expect(screen.getByLabelText('Routine name')).toHaveValue('Push Day');
    let rows = screen.getAllByTestId('routine-row');
    expect(rows).toHaveLength(2);
    expect(within(rows[0]!).getByText('Bench Press')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Move Dips up' }));
    rows = screen.getAllByTestId('routine-row');
    expect(within(rows[0]!).getByText('Dips')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Dips target sets'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Dips target reps'), { target: { value: '12' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save routine' }));
    const saved = services.routines.list()[0]!.routine;
    expect(saved.name).toBe('Push Day');
    expect(saved.exercises).toEqual([
      { exerciseId: 'seed-dips', targetSets: 4, targetReps: 12 },
      { exerciseId: 'seed-bench-press', targetSets: 3, targetReps: 10 },
    ]);
    expect(screen.getByTestId('location')).toHaveTextContent('/routines');
  });

  it('keeps focus on the moved row so it can be moved again from the keyboard', () => {
    const { services } = makeTestServices();
    const r = services.routines.save({
      name: 'Push',
      exercises: [
        { exerciseId: 'seed-bench-press', targetSets: 3, targetReps: 8 },
        { exerciseId: 'seed-dips', targetSets: 3, targetReps: 10 },
        { exerciseId: 'seed-deadlift', targetSets: 3, targetReps: 5 },
      ],
    });
    renderAt(services, routes, `/routines/${r.id}`);
    fireEvent.click(screen.getByRole('button', { name: 'Move Bench Press down' }));
    expect(screen.getByRole('button', { name: 'Move Bench Press down' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'Move Bench Press down' }));
    // now last: its down arrow is disabled, so focus moves to its up arrow
    expect(screen.getByRole('button', { name: 'Move Bench Press up' })).toHaveFocus();
  });

  it('flags an invalid target on its row', () => {
    const { services } = makeTestServices();
    const r = services.routines.save({ name: 'Legs', exercises: [{ exerciseId: 'seed-back-squat', targetSets: 3, targetReps: 5 }] });
    renderAt(services, routes, `/routines/${r.id}`);
    fireEvent.change(screen.getByLabelText('Back Squat target sets'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save routine' }));
    expect(screen.getByTestId('routine-row')).toHaveClass('is-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Sets must be 1–20.');
  });

  it('removes a row and deletes an existing routine after confirming', () => {
    const { services } = makeTestServices();
    const r = services.routines.save({
      name: 'Pull',
      exercises: [
        { exerciseId: 'seed-deadlift', targetSets: 3, targetReps: 5 },
        { exerciseId: 'seed-dips', targetSets: 3, targetReps: 10 },
      ],
    });
    renderAt(services, routes, `/routines/${r.id}`);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Dips' }));
    expect(screen.getAllByTestId('routine-row')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Delete routine' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete this routine?' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));
    expect(services.routines.get(r.id)).toBeNull();
  });

  it('shows not-found for an unknown routine', () => {
    const { services } = makeTestServices();
    renderAt(services, routes, '/routines/nope');
    expect(screen.getByText('Routine not found.')).toBeInTheDocument();
  });
});
