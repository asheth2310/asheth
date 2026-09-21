interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  sub?: string;
}

export function SectionHeading({ index, label, title, sub }: SectionHeadingProps) {
  return (
    <div className="mb-8 md:mb-10">
      <p className="font-mono text-xs tracking-[0.25em] text-emerald-400/90 mb-4">
        {"//"} {index} · {label}
      </p>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-ink-hi">
        {title}
      </h2>
      {sub && (
        <p className="mt-4 max-w-2xl text-ink-mid leading-relaxed">{sub}</p>
      )}
    </div>
  );
}
