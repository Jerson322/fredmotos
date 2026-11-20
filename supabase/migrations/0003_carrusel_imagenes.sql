-- =====================================================================
-- Fredmotos · El carrusel del inicio acepta imágenes además de modelos 3D
-- Requiere 0002_panel_admin.sql.
-- Ejecutar una sola vez en Supabase → SQL Editor → New query → Run
-- =====================================================================

-- Tipo de cada diapositiva: modelo 3D (.glb) o imagen. La URL sigue en model_url.
alter table public.hero_slides
  add column if not exists media_type text not null default 'model'
  check (media_type in ('model', 'image'));

-- La carpeta "modelos" de Storage ahora también acepta imágenes (el panel las sube en WebP).
update storage.buckets
set allowed_mime_types = array['model/gltf-binary', 'image/webp', 'image/jpeg', 'image/png']
where id = 'modelos';
