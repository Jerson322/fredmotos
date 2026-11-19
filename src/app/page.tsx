import Image from "next/image";
import HelmetViewer from "@/components/HelmetViewer";
import ScrollStage from "@/components/ScrollStage";
import { whatsappLink } from "@/lib/site";
import logo from "../../public/brand/logo-horizontal.webp";

// Modelo 3D: archivo .glb en public/models/
const HELMET = {
  model: "/models/Meshy_AI_Racing_Helmet_3D_1118204508_image-to-3d-texture.glb",
  brand: "HJC RPHA",
  name: "Funky Diablo",
};

export default function Home() {
  return (
    // Al hacer scroll la pantalla se queda fija: el casco gira y se corre a la izquierda
    // y a la derecha entra la información de distribuidores (efecto estilo Shaft).
    <ScrollStage anchorId="distribuidores">
      <section className="relative h-full bg-white text-fg">
        {/* Fondo difuminado blanco, rojo y negro */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="blob absolute -right-[12vw] -top-[18vw] h-[55vw] w-[55vw] rounded-full bg-brand opacity-55 blur-[110px]" />
          <div className="blob blob-slow absolute -bottom-[22vw] -left-[14vw] h-[55vw] w-[55vw] rounded-full bg-ink opacity-60 blur-[120px]" />
          <div className="blob absolute -bottom-[16vw] right-[8vw] h-[34vw] w-[34vw] rounded-full bg-brand opacity-40 blur-[100px]" />
          <div className="blob blob-slow absolute -left-[8vw] top-[10vh] h-[26vw] w-[26vw] rounded-full bg-brand opacity-25 blur-[90px]" />
        </div>

        {/* Barra transparente: logo al centro, botón de distribuidor en la esquina */}
        <div className="absolute inset-x-0 top-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center px-4 py-5 sm:px-8">
          <span />
          <Image src={logo} alt="Fredmotos" className="h-10 w-auto brightness-0 sm:h-14" loading="eager" />
          <a
            href="#distribuidores"
            className="justify-self-end border border-fg px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition hover:border-brand hover:bg-brand hover:text-white sm:px-5 sm:py-2.5 sm:text-xs"
          >
            <span className="sm:hidden">¿Distribuidor?</span>
            <span className="hidden sm:inline">¿Quieres ser distribuidor?</span>
          </a>
        </div>

        {/* Nombre del casco detrás del modelo (se desvanece al bajar) */}
        <div
          className="stage-fade pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center select-none"
          aria-hidden="true"
        >
          <span className="font-display text-shine whitespace-nowrap text-[17vw] italic leading-[0.85] sm:text-[14vw]">
            {HELMET.brand}
          </span>
          <span className="font-display whitespace-nowrap text-[11vw] italic leading-[0.9] sm:text-[10vw]">
            {[...HELMET.name].map((ch, i) => (
              <span key={i} className="glow-letter" style={{ "--i": i } as React.CSSProperties}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        </div>

        {/* Casco 3D: gira solo, con el mouse y con el scroll */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center pt-[14svh]">
          <div className="stage-helmet pointer-events-auto aspect-square w-full max-w-[min(90vw,72svh)] cursor-grab active:cursor-grabbing">
            <HelmetViewer src={HELMET.model} alt={`Casco ${HELMET.brand} ${HELMET.name} en 3D`} />
          </div>
        </div>

        <h1 className="stage-fade absolute inset-x-0 bottom-0 z-10 pb-8 text-center">
          <span className="label block text-mute">Arrastra para girarlo · Baja para descubrir</span>
          <span className="font-display mt-2 block text-xl italic sm:text-2xl">
            {HELMET.brand} <span className="text-brand">{HELMET.name}</span>
          </span>
        </h1>

        {/* Distribuidores: entra por la derecha (abajo en celular) */}
        <div className="stage-panel absolute inset-x-4 bottom-[6svh] z-20 lg:inset-x-auto lg:bottom-auto lg:right-[6vw] lg:top-1/2 lg:w-[40vw] lg:-translate-y-1/2">
          <div className="lg:-translate-y-0">
            <p className="label text-brand">Distribuidores</p>
            <h2 className="font-display mt-3 text-4xl italic leading-[0.95] sm:text-5xl xl:text-6xl">
              ¿Quieres ser <span className="text-brand">distribuidor</span>?
            </h2>
            <p className="mt-5 max-w-xl text-base text-fg/70 sm:text-lg">
              {/* TODO: texto real de Fredmotos sobre el programa de distribuidores */}
              Vende nuestros productos en tu almacén o taller. Escríbenos y te contamos las condiciones.
            </p>
            <a
              href={whatsappLink("Hola Fredmotos, quiero ser distribuidor.")}
              target="_blank"
              rel="noopener noreferrer"
              className="cut-r mt-8 inline-flex items-center gap-3 bg-brand py-4 pl-7 pr-10 font-bold uppercase tracking-wide text-white transition hover:bg-ink"
            >
              Quiero ser distribuidor →
            </a>
          </div>
        </div>
      </section>
    </ScrollStage>
  );
}
