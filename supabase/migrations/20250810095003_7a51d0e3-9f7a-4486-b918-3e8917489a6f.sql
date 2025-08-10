-- Allow invited users to view and accept their invitations
-- SELECT policy for invited users
CREATE POLICY "Invited users can view their invitations"
ON public.team_invitations
FOR SELECT
USING (email = auth.email());

-- UPDATE policy for invited users to accept invitations
CREATE POLICY "Invited users can accept their invitations"
ON public.team_invitations
FOR UPDATE
USING (email = auth.email())
WITH CHECK (email = auth.email());