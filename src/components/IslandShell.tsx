"use client";

import { useEffect, useRef } from "react";

// Envoltura del encabezado: arriba del todo es una barra normal; al empezar a bajar
// marca data-scrolled y el CSS la convierte en isla dinámica (animación corta).
export default function IslandShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => el.toggleAttribute("data-scrolled", window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      ref={ref}
      className="group/island absolute inset-x-0 top-0 z-30 transition-[padding] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] data-[scrolled]:px-[3vw] data-[scrolled]:pt-3"
    >
      {children}
    </div>
  );
}
