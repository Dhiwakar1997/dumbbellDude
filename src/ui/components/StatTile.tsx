// trussel: T-HVYEZ8GAZA@1

// Implements C-7WBSGTY0J4 StatTile (state accent).
// trussel: T-F191YC8GDZ@1
export function StatTile(props: { label: string; value: string; unit?: string; accent?: boolean }): JSX.Element {
  return (
    <div className={`stattile${props.accent ? ' is-accent' : ''}`}>
      <p className="stattile-label">{props.label}</p>
      <p className="stattile-value">
        <span>{props.value}</span>
        {props.unit && <span className="stattile-unit">{props.unit}</span>}
      </p>
    </div>
  );
}
