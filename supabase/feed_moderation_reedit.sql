-- ============================================================
--  „Какво APPна?" — повторна AI проверка след РЕДАКЦИЯ на пост
--  Когато редактираш пост, приложението слага mod_status = 'pending';
--  този тригер вика проверката пак (снимки + текст).
--  Пази се от безкраен цикъл: пуска се само при преминаване КЪМ 'pending'
--  (функцията за модерация записва 'approved'/'rejected', не 'pending').
--
--  Изпълни в Supabase → SQL Editor. Безопасно за повторно пускане.
-- ============================================================

drop trigger if exists feed_posts_moderate_upd on public.feed_posts;
create trigger feed_posts_moderate_upd
  after update on public.feed_posts
  for each row
  when (new.mod_status = 'pending' and old.mod_status is distinct from 'pending')
  execute function public.feed_moderate_trigger();
