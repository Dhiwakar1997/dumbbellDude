// trussel: T-8E81202NCT@1
import type { Clock, IdGenerator } from '../application/ports';

// trussel: T-H4YJRAE95X@1
export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

// trussel: T-XYV4Y4EY3N@1
export class UuidGenerator implements IdGenerator {
  next(): string {
    const c = globalThis.crypto;
    if (c && typeof c.randomUUID === 'function') return c.randomUUID();
    // RFC 4122 v4 fallback for older browsers.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
      const r = (Math.random() * 16) | 0;
      const v = ch === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
