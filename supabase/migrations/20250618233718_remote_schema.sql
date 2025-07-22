alter table "public"."users" add column "display_wallet_id" boolean not null default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_participant_profile()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    INSERT INTO public.participant_profile (participant_id)
    VALUES (NEW.id);
    RETURN NEW;
END;$function$
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


