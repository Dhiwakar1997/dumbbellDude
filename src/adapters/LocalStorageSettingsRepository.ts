// trussel: T-24Q59G82H0@1
import { DEFAULT_SETTINGS } from '../domain/model';
import type { Settings } from '../domain/model';
import type { SettingsRepository } from '../application/ports';
import { LocalStorageStore } from './storage';

const SETTINGS = 'settings';


// Shape guard(s) for data read back from storage; anything failing is treated as absent.
type Rec = Record<string, unknown>;
const isObj = (x: unknown): x is Rec => typeof x === 'object' && x !== null && !Array.isArray(x);
function isRecord(x: unknown): x is Rec {
  return isObj(x);
}

// trussel: T-3PGZDK46XR@1
export class LocalStorageSettingsRepository implements SettingsRepository {
  constructor(private readonly store: LocalStorageStore) {}

  get(): Settings {
    const stored = this.store.read<Record<string, unknown>>(SETTINGS, {}, isRecord);
    const units = stored.units === 'kg' || stored.units === 'lb' ? stored.units : DEFAULT_SETTINGS.units;
    const rest = stored.defaultRestSeconds;
    const defaultRestSeconds =
      typeof rest === 'number' && Number.isInteger(rest) && rest >= 0 && rest <= 600
        ? rest
        : DEFAULT_SETTINGS.defaultRestSeconds;
    return { units, defaultRestSeconds };
  }

  save(settings: Settings): void {
    this.store.write(SETTINGS, settings);
  }

  clear(): void {
    this.store.remove(SETTINGS);
  }
}
