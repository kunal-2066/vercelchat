# Quick Verification Script

## Run these commands in your browser console AFTER completing Supabase setup

### 1. Check if tables exist
```javascript
// Open browser console (F12) after signing in
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .limit(1);

console.log('user_profiles check:', error ? '❌ NOT CREATED' : '✅ EXISTS');
```

### 2. Check all tables at once
```javascript
const tables = [
  'user_profiles',
  'users', 
  'chat_sessions',
  'messages',
  'emotional_memory',
  'sentiment_responses',
  'daily_summaries'
];

for (const table of tables) {
  const { error } = await supabase.from(table).select('id').limit(1);
  console.log(`${table}: ${error ? '❌' : '✅'}`);
}
```

### 3. Verify your user profile exists
```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user?.email);

const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', user.id)
  .single();

console.log('Your profile:', data);
console.log('Error:', error);
```

### 4. Check message persistence
```javascript
// Send a test message through the UI, then run:
const { data: { user } } = await supabase.auth.getUser();

const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('user_id', user.id)
  .order('timestamp', { ascending: false })
  .limit(5);

console.log('Recent messages:', data);
console.log('Message count:', data?.length);
```

### Expected Results

✅ **All tables should return no error**
✅ **user_profiles should have your nickname (if set)**
✅ **messages should show your recent chat**

❌ **If you see "relation does not exist"** → Run the SQL schema
❌ **If you see "permission denied"** → RLS policies missing, re-run schema
