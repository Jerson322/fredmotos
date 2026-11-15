// Conexión con el ERP Ágil (mismo API que usa Ultrallantas, con credenciales de Fredmotos).
// Solo se usa en el servidor: las credenciales NUNCA llevan prefijo NEXT_PUBLIC_.

export type AgilProduct = {
  code: string | number;
  name: string;
  grupo?: string | null;
  sub_grupo?: string | null;
  brand?: string | null;
  description?: string | null;
  presentation?: string | null;
  price?: { price: number | string }[] | null;
  inventory?: { bodega?: string; inventory: number }[] | null;
};

const config = {
  url: process.env.AGIL_API_URL?.replace(/\/+$/, ""), // ej: http://IP/agilapi/api
  username: process.env.AGIL_USERNAME,
  password: process.env.AGIL_PASSWORD,
  empresa: process.env.AGIL_EMPRESA || "001",
};

export const agilConfigured = Boolean(config.url && config.username && config.password);

async function login(): Promise<string> {
  const res = await fetch(`${config.url}/agillogin/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Username: config.username, Password: config.password }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Ágil login falló (${res.status})`);
  const token = (await res.text()).replace(/"/g, "").trim();
  if (!token) throw new Error("Ágil no devolvió token");
  return token;
}

// La respuesta de Ágil trae el arreglo de productos anidado en distintas llaves; lo buscamos.
function findArray(obj: unknown): AgilProduct[] {
  if (Array.isArray(obj)) return obj as AgilProduct[];
  if (obj && typeof obj === "object") {
    for (const value of Object.values(obj)) {
      const found = findArray(value);
      if (found.length) return found;
    }
  }
  return [];
}

const PAGE_SIZE = 2000;
const MAX_PAGES = 10;

/** Trae todos los productos de Ágil (paginado, igual que Ultrallantas). */
export async function fetchAgilProducts(): Promise<AgilProduct[]> {
  const token = await login();
  const seen = new Set<string>();
  const all: AgilProduct[] = [];

  for (let page = 0, start = 0; page < MAX_PAGES; page++, start += PAGE_SIZE) {
    const res = await fetch(`${config.url}/customer/product`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ Empresa: config.empresa, inicio: String(start), Limite: String(PAGE_SIZE) }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Ágil productos falló (${res.status})`);

    let data: unknown;
    try {
      data = JSON.parse(await res.text());
    } catch {
      break;
    }

    const batch = findArray(data);
    if (!batch.length) break;

    // Ágil a veces repite la misma página al llegar al final: solo tomamos códigos nuevos.
    const fresh = batch.filter((p) => !seen.has(String(p.code)));
    if (!fresh.length) break;
    fresh.forEach((p) => seen.add(String(p.code)));
    all.push(...fresh);

    if (batch.length < PAGE_SIZE) break;
  }

  return all;
}
