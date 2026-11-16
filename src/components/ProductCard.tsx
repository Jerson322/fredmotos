import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { ArrowIcon } from "./Icons";
import ProductImage from "./ProductImage";

const SIZES = "(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 25vw";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;
  const lowStock = product.stock > 0 && product.stock <= 3;
  const [first, second] = product.images;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group relative flex h-full flex-col bg-card transition-shadow hover:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.3)]"
    >
      <div className="relative overflow-hidden">
        <ProductImage
          name={product.name}
          src={first}
          sizes={SIZES}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {/* Segunda foto al pasar el mouse, si existe */}
        {second && (
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <Image src={second} alt="" fill sizes={SIZES} className="object-contain p-4" />
          </div>
        )}
        {discount > 0 && (
          <span className="cut-r absolute left-0 top-3 bg-brand py-1 pl-3 pr-5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {lowStock && (
          <span className="absolute right-0 top-3 bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Últimas {product.stock}
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
        </div>

        <span className="mt-4 flex items-center justify-center gap-2 border border-fg py-2.5 text-xs font-bold uppercase tracking-wider transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
          Ver producto
          <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
