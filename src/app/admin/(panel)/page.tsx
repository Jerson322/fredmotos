import Link from "next/link";

const cards = [
  {
    href: "/admin/carrusel",
    title: "Carrusel del inicio",
    text: "Agrega, ordena, activa o quita los productos 3D que rotan al abrir la página.",
  },
  {
    href: "/admin/textos",
    title: "Textos y contacto",
    text: "WhatsApp, teléfono, correo, dirección, horario y el texto de distribuidores.",
  },
];

export default function AdminHome() {
  return (
    <>
      <h1 className="font-display text-3xl italic">Panel admin</h1>
      <p className="mt-2 text-mute">
        Los productos, precios y stock siguen viniendo de Ágil. Aquí manejas lo que se ve en la página.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="group rounded-2xl border border-line bg-card p-6 transition hover:border-brand">
            <h2 className="font-display text-xl italic group-hover:text-brand">{c.title} →</h2>
            <p className="mt-2 text-sm text-mute">{c.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
