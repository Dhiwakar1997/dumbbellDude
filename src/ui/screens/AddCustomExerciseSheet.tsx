// trussel: T-E1BP3VPRRP@1
import { useEffect, useState } from 'react';
import { useServices } from '../../app/ServicesContext';
import { EQUIPMENT, MUSCLE_GROUPS, ValidationError } from '../../domain/model';
import type { Equipment, Exercise, MuscleGroup } from '../../domain/model';
import { AppHeader } from '../components/AppHeader';
import { BottomSheet } from '../components/BottomSheet';
import { PrimaryButton } from '../components/Buttons';
import { ChipFilter } from '../components/ChipFilter';
import { SettingsGroupLabel } from '../components/SettingsControls';
import { TextField } from '../components/TextField';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Implements S-86SZ93FJAA Add custom exercise (sheet).
// trussel: T-H35PB4JQR7@1
export function AddCustomExerciseSheet(props: {
  open: boolean;
  initialName?: string;
  onClose: () => void;
  onSaved: (exercise: Exercise) => void;
}): JSX.Element | null {
  const { exercises } = useServices();
  const [name, setName] = useState('');
  const [group, setGroup] = useState<MuscleGroup>('chest');
  const [equipment, setEquipment] = useState<Equipment>('barbell');
  const [error, setError] = useState<string | null>(null);
  const { open, initialName } = props;

  useEffect(() => {
    if (open) {
      setName(initialName ?? '');
      setGroup('chest');
      setEquipment('barbell');
      setError(null);
    }
  }, [open, initialName]);

  const save = () => {
    try {
      const created = exercises.createCustom({ name, muscleGroup: group, equipment });
      props.onSaved(created);
      props.onClose();
    } catch (e) {
      if (e instanceof ValidationError) setError(e.message);
      else throw e;
    }
  };

  return (
    <BottomSheet open={open} label="Add custom exercise" onClose={props.onClose}>
      <AppHeader eyebrow="Library" title="New exercise" action={{ label: 'Cancel', onClick: props.onClose }} />
      <TextField
        label="Name"
        value={name}
        placeholder="Landmine Press"
        error={error}
        onChange={(v) => {
          setName(v);
          setError(null);
        }}
      />
      <SettingsGroupLabel>Muscle group</SettingsGroupLabel>
      <ChipFilter
        label="Muscle group"
        wrap
        options={MUSCLE_GROUPS.map((g) => ({ value: g, label: capitalize(g) }))}
        value={group}
        onChange={(v) => setGroup(v as MuscleGroup)}
      />
      <TextField
        label="Equipment"
        as="select"
        value={equipment}
        options={EQUIPMENT.map((e) => ({ value: e, label: capitalize(e) }))}
        onChange={(v) => setEquipment(v as Equipment)}
      />
      <PrimaryButton onClick={save}>Save exercise</PrimaryButton>
    </BottomSheet>
  );
}
