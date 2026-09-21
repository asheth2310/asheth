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
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-50">
        {title}
      </h2>
      {sub && (
        <p className="mt-4 max-w-2xl text-zinc-400 leading-relaxed">{sub}</p>
      )}
    </div>
  );
}
