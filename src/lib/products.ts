// Datos de ejemplo. En la fase 2 esto vendrá de la base de datos (Supabase).

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  description: string;
  featured?: boolean;
};

export const categories: Category[] = [
  { slug: "repuestos", name: "Repuestos", description: "Piezas para mantener tu moto al 100%" },
  { slug: "cascos", name: "Cascos", description: "Protección certificada para cada viaje" },
  { slug: "accesorios", name: "Accesorios", description: "Equipa y personaliza tu moto" },
  { slug: "lubricantes", name: "Lubricantes", description: "Aceites y cuidado del motor" },
];

export const products: Product[] = [
  {
    slug: "kit-arrastre-428",
    name: "Kit de arrastre 428",
    category: "repuestos",
    price: 180000,
    compareAtPrice: 220000,
    stock: 12,
    description: "Cadena, piñón y corona para motos de 125 a 200 cc. Mayor duración y menos ruido.",
    featured: true,
  },
  {
    slug: "pastillas-freno-delanteras",
    name: "Pastillas de freno delanteras",
    category: "repuestos",
    price: 45000,
    stock: 30,
    description: "Compuesto semimetálico con frenado firme en seco y mojado.",
  },
  {
    slug: "casco-integral-negro-mate",
    name: "Casco integral negro mate",
    category: "cascos",
    price: 350000,
    stock: 6,
    description: "Casco integral con visor antirrayas, forro desmontable y cierre de liberación rápida.",
    featured: true,
  },
  {
    slug: "casco-abierto-rojo",
    name: "Casco abierto rojo",
    category: "cascos",
    price: 190000,
    stock: 0,
    description: "Casco 3/4 ligero con visor largo, ideal para ciudad.",
  },
  {
    slug: "guantes-proteccion",
    name: "Guantes con protección",
    category: "accesorios",
    price: 85000,
    stock: 18,
    description: "Guantes con nudillos reforzados y palma antideslizante.",
    featured: true,
  },
  {
    slug: "soporte-celular",
    name: "Soporte de celular para manubrio",
    category: "accesorios",
    price: 55000,
    stock: 25,
    description: "Soporte de aluminio con agarre firme y rotación 360°.",
  },
  {
    slug: "aceite-4t-20w50",
    name: "Aceite 4T 20W-50 (1 L)",
    category: "lubricantes",
    price: 32000,
    stock: 40,
    description: "Aceite para motores de 4 tiempos. Protección en altas temperaturas.",
    featured: true,
  },
  {
    slug: "lubricante-cadena",
    name: "Lubricante de cadena en spray",
    category: "lubricantes",
    price: 28000,
    stock: 15,
    description: "Reduce el desgaste y protege la cadena del agua y el polvo.",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProducts(category?: string) {
  return category ? products.filter((p) => p.category === category) : products;
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}
