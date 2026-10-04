import { Stars } from "./Stars";

// ReviewReply: una recensione e sotto la risposta del titolare, scritta da noi.
export function ReviewReply({ autore, voto, testo, risposta }: { autore: string; voto: number; testo: string; risposta: string }) {
  return (
    <div className="tt-review">
      <div className="tt-review__box"><p className="tt-review__who">{autore} <Stars voto={voto} etichetta={`${voto} stelle su 5`} /></p><p>{testo}</p></div>
      <div className="tt-review__box tt-review__box--reply"><p className="tt-review__who">Risposta del titolare</p><p>{risposta}</p></div>
    </div>
  );
}
