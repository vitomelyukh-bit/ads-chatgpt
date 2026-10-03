export const proseClass =
  "prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-ink prose-h2:text-4xl prose-h2:mt-14 prose-h3:text-2xl prose-p:text-ink-soft prose-li:text-ink-soft prose-li:marker:text-ink prose-strong:text-ink prose-a:text-ink prose-a:decoration-accent-strong prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:bg-accent-soft";

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className={proseClass}>{children}</div>;
}
