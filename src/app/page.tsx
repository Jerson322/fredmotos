import Image from "next/image";
import VenomShowcase, { type Media, type Panel } from "@/components/VenomShowcase";
import { whatsappLink } from "@/lib/site";
import logo from "../../public/brand/logo-horizontal.webp";

// Productos que se transforman al hacer scroll.
// Para cambiar una silueta por la foto real: { kind: "image", src: "/vitrina/chaqueta.png", alt: "..." }
// (PNG sin fondo en public/vitrina/), o un modelo 3D: { kind: "model", src: "/models/chaqueta.glb", alt: "..." }.
const media: Media[] = [
  {
    kind: "model",
    src: "/models/Meshy_AI_Racing_Helmet_3D_1118204508_image-to-3d-texture.glb",
    alt: "Casco HJC RPHA Funky Diablo en 3D",
  },
  { kind: "placeholder", shape: "jacket", alt: "Chaqueta para moto" },
  { kind: "placeholder", shape: "glove", alt: "Guantes para moto" },
  { kind: "placeholder", shape: "raincoat", alt: "Impermeable para moto" },
];

const panels: Panel[] = [
  {
    media: 0,
    kicker: "Cascos",
    title: "Protección para",
    highlight: "cada ruta",
    text: "Integrales, abatibles y abiertos. Encuentra el casco para tu forma de rodar.",
    cta: "Ver cascos",
    href: "/productos?q=casco",
    word: "CASCOS",
  },
  {
    media: 1,
    kicker: "Chaquetas",
    title: "Rueda con",
    highlight: "estilo",
    text: "Chaquetas para moto para la ciudad y la carretera.",
    cta: "Ver chaquetas",
    href: "/productos?q=chaqueta",
    word: "CHAQUETAS",
  },
  {
    media: 2,
    kicker: "Guantes",
    title: "Agarre y",
    highlight: "control",
    text: "Guantes para el día a día, deportivos y para clima frío.",
    cta: "Ver guantes",
    href: "/productos?q=guante",
    word: "GUANTES",
  },
  {
    media: 3,
    kicker: "Impermeables",
    title: "Que la lluvia",
    highlight: "no te pare",
    text: "Impermeables y trajes de lluvia para seguir rodando con cualquier clima.",
    cta: "Ver impermeables",
    href: "/productos?q=impermeable",
    word: "LLUVIA",
  },
  {
    media: 0,
    kicker: "Distribuidores",
    title: "¿Quieres ser",
    highlight: "distribuidor?",
    // TODO: texto real de Fredmotos sobre el programa de distribuidores
    text: "Vende nuestros productos en tu almacén o taller. Escríbenos y te contamos las condiciones.",
    cta: "Quiero ser distribuidor",
    href: whatsappLink("Hola Fredmotos, quiero ser distribuidor."),
    external: true,
    word: "FREDMOTOS",
  },
];

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Fredmotos: cascos, chaquetas, guantes e impermeables para moto</h1>
      <VenomShowcase media={media} panels={panels} hero={{ brand: "HJC RPHA", name: "Funky Diablo" }} anchorId="distribuidores">
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
      </VenomShowcase>
    </>
  );
}
