import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { categories, getCategory, getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Tienda" };

export default function ProductsPage(props: PageProps<"/productos">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ searchParams }: { searchParams: PageProps<"/productos">["searchParams"] }) {
  const { categoria } = await searchParams;
  const selected = typeof categoria === "string" ? getCategory(categoria) : undefined;
  const items = getProducts(selected?.slug);

  return (
    <>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{selected ? selected.name : "Tienda"}</h1>
      <p className="mt-2 text-muted">{selected ? selected.description : "Todos nuestros productos"}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <FilterChip href="/productos" active={!selected} label="Todos" />
        {categories.map((c) => (
          <FilterChip
            key={c.slug}
            href={`/productos?categoria=${c.slug}`}
            active={selected?.slug === c.slug}
            label={c.name}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}

function CatalogSkeleton() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Tienda</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-surface" />
        ))}
      </div>
    </>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm transition ${
        active ? "border-brand bg-brand text-white" : "border-border text-muted hover:border-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
