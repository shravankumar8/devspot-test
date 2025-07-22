create type "public"."project_code_type" as enum ('fresh_code', 'existing_code');

revoke delete on table "public"."pending_invitations" from "anon";

revoke insert on table "public"."pending_invitations" from "anon";

revoke references on table "public"."pending_invitations" from "anon";

revoke select on table "public"."pending_invitations" from "anon";

revoke trigger on table "public"."pending_invitations" from "anon";

revoke truncate on table "public"."pending_invitations" from "anon";

revoke update on table "public"."pending_invitations" from "anon";

revoke delete on table "public"."pending_invitations" from "authenticated";

revoke insert on table "public"."pending_invitations" from "authenticated";

revoke references on table "public"."pending_invitations" from "authenticated";

revoke select on table "public"."pending_invitations" from "authenticated";

revoke trigger on table "public"."pending_invitations" from "authenticated";

revoke truncate on table "public"."pending_invitations" from "authenticated";

revoke update on table "public"."pending_invitations" from "authenticated";

revoke delete on table "public"."pending_invitations" from "service_role";

revoke insert on table "public"."pending_invitations" from "service_role";

revoke references on table "public"."pending_invitations" from "service_role";

revoke select on table "public"."pending_invitations" from "service_role";

revoke trigger on table "public"."pending_invitations" from "service_role";

revoke truncate on table "public"."pending_invitations" from "service_role";

revoke update on table "public"."pending_invitations" from "service_role";

alter table "public"."hackathon_challenge_feedback" drop constraint "hackathon_challenge_feedback_project_id_fkey";

alter table "public"."hackathon_challenge_feedback" drop column "project_id";

alter table "public"."hackathon_challenge_feedback" add column "user_id" uuid not null default gen_random_uuid();

alter table "public"."hackathon_resources" add column "challenge_id" integer;

alter table "public"."hackathons" add column "registration_start_date" date;

alter table "public"."hackathons" add column "submission_start_date" date;

alter table "public"."judging_challenges" add column "is_winner_assigner" boolean not null;

alter table "public"."judging_challenges" alter column "created_at" set default now();

alter table "public"."projects" add column "project_code_type" project_code_type;

CREATE UNIQUE INDEX uq_hackathon_challenge_user ON public.hackathon_challenge_feedback USING btree (hackathon_id, challenge_id, user_id);

alter table "public"."hackathon_challenge_feedback" add constraint "hackathon_challenge_feedback_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."hackathon_challenge_feedback" validate constraint "hackathon_challenge_feedback_user_id_fkey";

alter table "public"."hackathon_challenge_feedback" add constraint "uq_hackathon_challenge_user" UNIQUE using index "uq_hackathon_challenge_user";

alter table "public"."hackathon_resources" add constraint "hackathon_resources_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES hackathon_challenges(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."hackathon_resources" validate constraint "hackathon_resources_challenge_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_email_confirmed()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  -- If it's still NULL, the user hasn't verified their email yet.
  IF NEW.email_confirmed_at IS NOT NULL THEN

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


    -- Update public.user's role to judge
    UPDATE public.users AS u
    SET
      role_id = 3,
      updated_at = NOW()
    WHERE
      u.id = NEW.id;


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
AS $function$begin
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
end;$function$
;


