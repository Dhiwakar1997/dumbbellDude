import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MemoryStorage } from '../adapters/storage';
import { FakeClock, CounterIds } from '../test/fakes';
import { AppRouter } from './AppRouter';
import { createServices } from './container';
import { ServicesProvider } from './ServicesContext';

function renderApp(path: string, services = createServices({ storage: new MemoryStorage(), clock: new FakeClock(), ids: new CounterIds() })) {
  render(
    <ServicesProvider services={services}>
      <MemoryRouter initialEntries={[path]}>
        <AppRouter />
      </MemoryRouter>
    </ServicesProvider>,
  );
  return services;
}

describe('App routes (smoke, real LocalStorage adapters on in-memory storage)', () => {
  it.each([
    ['/', 'Hey, new Dude.'],
    ['/history', 'Nothing logged yet.'],
    ['/progress', 'No lifts logged yet.'],
    ['/library', 'Exercises'],
    ['/settings', 'Tweak the Dude'],
    ['/routines', 'No routines yet.'],
    ['/start', 'Start workout'],
    ['/routines/new', 'New routine'],
    ['/history/missing', 'Workout not found.'],
  ])('renders %s', (path, text) => {
    renderApp(path);
    expect(screen.getAllByText(text).length).toBeGreaterThan(0);
  });

  it('runs the core loop: start → log → finish → home shows the last workout', () => {
    const services = renderApp('/');
    fireEvent.click(screen.getByRole('button', { name: 'Start your first workout' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start empty workout' }));
    fireEvent.click(screen.getByRole('button', { name: '+ Add exercise' }));
    fireEvent.click(screen.getByRole('button', { name: /^Bench Press/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Add 1 exercise' }));
    fireEvent.change(screen.getByLabelText('Set 1 weight'), { target: { value: '60' } });
    fireEvent.change(screen.getByLabelText('Set 1 reps'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark set 1 done' }));
    fireEvent.click(screen.getByRole('button', { name: 'Finish workout' }));
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Finish workout?' })).getByRole('button', { name: 'Finish' }));
    expect(screen.getAllByText('480 kg').length).toBeGreaterThan(0);
    expect(services.workouts.listHistory()).toHaveLength(1);
    fireEvent.click(screen.getByRole('link', { name: 'Home' }));
    expect(screen.getByText('Last workout')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Streak' })).toHaveTextContent('1 day streak');
  });

  it('library: filter by muscle group and add a custom exercise', () => {
    renderApp('/library');
    fireEvent.click(screen.getByRole('button', { name: 'Core' }));
    expect(screen.getByText('Plank')).toBeInTheDocument();
    expect(screen.queryByText('Bench Press')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '+ Custom' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save exercise' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Give it a name, Dude.');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Landmine Press' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save exercise' }));
    expect(screen.getByText('Landmine Press')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('settings: switch to lb and reset with confirmation', () => {
    const services = renderApp('/settings');
    fireEvent.click(screen.getByRole('radio', { name: 'lb' }));
    expect(services.settings.getSettings().units).toBe('lb');
    fireEvent.click(screen.getByRole('button', { name: /Default rest time/ }));
    expect(services.settings.getSettings().defaultRestSeconds).toBe(120);
    fireEvent.click(screen.getByRole('button', { name: /Reset everything/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(services.settings.getSettings().units).toBe('kg');
  });
});
