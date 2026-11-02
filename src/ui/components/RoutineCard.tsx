// trussel: T-4EP231AWFY@1

// Implements C-WQYJ5CAE3J RoutineCard (state edit).
// trussel: T-4ZNW004F9H@1
export function RoutineCard(props: {
  name: string;
  exercises: string;
  meta: string;
  actionLabel: 'Start' | 'Edit';
  onAction: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      className={`routinecard${props.actionLabel === 'Edit' ? ' is-edit' : ''}`}
      onClick={props.onAction}
      aria-label={`${props.actionLabel} ${props.name}`}
    >
      <span className="routinecard-text">
        <span className="routinecard-name" style={{ display: 'block' }}>
          {props.name}
        </span>
        <span className="routinecard-list" style={{ display: 'block' }}>
          {props.exercises}
        </span>
        <span className="routinecard-meta" style={{ display: 'block' }}>
          {props.meta}
        </span>
      </span>
      <span className="routinecard-go" aria-hidden="true">
        {props.actionLabel}
      </span>
    </button>
  );
}
