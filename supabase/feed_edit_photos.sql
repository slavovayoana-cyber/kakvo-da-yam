-- ============================================================
--  „Какво APPна?" — редакторът да може да сменя снимките на курираните рецепти
--  Изпълни ЕДНОКРАТНО в Supabase → SQL Editor. Безопасно за повторно пускане.
-- ============================================================

-- Освобождаваме курираните рецепти (user_id = null), за да ги „осинови"
-- първият влязъл акаунт (това си ти) през приложението.
update public.feed_posts set user_id = null where author_device_id = 'curator-kakvoappna';

-- Функция: осиновява курираните постове под текущия акаунт (auth.uid()).
-- SECURITY DEFINER — минава над RLS, но пипа само курираните и само ако още
-- не са осиновени. Значи първият, който я извика (ти), става техен собственик.
create or replace function public.feed_adopt_curated() returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.feed_posts
     set user_id = auth.uid()
   where author_device_id = 'curator-kakvoappna'
     and user_id is null
     and auth.uid() is not null;
end;
$$;

grant execute on function public.feed_adopt_curated() to anon, authenticated;
