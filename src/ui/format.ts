// trussel: T-ZR5DY2ZTTH@1
// Display helpers for dates, durations and timers. Pure, no React. Day-month order as in the design.
import { startOfWeek } from '../domain/streak';

const pad = (n: number) => String(n).padStart(2, '0');

function parse(iso: string): Date | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

// trussel: T-EZ8FQFE7ES@1
export function formatShortDate(iso: string): string {
  const d = parse(iso);
  if (!d) return '';
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'short' });
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  return `${weekday} ${d.getDate()} ${month}`;
}

// trussel: T-F01G87CW3P@1
export function formatLongDate(date: Date): string {
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  return `${weekday}, ${date.getDate()} ${month}`;
}

// trussel: T-7PFY89B0C0@1
export function formatTimeOfDay(iso: string): string {
  const d = parse(iso);
  return d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : '';
}

// trussel: T-X6EGEZQPTR@1
export function formatElapsed(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

// trussel: T-XNYWX6XVVP@1
export function formatCountdown(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
}

// trussel: T-VYTXMQ54SK@1
export function formatMinutes(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest === 0 ? `${h} h` : `${h} h ${rest} min`;
}

// trussel: T-QXTFFZXTQJ@1
export function weekGroupLabel(iso: string, now: Date): string {
  const d = parse(iso);
  if (!d) return '';
  const thisWeek = startOfWeek(now).getTime();
  const week = startOfWeek(d);
  const diffWeeks = Math.round((thisWeek - week.getTime()) / (7 * 24 * 3600 * 1000));
  if (diffWeeks <= 0) return 'This week';
  if (diffWeeks === 1) return 'Last week';
  return `Week of ${week.getDate()} ${week.toLocaleDateString('en-GB', { month: 'short' })}`;
}
