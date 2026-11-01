// trussel: T-XQNKTNS8ZN@1
// Versioned, fault-tolerant localStorage access shared by every LocalStorage repository.

export const STORAGE_NAMESPACE = 'dumbbelldude';
export const SCHEMA_VERSION = 1;

/** The subset of the Web Storage API the store needs (lets tests pass an in-memory map). */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface Envelope<T> {
  schemaVersion: number;
  data: T;
}

export class MemoryStorage implements KeyValueStorage {
  private readonly map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

// trussel: T-TARHR5WN3J@1
export class LocalStorageStore {
  private readonly storage: KeyValueStorage;

  constructor(storage?: KeyValueStorage) {
    this.storage = storage ?? LocalStorageStore.browserStorage();
  }

  private static browserStorage(): KeyValueStorage {
    try {
      if (typeof globalThis.localStorage !== 'undefined') return globalThis.localStorage;
    } catch {
      // Access can throw in privacy modes; fall back to memory.
    }
    return new MemoryStorage();
  }

  key(collection: string): string {
    return `${STORAGE_NAMESPACE}:v${SCHEMA_VERSION}:${collection}`;
  }

  read<T>(collection: string, fallback: T, isValid: (x: unknown) => x is T): T {
    let raw: string | null;
    try {
      raw = this.storage.getItem(this.key(collection));
    } catch {
      return fallback;
    }
    if (raw === null) return fallback;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.warn(`[dumbbelldude] Ignoring corrupt data in "${collection}".`);
      return fallback;
    }
    const envelope = parsed as Partial<Envelope<unknown>> | null;
    if (!envelope || typeof envelope !== 'object' || envelope.schemaVersion !== SCHEMA_VERSION) {
      console.warn(`[dumbbelldude] Unknown schema in "${collection}"; using defaults.`);
      return fallback;
    }
    if (!isValid(envelope.data)) {
      console.warn(`[dumbbelldude] Invalid data shape in "${collection}"; using defaults.`);
      return fallback;
    }
    return envelope.data;
  }

  write<T>(collection: string, data: T): void {
    const envelope: Envelope<T> = { schemaVersion: SCHEMA_VERSION, data };
    try {
      this.storage.setItem(this.key(collection), JSON.stringify(envelope));
    } catch (error) {
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
        throw new Error('Storage is full.');
      }
      throw error;
    }
  }

  remove(collection: string): void {
    this.storage.removeItem(this.key(collection));
  }
}
