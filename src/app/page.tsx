import Image from "next/image";
import HelmetViewer from "@/components/HelmetViewer";
import { whatsappLink } from "@/lib/site";
import logo from "../../public/brand/logo-horizontal.webp";

// Modelo 3D: archivo .glb en public/models/
const HELMET = { model: "/models/Meshy_AI_Racing_Helmet_3D_1118204508_image-to-3d-texture.glb", brand: "HJC RPHA", name: "Funky Diablo" };

export default function Home() {
  return (
    <>
      {/* Portada */}
      <section className="grain relative flex min-h-svh flex-col overflow-hidden bg-ink text-white">
        {/* Barra transparente: logo al centro, botón de distribuidor en la esquina */}
        <div className="absolute inset-x-0 top-0 z-20 grid grid-cols-[1fr_auto_1fr] items-center px-4 py-5 sm:px-8">
          <span />
          <Image src={logo} alt="Fredmotos" className="h-10 w-auto sm:h-14" loading="eager" />
          <a
            href="#distribuidores"
            className="justify-self-end border border-white/30 px-3 py-2 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm transition hover:border-brand hover:bg-brand sm:px-5 sm:py-2.5 sm:text-xs"
          >
            <span className="sm:hidden">¿Distribuidor?</span>
            <span className="hidden sm:inline">¿Quieres ser distribuidor?</span>
          </a>
        </div>

        {/* Nombre del casco detrás del modelo */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center select-none"
          aria-hidden="true"
        >
          <span className="font-display whitespace-nowrap text-[17vw] italic leading-[0.85] text-white/[0.07] sm:text-[14vw]">
            {HELMET.brand}
          </span>
          <span className="font-display text-outline whitespace-nowrap text-[11vw] italic leading-[0.9] [-webkit-text-stroke-color:rgba(227,6,19,0.55)] sm:text-[10vw]">
            {HELMET.name}
          </span>
        </div>

        {/* Casco 3D al centro */}
        <div className="relative z-10 mx-auto my-auto aspect-square w-full max-w-[min(90vw,72svh)] cursor-grab active:cursor-grabbing">
          <HelmetViewer src={HELMET.model} alt={`Casco ${HELMET.brand} ${HELMET.name} en 3D`} />
        </div>

        <h1 className="relative z-10 pb-8 text-center">
          <span className="label block text-white/45">Arrastra para girarlo</span>
          <span className="font-display mt-2 block text-xl italic sm:text-2xl">
            {HELMET.brand} <span className="text-brand">{HELMET.name}</span>
          </span>
        </h1>
      </section>

      {/* Distribuidores */}
      <section id="distribuidores" className="scroll-mt-0 bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <p className="label text-brand">Distribuidores</p>
          <h2 className="font-display mt-3 max-w-3xl text-4xl italic leading-[0.95] sm:text-6xl">
            ¿Quieres ser <span className="text-brand">distribuidor</span>?
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-mute">
            {/* TODO: texto real de Fredmotos sobre el programa de distribuidores */}
            Vende nuestros productos en tu almacén o taller. Escríbenos y te contamos las condiciones.
          </p>
          <a
            href={whatsappLink("Hola Fredmotos, quiero ser distribuidor.")}
            target="_blank"
            rel="noopener noreferrer"
            className="cut-r mt-10 inline-flex items-center gap-3 bg-brand py-4 pl-7 pr-10 font-bold uppercase tracking-wide text-white transition hover:bg-ink"
          >
            Quiero ser distribuidor →
          </a>
        </div>
      </section>
    </>
  );
}
