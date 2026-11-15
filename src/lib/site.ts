// Datos generales del negocio. Cambia aquí y se actualiza en todo el sitio.
export const site = {
  name: "Fredmotos",
  slogan: "Repuestos, accesorios y todo para tu moto",
  // Número de WhatsApp en formato internacional, sin "+" ni espacios. PENDIENTE: poner el real.
  whatsapp: "10000000000",
  email: "ventas@fredmotos.com",
  phone: "+1 000 000 0000",
  address: "Dirección de la tienda (pendiente)",
  hours: "Lun a Sáb · 8:00 a. m. – 6:00 p. m.",
  // PENDIENTE: definir según el país.
  currency: "USD",
  locale: "es",
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappLink(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsapp}${text}`;
}
