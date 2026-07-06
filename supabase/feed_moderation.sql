-- ============================================================
--  „Какво APPна?" — Модерация на съдържанието
--  1) Всяка нова снимка минава AI проверка (Sightengine) ПРЕДИ да е публична.
--  2) Пост, докладван от 3-ма души, се скрива автоматично.
--
--  Изпълни в Supabase → SQL Editor (проект ozjrsivvcgrngvzejbtl).
--  Безопасно за повторно пускане (idempotent).
--  ⚠️ ВАЖНО: пусни този SQL СЛЕД като си качила Edge функцията „moderate-post"
--     и си направила Database Webhook-а (виж MODERATION_SETUP.md), за да не
--     „заседнат" новите постове в изчакване.
-- ============================================================

-- ---------- 1) Състояние на модерацията на всеки пост ----------
-- 'approved' = минал проверка (публичен) · 'pending' = чака AI · 'rejected' = спрян
-- По подразбиране 'approved', за да НЕ изчезнат вече съществуващите и курираните.
-- Приложението слага 'pending' само на НОВИТЕ потребителски постове.
alter table public.feed_posts
  add column if not exists mod_status text not null default 'approved'
  check (mod_status in ('approved','pending','rejected'));

-- Пази „защо" реши AI-то (за проверка/дебъг). Не е задължително.
alter table public.feed_posts
  add column if not exists mod_labels jsonb;

create index if not exists feed_posts_mod_idx on public.feed_posts (mod_status);

-- ---------- 2) Видимост: другите виждат само одобрените ----------
-- Авторът вижда и своите изчакващи (за да знае, че постът му се обработва).
drop policy if exists feed_posts_read on public.feed_posts;
create policy feed_posts_read on public.feed_posts
  for select using (
    status = 'active'
    and (mod_status = 'approved' or user_id = auth.uid())
  );

-- Агрегатите за заведения броят само одобрени постове.
create or replace view public.feed_place_stats as
select
  place_key,
  max(place_name)                       as place_name,
  max(place_city)                       as place_city,
  count(*)                              as post_count,
  round(avg(place_rating)::numeric, 1)  as avg_place_rating,
  round(avg(dish_rating)::numeric, 1)   as avg_dish_rating
from public.feed_posts
where kind = 'venue' and status = 'active' and mod_status = 'approved' and place_key is not null
group by place_key;

-- ---------- 3) Авто-скриване при 3 доклада ----------
-- Хваща „нерелевантно, но прилично" съдържание, което AI-то не разпознава.
create or replace function public.feed_autohide_on_reports() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  n integer;
begin
  select count(distinct device_id) into n
  from public.feed_reports where post_id = new.post_id;

  if n >= 3 then
    update public.feed_posts set status = 'hidden' where id = new.post_id;
  end if;
  return new;
end;
$$;

drop trigger if exists feed_reports_autohide on public.feed_reports;
create trigger feed_reports_autohide
  after insert on public.feed_reports
  for each row execute function public.feed_autohide_on_reports();
