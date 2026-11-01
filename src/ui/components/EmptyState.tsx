// trussel: T-7TBYYZ9PJX@1
import type { ReactNode } from 'react';

// Implements C-J0PKS9XF4S EmptyState.
// trussel: T-NXA1V9GY0K@1
export function EmptyState(props: { title: string; body: string; children?: ReactNode }): JSX.Element {
  return (
    <section className="emptystate">
      <div className="emptystate-art" aria-hidden="true">
        <svg viewBox="0 0 96 48">
          <rect x="4" y="12" width="12" height="24" rx="3" />
          <rect x="18" y="6" width="12" height="36" rx="3" />
          <rect x="30" y="21" width="36" height="6" rx="3" />
          <rect x="66" y="6" width="12" height="36" rx="3" />
          <rect x="80" y="12" width="12" height="24" rx="3" />
        </svg>
      </div>
      <h2 className="emptystate-title">{props.title}</h2>
      <p className="emptystate-body">{props.body}</p>
      {props.children}
    </section>
  );
}
