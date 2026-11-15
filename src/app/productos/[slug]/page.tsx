import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import { getCategory, getProduct, products } from "@/lib/products";
import { formatPrice, whatsappLink } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage(props: PageProps<"/productos/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const outOfStock = product.stock <= 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-muted">
        <Link href="/productos" className="hover:text-foreground">Tienda</Link>
        {" / "}
        <Link href={`/productos?categoria=${category?.slug}`} className="hover:text-foreground">
          {category?.name}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductImage name={product.name} className="rounded-lg border border-border" />

        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <p className={`mt-2 text-sm ${outOfStock ? "text-muted" : "text-green-500"}`}>
            {outOfStock ? "Agotado por ahora" : `Disponible · ${product.stock} en stock`}
          </p>

          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          {/* El carrito se conecta en la fase 3 */}
          <button
            type="button"
            disabled={outOfStock}
            className="mt-8 w-full rounded-md bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-neutral-700"
          >
            {outOfStock ? "Agotado" : "Agregar al carrito"}
          </button>
          <a
            href={whatsappLink(`Hola, me interesa: ${product.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full rounded-md border border-border px-6 py-3 text-center font-semibold transition hover:border-foreground"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
