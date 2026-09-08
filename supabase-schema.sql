-- ====================================================================
-- TABMARK PRODUCTION DATABASE SCHEMA & SECURITY POLICIES
-- ====================================================================

-- 1. BẢNG PROFILES (Lưu thông tin chi tiết người dùng & Trạng thái gói PRO)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text default '',
  avatar_url text default '',
  is_pro boolean not null default false,
  plan text not null default 'free' check (plan in ('free', 'pro', 'lifetime')),
  pro_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. BẢNG BOOKMARK_COLLECTIONS (Các nhóm bookmark / Board)
create table if not exists public.bookmark_collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  share_mode text not null default 'private' check (share_mode in ('private', 'view', 'edit')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. BẢNG BOOKMARK_LINKS (Các liên kết / Thẻ Kanban)
create table if not exists public.bookmark_links (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.bookmark_collections(id) on delete cascade,
  title text not null,
  url text not null,
  icon text not null default 'BM',
  tags text[] not null default '{}',
  note text not null default '',
  position integer not null default 0,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  time text not null default '5 min',
  ai_summary text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index tối ưu tốc độ truy vấn
create index if not exists bookmark_links_collection_position_idx
  on public.bookmark_links (collection_id, position);
create index if not exists bookmark_collections_owner_idx
  on public.bookmark_collections (owner_id);

-- 4. BẬT ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.bookmark_collections enable row level security;
alter table public.bookmark_links enable row level security;

-- Xóa policies cũ nếu có
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Allow user to read own or shared collections" on public.bookmark_collections;
drop policy if exists "Allow user to insert collections" on public.bookmark_collections;
drop policy if exists "Allow user to update own or edit-shared collections" on public.bookmark_collections;
drop policy if exists "Allow user to delete own collections" on public.bookmark_collections;
drop policy if exists "Allow user to read own or shared links" on public.bookmark_links;
drop policy if exists "Allow user to insert links" on public.bookmark_links;
drop policy if exists "Allow user to update own or edit-shared links" on public.bookmark_links;
drop policy if exists "Allow user to delete own or edit-shared links" on public.bookmark_links;

-- 5. POLICIES CHO PROFILES
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 6. POLICIES CHO COLLECTIONS
create policy "Allow user to read own or shared collections"
  on public.bookmark_collections for select
  using (owner_id = auth.uid() or share_mode in ('view', 'edit'));

create policy "Allow user to insert collections"
  on public.bookmark_collections for insert
  with check (auth.uid() = owner_id);

create policy "Allow user to update own or edit-shared collections"
  on public.bookmark_collections for update
  using (owner_id = auth.uid() or (share_mode = 'edit' and auth.uid() is not null));

create policy "Allow user to delete own collections"
  on public.bookmark_collections for delete
  using (owner_id = auth.uid());

-- 7. POLICIES CHO LINKS
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

-- 8. TRIGGER TỰ ĐỘNG TẠO PROFILE & DỮ LIỆU MẪU KHI ĐĂNG KÝ
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  new_col_id uuid;
  user_name text;
  user_avatar text;
begin
  -- Trích xuất tên và avatar linh hoạt từ Google hoặc Email
  user_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1),
    'User'
  );
  
  user_avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture',
    ''
  );

  -- 1. Tạo profile cho user
  insert into public.profiles (id, email, full_name, avatar_url, is_pro, plan)
  values (
    new.id,
    coalesce(new.email, ''),
    user_name,
    user_avatar,
    false,
    'free'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
    avatar_url = coalesce(nullif(excluded.avatar_url, ''), profiles.avatar_url);

  -- 2. Tạo collection mặc định ban đầu
  begin
    insert into public.bookmark_collections (id, owner_id, name, description, share_mode)
    values (
      gen_random_uuid(),
      new.id,
      'General Work',
      'Nhóm bookmark mặc định của bạn',
      'private'
    ) returning id into new_col_id;

    -- 3. Tạo 2 link mẫu hướng dẫn
    if new_col_id is not null then
      insert into public.bookmark_links (collection_id, title, url, icon, tags, note, position, status, time)
      values
        (new_col_id, 'Chào mừng đến với Tabmark!', 'https://tabmark.app', 'BM', ARRAY['Guide', 'Welcome'], 'Kéo thả thẻ này giữa các cột để thay đổi trạng thái tiến độ.', 0, 'todo', '3 min'),
        (new_col_id, 'Khám phá tính năng AI Summary', 'https://tabmark.app/ai', 'AI', ARRAY['AI', 'Feature'], 'Bấm vào nút Sparkles hoặc AI để tạo tóm tắt thông minh.', 1, 'in_progress', '5 min');
    end if;
  exception when others then
    null;
  end;

  return new;
exception when others then
  return new;
end;
$$;

-- Gắn trigger vào auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ====================================================================
-- 9. BẢNG TRANSACTIONS (Lưu lịch sử thanh toán phục vụ OC3)
-- ====================================================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  plan_id text not null,
  plan_name text not null,
  amount numeric not null,
  transaction_code text not null,
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  payment_method text not null default 'vietqr',
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

drop policy if exists "Users can view own transactions" on public.transactions;
drop policy if exists "Users can insert own transactions" on public.transactions;

create policy "Users can view own transactions"
  on public.transactions for select
  using (user_id = auth.uid());

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (user_id = auth.uid());

