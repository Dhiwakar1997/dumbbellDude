// trussel: T-16T7AN7ZT6@1
import { useId } from 'react';

// Implements C-TGPP7GS8ST TextField (states placeholder, error, inset).
// trussel: T-28S6VSQ79K@1
export function TextField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  placeholder?: string;
  as?: 'input' | 'select';
  options?: { value: string; label: string }[];
}): JSX.Element {
  const id = useId();
  const errorId = `${id}-error`;
  const common = {
    id,
    className: 'textfield-input',
    value: props.value,
    'aria-invalid': props.error ? true : undefined,
    'aria-describedby': props.error ? errorId : undefined,
  } as const;
  return (
    <div className={`textfield${props.error ? ' is-error' : ''}`}>
      <label className="textfield-label" htmlFor={id}>
        {props.label}
      </label>
      {props.as === 'select' ? (
        <select {...common} onChange={(e) => props.onChange(e.target.value)}>
          {(props.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...common} type="text" placeholder={props.placeholder} onChange={(e) => props.onChange(e.target.value)} />
      )}
      {props.error && (
        <span className="textfield-error" id={errorId} role="alert">
          {props.error}
        </span>
      )}
    </div>
  );
}
