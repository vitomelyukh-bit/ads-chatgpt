// Immagini dei prodotti da banco con la grafica vera della card.
// Piedistallo: foto del prodotto (espositore in PVC 148 × 105 mm, base 60 mm).
/* eslint-disable @next/next/no-img-element */
export function ProdottoFoto({ tipo }: { tipo: "card" | "piedistallo" }) {
  if (tipo === "card") {
    return (
      <div className="tt-prod tt-prod--card">
        <img src="/prodotti/card-recensioni.png" alt="Card per le recensioni: «Lasciaci una recensione su Google · Tocca qui»" width={540} height={894} loading="lazy" />
      </div>
    );
  }
  return (
    <div className="tt-prod tt-prod--foto">
      <img src="/prodotti/piedistallo.jpg" alt="Piedistallo da banco in PVC per le recensioni Google" width={900} height={518} loading="lazy" />
    </div>
  );
}

// Misure a confronto, in scala: telefono, card e piedistallo affiancati.
export function MisureConfronto() {
  const s = 1.25; // pixel per millimetro
  const box = (w: number, h: number) => ({ width: w * s, height: h * s });
  return (
    <figure className="tt-misure">
      <div className="tt-misure__fila">
        <div className="tt-misure__item">
          <div className="tt-misure__tel" style={box(71.5, 147)} aria-hidden="true" />
          <figcaption><strong>Il tuo telefono</strong><span>circa 15 × 7 cm</span></figcaption>
        </div>
        <div className="tt-misure__item">
          <img src="/prodotti/card-recensioni.png" alt="" style={{ ...box(54, 85.6), borderRadius: 4 * s }} className="tt-misure__card" />
          <figcaption><strong>Card</strong><span>8,6 × 5,4 cm, come una carta di credito</span></figcaption>
        </div>
        <div className="tt-misure__item">
          <div className="tt-misure__stand" style={box(105, 148)}>
            <img src="/prodotti/card-recensioni.png" alt="" />
          </div>
          <div className="tt-misure__piede" style={{ width: 105 * s }} aria-hidden="true" />
          <figcaption><strong>Piedistallo</strong><span>14,8 × 10,5 cm, come una cartolina · base 6 cm</span></figcaption>
        </div>
      </div>
      <p className="tt-misure__nota">Disegno in scala: le proporzioni sono quelle reali.</p>
    </figure>
  );
}
