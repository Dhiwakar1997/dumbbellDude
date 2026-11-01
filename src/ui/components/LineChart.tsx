// trussel: T-5GTABSSBCB@1
// Hand-rolled SVG line chart (no chart library), geometry from the design: viewBox 340×180, plot x 40..320, y 20..160.

const X0 = 40;
const X1 = 320;
const Y0 = 20;
const Y1 = 160;

function niceStep(range: number): number {
  const raw = range / 3;
  const pow = 10 ** Math.floor(Math.log10(raw || 1));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * pow >= raw) return m * pow;
  return 10 * pow;
}

export function chartScale(values: number[]): { min: number; max: number; ticks: number[] } {
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  if (hi - lo < 1e-9) {
    lo -= 5;
    hi += 5;
  }
  const step = niceStep(hi - lo);
  const min = Math.floor(lo / step) * step;
  const max = Math.max(min + 3 * step, Math.ceil(hi / step) * step);
  const ticks: number[] = [];
  for (let t = max; t >= min - 1e-9; t -= (max - min) / 3) ticks.push(Math.round(t * 100) / 100);
  return { min, max, ticks };
}

// Implements C-0PNTT5SFWD LineChart (state empty when fewer than 2 points).
// trussel: T-3RAND8YAZJ@1
export function LineChart(props: {
  title: string;
  points: { label: string; value: number }[];
  delta?: string;
  unit: string;
  emptyText: string;
}): JSX.Element {
  const { points } = props;
  const empty = points.length < 2;

  let body: JSX.Element;
  if (empty) {
    body = <p className="linechart-empty">{props.emptyText}</p>;
  } else {
    const { min, max, ticks } = chartScale(points.map((p) => p.value));
    const x = (i: number) => X0 + (i * (X1 - X0)) / (points.length - 1);
    const y = (v: number) => Y1 - ((v - min) / (max - min)) * (Y1 - Y0);
    const coords = points.map((p, i) => [x(i), y(p.value)] as const);
    const line = coords.map(([cx, cy], i) => `${i === 0 ? 'M' : 'L'}${cx.toFixed(1)} ${cy.toFixed(1)}`).join(' ');
    const area = `${line} L${X1} ${Y1} L${X0} ${Y1} Z`;
    const mid = Math.floor((points.length - 1) / 2);
    const first = points[0]!;
    const last = points[points.length - 1]!;
    body = (
      <svg
        viewBox="0 0 340 180"
        role="img"
        aria-label={`${props.title}: from ${first.value} ${props.unit} on ${first.label} to ${last.value} ${props.unit} on ${last.label}`}
      >
        <g className="linechart-grid">
          {ticks.map((t) => (
            <line key={t} x1="36" y1={y(t)} x2="332" y2={y(t)} />
          ))}
        </g>
        <g className="linechart-y">
          {ticks.map((t) => (
            <text key={t} x="30" y={y(t) + 4}>
              {Number.isInteger(t) ? t : t.toFixed(1)}
            </text>
          ))}
        </g>
        <path className="linechart-area" d={area} />
        <path className="linechart-line" d={line} />
        <g className="linechart-dots">
          {coords.map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i === coords.length - 1 ? 6 : 4}
              className={i === coords.length - 1 ? 'linechart-last' : undefined}
            />
          ))}
        </g>
        <g className="linechart-x">
          <text x={x(0)} y="176">
            {first.label}
          </text>
          {points.length > 2 && (
            <text x={x(mid)} y="176">
              {points[mid]!.label}
            </text>
          )}
          <text x={x(points.length - 1)} y="176">
            {last.label}
          </text>
        </g>
      </svg>
    );
  }

  return (
    <figure className={`linechart${empty ? ' is-empty' : ''}`}>
      <figcaption className="linechart-head">
        <span className="linechart-title">{props.title}</span>
        {!empty && props.delta && <span className="linechart-delta">{props.delta}</span>}
      </figcaption>
      {body}
    </figure>
  );
}
