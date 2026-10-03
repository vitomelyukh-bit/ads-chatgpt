export function SectionLabel({ n, children }: { n?: string; children: React.ReactNode }) {
  return (
    <p className="label-mono flex items-center gap-3 text-fg-mute">
      {n && <span className="text-accent">{n}</span>}
      {n && <span aria-hidden="true" className="h-px w-6 bg-line-strong" />}
      {children}
    </p>
  );
}
