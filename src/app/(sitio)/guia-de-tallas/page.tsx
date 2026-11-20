import type { Metadata } from "next";
import Link from "next/link";
import { ChatIcon } from "@/components/Icons";
import { getSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guía de tallas",
  description: "Cómo medir tu cabeza y elegir la talla de casco correcta.",
};

// Medidas de referencia más comunes en cascos. Cada marca puede variar un poco.
const sizes = [
  { size: "XS", cm: "53 – 54" },
  { size: "S", cm: "55 – 56" },
  { size: "M", cm: "57 – 58" },
  { size: "L", cm: "59 – 60" },
  { size: "XL", cm: "61 – 62" },
  { size: "XXL", cm: "63 – 64" },
];

const steps = [
  "Usa una cinta métrica de costura (flexible).",
  "Rodea la cabeza por la parte más ancha: 1 a 2 cm por encima de las cejas y las orejas.",
  "Mide dos o tres veces y quédate con la medida más grande.",
  "Busca tu medida en la tabla. Si quedas entre dos tallas, escríbenos y te ayudamos a elegir.",
];

export default async function SizeGuidePage() {
  const settings = await getSettings();

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Link href="/" className="label text-white/50 hover:text-white">
            ← Inicio
          </Link>
          <p className="label mt-6 text-brand">Ayuda</p>
          <h1 className="font-display mt-3 text-4xl italic sm:text-6xl">Guía de tallas</h1>
          <p className="mt-4 max-w-xl text-white/65">
            Un casco bien ajustado protege más. Mide tu cabeza y encuentra tu talla en un minuto.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl italic">Cómo medir tu cabeza</h2>
          <ol className="mt-6 space-y-4">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-display flex h-8 w-8 shrink-0 items-center justify-center bg-brand text-sm text-white">
                  {i + 1}
                </span>
                <span className="pt-1">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="font-display text-2xl italic">Tallas de cascos</h2>
          <table className="mt-6 w-full border-collapse bg-card text-left">
            <thead>
              <tr className="bg-fg text-white">
                <th className="label px-5 py-3">Talla</th>
                <th className="label px-5 py-3">Contorno de cabeza</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((s) => (
                <tr key={s.size} className="border-b border-line">
                  <td className="px-5 py-3 font-extrabold">{s.size}</td>
                  <td className="px-5 py-3">{s.cm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-mute">
            Medidas de referencia. Cada marca puede variar un poco; revisa la ficha del producto o pregúntanos.
          </p>
          <a
            href={whatsappLink(settings.whatsapp, "Hola Fredmotos, necesito ayuda con la talla de un casco. Mi medida es:")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-brand px-6 py-3.5 font-bold uppercase tracking-wide text-white hover:bg-brand-dark"
          >
            <ChatIcon />
            ¿Dudas con tu talla?
          </a>
        </div>
      </section>
    </>
  );
}
