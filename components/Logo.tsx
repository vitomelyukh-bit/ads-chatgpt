export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="text-accent">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="10.5" cy="10.5" r="2.25" fill="currentColor" />
      </svg>
      TiTrovano
    </span>
  );
}
