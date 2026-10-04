// SectionHeader: numero evidenziato, occhiello, titolo e una frase.
export function SectionHead({
  n,
  occhiello,
  children,
  testo,
  as: H = "h2",
}: {
  n?: string;
  occhiello: string;
  children: React.ReactNode;
  testo?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <header className="tt-section-head">
      <p className="tt-eyebrow">
        {n && <span className="tt-tag">{n}</span>} {occhiello}
      </p>
      <H>{children}</H>
      {testo && <p>{testo}</p>}
    </header>
  );
}
