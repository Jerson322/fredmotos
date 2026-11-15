import Image from "next/image";

type Props = {
  name: string;
  src?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

// Foto del producto sobre blanco; si aún no tiene, una silueta provisional.
export default function ProductImage({ name, src, className = "", sizes = "(max-width: 1024px) 50vw, 25vw", priority }: Props) {
  if (src) {
    return (
      <div className={`relative aspect-square w-full overflow-hidden bg-white ${className}`}>
        <Image src={src} alt={name} fill sizes={sizes} className="object-contain p-4" priority={priority} />
      </div>
    );
  }

  return (
    <div
      className={`flex aspect-square w-full flex-col items-center justify-center gap-1 bg-[#ecebe7] [container-type:inline-size] ${className}`}
      role="img"
      aria-label={name}
    >
      <span className="font-display text-[22cqw] leading-none text-transparent [-webkit-text-stroke:1.5px_#c9c7c0]">FRM</span>
      <span className="label text-[#b3b1aa]">Foto pronto</span>
    </div>
  );
}
