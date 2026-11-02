// trussel: T-7SKE4M0B5P@1
// kg/lb conversion and weight formatting. All stored weights are kg; conversion happens only at the UI boundary.
import type { Units } from './model';

export const KG_PER_LB = 0.45359237;

function safe(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function round(n: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

// trussel: T-MTX7H0MW28@1
export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

// trussel: T-GPM6DFPD2S@1
export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

// trussel: T-PR9VZSS9BE@1
export function toDisplayWeight(kg: number, units: Units): number {
  const value = safe(kg);
  return units === 'lb' ? round(kgToLb(value), 1) : round(value, 2);
}

// trussel: T-7Q8NCZ56YW@1
export function fromDisplayWeight(value: number, units: Units): number {
  const v = safe(value);
  return units === 'lb' ? lbToKg(v) : v;
}

// trussel: T-6N2VWETMRT@1
export function formatWeight(kg: number, units: Units, options: { compact?: boolean } = {}): string {
  const value = toDisplayWeight(kg, units);
  if (options.compact && value >= 10_000) {
    const k = round(value / 1000, 1);
    return `${k.toLocaleString('en-US', { maximumFractionDigits: 1 })}k ${units}`;
  }
  const text = value.toLocaleString('en-US', { maximumFractionDigits: units === 'kg' ? 2 : 1 });
  return `${text} ${units}`;
}
