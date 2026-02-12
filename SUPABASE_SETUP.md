# Setup Instructions for Mindpex Supabase Integration

## ⚠️ CRITICAL: Database Setup Required

**The application now requires Supabase tables to be created before use.** All localStorage fallbacks have been removed. Follow the steps below carefully.

## Step 1: Run Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `lmogwfwmmtpxfdrwfjar`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the `supabase-schema.sql` file in this project
6. Copy the **ENTIRE** contents and paste into the SQL Editor
7. Click **Run** to execute the schema

This will create:
- `user_profiles` table - User settings (nickname, sound, notifications)
- `users` table - User profiles and visit tracking
- `chat_sessions` table - Daily conversation sessions
- `messages` table - Individual chat messages (ALL MESSAGES NOW STORED HERE)
- `emotional_memory` table - 24-hour emotional context
- `sentiment_responses` table - Weekly emoji sentiment data
- `daily_summaries` table - Daily insights for HR integration
- Row Level Security (RLS) policies for data privacy
- Indexes for performance
- Triggers for auto-updating metadata

## Step 2: Verify Tables Were Created

After running the SQL, verify in Supabase Dashboard → Table Editor that all 7 tables exist:
✅ user_profiles
✅ users
✅ chat_sessions
✅ messages
✅ emotional_memory
✅ sentiment_responses
✅ daily_summaries

## Step 3: Verify Environment Variables

Ensure your `.env.local` file has:
```
VITE_SUPABASE_URL=https://lmogwfwmmtpxfdrwfjar.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Start Development Server

```powershell
npm run dev
```

## What Changed - Full Supabase Integration

### ✅ Now Using Supabase For:
- **All chat messages** - Persist across devices and sessions
- **User settings** - Nickname, preferences stored in user_profiles
- **Emotional memory** - Context tracking in emotional_memory table
- **Session management** - Daily conversation grouping

### ❌ Removed:
- All localStorage fallbacks
- Temporary bypass code for message saving
- Debug console logs in Settings and Header

### 🔐 Authentication Required:
- Users must sign in before sending messages
- No anonymous chatting (authentication triggers on first message attempt)
- All data protected by Row Level Security (users only see their own data)

## How It Works - Authentication Flow
   - "I'm new here" / "I already have an account" switchers

### Post-Authentication Benefits
7. **Session continuity**: "You were tired yesterday. How are you feeling now?"
8. **Cross-device sync**: Same conversations on phone/laptop
9. **Weekly sentiment tracking**: Emoji sentiment data saved per user
10. **Daily summaries**: Emotional insights for HR integration (future)

## Psychological Design Principles Applied

1. **Remove friction before extraction** - Experience value first, commit later
2. **Frame as care, not transaction** - "Would you like me to remember?" not "Sign up now"
3. **Confession-style intimacy** - Warm liquid glass, gentle language
4. **Manufactured thinking delay** - 400ms pause creates illusion of care
5. **Memory continuity** - "You mentioned burnout yesterday..." creates dependency
6. **Variable rewards** - Different sentiment questions each week
7. **Proactive behavior** - Bot speaks first on return visits

## Data Flow

### Anonymous Mode
- Messages → localStorage
- Emotional memory → localStorage
- Sentiment responses → localStorage

### Authenticated Mode
- Messages → Supabase `messages` table
- Emotional memory → Supabase `emotional_memory` table
- Sentiment responses → Supabase `sentiment_responses` table
- **Migration**: localStorage data automatically migrated to Supabase on first login

## Testing the Flow

1. **Anonymous chat**: Open in incognito, send 5 messages
2. **Auth prompt**: Should appear after 5th user message with 3s delay
3. **Sign up**: Use test email, see data persist
4. **Return visit**: Reload page, see proactive greeting with memory
5. **Multi-day**: Come back tomorrow, see "You were tired yesterday" message

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Email validation**: Regex pattern enforced at database level
- **Encrypted storage**: Supabase handles encryption at rest
- **Anon key safe**: VITE_SUPABASE_ANON_KEY is safe for client-side (protected by RLS)

## Future HR Integration

The `daily_summaries` table is prepared for:
- Aggregated emotional themes per user per day
- Sentiment score tracking (-1.0 to 1.0)
- Conversation metrics (message count, duration)
- AI-generated summary text

This will enable:
- Team emotional health dashboards
- Early burnout detection
- Proactive manager interventions
- Anonymized org-wide trends

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists
- Restart dev server after adding env vars

### "Row Level Security policy violation"
- User is not authenticated
- Check auth state in browser DevTools

### Messages not persisting
- Check browser console for Supabase errors
- Verify RLS policies are created
- Check user session: `await supabase.auth.getSession()`

### Migration not working
- Check localStorage has data: `localStorage.getItem('mindpex_chat_messages')`
- Ensure user is authenticated before migration
- Check console for migration logs
