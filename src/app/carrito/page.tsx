import type { Metadata } from "next";
import Link from "next/link";
import { CartIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Carrito" };

// El carrito real se construye en la fase 3.
export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="border-b-2 border-fg pb-4">
        <h1 className="font-display text-3xl sm:text-5xl">Tu carrito</h1>
      </div>
      <div className="mt-8 flex flex-col items-center border border-dashed border-line bg-card px-6 py-20 text-center">
        <CartIcon className="h-12 w-12 text-mute" />
        <p className="font-display mt-4 text-xl">Aún no has agregado productos</p>
        <Link href="/productos" className="mt-6 bg-brand px-7 py-4 font-bold uppercase tracking-wide text-white hover:bg-brand-dark">
          Ir a la tienda
        </Link>
      </div>
    </div>
  );
}
