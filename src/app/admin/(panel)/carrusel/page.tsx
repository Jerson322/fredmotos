import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import NewSlideForm from "./NewSlideForm";
import SlideRow, { type SlideData } from "./SlideRow";

export const metadata: Metadata = { title: "Carrusel del inicio" };

export default async function CarouselAdmin() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("position");
  const slides = (data ?? []) as SlideData[];

  return (
    <>
      <h1 className="font-display text-3xl italic">Carrusel del inicio</h1>
      <p className="mt-2 max-w-2xl text-mute">
        Son los productos (modelos 3D o imágenes) que rotan al abrir la página, con su nombre gigante detrás. Cambian solos cada pocos
        segundos, en el orden de esta lista.
      </p>

      {error && (
        <p className="mt-6 rounded-xl bg-brand/10 p-4 text-sm text-brand-dark">
          No se pudo leer el carrusel: {error.message}. ¿Ya se ejecutó la migración 0002 en Supabase?
        </p>
      )}

      <section className="mt-8">
        <h2 className="label text-mute">Diapositivas ({slides.length})</h2>
        {slides.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-line bg-card p-6 text-sm text-mute">
            Aún no hay diapositivas. Mientras tanto, el inicio muestra el casco HJC RPHA Funky Diablo.
          </p>
        ) : (
          <>
          {slides.filter((s) => s.active).length < 2 && (
            <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              Hay solo una diapositiva visible, así que el carrusel no rota. Agrega al menos otra (puedes usar uno de los
              modelos de la página) para que cambie sola y aparezcan las flechas.
            </p>
          )}
          <ul className="mt-3 space-y-3">
            {slides.map((s, i) => (
              <SlideRow key={s.id} slide={s} first={i === 0} last={i === slides.length - 1} />
            ))}
          </ul>
          </>
        )}
      </section>

      <section className="mt-10 max-w-2xl">
        <h2 className="label text-mute">Agregar diapositiva</h2>
        <NewSlideForm />
      </section>
    </>
  );
}
