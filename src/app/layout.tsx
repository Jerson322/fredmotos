import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

// Archivo variable con eje de ancho: normal para texto, expandida para títulos.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Fredmotos | Repuestos y accesorios para motos",
    template: "%s | Fredmotos",
  },
  description: "Repuestos, cascos, accesorios y lubricantes para tu moto. Compra en línea en Fredmotos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${archivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
