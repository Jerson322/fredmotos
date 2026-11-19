"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import HelmetViewer from "./HelmetViewer";

// =====================================================================
// Vitrina con scroll (estilo Shaft) + transición "Venom":
// la pantalla queda fija; al bajar, una masa negra líquida se traga el
// producto, lo derrite y al retirarse aparece el siguiente, con su info.
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

type Props = {
  media: Media[];
  panels: Panel[];
  hero: { brand: string; name: string };
  anchorId?: string; // ancla al último panel (distribuidores)
  children?: React.ReactNode; // barra superior (logo + botón)
};

const STAGE_SVH = 95; // scroll que dura cada etapa
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (x: number) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};

// Gotas que forman la masa: ángulo, distancia inicial, tamaño, velocidad del temblor.
const BLOBS = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * Math.PI * 2 + (i % 3) * 0.4,
  dist: 1.25 + ((i * 37) % 10) / 20,
  size: 0.35 + ((i * 53) % 10) / 14,
  speed: 0.8 + ((i * 29) % 10) / 8,
}));

// Tentáculos: cadenas de gotas que se estiran hacia afuera y se recogen.
const TENDRILS = Array.from({ length: 7 }, (_, i) => ({
  angle: (i / 7) * Math.PI * 2 + 0.3 + ((i * 17) % 5) * 0.12,
  length: 0.8 + ((i * 41) % 10) / 15,
  phase: i * 1.7,
}));
const TENDRIL_DROPS = 6;

