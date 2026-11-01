// trussel: T-6XF838MSRV@1

// Implements C-2P80YNQKJR SearchField (focused via :focus-within).
// trussel: T-P8CM20W609@1
export function SearchField(props: { value: string; onChange: (v: string) => void; placeholder: string }): JSX.Element {
  return (
    <div className="searchfield">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>
      <input
        className="searchfield-input"
        type="search"
        value={props.value}
        placeholder={props.placeholder}
        aria-label={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
