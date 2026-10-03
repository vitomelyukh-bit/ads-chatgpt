export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`font-serif text-[1.65rem] leading-none tracking-tight ${inverse ? "text-paper" : "text-ink"}`}>
      Ti
      <span className={`bg-[linear-gradient(transparent_58%,var(--color-accent)_58%,var(--color-accent)_92%,transparent_92%)] ${inverse ? "text-paper" : "text-ink"}`}>
        Trovano
      </span>
    </span>
  );
}
