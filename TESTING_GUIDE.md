# 🧪 Testing Guide - Supabase Integration

## ⚠️ CRITICAL FIRST STEP: Run SQL Schema

**Before testing anything, you MUST run the database schema in Supabase:**

1. Go to https://supabase.com/dashboard
2. Select project: `lmogwfwmmtpxfdrwfjar`
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Open `supabase-schema.sql` in this project
6. Copy ALL contents (Ctrl+A, Ctrl+C)
7. Paste into Supabase SQL Editor
8. Click **Run** (or press Ctrl+Enter)
9. Wait for "Success" message

This creates:
- 6 tables (users, chat_sessions, messages, emotional_memory, sentiment_responses, daily_summaries)
- Row Level Security policies
- Indexes for performance
- Triggers for auto-updates

---

## 🎯 Test Sequence

### Test 1: Anonymous Chat (Before Authentication)

**Expected Behavior:**
- ✅ User can chat immediately without login
- ✅ Messages stored in localStorage
- ✅ Emotional memory tracked in localStorage
- ✅ Sentiment prompt appears (test mode enabled)

**Steps:**
1. Open http://localhost:3000 in **incognito/private window**
2. Wait for sanctuary arrival animation (2 seconds)
3. Wait for proactive greeting (3 seconds): "Before we begin, take a slow breath..."
4. Send 5 user messages:
   - "I'm feeling really tired today"
   - "Work has been overwhelming lately"
   - "I had a difficult meeting this morning"
   - "I feel burned out"
   - "Everything feels like too much"

**Verify:**
- ✅ Typing indicator appears after 400ms delay (manufactured thinking)
- ✅ AI responds with empathy and rhythmic language
- ✅ Voice button works (if you test it)
- ✅ Scroll position is correct
- ✅ After 1 second, emoji sentiment prompt appears with liquid glass aesthetic

---

### Test 2: Deferred Authentication Prompt

**Expected Behavior:**
- ✅ After 5th user message, wait 3 seconds
- ✅ Warm liquid glass modal appears: "Would you like me to remember this tomorrow?"
- ✅ Confession-style interface with gentle language

**Steps:**
1. After sending 5 messages, wait 3 seconds
2. Auth modal should appear automatically
3. Inspect the modal:
   - ✅ Warm amber glow backdrop
   - ✅ Liquid glass surface with blur effect
   - ✅ Heading: "Would you like me to remember this tomorrow?"
   - ✅ Subheading: "I'll keep your conversations private..."
   - ✅ Three options:
     - Email + password
     - Magic link
     - "I'm new here" switcher

---

### Test 3: Sign Up & Data Migration

**Expected Behavior:**
- ✅ User signs up
- ✅ localStorage messages automatically migrate to Supabase
- ✅ Modal closes
- ✅ Messages persist after page reload

**Steps:**
1. Fill in sign up form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
2. Click "Save my progress"
3. Wait for success

**Verify in Browser Console:**
```javascript
// Check if user is authenticated
const { data } = await supabase.auth.getSession()
console.log('User:', data.session?.user)

// Check if messages were migrated
const { data: messages } = await supabase.from('messages').select('*')
console.log('Messages in DB:', messages.length)
```

**Verify localStorage is cleared:**
```javascript
localStorage.getItem('mindpex_chat_messages') // Should be null after migration
```

---

### Test 4: Return Visit with Memory Continuity

**Expected Behavior:**
- ✅ Reload page
- ✅ User automatically signed in (session persists)
- ✅ Messages loaded from Supabase
- ✅ Proactive greeting with emotional memory: "You said you felt drained last time..."

**Steps:**
1. Reload page (Ctrl+R or F5)
2. Wait for sanctuary arrival (2s)
3. Wait for proactive greeting (3s)

**Expected Greeting:**
Should reference your previous emotional state:
- "You said you felt drained last time we talked. Did you get some rest?"
- "That meeting sounded heavy yesterday. How are you feeling today?"
- "You felt overwhelmed last time. Is today any more manageable?"

**Verify:**
- ✅ No login required (auto-authenticated)
- ✅ Previous messages visible
- ✅ Greeting shows memory continuity
- ✅ New messages save to Supabase

---

### Test 5: Sentiment Tracking Across Sessions

**Expected Behavior:**
- ✅ Sentiment responses saved to Supabase
- ✅ Weekly tracking works per user
- ✅ Data persists across devices

**Steps:**
1. Submit emoji sentiment response
2. Check Supabase dashboard:
   - Go to **Table Editor**
   - Open `sentiment_responses` table
   - Find your user's response

**Verify Data Structure:**
```sql
SELECT * FROM sentiment_responses WHERE user_id = 'your-user-id';
```

Expected columns:
- `user_id`: Your user UUID
- `question_text`: The question shown
- `sentiment`: Your response (0-4)
- `emoji`: The emoji you selected
- `week_number`: Current week
- `year`: 2025

---

### Test 6: Multi-Day Session Continuity

