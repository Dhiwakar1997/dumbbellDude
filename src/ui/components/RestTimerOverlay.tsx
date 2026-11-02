// trussel: T-KX8F3F3WTT@1
import { formatCountdown } from '../format';

const CIRCUMFERENCE = 327;

// Implements C-610GB7K16B RestTimerOverlay (overlay screen S-BGYY020JSP, state done).
// trussel: T-QR0KRTVZ57@1
export function RestTimerOverlay(props: {
  open: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  next: string;
  onMinus: () => void;
  onPlus: () => void;
  onSkip: () => void;
}): JSX.Element | null {
  if (!props.open) return null;
  const done = props.remainingSeconds <= 0;
  const fraction = props.totalSeconds > 0 ? Math.max(0, Math.min(1, props.remainingSeconds / props.totalSeconds)) : 0;
  return (
    <div className={`resttimer${done ? ' is-done' : ''}`} role="dialog" aria-label="Rest timer">
      <p className="resttimer-label">{done ? 'Rest over. Back to it.' : 'Rest. You earned it.'}</p>
      <div className="resttimer-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="resttimer-track" cx="60" cy="60" r="52" />
          <circle
            className="resttimer-progress"
            cx="60"
            cy="60"
            r="52"
            style={{ strokeDashoffset: CIRCUMFERENCE * (1 - fraction) }}
          />
        </svg>
        <span className="resttimer-time" role="timer">
          {formatCountdown(props.remainingSeconds)}
        </span>
      </div>
      <p className="resttimer-next">{props.next}</p>
      <div className="resttimer-actions">
        <button type="button" className="resttimer-btn" onClick={props.onMinus} aria-label="Minus 15 seconds">
          −15s
        </button>
        <button type="button" className="resttimer-btn" onClick={props.onPlus} aria-label="Plus 15 seconds">
          +15s
        </button>
        <button type="button" className="resttimer-btn resttimer-skip" onClick={props.onSkip}>
          {done ? 'Done' : 'Skip'}
        </button>
      </div>
    </div>
  );
}
