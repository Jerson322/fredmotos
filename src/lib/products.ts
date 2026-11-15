import { cacheLife, cacheTag } from "next/cache";
import { agilConfigured, fetchAgilProducts, type AgilProduct } from "./agil";
import { sampleAgilProducts } from "./sample-products";
import { supabase } from "./supabase";

// =====================================================================
// Catálogo = productos de Ágil (nombre, precio, stock, grupo)
//          + extras de Supabase (fotos, descripción web, destacado, oferta, oculto)
// =====================================================================

export type Category = {
  slug: string;
  name: string;
  count: number;
};

export type Product = {
  code: string; // código del producto en Ágil
  slug: string;
  name: string;
  brand: string | null;
  description: string;
  category: Category;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  presentation: string;
  featured: boolean;
  images: string[];
};

type ProductExtra = {
  code: string;
  images: string[] | null;
  description: string | null;
  featured: boolean;
  hidden: boolean;
  compare_at_price: number | null;
};

// Etiqueta de caché: el panel de administración la invalidará al editar extras.
export const CATALOG_TAG = "catalogo";

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "ACEITE 4T 20W-50 1L" → "Aceite 4T 20W-50 1L": las palabras con números (referencias,
// medidas, cilindrajes) se dejan en mayúsculas.
function titleCase(text: string) {
  return text
    .split(/(\s+)/)
    .map((word) =>
      /\d/.test(word) ? word.toUpperCase() : word.toLowerCase().replace(/^\p{L}/u, (c) => c.toUpperCase()),
    )
    .join("");
}

async function fetchExtras(): Promise<Map<string, ProductExtra>> {
  if (!supabase) return new Map();
  const { data, error } = await supabase
    .from("producto_extras")
    .select("code, images, description, featured, hidden, compare_at_price");
  if (error) {
    // Si la tabla aún no existe o Supabase falla, la tienda sigue funcionando solo con Ágil.
    console.warn(`[catalogo] Sin extras de Supabase: ${error.message}`);
    return new Map();
  }
  return new Map((data as ProductExtra[]).map((e) => [String(e.code), e]));
}

function toProduct(p: AgilProduct, extra: ProductExtra | undefined): Product | null {
  const code = String(p.code ?? "").trim();
  const name = String(p.name ?? "").trim();
  const price = Number(p.price?.[0]?.price) || 0;
  const stock = (p.inventory ?? []).reduce((sum, i) => sum + (Number(i.inventory) || 0), 0);
  if (!code || !name || price <= 0) return null;

  const group = String(p.grupo ?? "").trim() || "OTROS";
  const compare = extra?.compare_at_price && extra.compare_at_price > price ? extra.compare_at_price : null;

  return {
    code,
    slug: `${slugify(name)}-${slugify(code)}`,
    name: titleCase(name),
    brand: p.brand?.trim() || p.sub_grupo?.trim() || null,
    description: extra?.description?.trim() || p.description?.trim() || "",
    category: { slug: slugify(group), name: titleCase(group), count: 0 },
    price,
    compareAtPrice: compare,
    stock,
    presentation: p.presentation?.trim() || "UNIDAD",
    featured: extra?.featured ?? false,
    images: extra?.images ?? [],
  };
}

/** Catálogo completo, cacheado ~2 minutos (como Ultrallantas). */
async function getCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 120, expire: 60 * 60 * 24 });
  cacheTag(CATALOG_TAG);

  let raw: AgilProduct[];
  if (agilConfigured) {
    raw = await fetchAgilProducts();
  } else {
    console.warn("[catalogo] Ágil no configurado (AGIL_* en .env.local): usando productos de ejemplo.");
    raw = sampleAgilProducts;
  }

  const extras = await fetchExtras();
  const products = raw
    .map((p) => toProduct(p, extras.get(String(p.code))))
    .filter((p): p is Product => p !== null && p.stock > 0 && !extras.get(p.code)?.hidden)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  const byCategory = new Map<string, Category>();
  for (const p of products) {
    const c = byCategory.get(p.category.slug) ?? { ...p.category, count: 0 };
    c.count++;
    byCategory.set(c.slug, c);
  }
  const categories = [...byCategory.values()].sort((a, b) => b.count - a.count);

  return { products, categories };
}

export async function getCategories() {
  return (await getCatalog()).categories;
}

export const PAGE_SIZE = 24;

export async function getProducts(opts: { category?: string; query?: string; page?: number } = {}) {
  const { products } = await getCatalog();
  const q = opts.query ? slugify(opts.query) : "";

  const filtered = products.filter(
    (p) =>
      (!opts.category || p.category.slug === opts.category) &&
      (!q || slugify(`${p.name} ${p.brand ?? ""} ${p.code}`).includes(q)),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, opts.page ?? 1), totalPages);
  return {
    items: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: filtered.length,
    page,
    totalPages,
  };
}

export async function getFeaturedProducts(limit = 8) {
  const { products } = await getCatalog();
  const featured = products.filter((p) => p.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  // Completar con productos que tengan foto y buen stock.
  const rest = products
    .filter((p) => !p.featured)
    .sort((a, b) => b.images.length - a.images.length || b.stock - a.stock);
  return [...featured, ...rest].slice(0, limit);
}

export async function getProduct(slug: string) {
  const { products } = await getCatalog();
  return products.find((p) => p.slug === slug);
}

/** Productos a pre-generar al compilar (el resto se genera en la primera visita). */
export async function getPrebuiltSlugs(limit = 40) {
  return (await getFeaturedProducts(limit)).map((p) => p.slug);
}
