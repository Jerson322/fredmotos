// Íconos de línea simples, sin librerías.
type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const SearchIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const CartIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.4-1.1L21 8H6.2" />
    <circle cx="9.5" cy="20" r="1.2" />
    <circle cx="17.5" cy="20" r="1.2" />
  </svg>
);

export const ChatIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.2L4 20z" />
  </svg>
);

export const ArrowIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const TruckIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M2 6h11v10H2zM13 9h4l3 3v4h-7" />
    <circle cx="6" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);

export const ShieldIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
);

export const WrenchIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 0-5-5L13 5l-3-3z" transform="rotate(0)" />
  </svg>
);

export const CardIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <rect x="2.5" y="5" width="19" height="14" />
    <path d="M2.5 10h19M6 15h4" />
  </svg>
);

export const ChevronIcon = ({ className = "h-5 w-5", dir = "right" }: P & { dir?: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d={dir === "right" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} />
  </svg>
);

export const HelmetIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M3 15a9 9 0 0 1 17.6-2.7L21 15v3H9.5A6.5 6.5 0 0 1 3 15z" />
    <path d="M12.5 9.5H20M12.5 9.5v4.5H21" />
  </svg>
);

export const DropIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
    <path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5" />
  </svg>
);

export const GearIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    <circle cx="12" cy="12" r="6.5" />
  </svg>
);

export const GloveIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M7 21v-4l-3-4.5a1.6 1.6 0 0 1 2.6-1.9L8 12V5a1.5 1.5 0 0 1 3 0v5-6.5a1.5 1.5 0 0 1 3 0V10 5a1.5 1.5 0 0 1 3 0v6.5-3a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-3 5.2V21z" />
  </svg>
);

export const TagIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M3 12V3h9l9 9-9 9z" />
    <circle cx="7.5" cy="7.5" r="1.3" />
  </svg>
);
