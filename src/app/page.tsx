import TopBar from "@/components/TopBar";
import ProductShowcase, { type Media, type Panel } from "@/components/ProductShowcase";
import { whatsappLink } from "@/lib/site";

// Productos que se transforman al hacer scroll.
// Para cambiar una silueta por la foto real: { kind: "image", src: "/vitrina/chaqueta.png", alt: "..." }
// (PNG sin fondo en public/vitrina/), o un modelo 3D: { kind: "model", src: "/models/chaqueta.glb", alt: "..." }.
const media: Media[] = [
  {
    kind: "model",
    src: "/models/Meshy_AI_Racing_Helmet_3D_1118204508_image-to-3d-texture.glb",
    alt: "Casco HJC RPHA Funky Diablo en 3D",
  },
  { kind: "model", src: "/models/chaqueta.glb", alt: "Chaqueta para moto en 3D" },
  { kind: "model", src: "/models/guantes.glb", alt: "Guantes para moto en 3D" },
  { kind: "model", src: "/models/impermeable.glb", alt: "Impermeable para moto en 3D" },
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
      <ProductShowcase media={media} panels={panels} hero={{ brand: "HJC RPHA", name: "Funky Diablo" }} anchorId="distribuidores">
        <TopBar />
      </ProductShowcase>
    </>
  );
}
