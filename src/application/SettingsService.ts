// trussel: T-JT5MGN6CNJ@1
import { ValidationError } from '../domain/model';
import type { Settings, Units } from '../domain/model';
import type { SettingsRepository } from './ports';

// trussel: T-KPEVC9RKQQ@1
export class SettingsService {
  constructor(private readonly settings: SettingsRepository) {}

  // trussel: T-7STVKC6E1N@1
  getSettings(): Settings {
    return this.settings.get();
  }

  // trussel: T-8B25B9Y65G@1
  setUnits(units: Units): Settings {
    if (units !== 'kg' && units !== 'lb') throw new ValidationError('Pick kg or lb.', 'units');
    // Preference only: stored weights stay in kg.
    const next = { ...this.settings.get(), units };
    this.settings.save(next);
    return next;
  }

  // trussel: T-Q9V4JE22Q1@1
  setDefaultRest(seconds: number): Settings {
    if (!Number.isInteger(seconds) || seconds < 0 || seconds > 600) {
      throw new ValidationError('Rest between 0 and 10 minutes.', 'defaultRestSeconds');
    }
    const next = { ...this.settings.get(), defaultRestSeconds: seconds };
    this.settings.save(next);
    return next;
  }
}
