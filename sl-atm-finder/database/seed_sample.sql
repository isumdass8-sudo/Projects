-- Small hand-picked sample dataset (~18 ATMs) for local development/testing,
-- before you run the OSM fetch+import scripts for full real coverage.
-- Coordinates are approximate city-center locations - good enough for testing
-- search/nearest-ATM logic, but verify before treating as production data.

USE sl_atm_finder;

INSERT INTO atms
  (bank_id, district_id, name, address, city, latitude, longitude,
   is_24_hours, cash_deposit, wheelchair_access, drive_through, foreign_card, source)
VALUES
-- Colombo
((SELECT bank_id FROM banks WHERE short_name='Sampath'), (SELECT district_id FROM districts WHERE name='Colombo'),
 'Sampath Bank - Colombo Fort', 'York Street, Colombo Fort', 'Colombo', 6.9344, 79.8428, TRUE, TRUE, TRUE, FALSE, TRUE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='ComBank'), (SELECT district_id FROM districts WHERE name='Colombo'),
 'Commercial Bank - Colombo Fort', 'Bristol Street, Colombo Fort', 'Colombo', 6.9350, 79.8440, TRUE, TRUE, FALSE, FALSE, TRUE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='BOC'), (SELECT district_id FROM districts WHERE name='Colombo'),
 'Bank of Ceylon - Head Office', 'BOC Square, Colombo 01', 'Colombo', 6.9355, 79.8430, TRUE, FALSE, TRUE, FALSE, TRUE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='HNB'), (SELECT district_id FROM districts WHERE name='Colombo'),
 'HNB - Nugegoda', 'High Level Road, Nugegoda', 'Colombo', 6.8720, 79.8890, TRUE, TRUE, FALSE, FALSE, FALSE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='PB'), (SELECT district_id FROM districts WHERE name='Colombo'),
 'People''s Bank - Pettah', 'Main Street, Pettah', 'Colombo', 6.9390, 79.8510, FALSE, FALSE, FALSE, FALSE, FALSE, 'manual'),

-- Gampaha / Negombo
((SELECT bank_id FROM banks WHERE short_name='Sampath'), (SELECT district_id FROM districts WHERE name='Gampaha'),
 'Sampath Bank - Negombo', 'Main Street, Negombo', 'Negombo', 7.2086, 79.8358, TRUE, TRUE, TRUE, FALSE, TRUE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='ComBank'), (SELECT district_id FROM districts WHERE name='Gampaha'),
 'Commercial Bank - Negombo', 'Colombo Road, Negombo', 'Negombo', 7.2095, 79.8375, TRUE, TRUE, FALSE, TRUE, TRUE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='BOC'), (SELECT district_id FROM districts WHERE name='Gampaha'),
 'Bank of Ceylon - Negombo', 'Rajapaksa Broadway, Negombo', 'Negombo', 7.2075, 79.8390, FALSE, FALSE, TRUE, FALSE, FALSE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='Seylan'), (SELECT district_id FROM districts WHERE name='Gampaha'),
 'Seylan Bank - Ja-Ela', 'Negombo Road, Ja-Ela', 'Ja-Ela', 7.0740, 79.8920, TRUE, FALSE, FALSE, FALSE, FALSE, 'manual'),

-- Kandy
((SELECT bank_id FROM banks WHERE short_name='HNB'), (SELECT district_id FROM districts WHERE name='Kandy'),
 'HNB - Kandy City Centre', 'Dalada Veediya, Kandy', 'Kandy', 7.2936, 80.6410, TRUE, TRUE, TRUE, FALSE, TRUE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='Sampath'), (SELECT district_id FROM districts WHERE name='Kandy'),
 'Sampath Bank - Kandy', 'Peradeniya Road, Kandy', 'Kandy', 7.2900, 80.6337, TRUE, TRUE, FALSE, FALSE, TRUE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='BOC'), (SELECT district_id FROM districts WHERE name='Kandy'),
 'Bank of Ceylon - Kandy', 'Dalada Veediya, Kandy', 'Kandy', 7.2925, 80.6400, FALSE, FALSE, TRUE, FALSE, FALSE, 'manual'),

-- Galle
((SELECT bank_id FROM banks WHERE short_name='ComBank'), (SELECT district_id FROM districts WHERE name='Galle'),
 'Commercial Bank - Galle Fort', 'Church Street, Galle Fort', 'Galle', 6.0281, 80.2170, TRUE, TRUE, FALSE, FALSE, TRUE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='Sampath'), (SELECT district_id FROM districts WHERE name='Galle'),
 'Sampath Bank - Galle', 'Wackwella Road, Galle', 'Galle', 6.0367, 80.2170, TRUE, FALSE, TRUE, FALSE, TRUE, 'manual'),

-- Kurunegala
((SELECT bank_id FROM banks WHERE short_name='BOC'), (SELECT district_id FROM districts WHERE name='Kurunegala'),
 'Bank of Ceylon - Kurunegala', 'Kandy Road, Kurunegala', 'Kurunegala', 7.4863, 80.3647, TRUE, TRUE, FALSE, FALSE, FALSE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='PB'), (SELECT district_id FROM districts WHERE name='Kurunegala'),
 'People''s Bank - Kurunegala', 'Puttalam Road, Kurunegala', 'Kurunegala', 7.4880, 80.3620, FALSE, FALSE, FALSE, FALSE, FALSE, 'manual'),

-- Jaffna
((SELECT bank_id FROM banks WHERE short_name='BOC'), (SELECT district_id FROM districts WHERE name='Jaffna'),
 'Bank of Ceylon - Jaffna', 'Hospital Road, Jaffna', 'Jaffna', 9.6615, 80.0255, TRUE, FALSE, TRUE, FALSE, FALSE, 'manual'),
((SELECT bank_id FROM banks WHERE short_name='ComBank'), (SELECT district_id FROM districts WHERE name='Jaffna'),
 'Commercial Bank - Jaffna', 'Stanley Road, Jaffna', 'Jaffna', 9.6640, 80.0230, TRUE, TRUE, FALSE, FALSE, TRUE, 'manual');
