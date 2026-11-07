// trussel: T-26HPQ654AY@1
import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { useDialogFocus } from './useDialogFocus';

// Implements C-GKKNW9VS4N Modal (state danger).
// trussel: T-E0GR6QP6Z0@1
export function Modal(props: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}): JSX.Element | null {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { open, onCancel } = props;
  // A destructive dialog starts on the safe choice, so a stray Enter cannot discard or delete.
  useDialogFocus(open, dialogRef, props.danger ? cancelRef : confirmRef);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="modal-scrim" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={`modal${props.danger ? ' is-danger' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef} tabIndex={-1}>
        <h2 className="modal-title" id={titleId}>
          {props.title}
        </h2>
        <p className="modal-message">{props.message}</p>
        <div className="modal-body">{props.children}</div>
        <div className="modal-actions">
          <button type="button" className="modal-cancel" onClick={onCancel} ref={cancelRef}>
            {props.cancelLabel}
          </button>
          <button type="button" className="modal-confirm" onClick={props.onConfirm} ref={confirmRef}>
            {props.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
