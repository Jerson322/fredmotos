"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowIcon, ChevronIcon } from "./Icons";

export type Slide = {
  kicker: string;
  title: string; // la palabra entre *asteriscos* sale en rojo
  text: string;
  cta: string;
  href: string;
  /** Palabra gigante en contorno al fondo cuando aún no hay foto. */
  word: string;
  /** Foto opcional (recorte de moto, casco, piloto). */
  image?: string;
};

const INTERVAL = 6500;

function renderTitle(title: string) {
  return title.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith("*") ? (
      <span key={i} className="text-brand">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  const go = useCallback((i: number) => setCurrent((i + total) % total), [total]);

  useEffect(() => {
    if (paused || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => go(current + 1), INTERVAL);
    return () => clearTimeout(id);
  }, [current, paused, total, go]);

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Promociones"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Todas las diapositivas en la misma celda: la altura no salta al cambiar */}
      <div className="grid">
        {slides.map((s, i) => {
          const active = i === current;
          const plain = s.title.replaceAll("*", "");
          return (
            <div
              key={s.title}
              className={`relative overflow-hidden [grid-area:1/1] transition-opacity duration-700 ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={!active}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${total}`}
            >
              {/* Fondo: palabra gigante + franjas, o la foto */}
              {s.image ? (
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-right-bottom opacity-90 max-lg:opacity-30"
                  priority={i === 0}
                />
              ) : (
                <span
                  className={`font-display text-outline pointer-events-none absolute -bottom-6 right-0 select-none whitespace-nowrap text-[9rem] italic leading-none transition-transform duration-[1200ms] sm:text-[14rem] lg:text-[17rem] ${
                    active ? "translate-x-0" : "translate-x-16"
                  }`}
                  aria-hidden="true"
                >
                  {s.word}
                </span>
              )}
              <div
                className={`stripes absolute -right-20 top-10 hidden h-20 w-[34rem] -skew-x-12 opacity-80 transition-transform duration-1000 lg:block ${
                  active ? "translate-x-0" : "translate-x-24"
                }`}
              />

              <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:pb-14 sm:pt-20">
                <p
                  className={`label flex items-center gap-3 text-brand transition duration-700 ${
                    active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <span className="h-[3px] w-10 bg-brand" />
                  {s.kicker}
                </p>
                <p
                  className={`font-display echo mt-5 max-w-4xl text-[2.4rem] italic leading-[0.92] [overflow-wrap:anywhere] transition delay-100 duration-700 sm:text-7xl lg:text-8xl ${
                    active ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
                  }`}
                  data-echo={plain}
                >
                  {renderTitle(s.title)}
                </p>
                <p
                  className={`mt-6 max-w-lg text-base text-white/65 transition delay-200 duration-700 sm:text-lg ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {s.text}
                </p>
                <Link
                  href={s.href}
                  tabIndex={active ? 0 : -1}
                  className="cut-r mt-8 inline-flex items-center gap-3 bg-brand py-3.5 pl-6 pr-9 font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-ink"
                >
                  {s.cta}
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-4">
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                onClick={() => go(i)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                aria-current={i === current}
                className="group relative h-1 w-10 overflow-hidden bg-white/20 sm:w-14"
              >
                {/* Barra de progreso del autoplay */}
                <span
                  key={i === current ? `on-${current}` : "off"}
                  className={`absolute inset-y-0 left-0 bg-brand ${
                    i === current ? (paused ? "w-full" : "w-full origin-left animate-[progress_6.5s_linear]") : "w-0"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="label text-white/40">
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="ml-auto flex gap-1">
            <button
              onClick={() => go(current - 1)}
              aria-label="Anterior"
              className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/80 transition hover:border-brand hover:bg-brand hover:text-white"
            >
              <ChevronIcon dir="left" />
            </button>
            <button
              onClick={() => go(current + 1)}
              aria-label="Siguiente"
              className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/80 transition hover:border-brand hover:bg-brand hover:text-white"
            >
              <ChevronIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
