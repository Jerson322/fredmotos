import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Tienda" };

type SearchParams = PageProps<"/productos">["searchParams"];

export default function ProductsPage(props: PageProps<"/productos">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

function first(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function buildHref(params: { categoria?: string; q?: string; pagina?: number }) {
  const sp = new URLSearchParams();
  if (params.categoria) sp.set("categoria", params.categoria);
  if (params.q) sp.set("q", params.q);
  if (params.pagina && params.pagina > 1) sp.set("pagina", String(params.pagina));
  const qs = sp.toString();
  return qs ? `/productos?${qs}` : "/productos";
}

async function Catalog({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categoria = first(sp.categoria);
  const q = first(sp.q)?.trim() || undefined;
  const pagina = Number(first(sp.pagina)) || 1;

  const categories = await getCategories();
  const selected = categoria ? categories.find((c) => c.slug === categoria) : undefined;
  const { items, total, page, totalPages } = await getProducts({ category: selected?.slug, query: q, page: pagina });

  return (
    <>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{selected ? selected.name : "Tienda"}</h1>
      <p className="mt-2 text-muted">
        {total} {total === 1 ? "producto" : "productos"}
        {q && <> para &ldquo;{q}&rdquo;</>}
      </p>

      <form action="/productos" className="mt-6 flex gap-2">
        {selected && <input type="hidden" name="categoria" value={selected.slug} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, marca o código…"
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand"
        />
        <button className="rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark">Buscar</button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip href={buildHref({ q })} active={!selected} label="Todos" />
        {categories.map((c) => (
          <FilterChip
            key={c.slug}
            href={buildHref({ categoria: c.slug, q })}
            active={selected?.slug === c.slug}
            label={`${c.name} (${c.count})`}
          />
        ))}
      </div>

      {items.length === 0 ? (
        <p className="mt-12 text-center text-muted">No encontramos productos con esos filtros.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.code} product={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4 text-sm" aria-label="Paginación">
          {page > 1 ? (
            <Link href={buildHref({ categoria: selected?.slug, q, pagina: page - 1 })} className="rounded-md border border-border px-4 py-2 hover:border-foreground">
              ← Anterior
            </Link>
          ) : (
            <span className="px-4 py-2 text-muted/50">← Anterior</span>
          )}
          <span className="text-muted">
            Página {page} de {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={buildHref({ categoria: selected?.slug, q, pagina: page + 1 })} className="rounded-md border border-border px-4 py-2 hover:border-foreground">
              Siguiente →
            </Link>
          ) : (
            <span className="px-4 py-2 text-muted/50">Siguiente →</span>
          )}
        </nav>
      )}
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
