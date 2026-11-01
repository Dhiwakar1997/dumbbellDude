// trussel: T-8CMH26ZQDM@1
import { Children } from 'react';
import type { ReactNode } from 'react';

// Implements C-H00R71NPHW WeekStatRow and C-KZ1JW6QA0B WorkoutSummaryStats.
// trussel: T-TETC4NM269@1
export function StatRow(props: { children: ReactNode }): JSX.Element {
  const three = Children.count(props.children) >= 3;
  return <div className={`statrow${three ? ' is-three' : ''}`}>{props.children}</div>;
}
