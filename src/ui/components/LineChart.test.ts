import { chartScale } from './LineChart';

describe('chartScale', () => {
  it('puts every tick on a round step value', () => {
    // These ranges span four steps; ticks used to be thirds of it (110, 96.7, 83.3, 70).
    expect(chartScale([74, 101])).toEqual({ min: 70, max: 110, ticks: [110, 100, 90, 80, 70] });
    expect(chartScale([164.6, 230.4])).toEqual({ min: 150, max: 250, ticks: [250, 225, 200, 175, 150] });
  });

  it('keeps at least three steps for a flat series', () => {
    expect(chartScale([60, 60]).ticks).toEqual([70, 65, 60, 55]);
  });
});
