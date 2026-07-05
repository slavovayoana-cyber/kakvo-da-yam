-- ============================================================
--  „Какво APPна?" — скрит модераторски панел (само за собственика)
--  feed_admin_list: ВСИЧКИ постове (нуждаещите се от внимание — първи).
--  feed_admin_act:  approve / hide / delete / ban (блокира автора да публикува).
--  feed_banned:     списък с блокирани автори; RLS не им дава да пишат.
--  Защитени с таен код. SECURITY DEFINER → заобикалят RLS.
--
--  Изпълни в Supabase → SQL Editor. Безопасно за повторно пускане.
-- ============================================================

-- Блокирани автори (не могат да публикуват повече).
create table if not exists public.feed_banned (
  user_id    uuid,
  device_id  text,
  created_at timestamptz not null default now()
);
create unique index if not exists feed_banned_user_idx on public.feed_banned (user_id) where user_id is not null;
create index if not exists feed_banned_device_idx on public.feed_banned (device_id);

-- Помощна: текущият потребител блокиран ли е? (SECURITY DEFINER, за да чете таблицата)
create or replace function public.is_banned() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.feed_banned where user_id = auth.uid());
$$;
grant execute on function public.is_banned() to anon, authenticated;

-- Блокираните не могат да вкарват нови постове.
drop policy if exists feed_posts_insert on public.feed_posts;
create policy feed_posts_insert on public.feed_posts for insert
  with check (user_id = auth.uid() and not public.is_banned());

-- ---------- Списък за прегледа ----------
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
      (case when mod_status in ('pending','rejected') or status = 'hidden' then 0 else 1 end),
      created_at desc
    limit 300;
end;
$$;

-- ---------- Действие ----------
create or replace function public.feed_admin_act(p_id uuid, p_action text, p_secret text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid;
  v_dev text;
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
  elsif p_action = 'ban' then
    select user_id, author_device_id into v_uid, v_dev from public.feed_posts where id = p_id;
    -- добавя автора в блокираните (ако още го няма)
    if not exists (select 1 from public.feed_banned where (v_uid is not null and user_id = v_uid) or device_id = v_dev) then
      insert into public.feed_banned (user_id, device_id) values (v_uid, v_dev);
    end if;
    -- скрива всичките му постове
    update public.feed_posts set status = 'hidden' where author_device_id = v_dev;
  else
    raise exception 'bad action';
  end if;
end;
$$;

revoke all on function public.feed_admin_list(text) from public;
revoke all on function public.feed_admin_act(uuid,text,text) from public;
grant execute on function public.feed_admin_list(text) to anon, authenticated;
grant execute on function public.feed_admin_act(uuid,text,text) to anon, authenticated;
