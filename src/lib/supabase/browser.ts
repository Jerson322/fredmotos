import { createBrowserClient } from "@supabase/ssr";

// Cliente de Supabase en el navegador (panel admin): sube archivos con la sesión del admin.
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
