import { cacheLife, cacheTag } from "next/cache";
import { defaultSettings, type Settings } from "./site";
import { supabase } from "./supabase";

// Contenido editable desde el panel admin. Cacheado; el panel lo invalida al guardar.
export const HERO_TAG = "inicio";
export const SETTINGS_TAG = "ajustes";

export type HeroSlide = {
  id: string;
  brand: string;
  name: string;
  modelUrl: string;
};

// Si aún no hay diapositivas en Supabase, se muestra el casco que ya está en el proyecto.
const fallbackSlides: HeroSlide[] = [
  { id: "local-casco", brand: "HJC RPHA", name: "Funky Diablo", modelUrl: "/models/casco.glb" },
];

export async function getHeroSlides(): Promise<HeroSlide[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(HERO_TAG);

  if (!supabase) return fallbackSlides;
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, brand, name, model_url")
    .eq("active", true)
    .order("position", { ascending: true });
  if (error) {
    console.warn(`[inicio] Sin carrusel de Supabase: ${error.message}`);
    return fallbackSlides;
  }
  if (!data?.length) return fallbackSlides;
  return data.map((s) => ({ id: s.id, brand: s.brand ?? "", name: s.name, modelUrl: s.model_url }));
}

export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheLife("hours");
  cacheTag(SETTINGS_TAG);

  if (!supabase) return defaultSettings;
  const { data, error } = await supabase
    .from("site_settings")
    .select("whatsapp, phone, email, address, hours, distributor_text")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    if (error) console.warn(`[ajustes] Sin ajustes de Supabase: ${error.message}`);
    return defaultSettings;
  }
  // Campo vacío en Supabase → se usa el valor por defecto
  return {
    whatsapp: data.whatsapp || defaultSettings.whatsapp,
    phone: data.phone || defaultSettings.phone,
    email: data.email || defaultSettings.email,
    address: data.address || defaultSettings.address,
    hours: data.hours || defaultSettings.hours,
    distributorText: data.distributor_text || defaultSettings.distributorText,
  };
}
