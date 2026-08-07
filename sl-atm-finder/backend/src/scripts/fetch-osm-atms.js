/**
 * Fetches ATM location data from OpenStreetMap via the Overpass API,
 * for a chosen set of Sri Lankan banks, and saves it to a JSON file.
 *
 * Run this LOCALLY (needs internet access to overpass-api.de):
 *   node src/scripts/fetch-osm-atms.js
 *
 * Then import the results into MySQL with:
 *   node src/scripts/import-osm-to-db.js
 *
 * NOTE: OSM tagging for Sri Lankan banks is inconsistent. Some ATMs are
 * tagged amenity=atm with operator=<bank name>, others sit inside
 * amenity=bank branch nodes. This script pulls both and does its best
 * to match against the bank list below. Always sanity-check the output
 * JSON before importing — OSM data quality varies a lot by area.
 */

const fs = require('fs');
const path = require('path');

// Overpass API is free and needs no key, but please be a good citizen:
// don't hammer it with rapid repeated requests.
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Bounding box roughly covering Sri Lanka (south, west, north, east)
const SRI_LANKA_BBOX = '5.9, 79.6, 9.9, 81.9';

// Banks to search for. Add/remove as needed - matches OSM's `operator` /
// `name` tags, which don't always exactly match official bank names.
const BANKS = [
  'Sampath Bank',
  'Commercial Bank',
  'Bank of Ceylon',
  "People's Bank",
  'Hatton National Bank',
  'Seylan Bank',
];

function buildQuery(bankName) {
  // Matches ATMs (amenity=atm) and bank branches (amenity=bank) whose
  // name or operator tag contains the bank name (case-insensitive).
  return `
    [out:json][timeout:60];
    (
      node["amenity"="atm"]["operator"~"${bankName}",i](${SRI_LANKA_BBOX});
      node["amenity"="atm"]["name"~"${bankName}",i](${SRI_LANKA_BBOX});
      node["amenity"="bank"]["name"~"${bankName}",i](${SRI_LANKA_BBOX});
    );
    out body;
  `;
}

function mapOsmNodeToAtm(node, bankName) {
  const tags = node.tags || {};
  return {
    osm_id: `node/${node.id}`,
    bank_name: bankName,
    name: tags.name || `${bankName} ATM`,
    address: [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
      .filter(Boolean)
      .join(', ') || tags['addr:full'] || 'Address not available',
    city: tags['addr:city'] || tags['addr:suburb'] || '',
    latitude: node.lat,
    longitude: node.lon,
    is_24_hours: tags.opening_hours === '24/7',
    service_type: tags.amenity === 'bank' ? 'branch' : 'atm',
    wheelchair_access: tags.wheelchair === 'yes',
    drive_through: tags.drive_through === 'yes',
    source: 'osm',
  };
}

async function fetchBankATMs(bankName) {
  const query = buildQuery(bankName);
  console.log(`Fetching OSM data for ${bankName}...`);

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Overpass API error for ${bankName}: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return (data.elements || []).map((node) => mapOsmNodeToAtm(node, bankName));
}

async function main() {
  const allResults = [];

  for (const bank of BANKS) {
    try {
      const results = await fetchBankATMs(bank);
      console.log(`  -> found ${results.length} locations for ${bank}`);
      allResults.push(...results);
      // Be polite to the free Overpass API - small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
      console.error(`  !! failed for ${bank}:`, err.message);
    }
  }

  const outputPath = path.join(__dirname, '../../data/osm-atms.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));

  console.log(`\n✅ Saved ${allResults.length} total ATM/branch records to ${outputPath}`);
  console.log('Review the file, then run: node src/scripts/import-osm-to-db.js');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
