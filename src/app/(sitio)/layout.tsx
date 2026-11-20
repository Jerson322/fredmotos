import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

// Páginas públicas de la tienda (el panel admin tiene su propio diseño).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
