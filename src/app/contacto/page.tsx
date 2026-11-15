import type { Metadata } from "next";
import { ChatIcon } from "@/components/Icons";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactPage() {
  const items = [
    { label: "WhatsApp / Teléfono", value: site.phone },
    { label: "Correo", value: site.email },
    { label: "Dirección", value: site.address },
    { label: "Horario", value: site.hours },
  ];

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="label text-brand">Contacto</p>
          <h1 className="font-display mt-3 text-4xl sm:text-6xl">Hablemos</h1>
          <p className="mt-4 max-w-xl text-white/65">
            ¿Dudas con una referencia o con tu pedido? La forma más rápida es WhatsApp.
          </p>
          <a
            href={whatsappLink("Hola Fredmotos, tengo una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 bg-brand px-7 py-4 font-bold uppercase tracking-wide text-white hover:bg-brand-dark"
          >
            <ChatIcon />
            Escribir por WhatsApp
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div key={i.label} className="bg-card p-6">
              <dt className="label text-brand">{i.label}</dt>
              <dd className="mt-2 font-semibold">{i.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
