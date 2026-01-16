-- Database: rumah_jurnal

CREATE DATABASE IF NOT EXISTS rumah_jurnal;
USE rumah_jurnal;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  institution VARCHAR(255),
  phone VARCHAR(50),
  sinta_id VARCHAR(50),
  scopus_id VARCHAR(50),
  orcid_id VARCHAR(50),
  google_scholar_id VARCHAR(255),
  avatar VARCHAR(500),
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: activity_logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  user_name VARCHAR(255),
  role VARCHAR(50),
  action VARCHAR(50) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: submissions
CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  author_id INT,
  revision_notes TEXT,
  file_url VARCHAR(500),
  loa_file_url VARCHAR(500),
  journal_id VARCHAR(100),
  journal_volume VARCHAR(100),
  abstract TEXT,
  keywords VARCHAR(500),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed Data: users
-- Passwords should be hashed in real usage. These are placeholders or need to be hashed if imported directly.
-- In repopulate_db.js, '123456' corresponds to a hashed value.
-- For this SQL dump, we will assume the application handles hashing or these are for structure only.
-- However, to be useful, we can insert the known users if we knew their hashes.
-- Since we don't have the hashes handy (except via running the helper), we will leave seeds as comments or raw data if known.
-- (Users are typically created via the app or the seeder script)

-- Seed Data: submissions
-- (Sample data structure logic logic is in the JS seeder)
