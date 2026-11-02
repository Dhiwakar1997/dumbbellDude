// trussel: T-1BW1QGPDYH@1

// Implements C-RXZ2TBZDQT StreakBanner (state zero).
// trussel: T-00GRPTPDFC@1
export function StreakBanner(props: { days: number }): JSX.Element {
  const zero = props.days <= 0;
  return (
    <section className={`streak${zero ? ' is-zero' : ''}`} aria-label="Streak">
      <div className="streak-flame" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z" />
        </svg>
      </div>
      <div className="streak-text">
        <p className="streak-count">
          <span>{Math.max(0, props.days)}</span> day streak
        </p>
        <p className="streak-quip">
          {zero ? 'Every streak starts at day one. Today works.' : "Don't break it. The couch is watching."}
        </p>
      </div>
    </section>
  );
}
