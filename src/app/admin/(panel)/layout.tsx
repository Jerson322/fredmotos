import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import logo from "../../../../public/brand/logo-blanco.svg";
import { signOut } from "../actions";

export const metadata: Metadata = {
  title: { default: "Panel admin", template: "%s · Panel admin" },
  robots: { index: false },
};

const nav = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/carrusel", label: "Carrusel del inicio" },
  { href: "/admin/textos", label: "Textos y contacto" },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-paper text-fg lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="flex flex-col gap-6 bg-ink p-5 text-white lg:sticky lg:top-0 lg:h-svh">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src={logo} alt="Fredmotos" className="h-9 w-auto" />
          <span className="label text-white/50">Admin</span>
        </Link>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="shrink-0 rounded-lg px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="shrink-0 rounded-lg px-3 py-2.5 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            Ver la página ↗
          </Link>
        </nav>
        <div className="mt-auto hidden lg:block">
          <Suspense fallback={null}>
            <Session />
          </Suspense>
        </div>
      </aside>

      <main className="p-5 sm:p-8 lg:p-10">
        <Suspense fallback={<p className="text-mute">Cargando…</p>}>
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </main>
    </div>
  );
}

// Solo muestra el contenido a un admin con sesión válida (si no, va al login).
async function AdminGate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return children;
}

async function Session() {
  const admin = await requireAdmin();
  return (
    <div className="border-t border-white/10 pt-4 text-sm">
      <p className="truncate text-white/60">{admin.email}</p>
      <form action={signOut}>
        <button className="mt-2 text-white/80 underline-offset-4 hover:text-brand hover:underline">Cerrar sesión</button>
      </form>
    </div>
  );
}
