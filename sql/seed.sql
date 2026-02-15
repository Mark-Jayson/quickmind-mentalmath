-- ==========================================
-- Quickmind Seed Data: Badges & Lessons
-- ==========================================

-- Lesson Badges
INSERT INTO public.badges (id, name, description, icon, category, xp_reward) VALUES
  ('lesson_left_to_right_addition', 'Left-to-Right Adder', 'Completed the Left-to-Right Addition lesson', 'Plus', 'lesson', 50),
  ('lesson_complement_addition', 'Complement Master', 'Completed the Complements & Carries lesson', 'Layers', 'lesson', 50),
  ('lesson_2by1_multiplication', 'Two-by-One Pro', 'Completed the 2×1 Multiplication lesson', 'Grid3X3', 'lesson', 75),
  ('lesson_3by1_multiplication', 'Triple Threat', 'Completed the 3×1 Multiplication lesson', 'Calculator', 'lesson', 100),
  ('lesson_squaring_numbers', 'Square Dealer', 'Completed the Squaring Numbers lesson', 'Square', 'lesson', 100),
  ('lesson_2by2_criss_cross', 'Criss-Cross Champion', 'Completed the 2×2 Criss-Cross lesson', 'Hash', 'lesson', 150),
  ('lesson_phonetic_code', 'Memory Encoder', 'Completed the Phonetic Code lesson', 'Brain', 'lesson', 75),
  ('lesson_mental_workspace', 'Mental Architect', 'Completed the Mental Workspace lesson', 'Cpu', 'lesson', 75),
  ('lesson_day_of_week', 'Time Traveler', 'Completed the Day of the Week lesson', 'Calendar', 'lesson', 100),
  ('lesson_multiples_11', 'Eleven Master', 'Completed the Multiply by 11 lesson', 'Zap', 'lesson', 75);

-- Mathlympics Milestone Badges
INSERT INTO public.badges (id, name, description, icon, category, xp_reward) VALUES
  ('mathlympics_first_session', 'First Steps', 'Completed your first Mathlympics session', 'Flag', 'mathlympics', 25),
  ('mathlympics_2x1_perfect', 'Perfect 2×1', 'Scored 100% on a 2×1 set', 'Star', 'mathlympics', 100),
  ('mathlympics_3x1_perfect', 'Perfect 3×1', 'Scored 100% on a 3×1 set', 'Star', 'mathlympics', 150),
  ('mathlympics_2x2_perfect', 'Perfect 2×2', 'Scored 100% on a 2×2 set', 'Star', 'mathlympics', 200),
  ('mathlympics_squaring_perfect', 'Perfect Squarer', 'Scored 100% on a Squaring set', 'Star', 'mathlympics', 200),
  ('mathlympics_speed_demon', 'Speed Demon', 'Averaged under 5 seconds per question', 'Zap', 'mathlympics', 150),
  ('mathlympics_40_set', 'Marathon Mind', 'Completed a 40-question set', 'Target', 'mathlympics', 100);

-- General Milestone Badges
INSERT INTO public.badges (id, name, description, icon, category, xp_reward) VALUES
  ('milestone_all_lessons', 'Scholar', 'Completed all curriculum lessons', 'GraduationCap', 'milestone', 500),
  ('milestone_100_sessions', 'Centurion', 'Completed 100 Mathlympics sessions', 'Award', 'milestone', 500);

-- Lessons
INSERT INTO public.lessons (id, title, description, category, sort_order, badge_id, content) VALUES
  ('left_to_right_addition', 'Left-to-Right Addition', 'Add numbers from left to right instead of right to left.', 'addition', 1, 'lesson_left_to_right_addition', '{"steps": 3}'::jsonb),
  ('complement_addition', 'Complements & Carries', 'Use complements of 10 to handle carries.', 'addition', 2, 'lesson_complement_addition', '{"steps": 2}'::jsonb),
  ('2by1_multiplication', '2-Digit × 1-Digit', 'Break apart and multiply left-to-right.', 'multiplication', 3, 'lesson_2by1_multiplication', '{"steps": 2}'::jsonb),
  ('3by1_multiplication', '3-Digit × 1-Digit', 'Extend left-to-right multiplication to 3-digit numbers.', 'multiplication', 4, 'lesson_3by1_multiplication', '{"steps": 1}'::jsonb),
  ('squaring_numbers', 'Squaring Numbers', 'Use the a²−b² identity trick.', 'multiplication', 5, 'lesson_squaring_numbers', '{"steps": 2}'::jsonb),
  ('2by2_criss_cross', '2-Digit × 2-Digit (Criss-Cross)', 'The criss-cross multiplication method.', 'multiplication', 6, 'lesson_2by2_criss_cross', '{"steps": 1}'::jsonb),
  ('phonetic_code', 'The Phonetic Code', 'Convert numbers to sounds for memory.', 'memory', 7, 'lesson_phonetic_code', '{"steps": 1}'::jsonb),
  ('mental_workspace', 'Mental Workspace Management', 'Strategies for holding intermediate results.', 'memory', 8, 'lesson_mental_workspace', '{"steps": 1}'::jsonb),
  ('day_of_week', 'Day of the Week', 'Calculate the day of the week for any date.', 'calendar', 9, 'lesson_day_of_week', '{"steps": 1}'::jsonb),
  ('multiples_11', 'Multiply by 11', 'Quickly multiply 2-digit numbers by 11.', 'multiplication', 10, 'lesson_multiples_11', '{"steps": 1}'::jsonb);
