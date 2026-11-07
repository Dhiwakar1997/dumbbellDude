import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { chartScale, LineChart } from './LineChart';

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

describe('LineChart delta', () => {
  const points = [
    { label: 'Oct 1', value: 100 },
    { label: 'Oct 8', value: 90 },
  ];

  it('does not show a drop in the success colour', () => {
    render(createElement(LineChart, { title: 'Best set', points, unit: 'kg', emptyText: '', delta: '−10 kg in 7 days', deltaDown: true }));
    expect(screen.getByText('−10 kg in 7 days')).toHaveClass('is-down');
  });

  it('shows a gain in the success colour', () => {
    render(createElement(LineChart, { title: 'Best set', points, unit: 'kg', emptyText: '', delta: '+10 kg in 7 days' }));
    expect(screen.getByText('+10 kg in 7 days')).not.toHaveClass('is-down');
  });
});
