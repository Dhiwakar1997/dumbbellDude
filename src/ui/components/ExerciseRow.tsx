// trussel: T-07R7PTHA2W@1

// Implements C-GJKKCHEYVV ExerciseRow (states custom, pickable, selected).
// trussel: T-GTYQAAZYM4@1
export function ExerciseRow(props: {
  name: string;
  meta: string;
  custom?: boolean;
  mode?: 'view' | 'pick';
  selected?: boolean;
  onClick?: () => void;
}): JSX.Element {
  const pick = props.mode === 'pick';
  return (
    <button
      type="button"
      className={`exrow${props.selected ? ' is-selected' : ''}`}
      onClick={props.onClick}
      aria-pressed={pick ? Boolean(props.selected) : undefined}
    >
      <span className="exrow-icon" aria-hidden="true">
        {props.name.charAt(0).toUpperCase()}
      </span>
      <span className="exrow-text">
        <span className="exrow-name" style={{ display: 'block' }}>
          {props.name}
        </span>
        <span className="exrow-meta" style={{ display: 'block' }}>
          {props.meta}
        </span>
      </span>
      {props.custom && <span className="exrow-tag">Custom</span>}
      {pick && (
        <span className="exrow-add" aria-hidden="true">
          {props.selected ? '✓' : '+'}
        </span>
      )}
    </button>
  );
}
