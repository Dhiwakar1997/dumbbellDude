// trussel: T-TGZF6PP6YK@1
import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../app/ServicesContext';
import type { ImportPreview } from '../../application/DataTransferService';
import { ValidationError } from '../../domain/model';
import type { Units } from '../../domain/model';
import { AppHeader } from '../components/AppHeader';
import { Modal } from '../components/Modal';
import { SegmentedControl, SettingRow, SettingsGroupLabel } from '../components/SettingsControls';
import { formatCountdown } from '../format';

const REST_PRESETS = [30, 60, 90, 120, 180];

function download(filename: string, json: string): void {
  if (typeof URL.createObjectURL !== 'function') return;
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// Implements S-HZ2GVRC6ZA Settings, overlays S-A3WZ55KPAN reset confirm and S-DFT1S10WN0 import confirm.
// trussel: T-HY9J7ERGG1@1
export function SettingsScreen(): JSX.Element {
  const { settings, dataTransfer, refresh } = useServices();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState(() => settings.getSettings());
  const [importState, setImportState] = useState<{ preview: ImportPreview; filename: string } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [exported, setExported] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const nextRest = () => {
    const i = REST_PRESETS.indexOf(current.defaultRestSeconds);
    const next = REST_PRESETS[(i + 1) % REST_PRESETS.length] ?? 90;
    setCurrent(settings.setDefaultRest(next));
    refresh();
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImportError(null);
    try {
      const preview = dataTransfer.parseImport(await file.text());
      setImportState({ preview, filename: file.name });
    } catch (err) {
      if (err instanceof ValidationError) setImportError(err.message);
      else throw err;
    }
  };

  return (
    <div className="screen">
      <AppHeader eyebrow="Settings" title="Tweak the Dude" />
      <SettingsGroupLabel>Training</SettingsGroupLabel>
      <SegmentedControl
        label="Units"
        options={[
          { value: 'kg', label: 'kg' },
          { value: 'lb', label: 'lb' },
        ]}
        value={current.units}
        onChange={(v) => {
          setCurrent(settings.setUnits(v as Units));
          refresh();
        }}
      />
      <SettingRow
        label="Default rest time"
        hint="Starts after you tick a set"
        value={`${formatCountdown(current.defaultRestSeconds)} ›`}
        onClick={nextRest}
      />
      <SettingsGroupLabel>Your data</SettingsGroupLabel>
      <SettingRow
        label="Export data"
        hint={exported ? `Saved ${exported}` : 'Download everything as JSON'}
        value="Export"
        tone="accent"
        onClick={() => {
          const { filename, json } = dataTransfer.exportData();
          download(filename, json);
          setExported(filename);
        }}
      />
      <SettingRow
        label="Import data"
        hint="Load a Dumbbell Dude JSON backup"
        value="Import"
        tone="accent"
        onClick={() => fileRef.current?.click()}
      />
      {importError && (
        <p className="inline-error" role="alert">
          {importError}
        </p>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        data-testid="import-input"
        onChange={(e) => void onFile(e)}
      />
      <SettingRow
        label="Reset everything"
        hint="Wipes workouts, routines and settings"
        value="›"
        tone="danger"
        onClick={() => setConfirmReset(true)}
      />
      <SettingsGroupLabel>Dumbbell Dude v1 · Lift heavy, log heavier</SettingsGroupLabel>
      <Modal
        open={importState !== null}
        title="Import backup?"
        message={
          importState
            ? `${importState.filename} · ${importState.preview.workouts} workouts, ${importState.preview.routines} routines. This replaces the data on this device.`
            : ''
        }
        confirmLabel="Import"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (importState) dataTransfer.applyImport(importState.preview);
          setImportState(null);
          refresh();
          navigate('/');
        }}
        onCancel={() => setImportState(null)}
      />
      <Modal
        open={confirmReset}
        danger
        title="Reset everything?"
        message="All workouts, routines, custom exercises and settings on this device will be deleted. Export first if you want a backup."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={() => {
          dataTransfer.resetAll();
          setConfirmReset(false);
          refresh();
          navigate('/');
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
