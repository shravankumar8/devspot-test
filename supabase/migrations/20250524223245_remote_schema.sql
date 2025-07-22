

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "development";


ALTER SCHEMA "development" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE SCHEMA IF NOT EXISTS "testing";


ALTER SCHEMA "testing" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgaudit" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "development"."hackathon_application_method" AS ENUM (
    'join',
    'stake',
    'apply',
    'apply_additional',
    'apply_stake',
    'apply_additional_stake'
);


ALTER TYPE "development"."hackathon_application_method" OWNER TO "postgres";


CREATE TYPE "development"."hackathon_participant_application_status" AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE "development"."hackathon_participant_application_status" OWNER TO "postgres";


CREATE TYPE "development"."hackathon_stakes_status" AS ENUM (
    'pending',
    'confirmed',
    'rejected'
);


ALTER TYPE "development"."hackathon_stakes_status" OWNER TO "postgres";


CREATE TYPE "development"."hackathon_status" AS ENUM (
    'live',
    'upcoming',
    'ended'
);


ALTER TYPE "development"."hackathon_status" OWNER TO "postgres";


CREATE TYPE "development"."hackathon_type" AS ENUM (
    'virtual',
    'physical'
);


ALTER TYPE "development"."hackathon_type" OWNER TO "postgres";


CREATE TYPE "development"."notification_type" AS ENUM (
    'email',
    'sms'
);


ALTER TYPE "development"."notification_type" OWNER TO "postgres";


CREATE TYPE "development"."team_invitations_status" AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE "development"."team_invitations_status" OWNER TO "postgres";


CREATE TYPE "development"."transaction_type" AS ENUM (
    'withdrawal',
    'deposit'
);


ALTER TYPE "development"."transaction_type" OWNER TO "postgres";


CREATE TYPE "public"."application_status" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE "public"."application_status" OWNER TO "postgres";


CREATE TYPE "public"."hackathon_application_method" AS ENUM (
    'join',
    'stake',
    'apply',
    'apply_additional',
    'apply_stake',
    'apply_additional_stake'
);


ALTER TYPE "public"."hackathon_application_method" OWNER TO "postgres";


CREATE TYPE "public"."hackathon_participant_application_status" AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE "public"."hackathon_participant_application_status" OWNER TO "postgres";


CREATE TYPE "public"."hackathon_stakes_status" AS ENUM (
    'pending',
    'confirmed',
    'rejected'
);


ALTER TYPE "public"."hackathon_stakes_status" OWNER TO "postgres";


CREATE TYPE "public"."hackathon_status" AS ENUM (
    'live',
    'upcoming',
    'ended'
);


ALTER TYPE "public"."hackathon_status" OWNER TO "postgres";


CREATE TYPE "public"."hackathon_type" AS ENUM (
    'virtual',
    'physical'
);


ALTER TYPE "public"."hackathon_type" OWNER TO "postgres";


CREATE TYPE "public"."invitation_status" AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE "public"."invitation_status" OWNER TO "postgres";


CREATE TYPE "public"."invitation_type" AS ENUM (
    'request',
    'invite'
);


ALTER TYPE "public"."invitation_type" OWNER TO "postgres";


CREATE TYPE "public"."join_type" AS ENUM (
    'join',
    'stake',
    'apply',
    'apply_additional',
    'apply_stake',
    'apply_additional_stake'
);


ALTER TYPE "public"."join_type" OWNER TO "postgres";


CREATE TYPE "public"."judging_status" AS ENUM (
    'needs_review',
    'judged',
    'flagged'
);


ALTER TYPE "public"."judging_status" OWNER TO "postgres";


CREATE TYPE "public"."notification_type" AS ENUM (
    'email',
    'sms'
);


ALTER TYPE "public"."notification_type" OWNER TO "postgres";


CREATE TYPE "public"."questionnaire_status" AS ENUM (
    'required',
    'completed',
    'not_required'
);


ALTER TYPE "public"."questionnaire_status" OWNER TO "postgres";


COMMENT ON TYPE "public"."questionnaire_status" IS '''required'' (must answer questions), ''completed'' (successfully answered), ''not_required'' (questions not required).';



CREATE TYPE "public"."stake_status" AS ENUM (
    'required',
    'completed',
    'not_required'
);


ALTER TYPE "public"."stake_status" OWNER TO "postgres";


COMMENT ON TYPE "public"."stake_status" IS '''required'' (needs to stake), ''completed'' (successfully staked), ''not_required'' (staking was not required for this user).';



CREATE TYPE "public"."team member invite status" AS ENUM (
    'confirmed',
    'pending',
    'rejected'
);


ALTER TYPE "public"."team member invite status" OWNER TO "postgres";


CREATE TYPE "public"."team_invitations_status" AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE "public"."team_invitations_status" OWNER TO "postgres";


CREATE TYPE "public"."transaction_type" AS ENUM (
    'withdrawal',
    'deposit'
);


ALTER TYPE "public"."transaction_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_primary_wallet"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if NEW.primary_wallet then
    update users_wallets
    set primary_wallet = false
    where user_id = NEW.user_id
      and wallet_address != NEW.wallet_address;
  end if;
  return NEW;
end;
$$;


ALTER FUNCTION "public"."check_primary_wallet"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."clear_main_role_on_delete"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF OLD.is_primary THEN
    UPDATE users
      SET main_role = NULL
    WHERE id = OLD.participant_id;
  END IF;
  RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."clear_main_role_on_delete"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_participant_profile"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.role_id = 1 THEN
        INSERT INTO public.participant_profile (participant_id)
        VALUES (NEW.id);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_participant_profile"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_project_if_empty"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
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
END;$$;


ALTER FUNCTION "public"."delete_project_if_empty"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."discover_people"("fetch_limit" integer) RETURNS TABLE("id" "uuid", "full_name" "text", "avatar_url" "text", "main_role" "text", "profile_json" "jsonb")
    LANGUAGE "sql"
    AS $$
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
$$;


ALTER FUNCTION "public"."discover_people"("fetch_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enforce_single_primary_role"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Check if another primary role already exists for the participant
  IF NEW.is_primary = TRUE THEN
    -- Ensure there's no other primary role for the same participant
    IF EXISTS (SELECT 1 FROM user_participant_roles WHERE participant_id = NEW.participant_id AND is_primary = TRUE) THEN
      RAISE EXCEPTION 'A participant can have only one primary role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."enforce_single_primary_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enforce_single_primary_wallet"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."enforce_single_primary_wallet"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.users (
    id, 
    email, 
    full_name
  ) values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  update public.users
  set email = new.email
  where id = new.id::uuid;
  return new;
end;$$;


ALTER FUNCTION "public"."handle_updated_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."preset_otp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    if (new.email like '%@devspot.app') then
        new.confirmation_token := encode(sha224(concat(new.email, '123456')::bytea), 'hex');
        new.confirmation_sent_at := now() - interval '2 minutes';
    end if;
    return new;
end;
$$;


