// trussel: T-SVKY5SVGVN@1
import type { ReactNode } from 'react';

// Implements C-NZWWYJ84GF StickyFooter (state abovetabs).
// trussel: T-JZ1NXGBKDN@1
export function StickyFooter(props: { children: ReactNode; aboveTabs?: boolean }): JSX.Element {
  return <div className={`stickyfooter${props.aboveTabs ? ' is-abovetabs' : ''}`}>{props.children}</div>;
}
