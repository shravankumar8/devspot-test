alter table "public"."judging_bot_scores" drop column "flagged_comments";

alter table "public"."judging_bot_scores" add column "flagged_reason" text;


