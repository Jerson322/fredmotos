import type { AgilProduct } from "./agil";

// Productos de ejemplo con la MISMA forma que devuelve Ágil.
// Solo se usan mientras no estén configuradas las credenciales de Ágil (AGIL_* en .env.local / Vercel).
const p = (code: string, name: string, grupo: string, brand: string, price: number, stock: number): AgilProduct => ({
  code,
  name,
  grupo,
  brand,
  presentation: "UNIDAD",
  price: [{ price }],
  inventory: [{ bodega: "PRINCIPAL", inventory: stock }],
});

export const sampleAgilProducts: AgilProduct[] = [
  p("1001", "KIT DE ARRASTRE 428 125-200CC", "REPUESTOS", "GENERICO", 180000, 12),
  p("1002", "PASTILLAS DE FRENO DELANTERAS", "REPUESTOS", "GENERICO", 45000, 30),
  p("2001", "CASCO INTEGRAL NEGRO MATE", "CASCOS", "GENERICO", 350000, 6),
  p("2002", "CASCO ABIERTO ROJO", "CASCOS", "GENERICO", 190000, 4),
  p("3001", "GUANTES CON PROTECCION", "ACCESORIOS", "GENERICO", 85000, 18),
  p("3002", "SOPORTE DE CELULAR PARA MANUBRIO", "ACCESORIOS", "GENERICO", 55000, 25),
  p("4001", "ACEITE 4T 20W-50 1L", "LUBRICANTES", "GENERICO", 32000, 40),
  p("4002", "LUBRICANTE DE CADENA SPRAY", "LUBRICANTES", "GENERICO", 28000, 15),
];
