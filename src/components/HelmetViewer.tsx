"use client";

import { createElement, useEffect, useState } from "react";

// Visor 3D (model-viewer de Google): gira solo sobre su eje y se puede mover con el mouse o el dedo.
// Se carga solo en el navegador porque usa WebGL.
export default function HelmetViewer({ src, alt }: { src: string; alt: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import("@google/model-viewer").then(() => setReady(true));
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
          "interaction-prompt": "none",
          "shadow-intensity": "1",
          exposure: "1",
          "environment-image": "neutral",
          style: { width: "100%", height: "100%", background: "transparent", "--poster-color": "transparent" },
        })}
      {!ready && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-brand" />
        </div>
      )}
    </div>
  );
}
