// trussel: T-FKWA451SF1@1

// Implements C-9Z7MXPTQ49 RoutineExerciseRow (state error). Adds a Remove control (design gap, see build log).
// trussel: T-HS1F6S107D@1
export function RoutineExerciseRow(props: {
  order: number;
  name: string;
  muscle: string;
  sets: string;
  reps: string;
  error?: string | null;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSetsChange: (v: string) => void;
  onRepsChange: (v: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}): JSX.Element {
  return (
    <div className={`rexrow${props.error ? ' is-error' : ''}`} data-testid="routine-row">
      <div className="rexrow-main">
        <div className="rexrow-text">
          <p className="rexrow-name">
            <span className="rexrow-order">{props.order}</span>
            <span>{props.name}</span>
          </p>
          <p className="rexrow-muscle">
            {props.muscle}
            <button type="button" className="rexrow-remove" onClick={props.onRemove} aria-label={`Remove ${props.name}`}>
              Remove
            </button>
          </p>
        </div>
        <div className="rexrow-target">
          <input
            className="rexrow-num"
            inputMode="numeric"
            value={props.sets}
            onChange={(e) => props.onSetsChange(e.target.value)}
            aria-label={`${props.name} target sets`}
          />
          <span className="rexrow-x">×</span>
          <input
            className="rexrow-num"
            inputMode="numeric"
            value={props.reps}
            onChange={(e) => props.onRepsChange(e.target.value)}
            aria-label={`${props.name} target reps`}
          />
        </div>
        <div className="rexrow-move">
          <button type="button" onClick={props.onMoveUp} disabled={!props.canMoveUp} aria-label={`Move ${props.name} up`}>
            ▲
          </button>
          <button type="button" onClick={props.onMoveDown} disabled={!props.canMoveDown} aria-label={`Move ${props.name} down`}>
            ▼
          </button>
        </div>
      </div>
      {props.error && (
        <p className="rexrow-error" role="alert">
          {props.error}
        </p>
      )}
    </div>
  );
}
