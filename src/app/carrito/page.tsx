import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Carrito" };

// El carrito real se construye en la fase 3.
export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Tu carrito</h1>
      <p className="mt-3 text-muted">Tu carrito está vacío.</p>
      <Link
        href="/productos"
        className="mt-8 inline-block rounded-md bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
      >
        Ir a la tienda
      </Link>
    </div>
  );
}
