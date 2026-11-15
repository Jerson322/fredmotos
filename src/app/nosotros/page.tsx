import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nosotros" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Sobre <span className="text-brand">Fredmotos</span>
      </h1>
      {/* PENDIENTE: reemplazar con la historia real del negocio */}
      <div className="mt-6 space-y-4 leading-relaxed text-muted">
        <p>
          En Fredmotos somos apasionados por las motos. Ofrecemos repuestos, cascos, accesorios y lubricantes
          para que tu moto rinda al máximo y viajes seguro.
        </p>
        <p>
          Trabajamos con marcas de confianza y te asesoramos para que encuentres exactamente lo que necesitas.
        </p>
      </div>
    </div>
  );
}
