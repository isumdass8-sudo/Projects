-- SL-ATM Finder Database Schema
-- MySQL 8+

CREATE DATABASE IF NOT EXISTS sl_atm_finder
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sl_atm_finder;

-- ============================
-- BANKS
-- ============================
CREATE TABLE banks (
  bank_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  short_name    VARCHAR(20),
  logo_url      VARCHAR(255),
  website       VARCHAR(255),
  contact       VARCHAR(50),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- DISTRICTS (Sri Lanka's 25 districts)
-- ============================
CREATE TABLE districts (
  district_id   INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(50) NOT NULL UNIQUE,
  province      VARCHAR(50) NOT NULL
);

-- ============================
-- ATMS
-- ============================
CREATE TABLE atms (
  atm_id            INT AUTO_INCREMENT PRIMARY KEY,
  bank_id           INT NOT NULL,
  district_id       INT,
  name              VARCHAR(150) NOT NULL,
  address           VARCHAR(255) NOT NULL,
  city              VARCHAR(100) NOT NULL,
  latitude          DECIMAL(10, 7) NOT NULL,
  longitude         DECIMAL(10, 7) NOT NULL,
  service_type      ENUM('atm', 'cdm', 'branch', '24hr_center') DEFAULT 'atm',
  is_24_hours       BOOLEAN DEFAULT FALSE,
  cash_deposit      BOOLEAN DEFAULT FALSE,
  wheelchair_access BOOLEAN DEFAULT FALSE,
  drive_through     BOOLEAN DEFAULT FALSE,
  foreign_card      BOOLEAN DEFAULT FALSE,
  status            ENUM('active', 'inactive', 'reported') DEFAULT 'active',
  source            ENUM('manual', 'osm', 'csv_import') DEFAULT 'manual',
  osm_id            VARCHAR(50) NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bank_id) REFERENCES banks(bank_id) ON DELETE CASCADE,
  FOREIGN KEY (district_id) REFERENCES districts(district_id) ON DELETE SET NULL,
  INDEX idx_lat_lng (latitude, longitude),
  INDEX idx_city (city),
  INDEX idx_bank (bank_id),
  UNIQUE KEY unique_osm_id (osm_id)
);

-- ============================
-- USERS
-- ============================
CREATE TABLE users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user', 'admin') DEFAULT 'user',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- FAVORITES (many-to-many: users <-> atms)
-- ============================
CREATE TABLE favorites (
  favorite_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  atm_id        INT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (atm_id) REFERENCES atms(atm_id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, atm_id)
);

-- ============================
-- SEARCH HISTORY / RECENTLY VIEWED
-- ============================
CREATE TABLE search_history (
  history_id    INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  atm_id        INT NOT NULL,
  viewed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (atm_id) REFERENCES atms(atm_id) ON DELETE CASCADE
);

-- ============================
-- FEEDBACK
-- ============================
CREATE TABLE feedback (
  feedback_id   INT AUTO_INCREMENT PRIMARY KEY,
  atm_id        INT NOT NULL,
  user_id       INT NOT NULL,
  rating        TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  machine_working BOOLEAN DEFAULT TRUE,
  cash_available  BOOLEAN DEFAULT TRUE,
  parking_available BOOLEAN DEFAULT FALSE,
  comment       TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (atm_id) REFERENCES atms(atm_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================
-- REPORTS (out of service etc.)
-- ============================
CREATE TABLE reports (
  report_id     INT AUTO_INCREMENT PRIMARY KEY,
  atm_id        INT NOT NULL,
  user_id       INT NULL,
  problem       VARCHAR(255) NOT NULL,
  status        ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at   TIMESTAMP NULL,
  FOREIGN KEY (atm_id) REFERENCES atms(atm_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- ============================
-- SEED: Sri Lanka's 25 districts
-- ============================
INSERT INTO districts (name, province) VALUES
('Colombo', 'Western'), ('Gampaha', 'Western'), ('Kalutara', 'Western'),
('Kandy', 'Central'), ('Matale', 'Central'), ('Nuwara Eliya', 'Central'),
('Galle', 'Southern'), ('Matara', 'Southern'), ('Hambantota', 'Southern'),
('Jaffna', 'Northern'), ('Kilinochchi', 'Northern'), ('Mannar', 'Northern'),
('Vavuniya', 'Northern'), ('Mullaitivu', 'Northern'),
('Batticaloa', 'Eastern'), ('Ampara', 'Eastern'), ('Trincomalee', 'Eastern'),
('Kurunegala', 'North Western'), ('Puttalam', 'North Western'),
('Anuradhapura', 'North Central'), ('Polonnaruwa', 'North Central'),
('Badulla', 'Uva'), ('Monaragala', 'Uva'),
('Ratnapura', 'Sabaragamuwa'), ('Kegalle', 'Sabaragamuwa');

-- ============================
-- SEED: Sri Lankan banks
-- ============================
INSERT INTO banks (name, short_name) VALUES
('Bank of Ceylon', 'BOC'),
('People\'s Bank', 'PB'),
('Commercial Bank of Ceylon', 'ComBank'),
('Sampath Bank', 'Sampath'),
('Hatton National Bank', 'HNB'),
('Seylan Bank', 'Seylan'),
('National Development Bank', 'NDB'),
('DFCC Bank', 'DFCC'),
('Nations Trust Bank', 'NTB'),
('Pan Asia Banking Corporation', 'Pan Asia'),
('Union Bank of Colombo', 'Union Bank'),
('Cargills Bank', 'Cargills'),
('Amana Bank', 'Amana'),
('Sanasa Development Bank', 'SDB'),
('National Savings Bank', 'NSB'),
('Regional Development Bank', 'RDB');
