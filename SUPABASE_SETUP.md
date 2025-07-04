# Supabase Integration Setup

This document outlines the Supabase integration setup for the Master Calculus Angular application.

## Configuration Files

### 1. Supabase Configuration (`supabase-config.json`)
Contains all Supabase project credentials and settings:
- Project ID: `jeytapokgdhvxydboixp`
- Project URL: `https://jeytapokgdhvxydboixp.supabase.co`
- Anonymous Key (for client-side operations)
- Service Role Key (for server-side operations)
- JWT Secret (for token verification)

### 2. Environment Configuration
Updated both `environment.ts` and `environment.prod.ts` with Supabase settings:
```typescript
supabase: {
  url: 'https://jeytapokgdhvxydboixp.supabase.co',
  anonKey: 'your-anon-key-here'
}
```

## Components Created

### 1. SupabaseService (`src/app/services/supabase.service.ts`)
Main service for Supabase operations:
- Authentication (sign in/out with magic links)
- User profile management
- Session handling
- Database operations

### 2. SignInComponent (`src/app/components/sign-in/`)
Handles user authentication:
- Email-based magic link authentication
- Loading states
- Error handling

### 3. AccountComponent (`src/app/components/account/`)
User profile management:
- Display user email
- Update username and website
- Sign out functionality

### 4. SupabaseDemoComponent (`src/app/components/supabase-demo/`)
Main demo component that orchestrates authentication flow:
- Shows SignIn component when not authenticated
- Shows Account component when authenticated
- Handles authentication state changes

## Routes

Added new route for authentication demo:
- `/auth` - Supabase authentication demo page

## Navigation

Updated both desktop and mobile navigation to include "Auth" link.

## Database Schema (To be created in Supabase)

You'll need to create the following table in your Supabase database:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  website text,
  avatar_url text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Set up Storage
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');
```

## Usage

1. Navigate to `/auth` in your application
2. Enter your email address
3. Check your email for the magic link
4. Click the magic link to sign in
5. Update your profile information
6. Sign out when done

## Features

- ✅ Magic link authentication
- ✅ User profile management
- ✅ Session handling
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

## Next Steps

1. Create the database schema in your Supabase project
2. Test the authentication flow
3. Customize the UI to match your application design
4. Add additional features as needed (password reset, social auth, etc.) 