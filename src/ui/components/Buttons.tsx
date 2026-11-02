// trussel: T-JM26XRD87N@1
import type { ReactNode } from 'react';

// Implements C-9YSZYWVH8J PrimaryButton (states disabled, danger).
// trussel: T-JAZ8S1HEMP@1
export function PrimaryButton(props: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  type?: 'button' | 'submit';
}): JSX.Element {
  const cls = `primarybtn${props.disabled ? ' is-disabled' : ''}${props.danger ? ' is-danger' : ''}`;
  return (
    <button type={props.type ?? 'button'} className={cls} onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </button>
  );
}

// Implements C-TVFATMYR0Q SecondaryButton (states danger, ghost).
// trussel: T-547CJRPGCV@1
export function SecondaryButton(props: {
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  ghost?: boolean;
}): JSX.Element {
  const cls = `secondarybtn${props.danger ? ' is-danger' : ''}${props.ghost ? ' is-ghost' : ''}`;
  return (
    <button type="button" className={cls} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
