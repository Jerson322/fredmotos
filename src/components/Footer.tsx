import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/logo-blanco.svg";
import { getCategories } from "@/lib/products";
import { getSettings } from "@/lib/content";
import { site } from "@/lib/site";
import CurrentYear from "./CurrentYear";

export default async function Footer() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);

  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="stripes h-2 opacity-90" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Image src={logo} alt="Fredmotos" className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Repuestos, cascos, accesorios y lubricantes para motos. Compra en línea o escríbenos y te asesoramos.
          </p>
        </div>

        <FooterCol title="Tienda">
          {categories.slice(0, 6).map((c) => (
            <li key={c.slug}>
              <Link href={`/productos?categoria=${c.slug}`} className="hover:text-white">{c.name}</Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Fredmotos">
          <li><Link href="/nosotros" className="hover:text-white">Quiénes somos</Link></li>
          <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
          <li><Link href="/carrito" className="hover:text-white">Carrito</Link></li>
        </FooterCol>

        <FooterCol title="Contacto">
          <li>{settings.phone}</li>
          <li>{settings.email}</li>
          <li>{settings.address}</li>
          <li>{settings.hours}</li>
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-xs text-white/40 sm:flex-row sm:justify-between">
          <span>© <CurrentYear /> {site.name}. Todos los derechos reservados.</span>
          <span>frmfredmotos.com</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="label mb-4 text-brand">{title}</h3>
      <ul className="space-y-2.5 text-sm text-white/60">{children}</ul>
    </div>
  );
}
