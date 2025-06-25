-- Insert default admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO users (email, password_hash, name, role, status) VALUES
('admin@school.com', 'admin123', 'System Administrator', 'admin', 'active'),
('teacher1@school.com', 'admin123', 'John Teacher', 'teacher', 'active'),
('teacher2@school.com', 'admin123', 'Jane Teacher', 'teacher', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample students
INSERT INTO students (student_id, name, email, grade, status, created_by) VALUES
('STU001', 'Alice Johnson', 'alice.johnson@student.com', '10', 'active', (SELECT id FROM users WHERE email = 'admin@school.com')),
('STU002', 'Bob Smith', 'bob.smith@student.com', '10', 'active', (SELECT id FROM users WHERE email = 'admin@school.com')),
('STU003', 'Charlie Brown', 'charlie.brown@student.com', '11', 'active', (SELECT id FROM users WHERE email = 'admin@school.com')),
('STU004', 'Diana Wilson', 'diana.wilson@student.com', '11', 'active', (SELECT id FROM users WHERE email = 'admin@school.com')),
('STU005', 'Edward Davis', 'edward.davis@student.com', '12', 'active', (SELECT id FROM users WHERE email = 'admin@school.com')),
('STU006', 'Fiona Miller', 'fiona.miller@student.com', '12', 'active', (SELECT id FROM users WHERE email = 'admin@school.com')),
('STU007', 'George Anderson', 'george.anderson@student.com', '9', 'active', (SELECT id FROM users WHERE email = 'admin@school.com')),
('STU008', 'Hannah Taylor', 'hannah.taylor@student.com', '9', 'active', (SELECT id FROM users WHERE email = 'admin@school.com'))
ON CONFLICT (student_id) DO NOTHING;

-- Insert sample attendance records for the past week
INSERT INTO attendance_records (student_id, attendance_date, status, marked_by) 
SELECT 
  s.id,
  CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 6),
  CASE 
    WHEN random() > 0.15 THEN 'present'
    ELSE 'absent'
  END,
  (SELECT id FROM users WHERE email = 'teacher1@school.com')
FROM students s
WHERE s.status = 'active'
ON CONFLICT (student_id, attendance_date) DO NOTHING;

-- Insert system settings
INSERT INTO system_settings (key, value, description) VALUES
('school_name', 'Greenwood High School', 'Name of the educational institution'),
('academic_year', '2024-2025', 'Current academic year'),
('attendance_threshold', '75', 'Minimum attendance percentage required'),
('email_notifications', 'true', 'Enable email notifications for attendance'),
('backup_frequency', 'daily', 'Frequency of automatic backups')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description;
