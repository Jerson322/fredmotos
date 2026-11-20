import "server-only";
import { redirect } from "next/navigation";
import { createAdminClient } from "./supabase/server";

// Capa de acceso del panel: toda página o acción del admin pasa por aquí.
// Además de esto, Supabase (RLS) solo deja escribir a usuarios de la tabla `admins`.

export type AdminUser = { id: string; email: string };

/** Devuelve el admin con sesión iniciada, o null si no hay sesión o no es admin. */
export async function getAdmin(): Promise<AdminUser | null> {
  const supabase = await createAdminClient();
  const { data: auth } = await supabase.auth.getUser(); // valida el token con Supabase
  if (!auth.user) return null;
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return null;
  return { id: auth.user.id, email: auth.user.email ?? "" };
}

/** Como getAdmin, pero manda al login si no hay un admin válido. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
