// trussel: T-3BEHHHVZEH@1

// Implements C-PGJPSBK6MH SectionTitle (no link = state nolink).
// trussel: T-0755PGGEF9@1
export function SectionTitle(props: { title: string; link?: { label: string; onClick: () => void } }): JSX.Element {
  return (
    <div className="sectiontitle">
      <h2>{props.title}</h2>
      {props.link && (
        <button type="button" className="sectiontitle-link" onClick={props.link.onClick}>
          {props.link.label}
        </button>
      )}
    </div>
  );
}
