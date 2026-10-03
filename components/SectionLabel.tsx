export function SectionLabel({ n, children, inverse = false }: { n?: string; children: React.ReactNode; inverse?: boolean }) {
  return (
    <p className={`label-mono flex items-center gap-3 ${inverse ? "text-paper/70" : "text-ink-mute"}`}>
      {n && <span className={inverse ? "text-accent" : "text-ink"}>{n}</span>}
      <span aria-hidden="true" className={`h-px w-8 ${inverse ? "bg-paper/40" : "bg-ink/30"}`} />
      {children}
    </p>
  );
}
