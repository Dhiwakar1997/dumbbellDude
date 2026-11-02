// trussel: T-5Q00DV8DM6@1
import type { ReactNode } from 'react';

// Implements C-MY23KHP4MG SettingRow (states accent / import → accent, danger).
// trussel: T-AFT3M6XBQY@1
export function SettingRow(props: {
  label: string;
  hint: string;
  value: string;
  tone?: 'default' | 'accent' | 'danger';
  onClick: () => void;
}): JSX.Element {
  const tone = props.tone ?? 'default';
  return (
    <button type="button" className={`settingrow${tone === 'default' ? '' : ` is-${tone}`}`} onClick={props.onClick}>
      <span className="settingrow-text">
        <span className="settingrow-label" style={{ display: 'block' }}>
          {props.label}
        </span>
        <span className="settingrow-hint" style={{ display: 'block' }}>
          {props.hint}
        </span>
      </span>
      <span className="settingrow-value">{props.value}</span>
    </button>
  );
}

// Implements C-Z2R65CPEEE SegmentedControl (state b = second option).
// trussel: T-0RYEMDY8M2@1
export function SegmentedControl(props: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}): JSX.Element {
  return (
    <div className="segmented">
      <span className="segmented-label" id="segmented-label">
        {props.label}
      </span>
      <div className="segmented-track" role="radiogroup" aria-label={props.label}>
        {props.options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === props.value}
            className={`segmented-opt${o.value === props.value ? ' is-selected' : ''}`}
            onClick={() => props.onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Implements C-5XHYBWCGT0 SettingsGroupLabel.
// trussel: T-QJCXP0VSRS@1
export function SettingsGroupLabel(props: { children: ReactNode }): JSX.Element {
  return <h2 className="settingsgroup">{props.children}</h2>;
}