**Expected Behavior:**
- ✅ "You were tired on Monday" type messages
- ✅ Cross-day emotional context tracking

**Steps (Requires time travel or manual DB insert):**

**Option A: Manual DB Insert (Quick Test)**
```sql
-- Insert a memory from "yesterday"
INSERT INTO emotional_memory (user_id, topic, context, timestamp, expires_at)
VALUES (
  'your-user-id',
  'burnout',
  'I feel so exhausted and drained',
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '23 hours'
);
```

Then reload page and check if greeting mentions yesterday's state.

**Option B: Real Time Test**
1. Chat today, mention being "tired"
2. Come back tomorrow
3. Should see: "You said you felt drained yesterday..."

---

### Test 7: Sign Out & Sign Back In

**Expected Behavior:**
- ✅ Sign out clears session
- ✅ Sign in restores all data
- ✅ Messages, sentiment, memory all restored

**Steps:**
1. Add sign out button to Header.tsx (temporary):
```tsx
<button onClick={async () => {
  const { error } = await supabase.auth.signOut();
  window.location.reload();
}}>
  Sign Out
</button>
```
2. Click sign out
3. Page reloads to anonymous mode
4. Click "Sign In" in any auth modal
5. Enter same credentials
6. Verify all data restored

---

## 🔍 Debugging Tools

### Check Auth State
```javascript
// In browser console
const { data } = await supabase.auth.getSession()
console.log('Logged in:', !!data.session)
console.log('User:', data.session?.user?.email)
```

### Check Tables
```javascript
// Messages
const { data: messages } = await supabase.from('messages').select('*')
console.log('Messages:', messages)

// Emotional memory
const { data: memories } = await supabase.from('emotional_memory').select('*')
console.log('Memories:', memories)

// Sentiment
const { data: sentiment } = await supabase.from('sentiment_responses').select('*')
console.log('Sentiment:', sentiment)
```

### Check localStorage (Anonymous Mode)
```javascript
// Should only have data when NOT authenticated
localStorage.getItem('mindpex_chat_messages')
localStorage.getItem('mindpex_emotional_memory')
localStorage.getItem('mindpex_sentiment_records')
```

---

## ✅ Success Criteria

All tests pass if:

1. ✅ **Anonymous chat works** - No login barrier, instant value
2. ✅ **Auth prompt appears** - After 5 messages with gentle language
3. ✅ **Data migrates** - localStorage → Supabase seamlessly
4. ✅ **Memory continuity** - "You were tired yesterday..." greetings
5. ✅ **Sentiment persists** - Weekly tracking saved to database
6. ✅ **Session persistence** - Page reload doesn't lose auth or data
7. ✅ **Liquid glass UI** - Warm, emotional aesthetic throughout

---

## 🚨 Common Issues

### "Missing Supabase environment variables"
- Check `.env.local` exists
- Restart dev server: `npm run dev`

### "Row Level Security policy violation"
- Run SQL schema in Supabase dashboard
- Check RLS policies exist: `SHOW POLICIES`

### Auth modal doesn't appear
- Check console for errors
- Verify message count: Must be >= 10 total (5 user messages)

### Messages not persisting
- Check if user is authenticated: `supabase.auth.getSession()`
- Verify Supabase credentials in `.env.local`
- Check browser console for errors

### Emotional memory not showing
- Must wait 4-48 hours between visits
- Or manually insert test data (see Test 6)

---

## 📊 Expected Console Output

When working correctly, you should see:
```
✓ Supabase client initialized
✓ User authenticated: test@example.com
✓ Messages loaded from database: 10 messages
✓ Emotional memory found: 2 memories
✓ Migrated 10 messages to Supabase
✓ localStorage cleared after migration
```

---

## 🎨 UI/UX Checklist

- ✅ Sanctuary arrival animation (2s)
- ✅ Proactive greeting (3s delay)
- ✅ Typing delay (400ms manufactured pause)
- ✅ Breathing animations (irregular, warm)
- ✅ Liquid glass modal (warm amber, soft blur)
- ✅ Confession-style language ("Your thoughts are safe here")
- ✅ Emoji sentiment tap (liquid glass buttons)
- ✅ Scroll positioning (smooth, no over-scroll)
- ✅ Voice button (auto-stop after 2s silence)

---

## 📝 Next Steps After Testing

Once tests pass:

1. **Production Mode**: Change test mode to weekly prompts
   ```typescript
   // In useEmojiSentiment.ts
   const PROMPT_INTERVAL = 7 * 24 * 60 * 60 * 1000; // Change from 0 to this
   ```

2. **Daily Summaries**: Implement aggregation for HR integration
   ```typescript
   // Create src/utils/dailySummary.ts
   // Aggregate emotional themes, sentiment scores per day
   ```

3. **Email Verification**: Enable in Supabase dashboard
   - Go to Authentication > Settings
   - Enable "Confirm email"

4. **Magic Link**: Configure email templates
   - Go to Authentication > Email Templates
   - Customize magic link email

---

**Ready to test?** Open http://localhost:3000 and follow the test sequence! 🚀
