import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import logo from "../../public/brand/logo-blanco.svg";
import cascoAbierto from "../../public/menu/casco-abierto.png";
import cascoCross from "../../public/menu/casco-cross.png";
import cascoDoble from "../../public/menu/casco-multiproposito.png";
import cascoIntegral from "../../public/menu/casco-integral.png";
import { getSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { TruckIcon } from "./Icons";

// Menú principal: categorías de la tienda. El enlace usa el grupo de Ágil convertido a
// "slug" (ej. grupo "INDUMENTARIA" → categoria=indumentaria). Si en Ágil se llaman distinto,
// se ajusta aquí.
type SubItem = { label: string; href: string; image: StaticImageData };
type MenuItem = { label: string; href: string; sub?: SubItem[] };

// Tipos de casco: por ahora filtran la tienda por búsqueda; se ajustan cuando conectemos Ágil.
const helmetTypes: SubItem[] = [
  { label: "Integrales", href: "/productos?categoria=cascos&q=integral", image: cascoIntegral },
  // PENDIENTE: dibujo propio del abatible; mientras tanto usa el del integral (se parecen)
  { label: "Abatibles", href: "/productos?categoria=cascos&q=abatible", image: cascoIntegral },
  { label: "Abiertos", href: "/productos?categoria=cascos&q=abierto", image: cascoAbierto },
  { label: "Multipropósito", href: "/productos?categoria=cascos&q=multiproposito", image: cascoDoble },
  { label: "Cross", href: "/productos?categoria=cascos&q=cross", image: cascoCross },
];

const menu: MenuItem[] = [
  { label: "Cascos", href: "/productos?categoria=cascos", sub: helmetTypes },
  { label: "Indumentaria", href: "/productos?categoria=indumentaria" },
  { label: "Accesorios", href: "/productos?categoria=accesorios" },
];

const topLink = "text-[15px] font-extrabold uppercase tracking-[0.12em] text-white transition hover:text-brand";

// Encabezado fijo arriba: categorías a la izquierda, logo al centro, mayoristas a la derecha.
export default async function TopBar() {
  const settings = await getSettings();
  const helpLinks = [
    { label: "Guía de tallas", href: "/guia-de-tallas" },
    { label: "Tiendas", href: "/tiendas" },
    {
      label: "Rastrea tu pedido",
      href: whatsappLink(settings.whatsapp, "Hola Fredmotos, quiero saber el estado de mi pedido. Mi número de pedido es:"),
      external: true,
    },
  ];

  return (
    <div className="absolute inset-x-0 top-0 z-30">
      {/* Línea 1: envíos */}
      <div className="flex h-8 items-center justify-center gap-2 bg-brand text-[11px] font-extrabold uppercase tracking-[0.18em] text-white sm:text-xs">
        <TruckIcon className="h-4 w-4" />
        Envíos a toda Colombia
      </div>

      {/* Línea 2: enlaces de ayuda */}
      <div className="flex h-7 items-center justify-center gap-4 border-b border-white/10 bg-black/35 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70 sm:justify-end sm:gap-6 sm:px-8 sm:text-[11px]">
        {helpLinks.map((l, i) => (
          <span key={l.label} className="flex items-center gap-4 sm:gap-6">
            {i > 0 && <span className="h-3 w-px bg-white/20" aria-hidden="true" />}
            <a
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="transition hover:text-white"
            >
              {l.label}
            </a>
          </span>
        ))}
      </div>

      <div className="relative grid h-[92px] grid-cols-[1fr_auto_1fr] items-center px-5 text-white sm:px-8">
        {/* Menú escritorio */}
        <nav className="hidden h-full items-center gap-10 lg:flex" aria-label="Categorías">
          {menu.map((m) =>
            m.sub ? (
              // Al pasar el mouse (o con el teclado) se despliega el panel con los tipos
              <div key={m.href} className="group/sub flex h-full items-center">
                <Link
                  href={m.href}
                  className={`${topLink} flex items-center gap-2 group-hover/sub:text-brand`}
                  aria-haspopup="true"
                >
                  {m.label}
                  <span className="text-[10px] transition-transform duration-300 group-hover/sub:rotate-180" aria-hidden="true">
                    ▼
                  </span>
                </Link>
                <MegaPanel title={m.label} href={m.href} items={m.sub} />
              </div>
            ) : (
              <Link key={m.href} href={m.href} className={`${topLink} py-2`}>
                {m.label}
              </Link>
            ),
          )}
        </nav>

        {/* Menú celular */}
        <details className="group relative lg:hidden">
          <summary
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center border border-white/60 text-white transition-colors [&::-webkit-details-marker]:hidden"
            aria-label="Abrir menú"
          >
            <span className="text-lg leading-none group-open:hidden">☰</span>
            <span className="hidden text-lg leading-none group-open:inline">✕</span>
          </summary>
          <nav
            className="absolute left-0 top-full mt-3 flex max-h-[75svh] w-[min(86vw,20rem)] flex-col overflow-y-auto border-t-2 border-brand bg-white p-4 text-fg shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)]"
            aria-label="Categorías"
          >
            {menu.map((m) =>
              m.sub ? (
                <details key={m.href} className="group/m">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-extrabold uppercase tracking-[0.1em] [&::-webkit-details-marker]:hidden">
                    {m.label}
                    <span className="text-xs transition-transform group-open/m:rotate-180" aria-hidden="true">
                      ▼
                    </span>
                  </summary>
                  <div className="grid grid-cols-2 gap-2 pb-3">
                    {m.sub.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="flex flex-col items-center rounded-lg bg-paper p-3 text-center hover:bg-line"
                      >
                        {/* Las ilustraciones son blancas; aquí se invierten a negro sobre el fondo claro */}
                        <Image src={sub.image} alt="" className="h-14 w-auto invert" />
                        <span className="mt-1 text-xs font-bold uppercase">{sub.label}</span>
                      </Link>
                    ))}
                    <Link href={m.href} className="col-span-2 py-2 text-center text-sm font-bold text-brand">
                      Ver todos los cascos →
                    </Link>
                  </div>
                </details>
              ) : (
                <Link
                  key={m.href}
                  href={m.href}
                  className="py-3 text-base font-extrabold uppercase tracking-[0.1em] text-fg transition hover:text-brand"
                >
                  {m.label}
                </Link>
              ),
            )}
          </nav>
        </details>

        <Link href="/" aria-label="Fredmotos, ir al inicio">
          <Image src={logo} alt="Fredmotos" className="h-11 w-auto sm:h-16" loading="eager" />
        </Link>

        <a
          href="#distribuidores"
          className="justify-self-end border border-white/60 px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white transition hover:border-brand hover:bg-brand hover:text-white sm:px-5 sm:py-3 sm:text-sm"
        >
          <span className="sm:hidden">¿Mayorista?</span>
          <span className="hidden sm:inline">Eres mayorista?</span>
        </a>
      </div>
    </div>
  );
}

