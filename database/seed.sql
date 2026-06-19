-- CareerBridge BD : Seed Data (MySQL 8.0)
-- Week 2 : Sample data for development & testing
-- NOTE: password for every seeded account = Test@1234 (real bcrypt hash, cost 10)

USE careerbridge_bd;

-- USERS (1 admin, 3 graduates, 2 employers)
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Admin User', 'admin@careerbridgebd.com', '$2b$10$gaJCBsHnuVQJ8iBHyguWEuCJueujvDkb/J0K2iVzvHAVYauVWd3Ou', 'admin'),
(2, 'MD. Rakibul Hasan', 'rakibul.hasan@gmail.com', '$2b$10$gaJCBsHnuVQJ8iBHyguWEuCJueujvDkb/J0K2iVzvHAVYauVWd3Ou', 'graduate'),
(3, 'Sumaiya Akter', 'sumaiya.akter@gmail.com', '$2b$10$gaJCBsHnuVQJ8iBHyguWEuCJueujvDkb/J0K2iVzvHAVYauVWd3Ou', 'graduate'),
(4, 'Tanvir Ahmed', 'tanvir.ahmed@gmail.com', '$2b$10$gaJCBsHnuVQJ8iBHyguWEuCJueujvDkb/J0K2iVzvHAVYauVWd3Ou', 'graduate'),
(5, 'Nusrat Jahan', 'hr@nextgensoftware.example.com', '$2b$10$gaJCBsHnuVQJ8iBHyguWEuCJueujvDkb/J0K2iVzvHAVYauVWd3Ou', 'employer'),
(6, 'Imran Kabir', 'hr@dhakafintech.example.com', '$2b$10$gaJCBsHnuVQJ8iBHyguWEuCJueujvDkb/J0K2iVzvHAVYauVWd3Ou', 'employer');

-- GRADUATE PROFILES
INSERT INTO graduate_profiles (user_id, university, degree, graduation_year, district, skills, bio, cv_path, profile_completeness) VALUES
(2, 'Green University of Bangladesh', 'B.Sc. in CSE', 2025, 'Dhaka', 'JavaScript, React, Node.js, MySQL', 'Aspiring full-stack developer with hands-on project experience.', '/uploads/cv/rakibul_hasan.pdf', 90),
(3, 'Dhaka University', 'B.Sc. in Statistics', 2025, 'Dhaka', 'Python, SQL, Excel, Power BI', 'Data enthusiast looking for entry-level analyst roles.', '/uploads/cv/sumaiya_akter.pdf', 80),
(4, 'BUET', 'B.Sc. in CSE', 2024, 'Chittagong', 'Manual Testing, Selenium, JIRA', 'Detail-oriented QA fresher with academic testing projects.', '/uploads/cv/tanvir_ahmed.pdf', 75);

-- EMPLOYER PROFILES
INSERT INTO employer_profiles (user_id, company_name, industry, location, website, description, is_verified) VALUES
(5, 'NextGen Software Ltd.', 'Information Technology', 'Dhaka', 'https://nextgensoftware.example.com', 'Mid-size software house building web & mobile products for local and overseas clients.', TRUE),
(6, 'Dhaka FinTech Solutions', 'Financial Technology', 'Dhaka', 'https://dhakafintech.example.com', 'FinTech company focused on digital payments and analytics for the Bangladeshi market.', TRUE);

-- JOB LISTINGS
INSERT INTO job_listings (id, employer_id, title, category, description, requirements, location, job_type, salary_range, deadline, status) VALUES
(1, 5, 'Junior Frontend Developer (React.js)', 'Software Development', 'Work on customer-facing React.js dashboards.', 'Basic React, JavaScript, Git', 'Dhaka', 'full-time', '25,000 - 35,000 BDT', '2026-07-31', 'active'),
(2, 5, 'Backend Developer Intern (Node.js)', 'Software Development', 'Assist backend team with Express APIs.', 'Node.js basics, MySQL', 'Dhaka', 'internship', '10,000 - 15,000 BDT', '2026-07-15', 'active'),
(3, 6, 'Data Analyst - Entry Level', 'Data & Analytics', 'Analyze transaction data and build reports.', 'SQL, Excel, basic statistics', 'Dhaka', 'full-time', '30,000 - 40,000 BDT', '2026-08-10', 'active'),
(4, 6, 'QA Engineer (Fresher)', 'Quality Assurance', 'Manual + basic automated testing of fintech app.', 'Manual testing fundamentals', 'Chittagong', 'full-time', '28,000 - 32,000 BDT', '2026-07-20', 'active');

-- APPLICATIONS
INSERT INTO applications (graduate_id, job_id, status) VALUES
(2, 1, 'pending'),
(2, 3, 'shortlisted'),
(3, 1, 'rejected'),
(3, 2, 'pending'),
(4, 4, 'hired');

-- NOTIFICATIONS
INSERT INTO notifications (user_id, message, is_read) VALUES
(2, 'Your application for "Data Analyst - Entry Level" has been shortlisted.', FALSE),
(3, 'Your application for "Junior Frontend Developer (React.js)" was not selected this time.', FALSE),
(4, 'Congratulations! You have been hired for "QA Engineer (Fresher)".', FALSE);
