import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardIcon, ChatIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import ProductImage from "@/components/ProductImage";
import { getPrebuiltSlugs, getProduct } from "@/lib/products";
import { formatPrice, whatsappLink } from "@/lib/site";

// Se pre-generan los destacados; el resto se genera en su primera visita y queda en caché.
export async function generateStaticParams() {
  const slugs = await getPrebuiltSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description || `${product.name} en Fredmotos. ${formatPrice(product.price)}.`,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage(props: PageProps<"/productos/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const { category } = product;
  const outOfStock = product.stock <= 0;
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <nav className="label flex flex-wrap gap-2 text-mute" aria-label="Ruta">
        <Link href="/" className="hover:text-fg">Inicio</Link>/
        <Link href="/productos" className="hover:text-fg">Tienda</Link>/
        <Link href={`/productos?categoria=${category.slug}`} className="hover:text-fg">{category.name}</Link>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* Fotos */}
        <div className="space-y-3">
          <div className="relative border border-line bg-white">
            <ProductImage name={product.name} src={product.images[0]} sizes="(max-width: 1024px) 100vw, 55vw" priority />
            {discount > 0 && (
              <span className="cut-r absolute left-0 top-4 bg-brand py-1.5 pl-4 pr-6 text-sm font-bold text-white">
                -{discount}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((src) => (
                <div key={src} className="border border-line bg-white">
                  <ProductImage name={product.name} src={src} sizes="15vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compra */}
        <div>
          {product.brand && <p className="label text-brand">{product.brand}</p>}
          <h1 className="font-display mt-2 text-3xl leading-[1.02] sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-sm text-mute">
            Código {product.code} · {product.presentation.toLowerCase()}
          </p>

          <div className="mt-6 border-y border-line py-6">
            {product.compareAtPrice && (
              <p className="text-mute">
                Antes <span className="line-through">{formatPrice(product.compareAtPrice)}</span>
              </p>
            )}
            <p className="text-4xl font-extrabold tracking-tight">{formatPrice(product.price)}</p>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
              <span className={`h-2.5 w-2.5 ${outOfStock ? "bg-mute" : product.stock <= 3 ? "bg-brand" : "bg-[#1f9d55]"}`} />
              {outOfStock
                ? "Agotado por ahora"
                : product.stock <= 3
                  ? `¡Quedan solo ${product.stock}!`
                  : "Disponible para entrega"}
            </p>
          </div>

          {/* El carrito se conecta en la fase 3 */}
          <button
            type="button"
            disabled={outOfStock}
            className="mt-6 h-14 w-full bg-brand font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-mute"
          >
            {outOfStock ? "Agotado" : "Agregar al carrito"}
          </button>
          <a
            href={whatsappLink(`Hola, me interesa: ${product.name} (código ${product.code})`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex h-14 w-full items-center justify-center gap-2 border-2 border-fg font-bold uppercase tracking-wide transition hover:bg-fg hover:text-white"
          >
            <ChatIcon />
            ¿Le sirve a mi moto? Pregúntanos
          </a>

          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-center gap-3"><TruckIcon className="h-5 w-5 text-brand" /> Despachos a tu ciudad</li>
            <li className="flex items-center gap-3"><CardIcon className="h-5 w-5 text-brand" /> Paga con PSE, tarjeta o Nequi</li>
            <li className="flex items-center gap-3"><ShieldIcon className="h-5 w-5 text-brand" /> Producto con garantía</li>
          </ul>

          {product.description && (
            <div className="mt-8 border-t border-line pt-6">
              <h2 className="label text-mute">Descripción</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
