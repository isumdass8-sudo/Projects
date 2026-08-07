/**
 * Imports the ATM records fetched by fetch-osm-atms.js into MySQL.
 * Matches each record's bank_name against the `banks` table (creating
 * best-effort matches) and inserts into `atms`.
 *
 * Run: node src/scripts/import-osm-to-db.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const DATA_PATH = path.join(__dirname, '../../data/osm-atms.json');

async function getBankIdMap() {
  const [banks] = await pool.query('SELECT bank_id, name, short_name FROM banks');
  return banks;
}

function findBankId(banks, bankName) {
  const lower = bankName.toLowerCase();
  const match = banks.find(
    (b) =>
      b.name.toLowerCase().includes(lower) ||
      lower.includes(b.name.toLowerCase()) ||
      (b.short_name && lower.includes(b.short_name.toLowerCase()))
  );
  return match ? match.bank_id : null;
}

async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`No data file found at ${DATA_PATH}.`);
    console.error('Run "node src/scripts/fetch-osm-atms.js" first.');
    process.exit(1);
  }

  const records = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const banks = await getBankIdMap();

  let inserted = 0;
  let skipped = 0;

  for (const record of records) {
    const bankId = findBankId(banks, record.bank_name);
    if (!bankId) {
      console.warn(`  ! No bank match for "${record.bank_name}", skipping: ${record.name}`);
      skipped += 1;
      continue;
    }

    try {
      await pool.query(
        `INSERT INTO atms
          (bank_id, name, address, city, latitude, longitude, service_type,
           is_24_hours, wheelchair_access, drive_through, source, osm_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'osm', ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [
          bankId, record.name, record.address, record.city,
          record.latitude, record.longitude, record.service_type,
          record.is_24_hours, record.wheelchair_access, record.drive_through,
          record.osm_id,
        ]
      );
      inserted += 1;
    } catch (err) {
      console.error(`  ! Failed to insert ${record.name}:`, err.message);
      skipped += 1;
    }
  }

  console.log(`\n✅ Import complete. Inserted: ${inserted}, skipped: ${skipped}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
