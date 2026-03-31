interface ConfidenceBadgeProps {
  confidence: "high" | "medium" | "low";
}

const styles = {
  high: "bg-signal-high-bg text-signal-high",
  medium: "bg-signal-medium-bg text-signal-medium",
  low: "bg-signal-low-bg text-signal-low",
};

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-md text-caption uppercase tracking-wider ${styles[confidence]}`}
    >
      {confidence}
    </span>
  );
}
