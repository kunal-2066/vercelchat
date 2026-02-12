-- Cleanup script - Run this BEFORE supabase-schema.sql if you need to reset
-- WARNING: This deletes ALL data in the tables

-- Drop all policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can create own sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can create own messages" ON messages;
DROP POLICY IF EXISTS "Users can view own memories" ON emotional_memory;
DROP POLICY IF EXISTS "Users can create own memories" ON emotional_memory;
DROP POLICY IF EXISTS "Users can update own memories" ON emotional_memory;
DROP POLICY IF EXISTS "Users can view own sentiment" ON sentiment_responses;
DROP POLICY IF EXISTS "Users can create own sentiment" ON sentiment_responses;
DROP POLICY IF EXISTS "Users can view own summaries" ON daily_summaries;

-- Drop triggers
DROP TRIGGER IF EXISTS trigger_update_last_visit ON messages;
DROP TRIGGER IF EXISTS trigger_increment_session_messages ON messages;

-- Drop functions
DROP FUNCTION IF EXISTS cleanup_expired_memories();
DROP FUNCTION IF EXISTS update_last_visit();
DROP FUNCTION IF EXISTS increment_session_messages();

-- Drop tables (CASCADE removes dependencies)
DROP TABLE IF EXISTS daily_summaries CASCADE;
DROP TABLE IF EXISTS sentiment_responses CASCADE;
DROP TABLE IF EXISTS emotional_memory CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
