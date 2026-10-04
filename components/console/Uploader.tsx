"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";
import { registraCreativita } from "@/actions/console";

// Carica video o immagini direttamente nello spazio Blob, poi li registra.
export function Uploader({ clienteId }: { clienteId: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [stato, setStato] = useState("");
  async function carica() {
    const files = Array.from(ref.current?.files ?? []);
    for (const [i, f] of files.entries()) {
      setStato(`Carico ${i + 1}/${files.length}: ${f.name}…`);
      const tipo = f.type.startsWith("video") ? "video" : "immagine";
      const b = await upload(`clienti/${clienteId}/${f.name}`, f, { access: "public", handleUploadUrl: "/api/upload", multipart: f.size > 20_000_000 });
      await registraCreativita(clienteId, b.url, tipo, f.name.replace(/\.[^.]+$/, ""));
    }
    setStato(files.length ? `Caricati ${files.length} file.` : "");
    if (ref.current) ref.current.value = "";
  }
  return (
    <div className="tt-row">
      <input ref={ref} type="file" multiple accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"  />
      <button type="button" onClick={() => carica().catch((e) => setStato(`Errore: ${e.message}`))} className="tt-btn tt-btn--secondary">Carica</button>
      {stato && <span className="tt-small tt-muted">{stato}</span>}
    </div>
  );
}