ALTER FUNCTION "public"."preset_otp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_initial_token_balance"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.token_balance := 100;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_initial_token_balance"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_main_role"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."sync_main_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_all_fks"("on_delete_action" character varying) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."update_all_fks"("on_delete_action" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_prize_allocations"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."update_prize_allocations"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."users_schedule_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."users_schedule_cleanup"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "development"."hackathon_application_answers" (
    "id" integer NOT NULL,
    "question_id" integer NOT NULL,
    "participant_id" integer NOT NULL,
    "answer" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_application_answers" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_application_answers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_application_answers_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_application_answers_id_seq" OWNED BY "development"."hackathon_application_answers"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_application_questions" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "question" "text" NOT NULL,
    "order" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_application_questions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_application_questions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_application_questions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_application_questions_id_seq" OWNED BY "development"."hackathon_application_questions"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_challenge_bounties" (
    "id" integer NOT NULL,
    "challenge_id" integer NOT NULL,
    "title" character varying NOT NULL,
    "company_partner_logo" character varying NOT NULL,
    "prize_usd" integer,
    "prize_tokens" integer,
    "prize_custom" character varying,
    "rank" integer,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_challenge_bounties" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_challenge_bounties_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_challenge_bounties_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_challenge_bounties_id_seq" OWNED BY "development"."hackathon_challenge_bounties"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_challenges" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "challenge_name" character varying NOT NULL,
    "description" "text",
    "technologies" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "sponsors" "jsonb"[] DEFAULT '{}'::"jsonb"[] NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_challenges" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_challenges_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_challenges_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_challenges_id_seq" OWNED BY "development"."hackathon_challenges"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_faqs" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "question" "text" NOT NULL,
    "answer" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_faqs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_faqs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_faqs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_faqs_id_seq" OWNED BY "development"."hackathon_faqs"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_participants" (
    "id" integer NOT NULL,
    "participant_id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "application_status" "development"."hackathon_participant_application_status" DEFAULT 'pending'::"development"."hackathon_participant_application_status" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_participants" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_participants_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_participants_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_participants_id_seq" OWNED BY "development"."hackathon_participants"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_resources" (
    "id" integer NOT NULL,
    "title" character varying NOT NULL,
    "url" character varying NOT NULL,
    "description" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_resources" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_resources_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_resources_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_resources_id_seq" OWNED BY "development"."hackathon_resources"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_sessions" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "title" character varying NOT NULL,
    "description" "text",
    "start_time" timestamp without time zone NOT NULL,
    "end_time" timestamp without time zone NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "location" character varying,
    "virtual_link" character varying,
    "type" character varying NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_sessions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_sessions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_sessions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_sessions_id_seq" OWNED BY "development"."hackathon_sessions"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_stakes" (
    "id" integer NOT NULL,
    "participant_id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "amount" numeric NOT NULL,
    "status" "development"."hackathon_stakes_status" DEFAULT 'pending'::"development"."hackathon_stakes_status" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_stakes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_stakes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_stakes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_stakes_id_seq" OWNED BY "development"."hackathon_stakes"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_user_session_rsvp" (
    "id" integer NOT NULL,
    "session_id" integer NOT NULL,
    "participant_id" integer NOT NULL,
    "status" boolean DEFAULT false NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_user_session_rsvp" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_user_session_rsvp_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_user_session_rsvp_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_user_session_rsvp_id_seq" OWNED BY "development"."hackathon_user_session_rsvp"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_vip_roles" (
    "id" integer NOT NULL,
    "hackathon_vip_id" integer NOT NULL,
    "role_id" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_vip_roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_vip_roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_vip_roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_vip_roles_id_seq" OWNED BY "development"."hackathon_vip_roles"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathon_vips" (
    "id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathon_vips" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathon_vips_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathon_vips_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathon_vips_id_seq" OWNED BY "development"."hackathon_vips"."id";



CREATE TABLE IF NOT EXISTS "development"."hackathons" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "avatar_url" character varying NOT NULL,
    "banner_url" character varying NOT NULL,
    "organizer_id" integer NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "location" character varying,
    "type" "development"."hackathon_type" NOT NULL,
    "status" "development"."hackathon_status" DEFAULT 'upcoming'::"development"."hackathon_status" NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "technologies" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "sponsors" "jsonb"[] DEFAULT '{}'::"jsonb"[] NOT NULL,
    "deadline_to_submit" "date",
    "deadline_to_join" "date",
    "application_method" "development"."hackathon_application_method" NOT NULL,
    "team_limit" integer,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."hackathons" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."hackathons_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."hackathons_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."hackathons_id_seq" OWNED BY "development"."hackathons"."id";



CREATE TABLE IF NOT EXISTS "development"."participant_profile" (
    "id" integer NOT NULL,
    "participant_id" integer NOT NULL,
    "description" "text",
    "is_open_to_work" boolean DEFAULT false NOT NULL,
    "skills" "jsonb",
    "location" character varying,
    "years_of_experience" integer,
    "portfolio_website" character varying,
    "is_open_to_project" boolean DEFAULT false NOT NULL,
    "connected_accounts" "jsonb"[],
    "token_balance" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."participant_profile" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."participant_profile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."participant_profile_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."participant_profile_id_seq" OWNED BY "development"."participant_profile"."id";



CREATE TABLE IF NOT EXISTS "development"."participant_roles" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."participant_roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."participant_roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."participant_roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."participant_roles_id_seq" OWNED BY "development"."participant_roles"."id";



CREATE TABLE IF NOT EXISTS "development"."participant_transactions" (
    "id" integer NOT NULL,
    "title" character varying NOT NULL,
    "type" "development"."transaction_type" NOT NULL,
    "participant_id" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."participant_transactions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."participant_transactions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."participant_transactions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."participant_transactions_id_seq" OWNED BY "development"."participant_transactions"."id";



CREATE TABLE IF NOT EXISTS "development"."participant_wallets" (
    "id" integer NOT NULL,
    "participant_id" integer NOT NULL,
    "wallet_address" character varying NOT NULL,
    "primary_wallet" boolean DEFAULT false NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."participant_wallets" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."participant_wallets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."participant_wallets_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."participant_wallets_id_seq" OWNED BY "development"."participant_wallets"."id";



CREATE TABLE IF NOT EXISTS "development"."project_challenges" (
    "id" integer NOT NULL,
    "challenge_id" integer NOT NULL,
    "project_id" integer NOT NULL,
    "rank" integer,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."project_challenges" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."project_challenges_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."project_challenges_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."project_challenges_id_seq" OWNED BY "development"."project_challenges"."id";



CREATE TABLE IF NOT EXISTS "development"."projects" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "name" character varying NOT NULL,
    "project_url" character varying,
    "demo_video_url" character varying,
    "team_id" integer NOT NULL,
    "description" "text",
    "technologies" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "logo_url" character varying,
    "header_url" character varying,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."projects" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."projects_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."projects_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."projects_id_seq" OWNED BY "development"."projects"."id";



CREATE TABLE IF NOT EXISTS "development"."roles" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."roles_id_seq" OWNED BY "development"."roles"."id";



CREATE TABLE IF NOT EXISTS "development"."team_invitations" (
    "id" integer NOT NULL,
    "sender_user_id" integer NOT NULL,
    "receiver_user_id" integer NOT NULL,
    "team_id" integer NOT NULL,
    "status" "development"."team_invitations_status" DEFAULT 'pending'::"development"."team_invitations_status" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."team_invitations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."team_invitations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."team_invitations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."team_invitations_id_seq" OWNED BY "development"."team_invitations"."id";



CREATE TABLE IF NOT EXISTS "development"."team_memberships" (
    "id" integer NOT NULL,
    "team_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."team_memberships" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."team_memberships_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."team_memberships_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."team_memberships_id_seq" OWNED BY "development"."team_memberships"."id";



CREATE TABLE IF NOT EXISTS "development"."teams" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "limit" integer,
    "accepting_participants" boolean DEFAULT true NOT NULL,
    "hackathon_id" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."teams" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."teams_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."teams_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."teams_id_seq" OWNED BY "development"."teams"."id";



CREATE TABLE IF NOT EXISTS "development"."technology_owners" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "logo" character varying NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."technology_owners" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."technology_owners_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."technology_owners_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."technology_owners_id_seq" OWNED BY "development"."technology_owners"."id";



CREATE TABLE IF NOT EXISTS "development"."user_participant_roles" (
    "id" integer NOT NULL,
    "participant_id" integer NOT NULL,
    "role_id" integer NOT NULL,
    "is_primary" boolean NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."user_participant_roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."user_participant_roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."user_participant_roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."user_participant_roles_id_seq" OWNED BY "development"."user_participant_roles"."id";



CREATE TABLE IF NOT EXISTS "development"."users" (
    "id" integer NOT NULL,
    "email" character varying NOT NULL,
    "full_name" character varying NOT NULL,
    "role_id" integer NOT NULL,
    "avatar_url" character varying,
    "terms_accepted" boolean DEFAULT false NOT NULL,
    "profile_header_url" character varying,
    "notification_preferences" "development"."notification_type"[] NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "development"."users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "development"."users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "development"."users_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "development"."users_id_seq" OWNED BY "development"."users"."id";



CREATE TABLE IF NOT EXISTS "public"."participant_profile" (
    "id" integer NOT NULL,
    "description" "text",
    "is_open_to_work" boolean DEFAULT false NOT NULL,
    "is_open_to_project" boolean DEFAULT false NOT NULL,
    "skills" "jsonb",
    "location" character varying,
    "years_of_experience" integer,
    "portfolio_website" character varying,
    "connected_accounts" "jsonb"[],
    "token_balance" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "participant_id" "uuid" NOT NULL,
    "linkedin_url" "text",
    "profile_token_bonus" integer DEFAULT 0 NOT NULL,
    "lensfrens_url" "text",
    "warpcast_url" "text",
    "x_url" "text",
    CONSTRAINT "check_years_of_experience" CHECK (("years_of_experience" <= 50))
);


ALTER TABLE "public"."participant_profile" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."participant_roles" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."participant_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_team_members" (
    "id" integer NOT NULL,
    "project_id" integer NOT NULL,
    "is_project_manager" boolean DEFAULT false NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "prize_allocation" integer DEFAULT 0 NOT NULL,
    "status" "public"."team member invite status" DEFAULT 'pending'::"public"."team member invite status" NOT NULL
);


ALTER TABLE "public"."project_team_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_participant_roles" (
    "id" integer NOT NULL,
    "role_id" integer NOT NULL,
    "is_primary" boolean DEFAULT false NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "participant_id" "uuid" NOT NULL
);


ALTER TABLE "public"."user_participant_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "full_name" "text",
    "avatar_url" "text",
    "created_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "profile_header_url" "text",
    "terms_accepted" boolean DEFAULT false,
    "main_role" "text",
    "notification_preferences" "text"[] DEFAULT ARRAY['in_app'::"text", 'email'::"text"] NOT NULL,
    "role_id" integer DEFAULT 1 NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON COLUMN "public"."users"."avatar_url" IS 'Profile Image';



COMMENT ON COLUMN "public"."users"."main_role" IS 'This would be the role displayed first for a user on their profile';



CREATE OR REPLACE VIEW "public"."discover_users_information" AS
 WITH "filtered" AS (
         SELECT "u"."id",
            "u"."full_name",
            "u"."avatar_url",
            "json_build_object"('location', "pp"."location", 'skills', "pp"."skills", 'token_balance', "pp"."token_balance") AS "profile",
            ( SELECT "count"(*) AS "count"
                   FROM "public"."project_team_members" "ptm"
                  WHERE ("ptm"."user_id" = "u"."id")) AS "project_count",
            ( SELECT COALESCE("json_agg"("json_build_object"('is_primary', "upr"."is_primary", 'name', "r"."name")) FILTER (WHERE ("upr"."id" IS NOT NULL)), '[]'::"json") AS "coalesce"
                   FROM ("public"."user_participant_roles" "upr"
                     JOIN "public"."participant_roles" "r" ON (("r"."id" = "upr"."role_id")))
                  WHERE ("upr"."participant_id" = "u"."id")) AS "user_participant_roles"
           FROM ("public"."users" "u"
             JOIN "public"."participant_profile" "pp" ON (("pp"."participant_id" = "u"."id")))
          WHERE (("u"."role_id" = 1) AND ("pp"."location" IS NOT NULL) AND (("pp"."location")::"text" <> ''::"text") AND ("pp"."skills" IS NOT NULL))
        ), "others" AS (
         SELECT "u"."id",
            "u"."full_name",
            "u"."avatar_url",
            "json_build_object"('location', "pp"."location", 'skills', "pp"."skills", 'token_balance', "pp"."token_balance") AS "profile",
            ( SELECT "count"(*) AS "count"
                   FROM "public"."project_team_members" "ptm"
                  WHERE ("ptm"."user_id" = "u"."id")) AS "project_count",
            ( SELECT COALESCE("json_agg"("json_build_object"('is_primary', "upr"."is_primary", 'name', "r"."name")) FILTER (WHERE ("upr"."id" IS NOT NULL)), '[]'::"json") AS "coalesce"
                   FROM ("public"."user_participant_roles" "upr"
                     JOIN "public"."participant_roles" "r" ON (("r"."id" = "upr"."role_id")))
                  WHERE ("upr"."participant_id" = "u"."id")) AS "user_participant_roles"
           FROM ("public"."users" "u"
             JOIN "public"."participant_profile" "pp" ON (("pp"."participant_id" = "u"."id")))
          WHERE (NOT (("u"."role_id" = 1) AND ("pp"."location" IS NOT NULL) AND (("pp"."location")::"text" <> ''::"text") AND ("pp"."skills" IS NOT NULL)))
        )
 SELECT "combined"."id",
    "combined"."full_name",
    "combined"."avatar_url",
    "combined"."profile",
    "combined"."project_count",
    "combined"."user_participant_roles",
    "combined"."priority"
   FROM ( SELECT "filtered"."id",
            "filtered"."full_name",
            "filtered"."avatar_url",
            "filtered"."profile",
            "filtered"."project_count",
            "filtered"."user_participant_roles",
            0 AS "priority"
           FROM "filtered"
        UNION ALL
         SELECT "others"."id",
            "others"."full_name",
            "others"."avatar_url",
            "others"."profile",
            "others"."project_count",
            "others"."user_participant_roles",
            1 AS "priority"
           FROM "others") "combined"
  ORDER BY "combined"."priority", ("random"())
 LIMIT 10;


ALTER TABLE "public"."discover_users_information" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."discover_users_information_view" AS
 WITH "base" AS (
         SELECT "u"."id",
            "u"."full_name",
            "u"."avatar_url",
            "json_build_object"('location', "pp"."location", 'skills', "pp"."skills", 'token_balance', "pp"."token_balance") AS "profile",
            (("u"."role_id" = 1) AND ("pp"."location" IS NOT NULL) AND (("pp"."location")::"text" <> ''::"text") AND ("pp"."skills" IS NOT NULL)) AS "is_discoverable"
           FROM ("public"."users" "u"
             JOIN "public"."participant_profile" "pp" ON (("pp"."participant_id" = "u"."id")))
        )
 SELECT "b"."id",
    "b"."full_name",
    "b"."avatar_url",
    "b"."profile",
    "pc"."project_count",
    "upr"."user_participant_roles"
   FROM (("base" "b"
     LEFT JOIN LATERAL ( SELECT "count"(*) AS "project_count"
           FROM "public"."project_team_members" "ptm"
          WHERE ("ptm"."user_id" = "b"."id")) "pc" ON (true))
     LEFT JOIN LATERAL ( SELECT COALESCE("json_agg"("json_build_object"('is_primary', "upr_1"."is_primary", 'name', "r"."name")) FILTER (WHERE ("upr_1"."id" IS NOT NULL)), '[]'::"json") AS "user_participant_roles"
           FROM ("public"."user_participant_roles" "upr_1"
             JOIN "public"."participant_roles" "r" ON (("r"."id" = "upr_1"."role_id")))
          WHERE ("upr_1"."participant_id" = "b"."id")) "upr" ON (true))
  ORDER BY "b"."is_discoverable" DESC, ("random"())
 LIMIT 10;


ALTER TABLE "public"."discover_users_information_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hackathon_application_answers" (
    "id" integer NOT NULL,
    "question_id" integer NOT NULL,
    "answer" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "participant_id" "uuid"
);


ALTER TABLE "public"."hackathon_application_answers" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_application_answers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_application_answers_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_application_answers_id_seq" OWNED BY "public"."hackathon_application_answers"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_application_questions" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "question" "text" NOT NULL,
    "order" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."hackathon_application_questions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_application_questions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_application_questions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_application_questions_id_seq" OWNED BY "public"."hackathon_application_questions"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_challenge_bounties" (
    "id" integer NOT NULL,
    "challenge_id" integer NOT NULL,
    "title" character varying NOT NULL,
    "company_partner_logo" character varying NOT NULL,
    "prize_usd" integer,
    "prize_tokens" integer,
    "prize_custom" character varying,
    "rank" integer,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."hackathon_challenge_bounties" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_challenge_bounties_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_challenge_bounties_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_challenge_bounties_id_seq" OWNED BY "public"."hackathon_challenge_bounties"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_challenge_feedback" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "hackathon_id" integer NOT NULL,
    "challenge_id" integer NOT NULL,
    "project_id" integer NOT NULL,
    "overall_rating" smallint,
    "docs_rating" smallint,
    "support_rating" smallint,
    "comments" "text"
);


ALTER TABLE "public"."hackathon_challenge_feedback" OWNER TO "postgres";


ALTER TABLE "public"."hackathon_challenge_feedback" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."hackathon_challenge_feedback_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."hackathon_challenges" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "challenge_name" character varying NOT NULL,
    "description" "text",
    "technologies" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "sponsors" "jsonb"[] DEFAULT '{}'::"jsonb"[] NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "example_projects" "text"[],
    "required_tech" "text"[],
    "submission_requirements" "text"[]
);


ALTER TABLE "public"."hackathon_challenges" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_challenges_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_challenges_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_challenges_id_seq" OWNED BY "public"."hackathon_challenges"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_faqs" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "question" "text" NOT NULL,
    "answer" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."hackathon_faqs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_faqs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_faqs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_faqs_id_seq" OWNED BY "public"."hackathon_faqs"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_participants" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "application_status" "public"."hackathon_participant_application_status" DEFAULT 'pending'::"public"."hackathon_participant_application_status" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "participant_id" "uuid",
    "looking_for_teammates" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."hackathon_participants" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_participants_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_participants_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_participants_id_seq" OWNED BY "public"."hackathon_participants"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_resources" (
    "id" integer NOT NULL,
    "title" character varying NOT NULL,
    "url" character varying,
    "description" "text",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "hackathon_id" integer NOT NULL,
    "type" "text",
    "technologies" "text"[],
    "sponsors" "jsonb",
    "has_external_link" boolean,
    "is_downloadable" boolean
);


ALTER TABLE "public"."hackathon_resources" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_resources_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_resources_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_resources_id_seq" OWNED BY "public"."hackathon_resources"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_resource_challenges" (
    "id" integer DEFAULT "nextval"('"public"."hackathon_resources_id_seq"'::"regclass") NOT NULL,
    "resource_id" integer,
    "challenge_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."hackathon_resource_challenges" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_resource_challenges_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_resource_challenges_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_resource_challenges_id_seq" OWNED BY "public"."hackathon_resource_challenges"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_sessions" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "title" character varying NOT NULL,
    "description" "text",
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "location" "jsonb",
    "virtual_link" character varying,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "is_milestone" boolean DEFAULT false NOT NULL,
    "event_link" "text"
);


ALTER TABLE "public"."hackathon_sessions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_sessions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_sessions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_sessions_id_seq" OWNED BY "public"."hackathon_sessions"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_stakes" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "amount" numeric NOT NULL,
    "status" "public"."hackathon_stakes_status" DEFAULT 'pending'::"public"."hackathon_stakes_status" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "participant_id" "uuid"
);


ALTER TABLE "public"."hackathon_stakes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_stakes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_stakes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_stakes_id_seq" OWNED BY "public"."hackathon_stakes"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_user_session_rsvp" (
    "id" integer NOT NULL,
    "session_id" integer NOT NULL,
    "status" boolean DEFAULT false NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "participant_id" "uuid"
);


ALTER TABLE "public"."hackathon_user_session_rsvp" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_user_session_rsvp_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_user_session_rsvp_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_user_session_rsvp_id_seq" OWNED BY "public"."hackathon_user_session_rsvp"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_vip_roles" (
    "id" integer NOT NULL,
    "hackathon_vip_id" integer NOT NULL,
    "role_id" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."hackathon_vip_roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_vip_roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_vip_roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_vip_roles_id_seq" OWNED BY "public"."hackathon_vip_roles"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathon_vips" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "public"."hackathon_vips" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_vips_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathon_vips_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_vips_id_seq" OWNED BY "public"."hackathon_vips"."id";



CREATE TABLE IF NOT EXISTS "public"."hackathons" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "avatar_url" character varying NOT NULL,
    "banner_url" character varying NOT NULL,
    "organizer_id" integer NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "location" character varying,
    "type" "public"."hackathon_type" NOT NULL,
    "status" "public"."hackathon_status" DEFAULT 'upcoming'::"public"."hackathon_status" NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "technologies" "text"[] DEFAULT '{}'::"text"[],
    "sponsors" "jsonb"[] DEFAULT '{}'::"jsonb"[] NOT NULL,
    "deadline_to_submit" "date",
    "deadline_to_join" "date",
    "application_method" "public"."hackathon_application_method" NOT NULL,
    "team_limit" integer,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "allow_multiple_teams" boolean DEFAULT false NOT NULL,
    "subdomain" "text" NOT NULL,
    "grand_prizes" "jsonb"[],
    CONSTRAINT "hackathons_subdomain_check" CHECK (("subdomain" ~ '^(?!.*--)[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]$'::"text"))
);


ALTER TABLE "public"."hackathons" OWNER TO "postgres";


COMMENT ON COLUMN "public"."hackathons"."subdomain" IS 'The subdomain associated with this hackathon needed to access its page (e.g. quantumshift.devspot.app)';



CREATE TABLE IF NOT EXISTS "public"."technology_owners" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "logo" character varying NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "description" "text",
    "discord_url" "text",
    "domain" "text",
    "facebook_url" "text",
    "instagram_url" "text",
    "link" "text",
    "linkedin_url" "text",
    "location" "text",
    "no_of_upcoming_hackathons" integer,
    "num_employees" "text",
    "slack_url" "text",
    "tagline" "text",
    "technologies" "text"[],
    "telegram_url" "text",
    "x_url" "text",
    "youtube_url" "text"
);


ALTER TABLE "public"."technology_owners" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."hackathons_discover_view" AS
 SELECT "h"."id",
    "h"."name",
    "h"."status",
    "h"."type",
    "h"."location",
    "h"."start_date",
    "json_build_object"('name', "o"."name", 'logo', "o"."logo") AS "organizer",
    COALESCE("p"."participant_count", (0)::bigint) AS "number_of_participant"
   FROM (("public"."hackathons" "h"
     JOIN "public"."technology_owners" "o" ON (("o"."id" = "h"."organizer_id")))
     LEFT JOIN ( SELECT "hackathon_participants"."hackathon_id",
            "count"(*) AS "participant_count"
           FROM "public"."hackathon_participants"
          GROUP BY "hackathon_participants"."hackathon_id") "p" ON (("p"."hackathon_id" = "h"."id")))
  WHERE ("h"."status" = ANY (ARRAY['upcoming'::"public"."hackathon_status", 'live'::"public"."hackathon_status"]))
  ORDER BY ("random"())
 LIMIT 10;


ALTER TABLE "public"."hackathons_discover_view" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathons_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."hackathons_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathons_id_seq" OWNED BY "public"."hackathons"."id";



CREATE TABLE IF NOT EXISTS "public"."judging_entries" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "judging_id" integer NOT NULL,
    "project_id" integer NOT NULL,
    "judging_status" "public"."judging_status" NOT NULL,
    "score" smallint NOT NULL,
    "general_comments" "text" NOT NULL,
    "technical_feedback" "text" NOT NULL,
    "ux_feedback" "text" NOT NULL,
    "business_feedback" "text" NOT NULL,
    "innovation_feedback" "text" NOT NULL,
    "flagged_reason" "text",
    "flagged_comments" "text",
    "challenge_id" integer NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."judging_entries" OWNER TO "postgres";


ALTER TABLE "public"."judging_entries" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."judging_entries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."judgings" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "is_submitted" boolean NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "update_at" timestamp with time zone,
    "user_id" "uuid" NOT NULL,
    "deadline" "date"
);


ALTER TABLE "public"."judgings" OWNER TO "postgres";


COMMENT ON COLUMN "public"."judgings"."deadline" IS 'judging deadline';



ALTER TABLE "public"."judgings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."judgings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."nonces" (
    "id" integer NOT NULL,
    "nonce" character varying NOT NULL,
    "used" boolean DEFAULT false NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp without time zone NOT NULL,
    "address" "text" NOT NULL
);


ALTER TABLE "public"."nonces" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."nonces_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."nonces_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."nonces_id_seq" OWNED BY "public"."nonces"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."participant_profile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."participant_profile_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."participant_profile_id_seq" OWNED BY "public"."participant_profile"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."participant_roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."participant_roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."participant_roles_id_seq" OWNED BY "public"."participant_roles"."id";



CREATE TABLE IF NOT EXISTS "public"."participant_transactions" (
    "id" integer NOT NULL,
    "title" character varying NOT NULL,
    "type" "public"."transaction_type" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "participant_id" "uuid"
);


ALTER TABLE "public"."participant_transactions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."participant_transactions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."participant_transactions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."participant_transactions_id_seq" OWNED BY "public"."participant_transactions"."id";



CREATE TABLE IF NOT EXISTS "public"."participant_wallets" (
    "id" integer NOT NULL,
    "wallet_address" character varying NOT NULL,
    "primary_wallet" boolean DEFAULT false NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "participant_id" "uuid"
);


ALTER TABLE "public"."participant_wallets" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."participant_wallets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."participant_wallets_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."participant_wallets_id_seq" OWNED BY "public"."participant_wallets"."id";



CREATE TABLE IF NOT EXISTS "public"."project_challenges" (
    "id" integer NOT NULL,
    "challenge_id" integer NOT NULL,
    "project_id" integer NOT NULL,
    "rank" integer,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."project_challenges" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."project_challenges_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."project_challenges_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."project_challenges_id_seq" OWNED BY "public"."project_challenges"."id";



CREATE TABLE IF NOT EXISTS "public"."project_invitations" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "project_id" integer NOT NULL,
    "status" "public"."invitation_status" NOT NULL,
    "type" "public"."invitation_type" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."project_invitations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."project_invitations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."project_invitations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."project_invitations_id_seq" OWNED BY "public"."project_invitations"."id";



CREATE TABLE IF NOT EXISTS "public"."project_notification_data" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "transaction_id" "text",
    "payload" "jsonb"
);


ALTER TABLE "public"."project_notification_data" OWNER TO "postgres";


ALTER TABLE "public"."project_notification_data" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."project_notification_data_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE SEQUENCE IF NOT EXISTS "public"."project_team_members_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."project_team_members_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."project_team_members_id_seq" OWNED BY "public"."project_team_members"."id";



CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "name" character varying NOT NULL,
    "project_url" character varying,
    "video_url" character varying,
    "description" "text",
    "logo_url" character varying,
    "header_url" character varying,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "technologies" "text"[],
    "submitted" boolean DEFAULT false NOT NULL,
    "accepting_participants" boolean DEFAULT false NOT NULL,
    "demo_url" character varying,
    "tagline" "text"
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


COMMENT ON COLUMN "public"."projects"."submitted" IS 'Agreed to all legal requirements and pressed ''Submit''';



CREATE SEQUENCE IF NOT EXISTS "public"."projects_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."projects_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."projects_id_seq" OWNED BY "public"."projects"."id";



CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."roles_id_seq" OWNED BY "public"."roles"."id";



CREATE TABLE IF NOT EXISTS "public"."team_up_requests" (
    "id" integer NOT NULL,
    "hackathon_id" integer NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "receiver_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."team_up_requests" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."team_up_requests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."team_up_requests_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."team_up_requests_id_seq" OWNED BY "public"."team_up_requests"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."technology_owners_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."technology_owners_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."technology_owners_id_seq" OWNED BY "public"."technology_owners"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."user_participant_roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."user_participant_roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_participant_roles_id_seq" OWNED BY "public"."user_participant_roles"."id";



CREATE OR REPLACE VIEW "public"."users_discover_view" AS
 WITH "base" AS (
         SELECT "u"."id",
            "u"."full_name",
            "u"."avatar_url",
            "json_build_object"('location', "pp"."location", 'skills', "pp"."skills", 'token_balance', "pp"."token_balance") AS "profile",
            (("u"."role_id" = 1) AND ("pp"."location" IS NOT NULL) AND (("pp"."location")::"text" <> ''::"text") AND ("pp"."skills" IS NOT NULL)) AS "is_discoverable"
           FROM ("public"."users" "u"
             JOIN "public"."participant_profile" "pp" ON (("pp"."participant_id" = "u"."id")))
        )
 SELECT "b"."id",
    "b"."full_name",
    "b"."avatar_url",
    "b"."profile",
    "pc"."project_count",
    "upr"."user_participant_roles"
   FROM (("base" "b"
     LEFT JOIN LATERAL ( SELECT "count"(*) AS "project_count"
           FROM "public"."project_team_members" "ptm"
          WHERE ("ptm"."user_id" = "b"."id")) "pc" ON (true))
     LEFT JOIN LATERAL ( SELECT COALESCE("json_agg"("json_build_object"('is_primary', "upr_1"."is_primary", 'name', "r"."name")) FILTER (WHERE ("upr_1"."id" IS NOT NULL)), '[]'::"json") AS "user_participant_roles"
           FROM ("public"."user_participant_roles" "upr_1"
             JOIN "public"."participant_roles" "r" ON (("r"."id" = "upr_1"."role_id")))
          WHERE ("upr_1"."participant_id" = "b"."id")) "upr" ON (true))
  ORDER BY "b"."is_discoverable" DESC, ("random"())
 LIMIT 10;


ALTER TABLE "public"."users_discover_view" OWNER TO "postgres";


ALTER TABLE ONLY "development"."hackathon_application_answers" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_application_answers_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_application_questions" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_application_questions_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_challenge_bounties" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_challenge_bounties_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_challenges" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_challenges_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_faqs" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_faqs_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_participants" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_participants_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_resources" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_resources_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_sessions" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_sessions_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_stakes" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_stakes_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_user_session_rsvp" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_user_session_rsvp_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_vip_roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_vip_roles_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_vips" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathon_vips_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathons" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."hackathons_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."participant_profile" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."participant_profile_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."participant_roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."participant_roles_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."participant_transactions" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."participant_transactions_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."participant_wallets" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."participant_wallets_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."project_challenges" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."project_challenges_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."projects" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."projects_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."roles_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."team_invitations" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."team_invitations_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."team_memberships" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."team_memberships_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."teams" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."teams_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."technology_owners" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."technology_owners_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."user_participant_roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."user_participant_roles_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"development"."users_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_application_answers" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_application_answers_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_application_questions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_application_questions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_challenge_bounties" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_challenge_bounties_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_challenges" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_challenges_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_faqs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_faqs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_participants" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_participants_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_resources" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_resources_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_sessions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_sessions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_stakes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_stakes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_user_session_rsvp" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_user_session_rsvp_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_vip_roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_vip_roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_vips" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_vips_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathons" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathons_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."nonces" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."nonces_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."participant_profile" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."participant_profile_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."participant_roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."participant_roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."participant_transactions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."participant_transactions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."participant_wallets" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."participant_wallets_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."project_challenges" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."project_challenges_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."project_invitations" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."project_invitations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."project_team_members" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."project_team_members_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."projects" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."projects_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."team_up_requests" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."team_up_requests_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."technology_owners" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."technology_owners_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_participant_roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_participant_roles_id_seq"'::"regclass");



ALTER TABLE ONLY "development"."hackathon_application_answers"
    ADD CONSTRAINT "hackathon_application_answers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_application_questions"
    ADD CONSTRAINT "hackathon_application_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_challenge_bounties"
    ADD CONSTRAINT "hackathon_challenge_bounties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_challenges"
    ADD CONSTRAINT "hackathon_challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_faqs"
    ADD CONSTRAINT "hackathon_faqs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_participants"
    ADD CONSTRAINT "hackathon_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_resources"
    ADD CONSTRAINT "hackathon_resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_sessions"
    ADD CONSTRAINT "hackathon_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_stakes"
    ADD CONSTRAINT "hackathon_stakes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_user_session_rsvp"
    ADD CONSTRAINT "hackathon_user_session_rsvp_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_vip_roles"
    ADD CONSTRAINT "hackathon_vip_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathon_vips"
    ADD CONSTRAINT "hackathon_vips_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."hackathons"
    ADD CONSTRAINT "hackathons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."participant_profile"
    ADD CONSTRAINT "participant_profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."participant_roles"
    ADD CONSTRAINT "participant_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."participant_transactions"
    ADD CONSTRAINT "participant_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."participant_wallets"
    ADD CONSTRAINT "participant_wallets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."project_challenges"
    ADD CONSTRAINT "project_challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."team_invitations"
    ADD CONSTRAINT "team_invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."team_memberships"
    ADD CONSTRAINT "team_memberships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."technology_owners"
    ADD CONSTRAINT "technology_owners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."user_participant_roles"
    ADD CONSTRAINT "user_participant_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "development"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_application_answers"
    ADD CONSTRAINT "hackathon_application_answers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_application_questions"
    ADD CONSTRAINT "hackathon_application_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_challenge_bounties"
    ADD CONSTRAINT "hackathon_challenge_bounties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_challenge_feedback"
    ADD CONSTRAINT "hackathon_challenge_feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_challenges"
    ADD CONSTRAINT "hackathon_challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_faqs"
    ADD CONSTRAINT "hackathon_faqs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_participants"
    ADD CONSTRAINT "hackathon_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_resource_challenges"
    ADD CONSTRAINT "hackathon_resource_challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_resources"
    ADD CONSTRAINT "hackathon_resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_sessions"
    ADD CONSTRAINT "hackathon_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_stakes"
    ADD CONSTRAINT "hackathon_stakes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_user_session_rsvp"
    ADD CONSTRAINT "hackathon_user_session_rsvp_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_vip_roles"
    ADD CONSTRAINT "hackathon_vip_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_vips"
    ADD CONSTRAINT "hackathon_vips_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathons"
    ADD CONSTRAINT "hackathons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathons"
    ADD CONSTRAINT "hackathons_subdomain_key" UNIQUE ("subdomain");



ALTER TABLE ONLY "public"."judging_entries"
    ADD CONSTRAINT "judging_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."judgings"
    ADD CONSTRAINT "judgings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nonces"
    ADD CONSTRAINT "nonces_nonce_key" UNIQUE ("nonce");



ALTER TABLE ONLY "public"."nonces"
    ADD CONSTRAINT "nonces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."participant_profile"
    ADD CONSTRAINT "participant_profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."participant_roles"
    ADD CONSTRAINT "participant_roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."participant_roles"
    ADD CONSTRAINT "participant_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."participant_transactions"
    ADD CONSTRAINT "participant_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."participant_wallets"
    ADD CONSTRAINT "participant_wallets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."participant_wallets"
    ADD CONSTRAINT "participant_wallets_wallet_address_key" UNIQUE ("wallet_address");



ALTER TABLE ONLY "public"."project_challenges"
    ADD CONSTRAINT "project_challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_invitations"
    ADD CONSTRAINT "project_invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_notification_data"
    ADD CONSTRAINT "project_notification_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_team_members"
    ADD CONSTRAINT "project_team_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_up_requests"
    ADD CONSTRAINT "team_up_requests_hackathon_id_sender_id_receiver_id_key" UNIQUE ("hackathon_id", "sender_id", "receiver_id");



ALTER TABLE ONLY "public"."team_up_requests"
    ADD CONSTRAINT "team_up_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."technology_owners"
    ADD CONSTRAINT "technology_owners_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."technology_owners"
    ADD CONSTRAINT "technology_owners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_resource_challenges"
    ADD CONSTRAINT "unique_resource_challenge" UNIQUE ("resource_id", "challenge_id");



ALTER TABLE ONLY "public"."hackathon_user_session_rsvp"
    ADD CONSTRAINT "unique_session_user" UNIQUE ("session_id", "participant_id");



ALTER TABLE ONLY "public"."user_participant_roles"
    ADD CONSTRAINT "user_participant_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "UserProfile_email_key" ON "public"."users" USING "btree" ("email");



CREATE UNIQUE INDEX "ux_upr_primary_per_user" ON "public"."user_participant_roles" USING "btree" ("participant_id") WHERE "is_primary";



CREATE OR REPLACE TRIGGER "check_primary_role" BEFORE INSERT OR UPDATE ON "public"."user_participant_roles" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_single_primary_role"();



CREATE OR REPLACE TRIGGER "check_primary_wallet" BEFORE INSERT OR UPDATE ON "public"."participant_wallets" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_single_primary_wallet"();



CREATE OR REPLACE TRIGGER "create_participant_profile" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."create_participant_profile"();



CREATE OR REPLACE TRIGGER "hackathon_application_answers_update_trigger" BEFORE UPDATE ON "public"."hackathon_application_answers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_application_questions_update_trigger" BEFORE UPDATE ON "public"."hackathon_application_questions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_challenge_bounties_update_trigger" BEFORE UPDATE ON "public"."hackathon_challenge_bounties" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_challenges_update_trigger" BEFORE UPDATE ON "public"."hackathon_challenges" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_faqs_update_trigger" BEFORE UPDATE ON "public"."hackathon_faqs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_participants_update_trigger" BEFORE UPDATE ON "public"."hackathon_participants" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_resources_update_trigger" BEFORE UPDATE ON "public"."hackathon_resources" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_sessions_update_trigger" BEFORE UPDATE ON "public"."hackathon_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_stakes_update_trigger" BEFORE UPDATE ON "public"."hackathon_stakes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_user_session_rsvp_update_trigger" BEFORE UPDATE ON "public"."hackathon_user_session_rsvp" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_vip_roles_update_trigger" BEFORE UPDATE ON "public"."hackathon_vip_roles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathon_vips_update_trigger" BEFORE UPDATE ON "public"."hackathon_vips" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "hackathons_update_trigger" BEFORE UPDATE ON "public"."hackathons" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "participant_profile_update_trigger" BEFORE UPDATE ON "public"."participant_profile" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "participant_roles_update_trigger" BEFORE UPDATE ON "public"."participant_roles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "participant_transactions_update_trigger" BEFORE UPDATE ON "public"."participant_transactions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "participant_wallets_update_trigger" BEFORE UPDATE ON "public"."participant_wallets" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "project_challenges_update_trigger" BEFORE UPDATE ON "public"."project_challenges" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "projects_update_trigger" BEFORE UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "roles_update_trigger" BEFORE UPDATE ON "public"."roles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "schedule_user_cleanup" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."users_schedule_cleanup"();

ALTER TABLE "public"."users" DISABLE TRIGGER "schedule_user_cleanup";



CREATE OR REPLACE TRIGGER "sync-to-loops-webhook-DELETE" AFTER DELETE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://dbaimdvhgbmmxfjaszcp.supabase.co/functions/v1/sync-to-loops-edge-function-DELETE', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiYWltZHZoZ2JtbXhmamFzemNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTUxOTYzMywiZXhwIjoyMDU1MDk1NjMzfQ.7r2Py4_YSjGskP4zhHX1nOdx2F2EKmC3o3o3X6U1IAM"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "sync-to-loops-webhook-POST" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://dbaimdvhgbmmxfjaszcp.supabase.co/functions/v1/sync-to-loops-edge-function-POST', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiYWltZHZoZ2JtbXhmamFzemNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTUxOTYzMywiZXhwIjoyMDU1MDk1NjMzfQ.7r2Py4_YSjGskP4zhHX1nOdx2F2EKmC3o3o3X6U1IAM"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "sync-to-loops-webhook-PUT" AFTER UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://dbaimdvhgbmmxfjaszcp.supabase.co/functions/v1/sync-to-loops-edge-function-PUT', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiYWltZHZoZ2JtbXhmamFzemNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTUxOTYzMywiZXhwIjoyMDU1MDk1NjMzfQ.7r2Py4_YSjGskP4zhHX1nOdx2F2EKmC3o3o3X6U1IAM"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "technology_owners_update_trigger" BEFORE UPDATE ON "public"."technology_owners" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trg_after_delete_ptm" AFTER DELETE ON "public"."project_team_members" FOR EACH ROW EXECUTE FUNCTION "public"."update_prize_allocations"();

ALTER TABLE "public"."project_team_members" DISABLE TRIGGER "trg_after_delete_ptm";



CREATE OR REPLACE TRIGGER "trg_after_insert_ptm" AFTER INSERT ON "public"."project_team_members" FOR EACH ROW EXECUTE FUNCTION "public"."update_prize_allocations"();

ALTER TABLE "public"."project_team_members" DISABLE TRIGGER "trg_after_insert_ptm";



CREATE OR REPLACE TRIGGER "trg_after_update_ptm" AFTER UPDATE OF "project_id" ON "public"."project_team_members" FOR EACH ROW EXECUTE FUNCTION "public"."update_prize_allocations"();

ALTER TABLE "public"."project_team_members" DISABLE TRIGGER "trg_after_update_ptm";



CREATE OR REPLACE TRIGGER "trg_clear_main_role" AFTER DELETE ON "public"."user_participant_roles" FOR EACH ROW EXECUTE FUNCTION "public"."clear_main_role_on_delete"();

ALTER TABLE "public"."user_participant_roles" DISABLE TRIGGER "trg_clear_main_role";



CREATE OR REPLACE TRIGGER "trg_delete_empty_project" AFTER DELETE ON "public"."project_team_members" FOR EACH ROW EXECUTE FUNCTION "public"."delete_project_if_empty"();



CREATE OR REPLACE TRIGGER "trg_set_token_balance" BEFORE INSERT ON "public"."participant_profile" FOR EACH ROW EXECUTE FUNCTION "public"."set_initial_token_balance"();



CREATE OR REPLACE TRIGGER "trg_sync_main_role" AFTER INSERT OR UPDATE ON "public"."user_participant_roles" FOR EACH ROW EXECUTE FUNCTION "public"."sync_main_role"();



CREATE OR REPLACE TRIGGER "user_participant_roles_update_trigger" BEFORE UPDATE ON "public"."user_participant_roles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "users_update_trigger" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "development"."hackathon_application_answers"
    ADD CONSTRAINT "hackathon_application_answers_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."hackathon_application_answers"
    ADD CONSTRAINT "hackathon_application_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "development"."hackathon_application_questions"("id");



ALTER TABLE ONLY "development"."hackathon_application_questions"
    ADD CONSTRAINT "hackathon_application_questions_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "development"."hackathons"("id");



ALTER TABLE ONLY "development"."hackathon_challenge_bounties"
    ADD CONSTRAINT "hackathon_challenge_bounties_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "development"."hackathon_challenges"("id");



ALTER TABLE ONLY "development"."hackathon_challenges"
    ADD CONSTRAINT "hackathon_challenges_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "development"."hackathons"("id");



ALTER TABLE ONLY "development"."hackathon_faqs"
    ADD CONSTRAINT "hackathon_faqs_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "development"."hackathons"("id");



ALTER TABLE ONLY "development"."hackathon_participants"
    ADD CONSTRAINT "hackathon_participants_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "development"."hackathons"("id");



ALTER TABLE ONLY "development"."hackathon_participants"
    ADD CONSTRAINT "hackathon_participants_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."hackathon_sessions"
    ADD CONSTRAINT "hackathon_sessions_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "development"."hackathons"("id");



ALTER TABLE ONLY "development"."hackathon_stakes"
    ADD CONSTRAINT "hackathon_stakes_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "development"."hackathons"("id");



ALTER TABLE ONLY "development"."hackathon_stakes"
    ADD CONSTRAINT "hackathon_stakes_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."hackathon_user_session_rsvp"
    ADD CONSTRAINT "hackathon_user_session_rsvp_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."hackathon_user_session_rsvp"
    ADD CONSTRAINT "hackathon_user_session_rsvp_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "development"."hackathon_sessions"("id");



ALTER TABLE ONLY "development"."hackathon_vip_roles"
    ADD CONSTRAINT "hackathon_vip_roles_hackathon_vip_id_fkey" FOREIGN KEY ("hackathon_vip_id") REFERENCES "development"."hackathon_vips"("id");



ALTER TABLE ONLY "development"."hackathon_vip_roles"
    ADD CONSTRAINT "hackathon_vip_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "development"."roles"("id");



ALTER TABLE ONLY "development"."hackathon_vips"
    ADD CONSTRAINT "hackathon_vips_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "development"."hackathons"("id");



ALTER TABLE ONLY "development"."hackathon_vips"
    ADD CONSTRAINT "hackathon_vips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."hackathons"
    ADD CONSTRAINT "hackathons_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "development"."technology_owners"("id");



ALTER TABLE ONLY "development"."participant_profile"
    ADD CONSTRAINT "participant_profile_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."participant_transactions"
    ADD CONSTRAINT "participant_transactions_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."participant_wallets"
    ADD CONSTRAINT "participant_wallets_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."project_challenges"
    ADD CONSTRAINT "project_challenges_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "development"."hackathon_challenges"("id");



ALTER TABLE ONLY "development"."project_challenges"
    ADD CONSTRAINT "project_challenges_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "development"."projects"("id");



ALTER TABLE ONLY "development"."projects"
    ADD CONSTRAINT "projects_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "development"."hackathons"("id");



ALTER TABLE ONLY "development"."projects"
    ADD CONSTRAINT "projects_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "development"."teams"("id");



ALTER TABLE ONLY "development"."team_invitations"
    ADD CONSTRAINT "team_invitations_receiver_user_id_fkey" FOREIGN KEY ("receiver_user_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."team_invitations"
    ADD CONSTRAINT "team_invitations_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."team_invitations"
    ADD CONSTRAINT "team_invitations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "development"."teams"("id");



ALTER TABLE ONLY "development"."team_memberships"
    ADD CONSTRAINT "team_memberships_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "development"."teams"("id");



ALTER TABLE ONLY "development"."team_memberships"
    ADD CONSTRAINT "team_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "development"."users"("id");



ALTER TABLE ONLY "development"."teams"
    ADD CONSTRAINT "teams_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "development"."hackathons"("id");



ALTER TABLE ONLY "development"."user_participant_roles"
    ADD CONSTRAINT "user_participant_roles_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "development"."participant_profile"("id");



ALTER TABLE ONLY "development"."user_participant_roles"
    ADD CONSTRAINT "user_participant_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "development"."participant_roles"("id");



ALTER TABLE ONLY "development"."users"
    ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "development"."roles"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "fk_role" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_application_answers"
    ADD CONSTRAINT "hackathon_application_answers_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_application_answers"
    ADD CONSTRAINT "hackathon_application_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."hackathon_application_questions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_application_questions"
    ADD CONSTRAINT "hackathon_application_questions_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_challenge_bounties"
    ADD CONSTRAINT "hackathon_challenge_bounties_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."hackathon_challenges"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_challenge_feedback"
    ADD CONSTRAINT "hackathon_challenge_feedback_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."hackathon_challenges"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_challenge_feedback"
    ADD CONSTRAINT "hackathon_challenge_feedback_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_challenge_feedback"
    ADD CONSTRAINT "hackathon_challenge_feedback_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_challenges"
    ADD CONSTRAINT "hackathon_challenges_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_faqs"
    ADD CONSTRAINT "hackathon_faqs_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_participants"
    ADD CONSTRAINT "hackathon_participants_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_participants"
    ADD CONSTRAINT "hackathon_participants_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_resource_challenges"
    ADD CONSTRAINT "hackathon_resource_challenges_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."hackathon_challenges"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_resource_challenges"
    ADD CONSTRAINT "hackathon_resource_challenges_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."hackathon_resources"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_resources"
    ADD CONSTRAINT "hackathon_resources_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_sessions"
    ADD CONSTRAINT "hackathon_sessions_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_stakes"
    ADD CONSTRAINT "hackathon_stakes_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_stakes"
    ADD CONSTRAINT "hackathon_stakes_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_user_session_rsvp"
    ADD CONSTRAINT "hackathon_user_session_rsvp_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_user_session_rsvp"
    ADD CONSTRAINT "hackathon_user_session_rsvp_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."hackathon_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_vip_roles"
    ADD CONSTRAINT "hackathon_vip_roles_hackathon_vip_id_fkey" FOREIGN KEY ("hackathon_vip_id") REFERENCES "public"."hackathon_vips"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_vip_roles"
    ADD CONSTRAINT "hackathon_vip_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_vips"
    ADD CONSTRAINT "hackathon_vips_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_vips"
    ADD CONSTRAINT "hackathon_vips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathons"
    ADD CONSTRAINT "hackathons_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "public"."technology_owners"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."judging_entries"
    ADD CONSTRAINT "judging_entries_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."hackathon_challenges"("id");



ALTER TABLE ONLY "public"."judging_entries"
    ADD CONSTRAINT "judging_entries_judging_id_fkey" FOREIGN KEY ("judging_id") REFERENCES "public"."judgings"("id");



ALTER TABLE ONLY "public"."judging_entries"
    ADD CONSTRAINT "judging_entries_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."judgings"
    ADD CONSTRAINT "judgings_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."judgings"
    ADD CONSTRAINT "judgings_judge_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."judgings"
    ADD CONSTRAINT "judgings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."participant_profile"
    ADD CONSTRAINT "participant_profile_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."participant_transactions"
    ADD CONSTRAINT "participant_transactions_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."participant_wallets"
    ADD CONSTRAINT "participant_wallets_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_challenges"
    ADD CONSTRAINT "project_challenges_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."hackathon_challenges"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_challenges"
    ADD CONSTRAINT "project_challenges_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_invitations"
    ADD CONSTRAINT "project_invitations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_invitations"
    ADD CONSTRAINT "project_invitations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_team_members"
    ADD CONSTRAINT "project_team_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_team_members"
    ADD CONSTRAINT "project_team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_up_requests"
    ADD CONSTRAINT "team_up_requests_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_up_requests"
    ADD CONSTRAINT "team_up_requests_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_up_requests"
    ADD CONSTRAINT "team_up_requests_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_participant_roles"
    ADD CONSTRAINT "user_participant_roles_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_participant_roles"
    ADD CONSTRAINT "user_participant_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."participant_roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_uid_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Enable insert for everyone - Testing Purposes Only" ON "public"."users" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Users can update their own profile - Testing Purposes Only" ON "public"."users" FOR UPDATE USING (true) WITH CHECK (true);



ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";









GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






























































































































































































































GRANT ALL ON FUNCTION "public"."check_primary_wallet"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_primary_wallet"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_primary_wallet"() TO "service_role";



GRANT ALL ON FUNCTION "public"."clear_main_role_on_delete"() TO "anon";
GRANT ALL ON FUNCTION "public"."clear_main_role_on_delete"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."clear_main_role_on_delete"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_participant_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_participant_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_participant_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_project_if_empty"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_project_if_empty"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_project_if_empty"() TO "service_role";



GRANT ALL ON FUNCTION "public"."discover_people"("fetch_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."discover_people"("fetch_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."discover_people"("fetch_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."enforce_single_primary_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_single_primary_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_single_primary_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."enforce_single_primary_wallet"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_single_primary_wallet"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_single_primary_wallet"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."preset_otp"() TO "anon";
GRANT ALL ON FUNCTION "public"."preset_otp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."preset_otp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_initial_token_balance"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_initial_token_balance"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_initial_token_balance"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_main_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_main_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_main_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_all_fks"("on_delete_action" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."update_all_fks"("on_delete_action" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_all_fks"("on_delete_action" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_prize_allocations"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_prize_allocations"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_prize_allocations"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."users_schedule_cleanup"() TO "anon";
GRANT ALL ON FUNCTION "public"."users_schedule_cleanup"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."users_schedule_cleanup"() TO "service_role";
























GRANT ALL ON TABLE "public"."participant_profile" TO "anon";
GRANT ALL ON TABLE "public"."participant_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."participant_profile" TO "service_role";



GRANT ALL ON TABLE "public"."participant_roles" TO "anon";
GRANT ALL ON TABLE "public"."participant_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."participant_roles" TO "service_role";



GRANT ALL ON TABLE "public"."project_team_members" TO "anon";
GRANT ALL ON TABLE "public"."project_team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."project_team_members" TO "service_role";



GRANT ALL ON TABLE "public"."user_participant_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_participant_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_participant_roles" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."discover_users_information" TO "anon";
GRANT ALL ON TABLE "public"."discover_users_information" TO "authenticated";
GRANT ALL ON TABLE "public"."discover_users_information" TO "service_role";



GRANT ALL ON TABLE "public"."discover_users_information_view" TO "anon";
GRANT ALL ON TABLE "public"."discover_users_information_view" TO "authenticated";
GRANT ALL ON TABLE "public"."discover_users_information_view" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_application_answers" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_application_answers" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_application_answers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_application_answers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_application_answers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_application_answers_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_application_questions" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_application_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_application_questions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_application_questions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_application_questions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_application_questions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_challenge_bounties" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_challenge_bounties" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_challenge_bounties" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_challenge_bounties_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_challenge_bounties_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_challenge_bounties_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_challenge_feedback" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_challenge_feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_challenge_feedback" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_challenge_feedback_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_challenge_feedback_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_challenge_feedback_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_challenges" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_challenges" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_challenges" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_challenges_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_challenges_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_challenges_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_faqs" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_faqs" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_faqs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_faqs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_faqs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_faqs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_participants" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_participants" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_participants_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_participants_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_participants_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_resources" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_resources" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_resources" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_resources_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_resources_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_resources_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_resource_challenges" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_resource_challenges" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_resource_challenges" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_resource_challenges_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_resource_challenges_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_resource_challenges_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_sessions" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_sessions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_sessions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_sessions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_sessions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_stakes" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_stakes" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_stakes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_stakes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_stakes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_stakes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_user_session_rsvp" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_user_session_rsvp" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_user_session_rsvp" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_user_session_rsvp_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_user_session_rsvp_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_user_session_rsvp_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_vip_roles" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_vip_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_vip_roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_vip_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_vip_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_vip_roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_vips" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_vips" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_vips" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_vips_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_vips_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_vips_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hackathons" TO "anon";
GRANT ALL ON TABLE "public"."hackathons" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathons" TO "service_role";



GRANT ALL ON TABLE "public"."technology_owners" TO "anon";
GRANT ALL ON TABLE "public"."technology_owners" TO "authenticated";
GRANT ALL ON TABLE "public"."technology_owners" TO "service_role";



GRANT ALL ON TABLE "public"."hackathons_discover_view" TO "anon";
GRANT ALL ON TABLE "public"."hackathons_discover_view" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathons_discover_view" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathons_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathons_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathons_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."judging_entries" TO "anon";
GRANT ALL ON TABLE "public"."judging_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."judging_entries" TO "service_role";



GRANT ALL ON SEQUENCE "public"."judging_entries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."judging_entries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."judging_entries_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."judgings" TO "anon";
GRANT ALL ON TABLE "public"."judgings" TO "authenticated";
GRANT ALL ON TABLE "public"."judgings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."judgings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."judgings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."judgings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."nonces" TO "anon";
GRANT ALL ON TABLE "public"."nonces" TO "authenticated";
GRANT ALL ON TABLE "public"."nonces" TO "service_role";



GRANT ALL ON SEQUENCE "public"."nonces_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."nonces_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."nonces_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."participant_profile_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."participant_profile_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."participant_profile_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."participant_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."participant_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."participant_roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."participant_transactions" TO "anon";
GRANT ALL ON TABLE "public"."participant_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."participant_transactions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."participant_transactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."participant_transactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."participant_transactions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."participant_wallets" TO "anon";
GRANT ALL ON TABLE "public"."participant_wallets" TO "authenticated";
GRANT ALL ON TABLE "public"."participant_wallets" TO "service_role";



GRANT ALL ON SEQUENCE "public"."participant_wallets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."participant_wallets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."participant_wallets_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."project_challenges" TO "anon";
GRANT ALL ON TABLE "public"."project_challenges" TO "authenticated";
GRANT ALL ON TABLE "public"."project_challenges" TO "service_role";



GRANT ALL ON SEQUENCE "public"."project_challenges_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."project_challenges_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."project_challenges_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."project_invitations" TO "anon";
GRANT ALL ON TABLE "public"."project_invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."project_invitations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."project_invitations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."project_invitations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."project_invitations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."project_notification_data" TO "anon";
GRANT ALL ON TABLE "public"."project_notification_data" TO "authenticated";
GRANT ALL ON TABLE "public"."project_notification_data" TO "service_role";



GRANT ALL ON SEQUENCE "public"."project_notification_data_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."project_notification_data_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."project_notification_data_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."project_team_members_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."project_team_members_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."project_team_members_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."team_up_requests" TO "anon";
GRANT ALL ON TABLE "public"."team_up_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."team_up_requests" TO "service_role";



GRANT ALL ON SEQUENCE "public"."team_up_requests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."team_up_requests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."team_up_requests_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."technology_owners_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."technology_owners_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."technology_owners_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_participant_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_participant_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_participant_roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users_discover_view" TO "anon";
GRANT ALL ON TABLE "public"."users_discover_view" TO "authenticated";
GRANT ALL ON TABLE "public"."users_discover_view" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
