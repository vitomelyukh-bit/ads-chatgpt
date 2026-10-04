import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

// Layout del sito pubblico: testata e piè di pagina di TiTrovano.
export default function SitoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="contenuto">{children}</main>
      <Footer />
    </>
  );
}
