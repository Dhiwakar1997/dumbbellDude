// trussel: T-2M7JGFGQK4@1
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useDialogFocus } from './useDialogFocus';

// Implements C-M9HKCJ8Q74 SheetHandle as part of a bottom sheet.
// trussel: T-4F4057C6AB@1
export function BottomSheet(props: {
  open: boolean;
  label: string;
  onClose: () => void;
  children: ReactNode;
}): JSX.Element | null {
  const { open, onClose } = props;
  const sheetRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open, sheetRef);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="sheet-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={props.label} ref={sheetRef} tabIndex={-1}>
        <div className="sheethandle" aria-hidden="true">
          <span />
        </div>
        {props.children}
      </div>
    </div>
  );
}
