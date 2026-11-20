import type { Metadata } from "next";
import Link from "next/link";
import { ChatIcon } from "@/components/Icons";
import { getSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tiendas",
  description: "Visítanos en nuestra tienda Fredmotos.",
};

// Por ahora una tienda con los datos del panel admin (Textos y contacto).
export default async function StoresPage() {
  const settings = await getSettings();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Fredmotos ${settings.address}`)}`;

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Link href="/" className="label text-white/50 hover:text-white">
            ← Inicio
          </Link>
          <p className="label mt-6 text-brand">Tiendas</p>
          <h1 className="font-display mt-3 text-4xl italic sm:text-6xl">Visítanos</h1>
          <p className="mt-4 max-w-xl text-white/65">
            Ven a ver los cascos y la indumentaria en persona, o escríbenos y te asesoramos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <article className="max-w-xl border-t-4 border-brand bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl italic">Fredmotos</h2>
          <dl className="mt-6 space-y-4">
            <div>
              <dt className="label text-brand">Dirección</dt>
              <dd className="mt-1 font-semibold">{settings.address}</dd>
            </div>
            <div>
              <dt className="label text-brand">Horario</dt>
              <dd className="mt-1 font-semibold">{settings.hours}</dd>
            </div>
            <div>
              <dt className="label text-brand">Teléfono</dt>
              <dd className="mt-1 font-semibold">{settings.phone}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-fg px-5 py-3 font-bold uppercase tracking-wide hover:bg-fg hover:text-white"
            >
              Cómo llegar
            </a>
            <a
              href={whatsappLink(settings.whatsapp, "Hola Fredmotos, quiero visitar la tienda.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand px-5 py-3 font-bold uppercase tracking-wide text-white hover:bg-brand-dark"
            >
              <ChatIcon />
              WhatsApp
            </a>
          </div>
        </article>
      </section>
    </>
  );
}
