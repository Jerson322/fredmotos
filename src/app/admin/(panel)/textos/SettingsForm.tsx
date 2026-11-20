"use client";

import { useActionState } from "react";
import type { Settings } from "@/lib/site";
import { updateSettings } from "../../actions";

type Values = {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  distributor_text: string;
};

export default function SettingsForm({ values, defaults }: { values: Values; defaults: Settings }) {
  const [state, action, saving] = useActionState(updateSettings, undefined);

  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5 rounded-2xl border border-line bg-card p-5 sm:p-6">
      <Field
        label="WhatsApp"
        name="whatsapp"
        defaultValue={values.whatsapp}
        placeholder={defaults.whatsapp}
        hint="Celular con 57 adelante, sin + ni espacios. Ej: 573001234567"
        inputMode="numeric"
      />
      <Field label="Teléfono (como se muestra)" name="phone" defaultValue={values.phone} placeholder={defaults.phone} />
      <Field label="Correo" name="email" type="email" defaultValue={values.email} placeholder={defaults.email} />
      <Field label="Dirección" name="address" defaultValue={values.address} placeholder={defaults.address} />
      <Field label="Horario" name="hours" defaultValue={values.hours} placeholder={defaults.hours} />
      <label className="block">
        <span className="label text-mute">Texto de distribuidores</span>
        <textarea
          name="distributor_text"
          rows={4}
          defaultValue={values.distributor_text}
          placeholder={defaults.distributorText}
          className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 outline-none focus:border-fg"
        />
      </label>

      {state?.error && <p className="text-sm text-brand">{state.error}</p>}
      {state?.ok && <p className="text-sm text-green-700">{state.ok}</p>}

      <button disabled={saving} className="h-11 rounded-lg bg-brand px-6 font-bold uppercase tracking-wide text-white hover:bg-brand-dark disabled:opacity-60">
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; hint?: string },
) {
  const { label, hint, ...input } = props;
  return (
    <label className="block">
      <span className="label text-mute">{label}</span>
      <input {...input} className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 outline-none focus:border-fg" />
      {hint && <span className="mt-1 block text-xs text-mute">{hint}</span>}
    </label>
  );
}
