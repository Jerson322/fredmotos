import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/logo.webp";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";
import CurrentYear from "./CurrentYear";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src={logo} alt="Fredmotos" className="h-14 w-auto" />
          <p className="mt-3 text-sm text-muted">{site.slogan}</p>
        </div>

        <div>
          <h3 className="font-display mb-3 text-sm text-brand">Categorías</h3>
          <ul className="space-y-2 text-sm text-muted">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/productos?categoria=${c.slug}`} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display mb-3 text-sm text-brand">Empresa</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/nosotros" className="hover:text-foreground">Nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-foreground">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display mb-3 text-sm text-brand">Contacto</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li>{site.phone}</li>
            <li>{site.email}</li>
            <li>{site.address}</li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © <CurrentYear /> {site.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
