import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group relative flex flex-col bg-card transition-shadow hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
    >
      <div className="relative">
        <ProductImage name={product.name} src={product.images[0]} />
        {discount > 0 && (
          <span className="cut-r absolute left-0 top-3 bg-brand py-1 pl-3 pr-5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col border-t border-line p-4">
        <span className="label text-mute">{product.brand ?? product.category.name}</span>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>

        <div className="mt-auto pt-4">
          {product.compareAtPrice && (
            <span className="block text-xs text-mute line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
          <div className="flex items-end justify-between gap-2">
            <span className="text-lg font-extrabold tracking-tight">{formatPrice(product.price)}</span>
            <span className="text-[11px] text-mute">Cód. {product.code}</span>
          </div>
          {lowStock && <p className="mt-1 text-xs font-semibold text-brand">¡Últimas {product.stock} unidades!</p>}
        </div>
      </div>

      {/* Barra roja al pasar el mouse */}
      <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}
