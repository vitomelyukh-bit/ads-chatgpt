import Link from "next/link";
import { MapBg, Pin } from "./Pin";

// ServiceCards: i servizi, ognuno con la sua scena. Google Maps sempre per primo.
type Servizio = { href: string; nome: string; testo: string; piu: string };
const riga = (larghezza: string, tu = false, lato?: "right" | "left") => (
  <div className={`tt-scene__row${tu ? " tt-scene__row--you" : ""}${lato ? ` tt-scene__row--${lato}` : ""}`}>{tu && <Pin />}<i style={{ width: larghezza }} /></div>
);

export function ServiceCards({ servizi }: { servizi: [Servizio, Servizio, Servizio, Servizio] }) {
  const scene = [
    <div key="m" className="tt-scene tt-scene--map"><MapBg /><div style={{ position: "absolute", left: "46%", top: "26%" }}><Pin /></div><div style={{ position: "absolute", left: "16%", top: "56%", opacity: 0.7 }}><Pin muted /></div><div style={{ position: "absolute", left: "76%", top: "50%", opacity: 0.7 }}><Pin muted /></div></div>,
    <div key="g" className="tt-scene">{riga("62%", true)}{riga("70%")}{riga("54%")}</div>,
    <div key="c" className="tt-scene">{riga("58%", false, "right")}{riga("66%", false, "left")}{riga("60%", true)}</div>,
    <div key="f" className="tt-scene">{riga("40%")}{riga("64%", true)}{riga("48%")}</div>,
  ];
  return (
    <div className="tt-services">
      {servizi.map((s, i) => (
        <Link key={s.nome} href={s.href} className="tt-service">
          {scene[i]}
          <h3>{s.nome}</h3>
          <p>{s.testo}</p>
          <span className="tt-service__more">{s.piu} →</span>
        </Link>
      ))}
    </div>
  );
}
