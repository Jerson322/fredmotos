import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/logo.webp";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Tienda" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center" aria-label="Fredmotos, ir al inicio">
          <Image src={logo} alt="Fredmotos" className="h-11 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-sm text-muted transition hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* El carrito se conecta en la fase 3 */}
        <Link
          href="/carrito"
          className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          Carrito
        </Link>
      </div>

      <nav className="flex justify-around border-t border-border py-2 md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="font-display text-xs text-muted hover:text-foreground">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
