import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Modal } from './Modal';

function ModalHarness(props: { danger?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <button type="button">Behind</button>
      <Modal
        open={open}
        danger={props.danger}
        title="Sure?"
        message="Really."
        confirmLabel="Yes"
        cancelLabel="No"
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

function SheetHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <BottomSheet open={open} label="Sheet" onClose={() => setOpen(false)}>
        <input aria-label="Name" />
        <button type="button">Save</button>
      </BottomSheet>
    </>
  );
}

describe('dialog focus', () => {
  it('keeps Tab inside an open modal and returns focus to the opener when it closes', () => {
    render(<ModalHarness />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole('button', { name: 'Yes' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('button', { name: 'No' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(screen.getByRole('button', { name: 'Yes' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it('starts a destructive modal on the cancel button', () => {
    render(<ModalHarness danger />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('button', { name: 'No' })).toHaveFocus();
  });

  it('moves focus into a bottom sheet and wraps Tab within it', () => {
    render(<SheetHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const sheet = screen.getByRole('dialog', { name: 'Sheet' });
    expect(sheet).toHaveFocus();
    screen.getByRole('button', { name: 'Save' }).focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  });
});