// Panel desplegable de lado a lado con los tipos (escritorio). Las tarjetas entran
// una tras otra y al pasar el mouse el casco se eleva con un brillo rojo.
function MegaPanel({ title, href, items }: { title: string; href: string; items: SubItem[] }) {
  return (
    <div className="invisible absolute inset-x-0 top-full -translate-y-2 opacity-0 transition duration-300 group-focus-within/sub:visible group-focus-within/sub:translate-y-0 group-focus-within/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-y-0 group-hover/sub:opacity-100">
      <div className="mx-5 border-t-2 border-brand bg-ink/95 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md sm:mx-8">
        <div className="grid grid-cols-[repeat(5,1fr)_auto] gap-2 p-6">
          {items.map((sub, i) => (
            <Link
              key={sub.href}
              href={sub.href}
              className="group/card flex translate-y-4 flex-col items-center rounded-xl px-4 pb-4 pt-5 opacity-0 transition-[opacity,transform,background-color] duration-500 hover:bg-white/5 group-focus-within/sub:translate-y-0 group-focus-within/sub:opacity-100 group-hover/sub:translate-y-0 group-hover/sub:opacity-100"
              style={{ transitionDelay: `${80 + i * 70}ms` }}
            >
              <Image
                src={sub.image}
                alt=""
                className="h-28 w-auto transition duration-500 ease-out group-hover/card:-translate-y-2 group-hover/card:-rotate-6 group-hover/card:scale-110 group-hover/card:drop-shadow-[0_12px_22px_rgba(227,6,19,0.55)]"
              />
              <span className="mt-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white">{sub.label}</span>
              <span className="mt-2 h-[2px] w-0 bg-brand transition-all duration-500 group-hover/card:w-10" />
            </Link>
          ))}
          <Link
            href={href}
            className="flex translate-y-4 flex-col items-start justify-center border-l border-white/10 pl-6 pr-2 opacity-0 transition duration-500 group-focus-within/sub:translate-y-0 group-focus-within/sub:opacity-100 group-hover/sub:translate-y-0 group-hover/sub:opacity-100"
            style={{ transitionDelay: `${80 + items.length * 70}ms` }}
          >
            <span className="label text-brand">{title}</span>
            <span className="mt-2 text-lg font-extrabold uppercase leading-tight text-white hover:text-brand">Ver todos →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
