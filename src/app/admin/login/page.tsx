import type { Metadata } from "next";
import Image from "next/image";
import logo from "../../../../public/brand/logo-horizontal.webp";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Ingresar al panel", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="showcase-bg flex min-h-svh items-center justify-center px-4 text-white">
      <div className="w-full max-w-sm">
        <Image src={logo} alt="Fredmotos" className="mx-auto h-12 w-auto brightness-0 invert" loading="eager" />
        <div className="mt-8 rounded-2xl border border-white/10 bg-ink/85 p-7 shadow-2xl">
          <h1 className="font-display text-2xl italic">Panel admin</h1>
          <p className="mt-1 text-sm text-white/60">Ingresa con tu correo y contraseña.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
