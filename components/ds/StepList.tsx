// StepList: passi numerati in colonna. Il numero lo mette il CSS.
export function StepList({ passi, headingLevel = 3 }: { passi: { titolo: string; testo: string }[]; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <ol className="tt-steps">
      {passi.map((p) => (
        <li key={p.titolo}>
          <div>
            <H>{p.titolo}</H>
            <p>{p.testo}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
