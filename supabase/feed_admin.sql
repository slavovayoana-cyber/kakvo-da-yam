-- ============================================================
--  „Какво APPна?" — скрит екран за преглед (само за собственика)
--  feed_admin_list: връща ВСИЧКИ постове (за да можеш да прегледаш и триеш кой да е).
--  feed_admin_act:  approve (пусни) / hide (скрий) / delete (изтрий завинаги).
--  Защитени с таен код. SECURITY DEFINER → заобикалят RLS.
--
--  Изпълни в Supabase → SQL Editor. Безопасно за повторно пускане.
-- ============================================================

create or replace function public.feed_admin_list(p_secret text)
returns setof public.feed_posts
language plpgsql security definer set search_path = public as $$
begin
  if p_secret <> 'kdy_admin_9c1f7b3e' then
    raise exception 'forbidden';
  end if;
  return query
    select * from public.feed_posts
    order by
      -- първо тези, които се нуждаят от внимание
      (case when mod_status in ('pending','rejected') or status = 'hidden' then 0 else 1 end),
      created_at desc
    limit 300;
end;
$$;

create or replace function public.feed_admin_act(p_id uuid, p_action text, p_secret text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_secret <> 'kdy_admin_9c1f7b3e' then
    raise exception 'forbidden';
  end if;
  if p_action = 'approve' then
    update public.feed_posts set mod_status = 'approved', status = 'active' where id = p_id;
  elsif p_action = 'hide' then
    update public.feed_posts set status = 'hidden' where id = p_id;
  elsif p_action = 'delete' then
    delete from public.feed_posts where id = p_id;
  else
    raise exception 'bad action';
  end if;
end;
$$;

revoke all on function public.feed_admin_list(text) from public;
revoke all on function public.feed_admin_act(uuid,text,text) from public;
grant execute on function public.feed_admin_list(text) to anon, authenticated;
grant execute on function public.feed_admin_act(uuid,text,text) to anon, authenticated;
