// Compresión de modelos 3D (.glb) en el navegador, antes de subirlos desde el panel.
// Hace lo mismo que `gltf-transform optimize`: simplifica la malla, comprime la
// geometría (Meshopt) y pasa las texturas a WebP de máx. 2048 px.
// Se importa de forma dinámica (solo cuando se sube un modelo) porque las librerías pesan.

import { WebIO, type Document } from "@gltf-transform/core";
import { ALL_EXTENSIONS, EXTTextureWebP } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, simplify, weld } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";

const MAX_TEXTURE = 2048;

export type CompressStep = "leyendo" | "malla" | "texturas" | "guardando";

export async function compressGlb(file: File, onStep?: (step: CompressStep) => void): Promise<Blob> {
  await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);

  const io = new WebIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ "meshopt.encoder": MeshoptEncoder, "meshopt.decoder": MeshoptDecoder });

  onStep?.("leyendo");
  const doc = await io.readBinary(new Uint8Array(await file.arrayBuffer()));

  onStep?.("malla");
  await doc.transform(
    dedup(),
    weld(),
    // Igual que con los modelos actuales: hasta 25 % de la malla, sin pasar de 0,05 % de error visible
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.25, error: 0.0005 }),
    prune(),
  );

  onStep?.("texturas");
  await texturesToWebp(doc);

  onStep?.("guardando");
  await doc.transform(meshopt({ encoder: MeshoptEncoder, level: "medium" }));
  const out = await io.writeBinary(doc);
  return new Blob([out as BlobPart], { type: "model/gltf-binary" });
}

// Reduce las texturas a máx. 2048 px y las convierte a WebP usando el canvas del navegador.
async function texturesToWebp(doc: Document) {
  if (typeof OffscreenCanvas === "undefined" || typeof createImageBitmap === "undefined") return;
  const textures = doc.getRoot().listTextures();
  let converted = 0;

  for (const texture of textures) {
    const image = texture.getImage();
    const mime = texture.getMimeType();
    if (!image || mime === "image/webp" || mime === "image/ktx2") continue;
    try {
      const bitmap = await createImageBitmap(new Blob([image as BlobPart], { type: mime }));
      const scale = Math.min(1, MAX_TEXTURE / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = new OffscreenCanvas(w, h);
      canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();
      const webp = await canvas.convertToBlob({ type: "image/webp", quality: 0.88 });
      if (webp.type !== "image/webp") continue; // el navegador no sabe crear WebP: se deja como estaba
      texture.setImage(new Uint8Array(await webp.arrayBuffer())).setMimeType("image/webp");
      const uri = texture.getURI();
      if (uri) texture.setURI(uri.replace(/\.(png|jpe?g)$/i, ".webp"));
      converted++;
    } catch {
      // Si una textura falla, se deja la original
    }
  }
  if (converted) doc.createExtension(EXTTextureWebP).setRequired(true);
}
