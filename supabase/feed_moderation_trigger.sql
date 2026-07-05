-- ============================================================
--  „Какво APPна?" — връзка база → функция за модерация (без UI webhook)
--  Заобикаля счупения „Database Webhooks" екран, като вика Edge функцията
--  директно чрез pg_net при нов пост, който чака проверка.
--
--  Изпълни в Supabase → SQL Editor (проект ozjrsivvcgrngvzejbtl).
--  Безопасно за повторно пускане.
--
--  ⚠️ Ако името на функцията ти НЕ е „hyper-processor", смени го долу в URL-а.
-- ============================================================

-- 1) Разширението, което позволява на базата да прави HTTP заявки.
create extension if not exists pg_net;

-- 2) Функция, която праща новия пост към Edge функцията за проверка.
create or replace function public.feed_moderate_trigger() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform net.http_post(
    url     := 'https://ozjrsivvcgrngvzejbtl.supabase.co/functions/v1/hyper-processor',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body    := to_jsonb(new)
  );
  return new;
end;
$$;

-- 3) Тригер: пуска се само за НОВИ постове, които чакат проверка.
drop trigger if exists feed_posts_moderate on public.feed_posts;
create trigger feed_posts_moderate
  after insert on public.feed_posts
  for each row
  when (new.mod_status = 'pending')
  execute function public.feed_moderate_trigger();
