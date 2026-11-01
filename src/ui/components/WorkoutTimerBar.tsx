// trussel: T-E7P1MDP3G7@1

// Implements C-B3YWXCKKEF WorkoutTimerBar (parts discard / finish).
// trussel: T-3WSEBR701F@1
export function WorkoutTimerBar(props: {
  name: string;
  elapsed: string;
  onDiscard: () => void;
  onFinish: () => void;
}): JSX.Element {
  return (
    <header className="timerbar">
      <button type="button" className="timerbar-discard" onClick={props.onDiscard}>
        Discard
      </button>
      <div className="timerbar-center">
        <p className="timerbar-name">{props.name}</p>
        <p className="timerbar-time" role="timer" aria-label="Elapsed time">
          {props.elapsed}
        </p>
      </div>
      <button type="button" className="timerbar-finish" onClick={props.onFinish}>
        Finish
      </button>
    </header>
  );
}
