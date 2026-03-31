const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface SeasonalityHeatmapProps {
  monthlyFrequency: number[]; // 12 values, 0-indexed from Jan
  currentMonth: number; // 0-indexed
}

function getHeatColor(value: number, max: number): string {
  if (max === 0) return "#F3F2EE";
  const intensity = value / max;
  if (intensity === 0) return "#F3F2EE";
  if (intensity < 0.33) return "#DCFCE7";
  if (intensity < 0.66) return "#86EFAC";
  return "#16A34A";
}

export function SeasonalityHeatmap({
  monthlyFrequency,
  currentMonth,
}: SeasonalityHeatmapProps) {
  const max = Math.max(...monthlyFrequency, 1);

  return (
    <div className="inline-flex gap-1" style={{ minWidth: "276px" }}>
      {monthlyFrequency.map((freq, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div
            className={`w-[20px] h-[20px] rounded-sm ${i === currentMonth ? "ring-1 ring-text-primary ring-offset-1" : ""}`}
            style={{ backgroundColor: getHeatColor(freq, max) }}
            title={`${MONTHS[i]}: ${freq} bonus${freq !== 1 ? "es" : ""}`}
          />
          <span className="text-[9px] text-text-tertiary leading-none select-none">
            {MONTHS[i][0]}
          </span>
        </div>
      ))}
    </div>
  );
}
