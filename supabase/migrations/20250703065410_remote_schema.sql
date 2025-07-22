set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_user_completion_score(user_row users, profile_row participant_profile)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  score integer := 0;
  skills jsonb;
BEGIN
  -- Basic info
  IF user_row.full_name IS NOT NULL AND user_row.avatar_url IS NOT NULL THEN
    score := score + 20;
  END IF;
  
  -- Description
  IF profile_row.description IS NOT NULL AND LENGTH(TRIM(profile_row.description)) > 0 THEN
    score := score + 20;
  END IF;
  
  -- Skills experience
  skills := profile_row.skills;
  IF jsonb_array_length(skills->'experience') > 0 THEN
    score := score + 10;
  END IF;
  
  -- Technologies
  IF jsonb_array_length(skills->'technology') > 0 THEN
    score := score + 10;
  END IF;
  
  -- External accounts (up to 4)
  IF profile_row.connected_accounts IS NOT NULL THEN
    score := score + LEAST(jsonb_array_length(profile_row.connected_accounts), 4) * 5;
  END IF;
  
  RETURN score;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_primary_wallet()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if NEW.primary_wallet then
    update users_wallets
    set primary_wallet = false
    where user_id = NEW.user_id
      and wallet_address != NEW.wallet_address;
  end if;
  return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.clear_main_role_on_delete()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF OLD.is_primary THEN
    UPDATE users
      SET main_role = NULL
    WHERE id = OLD.participant_id;
  END IF;
  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_participant_profile()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    INSERT INTO public.participant_profile (participant_id)
    VALUES (NEW.id);
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.delete_project_if_empty()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  -- After any deletion from project_team_members,
  -- if that project now has zero members, delete it.
  IF NOT EXISTS (
    SELECT 1
      FROM public.project_team_members m
     WHERE m.project_id = OLD.project_id
  ) THEN
    DELETE FROM projects
     WHERE id = OLD.project_id;
  END IF;

  RETURN NULL;  -- this is an AFTER DELETE trigger
END;$function$
;

CREATE OR REPLACE FUNCTION public.discover_people(fetch_limit integer)
 RETURNS TABLE(id uuid, full_name text, avatar_url text, main_role text, profile_json jsonb)
 LANGUAGE sql
AS $function$
with
  -- Each tier CTE emits a 'tier' column
  t1 as (
    select
      u.id,
      u.full_name,
      u.avatar_url,
      u.main_role,
      to_jsonb(p.*) as profile_json,
      1 as tier
    from users u
    join user_participant_roles upr
      on upr.participant_id = u.id and upr.is_primary
    join participant_profile p
      on p.participant_id = u.id
    where p.location    is not null
      and u.avatar_url  is not null
      and p.skills      is not null
  ),
  t2 as (
    select
      u.id, u.full_name, u.avatar_url, u.main_role,
      to_jsonb(p.*) as profile_json,
      2 as tier
    from users u
    join user_participant_roles upr
      on upr.participant_id = u.id and upr.is_primary
    join participant_profile p
      on p.participant_id = u.id
    where p.location   is not null
      and u.avatar_url is not null
  ),
  t3 as (
    select
      u.id, u.full_name, u.avatar_url, u.main_role,
      to_jsonb(p.*) as profile_json,
      3 as tier
    from users u
    join user_participant_roles upr
      on upr.participant_id = u.id and upr.is_primary
    join participant_profile p
      on p.participant_id = u.id
    where u.avatar_url is not null
  ),
  t4 as (
    select
      u.id, u.full_name, u.avatar_url, u.main_role,
      to_jsonb(p.*) as profile_json,
      4 as tier
    from users u
    join user_participant_roles upr
      on upr.participant_id = u.id and upr.is_primary
    join participant_profile p
      on p.participant_id = u.id
  ),
  all_tiers as (
    select * from t1
    union all
    select * from t2
    union all
    select * from t3
    union all
    select * from t4
  ),
  deduped as (
    select
      id,
      full_name,
      avatar_url,
      main_role,
      profile_json,
      tier,
      row_number() over (
        partition by id
        order by tier       -- pick the lowest-tier match per user
      ) as rn
    from all_tiers
  )
select
  id,
  full_name,
  avatar_url,
  main_role,
  profile_json
from deduped
where rn = 1             -- one row per user
order by random()        -- then randomize
limit fetch_limit;
$function$
;

