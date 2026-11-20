"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { HERO_TAG, SETTINGS_TAG } from "@/lib/content";
import { createAdminClient } from "@/lib/supabase/server";

export type FormState = { error?: string; ok?: string } | undefined;

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

// ---------------------------------------------------------------- Sesión

export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email");
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Escribe tu correo y contraseña." };

  const supabase = await createAdminClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Correo o contraseña incorrectos." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Esta cuenta no tiene acceso al panel." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createAdminClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- Carrusel

export async function createSlide(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const name = text(form, "name");
  const brand = text(form, "brand");
  const modelUrl = text(form, "model_url");
  if (!name) return { error: "Falta el nombre del producto." };
  if (!modelUrl) return { error: "Falta el modelo 3D." };

  const supabase = await createAdminClient();
  const { data: last } = await supabase
    .from("hero_slides")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase
    .from("hero_slides")
    .insert({ name, brand, model_url: modelUrl, position: (last?.position ?? -1) + 1 });
  if (error) return { error: `No se pudo guardar: ${error.message}` };

  updateTag(HERO_TAG);
  return { ok: "Diapositiva agregada." };
}

export async function updateSlide(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(form, "id");
  const name = text(form, "name");
  if (!id || !name) return { error: "Falta el nombre del producto." };

  const supabase = await createAdminClient();
  const { error } = await supabase.from("hero_slides").update({ name, brand: text(form, "brand") }).eq("id", id);
  if (error) return { error: `No se pudo guardar: ${error.message}` };

  updateTag(HERO_TAG);
  return { ok: "Guardado." };
}

export async function toggleSlide(id: string, active: boolean) {
  await requireAdmin();
  const supabase = await createAdminClient();
  await supabase.from("hero_slides").update({ active }).eq("id", id);
  updateTag(HERO_TAG);
}

export async function moveSlide(id: string, direction: "up" | "down") {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { data: rows } = await supabase.from("hero_slides").select("id, position").order("position");
  if (!rows) return;
  const i = rows.findIndex((r) => r.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= rows.length) return;
  // Reescribe el orden completo (0, 1, 2…) con los dos elementos intercambiados
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await Promise.all(rows.map((r, pos) => supabase.from("hero_slides").update({ position: pos }).eq("id", r.id)));
  updateTag(HERO_TAG);
}

export async function deleteSlide(id: string) {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { data: slide } = await supabase.from("hero_slides").select("model_url").eq("id", id).maybeSingle();
  await supabase.from("hero_slides").delete().eq("id", id);

  // Si el modelo se subió al panel (Storage "modelos") y ya nadie lo usa, se borra el archivo
  const marker = "/storage/v1/object/public/modelos/";
  const url = slide?.model_url ?? "";
  if (url.includes(marker)) {
    const { count } = await supabase
      .from("hero_slides")
      .select("id", { count: "exact", head: true })
      .eq("model_url", url);
    if (!count) await supabase.storage.from("modelos").remove([decodeURIComponent(url.split(marker)[1])]);
  }
  updateTag(HERO_TAG);
}

// ---------------------------------------------------------------- Textos y contacto

export async function updateSettings(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const whatsapp = text(form, "whatsapp").replace(/\D/g, "");
  if (whatsapp && !/^57\d{10}$/.test(whatsapp)) {
    return { error: "El WhatsApp debe ser un celular de Colombia: 57 seguido de los 10 dígitos (ej. 573001234567)." };
  }
  const email = text(form, "email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "El correo no es válido." };

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      whatsapp: whatsapp || null,
      phone: text(form, "phone") || null,
      email: email || null,
      address: text(form, "address") || null,
      hours: text(form, "hours") || null,
      distributor_text: text(form, "distributor_text") || null,
    })
    .eq("id", 1);
  if (error) return { error: `No se pudo guardar: ${error.message}` };

  updateTag(SETTINGS_TAG);
  return { ok: "Cambios guardados. Ya se ven en la página." };
}
