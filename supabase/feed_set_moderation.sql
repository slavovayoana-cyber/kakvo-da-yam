-- ============================================================
--  „Какво APPна?" — сигурен запис на решението от модерацията
--  Edge функцията вика тази RPC вместо директен PATCH, защото подаваният
--  ключ невинаги действа като service_role (RLS връщаше 403).
--  SECURITY DEFINER → изпълнява се като собственика и заобикаля RLS.
--  Защитена със споделен таен код (същия и в Edge функцията).
--
--  Изпълни в Supabase → SQL Editor. Безопасно за повторно пускане.
-- ============================================================

create or replace function public.feed_set_moderation(
  p_id uuid, p_status text, p_labels jsonb, p_secret text
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_secret <> 'kdy_mod_a7f3c9e21b' then
    raise exception 'forbidden';
  end if;
  update public.feed_posts
    set mod_status = p_status, mod_labels = p_labels
    where id = p_id;
end;
$$;

revoke all on function public.feed_set_moderation(uuid,text,jsonb,text) from public;
grant execute on function public.feed_set_moderation(uuid,text,jsonb,text)
  to anon, authenticated, service_role;
