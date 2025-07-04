-- Migration: Insert existing lessons data
-- Description: Inserts all the hardcoded lesson data from the frontend component into the database
-- Date: 2025-01-07

-- Insert sections (parent lessons)
INSERT INTO lessons (id, name, description, type, parent_id, sort_order) VALUES
(100, 'Limits and Continuity', 'Master the fundamental concepts of limits and continuity', 'section', NULL, 1),
(200, 'Derivatives', 'Master differentiation and its applications', 'section', NULL, 2),
(300, 'Integration', 'Explore integral calculus and its applications', 'section', NULL, 3),
(400, 'Taylor Series', 'Explore power series representations of functions', 'section', NULL, 4),
(500, 'Newton''s Method', 'Learn numerical methods for finding roots', 'section', NULL, 5),
(600, 'Fundamental Theorem of Calculus', 'Connect differentiation and integration', 'section', NULL, 6);

-- Insert lessons (children of sections)
INSERT INTO lessons (id, name, description, type, parent_id, sort_order) VALUES
-- Limits and Continuity lessons
(1, 'Introduction to Limits', 'Understanding the basic concept of limits', 'lesson', 100, 1),
(2, 'One-Sided Limits', 'Learn about limits from the left and right', 'lesson', 100, 2),

-- Derivatives lessons
(3, 'Introduction to Derivatives', 'Learn what derivatives are and how to calculate them', 'lesson', 200, 1),
(4, 'Derivative Rules', 'Master the basic rules of differentiation', 'lesson', 200, 2),

-- Integration lessons
(5, 'Introduction to Integration', 'Learn the basics of integration and antiderivatives', 'lesson', 300, 1),
(6, 'Definite Integrals', 'Understand definite integrals and their applications', 'lesson', 300, 2),

-- Taylor Series lessons
(7, 'Introduction to Taylor Series', 'Learn how to represent functions as infinite series', 'lesson', 400, 1),
(8, 'Convergence of Series', 'Understand when and where series converge', 'lesson', 400, 2),

-- Newton's Method lessons
(9, 'Introduction to Newton''s Method', 'Understand how to approximate roots of functions', 'lesson', 500, 1),
(10, 'Applications and Limitations', 'Explore where Newton''s method works best', 'lesson', 500, 2),

-- Fundamental Theorem of Calculus lessons
(11, 'Part I: Antiderivatives', 'Understand the first part of the theorem', 'lesson', 600, 1),
(12, 'Part II: Evaluation', 'Master the second part of the theorem', 'lesson', 600, 2);

-- Insert lesson slides
INSERT INTO lesson_slides (lesson_id, title, content, sort_order) VALUES
-- Lesson 1: Introduction to Limits
(1, 'What is a Limit?', 'A limit describes the value that a function approaches as the input approaches some value.', 1),
(1, 'Evaluating Basic Limits', 'To evaluate a limit, we can often simply plug in the value, except when this leads to undefined expressions.', 2),

-- Lesson 2: One-Sided Limits
(2, 'Left and Right Hand Limits', 'A one-sided limit examines function behavior when approaching a point from only one direction.', 1),

-- Lesson 3: Introduction to Derivatives
(3, 'What is a Derivative?', 'The derivative of a function represents its rate of change or slope at any point.', 1),

-- Lesson 4: Derivative Rules
(4, 'Basic Derivative Rules', 'Learn the power rule, product rule, quotient rule, and chain rule.', 1),

-- Lesson 5: Introduction to Integration
(5, 'What is Integration?', 'Integration is the reverse process of differentiation and can be used to find areas and accumulation.', 1),

-- Lesson 6: Definite Integrals
(6, 'The Definite Integral', 'A definite integral represents the area under a curve between two points.', 1),

-- Lesson 7: Introduction to Taylor Series
(7, 'What is a Taylor Series?', 'A Taylor series is an infinite sum of terms that are calculated from the derivatives of a function at a single point.', 1),

-- Lesson 8: Convergence of Series
(8, 'Series Convergence', 'Learn various tests to determine if a series converges or diverges.', 1),

-- Lesson 9: Introduction to Newton's Method
(9, 'What is Newton''s Method?', 'Newton''s method is an iterative technique for finding roots of equations using derivatives.', 1),