export default function VenomShowcase({ media, panels, hero, anchorId, children }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const blobRefs = useRef<(SVGCircleElement | null)[]>([]);
  const coreRef = useRef<SVGCircleElement>(null);
  const tendrilRefs = useRef<(SVGCircleElement | null)[]>([]);
  const meltRef = useRef<SVGFEDisplacementMapElement>(null);
  const [active, setActive] = useState(panels[0]?.media ?? 0);
  const activeRef = useRef(active);

  const N = panels.length; // etapas: 0 = portada, 1..N = paneles
  const mediaAt = (stage: number) => panels[Math.max(0, Math.min(N, stage) - 1)]?.media ?? 0;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      const rect = stage.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return; // fuera de pantalla

      const total = stage.offsetHeight - window.innerHeight;
      const p = clamp(-rect.top / (total || 1));
      const T = p * N;
      const k = Math.min(Math.floor(T), N);
      const f = T - k;
      const s = k + smooth((f - 0.2) / 0.6); // posición con "pausa" en cada etapa

      // Portada → producto a la izquierda
      stage.style.setProperty("--h", clamp(s).toFixed(4));
      if (heroRef.current) heroRef.current.style.opacity = String(clamp(1 - s * 3));

      // Paneles de info y palabra de fondo
      panels.forEach((_, j) => {
        const d = s - (j + 1);
        const o = clamp(1 - Math.abs(d) * 2.4);
        const panel = panelRefs.current[j];
        if (panel) {
          panel.style.opacity = String(o);
          panel.style.transform = `translateY(${(-d * 40).toFixed(1)}px)`;
          panel.style.pointerEvents = o > 0.6 ? "auto" : "none";
          panel.setAttribute("aria-hidden", String(o < 0.5));
        }
        const word = wordRefs.current[j];
        if (word) {
          word.style.opacity = String(o * 0.9);
          word.style.transform = `translateX(${(-d * 12).toFixed(1)}vw)`;
        }
      });

      // Venom: cubre entre una etapa y la siguiente si cambia el producto
      const from = mediaAt(k);
      const to = mediaAt(k + 1);
      const c = from !== to && k < N ? clamp(1 - Math.abs(f - 0.5) / 0.3) : 0;
      const current = f >= 0.5 && k < N ? to : from;
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
      }

      const t = reduced ? 0 : time / 1000;
      const ce = Math.pow(c, 0.8);
      BLOBS.forEach((b, i) => {
        const el = blobRefs.current[i];
        if (!el) return;
        const wob = Math.sin(t * b.speed + i) * 5 * ce;
        const dist = b.dist * 70 * (1 - ce * 0.85) + wob;
        el.setAttribute("cx", (Math.cos(b.angle + Math.sin(t * 0.6 + i) * 0.08) * dist).toFixed(1));
        el.setAttribute("cy", (Math.sin(b.angle + Math.cos(t * 0.5 + i) * 0.08) * dist).toFixed(1));
        el.setAttribute("r", (ce * (10 + b.size * 34) + (ce > 0 ? Math.sin(t * 2 + i) * 2 : 0)).toFixed(1));
      });
      coreRef.current?.setAttribute("r", (Math.pow(c, 1.6) * 72).toFixed(1));

      // Tentáculos: se estiran a mitad de la transformación y se recogen al final
      const reach = Math.sin(Math.PI * 0.75 * c); // máximo a mitad, y siguen asomando con la masa completa
      TENDRILS.forEach((td, i) => {
        const sway = Math.sin(t * 1.3 + td.phase) * 0.25;
        for (let j = 0; j < TENDRIL_DROPS; j++) {
          const el = tendrilRefs.current[i * TENDRIL_DROPS + j];
          if (!el) continue;
          const u = (j + 1) / TENDRIL_DROPS;
          const a = td.angle + sway * u;
          const d = (45 + u * 70 * td.length) * reach;
          el.setAttribute("cx", (Math.cos(a) * d).toFixed(1));
          el.setAttribute("cy", (Math.sin(a) * d + u * u * 10 * reach).toFixed(1));
          el.setAttribute("r", (reach * (9 - u * 7)).toFixed(1));
        }
      });

      // El producto se "derrite" mientras la masa lo cubre
      meltRef.current?.setAttribute("scale", (c * 70).toFixed(1));
      if (mediaRef.current) {
        mediaRef.current.style.filter = c > 0.02 ? "url(#venom-melt)" : "none";
        mediaRef.current.style.transform = `scale(${(1 - c * 0.12).toFixed(3)})`;
      }

      // El casco también gira con el scroll
      stage
        .querySelector("model-viewer")
        ?.setAttribute("orientation", `0deg 0deg ${(s * 120).toFixed(1)}deg`);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  return (
    <div ref={stageRef} className="relative" style={{ height: `calc(${N * STAGE_SVH}svh + 100svh)`, "--h": 0 } as React.CSSProperties}>
      <div className="sticky top-0 h-svh overflow-hidden bg-white text-fg">
        {/* Fondo difuminado blanco, rojo y negro */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="blob absolute -right-[12vw] -top-[18vw] h-[55vw] w-[55vw] rounded-full bg-brand opacity-55 blur-[110px]" />
          <div className="blob blob-slow absolute -bottom-[22vw] -left-[14vw] h-[55vw] w-[55vw] rounded-full bg-ink opacity-60 blur-[120px]" />
          <div className="blob absolute -bottom-[16vw] right-[8vw] h-[34vw] w-[34vw] rounded-full bg-brand opacity-40 blur-[100px]" />
          <div className="blob blob-slow absolute -left-[8vw] top-[10vh] h-[26vw] w-[26vw] rounded-full bg-brand opacity-25 blur-[90px]" />
        </div>

        {/* Palabras gigantes de fondo por categoría */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none" aria-hidden="true">
          {panels.map((panel, j) => (
            <span
              key={panel.word}
              ref={(el) => {
                wordRefs.current[j] = el;
              }}
              className="font-display text-shine absolute whitespace-nowrap text-[18vw] italic leading-none opacity-0"
            >
              {panel.word}
            </span>
          ))}
        </div>

        {/* Nombre del casco (solo en la portada) */}
        <div
          ref={heroRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center select-none"
          aria-hidden="true"
        >
          <span className="font-display text-shine whitespace-nowrap text-[17vw] italic leading-[0.85] sm:text-[14vw]">
            {hero.brand}
          </span>
          <span className="font-display whitespace-nowrap text-[11vw] italic leading-[0.9] sm:text-[10vw]">
            {[...hero.name].map((ch, i) => (
              <span key={i} className="glow-letter" style={{ "--i": i } as React.CSSProperties}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        </div>

        {/* Producto + masa Venom */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center pt-[14svh]">
          <div className="stage-helmet relative aspect-square w-full max-w-[min(90vw,72svh)]">
            <div ref={mediaRef} className="pointer-events-auto relative h-full w-full will-change-transform">
              {media.map((m, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-none ${i === active ? "visible" : "invisible"}`}
                  aria-hidden={i !== active}
                >
                  <MediaView media={m} />
                </div>
              ))}
            </div>

            {/* Masa líquida negra con brillo */}
            <svg
              viewBox="-100 -100 200 200"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
              aria-hidden="true"
            >
              <g filter="url(#venom-goo)">
                <circle ref={coreRef} cx="0" cy="0" r="0" fill="#050505" />
                {Array.from({ length: TENDRILS.length * TENDRIL_DROPS }, (_, i) => (
                  <circle
                    key={`t${i}`}
                    ref={(el) => {
                      tendrilRefs.current[i] = el;
                    }}
                    r="0"
                    fill="#050505"
                  />
                ))}
                {BLOBS.map((_, i) => (
                  <circle
                    key={i}
                    ref={(el) => {
                      blobRefs.current[i] = el;
                    }}
                    r="0"
                    fill="#050505"
                  />
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* Paneles de información */}
        {panels.map((panel, j) => (
          <div
            key={panel.word}
            ref={(el) => {
              panelRefs.current[j] = el;
            }}
            className="pointer-events-none absolute inset-x-4 bottom-[5svh] z-20 opacity-0 lg:inset-x-auto lg:bottom-auto lg:right-[6vw] lg:top-[30%] lg:w-[40vw]"
          >
            <p className="label text-brand">{panel.kicker}</p>
            <h2 className="font-display mt-3 text-4xl italic leading-[0.95] sm:text-5xl xl:text-6xl">
              {panel.title} <span className="text-brand">{panel.highlight}</span>
            </h2>
            <p className="mt-5 max-w-xl text-base text-fg/70 sm:text-lg">{panel.text}</p>
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

        {/* Filtros SVG: masa pegajosa con brillo, y derretido */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <filter id="venom-goo" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="goo" />
              <feSpecularLighting in="blur" kernelUnitLength="0.4" surfaceScale="5" specularConstant="1.1" specularExponent="28" lightingColor="#ffffff" result="spec">
                <fePointLight x="-70" y="-140" z="160" />
              </feSpecularLighting>
              <feComposite in="spec" in2="goo" operator="in" result="shine" />
              <feComposite in="goo" in2="shine" operator="arithmetic" k1="0" k2="1" k3="0.55" k4="0" />
            </filter>
            <filter id="venom-melt" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="2" seed="7" result="noise" />
              <feDisplacementMap ref={meltRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
      </div>

      {anchorId && <div id={anchorId} className="absolute inset-x-0 bottom-0 h-svh" aria-hidden="true" />}
    </div>
  );
}

const ctaClass =
  "cut-r mt-8 inline-flex items-center gap-3 bg-brand py-4 pl-7 pr-10 font-bold uppercase tracking-wide text-white transition hover:bg-ink";

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
      <svg viewBox="0 0 200 200" className="h-[78%] w-[78%] drop-shadow-[0_30px_30px_rgba(0,0,0,0.35)]">
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
