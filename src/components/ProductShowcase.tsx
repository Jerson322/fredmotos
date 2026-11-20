"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import HelmetViewer from "./HelmetViewer";

// =====================================================================
// Vitrina con scroll (estilo Shaft): la pantalla queda fija y, a medida
// que se baja, la imagen se transforma en la siguiente (casco → chaqueta →
// guantes → impermeable) y cambia la información de la categoría.
// Solo se recalcula al hacer scroll, y solo con transform/opacity/clip-path
// para que vaya fluido.
// =====================================================================

export type Media =
  | { kind: "model"; src: string; alt: string } // .glb (casco 3D)
  | { kind: "image"; src: string; alt: string } // PNG sin fondo
  | { kind: "placeholder"; shape: "jacket" | "glove" | "raincoat"; alt: string };

export type Panel = {
  media: number; // índice en `media`
  kicker: string;
  title: string;
  highlight: string; // parte del título en rojo
  text: string;
  cta: string;
  href: string;
  external?: boolean;
  word: string; // palabra gigante de fondo
};

export type Slide = { id: string; brand: string; name: string; modelUrl: string; mediaType: "model" | "image" };

type Props = {
  slides: Slide[]; // carrusel del inicio (modelos 3D)
  media: Media[];
  panels: Panel[];
  anchorId?: string; // ancla al último panel (distribuidores)
  children?: React.ReactNode; // barra superior (logo + botón)
};

const STAGE_SVH = 90; // scroll que dura cada etapa
const SLIDE_MS = 900; // duración del cambio de diapositiva
const SLIDE_EVERY = 6500; // cambio automático del carrusel
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (x: number) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};

type Carousel = {
  current: number;
  tween: { from: number; to: number; start: number } | null;
  kick: () => void; // fuerza un recálculo (animación del cambio)
  atTop: boolean;
};

