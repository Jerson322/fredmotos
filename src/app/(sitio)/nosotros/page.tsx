import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Quiénes somos" };

// PENDIENTE: reemplazar con la historia real del negocio (año de fundación, ciudad, equipo, fotos del local).
export default function AboutPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <p className="label text-brand">Quiénes somos</p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl leading-[0.98] sm:text-6xl">
            Gente de motos atendiendo a gente de motos
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2">
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            En Fredmotos vendemos repuestos, cascos, accesorios y lubricantes para que tu moto esté siempre lista para
            rodar.
          </p>
          <p className="text-mute">
            Sabemos que un repuesto equivocado es plata y tiempo perdidos. Por eso, antes de que compres, te ayudamos a
            confirmar que la pieza sea la correcta para tu moto.
          </p>
          <Link href="/productos" className="inline-block bg-brand px-7 py-4 font-bold uppercase tracking-wide text-white hover:bg-brand-dark">
            Ver la tienda
          </Link>
        </div>
        {/* Espacio para foto del local o del equipo */}
        <div className="flex aspect-[4/3] items-center justify-center border border-dashed border-line bg-card">
          <span className="label text-mute">Foto del local / equipo</span>
        </div>
      </section>
    </>
  );
}
