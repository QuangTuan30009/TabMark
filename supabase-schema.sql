create table if not exists public.bookmark_collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid(),
  name text not null,
  description text not null default '',
  share_mode text not null default 'private' check (share_mode in ('private', 'view', 'edit')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Thêm các cột nếu table đã tồn tại trước đó
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookmark_collections' AND column_name='owner_id') THEN
        ALTER TABLE public.bookmark_collections ADD COLUMN owner_id uuid default auth.uid();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookmark_collections' AND column_name='share_mode') THEN
        ALTER TABLE public.bookmark_collections ADD COLUMN share_mode text not null default 'private' check (share_mode in ('private', 'view', 'edit'));
    END IF;
END $$;

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

-- Collection Policies
create policy "Allow user to read own or shared collections"
  on public.bookmark_collections for select
  using (owner_id = auth.uid() or share_mode in ('view', 'edit'));

create policy "Allow user to insert collections"
  on public.bookmark_collections for insert
  with check (auth.uid() is not null);

create policy "Allow user to update own or edit-shared collections"
  on public.bookmark_collections for update
  using (owner_id = auth.uid() or (share_mode = 'edit' and auth.uid() is not null));

create policy "Allow user to delete own collections"
  on public.bookmark_collections for delete
  using (owner_id = auth.uid());

-- Link Policies
create policy "Allow user to read own or shared links"
  on public.bookmark_links for select
  using (
    collection_id in (
      select id from public.bookmark_collections
      where owner_id = auth.uid() or share_mode in ('view', 'edit')
    )
  );

create policy "Allow user to insert links"
  on public.bookmark_links for insert
  with check (
    collection_id in (
      select id from public.bookmark_collections
      where owner_id = auth.uid() or (share_mode = 'edit' and auth.uid() is not null)
    )
  );

create policy "Allow user to update own or edit-shared links"
  on public.bookmark_links for update
  using (
    collection_id in (
      select id from public.bookmark_collections
      where owner_id = auth.uid() or (share_mode = 'edit' and auth.uid() is not null)
    )
  );

create policy "Allow user to delete own or edit-shared links"
  on public.bookmark_links for delete
  using (
    collection_id in (
      select id from public.bookmark_collections
      where owner_id = auth.uid() or (share_mode = 'edit' and auth.uid() is not null)
    )
  );
