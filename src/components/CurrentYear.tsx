import { cacheLife } from "next/cache";

// Año del copyright: se calcula y se guarda en caché (se refresca a diario).
export default async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
