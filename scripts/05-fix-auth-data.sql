-- Clean up and fix authentication data
-- First, let's ensure we have the correct password hashes

-- Update existing users with proper password (admin123)
UPDATE users 
SET password_hash = 'admin123'
WHERE email IN ('admin@school.com', 'teacher1@school.com', 'teacher2@school.com');

-- Insert users if they don't exist
INSERT INTO users (email, password_hash, name, role, status) VALUES
('admin@school.com', 'admin123', 'System Administrator', 'admin', 'active'),
('teacher1@school.com', 'admin123', 'John Teacher', 'teacher', 'active'),
('teacher2@school.com', 'admin123', 'Jane Teacher', 'teacher', 'active')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- Ensure we have some sample students
INSERT INTO students (student_id, name, email, grade, status, created_by) VALUES
('STU001', 'Alice Johnson', 'alice.johnson@student.com', '10', 'active', (SELECT id FROM users WHERE email = 'admin@school.com' LIMIT 1)),
('STU002', 'Bob Smith', 'bob.smith@student.com', '10', 'active', (SELECT id FROM users WHERE email = 'admin@school.com' LIMIT 1)),
('STU003', 'Charlie Brown', 'charlie.brown@student.com', '11', 'active', (SELECT id FROM users WHERE email = 'admin@school.com' LIMIT 1)),
('STU004', 'Diana Wilson', 'diana.wilson@student.com', '11', 'active', (SELECT id FROM users WHERE email = 'admin@school.com' LIMIT 1)),
('STU005', 'Edward Davis', 'edward.davis@student.com', '12', 'active', (SELECT id FROM users WHERE email = 'admin@school.com' LIMIT 1))
ON CONFLICT (student_id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  grade = EXCLUDED.grade,
  status = EXCLUDED.status;

-- Add some sample attendance records for today
INSERT INTO attendance_records (student_id, attendance_date, status, marked_by) 
SELECT 
  s.id,
  CURRENT_DATE,
  CASE 
    WHEN random() > 0.2 THEN 'present'
    ELSE 'absent'
  END,
  (SELECT id FROM users WHERE email = 'teacher1@school.com' LIMIT 1)
FROM students s
WHERE s.status = 'active'
ON CONFLICT (student_id, attendance_date) DO UPDATE SET
  status = EXCLUDED.status,
  marked_by = EXCLUDED.marked_by;
