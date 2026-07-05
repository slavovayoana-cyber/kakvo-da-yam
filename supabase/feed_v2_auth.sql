-- ============================================================
--  „Какво APPна?" — Ниво 2: невидими акаунти (Supabase Anonymous Auth)
--  Заключва собствеността на постовете към auth.uid().
--
--  ПРЕДИ да пуснеш това:
--    Supabase → Authentication → Sign In / Providers → включи „Anonymous"
--
--  Изпълни в SQL Editor. Безопасно за повторно пускане.
--  ⚠️ Изчиства ТЕСТОВИТЕ постове (за чист старт с новия модел).
-- ============================================================

-- 1) Нови колони за собственик (user_id = auth.uid())
alter table public.feed_profiles add column if not exists user_id uuid;
create unique index if not exists feed_profiles_user_id_key on public.feed_profiles (user_id);

alter table public.feed_posts   add column if not exists user_id uuid;
alter table public.feed_likes   add column if not exists user_id uuid;
alter table public.feed_reports add column if not exists user_id uuid;
create index if not exists feed_posts_user_idx on public.feed_posts (user_id);

-- 2) Права за влезлите (authenticated) — иначе 42501
grant select, insert, update         on public.feed_profiles    to authenticated;
grant select, insert, update, delete on public.feed_posts       to authenticated;
grant select, insert, delete         on public.feed_likes       to authenticated;
grant insert                         on public.feed_reports     to authenticated;
grant select                         on public.feed_place_stats to authenticated;

-- Couples таблиците да продължат да работят и при влязла сесия
grant select, insert, update, delete on public.couple_sessions to authenticated;
grant select, insert, update, delete on public.couple_swipes   to authenticated;

-- 3) Чист старт на тестовите данни (нямаше user_id по стария модел)
truncate public.feed_posts cascade;   -- маха и likes/reports (FK cascade)
delete from public.feed_profiles;

-- 4) Затегнати правила — пишеш/редактираш/триеш само СВОИТЕ редове
drop policy if exists feed_posts_insert on public.feed_posts;
drop policy if exists feed_posts_update on public.feed_posts;
drop policy if exists feed_posts_delete on public.feed_posts;
create policy feed_posts_insert on public.feed_posts for insert with check (user_id = auth.uid());
create policy feed_posts_update on public.feed_posts for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy feed_posts_delete on public.feed_posts for delete using (user_id = auth.uid());

drop policy if exists feed_profiles_insert on public.feed_profiles;
drop policy if exists feed_profiles_update on public.feed_profiles;
create policy feed_profiles_insert on public.feed_profiles for insert with check (user_id = auth.uid());
create policy feed_profiles_update on public.feed_profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists feed_likes_insert on public.feed_likes;
drop policy if exists feed_likes_delete on public.feed_likes;
create policy feed_likes_insert on public.feed_likes for insert with check (user_id = auth.uid());
create policy feed_likes_delete on public.feed_likes for delete using (user_id = auth.uid());

drop policy if exists feed_reports_insert on public.feed_reports;
create policy feed_reports_insert on public.feed_reports for insert with check (user_id = auth.uid());

-- Четенето остава публично (политиките feed_*_read са без промяна).
