import Link from "next/link";
import HeroSlider, { type Slide } from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import ProductRail, { RailItem } from "@/components/ProductRail";
import {
  ArrowIcon,
  CardIcon,
  ChatIcon,
  DropIcon,
  GearIcon,
  GloveIcon,
  HelmetIcon,
  SearchIcon,
  ShieldIcon,
  TagIcon,
  TruckIcon,
  WrenchIcon,
} from "@/components/Icons";
import { getCategories, getCategoryShelf, getFeaturedProducts, getProducts, type Category, type Product } from "@/lib/products";
import { formatPrice, whatsappLink } from "@/lib/site";

const BUDGET = 50000;

// Diapositivas de la portada. Cuando haya fotos, se agrega `image: "/banners/....webp"`.
const slides: Slide[] = [
  {
    kicker: "Repuestos para tu moto",
    title: "Tu moto, *a punto*",
    text: "Kits de arrastre, frenos, filtros, eléctricos y más. Busca por referencia o pregúntanos por WhatsApp.",
    cta: "Ver repuestos",
    href: "/productos?q=repuesto",
    word: "REPUESTOS",
  },
  {
    kicker: "Cascos y protección",
    title: "Rueda *seguro*",
    text: "Cascos integrales, abatibles y abiertos, guantes e impermeables para cada tipo de rider.",
    cta: "Ver cascos",
    href: "/productos?q=casco",
    word: "CASCOS",
  },
  {
    kicker: "Precios que ruedan",
    title: `Por menos de *${formatPrice(BUDGET)}*`,
    text: "Lo que tu moto necesita sin gastar de más. Mira todo lo que tenemos por debajo de ese precio.",
    cta: "Ver productos",
    href: `/productos?max=${BUDGET}`,
    word: "PRECIOS",
  },
  {
    kicker: "Mantenimiento",
    title: "Aceite y *lubricantes*",
    text: "Aceites 2T y 4T, refrigerantes y lubricantes de cadena para que tu motor dure más.",
    cta: "Ver lubricantes",
    href: "/productos?q=aceite",
    word: "ACEITE",
  },
];

const quickSearches = ["Kit de arrastre", "Pastillas de freno", "Casco", "Aceite 4T", "Guantes"];

const perks = [
  { icon: TruckIcon, title: "Despachos", text: "Te lo enviamos a tu ciudad" },
  { icon: CardIcon, title: "Paga como quieras", text: "PSE, tarjeta o Nequi" },
  { icon: ShieldIcon, title: "Compra segura", text: "Productos con garantía" },
  { icon: ChatIcon, title: "Asesoría real", text: "Te ayudamos por WhatsApp" },
];

const tickerWords = ["Repuestos", "Cascos", "Accesorios", "Lubricantes", "Asesoría por WhatsApp", "Compra en línea"];

// Ícono según el nombre del grupo de Ágil.
function categoryIcon(slug: string) {
  if (/casco/.test(slug)) return HelmetIcon;
  if (/aceite|lubric|refriger/.test(slug)) return DropIcon;
  if (/guante|ropa|chaqueta|imperme|textil|protecc/.test(slug)) return GloveIcon;
  if (/repuesto|motor|freno|electric|transmis/.test(slug)) return GearIcon;
  if (/herramient/.test(slug)) return WrenchIcon;
  return TagIcon;
}

