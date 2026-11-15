-- =====================================================================
-- Fredmotos · Extras de productos
-- Los productos, precios y stock vienen de Ágil. Aquí solo guardamos lo que
-- Ágil no tiene: fotos, descripción para la web, destacado, oferta y oculto.
-- Ejecutar una sola vez en Supabase → SQL Editor → New query → Run
-- =====================================================================

create table if not exists public.producto_extras (
  code             text primary key,                         -- código del producto en Ágil
  images           text[]  not null default '{}',            -- URLs de Supabase Storage
  description      text,                                     -- reemplaza la descripción de Ágil
  featured         boolean not null default false,           -- aparece en "Destacados"
  hidden           boolean not null default false,           -- ocultar de la tienda
  compare_at_price integer check (compare_at_price is null or compare_at_price > 0), -- precio "antes" (COP)
  updated_at       timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists producto_extras_set_updated_at on public.producto_extras;
create trigger producto_extras_set_updated_at
  before update on public.producto_extras
  for each row execute function public.set_updated_at();

-- ---------- Seguridad (RLS) ----------
-- Cualquiera puede LEER. Escribir solo lo podrá el administrador (panel, más adelante).

alter table public.producto_extras enable row level security;

drop policy if exists "Extras visibles para todos" on public.producto_extras;
create policy "Extras visibles para todos"
  on public.producto_extras for select
  to anon, authenticated
  using (true);

-- Como desactivamos "exponer tablas automáticamente", damos el permiso de lectura a mano.
grant select on public.producto_extras to anon, authenticated;

-- ---------- Imágenes (Supabase Storage) ----------
-- Carpeta pública "productos": cualquiera puede ver las fotos, máx. 5 MB, solo imágenes.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('productos', 'productos', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;
