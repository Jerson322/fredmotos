"use client";

import { useActionState, useTransition } from "react";
import { deleteSlide, moveSlide, toggleSlide, updateSlide } from "../../actions";

export type SlideData = {
  id: string;
  brand: string;
  name: string;
  model_url: string;
  active: boolean;
  position: number;
  media_type?: "model" | "image"; // no existe hasta ejecutar la migración 0003
};

export default function SlideRow({ slide, first, last }: { slide: SlideData; first: boolean; last: boolean }) {
  const [state, save, saving] = useActionState(updateSlide, undefined);
  const [busy, start] = useTransition();
  const file = decodeURIComponent(slide.model_url.split("/").pop() ?? "");
  const isImage = slide.media_type === "image";

  return (
    <li className={`rounded-2xl border bg-card p-4 sm:p-5 ${slide.active ? "border-line" : "border-dashed border-line opacity-60"}`}>
      <form action={save} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <input type="hidden" name="id" value={slide.id} />
        <Field label="Marca / modelo (letras blancas)" name="brand" defaultValue={slide.brand} placeholder="HJC RPHA" />
        <Field label="Nombre (letras rojas)" name="name" defaultValue={slide.name} required placeholder="Funky Diablo" />
        <button disabled={saving} className="h-10 rounded-lg bg-ink px-4 text-sm font-bold text-white hover:bg-brand disabled:opacity-60">
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </form>
      {state?.error && <p className="mt-2 text-sm text-brand">{state.error}</p>}
      {state?.ok && <p className="mt-2 text-sm text-green-700">{state.ok}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3 text-sm">
        <a href={slide.model_url} target="_blank" rel="noopener noreferrer" className="mr-auto truncate text-mute hover:text-brand">
          {isImage ? "Imagen" : "Modelo 3D"}: {file}
        </a>
        <RowButton disabled={busy || first} onClick={() => start(() => moveSlide(slide.id, "up"))}>
          ↑ Subir
        </RowButton>
        <RowButton disabled={busy || last} onClick={() => start(() => moveSlide(slide.id, "down"))}>
          ↓ Bajar
        </RowButton>
        <RowButton disabled={busy} onClick={() => start(() => toggleSlide(slide.id, !slide.active))}>
          {slide.active ? "Ocultar" : "Mostrar"}
        </RowButton>
        <RowButton
          disabled={busy}
          danger
          onClick={() => {
            if (confirm(`¿Eliminar "${slide.brand} ${slide.name}" del carrusel?`)) start(() => deleteSlide(slide.id));
          }}
        >
          Eliminar
        </RowButton>
      </div>
    </li>
  );
}

function Field(props: { label: string; name: string; defaultValue?: string; placeholder?: string; required?: boolean }) {
  const { label, ...input } = props;
  return (
    <label className="block">
      <span className="label text-mute">{label}</span>
      <input {...input} className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 outline-none focus:border-fg" />
    </label>
  );
}

function RowButton({
  children,
  danger,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-lg border px-3 py-1.5 transition disabled:opacity-40 ${
        danger ? "border-brand/30 text-brand hover:bg-brand hover:text-white" : "border-line hover:border-fg"
      }`}
    >
      {children}
    </button>
  );
}
