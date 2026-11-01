// trussel: T-67RKMQPEHE@1
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import type { MuscleGroup } from '../../domain/model';
import { AppHeader } from '../components/AppHeader';
import { SecondaryButton } from '../components/Buttons';
import { ChipFilter } from '../components/ChipFilter';
import { EmptyState } from '../components/EmptyState';
import { ExerciseRow } from '../components/ExerciseRow';
import { SearchField } from '../components/SearchField';
import { AddCustomExerciseSheet } from './AddCustomExerciseSheet';
import { MUSCLE_OPTIONS } from './ExercisePickerScreen';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Implements S-YFC8KV1GV2 Exercise library (+ overlay S-86SZ93FJAA).
// trussel: T-83C452ECZY@1
export function ExerciseLibraryScreen(): JSX.Element {
  const { exercises } = useServices();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [, setSaved] = useState(0);
  const results = exercises.search({ query, muscleGroup: group as MuscleGroup | 'all' });

  return (
    <div className="screen">
      <AppHeader eyebrow="Library" title="Exercises" action={{ label: '+ Custom', onClick: () => setSheetOpen(true) }} />
      <SearchField value={query} onChange={setQuery} placeholder="Search 40+ exercises" />
      <ChipFilter label="Filter by muscle group" options={MUSCLE_OPTIONS} value={group} onChange={setGroup} />
      <div className="screen-body">
        {results.length === 0 ? (
          <EmptyState title="No exercises match." body="Can't find it? Make it yours.">
            <SecondaryButton onClick={() => setSheetOpen(true)}>Add it as custom</SecondaryButton>
          </EmptyState>
        ) : (
          results.map((e) => (
            <ExerciseRow
              key={e.id}
              name={e.name}
              meta={`${capitalize(e.muscleGroup)} · ${capitalize(e.equipment)}`}
              custom={e.isCustom}
              onClick={() => navigate(`/progress?exercise=${encodeURIComponent(e.id)}`)}
            />
          ))
        )}
      </div>
      <AddCustomExerciseSheet
        open={sheetOpen}
        initialName={results.length === 0 ? query : ''}
        onClose={() => setSheetOpen(false)}
        onSaved={() => {
          setSaved((n) => n + 1);
          setQuery('');
          setGroup('all');
        }}
      />
    </div>
  );
}
