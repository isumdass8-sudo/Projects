-- CGLP Portal v2 migration — run this AFTER schema.sql if you already have
-- a database set up. Safe to run once.
-- Run: mysql -u root -p cglp_portal < migration_v2.sql

USE cglp_portal;

-- 1. Roles for role-based access control
ALTER TABLE users
  ADD COLUMN role ENUM('customer','staff','admin') NOT NULL DEFAULT 'customer' AFTER phone;

-- 2. Plantation locations, for the interactive map
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

-- 3. Digital document uploads (KYC-style docs attached to a customer/contribution)
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

-- 4. Give one account admin rights so you can see the admin dashboard.
--    Replace the email with the account you registered on the site, then
--    run just this one line yourself:
-- UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
