// trussel: T-GDNNVQGK8E@1

// Implements C-44T3FSYACR PRRow.
// trussel: T-4PAFWCTCCV@1
export function PRRow(props: { kind: string; date: string; value: string }): JSX.Element {
  return (
    <li className="prrow">
      <span className="prrow-badge" aria-hidden="true">
        PR
      </span>
      <div className="prrow-text">
        <p className="prrow-kind">{props.kind}</p>
        <p className="prrow-date">{props.date}</p>
      </div>
      <span className="prrow-value">{props.value}</span>
    </li>
  );
}