export default function ProductShowcase({ slides, media: panelMedia, panels, anchorId, children }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const slideTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const carousel = useRef<Carousel>({ current: 0, tween: null, kick: () => {}, atTop: true });

  const S = slides.length;
  const N = panels.length; // etapas: 0 = portada (carrusel), 1..N = paneles
  // Lista única de medios: primero las diapositivas, luego los de la vitrina
  const media = useMemo<Media[]>(
    () => [
      ...slides.map((sl): Media =>
        sl.mediaType === "image"
          ? { kind: "image", src: sl.modelUrl, alt: `${sl.brand} ${sl.name}`.trim() }
          : { kind: "model", src: sl.modelUrl, alt: `${sl.brand} ${sl.name} en 3D` },
      ),
      ...panelMedia,
    ],
    [slides, panelMedia],
  );
  const [slide, setSlide] = useState(0);
  // Modelos 3D cargados: los dos primeros del carrusel al abrir; el resto al acercarse
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, Math.min(1, S - 1)]));
  const markLoaded = (ids: number[]) =>
    setLoaded((prev) => (ids.every((i) => prev.has(i)) ? prev : new Set([...prev, ...ids])));

  const goTo = (i: number) => {
    const c = carousel.current;
    if (S < 2 || c.tween || !c.atTop) return;
    const to = (i + S) % S;
    if (to === c.current) return;
    c.tween = { from: c.current, to, start: performance.now() };
    c.current = to;
    setSlide(to);
    markLoaded([to, (to + 1) % S]);
    c.kick();
  };

  // Cambio automático (solo arriba del todo y con la pestaña visible)
  useEffect(() => {
    if (S < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!document.hidden) goTo(carousel.current.current + 1);
    }, SLIDE_EVERY);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S, slide]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const c = carousel.current;
    const mediaAt = (k: number) => (k <= 0 ? c.current : S + panels[Math.min(k, N) - 1].media);
    let raf = 0;
    let lastActive = -1;
    const loadedRef = new Set<number>();

    const update = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      const T = clamp(-rect.top / (total || 1)) * N;
      const k = Math.min(Math.floor(T), N);
      const x = smooth((T - k - 0.15) / 0.7); // 0→1 dentro de cada tramo, con pausa en los extremos
      const s = k + x;
      c.atTop = s < 0.02;

      stage.style.setProperty("--h", clamp(s).toFixed(4));
      const heroO = clamp(1 - s * 3);
      if (heroRef.current) heroRef.current.style.opacity = String(heroO);
      if (controlsRef.current) {
        controlsRef.current.style.opacity = String(heroO);
        controlsRef.current.style.pointerEvents = heroO > 0.5 ? "auto" : "none";
      }

      // Cambio de diapositiva en curso (se termina de golpe si el usuario empieza a bajar)
      let from = mediaAt(k);
      let to = mediaAt(k + 1);
      let mix = x;
      let tweening = false;
      let weights: number[] = slides.map((_, i) => (i === c.current ? 1 : 0));
      if (c.tween) {
        const p = (performance.now() - c.tween.start) / SLIDE_MS;
        if (p >= 1 || !c.atTop) {
          c.tween = null;
        } else {
          tweening = true;
          from = c.tween.from;
          to = c.tween.to;
          mix = smooth(p);
          weights = slides.map((_, i) => (i === from ? 1 - mix : i === to ? mix : 0));
          raf = requestAnimationFrame(update);
        }
      }
      slideTextRefs.current.forEach((el, i) => {
        if (!el) return;
        const w = weights[i] ?? 0;
        const dir = tweening && i === to ? 1 : -1; // la nueva sube, la anterior se va hacia arriba
        el.style.opacity = w.toFixed(3);
        el.style.transform = `translateY(${((1 - w) * 40 * dir).toFixed(1)}px)`;
        el.style.visibility = w > 0.001 ? "visible" : "hidden";
      });

      // Transformación de la imagen: la actual se encoge y se va, la siguiente crece desde el centro
      const settled = from === to || (k >= N && !tweening);
      media.forEach((_, i) => {
        const el = mediaRefs.current[i];
        if (!el) return;
        let o = 0;
        let scale = 1;
        let rot = 0;
        let clip = 100;
        if (settled) {
          o = i === from ? 1 : 0;
        } else if (i === from) {
          o = 1 - smooth((mix - 0.35) / 0.5);
          scale = 1 - mix * 0.25;
          rot = mix * -12;
        } else if (i === to) {
          o = smooth(mix / 0.5);
          scale = 0.75 + mix * 0.25;
          rot = (1 - mix) * 12;
          clip = 8 + mix * 92;
        }
        el.style.opacity = o.toFixed(3);
        el.style.transform = `scale(${scale.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
        el.style.clipPath = clip >= 100 ? "none" : `circle(${(clip * 0.75).toFixed(1)}% at 50% 50%)`;
        el.style.visibility = o > 0.001 ? "visible" : "hidden";
      });
      const active = settled || mix < 0.5 ? from : to;
      if (active !== lastActive) {
        lastActive = active;
        mediaRefs.current.forEach((el, i) => el?.setAttribute("aria-hidden", String(i !== active)));
      }

      // Paneles de info y palabra de fondo
      panels.forEach((_, j) => {
        const d = s - (j + 1);
        const o = clamp(1 - Math.abs(d) * 2.4);
        const panel = panelRefs.current[j];
        if (panel) {
          panel.style.opacity = o.toFixed(3);
          panel.style.transform = `translateY(${(-d * 40).toFixed(1)}px)`;
          panel.style.visibility = o > 0.001 ? "visible" : "hidden";
          panel.style.pointerEvents = o > 0.6 ? "auto" : "none";
        }
        const word = wordRefs.current[j];
        if (word) {
          word.style.opacity = (o * 0.9).toFixed(3);
          word.style.transform = `translateX(${(-d * 12).toFixed(1)}vw)`;
        }
      });

      // Precarga: el modelo de la etapa siguiente empieza a cargar al llegar a la actual
      const upcoming = mediaAt(Math.min(N, k + 2));
      const need = [from, to, upcoming].filter((m) => !loadedRef.has(m));
      if (need.length) {
        need.forEach((m) => loadedRef.add(m));
        markLoaded(need);
      }

      // Los modelos también giran con el scroll
      stage
        .querySelectorAll("model-viewer")
        .forEach((mv) => mv.setAttribute("orientation", `0deg 0deg ${(s * 120).toFixed(1)}deg`));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    c.kick = onScroll;
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      c.kick = () => {};
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N, S, media, panels, slides]);

  return (
    <div
      ref={stageRef}
      className="relative"
      style={{ height: `calc(${N * STAGE_SVH}svh + 100svh)`, "--h": 0 } as React.CSSProperties}
    >
      <div className="showcase-bg sticky top-0 h-svh overflow-hidden text-white">
        {/* Palabras gigantes de fondo por categoría (en escritorio abajo, para no tapar el texto) */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none lg:items-end lg:pb-[4svh]"
          aria-hidden="true"
        >
          {panels.map((panel, j) => (
            <span
              key={panel.word}
              ref={(el) => {
                wordRefs.current[j] = el;
              }}
              className="font-display text-outline absolute whitespace-nowrap text-[13vw] italic leading-[0.8] opacity-0 [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)] lg:text-[9vw]"
            >
              {panel.word}
            </span>
          ))}
        </div>

        {/* Carrusel: nombre del producto de cada diapositiva (solo en la portada) */}
        <div ref={heroRef} className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
          {slides.map((sl, si) => (
            <div
              key={sl.id}
              ref={(el) => {
                slideTextRefs.current[si] = el;
              }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={si === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
            >
              {sl.brand && (
                <span className="font-display text-shine whitespace-nowrap text-[17vw] italic leading-[0.85] sm:text-[14vw]">
                  {sl.brand}
                </span>
              )}
              <span className="font-display whitespace-nowrap text-[11vw] italic leading-[0.9] sm:text-[10vw]">
                {[...sl.name].map((ch, i) => (
                  <span key={i} className="glow-letter" style={{ "--i": i } as React.CSSProperties}>
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* Controles del carrusel */}
        {S > 1 && (
          <div
            ref={controlsRef}
            className="absolute inset-x-0 bottom-[4svh] z-20 flex items-center justify-center gap-4"
            role="group"
            aria-label="Carrusel de productos"
          >
            <button onClick={() => goTo(slide - 1)} aria-label="Anterior" className={arrowClass}>
              ‹
            </button>
            <div className="flex gap-2">
              {slides.map((sl, i) => (
                <button
                  key={sl.id}
                  onClick={() => goTo(i)}
                  aria-label={`Ver ${sl.brand} ${sl.name}`}
                  aria-current={i === slide}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === slide ? "w-8 bg-brand" : "w-3 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
            <button onClick={() => goTo(slide + 1)} aria-label="Siguiente" className={arrowClass}>
              ›
            </button>
          </div>
        )}

        {/* Producto que se transforma */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center pt-[14svh]">
          <div className="stage-helmet relative aspect-square w-full max-w-[min(90vw,72svh)]">
            {media.map((m, i) => (
              <div
                key={i}
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
                className="pointer-events-auto absolute inset-0 will-change-transform"
                style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
              >
                {loaded.has(i) ? <MediaView media={m} /> : null}
              </div>
            ))}
          </div>
        </div>

        {/* Paneles de información */}
        {panels.map((panel, j) => (
          <div
            key={panel.word}
            ref={(el) => {
              panelRefs.current[j] = el;
            }}
            className="pointer-events-none invisible absolute inset-x-4 bottom-[5svh] z-20 opacity-0 lg:inset-x-auto lg:bottom-auto lg:right-[6vw] lg:top-[30%] lg:w-[40vw]"
          >
            <p className="label text-brand">{panel.kicker}</p>
            <h2 className="font-display mt-3 text-4xl italic leading-[0.95] sm:text-5xl xl:text-6xl">
              {panel.title} <span className="text-brand">{panel.highlight}</span>
            </h2>
            <p className="mt-5 max-w-xl text-base text-white/70 sm:text-lg">{panel.text}</p>
            {panel.external ? (
              <a href={panel.href} target="_blank" rel="noopener noreferrer" className={ctaClass}>
                {panel.cta} →
              </a>
            ) : (
              <Link href={panel.href} className={ctaClass}>
                {panel.cta} →
              </Link>
            )}
          </div>
        ))}

        {children}
      </div>

      {anchorId && <div id={anchorId} className="absolute inset-x-0 bottom-0 h-svh" aria-hidden="true" />}
    </div>
  );
}

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-2xl leading-none text-white/80 transition hover:border-brand hover:bg-brand hover:text-white";

const ctaClass =
  "cut-r mt-8 inline-flex items-center gap-3 bg-brand py-4 pl-7 pr-10 font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-ink";

function MediaView({ media }: { media: Media }) {
  if (media.kind === "model") {
    return (
      <div className="h-full w-full cursor-grab active:cursor-grabbing">
        <HelmetViewer src={media.src} alt={media.alt} />
      </div>
    );
  }
  if (media.kind === "image") {
    return <Image src={media.src} alt={media.alt} fill sizes="(max-width: 1024px) 90vw, 50vw" className="object-contain" />;
  }
  return <Silhouette shape={media.shape} label={media.alt} />;
}

// Siluetas provisionales mientras llegan las fotos/modelos reales.
function Silhouette({ shape, label }: { shape: "jacket" | "glove" | "raincoat"; label: string }) {
  const paths = {
    jacket:
      "M72 28 L100 40 L128 28 L162 46 Q172 52 175 66 L188 138 L164 145 L150 92 L150 176 Q100 184 50 176 L50 92 L36 145 L12 138 L25 66 Q28 52 38 46 Z",
    glove:
      "M62 182 L62 120 Q48 110 40 92 L30 70 Q28 58 40 60 Q48 62 54 76 L62 90 L62 40 Q62 30 72 30 Q82 30 82 40 L82 84 L84 28 Q84 18 94 18 Q104 18 104 28 L104 84 L108 34 Q108 24 118 24 Q128 24 128 34 L126 88 L132 50 Q133 40 142 41 Q151 42 150 52 L146 112 Q144 128 136 136 L136 182 Z",
    raincoat:
      "M100 14 Q74 14 70 44 L44 56 Q34 62 32 76 L22 150 L44 154 L54 100 L52 188 L148 188 L146 100 L156 154 L178 150 L168 76 Q166 62 156 56 L130 44 Q126 14 100 14 Z M84 46 Q100 30 116 46 L112 60 Q100 52 88 60 Z",
  } as const;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center" role="img" aria-label={label}>
      <svg viewBox="0 0 200 200" className="h-[78%] w-[78%]">
        <defs>
          <linearGradient id={`sil-${shape}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2a2a2a" />
            <stop offset="1" stopColor="#0b0b0b" />
          </linearGradient>
        </defs>
        <path d={paths[shape]} fill={`url(#sil-${shape})`} fillRule="evenodd" />
        {shape === "jacket" && <path d="M100 40 L100 178" stroke="#e30613" strokeWidth="3" />}
        {shape === "raincoat" && <path d="M100 60 L100 186" stroke="#e30613" strokeWidth="3" />}
      </svg>
      <span className="label mt-2 text-mute">Foto pronto</span>
    </div>
  );
}
