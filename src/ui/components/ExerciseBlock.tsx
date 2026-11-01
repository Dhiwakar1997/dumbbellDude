// trussel: T-MPV7TDRFY2@1
// The three pieces of an active-workout exercise card: header, set rows, add-set footer.

// Implements C-CEJYG76YXT ExerciseBlockHeader.
// trussel: T-FYKJ50QC38@1
export function ExerciseBlockHeader(props: { name: string; muscle: string; unitLabel: string }): JSX.Element {
  return (
    <section className="exblock">
      <div className="exblock-head">
        <h3 className="exblock-name">{props.name}</h3>
        <p className="exblock-muscle">{props.muscle}</p>
      </div>
      <div className="exblock-cols" aria-hidden="true">
        <span>Set</span>
        <span>Previous</span>
        <span title={`Weight in ${props.unitLabel}`}>Weight</span>
        <span>Reps</span>
        <span>Done</span>
      </div>
    </section>
  );
}

// Implements C-XRJ49Y3XKF SetRow (states done, error).
// trussel: T-41F4YWWM2G@1
export function SetRow(props: {
  index: number;
  previous: string;
  weight: string;
  reps: string;
  unit: string;
  done: boolean;
  error?: string | null;
  onWeightChange: (v: string) => void;
  onRepsChange: (v: string) => void;
  onToggleDone: () => void;
}): JSX.Element {
  const n = props.index + 1;
  const cls = `setrow${props.done ? ' is-done' : ''}${props.error ? ' is-error' : ''}`;
  const errorId = `set-error-${n}-${props.previous}`.replace(/\W+/g, '-');
  return (
    <div className={cls} data-testid="set-row">
      <div className="setrow-main">
        <span className="setrow-num">{n}</span>
        <span className="setrow-prev">{props.previous}</span>
        <label className="setrow-field">
          <span className="visually-hidden">Set {n} weight</span>
          <input
            className="setrow-input"
            type="text"
            inputMode="decimal"
            value={props.weight}
            onChange={(e) => props.onWeightChange(e.target.value)}
            aria-label={`Set ${n} weight`}
          />
          <span className="setrow-unit">{props.unit}</span>
        </label>
        <label className="setrow-field setrow-field-reps">
          <span className="visually-hidden">Set {n} reps</span>
          <input
            className="setrow-input"
            type="text"
            inputMode="numeric"
            value={props.reps}
            onChange={(e) => props.onRepsChange(e.target.value)}
            aria-label={`Set ${n} reps`}
            aria-invalid={props.error ? true : undefined}
            aria-describedby={props.error ? errorId : undefined}
          />
          <span className="setrow-unit">reps</span>
        </label>
        <button
          type="button"
          className="setrow-tick"
          role="checkbox"
          aria-checked={props.done}
          aria-label={`Mark set ${n} done`}
          onClick={props.onToggleDone}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </button>
      </div>
      {props.error && (
        <p className="setrow-error" id={errorId} role="alert">
          {props.error}
        </p>
      )}
    </div>
  );
}

// Implements C-P546QY9WGR AddSetButton.
// trussel: T-ZN6NQS0J87@1
export function AddSetButton(props: { onClick: () => void }): JSX.Element {
  return (
    <div className="addset">
      <button type="button" className="addset-btn" onClick={props.onClick}>
        + Add set
      </button>
    </div>
  );
}
