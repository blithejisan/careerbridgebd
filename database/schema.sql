-- CareerBridge BD : Database Schema (MySQL 8.0)
-- Week 2 : Schema finalization

CREATE DATABASE IF NOT EXISTS careerbridge_bd;
USE careerbridge_bd;

-- TABLE: users
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('graduate', 'employer', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: graduate_profiles
CREATE TABLE graduate_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  university VARCHAR(150),
  degree VARCHAR(100),
  graduation_year YEAR,
  district VARCHAR(100),
  skills TEXT,
  bio TEXT,
  cv_path VARCHAR(255),
  profile_completeness INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE: employer_profiles
CREATE TABLE employer_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  industry VARCHAR(100),
  location VARCHAR(100),
  website VARCHAR(200),
  description TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE: job_listings
CREATE TABLE job_listings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employer_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  requirements TEXT,
  location VARCHAR(100),
  job_type ENUM('full-time', 'part-time', 'internship', 'remote'),
  salary_range VARCHAR(100),
  deadline DATE,
  status ENUM('active', 'closed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE: applications
CREATE TABLE applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  graduate_id INT NOT NULL,
  job_id INT NOT NULL,
  status ENUM('pending', 'shortlisted', 'rejected', 'hired') DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_application (graduate_id, job_id),
  FOREIGN KEY (graduate_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES job_listings(id) ON DELETE CASCADE
);

-- TABLE: notifications
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- INDEXES (supports NFR: page load under 3 seconds)
CREATE INDEX idx_jobs_status ON job_listings(status);
CREATE INDEX idx_jobs_type ON job_listings(job_type);
CREATE INDEX idx_jobs_location ON job_listings(location);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_graduate ON applications(graduate_id);
