-- =====================================================================
-- Fredmotos · Panel admin: administradores, carrusel del inicio y ajustes
-- Requiere haber ejecutado antes 0001_producto_extras.sql (usa set_updated_at).
-- Ejecutar una sola vez en Supabase → SQL Editor → New query → Run
-- =====================================================================

-- ---------- Administradores ----------
-- Solo los usuarios que estén en esta tabla pueden editar. Se agregan a mano (ver al final).

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "Cada admin ve su propia fila" on public.admins;
create policy "Cada admin ve su propia fila"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

grant select on public.admins to authenticated;

-- ¿El usuario actual es administrador? (security definer: puede leer admins sin exponerla)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Carrusel del inicio ----------

create table if not exists public.hero_slides (
  id         uuid primary key default gen_random_uuid(),
  position   integer not null default 0,           -- orden en el carrusel
  brand      text    not null default '',          -- ej. "HJC RPHA" (letras grandes blancas)
  name       text    not null,                      -- ej. "Funky Diablo" (letras rojas)
  model_url  text    not null,                      -- URL pública del .glb
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists hero_slides_set_updated_at on public.hero_slides;
create trigger hero_slides_set_updated_at
  before update on public.hero_slides
  for each row execute function public.set_updated_at();

alter table public.hero_slides enable row level security;

drop policy if exists "Diapositivas activas visibles" on public.hero_slides;
create policy "Diapositivas activas visibles"
  on public.hero_slides for select
  to anon, authenticated
  using (active or (select public.is_admin()));

drop policy if exists "Admins crean diapositivas" on public.hero_slides;
create policy "Admins crean diapositivas"
  on public.hero_slides for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins editan diapositivas" on public.hero_slides;
create policy "Admins editan diapositivas"
  on public.hero_slides for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins borran diapositivas" on public.hero_slides;
create policy "Admins borran diapositivas"
  on public.hero_slides for delete
  to authenticated
  using ((select public.is_admin()));

grant select on public.hero_slides to anon, authenticated;
grant insert, update, delete on public.hero_slides to authenticated;

-- ---------- Ajustes del sitio (una sola fila) ----------

create table if not exists public.site_settings (
  id               integer primary key default 1 check (id = 1),
  whatsapp         text,   -- formato internacional sin "+" ni espacios, ej. 573001234567
  phone            text,
  email            text,
  address          text,
  hours            text,
  distributor_text text,
  updated_at       timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Ajustes visibles" on public.site_settings;
create policy "Ajustes visibles"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins editan ajustes" on public.site_settings;
create policy "Admins editan ajustes"
  on public.site_settings for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;

-- ---------- Modelos 3D (Supabase Storage) ----------
-- Carpeta pública "modelos": cualquiera puede verlos; solo admins suben/borran. Máx. 50 MB.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('modelos', 'modelos', true, 52428800, array['model/gltf-binary'])
on conflict (id) do nothing;

drop policy if exists "Admins suben modelos" on storage.objects;
create policy "Admins suben modelos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'modelos' and (select public.is_admin()));

drop policy if exists "Admins reemplazan modelos" on storage.objects;
create policy "Admins reemplazan modelos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'modelos' and (select public.is_admin()));

drop policy if exists "Admins borran modelos" on storage.objects;
create policy "Admins borran modelos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'modelos' and (select public.is_admin()));

-- ---------- Dar acceso a un administrador ----------
-- 1) Crea el usuario en Supabase → Authentication → Users → Add user (correo + contraseña,
--    marca "Auto Confirm User").
-- 2) Ejecuta esto cambiando el correo:
--
-- insert into public.admins (user_id, email)
-- select id, email from auth.users where email = 'correo-del-admin@ejemplo.com'
-- on conflict (user_id) do nothing;
