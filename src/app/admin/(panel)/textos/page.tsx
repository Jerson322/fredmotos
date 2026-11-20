import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { defaultSettings } from "@/lib/site";
import SettingsForm from "./SettingsForm";

export const metadata: Metadata = { title: "Textos y contacto" };

export default async function SettingsAdmin() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("whatsapp, phone, email, address, hours, distributor_text")
    .eq("id", 1)
    .maybeSingle();

  return (
    <>
      <h1 className="font-display text-3xl italic">Textos y contacto</h1>
      <p className="mt-2 max-w-2xl text-mute">
        Se usan en toda la página: botón de WhatsApp, pie de página, contacto, fichas de producto y la sección de
        distribuidores. Si dejas un campo vacío se usa el valor por defecto (el gris).
      </p>
      {error && (
        <p className="mt-6 rounded-xl bg-brand/10 p-4 text-sm text-brand-dark">
          No se pudieron leer los ajustes: {error.message}. ¿Ya se ejecutó la migración 0002 en Supabase?
        </p>
      )}
      <SettingsForm
        values={{
          whatsapp: data?.whatsapp ?? "",
          phone: data?.phone ?? "",
          email: data?.email ?? "",
          address: data?.address ?? "",
          hours: data?.hours ?? "",
          distributor_text: data?.distributor_text ?? "",
        }}
        defaults={defaultSettings}
      />
    </>
  );
}
