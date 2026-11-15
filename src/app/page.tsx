import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowIcon, CardIcon, ChatIcon, SearchIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import { getCategories, getFeaturedProducts } from "@/lib/products";
import { whatsappLink } from "@/lib/site";

const quickSearches = ["Kit de arrastre", "Pastillas de freno", "Casco", "Aceite 4T", "Guantes"];

const perks = [
  { icon: TruckIcon, title: "Despachos", text: "Te lo enviamos a tu ciudad" },
  { icon: CardIcon, title: "Paga como quieras", text: "PSE, tarjeta o Nequi" },
  { icon: ShieldIcon, title: "Compra segura", text: "Productos con garantía" },
  { icon: ChatIcon, title: "Asesoría real", text: "Te ayudamos por WhatsApp" },
];

export default async function Home() {
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts()]);

  return (
    <>
      {/* Portada */}
      <section className="relative overflow-hidden bg-ink text-white">
        <span className="font-display text-outline pointer-events-none absolute -right-10 top-10 hidden select-none text-[13rem] leading-none xl:block">
          FRM
        </span>
        <div className="stripes absolute -right-24 bottom-0 hidden h-24 w-[40rem] -skew-x-12 opacity-80 lg:block" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <p className="label flex items-center gap-3 text-brand">
            <span className="h-[3px] w-10 bg-brand" />
            Repuestos · Cascos · Accesorios · Lubricantes
          </p>
          <h1 className="font-display mt-6 max-w-3xl text-[2.1rem] leading-[0.95] [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">
            Encuentra el repuesto <span className="text-brand">exacto</span> para tu moto
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/65 sm:text-lg">
            Busca por nombre, referencia o código. Si no lo encuentras, escríbenos con el modelo de tu moto y te lo
            conseguimos.
          </p>

          <form action="/productos" role="search" className="mt-8 flex max-w-2xl">
            <label htmlFor="buscar-hero" className="sr-only">Buscar productos</label>
            <input
              id="buscar-hero"
              type="search"
              name="q"
              placeholder="Ej: kit de arrastre AKT 125"
              className="h-14 w-full min-w-0 bg-white px-5 text-fg outline-none placeholder:text-mute"
            />
            <button className="flex h-14 shrink-0 items-center gap-2 bg-brand px-6 font-bold uppercase tracking-wide text-white hover:bg-brand-dark">
              <SearchIcon />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-white/45">Lo más buscado:</span>
            {quickSearches.map((q) => (
              <Link
                key={q}
                href={`/productos?q=${encodeURIComponent(q)}`}
                className="border border-white/15 px-3 py-1 text-white/80 transition hover:border-brand hover:text-white"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="border-b border-line bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className={`flex items-center gap-4 px-4 py-6 lg:px-6 ${i % 2 === 0 ? "border-r border-line" : ""} ${i < 2 ? "border-b border-line lg:border-b-0" : ""} ${i === 1 ? "lg:border-r" : ""}`}
            >
              <Icon className="h-8 w-8 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="text-xs text-mute sm:text-sm">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionTitle title="Compra por categoría" href="/productos" linkLabel="Ver toda la tienda" />
        <div className="mt-8 grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((c, i) => (
            <Link
              key={c.slug}
              href={`/productos?categoria=${c.slug}`}
              className="group flex min-h-36 flex-col justify-between bg-card p-5 transition-colors hover:bg-ink hover:text-white"
            >
              <span className="label text-mute group-hover:text-brand">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex items-end justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg leading-tight sm:text-xl">{c.name}</h3>
                  <p className="mt-1 text-xs text-mute group-hover:text-white/60">
                    {c.count} {c.count === 1 ? "producto" : "productos"}
                  </p>
                </div>
                <ArrowIcon className="h-5 w-5 shrink-0 -translate-x-2 text-brand opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionTitle title="Destacados" href="/productos" linkLabel="Ver más productos" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.code} product={p} />
          ))}
        </div>
      </section>

      {/* No lo encuentras */}
      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-4xl">¿No encuentras lo que buscas?</h2>
            <p className="mt-2 max-w-xl text-white/85">
              Mándanos la marca, modelo y año de tu moto, o una foto del repuesto. Te respondemos con precio y
              disponibilidad.
            </p>
          </div>
          <a
            href={whatsappLink("Hola Fredmotos, estoy buscando un repuesto para mi moto:")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 bg-ink px-7 py-4 font-bold uppercase tracking-wide text-white transition hover:bg-black"
          >
            <ChatIcon />
            Escribir por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b-2 border-fg pb-3">
      <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
      <Link href={href} className="flex shrink-0 items-center gap-1.5 text-sm font-semibold hover:text-brand">
        {linkLabel}
        <ArrowIcon />
      </Link>
    </div>
  );
}
