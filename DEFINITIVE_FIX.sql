-- DEFINITIVE FIX FOR 406 ERRORS
-- Copy and paste this entire script into your Supabase SQL Editor
-- Project: mtwvhcupvbvvwhjwjtuq

-- ============================================
-- STEP 1: Check current state
-- ============================================
SELECT 'Current RLS policies on user_profiles:' as info;
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_profiles';

SELECT 'Current user_profiles records:' as info;
SELECT * FROM user_profiles;

-- ============================================
-- STEP 2: Temporarily disable RLS for testing
-- ============================================
SELECT 'Disabling RLS temporarily...' as info;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Drop ALL existing policies
-- ============================================
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', pol.policyname);
    END LOOP;
END $$;

-- ============================================
-- STEP 4: Create new, permissive policies
-- ============================================

-- Allow users to view their own profile
CREATE POLICY "user_profiles_select_policy" ON user_profiles
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow users to insert their own profile  
CREATE POLICY "user_profiles_insert_policy" ON user_profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "user_profiles_update_policy" ON user_profiles
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own profile (optional, for completeness)
CREATE POLICY "user_profiles_delete_policy" ON user_profiles
    FOR DELETE 
    USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: Re-enable RLS
-- ============================================
SELECT 'Re-enabling RLS with new policies...' as info;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: Verify setup
-- ============================================
SELECT 'New policies created:' as info;
SELECT policyname, cmd, permissive
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- ============================================
-- STEP 7: Grant necessary permissions
-- ============================================
GRANT ALL ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO anon;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT '✅ RLS policies have been recreated' as result;
SELECT '✅ user_profiles table is ready' as result;
SELECT 'Total policies: ' || COUNT(*)::text as result
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- ============================================
-- DIAGNOSTIC QUERY (run separately to test)
-- ============================================
-- After running the above, test with this:
-- SELECT auth.uid() as my_user_id;
-- If this returns NULL, you're not authenticated in the SQL editor
-- That's OK - the policies will work in the app where users ARE authenticated
