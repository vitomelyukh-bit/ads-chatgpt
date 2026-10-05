// Logo TiTrovano (gruppo Logos del design system): versione chiara e scura, scelte dal CSS.
export function Logo() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="on-light" src="/brand/titrovano-logo.svg" alt="TiTrovano" width={143} height={40} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="on-dark" src="/brand/titrovano-logo-scuro.svg" alt="TiTrovano" width={143} height={40} />
    </>
  );
}
