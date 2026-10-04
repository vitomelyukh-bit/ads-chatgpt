import Link from "next/link";

export default function NotFound() {
  return (
    <div className="tt-wrap tt-wrap--read tt-page-head tt-stack-6">
      <h1 className="tt-display-lg">Pagina non trovata</h1>
      <p className="tt-body">La pagina che cerchi non esiste o è stata spostata.</p>
      <p><Link href="/" className="tt-btn">Torna alla home</Link></p>
    </div>
  );
}
