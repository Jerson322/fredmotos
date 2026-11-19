"use client";

import { useEffect, useRef } from "react";

// Escenario "pegado" (estilo Shaft): mientras se hace scroll por esta sección,
// la pantalla se queda fija y el avance (0 → 1) se publica en la variable CSS --p.
// Los hijos usan var(--p) en sus estilos para moverse; el casco 3D gira con el scroll.
export default function ScrollStage({
  children,
  height = "260svh",
  turns = 1.25, // vueltas del casco durante todo el recorrido
  anchorId,
}: {
  children: React.ReactNode;
  anchorId?: string; // ancla que lleva al final del recorrido (ej. "distribuidores")
  height?: string;
  turns?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / (total || 1)));
      stage.style.setProperty("--p", p.toFixed(4));
      stage.toggleAttribute("data-end", p > 0.6);

      // Giro del casco: "orientation" rota el modelo (aparte del giro automático de la cámara).
      const viewer = stage.querySelector("model-viewer");
      viewer?.setAttribute("orientation", `0deg 0deg ${(p * turns * 360).toFixed(1)}deg`);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [turns]);

  return (
    <div ref={ref} className="relative" style={{ height, "--p": 0 } as React.CSSProperties}>
      <div className="sticky top-0 h-svh overflow-hidden">{children}</div>
      {/* El ancla queda donde termina el recorrido: el botón lleva directo a ese punto */}
      {anchorId && <div id={anchorId} className="absolute inset-x-0 bottom-0 h-svh" aria-hidden="true" />}
    </div>
  );
}
