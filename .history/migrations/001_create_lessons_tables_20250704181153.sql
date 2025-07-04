-- Migration: Create lessons tables
-- Description: Creates tables for lessons, slides, and related data
-- Date: 2025-01-07

-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create lessons table (supports hierarchical structure with parent_id)
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('section', 'lesson')),
    parent_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lesson_slides table
CREATE TABLE lesson_slides (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lesson_slide_images table
CREATE TABLE lesson_slide_images (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    slide_id INTEGER NOT NULL REFERENCES lesson_slides(id) ON DELETE CASCADE,
    url VARCHAR(1000) NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lesson_slide_examples table
CREATE TABLE lesson_slide_examples (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    slide_id INTEGER NOT NULL REFERENCES lesson_slides(id) ON DELETE CASCADE,
    example_text TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lesson_quizzes junction table (for quiz associations)
CREATE TABLE lesson_quizzes (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    quiz_id INTEGER NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, quiz_id)
);

-- Create indexes for better performance
CREATE INDEX idx_lessons_parent_id ON lessons(parent_id);
CREATE INDEX idx_lessons_type ON lessons(type);
CREATE INDEX idx_lessons_sort_order ON lessons(sort_order);
CREATE INDEX idx_lesson_slides_lesson_id ON lesson_slides(lesson_id);
CREATE INDEX idx_lesson_slides_sort_order ON lesson_slides(sort_order);
CREATE INDEX idx_lesson_slide_images_slide_id ON lesson_slide_images(slide_id);
CREATE INDEX idx_lesson_slide_examples_slide_id ON lesson_slide_examples(slide_id);
CREATE INDEX idx_lesson_quizzes_lesson_id ON lesson_quizzes(lesson_id);
CREATE INDEX idx_lesson_quizzes_quiz_id ON lesson_quizzes(quiz_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_slides_updated_at BEFORE UPDATE ON lesson_slides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments to tables for documentation
COMMENT ON TABLE lessons IS 'Stores lessons and sections in hierarchical structure';
COMMENT ON TABLE lesson_slides IS 'Stores individual slides that belong to lessons';
COMMENT ON TABLE lesson_slide_images IS 'Stores images associated with lesson slides';
COMMENT ON TABLE lesson_slide_examples IS 'Stores examples associated with lesson slides';
COMMENT ON TABLE lesson_quizzes IS 'Junction table linking lessons to their associated quizzes';

COMMENT ON COLUMN lessons.type IS 'Either "section" (parent) or "lesson" (child)';
COMMENT ON COLUMN lessons.parent_id IS 'References parent lesson for hierarchical structure';
COMMENT ON COLUMN lessons.sort_order IS 'Determines display order within parent';
COMMENT ON COLUMN lesson_slides.sort_order IS 'Determines slide order within lesson';
COMMENT ON COLUMN lesson_slide_images.sort_order IS 'Determines image order within slide';
COMMENT ON COLUMN lesson_slide_examples.sort_order IS 'Determines example order within slide'; 