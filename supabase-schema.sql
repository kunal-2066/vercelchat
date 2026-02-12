-- Mindpex Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles - stores user preferences and settings
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  
  -- User preferences
  nickname TEXT,
  sound_enabled BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT nickname_length CHECK (char_length(nickname) <= 30)
);

-- Users table - stores user identity and visit tracking
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_name TEXT,
  
  -- Psychological metadata (Rory Sutherland principle: track attachment signals)
  first_message_at TIMESTAMP WITH TIME ZONE,
  total_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  
  CONSTRAINT email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Chat sessions - groups messages into conversations
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Session metadata for continuity
  session_date DATE DEFAULT CURRENT_DATE,
  message_count INTEGER DEFAULT 0,
  
  -- Index for fast user queries
  CONSTRAINT unique_user_session_date UNIQUE (user_id, session_date)
);

-- Messages - stores individual chat messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata
  token_count INTEGER,
  
  -- Indexes for fast queries
  CONSTRAINT valid_role CHECK (role IN ('user', 'assistant'))
);

-- Emotional memory - tracks emotional topics across sessions
CREATE TABLE IF NOT EXISTS emotional_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Emotional context (from emotionalMemory.ts categories)
  topic TEXT NOT NULL CHECK (topic IN ('work_meeting', 'burnout', 'isolation', 'conflict', 'overwhelm', 'other')),
  context TEXT NOT NULL,
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- For continuity messages ("You mentioned this yesterday...")
  referenced_at TIMESTAMP WITH TIME ZONE
);

-- Sentiment responses - emoji sentiment tap tracking
CREATE TABLE IF NOT EXISTS sentiment_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Question metadata
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  category TEXT NOT NULL,
  
  -- Response data
  sentiment TEXT NOT NULL,
  emoji TEXT NOT NULL,
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  
  -- Ensure one response per week per user
  CONSTRAINT unique_user_week UNIQUE (user_id, year, week_number)
);

-- Daily summaries - aggregated insights for HR integration (future)
CREATE TABLE IF NOT EXISTS daily_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  summary_date DATE NOT NULL,
  
  -- Emotional insights
  dominant_emotion TEXT,
  sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
  emotional_topics TEXT[], -- Array of topics discussed
  
  -- Conversation metrics
  message_count INTEGER DEFAULT 0,
  avg_message_length INTEGER,
  session_duration_minutes INTEGER,
  
  -- AI-generated summary
  summary_text TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_date UNIQUE (user_id, summary_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_emotional_memory_user ON emotional_memory(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_emotional_memory_expires ON emotional_memory(expires_at);
CREATE INDEX IF NOT EXISTS idx_sentiment_user_week ON sentiment_responses(user_id, year, week_number);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id, session_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_user ON daily_summaries(user_id, summary_date DESC);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentiment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile settings" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile settings" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile settings" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
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

-- User profiles table policies
CREATE POLICY "Users can view own profile settings" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile settings" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile settings" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Chat sessions policies
CREATE POLICY "Users can view own sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Emotional memory policies
CREATE POLICY "Users can view own memories" ON emotional_memory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own memories" ON emotional_memory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memories" ON emotional_memory
  FOR UPDATE USING (auth.uid() = user_id);

-- Sentiment responses policies
CREATE POLICY "Users can view own sentiment" ON sentiment_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sentiment" ON sentiment_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sentiment responses policies (read-only for users, written by server function)
CREATE POLICY "Users can view own summaries" ON daily_summaries
  FOR SELECT USING (auth.uid() = user_id);

-- Drop existing triggers first (before dropping functions)
DROP TRIGGER IF EXISTS trigger_update_last_visit ON messages;
DROP TRIGGER IF EXISTS trigger_increment_session_messages ON messages;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS cleanup_expired_memories();
DROP FUNCTION IF EXISTS update_last_visit() CASCADE;
DROP FUNCTION IF EXISTS increment_session_messages() CASCADE;

-- Function to clean up expired emotional memories (runs via pg_cron or trigger)
CREATE OR REPLACE FUNCTION cleanup_expired_memories()
RETURNS void AS $$
BEGIN
  DELETE FROM emotional_memory
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user's last_visit
CREATE OR REPLACE FUNCTION update_last_visit()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET last_visit = NOW(),
      total_messages = total_messages + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update last_visit when user sends message
CREATE TRIGGER trigger_update_last_visit
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_last_visit();

-- Function to increment session message count
CREATE OR REPLACE FUNCTION increment_session_messages()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET message_count = message_count + 1
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-increment message count
CREATE TRIGGER trigger_increment_session_messages
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_session_messages();

COMMENT ON TABLE users IS 'User profiles with visit tracking and attachment signals';
COMMENT ON TABLE chat_sessions IS 'Conversation sessions grouped by day';
COMMENT ON TABLE messages IS 'Individual chat messages with role and content';
COMMENT ON TABLE emotional_memory IS '24-hour emotional context for continuity';
COMMENT ON TABLE sentiment_responses IS 'Weekly emoji sentiment tap responses';
COMMENT ON TABLE daily_summaries IS 'Daily emotional insights for HR integration';
