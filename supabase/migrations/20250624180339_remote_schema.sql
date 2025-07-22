
alter table "public"."global_hackathon_feedback" drop constraint "global_hackathon_feedback_user_id_fkey";

alter table "public"."judging_bot_scores" add column "ai_judged" boolean not null default false;

alter table "public"."judging_bot_scores" add column "flagged_comments" text;

alter table "public"."judging_bot_scores" alter column "business_feedback" set default '""'::text;

alter table "public"."judging_bot_scores" alter column "business_score" set default '0'::numeric;

alter table "public"."judging_bot_scores" alter column "business_summary" set default '""'::text;

alter table "public"."judging_bot_scores" alter column "general_comments" set default '""'::text;

alter table "public"."judging_bot_scores" alter column "general_comments_summary" set default '""'::text;

alter table "public"."judging_bot_scores" alter column "innovation_feedback" set default '""'::text;

alter table "public"."judging_bot_scores" alter column "innovation_score" set default '0'::numeric;

alter table "public"."judging_bot_scores" alter column "innovation_summary" set default '""'::text;

alter table "public"."judging_bot_scores" alter column "score" set default '0'::numeric;

alter table "public"."judging_bot_scores" alter column "technical_feedback" set default '""'::text;

alter table "public"."judging_bot_scores" alter column "technical_score" set default '0'::numeric;

alter table "public"."judging_bot_scores" alter column "technical_summary" set default '""'::text;

alter table "public"."judging_bot_scores" alter column "ux_feedback" set default '""'::text;

alter table "public"."judging_bot_scores" alter column "ux_score" set default '0'::numeric;

alter table "public"."judging_bot_scores" alter column "ux_summary" set default '""'::text;

alter table "public"."judging_entries" add column "judging_bot_scores_id" integer;

CREATE UNIQUE INDEX judging_bot_scores_project_challenge_unique ON public.judging_bot_scores USING btree (project_id, challenge_id);

alter table "public"."judging_bot_scores" add constraint "judging_bot_scores_project_challenge_unique" UNIQUE using index "judging_bot_scores_project_challenge_unique";

alter table "public"."judging_entries" add constraint "judging_entries_judging_bot_scores_id_fkey" FOREIGN KEY (judging_bot_scores_id) REFERENCES judging_bot_scores(id) not valid;

alter table "public"."judging_entries" validate constraint "judging_entries_judging_bot_scores_id_fkey";

alter table "public"."global_hackathon_feedback" add constraint "global_hackathon_feedback_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."global_hackathon_feedback" validate constraint "global_hackathon_feedback_user_id_fkey";

set check_function_bodies = off;

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

CREATE OR REPLACE FUNCTION public.handle_email_confirmed()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$BEGIN
  -- If it's still NULL, the user hasn't verified their email yet.
  IF NEW.email_confirmed_at IS NOT NULL THEN

    -- If user is a TO
    -- Add Project Manager role for TOs
    IF (NEW.raw_user_meta_data->>'role_id')::int = 5 THEN 
      INSERT INTO "public"."user_participant_roles" (
        role_id, 
        is_primary,
        created_at,
        updated_at,
        participant_id
      ) VALUES (
        3,
        TRUE,
        NOW(),
        NOW(),
        NEW.id
      )
      ON CONFLICT (participant_id) WHERE is_primary
      DO NOTHING;
    END IF;

      -- Add to public.hackathon_vips table (can be single/multiple invitation(s))
    INSERT INTO public.hackathon_vips (
      hackathon_id, 
      user_id,
      status, 
      created_at, 
      updated_at
    ) 
    SELECT
    pi.hackathon_id,
    NEW.id,
    'accepted',
    NOW(),
    NOW()
    FROM public.pending_invitations AS pi
    WHERE
      pi.email = NEW.email
      AND pi.role = 'judge'
      AND pi.invitation_status = 'pending'
    ON CONFLICT (hackathon_id, user_id) DO NOTHING;


    -- Add to public.judgings table
    INSERT INTO public.judgings (
      hackathon_id, 
      user_id,
      is_submitted,
      created_at, 
      updated_at
    ) 
    SELECT
    pi.hackathon_id,
    NEW.id,
    false,
    NOW(),
    NOW()
    FROM public.pending_invitations AS pi
    WHERE
      pi.email = NEW.email
      AND pi.role = 'judge'
      AND pi.invitation_status = 'pending'
    ON CONFLICT (hackathon_id, user_id) DO NOTHING;

    
    -- Add to public.hackathon_participants table
    INSERT INTO public.judgings (
      hackathon_id, 
      user_id,
      is_submitted,
      created_at, 
      updated_at
    ) 
    SELECT
    pi.hackathon_id,
    NEW.id,
    false,
    NOW(),
    NOW()
    FROM public.pending_invitations AS pi
    WHERE
      pi.email = NEW.email
      AND pi.role = 'judge'
      AND pi.invitation_status = 'pending'
    ON CONFLICT (hackathon_id, user_id) DO NOTHING;


    -- Update public.user's role to judge
    UPDATE public.users AS u
    SET 
      role_id = 3,
      updated_at = NOW()
    FROM 
      public.pending_invitations pi
    WHERE 
      u.email = pi.email
    AND 
      pi.invitation_status = 'pending';


      -- Update invitation_status
    UPDATE public.pending_invitations AS pi
    SET
      invitation_status = 'accepted',
      updated_at = NOW()
    WHERE
      pi.email = NEW.email
      AND pi.role  = 'judge'
      AND pi.invitation_status = 'pending';


    

  END IF;

  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    full_name,
    role_id
  ) values (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'role_id')::int, 1)
  );

  RETURN NEW;
END;$function$
;

CREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.judging_bot_scores FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.judging_entries FOR EACH ROW EXECUTE FUNCTION set_updated_at();


