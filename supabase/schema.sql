create table if not exists public.components (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  category text not null,
  tags text[] not null default '{}',
  code text not null,
  code_files jsonb not null default '[]'::jsonb,
  dependencies text[] not null default '{}',
  install_command text not null,
  preview_image text,
  created_at timestamptz not null default now()
);

alter table public.components
add column if not exists code_files jsonb not null default '[]'::jsonb;

notify pgrst, 'reload schema';

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.components enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Admins can read their allowlist row" on public.admin_users;
create policy "Admins can read their allowlist row"
on public.admin_users for select
to authenticated
using (email = auth.jwt() ->> 'email');

drop policy if exists "Components are readable by everyone" on public.components;
create policy "Components are readable by everyone"
on public.components for select
using (true);

drop policy if exists "Only allowlisted admins can insert components" on public.components;
create policy "Only allowlisted admins can insert components"
on public.components for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "Only allowlisted admins can update components" on public.components;
create policy "Only allowlisted admins can update components"
on public.components for update
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "Only allowlisted admins can delete components" on public.components;
create policy "Only allowlisted admins can delete components"
on public.components for delete
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

insert into storage.buckets (id, name, public)
values ('component-previews', 'component-previews', true)
on conflict (id) do nothing;

drop policy if exists "Preview images are publicly readable" on storage.objects;
create policy "Preview images are publicly readable"
on storage.objects for select
using (bucket_id = 'component-previews');

drop policy if exists "Allowlisted admins can upload preview images" on storage.objects;
create policy "Allowlisted admins can upload preview images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'component-previews'
  and exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

-- After running this schema, add your admin email once:
-- insert into public.admin_users (email) values ('you@example.com');
