-- ============================================================
-- Kandy Tourism Marketing Association (KTMA) — Database Schema
-- ============================================================
-- Usage:
--   mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS ktma_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ktma_db;

-- ---------------------------------------------------------
-- Executive committee / members
-- ---------------------------------------------------------
DROP TABLE IF EXISTS committee_members;
CREATE TABLE committee_members (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  role          VARCHAR(120) NOT NULL,
  term          VARCHAR(20)  NOT NULL DEFAULT '2026-2028',
  display_order INT NOT NULL DEFAULT 0,
  bio           VARCHAR(500) DEFAULT NULL,
  photo_url     VARCHAR(255) DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- Member businesses (hotels, guides, tour operators, etc.)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS business_members;
CREATE TABLE business_members (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  business_name VARCHAR(150) NOT NULL,
  category      VARCHAR(80)  NOT NULL,
  description   VARCHAR(500),
  location      VARCHAR(120),
  contact_phone VARCHAR(40),
  contact_email VARCHAR(120),
  website       VARCHAR(255),
  logo_url      VARCHAR(255),
  featured      TINYINT(1) DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- Destinations / attractions featured on the home page
-- ---------------------------------------------------------
DROP TABLE IF EXISTS destinations;
CREATE TABLE destinations (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  summary       VARCHAR(300),
  description   TEXT,
  image_url     VARCHAR(255),
  category      VARCHAR(80),
  display_order INT DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- Events (tournaments, tourism-day activations, etc.)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS events;
CREATE TABLE events (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(150) NOT NULL,
  event_date    DATE,
  location      VARCHAR(150),
  summary       VARCHAR(400),
  cover_image   VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- Gallery images
-- ---------------------------------------------------------
DROP TABLE IF EXISTS gallery;
CREATE TABLE gallery (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(150),
  category      VARCHAR(80) NOT NULL DEFAULT 'Events',
  image_url     VARCHAR(255) NOT NULL,
  event_id      INT DEFAULT NULL,
  display_order INT DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------
-- Contact / inquiry form submissions
-- ---------------------------------------------------------
DROP TABLE IF EXISTS contact_messages;
CREATE TABLE contact_messages (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  phone         VARCHAR(40),
  subject       VARCHAR(150),
  message       TEXT NOT NULL,
  is_read       TINYINT(1) DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Seed data
-- ============================================================

INSERT INTO committee_members (full_name, role, term, display_order, photo_url) VALUES
('Namal Danasekara',      'Main Advisor',      '2026-2028', 1, 'executive-committee.jpg'),
('Chethiya Yatawara',     'Advisor',            '2026-2028', 2, 'executive-committee.jpg'),
('Azard Suhood',          'President',          '2026-2028', 3, 'executive-committee.jpg'),
('Sena Bandara',          'Secretary',          '2026-2028', 4, 'executive-committee.jpg'),
('Priyantha Dissanayake', 'Treasurer',          '2026-2028', 5, 'executive-committee.jpg'),
('Angelo Ferdinand',      'National Organizer',  '2026-2028', 6, 'executive-committee.jpg'),
('Sampath Chaminda Lal',  'Vice Secretary',     '2026-2028', 7, 'executive-committee.jpg'),
('W.M.J.P. Wijekoon',     'Vice President',     '2026-2028', 8, 'executive-committee.jpg'),
('Nalin Nanayakkara',     'Accountant',         '2026-2028', 9, 'executive-committee.jpg');

INSERT INTO events (title, event_date, location, summary, cover_image) VALUES
('KTMA Cricket Tournament', '2025-12-17', 'Katukelle Grounds, Kandy',
 'Members, hoteliers and tourism partners came together for a friendly cricket tournament celebrating the KTMA community, complete with traditional dance performances and an awards presentation.',
 'event-team-panorama.jpg'),
('World Tourism Day 2023', '2023-09-27', 'Kandy City',
 'KTMA joined the global "I Love Sri Lanka" campaign for World Tourism Day, welcoming visitors and promoting Kandy as a premier cultural destination.',
 'tourism-worldtourismday.jpg');

INSERT INTO gallery (title, category, image_url, event_id, display_order) VALUES
('Cricket Tournament — Team Panorama', 'Events', 'event-team-panorama.jpg', 1, 1),
('Cricket Tournament — Full Squad',    'Events', 'event-team-full.jpg',     1, 2),
('Cricket Tournament — Match Action',  'Events', 'event-cricket-action.jpg',1, 3),
('Cultural Dance Performance',         'Culture','event-cultural-dance.jpg',1, 4),
('Members Gathering',                  'Events', 'event-gathering.jpg',     1, 5),
('Awards Presentation',                'Events', 'event-awards-tent.jpg',   1, 6),
('Team at Dusk',                       'Events', 'event-team-dusk.jpg',     1, 7),
('Association Members',                'Events', 'event-group-1.jpg',       1, 8),
('Association Duo',                    'Events', 'event-duo.jpg',           1, 9),
('World Tourism Day — Visit Sri Lanka','Culture','tourism-worldtourismday.jpg', 2, 10),
('World Tourism Day — Nine Arch Bridge','Culture','tourism-coconut-1.jpg',  2, 11),
('Executive Committee 2026–2028',      'Association', 'executive-committee.jpg', NULL, 12);

INSERT INTO destinations (name, summary, description, image_url, category, display_order) VALUES
('Temple of the Sacred Tooth Relic', 'Sri Lanka''s most venerated Buddhist shrine.',
 'Set on the edge of Kandy Lake, the Temple of the Sacred Tooth Relic (Sri Dalada Maligawa) is the spiritual heart of the city and a UNESCO World Heritage Site, drawing pilgrims and travellers from across the globe.',
 '987654321.jpg', 'Heritage', 1),
('Nine Arch Bridge & Hill Country Rail', 'An icon of Sri Lanka''s hill country.',
 'Wind through misty tea estates aboard the scenic highland railway, crossing colonial-era viaducts framed by emerald plantations.',
 'nine-arche.jpg', 'Nature', 2),
('Royal Botanical Gardens, Peradeniya', 'A living museum of tropical flora.',
 'Just outside Kandy, 147 acres of orchid houses, giant bamboo, and a canopy of century-old trees make this one of Asia''s finest botanical gardens.',
 'event-gathering.jpg', 'Nature', 3),
('Traditional Kandyan Culture', 'Dance, drumming, and centuries of ceremony.',
 'Experience the rhythm of the Kandyan dance tradition — vibrant costumes, ritual drumming, and choreography passed down through generations.',
 'event-cultural-dance.jpg', 'Culture', 4);

INSERT INTO business_members (business_name, category, description, location, featured) VALUES
('Sanura Silks', 'Retail & Handloom', 'Traditional Kandyan handloom textiles and silk products supporting local artisans.', 'Kandy City Centre', 1),
('Abey Silk Centre', 'Retail & Handloom', 'Fine silks and souvenirs for the discerning traveller.', 'Kandy', 0),
('Eventro Photography', 'Event Services', 'Official event and wedding photography partner for KTMA activations.', 'Kandy', 0),
('Oshin Silva & Co.', 'Hospitality Partner', 'Hospitality and travel trade partner supporting KTMA member events.', 'Kandy', 0);
