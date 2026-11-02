import { formatWeight, fromDisplayWeight, kgToLb, lbToKg, toDisplayWeight } from './units';

describe('units', () => {
  it('converts kg <-> lb', () => {
    expect(kgToLb(100)).toBeCloseTo(220.462, 3);
    expect(lbToKg(225)).toBeCloseTo(102.058, 3);
    expect(kgToLb(lbToKg(135))).toBeCloseTo(135, 9);
  });

  it('rounds for display only', () => {
    expect(toDisplayWeight(62.5, 'kg')).toBe(62.5);
    expect(toDisplayWeight(100, 'lb')).toBe(220.5);
    expect(toDisplayWeight(-5, 'kg')).toBe(0);
    expect(toDisplayWeight(Number.NaN, 'lb')).toBe(0);
  });

  it('stores typed lb values as kg that display back identically', () => {
    const kg = fromDisplayWeight(135, 'lb');
    expect(kg).toBeCloseTo(61.235, 3);
    expect(toDisplayWeight(kg, 'lb')).toBe(135);
    expect(fromDisplayWeight(62.5, 'kg')).toBe(62.5);
    expect(fromDisplayWeight(-1, 'kg')).toBe(0);
  });

  it('formats weights and volume', () => {
    expect(formatWeight(62.5, 'kg')).toBe('62.5 kg');
    expect(formatWeight(6240, 'kg')).toBe('6,240 kg');
    expect(formatWeight(14200, 'kg', { compact: true })).toBe('14.2k kg');
    expect(formatWeight(9999, 'kg', { compact: true })).toBe('9,999 kg');
    expect(formatWeight(0, 'kg')).toBe('0 kg');
    expect(formatWeight(100, 'lb')).toBe('220.5 lb');
  });
});
