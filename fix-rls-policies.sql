-- Fix for 406 errors: Check and update RLS policies
-- Run this in Supabase SQL Editor

-- First, let's check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_profiles';

-- The issue might be that we have INSERT and UPDATE policies but not a combined UPSERT
-- PostgreSQL doesn't have native UPSERT policy, so we need INSERT + UPDATE

-- Drop and recreate policies with better coverage
DROP POLICY IF EXISTS "Users can insert own profile settings" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile settings" ON user_profiles;

-- Recreate INSERT policy (for new profiles)
CREATE POLICY "Users can insert own profile settings" ON user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Recreate UPDATE policy (for existing profiles)  
CREATE POLICY "Users can update own profile settings" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add DELETE policy (for completeness, though not used currently)
DROP POLICY IF EXISTS "Users can delete own profile settings" ON user_profiles;
CREATE POLICY "Users can delete own profile settings" ON user_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Verify policies are set correctly
SELECT policyname, cmd, permissive 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Check if any profiles exist
SELECT COUNT(*) as profile_count FROM user_profiles;

-- Make sure RLS is enabled (should already be)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

COMMENT ON POLICY "Users can insert own profile settings" ON user_profiles IS 
  'Allows authenticated users to create their own profile';
COMMENT ON POLICY "Users can update own profile settings" ON user_profiles IS 
  'Allows authenticated users to update their own profile';
COMMENT ON POLICY "Users can view own profile settings" ON user_profiles IS 
  'Allows authenticated users to view their own profile';
