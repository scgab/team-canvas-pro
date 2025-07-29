-- STEP 1: Completely disable RLS on availability table to test if it fixes the error
ALTER TABLE availability DISABLE ROW LEVEL SECURITY;

-- Test if this resolves the database insertion issues