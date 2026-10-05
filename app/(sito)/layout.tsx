import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { linkWhatsApp } from "@/lib/scheda";

// Layout del sito pubblico: testata, piè di pagina e pulsante WhatsApp di TiTrovano.
export default function SitoLayout({ children }: { children: React.ReactNode }) {
  const wa = linkWhatsApp();
  return (
    <>
      <Header />
      <main id="contenuto">{children}</main>
      <Footer />
      {wa && <WhatsAppFloat href={wa} />}
    </>
  );
}
