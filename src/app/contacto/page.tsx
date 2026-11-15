import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactPage() {
  const items = [
    { label: "Teléfono", value: site.phone },
    { label: "Correo", value: site.email },
    { label: "Dirección", value: site.address },
    { label: "Horario", value: site.hours },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Contacto</h1>
      <p className="mt-2 text-muted">¿Tienes dudas sobre un producto o tu pedido? Escríbenos.</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((i) => (
          <div key={i.label} className="rounded-lg border border-border bg-surface p-5">
            <dt className="font-display text-sm text-brand">{i.label}</dt>
            <dd className="mt-1">{i.value}</dd>
          </div>
        ))}
      </dl>

      <a
        href={whatsappLink("Hola Fredmotos, tengo una consulta.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-md bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Escribir por WhatsApp
      </a>
    </div>
  );
}
