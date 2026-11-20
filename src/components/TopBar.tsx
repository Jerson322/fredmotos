import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/logo-horizontal.webp";
import { getCategories } from "@/lib/products";
import IslandShell from "./IslandShell";

const links = [
  { href: "/productos", label: "Tienda" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const linkBase = "label py-2 transition";
const linkClass = `${linkBase} text-fg/80 hover:text-brand`; // enlaces dentro de paneles blancos
const islandText = "text-white/85 hover:text-brand";

// Barra superior transparente: menú a la izquierda, logo al centro, distribuidor a la derecha.
export default async function TopBar() {
  const categories = (await getCategories()).slice(0, 10);

  return (
    // Arriba: barra normal de lado a lado. Al bajar: isla dinámica flotante.
    <IslandShell>
      <div className="island mx-auto grid h-[76px] max-w-full grid-cols-[1fr_auto_1fr] items-center rounded-none border border-transparent px-5 text-white transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)] sm:px-8 group-data-[scrolled]/island:h-[64px] group-data-[scrolled]/island:max-w-[1000px] group-data-[scrolled]/island:rounded-[32px] group-data-[scrolled]/island:border group-data-[scrolled]/island:border-white/15 group-data-[scrolled]/island:px-4 group-data-[scrolled]/island:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] sm:group-data-[scrolled]/island:px-6">
      {/* Menú escritorio */}
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
        <div className="group relative">
          <Link href="/productos" className={`${linkBase} ${islandText} flex items-center gap-1.5`} aria-haspopup="true">
            Categorías
            <span className="text-[9px] transition group-hover:rotate-180" aria-hidden="true">▼</span>
          </Link>
          <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
            <ul className="min-w-56 border-t-2 text-fg border-brand bg-white py-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/productos?categoria=${c.slug}`}
                    className="flex justify-between gap-4 px-5 py-2.5 text-sm hover:bg-paper hover:text-brand"
                  >
                    {c.name}
                    <span className="text-xs text-mute">{c.count}</span>
                  </Link>
                </li>
              ))}
              <li className="mt-1 border-t border-line">
                <Link href="/productos" className="block px-5 py-2.5 text-sm font-bold hover:text-brand">
                  Ver toda la tienda →
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={`${linkBase} ${islandText}`}>
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Menú celular */}
      <details className="group relative lg:hidden">
        <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center border transition-colors border-white/60 text-white [&::-webkit-details-marker]:hidden" aria-label="Abrir menú">
          <span className="text-lg leading-none group-open:hidden">☰</span>
          <span className="hidden text-lg leading-none group-open:inline">✕</span>
        </summary>
        <div className="absolute left-0 top-full mt-3 w-[min(80vw,20rem)] border-t-2 border-brand bg-white p-5 text-fg shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)]">
          <p className="label text-mute">Categorías</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/productos?categoria=${c.slug}`} className="block py-2 text-sm hover:text-brand">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col border-t border-line pt-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </details>

      <Link href="/" aria-label="Fredmotos, ir al inicio">
        <Image src={logo} alt="Fredmotos" className="h-9 w-auto brightness-0 invert sm:h-11"
          loading="eager"
        />
      </Link>

      <a
        href="#distribuidores"
        className="justify-self-end border px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition border-white/60 text-white hover:border-brand hover:bg-brand hover:text-white sm:px-5 sm:py-2.5 sm:text-xs"
      >
        <span className="sm:hidden">¿Distribuidor?</span>
        <span className="hidden sm:inline">¿Quieres ser distribuidor?</span>
      </a>
      </div>
    </IslandShell>
  );
}
