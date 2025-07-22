alter table "public"."judging_bot_scores" add column "suspicious_flags" text;

alter table "public"."judging_entries" add column "suspicious_flags" text;

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


