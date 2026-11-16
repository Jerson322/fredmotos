import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/logo-horizontal.webp";
import { getCategories } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { CartIcon, ChatIcon, SearchIcon } from "./Icons";

function SearchForm({ className = "" }: { className?: string }) {
  return (
    <form action="/productos" role="search" className={`flex ${className}`}>
      <label htmlFor="buscar-header" className="sr-only">Buscar productos</label>
      <input
        id="buscar-header"
        type="search"
        name="q"
        placeholder="Busca por nombre, referencia o código"
        className="h-11 w-full min-w-0 bg-white px-4 text-sm text-fg outline-none placeholder:text-mute"
      />
      <button className="flex h-11 w-12 shrink-0 items-center justify-center bg-brand text-white hover:bg-brand-dark" aria-label="Buscar">
        <SearchIcon />
      </button>
    </form>
  );
}

export default async function Header() {
  const categories = (await getCategories()).slice(0, 8);

  return (
    // En escritorio queda pegado arriba: la franja roja (2rem) se va y la barra negra se queda.
    <header className="z-40 md:sticky md:-top-8">
      {/* Franja superior */}
      <div className="bg-brand text-white">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs font-semibold">
          <span>Compra en línea · Pago seguro con PSE, tarjeta y Nequi</span>
          <span className="hidden sm:block">{site.hours}</span>
        </div>
      </div>

      {/* Barra principal */}
      <div className="bg-ink text-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-4">
          <Link href="/" className="shrink-0" aria-label="Fredmotos, ir al inicio">
            <Image src={logo} alt="Fredmotos" className="h-10 w-auto sm:h-12" priority />
          </Link>

          <SearchForm className="hidden flex-1 md:flex lg:max-w-2xl" />

          <div className="ml-auto flex items-center gap-1 sm:gap-4">
            <a
              href={whatsappLink("Hola Fredmotos, necesito asesoría.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2 py-2 text-sm hover:text-brand"
            >
              <ChatIcon />
              <span className="hidden leading-tight lg:block">
                <span className="block text-[11px] text-white/50">¿Dudas?</span>
                Asesoría
              </span>
            </a>
            <Link href="/carrito" className="flex items-center gap-2 px-2 py-2 text-sm hover:text-brand">
              <CartIcon />
              <span className="hidden leading-tight lg:block">
                <span className="block text-[11px] text-white/50">Tu compra</span>
                Carrito
              </span>
            </Link>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <SearchForm />
        </div>
      </div>

      {/* Categorías */}
      <nav className="border-b-4 border-brand bg-ink-soft text-white" aria-label="Categorías">
        <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 [scrollbar-width:none]">
          <Link href="/productos" className="label shrink-0 bg-brand px-4 py-3.5 text-white">
            Toda la tienda
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/productos?categoria=${c.slug}`}
              className="label shrink-0 px-4 py-3.5 text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/contacto" className="label ml-auto shrink-0 px-4 py-3.5 text-white/75 hover:text-white">
            Contacto
          </Link>
        </div>
      </nav>
    </header>
  );
}
