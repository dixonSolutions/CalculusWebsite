# Database Setup Guide - Fix "Database error saving new user"

## Problem
You're getting the error: `Database error saving new user` when trying to sign in. This happens because the profiles table hasn't been created in your Supabase database yet.

## Solution

### Step 1: Apply Database Migrations

You need to run the migration files in your Supabase database. Here are three ways to do it:

#### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `dixonSolutions's Project`
3. Click on **SQL Editor** in the left sidebar
4. Create a new query and copy-paste the content of each migration file in order:

**First, run this (001_create_lessons_tables.sql):**
```sql
-- Copy the entire content from migrations/001_create_lessons_tables.sql
```

**Then run this (002_insert_lessons_data.sql):**
```sql
-- Copy the entire content from migrations/002_insert_lessons_data.sql
```

**Finally, run this (004_create_profiles_table_simple.sql):**
```sql
-- Copy the entire content from migrations/004_create_profiles_table_simple.sql
```

#### Option B: Using Database URL

If you prefer command line, use this connection string with psql:

```bash
psql "postgresql://postgres:9QPFZBgG?8PfRxJ@db.jluermnuwugppbhppcbt.supabase.co:5432/postgres"
```

Then run each migration file:
```bash
\i migrations/001_create_lessons_tables.sql
\i migrations/002_insert_lessons_data.sql
\i migrations/004_create_profiles_table_simple.sql
```

#### Option C: Manual Setup (If migrations fail)

If the automated migrations don't work, here's a minimal setup:

```sql
-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    website TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create basic policies
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
```

### Step 2: Test the Setup

1. After running the migrations, try signing in again
2. Check if the error is resolved
3. If you still get errors, check the Supabase logs:
   - Go to **Logs** section in Supabase dashboard
   - Look for any error messages

### Step 3: Verify Tables Were Created

Run this query in SQL Editor to verify tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('lessons', 'lesson_slides', 'profiles');
```

You should see all three tables listed.

### Common Issues and Solutions

#### Issue 1: "relation 'profiles' does not exist"
**Solution:** Run the profiles table migration (step 1, part 3)

#### Issue 2: "permission denied for table profiles"
**Solution:** The RLS policies weren't created properly. Run this:

```sql
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Enable read access for users based on user_id" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for users based on user_id" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON profiles
    FOR UPDATE USING (auth.uid() = id);
```

#### Issue 3: "trigger function does not exist"
**Solution:** The trigger wasn't created properly. Run this:

```sql
-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function and trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at, updated_at)
  VALUES (
    NEW.id,
    split_part(NEW.email, '@', 1),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 4: Test Authentication

1. Try signing up with a new email
2. Check your email for the magic link
3. Click the link to complete sign-in
4. Verify that a profile was created in the profiles table

## Quick Fix Command

If you want to run everything at once, copy this into Supabase SQL Editor:

```sql
-- Quick setup for profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    website TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

CREATE POLICY "Enable read access for users based on user_id" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for users based on user_id" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Optional: Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

After running this, try signing in again! 🎉 