create table if not exists public.bookmark_collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookmark_links (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.bookmark_collections(id) on delete cascade,
  title text not null,
  url text not null,
  icon text not null default 'BM',
  tags text[] not null default '{}',
  note text not null default '',
  position integer not null default 0,
  status text not null default 'todo',
  time text not null default '5 min',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookmark_links_collection_position_idx
  on public.bookmark_links (collection_id, position);

alter table public.bookmark_collections enable row level security;
alter table public.bookmark_links enable row level security;

drop policy if exists "Allow public collection reads" on public.bookmark_collections;
drop policy if exists "Allow public collection inserts" on public.bookmark_collections;
drop policy if exists "Allow public collection updates" on public.bookmark_collections;
drop policy if exists "Allow public collection deletes" on public.bookmark_collections;
drop policy if exists "Allow public link reads" on public.bookmark_links;
drop policy if exists "Allow public link inserts" on public.bookmark_links;
drop policy if exists "Allow public link updates" on public.bookmark_links;
drop policy if exists "Allow public link deletes" on public.bookmark_links;

create policy "Allow public collection reads"
  on public.bookmark_collections for select
  using (true);

create policy "Allow public collection inserts"
  on public.bookmark_collections for insert
  with check (true);

create policy "Allow public collection updates"
  on public.bookmark_collections for update
  using (true);

create policy "Allow public collection deletes"
  on public.bookmark_collections for delete
  using (true);

create policy "Allow public link reads"
  on public.bookmark_links for select
  using (true);

create policy "Allow public link inserts"
  on public.bookmark_links for insert
  with check (true);

create policy "Allow public link updates"
  on public.bookmark_links for update
  using (true);

create policy "Allow public link deletes"
  on public.bookmark_links for delete
  using (true);
