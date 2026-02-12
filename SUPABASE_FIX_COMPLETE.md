# 🔧 Supabase 406 Error - Complete Solution

## Problem
Your chatbot shows **406 (Not Acceptable)** errors and **save timeout** when trying to save settings to Supabase.

## Root Cause
**Row Level Security (RLS) policies** on the `user_profiles` table are either:
1. Not configured correctly for INSERT/UPDATE operations
2. Blocking authenticated users due to policy mismatch
3. The auth token isn't being passed correctly to Supabase

## The 406 Error Explained
- PostgREST (Supabase's API layer) returns 406 when:
  - An UPSERT operation completes
  - BUT the RLS policy blocks the SELECT that follows
  - So it can't return the data you requested with `.select()`

## ✅ Solution (Step-by-Step)

### STEP 1: Run the SQL Fix in Supabase

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Select project `mtwvhcupvbvvwhjwjtuq`
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `DEFINITIVE_FIX.sql`
6. Click **Run** (or press Ctrl+Enter)

This will:
- ✅ Remove all existing RLS policies
- ✅ Create new, correctly configured policies
- ✅ Grant proper permissions
- ✅ Re-enable RLS with working policies

### STEP 2: Test the Fix

#### Option A: Using the Diagnostic Tool (Recommended)

1. Open your chatbot in the browser
2. Open DevTools Console (F12)
3. Look for the diagnostic output:
   ```
   === SUPABASE DIAGNOSTIC ===
   ```
4. Check for:
   - ✅ Active session found
   - ✅ User object available
   - ✅ SELECT works
   - ✅ UPSERT successful

#### Option B: Manual Test

1. In your chatbot, make sure you're logged in as `jowinjoshikk@gmail.com`
2. Click Settings (gear icon)
3. Change your nickname to "Test"
4. Click "Save Changes"
5. You should see: **"✅ Settings saved successfully!"**

### STEP 3: Verify in Database

1. Go to Supabase Dashboard → **Table Editor**
2. Select `user_profiles` table
3. You should see a new row with your user_id and nickname

## 📊 What the Fix Does

### Before (Broken):
```sql
-- Old policy might have been missing or misconfigured
-- Causing auth.uid() checks to fail
```

### After (Fixed):
```sql
-- Clear, explicit policies for each operation:

SELECT: auth.uid() = user_id  -- ✅ Can read own data
INSERT: auth.uid() = user_id  -- ✅ Can create own profile  
UPDATE: auth.uid() = user_id  -- ✅ Can update own profile
DELETE: auth.uid() = user_id  -- ✅ Can delete own profile
```

## 🔍 How to Verify It's Working

### In Browser Console:
```javascript
// Should show active session
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// Should show your user
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user.email)

// Should work without errors
const { data, error } = await supabase
  .from('user_profiles')
  .upsert({
    user_id: user.id,
    nickname: 'Browser Test',
    updated_at: new Date().toISOString()
  })
  .select()

console.log('Result:', { data, error })
// Should show: data: [...], error: null
```

### In Network Tab:
1. Open DevTools → Network
2. Filter: "user_profiles"
3. Try saving settings
4. Click the request
5. **Before fix**: Status 406, no data returned
6. **After fix**: Status 200 or 201, data returned

## 🐛 If Still Not Working

### Check 1: Are you logged in?
```javascript
// Run in console
const { data: { user } } = await supabase.auth.getUser()
console.log(user ? `✅ Logged in as ${user.email}` : '❌ Not logged in')
```

If not logged in:
1. Sign out completely
2. Clear browser data: `localStorage.clear(); sessionStorage.clear()`
3. Refresh page (Ctrl+Shift+R)
4. Sign in again

### Check 2: Is the session valid?
```javascript
const { data: { session } } = await supabase.auth.getSession()
console.log('Session expires:', new Date(session.expires_at * 1000))
```

If expired, sign out and sign in again.

### Check 3: Verify RLS policies were applied
In Supabase SQL Editor, run:
```sql
SELECT policyname, cmd, permissive 
FROM pg_policies 
WHERE tablename = 'user_profiles';
```

Should show 4 policies:
- `user_profiles_select_policy` (SELECT)
- `user_profiles_insert_policy` (INSERT)
- `user_profiles_update_policy` (UPDATE)
- `user_profiles_delete_policy` (DELETE)

### Check 4: Test without RLS (TEMPORARY DEBUG ONLY)
```sql
-- In Supabase SQL Editor
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
```

Try saving settings. If it works now, the issue is definitely RLS policies.

Re-enable:
```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

## 📝 Expected Console Output (Success)

```
Saving settings for user: <user-id>
User object: { id: '...', email: '...', ... }
Active session confirmed for user: <user-id>
Upserting data: { user_id: '...', nickname: '...', ... }
Supabase call completed in: 234 ms
Upsert result - data: [{...}], error: null
✅ Settings saved successfully
```

## 🚨 Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| `Permission denied` | RLS policy blocking | Run DEFINITIVE_FIX.sql |
| `JWT expired` | Session expired | Sign out and sign in again |
| `Auth session missing` | Not logged in | Sign in |
| `relation does not exist` | Table not created | Run supabase-schema.sql |
| `406 Not Acceptable` | RLS blocking SELECT after upsert | Run DEFINITIVE_FIX.sql |

## 📋 Checklist

- [ ] Ran `DEFINITIVE_FIX.sql` in Supabase SQL Editor
- [ ] Verified 4 policies exist in pg_policies
- [ ] Logged in as a user in the chatbot
- [ ] Opened DevTools Console
- [ ] Checked diagnostic output shows active session
- [ ] Tried saving settings
- [ ] Saw "✅ Settings saved successfully!"
- [ ] Verified data in Supabase Table Editor

## 🎯 Next Steps After Fix

1. **Remove diagnostic logging** (optional):
   - Remove `import './diagnostic'` from `src/main.tsx`
   - Remove excessive console.logs from Settings.tsx

2. **Test other database operations**:
   - Send a chat message (tests messages table)
   - Check if messages persist after refresh

3. **Monitor for other RLS issues**:
   - Check messages table policies
   - Check chat_sessions table policies  
   - Check emotional_memory table policies

All tables should have similar policies: `auth.uid() = user_id`

## 💡 Prevention

To avoid this in the future:

1. **Always test RLS policies** after creating tables
2. **Use this test pattern** in SQL Editor:
   ```sql
   -- Test SELECT
   SELECT * FROM table_name WHERE user_id = auth.uid();
   
   -- Test INSERT
   INSERT INTO table_name (user_id, ...) VALUES (auth.uid(), ...);
   ```

3. **Check policy syntax**:
   - `FOR SELECT USING (...)` - read permission
   - `FOR INSERT WITH CHECK (...)` - create permission  
   - `FOR UPDATE USING (...) WITH CHECK (...)` - update permission
   - BOTH conditions must be true for UPDATE

4. **Enable Supabase logs** in dashboard to catch policy violations early

## 📞 Still Need Help?

If the fix doesn't work, provide:

1. Output from `window.supabaseDiagnostic()`
2. Result of the pg_policies query
3. Screenshot of Network tab showing the 406 error
4. Your user email
5. Whether you can see your user in Supabase Dashboard → Authentication

---

**Created**: 2025-12-20  
**Project**: Mindpex Chatbot  
**Supabase Project**: mtwvhcupvbvvwhjwjtuq
