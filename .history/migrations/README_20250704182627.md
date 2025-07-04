# Database Migrations

This folder contains PostgreSQL migration files for the calculus application database schema.

## Migration Files

1. **`001_create_lessons_tables.sql`** - Creates the core lessons schema (lessons, slides, examples, images, quizzes)
2. **`002_insert_lessons_data.sql`** - Inserts all existing lesson content into the database tables
3. **`003_create_profiles_table.sql`** - Creates the profiles table for user authentication and progress tracking

## Schema Overview

### Core Lessons Schema
The lessons database schema supports a hierarchical structure with the following key features:

### Tables

1. **`lessons`** - Main table storing lessons and sections
   - Supports hierarchical structure via `parent_id` self-reference
   - `type` field distinguishes between 'section' (parent) and 'lesson' (child)
   - Includes ordering via `sort_order`

2. **`lesson_slides`** - Individual slides belonging to lessons
   - Each lesson can have multiple slides
   - Ordered by `sort_order` within each lesson

3. **`lesson_slide_images`** - Images associated with slides
   - Multiple images per slide supported
   - Includes caption and ordering

4. **`lesson_slide_examples`** - Examples associated with slides
   - Multiple examples per slide supported
   - Ordered display within slides

5. **`lesson_quizzes`** - Junction table linking lessons to quizzes
   - Many-to-many relationship between lessons and quizzes
   - Prevents duplicate lesson-quiz associations

6. **`profiles`** - User profiles for authentication and progress tracking
   - Links to Supabase auth.users table
   - Includes learning progress (lessons/quizzes completed, scores)
   - User preferences and settings
   - Row Level Security (RLS) enabled

### Key Features

- **UUID Support**: Each table includes both `id` (SERIAL) and `uuid` fields for flexible referencing
- **Hierarchical Structure**: Lessons can be nested (sections containing lessons)
- **Ordering**: All related data includes `sort_order` for consistent display
- **Timestamps**: Automatic `created_at` and `updated_at` tracking
- **Referential Integrity**: Proper foreign key constraints with CASCADE deletion
- **Performance**: Comprehensive indexing for common query patterns
- **Security**: Row Level Security policies for user data protection
- **Auto-triggers**: Automatic profile creation on user signup

## Running Migrations

### Apply All Migrations in Order
```bash
# Using psql
psql -U username -d database_name -f migrations/001_create_lessons_tables.sql
psql -U username -d database_name -f migrations/002_insert_lessons_data.sql
psql -U username -d database_name -f migrations/003_create_profiles_table.sql

# Using Supabase CLI
supabase db reset
# Or apply specific migration
supabase db push
```

### Individual Migration Commands

#### Using psql (PostgreSQL command line)
```bash
psql -U username -d database_name -f migrations/001_create_lessons_tables.sql
```

#### Using Supabase CLI
```bash
supabase db reset
# Or apply specific migration
supabase db push
```

#### Using Node.js/pg
```javascript
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  // your database configuration
});

const sql = fs.readFileSync('migrations/001_create_lessons_tables.sql', 'utf8');
await pool.query(sql);
```

## Schema Mapping

This schema maps to the current TypeScript interfaces:

```typescript
// Current frontend interface
interface LessonNode {
  id?: number;
  name: string;
  description?: string;
  type: 'section' | 'lesson';
  children?: LessonNode[];
  slides?: Slide[];
  quizIds?: number[];
}

interface Slide {
  title: string;
  content: string;
  images?: Array<{url: string; caption: string;}>;
  examples?: string[];
}

// Profile interface
interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
  created_at?: string;
  updated_at?: string;
}
```

## Example Queries

### Get all top-level sections
```sql
SELECT * FROM lessons WHERE parent_id IS NULL ORDER BY sort_order;
```

### Get lessons with their slides
```sql
SELECT 
  l.id,
  l.name,
  l.description,
  json_agg(
    json_build_object(
      'id', s.id,
      'title', s.title,
      'content', s.content,
      'sort_order', s.sort_order
    ) ORDER BY s.sort_order
  ) as slides
FROM lessons l
LEFT JOIN lesson_slides s ON l.id = s.lesson_id
WHERE l.type = 'lesson'
GROUP BY l.id, l.name, l.description
ORDER BY l.sort_order;
```

### Get lesson hierarchy
```sql
WITH RECURSIVE lesson_tree AS (
  -- Base case: top-level sections
  SELECT id, name, type, parent_id, sort_order, 0 as level
  FROM lessons
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive case: child lessons
  SELECT l.id, l.name, l.type, l.parent_id, l.sort_order, lt.level + 1
  FROM lessons l
  INNER JOIN lesson_tree lt ON l.parent_id = lt.id
)
SELECT * FROM lesson_tree ORDER BY level, sort_order;
```

### Get user profile with progress
```sql
SELECT 
  username,
  lessons_completed,
  quizzes_completed,
  total_score,
  created_at
FROM profiles 
WHERE id = auth.uid();
```

## Migration Naming Convention

- `001_create_lessons_tables.sql` - Initial lessons table creation
- `002_insert_lessons_data.sql` - Initial data population
- `003_create_profiles_table.sql` - User profiles and authentication
- `004_add_feature_name.sql` - Future feature additions
- `005_modify_existing_feature.sql` - Future schema modifications

Always increment the number prefix for new migrations to maintain proper ordering.

## Security Notes

- The profiles table has Row Level Security (RLS) enabled
- Users can only view/edit their own profiles
- Public profile data (username, basic stats) is viewable by all users
- Automatic profile creation trigger handles new user registration
- All sensitive operations require authentication 