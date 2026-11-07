import { screen } from '@testing-library/react';
import { makeTestServices, renderAt } from '../../test/renderWithServices';
import { ProgressScreen } from './ProgressScreen';

function logBenchPress() {
  const { services } = makeTestServices();
  services.workouts.startEmpty();
  const block = services.workouts.addExercises(['seed-bench-press']).exercises[0]!;
  services.workouts.updateSet(block.id, block.sets[0]!.id, { weightKg: 60, reps: 8 });
  services.workouts.toggleSetDone(block.id, block.sets[0]!.id);
  services.workouts.finish();
  return services;
}

const routes = [{ path: '/progress', element: <ProgressScreen /> }];

describe('ProgressScreen', () => {
  it('shows the logged exercise asked for by link', () => {
    renderAt(logBenchPress(), routes, '/progress?exercise=seed-bench-press');
    expect(screen.getByLabelText('Exercise')).toHaveDisplayValue('Bench Press');
    expect(screen.getByText('Personal records')).toBeInTheDocument();
  });

  it('keeps an exercise that was never logged selected instead of showing another one', () => {
    renderAt(logBenchPress(), routes, '/progress?exercise=seed-deadlift');
    expect(screen.getByLabelText('Exercise')).toHaveDisplayValue('Deadlift');
    expect(screen.getByText('No Deadlift logged yet.')).toBeInTheDocument();
    expect(screen.queryByText('Personal records')).not.toBeInTheDocument();
  });
});
