import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useBack } from './useBack';

function Detail() {
  const back = useBack('/history');
  return (
    <button type="button" onClick={back}>
      Back
    </button>
  );
}

function Home() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate('/history/1')}>
      Open
    </button>
  );
}

function Where() {
  return <div data-testid="where">{useLocation().pathname}</div>;
}

function renderFrom(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<p>History</p>} />
        <Route path="/history/:id" element={<Detail />} />
      </Routes>
      <Where />
    </MemoryRouter>,
  );
}

describe('useBack', () => {
  it('goes to the fallback when the screen was opened directly', () => {
    renderFrom('/history/1');
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/history$/);
  });

  it('steps back through the app history when there is some', () => {
    renderFrom('/');
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/$/);
  });
});
