// Stelle delle recensioni (.tt-stars): voto sempre nel testo alternativo.
const STELLA = "M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

export function Stars({ voto, etichetta }: { voto: number; etichetta?: string }) {
  const piene = Math.round(voto);
  return (
    <span className="tt-stars" role="img" aria-label={etichetta ?? `${voto.toLocaleString("it-IT")} stelle su 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true" className={i < piene ? undefined : "is-empty"}><path d={STELLA} /></svg>
      ))}
    </span>
  );
}
