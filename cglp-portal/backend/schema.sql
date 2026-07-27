-- Ceylon Green Life Plantation - Customer Portal (academic project)
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS cglp_portal;
USE cglp_portal;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30),
  role ENUM('customer','staff','admin') NOT NULL DEFAULT 'customer',
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  tagline VARCHAR(255),
  description TEXT,
  min_contribution DECIMAL(12,2) NOT NULL,
  monthly_rate DECIMAL(5,4) NOT NULL COMMENT 'e.g. 0.0150 = 1.5% monthly',
  duration_months INT NOT NULL,
  icon VARCHAR(50),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contributions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  monthly_rate DECIMAL(5,4) NOT NULL COMMENT 'locked in at time of contribution',
  duration_months INT NOT NULL,
  start_date DATE NOT NULL,
  status ENUM('active','matured','cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  rating TINYINT DEFAULT 5,
  comment TEXT NOT NULL,
  source VARCHAR(80) DEFAULT 'Google',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  excerpt VARCHAR(400),
  content TEXT NOT NULL,
  cover_color VARCHAR(20) DEFAULT '#2F4F3E',
  published_at DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  region VARCHAR(80) NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  acreage DECIMAL(8,2),
  crop VARCHAR(80),
  description VARCHAR(400)
);

CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  contribution_id INT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (contribution_id) REFERENCES contributions(id) ON DELETE SET NULL
);
