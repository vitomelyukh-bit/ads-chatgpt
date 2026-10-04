// Scarica Bricolage Grotesque (TTF) per le immagini generate. Se non riesce,
// l'immagine usa il carattere di ripiego: la build non deve fallire per questo.
export async function bricolage(weight = 700): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@${weight}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.0 (KHTML, like Gecko)" },
    }).then((r) => r.text());
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('(truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}
