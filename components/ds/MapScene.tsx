import { MapBg, Pin } from "./Pin";
import { Stars } from "./Stars";

// MapScene: l'hero della home. Il cliente è il segnaposto in evidenza, gli altri sono grigi.
export function MapScene({ children, nome = "Trattoria da Maria", voto = 4.8, recensioni = 127, orario = "Aperto · chiude alle 23:00" }: {
  children: React.ReactNode; nome?: string; voto?: number; recensioni?: number; orario?: string;
}) {
  return (
    <div className="tt-map">
      <MapBg percorso />
      <div className="tt-map__panel">{children}</div>
      <div className="tt-map__you" style={{ left: "68%", top: "6%" }}>
        <div className="tt-bubble-place">
          <strong>{nome}</strong>
          <span><b>{voto.toLocaleString("it-IT")}</b> <Stars voto={voto} /> {recensioni}</span>
          <em>{orario}</em>
        </div>
        <Pin />
      </div>
      <div className="tt-map__other" style={{ left: "60%", top: "70%" }}><Pin muted /></div>
      <div className="tt-map__other" style={{ left: "90%", top: "62%" }}><Pin muted /></div>
    </div>
  );
}
