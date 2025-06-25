-- Check if our data is properly set up
SELECT 'Users' as table_name, count(*) as count FROM users
UNION ALL
SELECT 'Students' as table_name, count(*) as count FROM students
UNION ALL
SELECT 'Attendance Records' as table_name, count(*) as count FROM attendance_records;

-- Check user credentials
SELECT email, name, role, status FROM users WHERE status = 'active';

-- Check students
SELECT student_id, name, grade, status FROM students WHERE status = 'active' LIMIT 5;
