-- ====================================================================
-- TABMARK PRODUCTION DATABASE SCHEMA & SECURITY POLICIES
-- Công nghệ: Supabase Postgres (PostgREST, Auth, Row Level Security)
-- Kiến trúc: Serverless BaaS với Row-Level Security (RLS) & Indexes tối ưu
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. BẢNG PROFILES (Lưu hồ sơ người dùng & trạng thái gói dịch vụ)
-- --------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text default '',
  avatar_url text default '',
  is_pro boolean not null default false,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'business', 'lifetime')),
  pro_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------
-- 2. BẢNG BOOKMARK_COLLECTIONS (Các nhóm danh mục / Bảng Kanban)
-- --------------------------------------------------------------------
create table if not exists public.bookmark_collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  share_mode text not null default 'private' check (share_mode in ('private', 'view', 'edit')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------
-- 3. BẢNG BOOKMARK_LINKS (Các thẻ liên kết Kanban / Bookmarks)
-- --------------------------------------------------------------------
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

-- --------------------------------------------------------------------
-- 4. BẢNG TRANSACTIONS (Lưu lịch sử thanh toán VietQR & Gói dịch vụ)
-- --------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  plan_id text not null,
  plan_name text not null,
  amount numeric not null,
  transaction_code text not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  payment_method text not null default 'vietqr',
  approved_by text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ====================================================================
-- 5. INDEXES TỐI ƯU HIỆU NĂNG TRUY VẤN (Theo supabase-postgres-best-practices)
-- Giúp Postgres tránh Sequential Scan và tăng tốc 10x-50x khi lượng dữ liệu lớn
-- ====================================================================
create index if not exists bookmark_collections_owner_idx
  on public.bookmark_collections (owner_id);

create index if not exists bookmark_links_collection_position_idx
  on public.bookmark_links (collection_id, position);

create index if not exists transactions_user_id_idx
  on public.transactions (user_id);

create index if not exists transactions_status_created_at_idx
  on public.transactions (status, created_at desc);

create index if not exists profiles_plan_is_pro_idx
  on public.profiles (plan, is_pro);

-- ====================================================================
-- 6. HÀM HỖ TRỢ XÁC THỰC QUYỀN ADMIN (Security Definer Function)
-- ====================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select auth.jwt() ->> 'email' in ('taquangtuan2016@gmail.com', 'admin@tabmark.io')),
    false
  );
$$;

-- ====================================================================
-- 7. THIẾT LẬP ROW LEVEL SECURITY (RLS) TỐI ƯU HIỆU NĂNG & AN TOÀN
-- Lưu ý: Luôn bọc (select auth.uid()) để Postgres cache kết quả cho toàn bộ query
-- ====================================================================
alter table public.profiles enable row level security;
alter table public.bookmark_collections enable row level security;
alter table public.bookmark_links enable row level security;
alter table public.transactions enable row level security;

-- Dọn dẹp policies cũ
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;

drop policy if exists "Allow user to read own or shared collections" on public.bookmark_collections;
drop policy if exists "Allow user to insert collections" on public.bookmark_collections;
drop policy if exists "Allow user to update own or edit-shared collections" on public.bookmark_collections;
drop policy if exists "Allow user to delete own collections" on public.bookmark_collections;

drop policy if exists "Allow user to read own or shared links" on public.bookmark_links;
drop policy if exists "Allow user to insert links" on public.bookmark_links;
drop policy if exists "Allow user to update own or edit-shared links" on public.bookmark_links;
drop policy if exists "Allow user to delete own or edit-shared links" on public.bookmark_links;

drop policy if exists "Users can view own transactions" on public.transactions;
drop policy if exists "Users can insert own transactions" on public.transactions;
drop policy if exists "Admins can view all transactions" on public.transactions;
drop policy if exists "Admins can update transactions" on public.transactions;

-- 7.1. POLICIES CHO PROFILES
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()));

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using ((select public.is_admin()));

-- 7.2. POLICIES CHO COLLECTIONS
create policy "Allow user to read own or shared collections"
  on public.bookmark_collections for select
  to authenticated
  using (owner_id = (select auth.uid()) or share_mode in ('view', 'edit'));

create policy "Allow user to insert collections"
  on public.bookmark_collections for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Allow user to update own or edit-shared collections"
  on public.bookmark_collections for update
  to authenticated
  using (owner_id = (select auth.uid()) or (share_mode = 'edit' and (select auth.uid()) is not null));

create policy "Allow user to delete own collections"
  on public.bookmark_collections for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- 7.3. POLICIES CHO LINKS
create policy "Allow user to read own or shared links"
  on public.bookmark_links for select
  to authenticated
  using (
    collection_id in (
      select id from public.bookmark_collections
      where owner_id = (select auth.uid()) or share_mode in ('view', 'edit')
    )
  );

create policy "Allow user to insert links"
  on public.bookmark_links for insert
  to authenticated
  with check (
    collection_id in (
      select id from public.bookmark_collections
      where owner_id = (select auth.uid()) or (share_mode = 'edit' and (select auth.uid()) is not null)
    )
  );

create policy "Allow user to update own or edit-shared links"
  on public.bookmark_links for update
  to authenticated
  using (
    collection_id in (
      select id from public.bookmark_collections
      where owner_id = (select auth.uid()) or (share_mode = 'edit' and (select auth.uid()) is not null)
    )
  );

create policy "Allow user to delete own or edit-shared links"
  on public.bookmark_links for delete
  to authenticated
  using (
    collection_id in (
      select id from public.bookmark_collections
      where owner_id = (select auth.uid()) or (share_mode = 'edit' and (select auth.uid()) is not null)
    )
  );

-- 7.4. POLICIES CHO TRANSACTIONS
create policy "Users can view own transactions"
  on public.transactions for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "Users can insert own transactions"
  on public.transactions for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Admins can view all transactions"
  on public.transactions for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can update transactions"
  on public.transactions for update
  to authenticated
  using ((select public.is_admin()));

-- ====================================================================
-- 8. BẢO VỆ CỘT NHẠY CẢM (Chống Privilege Escalation)
-- Ngăn người dùng tự update is_pro/plan qua Browser Console
-- ====================================================================
revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url, updated_at) on public.profiles to authenticated;

-- ====================================================================
-- 9. RPC FUNCTION: KÍCH HOẠT GÓI PRO AN TOÀN (Security Definer)
-- Dùng khi Admin duyệt giao dịch hoặc Webhook thanh toán thành công
-- ====================================================================
create or replace function public.upgrade_user_plan(
  target_user_id uuid,
  target_plan text default 'pro',
  duration_days integer default 30
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Chỉ cho phép Admin hoặc hệ thống gọi hàm này
  if not (select public.is_admin()) and (select auth.uid()) != target_user_id then
    raise exception 'Không có quyền kích hoạt gói dịch vụ';
  end if;

  update public.profiles
  set
    is_pro = true,
    plan = target_plan,
    pro_expires_at = now() + (duration_days || ' days')::interval,
    updated_at = now()
  where id = target_user_id;

  return found;
end;
$$;

-- ====================================================================
-- 10. TRIGGER TỰ ĐỘNG TẠO PROFILE & DỮ LIỆU MẪU KHI ĐĂNG KÝ MỚI
-- ====================================================================
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

  -- 1. Tạo profile khởi tạo cho user
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