-- Lesson 10: Applications and Limitations
(10, 'When to Use Newton''s Method', 'Learn about convergence conditions and potential pitfalls.', 1),

-- Lesson 11: Part I: Antiderivatives
(11, 'The First Fundamental Theorem', 'Learn how the derivative of an integral yields the original function.', 1),

-- Lesson 12: Part II: Evaluation
(12, 'The Second Fundamental Theorem', 'Learn how to evaluate definite integrals using antiderivatives.', 1);

-- Insert lesson slide examples
INSERT INTO lesson_slide_examples (slide_id, example_text, sort_order) VALUES
-- Examples for "What is a Limit?" slide (slide_id will be 1)
(1, 'As x approaches 2, f(x) = x² approaches 4', 1),
(1, 'As x approaches infinity, 1/x approaches 0', 2),

-- Examples for "Evaluating Basic Limits" slide (slide_id will be 2)
(2, 'lim(x→2) x² = 4', 1),
(2, 'lim(x→0) sin(x)/x = 1', 2),

-- Examples for "Left and Right Hand Limits" slide (slide_id will be 3)
(3, 'Left-hand limit: lim(x→a⁻) f(x)', 1),
(3, 'Right-hand limit: lim(x→a⁺) f(x)', 2),

-- Examples for "What is a Derivative?" slide (slide_id will be 4)
(4, 'The derivative of f(x) = x² is f''(x) = 2x', 1),
(4, 'The derivative represents instantaneous velocity for a position function', 2),

-- Examples for "Basic Derivative Rules" slide (slide_id will be 5)
(5, 'Power Rule: d/dx(x^n) = nx^(n-1)', 1),
(5, 'Product Rule: d/dx(uv) = u(dv/dx) + v(du/dx)', 2),

-- Examples for "What is Integration?" slide (slide_id will be 6)
(6, '∫x² dx = x³/3 + C', 1),
(6, '∫sin(x) dx = -cos(x) + C', 2),

-- Examples for "The Definite Integral" slide (slide_id will be 7)
(7, '∫[a to b] f(x) dx = F(b) - F(a)', 1),
(7, 'Area under curve = ∫[a to b] f(x) dx', 2),

-- Examples for "What is a Taylor Series?" slide (slide_id will be 8)
(8, 'e^x = 1 + x + x²/2! + x³/3! + ...', 1),
(8, 'sin(x) = x - x³/3! + x⁵/5! - ...', 2),

-- Examples for "Series Convergence" slide (slide_id will be 9)
(9, 'Ratio Test', 1),
(9, 'Root Test', 2),
(9, 'Comparison Tests', 3),

-- Examples for "What is Newton's Method?" slide (slide_id will be 10)
(10, 'x_(n+1) = x_n - f(x_n)/f''(x_n)', 1),
(10, 'Example: Finding √2 using Newton''s method', 2),

-- Examples for "When to Use Newton's Method" slide (slide_id will be 11)
(11, 'Multiple roots', 1),
(11, 'Cases where the method fails', 2),

-- Examples for "The First Fundamental Theorem" slide (slide_id will be 12)
(12, 'd/dx[∫[a to x] f(t)dt] = f(x)', 1),
(12, 'Applications in physics and engineering', 2),

-- Examples for "The Second Fundamental Theorem" slide (slide_id will be 13)
(13, '∫[a to b] f(x)dx = F(b) - F(a)', 1),
(13, 'Connection to area under curves', 2);

-- Insert lesson quiz associations
INSERT INTO lesson_quizzes (lesson_id, quiz_id, sort_order) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 4, 1),
(4, 5, 1),
(4, 6, 2),
(5, 7, 1),
(6, 8, 1),
(7, 11, 1),
(8, 12, 1),
(9, 9, 1),
(10, 10, 1),
(11, 7, 1),
(11, 8, 2),
(12, 7, 1),
(12, 8, 2);

-- Update the sequence to avoid conflicts with manually inserted IDs
SELECT setval('lessons_id_seq', 1000, true);
SELECT setval('lesson_slides_id_seq', 1000, true);
SELECT setval('lesson_slide_examples_id_seq', 1000, true);
SELECT setval('lesson_quizzes_id_seq', 1000, true); 