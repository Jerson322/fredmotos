import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchIcon } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts, type Category } from "@/lib/products";
import { formatPrice } from "@/lib/site";

export const metadata: Metadata = { title: "Tienda" };

type SearchParams = PageProps<"/productos">["searchParams"];

export default function ProductsPage(props: PageProps<"/productos">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

function first(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

type HrefParams = { categoria?: string; q?: string; pagina?: number; max?: number; ofertas?: boolean };

function buildHref(params: HrefParams) {
  const sp = new URLSearchParams();
  if (params.categoria) sp.set("categoria", params.categoria);
  if (params.q) sp.set("q", params.q);
  if (params.max) sp.set("max", String(params.max));
  if (params.ofertas) sp.set("ofertas", "1");
  if (params.pagina && params.pagina > 1) sp.set("pagina", String(params.pagina));
  const qs = sp.toString();
  return qs ? `/productos?${qs}` : "/productos";
}

async function Catalog({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categoria = first(sp.categoria);
  const q = first(sp.q)?.trim() || undefined;
  const pagina = Number(first(sp.pagina)) || 1;
  const max = Number(first(sp.max)) || undefined;
  const ofertas = first(sp.ofertas) === "1";

  const categories = await getCategories();
  const selected = categoria ? categories.find((c) => c.slug === categoria) : undefined;
  const { items, total, page, totalPages } = await getProducts({
    category: selected?.slug,
    query: q,
    page: pagina,
    maxPrice: max,
    onSale: ofertas,
  });
  // Filtros que se conservan al cambiar de categoría, búsqueda o página.
  const keep = { max, ofertas };
  const allCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <>
      <div className="border-b-2 border-fg pb-4">
        <p className="label text-brand">{selected ? "Categoría" : "Catálogo"}</p>
        <h1 className="font-display mt-1 text-3xl sm:text-5xl">
          {ofertas ? "Ofertas" : selected ? selected.name : "Toda la tienda"}
        </h1>
        {(max || ofertas) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {max && (
              <FilterChip href={buildHref({ categoria: selected?.slug, q, ofertas })} label={`Hasta ${formatPrice(max)}`} />
            )}
            {ofertas && (
              <FilterChip href={buildHref({ categoria: selected?.slug, q, max })} label="Solo ofertas" />
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Categorías: lista en escritorio, carrusel en celular */}
        <aside>
          <h2 className="label mb-3 hidden text-mute lg:block">Categorías</h2>
          <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-line">
            <CategoryLink href={buildHref({ q, ...keep })} active={!selected} name="Todo" count={allCount} />
            {categories.map((c: Category) => (
              <CategoryLink
                key={c.slug}
                href={buildHref({ categoria: c.slug, q, ...keep })}
                active={selected?.slug === c.slug}
                name={c.name}
                count={c.count}
              />
            ))}
          </ul>
        </aside>

        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form action="/productos" role="search" className="flex w-full sm:max-w-md">
              {selected && <input type="hidden" name="categoria" value={selected.slug} />}
              {max && <input type="hidden" name="max" value={max} />}
              {ofertas && <input type="hidden" name="ofertas" value="1" />}
              <label htmlFor="buscar-catalogo" className="sr-only">Buscar en el catálogo</label>
              <input
                id="buscar-catalogo"
                type="search"
                name="q"
                defaultValue={q}
                placeholder={selected ? `Buscar en ${selected.name.toLowerCase()}…` : "Buscar por nombre, marca o código…"}
                className="h-11 w-full min-w-0 border border-r-0 border-line bg-card px-4 text-sm outline-none placeholder:text-mute focus:border-fg"
              />
              <button className="flex h-11 w-12 shrink-0 items-center justify-center bg-fg text-white hover:bg-brand" aria-label="Buscar">
                <SearchIcon />
              </button>
            </form>
            <p className="text-sm text-mute">
              <strong className="text-fg">{total}</strong> {total === 1 ? "producto" : "productos"}
              {q && (
                <>
                  {" "}para &ldquo;{q}&rdquo; ·{" "}
                  <Link href={buildHref({ categoria: selected?.slug, ...keep })} className="font-semibold text-brand hover:underline">
                    quitar búsqueda
                  </Link>
                </>
              )}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="mt-8 border border-dashed border-line bg-card px-6 py-16 text-center">
              <p className="font-display text-xl">Sin resultados</p>
              <p className="mt-2 text-mute">Prueba con otra palabra o escríbenos por WhatsApp y te lo buscamos.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.code} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-between border-t border-line pt-6 text-sm" aria-label="Paginación">
              {page > 1 ? (
                <Link href={buildHref({ categoria: selected?.slug, q, pagina: page - 1, ...keep })} className="font-bold uppercase tracking-wide hover:text-brand">
                  ← Anterior
                </Link>
              ) : (
                <span />
              )}
              <span className="text-mute">
                Página <strong className="text-fg">{page}</strong> de {totalPages}
              </span>
              {page < totalPages ? (
                <Link href={buildHref({ categoria: selected?.slug, q, pagina: page + 1, ...keep })} className="font-bold uppercase tracking-wide hover:text-brand">
                  Siguiente →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

function CategoryLink({ href, active, name, count }: { href: string; active: boolean; name: string; count: number }) {
  return (
    <li className="shrink-0">
      <Link
        href={href}
        className={`flex items-center justify-between gap-3 border px-4 py-2 text-sm transition lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-3 ${
          active ? "border-fg bg-fg font-bold text-white lg:bg-transparent lg:text-brand" : "border-line bg-card text-fg hover:text-brand lg:bg-transparent"
        }`}
      >
        <span className={active ? "lg:border-l-[3px] lg:border-brand lg:pl-3" : "lg:pl-0"}>{name}</span>
        <span className={`text-xs ${active ? "text-white/70 lg:text-brand" : "text-mute"}`}>{count}</span>
      </Link>
    </li>
  );
}

function FilterChip({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 bg-fg px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-brand"
      aria-label={`Quitar filtro: ${label}`}
    >
      {label}
      <span aria-hidden="true">✕</span>
    </Link>
  );
}

function CatalogSkeleton() {
  return (
    <>
      <div className="border-b-2 border-fg pb-4">
        <h1 className="font-display mt-1 text-3xl sm:text-5xl">Tienda</h1>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse bg-card" />
        ))}
      </div>
    </>
  );
}
