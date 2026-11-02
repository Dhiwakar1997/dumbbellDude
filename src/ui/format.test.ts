import {
  formatCountdown,
  formatElapsed,
  formatLongDate,
  formatMinutes,
  formatShortDate,
  formatTimeOfDay,
  weekGroupLabel,
} from './format';

describe('format', () => {
  it('formats dates like the design', () => {
    const d = new Date(2026, 9, 29, 18, 5);
    expect(formatShortDate(d.toISOString())).toBe('Thu 29 Oct');
    expect(formatLongDate(new Date(2026, 10, 1))).toBe('Sunday, 1 Nov');
    expect(formatTimeOfDay(d.toISOString())).toBe('18:05');
    expect(formatShortDate('nope')).toBe('');
  });

  it('formats timers and durations', () => {
    expect(formatElapsed(42 * 60 + 18)).toBe('00:42:18');
    expect(formatElapsed(-3)).toBe('00:00:00');
    expect(formatCountdown(84)).toBe('1:24');
    expect(formatCountdown(90)).toBe('1:30');
    expect(formatCountdown(-1)).toBe('0:00');
    expect(formatMinutes(58)).toBe('58 min');
    expect(formatMinutes(72)).toBe('1 h 12 min');
    expect(formatMinutes(120)).toBe('2 h');
  });

  it('labels history weeks', () => {
    const now = new Date(2026, 10, 1, 12); // Sunday
    expect(weekGroupLabel(new Date(2026, 9, 29).toISOString(), now)).toBe('This week');
    expect(weekGroupLabel(new Date(2026, 9, 23).toISOString(), now)).toBe('Last week');
    expect(weekGroupLabel(new Date(2026, 9, 14).toISOString(), now)).toBe('Week of 12 Oct');
  });
});
