// Imagen provisional mientras no hay fotos reales de los productos.
export default function ProductImage({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div
      className={`flex aspect-square w-full items-center justify-center bg-gradient-to-br from-surface-2 to-black ${className}`}
      role="img"
      aria-label={name}
    >
      <svg viewBox="0 0 64 64" className="h-1/3 w-1/3 text-border" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="14" cy="44" r="10" />
        <circle cx="50" cy="44" r="10" />
        <path d="M14 44l12-16h12l12 16M30 28l-4-8h-6M38 28l4-10h8" />
      </svg>
    </div>
  );
}
