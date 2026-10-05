import Link from "next/link";
import { LogoPiattaforma, type Piattaforma } from "./LogoPiattaforma";
import { MapBg, Pin } from "./Pin";

// ServiceCards: i servizi, ognuno con la sua scena. Google Maps sempre per primo.
// In ogni scena c'è una sola riga in evidenza, con il segnaposto: il cliente.
export type Scena = "mappa" | "ricerca" | "chat" | "feed" | "video";
type Servizio = { href: string; nome: string; testo: string; piu: string; scena: Scena; logo?: Piattaforma };

const riga = (larghezza: string, tu = false, lato?: "right" | "left") => (
  <div className={`tt-scene__row${tu ? " tt-scene__row--you" : ""}${lato ? ` tt-scene__row--${lato}` : ""}`}>{tu && <Pin />}<i style={{ width: larghezza }} /></div>
);

function Scena({ tipo }: { tipo: Scena }) {
  switch (tipo) {
    case "mappa":
      return <div className="tt-scene tt-scene--map"><MapBg /><div style={{ position: "absolute", left: "46%", top: "26%" }}><Pin /></div><div style={{ position: "absolute", left: "16%", top: "56%", opacity: 0.7 }}><Pin muted /></div><div style={{ position: "absolute", left: "76%", top: "50%", opacity: 0.7 }}><Pin muted /></div></div>;
    case "ricerca":
      return <div className="tt-scene">{riga("62%", true)}{riga("70%")}{riga("54%")}</div>;
    case "chat":
      return <div className="tt-scene">{riga("58%", false, "right")}{riga("66%", false, "left")}{riga("60%", true)}</div>;
    case "feed":
      return <div className="tt-scene">{riga("40%")}{riga("64%", true)}{riga("48%")}</div>;
    case "video":
      return (
        <div className="tt-scene tt-scene--video">
          <span className="tt-video" /><span className="tt-video tt-video--you"><Pin /></span><span className="tt-video" />
        </div>
      );
  }
}

export function ServiceCards({ servizi }: { servizi: Servizio[] }) {
  return (
    <div className="tt-services">
      {servizi.map((s) => (
        <Link key={s.nome} href={s.href} className="tt-service">
          <Scena tipo={s.scena} />
          <h3 className="tt-service__nome">{s.logo && <LogoPiattaforma id={s.logo} />}{s.nome}</h3>
          <p>{s.testo}</p>
          <span className="tt-service__more">{s.piu} →</span>
        </Link>
      ))}
    </div>
  );
}
