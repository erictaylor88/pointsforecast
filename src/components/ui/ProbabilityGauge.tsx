interface ProbabilityGaugeProps {
  probability: number; // 0-1
  size?: number; // px, default 64
}

function getSignalColor(p: number): string {
  if (p >= 0.6) return "#16A34A"; // signal-high
  if (p >= 0.3) return "#CA8A04"; // signal-medium
  return "#9B9B9B"; // signal-low
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function ProbabilityGauge({
  probability,
  size = 64,
}: ProbabilityGaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;
  const strokeWidth = 5;

  // Arc from 135° (7 o'clock) to 405° (5 o'clock) = 270° total
  const startAngle = 135;
  const totalSweep = 270;
  const endAngle = startAngle + totalSweep;
  const fillEnd = startAngle + totalSweep * Math.min(Math.max(probability, 0), 1);

  const trackPath = describeArc(cx, cy, r, startAngle, endAngle);
  const fillPath =
    probability > 0.01
      ? describeArc(cx, cy, r, startAngle, fillEnd)
      : "";

  const color = getSignalColor(probability);
  const pct = Math.round(probability * 100);

  // Font sizes scale with gauge size
  const numSize = size >= 64 ? 22 : 17;
  const pctSize = size >= 64 ? 10 : 8;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-label={`${pct}% likelihood`}
    >
      {/* Track */}
      <path
        d={trackPath}
        stroke="#E8E6E1"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      {/* Fill */}
      {fillPath && (
        <path
          d={fillPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      )}
      {/* Number */}
      <text
        x={cx}
        y={cy - 1}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontFamily: "var(--font-mono), monospace" }}
        fontWeight="500"
        fontSize={numSize}
        letterSpacing="-0.02em"
        fill="#1A1A1A"
      >
        {pct}
      </text>
      {/* % symbol */}
      <text
        x={cx}
        y={cy + numSize * 0.6}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
        fontWeight="400"
        fontSize={pctSize}
        fill="#9B9B9B"
      >
        %
      </text>
    </svg>
  );
}
