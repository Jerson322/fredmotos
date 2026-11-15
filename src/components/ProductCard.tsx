import Link from "next/link";
import type { Product } from "@/lib/products";
import { getCategory } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition hover:border-brand"
    >
      <div className="relative">
        <ProductImage name={product.name} />
        {product.compareAtPrice && !outOfStock && (
          <span className="absolute left-3 top-3 rounded bg-brand px-2 py-1 text-xs font-bold text-white">
            OFERTA
          </span>
        )}
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded bg-neutral-700 px-2 py-1 text-xs font-bold text-white">
            AGOTADO
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs uppercase tracking-wide text-muted">{category?.name}</span>
        <h3 className="mt-1 font-semibold group-hover:text-brand">{product.name}</h3>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
