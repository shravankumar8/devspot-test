-- restore full rights for your server
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON TABLE public.pending_invitations
  TO service_role;

-- allow logged-in users (via whatever RLS policies you’ve defined)
GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.pending_invitations
  TO authenticated;

-- allow logged-in users (via whatever RLS policies you’ve defined)
GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.pending_invitations
  TO anon;