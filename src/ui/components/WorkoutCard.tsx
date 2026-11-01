// trussel: T-6WFWXP6EEQ@1

// Implements C-WWT1XVTC56 WorkoutCard (state nobadge when prCount is 0).
// trussel: T-1JH3FVCJXK@1
export function WorkoutCard(props: {
  date: string;
  title: string;
  exercises: string;
  duration: string;
  sets: number;
  volume: string;
  prCount: number;
  onClick: () => void;
}): JSX.Element {
  return (
    <button type="button" className="workoutcard" onClick={props.onClick}>
      <span className="workoutcard-top">
        <span className="workoutcard-date">{props.date}</span>
        {props.prCount > 0 && (
          <span className="workoutcard-pr">
            {props.prCount} {props.prCount === 1 ? 'PR' : 'PRs'}
          </span>
        )}
      </span>
      <span className="workoutcard-title" style={{ display: 'block' }}>
        {props.title}
      </span>
      <span className="workoutcard-exercises" style={{ display: 'block' }}>
        {props.exercises}
      </span>
      <span className="workoutcard-meta">
        <span>
          <b>{props.duration}</b> time
        </span>
        <span>
          <b>{props.sets}</b> sets
        </span>
        <span>
          <b>{props.volume}</b> volume
        </span>
      </span>
    </button>
  );
}
