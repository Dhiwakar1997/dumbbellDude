// trussel: T-2PZSQ8CWF7@1

// Implements C-R1A986TJBZ ExerciseSummaryHeader.
// trussel: T-BF12T2D9H5@1
export function ExerciseSummaryHeader(props: { name: string; total: string }): JSX.Element {
  return (
    <section className="exsummary">
      <div className="exsummary-head">
        <h3>{props.name}</h3>
        <span>{props.total}</span>
      </div>
    </section>
  );
}

// Implements C-GFP18A5XFT SetSummaryLine (states pr, last, lastpr).
// trussel: T-W09P97WCEP@1
export function SetSummaryLine(props: {
  index: number;
  weight: string;
  reps: number;
  volume: string;
  pr: boolean;
  last: boolean;
}): JSX.Element {
  return (
    <div className={`setline${props.pr ? ' is-pr' : ''}${props.last ? ' is-last' : ''}`} data-testid="set-line">
      <span className="setline-num">{props.index + 1}</span>
      <span className="setline-value">
        {props.weight} × {props.reps}
      </span>
      <span className="setline-vol">{props.volume}</span>
      <span className="setline-pr" aria-hidden={!props.pr}>
        PR
      </span>
    </div>
  );
}
