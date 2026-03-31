interface IssuerBadgeProps {
  slug: string;
  shortName: string;
}

const issuerStyles: Record<string, string> = {
  "chase-ur": "bg-chase-light text-chase",
  "amex-mr": "bg-amex-light text-amex",
  "capital-one": "bg-capital-one-light text-capital-one",
};

export function IssuerBadge({ slug, shortName }: IssuerBadgeProps) {
  const style = issuerStyles[slug] ?? "bg-bg-subtle text-text-secondary";
  return (
    <span
      className={`inline-flex items-center h-5 px-2 rounded text-caption uppercase tracking-wider ${style}`}
    >
      {shortName}
    </span>
  );
}
