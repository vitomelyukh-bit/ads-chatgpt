"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { Punto } from "@/lib/packlink";

// Mappa dei punti di ritiro (OpenStreetMap). Il punto scelto è il segnaposto corallo.
const icona = (scelto: boolean) => L.divIcon({
  className: "",
  iconSize: scelto ? [34, 42] : [26, 32],
  iconAnchor: scelto ? [17, 42] : [13, 32],
  html: `<svg viewBox="0 0 24 30" width="${scelto ? 34 : 26}" height="${scelto ? 42 : 32}"><path d="M12 29C8 22 2 17.5 2 11.5a10 10 0 1 1 20 0C22 17.5 16 22 12 29Z" fill="${scelto ? "#ef5b4c" : "#0a7d6c"}"/><circle cx="12" cy="11.5" r="3.6" fill="#fff"/></svg>`,
});

function Adatta({ punti }: { punti: Punto[] }) {
  const map = useMap();
  useEffect(() => {
    if (punti.length) map.fitBounds(L.latLngBounds(punti.map((p) => [p.lat, p.lng] as [number, number])), { padding: [30, 30] });
  }, [punti, map]);
  return null;
}

export default function MappaPunti({ punti, scelto, onScegli }: { punti: Punto[]; scelto: string | null; onScegli: (id: string) => void }) {
  if (!punti.length) return null;
  return (
    <MapContainer center={[punti[0].lat, punti[0].lng]} zoom={14} scrollWheelZoom={false} className="tt-ord__mappa">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Adatta punti={punti} />
      {punti.map((p) => <Marker key={p.id} position={[p.lat, p.lng]} icon={icona(p.id === scelto)} eventHandlers={{ click: () => onScegli(p.id) }} />)}
    </MapContainer>
  );
}
