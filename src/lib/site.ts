// Datos fijos del negocio. Los datos de contacto se editan en el panel admin
// (tabla site_settings); estos valores solo se usan si aún no hay nada guardado.
export const site = {
  name: "Fredmotos",
  slogan: "Repuestos, accesorios y todo para tu moto",
  currency: "COP",
  locale: "es-CO",
};

export const defaultSettings = {
  whatsapp: "570000000000", // formato internacional, sin "+" ni espacios
  phone: "+57 300 000 0000",
  email: "ventas@frmfredmotos.com",
  address: "Dirección de la tienda (pendiente)",
  hours: "Lun a Sáb · 8:00 a. m. – 6:00 p. m.",
  distributorText: "Vende nuestros productos en tu almacén o taller. Escríbenos y te contamos las condiciones.",
};

export type Settings = typeof defaultSettings;

export function formatPrice(value: number) {
  return new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappLink(number: string, message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number.replace(/\D/g, "")}${text}`;
}
