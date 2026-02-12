# Supabase 406 Error Troubleshooting Guide

## Problem Summary
You're seeing **406 (Not Acceptable)** errors when trying to save settings. This indicates a **Row Level Security (RLS) policy issue** or authentication problem.

## Root Causes (in order of likelihood)

### 1. **RLS Policy Blocking Writes** (Most Likely)
- Supabase has Row Level Security enabled on `user_profiles`
- RLS policies check if `auth.uid() = user_id`
- If the authenticated user's ID doesn't match, write is blocked
- PostgREST returns 406 when it can't return data after an upsert

### 2. **Authentication Token Issue**
- User session may be expired or invalid
- JWT token not being sent correctly
- User logged in but token not persisted

### 3. **Database Schema Mismatch**
- `user_profiles` table may not exist
- Schema may not match expected structure

## Diagnostic Steps

### Step 1: Check the Browser Console
Open your chatbot and look for the new diagnostic output:

```
=== SUPABASE DIAGNOSTIC ===
```

This will tell you:
- ✅ or ⚠️  Auth state (logged in or not)
- ✅ or ❌ Database connectivity
- ✅ or ❌ Write permissions

### Step 2: Run in Browser Console
Open DevTools Console and run:
```javascript
window.supabaseDiagnostic()
```

### Step 3: Check Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: `mtwvhcupvbvvwhjwjtuq`
3. Go to **Authentication** → **Users**
   - Verify your test user exists
   - Check the user's ID matches what you're trying to save
4. Go to **Table Editor** → `user_profiles`
   - Check if table exists
   - Check if any rows exist
5. Go to **SQL Editor** and run:
   ```sql
   -- Check RLS policies
   SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
   
   -- Check if you can select
   SELECT * FROM user_profiles LIMIT 5;
   ```

## Solutions

### Solution 1: Fix RLS Policies (Run in Supabase SQL Editor)

Run the provided `fix-rls-policies.sql` file:

```bash
# Or copy/paste this into Supabase SQL Editor:
```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own profile settings" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile settings" ON user_profiles;

-- Recreate with proper permissions
CREATE POLICY "Users can insert own profile settings" ON user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile settings" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Solution 2: Verify Authentication

In the chatbot:
1. Sign out completely
2. Clear browser localStorage: 
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   ```
3. Hard refresh (Ctrl+Shift+R)
4. Sign in again
5. Try saving settings

### Solution 3: Test with Anon Key Temporarily (DEBUG ONLY)

**⚠️ SECURITY WARNING: Only for testing! Remove after debugging!**

Temporarily disable RLS to test if that's the issue:

```sql
-- In Supabase SQL Editor - TEMPORARY ONLY
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
```

Try saving settings. If it works, the issue is RLS policies.

Then re-enable:
```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

### Solution 4: Check User ID Matches

The user ID in the session must match the `user_id` being inserted:

```javascript
// Run in browser console
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user ID:', user?.id)

// Try manual insert
const { data, error } = await supabase
  .from('user_profiles')
  .upsert({
    user_id: user.id,
    nickname: 'Test',
    updated_at: new Date().toISOString()
  })
  .select()

console.log('Result:', { data, error })
```

## Expected Behavior

After fixes, you should see:
```
✅ Settings saved successfully!
```

In console:
```
✅ Active session confirmed
✅ Upsert result - data: [...]
✅ Settings saved successfully
```

## Still Not Working?

### Check Network Tab
1. Open DevTools → Network tab
2. Filter for "user_profiles"
3. Click the failed 406 request
4. Check:
   - Request Headers (Authorization header present?)
   - Response body (any error details?)
   - Request payload (user_id correct?)

### Enable Supabase Logging
In `src/utils/supabaseClient.ts`:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    debug: true  // Add this
  },
  global: {
    headers: {
      'X-Client-Info': 'mindpex-chatbot'  // Add this for tracking
    }
  }
})
```

## Quick Test Commands

Run these in browser console after loading the app:

```javascript
// 1. Check auth
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session ? '✅ Active' : '❌ None')

// 2. Check user
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user?.email || '❌ Not logged in')

// 3. Test select
const { data, error } = await supabase.from('user_profiles').select('*').limit(1)
console.log('SELECT:', error ? `❌ ${error.message}` : `✅ ${data.length} rows`)

// 4. Test insert (only if logged in)
if (user) {
  const { data, error } = await supabase.from('user_profiles').upsert({
    user_id: user.id,
    nickname: 'Console Test',
    updated_at: new Date().toISOString()
  }).select()
  console.log('UPSERT:', error ? `❌ ${error.message}` : `✅ Success`)
}
```

## Need Help?

If still stuck, provide:
1. Output from `window.supabaseDiagnostic()`
2. Network tab screenshot of 406 error
3. Supabase project URL
4. Whether user is logged in (email)
5. Output from pg_policies query
