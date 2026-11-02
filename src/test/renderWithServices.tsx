import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DataTransferService } from '../application/DataTransferService';
import { ExerciseService } from '../application/ExerciseService';
import { ProgressService } from '../application/ProgressService';
import { RoutineService } from '../application/RoutineService';
import { SettingsService } from '../application/SettingsService';
import { WorkoutService } from '../application/WorkoutService';
import type { Services } from '../app/container';
import { ServicesProvider } from '../app/ServicesContext';
import { makeFakePorts } from './fakes';

export function makeTestServices() {
  const ports = makeFakePorts();
  const services: Services = {
    workouts: new WorkoutService(ports.workouts, ports.exercises, ports.routines, ports.clock, ports.ids),
    routines: new RoutineService(ports.routines, ports.exercises, ports.clock, ports.ids),
    exercises: new ExerciseService(ports.exercises, ports.ids),
    progress: new ProgressService(ports.workouts, ports.exercises),
    settings: new SettingsService(ports.settings),
    dataTransfer: new DataTransferService(ports.workouts, ports.routines, ports.exercises, ports.settings, ports.clock),
  };
  return { ports, services };
}

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

export function renderAt(
  services: Services,
  routes: { path: string; element: ReactElement }[],
  initialEntry: string | { pathname: string; state?: unknown },
) {
  return render(
    <ServicesProvider services={services}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
          <Route path="*" element={<div>elsewhere</div>} />
        </Routes>
        <LocationProbe />
      </MemoryRouter>
    </ServicesProvider>,
  );
}
