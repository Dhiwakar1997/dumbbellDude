// trussel: T-0D6J6JWTRC@1
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { DataTransferService } from '../application/DataTransferService';
import type { ExerciseService } from '../application/ExerciseService';
import type { ProgressService } from '../application/ProgressService';
import type { RoutineService } from '../application/RoutineService';
import type { SettingsService } from '../application/SettingsService';
import type { WorkoutService } from '../application/WorkoutService';

/** The wired use-case services handed to screens (built by createServices in container.ts). */
export interface Services {
  workouts: WorkoutService;
  routines: RoutineService;
  exercises: ExerciseService;
  progress: ProgressService;
  settings: SettingsService;
  dataTransfer: DataTransferService;
}

type ServicesValue = Services & { refresh: () => void; version: number };

const ServicesCtx = createContext<ServicesValue | null>(null);

// trussel: T-7ZC8RC7B7X@1
export function ServicesProvider(props: { services: Services; children: ReactNode }): JSX.Element {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  const value = useMemo(() => ({ ...props.services, refresh, version }), [props.services, refresh, version]);
  return <ServicesCtx.Provider value={value}>{props.children}</ServicesCtx.Provider>;
}

// trussel: T-7GNA9H23Q8@1
export function useServices(): ServicesValue {
  const value = useContext(ServicesCtx);
  if (!value) throw new Error('useServices must be used inside ServicesProvider');
  return value;
}
