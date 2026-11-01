// trussel: T-8W2MM52FQV@1

// Implements C-2586HK1N9A Chip (state selected).
// trussel: T-RHNGJG67XP@1
export function Chip(props: { label: string; selected: boolean; onClick: () => void }): JSX.Element {
  return (
    <button
      type="button"
      className={`chip${props.selected ? ' is-selected' : ''}`}
      aria-pressed={props.selected}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

// Implements C-QPQ8K6TKAH ChipFilter (selected option = state; wrap state).
// trussel: T-34K3GSTY7J@1
export function ChipFilter(props: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  wrap?: boolean;
  label: string;
}): JSX.Element {
  return (
    <div className={`chipfilter${props.wrap ? ' is-wrap' : ''}`} role="group" aria-label={props.label}>
      {props.options.map((o) => (
        <Chip key={o.value} label={o.label} selected={o.value === props.value} onClick={() => props.onChange(o.value)} />
      ))}
    </div>
  );
}
