// trussel: T-DYWZRNANNY@1

// Implements C-W21Z71AA4M AppHeader (no action = state noaction).
// trussel: T-ZY2QM99JEG@1
export function AppHeader(props: {
  eyebrow: string;
  title: string;
  action?: { label: string; onClick: () => void };
}): JSX.Element {
  return (
    <header className="appheader">
      <div className="appheader-text">
        <p className="appheader-eyebrow">{props.eyebrow}</p>
        <h1 className="appheader-title">{props.title}</h1>
      </div>
      {props.action && (
        <button type="button" className="appheader-action" onClick={props.action.onClick}>
          {props.action.label}
        </button>
      )}
    </header>
  );
}
