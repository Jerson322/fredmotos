"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "./Icons";

// Vitrina horizontal con flechas (estilo Inducascos). En celular se desliza con el dedo.
export default function ProductRail({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 sm:gap-4"
        role="list"
        aria-label={label}
      >
        {children}
      </div>
      <RailButton dir="left" disabled={edges.start} onClick={() => scroll(-1)} />
      <RailButton dir="right" disabled={edges.end} onClick={() => scroll(1)} />
    </div>
  );
}

function RailButton({ dir, disabled, onClick }: { dir: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Ver anteriores" : "Ver más"}
      className={`absolute top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center bg-ink text-white shadow-lg transition hover:bg-brand disabled:pointer-events-none disabled:opacity-0 md:flex ${
        dir === "left" ? "left-0 xl:-left-5" : "right-0 xl:-right-5"
      }`}
    >
      <ChevronIcon dir={dir} />
    </button>
  );
}

/** Envoltura de cada tarjeta dentro de la vitrina. */
export function RailItem({ children }: { children: React.ReactNode }) {
  return (
    <div role="listitem" className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[calc(25%-12px)]">
      {children}
    </div>
  );
}
