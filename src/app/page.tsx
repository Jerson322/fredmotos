import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, getFeaturedProducts } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";

const benefits = [
  { title: "Envíos", text: "Recibe tu pedido donde estés" },
  { title: "Pago seguro", text: "Paga con tarjeta de forma protegida" },
  { title: "Garantía", text: "Productos originales y de calidad" },
  { title: "Asesoría", text: "Te ayudamos a elegir por WhatsApp" },
];

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(225,6,0,0.35),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <span className="font-display text-sm text-brand">Bienvenido a {site.name}</span>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
            Todo para tu moto, <span className="text-brand">en un solo lugar</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Repuestos, cascos, accesorios y lubricantes con envío a domicilio y pago seguro en línea.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/productos"
              className="rounded-md bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
            >
              Ver tienda
            </Link>
            <a
              href={whatsappLink("Hola, necesito ayuda para encontrar un repuesto.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-foreground/30 px-6 py-3 font-semibold transition hover:border-foreground"
            >
              Pedir asesoría
            </a>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="border-l-2 border-brand pl-4">
              <h3 className="font-display text-sm">{b.title}</h3>
              <p className="mt-1 text-sm text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Categorías</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/productos?categoria=${c.slug}`}
              className="group rounded-lg border border-border bg-surface p-6 transition hover:border-brand hover:bg-surface-2"
            >
              <h3 className="font-display text-lg group-hover:text-brand">{c.name}</h3>
              <p className="mt-2 text-sm text-muted">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Destacados</h2>
          <Link href="/productos" className="text-sm font-semibold text-brand hover:underline">
            Ver todo →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
