-- ============================================================
--  „Какво APPна?" — социална секция за храна (Етап 1: база данни)
--  Изпълни ЕДНОКРАТНО в Supabase → SQL Editor (проект ozjrsivvcgrngvzejbtl).
--  Безопасно е за повторно пускане (idempotent).
-- ============================================================

create extension if not exists "pgcrypto";  -- за gen_random_uuid()

-- ---------- ПРОФИЛИ (прякор, по device_id) ----------
create table if not exists public.feed_profiles (
  device_id  text primary key,
  nickname   text not null check (char_length(nickname) between 2 and 30),
  created_at timestamptz not null default now()
);

-- ---------- ПОСТОВЕ ----------
create table if not exists public.feed_posts (
  id                uuid primary key default gen_random_uuid(),
  author_device_id  text not null references public.feed_profiles(device_id),
  kind              text not null check (kind in ('venue','home')),
  photo_url         text,
  dish_name         text not null check (char_length(dish_name) between 1 and 80),
  comment           text check (char_length(comment) <= 500),
  dish_rating       smallint not null check (dish_rating between 1 and 5),

  -- само за kind = 'venue'
  place_name        text,
  place_city        text,
  place_maps_url    text,
  place_key         text,                -- нормализирано „name|city" за групиране
  place_rating      smallint check (place_rating between 1 and 5),
  worth_it          boolean,
  cuisine           text,                -- 'Скара','Пица','Fast food',...
  place_type        text,                -- 'restaurant','cafe','bar','patisserie','street'

  -- само за kind = 'home'
  prep_minutes      smallint,
  difficulty        text check (difficulty in ('easy','medium','hard')),
  servings          smallint,
  diet              text[],              -- 'postno','vegan','vegetarian','glutenfree'
  ingredients       text,
  steps             text,

  tags              text[] not null default '{}',
  like_count        integer not null default 0,
  status            text not null default 'active' check (status in ('active','hidden','removed')),
  created_at        timestamptz not null default now()
);

create index if not exists feed_posts_kind_created_idx on public.feed_posts (kind, status, created_at desc);
create index if not exists feed_posts_place_key_idx    on public.feed_posts (place_key) where kind = 'venue';
create index if not exists feed_posts_author_idx       on public.feed_posts (author_device_id);

-- ---------- ХАРЕСВАНИЯ ----------
create table if not exists public.feed_likes (
  post_id    uuid not null references public.feed_posts(id) on delete cascade,
  device_id  text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, device_id)
);

-- поддържа like_count автоматично
create or replace function public.feed_bump_like_count() returns trigger
language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update public.feed_posts set like_count = like_count + 1 where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.feed_posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists feed_likes_count on public.feed_likes;
create trigger feed_likes_count
  after insert or delete on public.feed_likes
  for each row execute function public.feed_bump_like_count();

-- ---------- ДОКЛАДВАНИЯ (модерация) ----------
create table if not exists public.feed_reports (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.feed_posts(id) on delete cascade,
  device_id  text not null,
  reason     text,
  created_at timestamptz not null default now()
);

-- ---------- АГРЕГАЦИЯ: рейтинг на заведение + брой постове ----------
create or replace view public.feed_place_stats as
select
  place_key,
  max(place_name)                       as place_name,
  max(place_city)                       as place_city,
  count(*)                              as post_count,
  round(avg(place_rating)::numeric, 1)  as avg_place_rating,
  round(avg(dish_rating)::numeric, 1)   as avg_dish_rating
from public.feed_posts
where kind = 'venue' and status = 'active' and place_key is not null
group by place_key;

-- ============================================================
--  СИГУРНОСТ (Row Level Security)
--  Приложението ползва анонимен publishable ключ + device_id (без вход),
--  както couples режима. За старт правилата са позволяващи (MVP).
--  Преди голям публичен ръст: препоръчвам Supabase Anonymous Auth,
--  за да заключим редакция/триене само до автора (author = auth.uid()).
-- ============================================================
alter table public.feed_profiles enable row level security;
alter table public.feed_posts    enable row level security;
alter table public.feed_likes    enable row level security;
alter table public.feed_reports  enable row level security;

drop policy if exists feed_posts_read     on public.feed_posts;
drop policy if exists feed_posts_insert    on public.feed_posts;
drop policy if exists feed_profiles_read    on public.feed_profiles;
drop policy if exists feed_profiles_insert  on public.feed_profiles;
drop policy if exists feed_profiles_update  on public.feed_profiles;
drop policy if exists feed_likes_read      on public.feed_likes;
drop policy if exists feed_likes_insert     on public.feed_likes;
drop policy if exists feed_likes_delete     on public.feed_likes;
drop policy if exists feed_reports_insert   on public.feed_reports;

create policy feed_posts_read      on public.feed_posts    for select using (status = 'active');
create policy feed_posts_insert    on public.feed_posts    for insert with check (true);
create policy feed_profiles_read   on public.feed_profiles for select using (true);
create policy feed_profiles_insert on public.feed_profiles for insert with check (true);
create policy feed_profiles_update on public.feed_profiles for update using (true) with check (true);
create policy feed_likes_read      on public.feed_likes    for select using (true);
create policy feed_likes_insert    on public.feed_likes    for insert with check (true);
create policy feed_likes_delete    on public.feed_likes    for delete using (true);
create policy feed_reports_insert  on public.feed_reports  for insert with check (true);

-- ---------- ХРАНИЛИЩЕ ЗА СНИМКИ ----------
insert into storage.buckets (id, name, public)
values ('feed-photos', 'feed-photos', true)
on conflict (id) do nothing;

drop policy if exists feed_photos_read   on storage.objects;
drop policy if exists feed_photos_insert on storage.objects;
create policy feed_photos_read   on storage.objects for select using (bucket_id = 'feed-photos');
create policy feed_photos_insert on storage.objects for insert with check (bucket_id = 'feed-photos');
