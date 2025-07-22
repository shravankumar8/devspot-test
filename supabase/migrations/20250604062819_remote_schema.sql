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


set check_function_bodies = off;

CREATE TRIGGER on_email_confirmed AFTER INSERT OR UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_email_confirmed();