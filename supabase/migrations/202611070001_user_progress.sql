create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_progress enable row level security;
create policy "read own learning progress" on public.user_progress for select to authenticated using (auth.uid() = user_id);
create policy "insert own learning progress" on public.user_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "update own learning progress" on public.user_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.merge_progress_json(old_value jsonb, new_value jsonb)
returns jsonb language plpgsql immutable as $$
declare result jsonb := coalesce(old_value, '{}'::jsonb); key text; value jsonb;
begin
  if jsonb_typeof(new_value) = 'object' and jsonb_typeof(result) = 'object' then
    for key, value in select * from jsonb_each(new_value) loop
      if result ? key then result := jsonb_set(result, array[key], public.merge_progress_json(result->key, value), true);
      else result := jsonb_set(result, array[key], value, true); end if;
    end loop;
    return result;
  elsif jsonb_typeof(new_value) = 'array' and jsonb_typeof(result) = 'array' then
    return (select coalesce(jsonb_agg(item), '[]'::jsonb) from (select distinct item from jsonb_array_elements(result || new_value) as entries(item)) merged);
  end if;
  return coalesce(new_value, result);
end; $$;

create or replace function public.sync_user_progress(new_payload jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare saved jsonb;
begin
  insert into public.user_progress(user_id, payload) values (auth.uid(), coalesce(new_payload, '{}'::jsonb))
  on conflict (user_id) do update set payload = public.merge_progress_json(user_progress.payload, excluded.payload), updated_at = now()
  returning payload into saved;
  return saved;
end; $$;
revoke all on function public.sync_user_progress(jsonb) from public, anon;
grant execute on function public.sync_user_progress(jsonb) to authenticated;
