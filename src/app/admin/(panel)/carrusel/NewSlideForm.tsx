"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { createSlide } from "../../actions";

// Modelos que ya están en la página (carpeta public/models)
const localModels = [
  { url: "/models/casco.glb", label: "Casco HJC RPHA Funky Diablo" },
  { url: "/models/chaqueta.glb", label: "Chaqueta" },
  { url: "/models/guantes.glb", label: "Guantes" },
  { url: "/models/impermeable.glb", label: "Impermeable" },
];

const MAX_MB = 50; // límite de Supabase (plan gratis)
const WARN_MB = 10; // más que esto carga lento en celular

export default function NewSlideForm() {
  const [state, action, saving] = useActionState(createSlide, undefined);
  const [source, setSource] = useState<"upload" | "local">("upload");
  const [uploadError, setUploadError] = useState<string>();
  const [uploading, startUpload] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploadError(undefined);
    const form = new FormData(e.currentTarget);

    if (source === "upload") {
      const file = form.get("file");
      if (!(file instanceof File) || file.size === 0) return setUploadError("Elige el archivo .glb del modelo.");
      if (!file.name.toLowerCase().endsWith(".glb")) return setUploadError("El modelo debe ser un archivo .glb.");
      const mb = file.size / 1024 / 1024;
      if (mb > MAX_MB) return setUploadError(`El archivo pesa ${mb.toFixed(0)} MB; el máximo es ${MAX_MB} MB.`);
      if (
        mb > WARN_MB &&
        !confirm(`El modelo pesa ${mb.toFixed(0)} MB y la página cargará lento en celular. Lo ideal es comprimirlo antes (menos de ${WARN_MB} MB). ¿Subirlo igual?`)
      ) {
        return;
      }

      startUpload(async () => {
        const supabase = createBrowserSupabase();
        const path = `${crypto.randomUUID()}.glb`;
        const { error } = await supabase.storage
          .from("modelos")
          .upload(path, file, { contentType: "model/gltf-binary", cacheControl: "31536000" });
        if (error) {
          setUploadError(`No se pudo subir el modelo: ${error.message}`);
          return;
        }
        const { data } = supabase.storage.from("modelos").getPublicUrl(path);
        form.set("model_url", data.publicUrl);
        form.delete("file");
        action(form);
        formRef.current?.reset();
      });
    } else {
      startUpload(() => {
        action(form);
      });
    }
  }

  const busy = saving || uploading;

  return (
    <form ref={formRef} onSubmit={onSubmit} className="mt-3 space-y-4 rounded-2xl border border-line bg-card p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="label text-mute">Marca / modelo (letras blancas)</span>
          <input name="brand" placeholder="HJC RPHA" className={inputClass} />
        </label>
        <label className="block">
          <span className="label text-mute">Nombre (letras rojas) *</span>
          <input name="name" required placeholder="Funky Diablo" className={inputClass} />
        </label>
      </div>

      <fieldset>
        <legend className="label text-mute">Modelo 3D</legend>
        <div className="mt-2 flex gap-2 text-sm">
          <SourceTab active={source === "upload"} onClick={() => setSource("upload")}>
            Subir archivo .glb
          </SourceTab>
          <SourceTab active={source === "local"} onClick={() => setSource("local")}>
            Usar uno de la página
          </SourceTab>
        </div>
        {source === "upload" ? (
          <>
            <input
              name="file"
              type="file"
              accept=".glb,model/gltf-binary"
              className="mt-3 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-ink file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-brand"
            />
            <p className="mt-2 text-xs text-mute">
              Formato .glb, idealmente de menos de {WARN_MB} MB. Si pesa más, comprímelo en gltf.report antes de subirlo.
            </p>
          </>
        ) : (
          <select name="model_url" className={`${inputClass} mt-3`} defaultValue={localModels[0].url}>
            {localModels.map((m) => (
              <option key={m.url} value={m.url}>
                {m.label}
              </option>
            ))}
          </select>
        )}
      </fieldset>

      {(uploadError || state?.error) && <p className="text-sm text-brand">{uploadError ?? state?.error}</p>}
      {state?.ok && !uploadError && <p className="text-sm text-green-700">{state.ok}</p>}

      <button disabled={busy} className="h-11 rounded-lg bg-brand px-6 font-bold uppercase tracking-wide text-white hover:bg-brand-dark disabled:opacity-60">
        {uploading ? "Subiendo modelo…" : saving ? "Guardando…" : "Agregar al carrusel"}
      </button>
    </form>
  );
}

const inputClass = "mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 outline-none focus:border-fg";

function SourceTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 transition ${active ? "border-fg bg-fg text-white" : "border-line hover:border-fg"}`}
    >
      {children}
    </button>
  );
}
