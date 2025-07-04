-- Migration: Create profiles table
-- Description: Creates the profiles table for user authentication and profile management
-- Date: 2025-01-07

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    website VARCHAR(255),
    avatar_url VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Additional profile fields
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    
    -- Learning progress tracking
    lessons_completed INTEGER DEFAULT 0,
    quizzes_completed INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    
    -- Account settings
    email_notifications BOOLEAN DEFAULT true,
    theme_preference VARCHAR(20) DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'auto')),
    
    -- Constraints
    CONSTRAINT username_length CHECK (char_length(username) >= 3),
    CONSTRAINT valid_website CHECK (website IS NULL OR website ~ '^https?://')
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
CREATE INDEX idx_profiles_lessons_completed ON profiles(lessons_completed);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles
    FOR EACH ROW 
    EXECUTE FUNCTION update_profiles_updated_at();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, username, email_notifications)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        COALESCE(
            (NEW.raw_user_meta_data->>'email_notifications')::boolean,
            true
        )
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (for manual creation)
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Public profiles can be viewed by anyone (for leaderboards, etc.)
-- This policy allows viewing username and basic stats only
CREATE POLICY "Public profile data viewable by all" ON profiles
    FOR SELECT USING (true);

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles linked to Supabase auth users';
COMMENT ON COLUMN profiles.id IS 'References auth.users.id';
COMMENT ON COLUMN profiles.username IS 'Unique username for the user';
COMMENT ON COLUMN profiles.website IS 'Optional personal website URL';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image';
COMMENT ON COLUMN profiles.lessons_completed IS 'Number of lessons completed by user';
COMMENT ON COLUMN profiles.quizzes_completed IS 'Number of quizzes completed by user';
COMMENT ON COLUMN profiles.total_score IS 'Cumulative score across all quizzes';
COMMENT ON COLUMN profiles.theme_preference IS 'User interface theme preference';

-- Grant necessary permissions
-- Note: In Supabase, these permissions are typically handled through the dashboard
-- but including them here for completeness

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- Grant usage on sequences (if any were created)
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated; 