export default async function Home() {
  const [categories, featured, budget, sale] = await Promise.all([
    getCategories(),
    getFeaturedProducts(12),
    getProducts({ maxPrice: BUDGET }),
    getProducts({ onSale: true }),
  ]);
  const shelfCategories = categories.slice(0, 2);
  const shelves = await Promise.all(shelfCategories.map((c) => getCategoryShelf(c.slug)));

  return (
    <>
      <h1 className="sr-only">Fredmotos: repuestos, cascos, accesorios y lubricantes para motos</h1>

      {/* Portada: carrusel + buscador */}
      <section className="grain relative overflow-hidden bg-ink text-white">
        <HeroSlider slides={slides} />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:pb-16">
          <form action="/productos" role="search" className="flex max-w-3xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
            <label htmlFor="buscar-hero" className="sr-only">Buscar productos</label>
            <input
              id="buscar-hero"
              type="search"
              name="q"
              placeholder="¿Qué buscas? Ej: kit de arrastre AKT 125"
              className="h-14 w-full min-w-0 bg-white px-5 text-fg outline-none placeholder:text-mute"
            />
            <button className="flex h-14 shrink-0 items-center gap-2 bg-brand px-6 font-bold uppercase tracking-wide text-white hover:bg-brand-dark">
              <SearchIcon />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
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

      {/* Cinta en movimiento */}
      <div className="overflow-hidden bg-brand py-3 text-white" aria-hidden="true">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {[...tickerWords, ...tickerWords].map((w, i) => (
                <span key={i} className="font-display flex items-center gap-6 pr-6 text-sm italic sm:text-base">
                  {w}
                  <span className="text-ink">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Promociones en mosaico */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:pt-14">
        <PromoGrid categories={categories} budgetCount={budget.total} saleCount={sale.total} />
      </section>

      {/* Categorías en círculos */}
      <section className="reveal mx-auto max-w-7xl px-4 pt-16">
        <SectionTitle title="Compra por categoría" href="/productos" linkLabel="Ver toda la tienda" />
        <div className="no-scrollbar -mx-4 mt-8 flex gap-4 overflow-x-auto px-4 sm:gap-6 lg:grid lg:grid-cols-8 lg:overflow-visible">
          {categories.slice(0, 7).map((c) => {
            const Icon = categoryIcon(c.slug);
            return (
              <Link key={c.slug} href={`/productos?categoria=${c.slug}`} className="group flex w-24 shrink-0 flex-col items-center text-center lg:w-auto">
                <span className="flex aspect-square w-full items-center justify-center rounded-full border border-line bg-card text-fg transition duration-300 group-hover:-translate-y-1 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                  <Icon className="h-9 w-9 sm:h-11 sm:w-11" />
                </span>
                <span className="mt-3 text-xs font-bold uppercase tracking-wide group-hover:text-brand">{c.name}</span>
                <span className="text-[11px] text-mute">{c.count}</span>
              </Link>
            );
          })}
          <a
            href={whatsappLink("Hola Fredmotos, necesito ayuda para escoger un producto.")}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-24 shrink-0 flex-col items-center text-center lg:w-auto"
          >
            <span className="flex aspect-square w-full items-center justify-center rounded-full border border-dashed border-fg/40 text-fg transition duration-300 group-hover:-translate-y-1 group-hover:border-[#25d366] group-hover:bg-[#25d366] group-hover:text-white">
              <ChatIcon className="h-9 w-9 sm:h-11 sm:w-11" />
            </span>
            <span className="mt-3 text-xs font-bold uppercase tracking-wide">Ayuda para escoger</span>
            <span className="text-[11px] text-mute">WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Vitrinas */}
      <Shelf title="Destacados" href="/productos" linkLabel="Ver más productos" products={featured} />
      {shelfCategories.map((c, i) =>
        shelves[i].length >= 3 ? (
          <Shelf
            key={c.slug}
            title={c.name}
            href={`/productos?categoria=${c.slug}`}
            linkLabel={`Ver ${c.name.toLowerCase()}`}
            products={shelves[i]}
          />
        ) : null,
      )}

      {/* Bloque de marca (estilo Shaft) */}
      <section className="grain relative mt-20 overflow-hidden bg-ink text-white">
        <div className="stripes absolute -left-24 top-0 h-3 w-[60rem] -skew-x-12 opacity-90" />
        <div className="reveal relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <p className="label text-brand">Fredmotos · frmfredmotos.com</p>
          <p
            className="font-display echo mt-5 text-[2.6rem] italic leading-[0.9] [overflow-wrap:anywhere] sm:text-7xl lg:text-[7.5rem]"
            data-echo="Hecho para rodar"
          >
            Hecho para <span className="text-brand">rodar</span>
          </p>
          <p className="mt-6 max-w-xl text-white/60 sm:text-lg">
            No todas las motos piden lo mismo. Te ayudamos a encontrar la pieza correcta para la tuya, sin vueltas.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
            {perks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-ink p-5 sm:p-6">
                <Icon className="h-8 w-8 text-brand" />
                <p className="mt-4 text-sm font-bold uppercase tracking-wide">{title}</p>
                <p className="mt-1 text-xs text-white/55 sm:text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No lo encuentras */}
      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl italic sm:text-4xl">¿No encuentras lo que buscas?</h2>
            <p className="mt-2 max-w-xl text-white/85">
              Mándanos la marca, modelo y año de tu moto, o una foto del repuesto. Te respondemos con precio y
              disponibilidad.
            </p>
          </div>
          <a
            href={whatsappLink("Hola Fredmotos, estoy buscando un repuesto para mi moto:")}
            target="_blank"
            rel="noopener noreferrer"
            className="cut-r flex shrink-0 items-center gap-2 bg-ink py-4 pl-7 pr-10 font-bold uppercase tracking-wide text-white transition hover:bg-black"
          >
            <ChatIcon />
            Escribir por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

/* Mosaico de promociones (estilo Inducascos): una grande y cuatro pequeñas. */
function PromoGrid({ categories, budgetCount, saleCount }: { categories: Category[]; budgetCount: number; saleCount: number }) {
  const [c1, c2] = categories;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
      {/* Grande: por menos de X */}
      <Link
        href={`/productos?max=${BUDGET}`}
        className="group relative flex min-h-64 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand to-[#6d0309] p-6 text-white sm:col-span-2 lg:row-span-2 lg:min-h-[26rem] lg:p-10"
      >
        <div className="stripes absolute -right-16 -top-4 h-full w-40 -skew-x-12 opacity-20 transition-transform duration-700 group-hover:translate-x-6" />
        <div className="relative">
          <p className="label text-white/75">Productos por menos de</p>
          <p className="font-display mt-3 text-5xl italic leading-none sm:text-7xl">{formatPrice(BUDGET)}</p>
          <p className="mt-4 text-sm text-white/75">{budgetCount} productos disponibles</p>
        </div>
        <PromoCta>Ver más</PromoCta>
      </Link>

      {saleCount > 0 ? (
        <PromoTile href="/productos?ofertas=1" kicker="Precios rebajados" title="Ofertas" note={`${saleCount} productos`} className="bg-ink text-white" />
      ) : (
        <PromoTile href="/productos" kicker="Todo el catálogo" title="Toda la tienda" note="Compra en línea" className="bg-ink text-white" />
      )}

      {c1 && (
        <PromoTile
          href={`/productos?categoria=${c1.slug}`}
          kicker="Lo más pedido"
          title={c1.name}
          note={`${c1.count} productos`}
          className="bg-[#2a2a2a] text-white"
        />
      )}
      {c2 && (
        <PromoTile
          href={`/productos?categoria=${c2.slug}`}
          kicker="Explora"
          title={c2.name}
          note={`${c2.count} productos`}
          className="border-2 border-fg bg-card text-fg"
        />
      )}

      <a
        href={whatsappLink("Hola Fredmotos, quiero cotizar un repuesto para mi moto.")}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex min-h-48 flex-col justify-between overflow-hidden bg-[#128c4a] p-6 text-white"
      >
        <ChatIcon className="absolute -bottom-6 -right-6 h-36 w-36 text-white/10 transition-transform duration-500 group-hover:-rotate-12" />
        <div className="relative">
          <p className="label text-white/75">Cotiza por WhatsApp</p>
          <p className="font-display mt-2 text-2xl italic leading-tight">Envíanos la foto del repuesto</p>
        </div>
        <PromoCta>¡Lo quiero!</PromoCta>
      </a>
    </div>
  );
}

function PromoTile({ href, kicker, title, note, className }: { href: string; kicker: string; title: string; note: string; className: string }) {
  return (
    <Link href={href} className={`group relative flex min-h-48 flex-col justify-between overflow-hidden p-6 ${className}`}>
      <span className="font-display text-outline pointer-events-none absolute -bottom-4 -right-2 select-none text-8xl italic leading-none opacity-[0.08] [-webkit-text-stroke-color:currentColor] transition-transform duration-500 group-hover:-translate-x-3">
        {title.slice(0, 3)}
      </span>
      <div className="relative">
        <p className="label opacity-60">{kicker}</p>
        <p className="font-display mt-2 text-2xl italic leading-tight">{title}</p>
        <p className="mt-1 text-xs opacity-60">{note}</p>
      </div>
      <PromoCta>Ver más</PromoCta>
    </Link>
  );
}

function PromoCta({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
      {children}
      <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
    </span>
  );
}

function Shelf({ title, href, linkLabel, products }: { title: string; href: string; linkLabel: string; products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="reveal mx-auto max-w-7xl px-4 pt-16">
      <SectionTitle title={title} href={href} linkLabel={linkLabel} />
      <div className="mt-8">
        <ProductRail label={title}>
          {products.map((p) => (
            <RailItem key={p.code}>
              <ProductCard product={p} />
            </RailItem>
          ))}
        </ProductRail>
      </div>
    </section>
  );
}

function SectionTitle({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b-2 border-fg pb-3">
      <h2 className="font-display text-2xl italic sm:text-3xl">{title}</h2>
      <Link href={href} className="flex shrink-0 items-center gap-1.5 text-sm font-semibold hover:text-brand">
        {linkLabel}
        <ArrowIcon />
      </Link>
    </div>
  );
}
