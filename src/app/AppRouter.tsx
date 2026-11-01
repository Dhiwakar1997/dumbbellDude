// trussel: T-MCS96X42Q8@1
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { TabBar } from '../ui/components/TabBar';
import { ActiveWorkoutScreen } from '../ui/screens/ActiveWorkoutScreen';
import { ExerciseLibraryScreen } from '../ui/screens/ExerciseLibraryScreen';
import { ExercisePickerScreen } from '../ui/screens/ExercisePickerScreen';
import { HistoryScreen } from '../ui/screens/HistoryScreen';
import { HomeScreen } from '../ui/screens/HomeScreen';
import { ProgressScreen } from '../ui/screens/ProgressScreen';
import { RoutineEditorScreen } from '../ui/screens/RoutineEditorScreen';
import { RoutinesScreen } from '../ui/screens/RoutinesScreen';
import { SettingsScreen } from '../ui/screens/SettingsScreen';
import { StartWorkoutScreen } from '../ui/screens/StartWorkoutScreen';
import { WorkoutDetailScreen } from '../ui/screens/WorkoutDetailScreen';

// trussel: T-Q6TSKHW9MH@1
export function AppLayout(): JSX.Element {
  return (
    <>
      <main style={{ paddingBottom: 'calc(var(--vd-tabbar-height) + env(safe-area-inset-bottom, 0px))' }}>
        <Outlet />
      </main>
      <TabBar />
    </>
  );
}

// trussel: T-X9RZRYM5XN@1
export function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomeScreen />} />
        <Route path="history" element={<HistoryScreen />} />
        <Route path="history/:id" element={<WorkoutDetailScreen />} />
        <Route path="progress" element={<ProgressScreen />} />
        <Route path="library" element={<ExerciseLibraryScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
        <Route path="routines" element={<RoutinesScreen />} />
      </Route>
      <Route path="start" element={<StartWorkoutScreen />} />
      <Route path="workout" element={<ActiveWorkoutScreen />} />
      <Route path="workout/add" element={<ExercisePickerScreen />} />
      <Route path="routines/:id" element={<RoutineEditorScreen />} />
      <Route path="routines/:id/add" element={<ExercisePickerScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
