export const proseClass =
  "prose prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-headings:font-semibold prose-h2:mt-14 prose-h2:text-3xl prose-h3:text-xl prose-p:text-fg-soft prose-li:text-fg-soft prose-li:marker:text-accent prose-strong:text-fg prose-a:text-fg prose-a:decoration-accent prose-a:underline-offset-4 hover:prose-a:text-accent";

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className={proseClass}>{children}</div>;
}