CREATE OR REPLACE FUNCTION public.enforce_single_primary_role()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Check if another primary role already exists for the participant
  IF NEW.is_primary = TRUE THEN
    -- Ensure there's no other primary role for the same participant
    IF EXISTS (SELECT 1 FROM user_participant_roles WHERE participant_id = NEW.participant_id AND is_primary = TRUE AND role_id != NEW.role_id) THEN
      RAISE EXCEPTION 'A participant can have only one primary role.';
    END IF;
  END IF;
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.enforce_single_primary_wallet()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Check if another primary wallet already exists for the participant
  IF NEW.primary_wallet = TRUE THEN
    -- Ensure there's no other primary wallet for the same participant
    IF EXISTS (SELECT 1 FROM participant_wallets WHERE participant_id = NEW.participant_id AND primary_wallet = TRUE) THEN
      RAISE EXCEPTION 'A participant can have only one primary wallet.';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  update public.users
  set email = new.email
  where id = new.id::uuid;
  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.preset_otp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    if (new.email like '%@devspot.app') then
        new.confirmation_token := encode(sha224(concat(new.email, '123456')::bytea), 'hex');
        new.confirmation_sent_at := now() - interval '2 minutes';
    end if;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.refresh_balance_for_user(uid uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  REFRESH MATERIALIZED VIEW user_balances;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_initial_token_balance()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.token_balance := 100;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_main_role()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- When a new primary role is inserted or an existing row is updated to primary
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.is_primary THEN
    UPDATE users u
      SET main_role = (
        SELECT name
        FROM participant_roles pr
        WHERE pr.id = NEW.role_id
      )
    WHERE u.id = NEW.participant_id;
  END IF;

  -- If an existing primary role is demoted, clear the user’s main_role
  IF TG_OP = 'UPDATE' AND OLD.is_primary AND NOT NEW.is_primary THEN
    UPDATE users u
      SET main_role = NULL
    WHERE u.id = OLD.participant_id;
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_all_fks(on_delete_action character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  rec record;
begin
  for rec in
    select
      tc.table_schema,
      tc.table_name,
      tc.constraint_name,
      array_agg(kcu.column_name)          as cols,
      ccu.table_schema                    as ref_schema,
      ccu.table_name                      as ref_table,
      array_agg(ccu.column_name)          as ref_cols
    from information_schema.table_constraints tc
    join information_schema.key_column_usage kcu
      on tc.constraint_name = kcu.constraint_name
      and tc.table_schema = kcu.table_schema
    join information_schema.constraint_column_usage ccu
      on ccu.constraint_name = tc.constraint_name
      and ccu.table_schema = tc.table_schema
    where tc.constraint_type = 'FOREIGN KEY'
      and tc.table_schema = 'public'      -- adjust if needed
    group by tc.table_schema, tc.table_name,
             tc.constraint_name,
             ccu.table_schema, ccu.table_name
  loop
    -- Drop old constraint
    execute format(
      'ALTER TABLE %I.%I DROP CONSTRAINT %I',
      rec.table_schema, rec.table_name, rec.constraint_name
    );
    -- Add new with cascade
    execute format(
      'ALTER TABLE %I.%I ADD CONSTRAINT %I FOREIGN KEY (%s) REFERENCES %I.%I(%s) ON DELETE %s',
      rec.table_schema, rec.table_name, rec.constraint_name,
      array_to_string(rec.cols, ', '),
      rec.ref_schema, rec.ref_table,
      array_to_string(rec.ref_cols, ', '),
      on_delete_action
    );
  end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_prize_allocations()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  pid   INT;
  cnt   INT;
  share NUMERIC;
BEGIN
  -- Determine which project this change affects
  IF TG_OP = 'DELETE' THEN
    pid := OLD.project_id;
  ELSE
    pid := NEW.project_id;
  END IF;

  -- Only re-distribute when a confirmed member is involved:
  --  • On INSERT:    only if NEW.status = 'confirmed'
  --  • On DELETE:    only if OLD.status = 'confirmed'
  --  • On UPDATE:    only if either OLD or NEW was/ is 'confirmed'
  IF (TG_OP = 'INSERT' AND NEW.status <> 'confirmed')
     OR (TG_OP = 'DELETE' AND OLD.status <> 'confirmed')
     OR (TG_OP = 'UPDATE' AND OLD.status <> 'confirmed' AND NEW.status <> 'confirmed')
  THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Count how many confirmed members remain in this project
  SELECT COUNT(*)
    INTO cnt
    FROM public.project_team_members
   WHERE project_id = pid
     AND status = 'confirmed';

  -- If no confirmed members, bail out
  IF cnt = 0 THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Compute equal share
  share := 100.0 / cnt;

  -- Update only confirmed members’ prize_allocation
  UPDATE public.project_team_members
     SET prize_allocation = share
   WHERE project_id = pid
     AND status = 'confirmed';

  -- Return appropriate row for the trigger
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.users_schedule_cleanup()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- schedule a one‑off job 20 minutes from now
  PERFORM cron.schedule(
    -- a unique job name
    'delete_user_' || NEW.id,
    -- run_time: now + 20 minutes
    now() + interval '5 minutes',
    -- the SQL command to execute
    'DELETE FROM users WHERE id = ' || quote_literal(NEW.id)
      || ' AND main_role IS NULL'
  );
  RETURN NEW;
END;
$function$
;


