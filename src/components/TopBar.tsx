import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/logo-blanco.svg";

// Menú principal: categorías de la tienda. El enlace usa el grupo de Ágil convertido a
// "slug" (ej. grupo "INDUMENTARIA" → categoria=indumentaria). Si en Ágil se llaman distinto,
// se ajusta aquí.
const menu = [
  { label: "Cascos", href: "/productos?categoria=cascos" },
  { label: "Indumentaria", href: "/productos?categoria=indumentaria" },
  { label: "Accesorios", href: "/productos?categoria=accesorios" },
];

// Encabezado fijo arriba: categorías a la izquierda, logo al centro, distribuidor a la derecha.
export default function TopBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-30">
      <div className="grid h-[92px] grid-cols-[1fr_auto_1fr] items-center px-5 text-white sm:px-8">
      {/* Menú escritorio */}
      <nav className="hidden items-center gap-10 lg:flex" aria-label="Categorías">
        {menu.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="py-2 text-[15px] font-extrabold uppercase tracking-[0.12em] text-white transition hover:text-brand"
          >
            {m.label}
          </Link>
        ))}
      </nav>

      {/* Menú celular */}
      <details className="group relative lg:hidden">
        <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center border transition-colors border-white/60 text-white [&::-webkit-details-marker]:hidden" aria-label="Abrir menú">
          <span className="text-lg leading-none group-open:hidden">☰</span>
          <span className="hidden text-lg leading-none group-open:inline">✕</span>
        </summary>
        <nav
          className="absolute left-0 top-full mt-3 flex w-[min(80vw,16rem)] flex-col border-t-2 border-brand bg-white p-4 text-fg shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)]"
          aria-label="Categorías"
        >
          {menu.map((m) => (
            <Link key={m.href} href={m.href} className="py-3 text-base font-extrabold uppercase tracking-[0.1em] text-fg transition hover:text-brand">
              {m.label}
            </Link>
          ))}
        </nav>
      </details>

      <Link href="/" aria-label="Fredmotos, ir al inicio">
        <Image src={logo} alt="Fredmotos" className="h-11 w-auto sm:h-16" loading="eager" />
      </Link>

      <a
        href="#distribuidores"
        className="justify-self-end border px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider transition border-white/60 text-white hover:border-brand hover:bg-brand hover:text-white sm:px-5 sm:py-3 sm:text-sm"
      >
        <span className="sm:hidden">¿Distribuidor?</span>
        <span className="hidden sm:inline">¿Quieres ser distribuidor?</span>
      </a>
      </div>
    </div>
  );
}
