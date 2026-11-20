"use client";

import { createElement, useEffect, useState } from "react";

// Visor 3D (model-viewer de Google): gira solo sobre su eje y se puede mover con el mouse o el dedo.
// Se carga solo en el navegador porque usa WebGL.
export default function HelmetViewer({ src, alt }: { src: string; alt: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import("@google/model-viewer").then(({ ModelViewerElement }) => {
      // Decodificador de la compresión Meshopt (modelos optimizados desde el panel admin)
      ModelViewerElement.meshoptDecoderLocation = "/vendor/meshopt_decoder.js";
      setReady(true);
    });
  }, []);

  return (
    <div className="relative h-full w-full">
      {ready &&
        createElement("model-viewer", {
          src,
          alt,
          "auto-rotate": "",
          "auto-rotate-delay": "0",
          "rotation-per-second": "25deg",
          "camera-controls": "",
          "disable-zoom": "",
          "disable-pan": "",
          "touch-action": "pan-y", // en celular: arrastrar de lado gira, arrastrar vertical hace scroll
          "interaction-prompt": "none",
          "shadow-intensity": "1",
          exposure: "1",
          "environment-image": "neutral",
          style: { width: "100%", height: "100%", background: "transparent", "--poster-color": "transparent" },
        },
        // Oculta la barra de carga gris que trae model-viewer por defecto
        createElement("div", { slot: "progress-bar" }),
        )}
      {!ready && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-fg/15 border-t-brand" />
        </div>
      )}
    </div>
  );
}
