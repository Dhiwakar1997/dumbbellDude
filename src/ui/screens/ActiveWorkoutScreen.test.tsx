import { act, fireEvent, screen, within } from '@testing-library/react';
import { makeTestServices, renderAt } from '../../test/renderWithServices';
import { ActiveWorkoutScreen } from './ActiveWorkoutScreen';

function setup() {
  const { services, ports } = makeTestServices();
  services.workouts.startEmpty();
  services.workouts.addExercises(['seed-bench-press']);
  renderAt(services, [{ path: '/workout', element: <ActiveWorkoutScreen /> }], '/workout');
  return { services, ports };
}

describe('ActiveWorkoutScreen', () => {
  afterEach(() => vi.useRealTimers());

  it('renders the exercise card, timer bar and one set row', () => {
    setup();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Chest · Barbell')).toBeInTheDocument(); // design copy C-CEJYG76YXT
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByRole('timer', { name: 'Elapsed time' })).toHaveTextContent(/\d\d:\d\d:\d\d/);
    expect(screen.getAllByTestId('set-row')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Finish workout' })).toBeInTheDocument();
  });

  it('shows the weight unit once in the column header, leaving the set fields to the numbers', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: '+ Add set' }));
    expect(screen.getAllByText('kg')).toHaveLength(1);
    for (const row of screen.getAllByTestId('set-row')) {
      expect(within(row).queryByText('kg')).not.toBeInTheDocument();
      expect(within(row).queryByText('reps')).not.toBeInTheDocument();
    }
  });

  it('shows the validation error on the set row when ticking a set with 0 reps', () => {
    setup();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark set 1 done' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Reps must be at least 1. Nice try.');
    expect(screen.getByTestId('set-row')).toHaveClass('is-error');
    expect(screen.getByLabelText('Set 1 reps')).toHaveAttribute('aria-invalid', 'true');
    // editing clears the error
    fireEvent.change(screen.getByLabelText('Set 1 reps'), { target: { value: '8' } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('ticks a valid set, marks it done and opens the rest timer', () => {
    vi.useFakeTimers();
    const { services } = setup();
    fireEvent.change(screen.getByLabelText('Set 1 weight'), { target: { value: '62.5' } });
    fireEvent.change(screen.getByLabelText('Set 1 reps'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark set 1 done' }));
    expect(screen.getByTestId('set-row')).toHaveClass('is-done');
    expect(screen.getByRole('checkbox', { name: 'Mark set 1 done' })).toHaveAttribute('aria-checked', 'true');
    const timer = screen.getByRole('dialog', { name: 'Rest timer' });
    expect(within(timer).getByText('1:30')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(within(timer).getByText('1:27')).toBeInTheDocument();
    fireEvent.click(within(timer).getByRole('button', { name: 'Plus 15 seconds' }));
    expect(within(timer).getByText('1:42')).toBeInTheDocument();
    fireEvent.click(within(timer).getByRole('button', { name: 'Skip' }));
    expect(screen.queryByRole('dialog', { name: 'Rest timer' })).not.toBeInTheDocument();
    const stored = services.workouts.getActive()!.exercises[0]!.sets[0]!;
    expect(stored).toMatchObject({ weightKg: 62.5, reps: 8, done: true });
  });

  it('adds a set copying the last one', () => {
    setup();
    fireEvent.change(screen.getByLabelText('Set 1 reps'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: '+ Add set' }));
    expect(screen.getAllByTestId('set-row')).toHaveLength(2);
    expect(screen.getByLabelText('Set 2 reps')).toHaveValue('5');
  });

  it('finishes via the confirm modal and navigates to the workout detail', () => {
    const { services } = setup();
    fireEvent.change(screen.getByLabelText('Set 1 weight'), { target: { value: '60' } });
    fireEvent.change(screen.getByLabelText('Set 1 reps'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark set 1 done' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    fireEvent.click(screen.getByRole('button', { name: 'Finish workout' }));
    const dialog = screen.getByRole('dialog', { name: 'Finish workout?' });
    expect(dialog).toHaveTextContent('1 of 1 sets done');
    expect(dialog).toHaveTextContent('480 kg');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Finish' }));
    const saved = services.workouts.listHistory()[0]!;
    expect(screen.getByTestId('location')).toHaveTextContent(`/history/${saved.workout.id}`);
    expect(services.workouts.getActive()).toBeNull();
  });

  it('refuses to finish with no ticked sets and shows why', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Finish workout' }));
    const dialog = screen.getByRole('dialog', { name: 'Finish workout?' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Finish' }));
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Tick at least one set, or discard it.');
  });

  it('discards via the danger modal and goes home', () => {
    const { services } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Discard' }));
    const dialog = screen.getByRole('dialog', { name: 'Discard this workout?' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Discard' }));
    expect(services.workouts.getActive()).toBeNull();
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });

  it('shows weights in lb when the units setting is lb but stores kg', () => {
    const { services } = makeTestServices();
    services.settings.setUnits('lb');
    services.workouts.startEmpty();
    services.workouts.addExercises(['seed-bench-press']);
    renderAt(services, [{ path: '/workout', element: <ActiveWorkoutScreen /> }], '/workout');
    fireEvent.change(screen.getByLabelText('Set 1 weight'), { target: { value: '135' } });
    expect(services.workouts.getActive()!.exercises[0]!.sets[0]!.weightKg).toBeCloseTo(61.235, 3);
    expect(screen.getAllByText('lb').length).toBeGreaterThan(0);
  });

  it('redirects to /start when there is no active workout', () => {
    const { services } = makeTestServices();
    renderAt(services, [{ path: '/workout', element: <ActiveWorkoutScreen /> }], '/workout');
    expect(screen.getByTestId('location')).toHaveTextContent('/start');
  });
});
