export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:tracking-tight prose-headings:text-ink prose-p:text-ink-soft prose-li:text-ink-soft prose-a:text-accent prose-a:underline-offset-2 prose-strong:text-ink">
      {children}
    </div>
  );
}
