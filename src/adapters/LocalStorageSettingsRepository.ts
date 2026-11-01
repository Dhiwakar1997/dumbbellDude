// trussel: T-24Q59G82H0@1
import { DEFAULT_SETTINGS } from '../domain/model';
import type { Settings } from '../domain/model';
import type { SettingsRepository } from '../application/ports';
import { isRecord } from './guards';
import { LocalStorageStore } from './storage';

const SETTINGS = 'settings';

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
