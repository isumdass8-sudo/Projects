const ATM = require('../models/ATM');
const SearchHistory = require('../models/SearchHistory');

function parseFilters(query) {
  return {
    bank: query.bank,
    city: query.city,
    district: query.district,
    serviceType: query.serviceType,
    is24Hours: query.is24Hours === 'true',
    cashDeposit: query.cashDeposit === 'true',
    wheelchair: query.wheelchair === 'true',
    driveThrough: query.driveThrough === 'true',
    foreignCard: query.foreignCard === 'true',
  };
}

async function getAllATMs(req, res) {
  const limit = parseInt(req.query.limit) || 200;
  res.json(await ATM.getAll(limit));
}

async function getATM(req, res) {
  const atm = await ATM.getById(req.params.id);
  if (!atm) return res.status(404).json({ error: 'ATM not found' });

  // Log to recently-viewed if logged in
  if (req.user) {
    await SearchHistory.record(req.user.user_id, atm.atm_id).catch(() => {});
  }
  res.json(atm);
}

async function searchATMs(req, res) {
  const filters = parseFilters(req.query);
  res.json(await ATM.search(filters));
}

async function nearestATMs(req, res) {
  const { lat, lng, radiusKm, limit } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng query params are required' });
  }

  const filters = parseFilters(req.query);
  const results = await ATM.findNearest(parseFloat(lat), parseFloat(lng), {
    radiusKm: radiusKm ? parseFloat(radiusKm) : 10,
    limit: limit ? parseInt(limit) : 10,
    filters,
  });
  res.json(results);
}

async function emergencyNearest(req, res) {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng query params are required' });
  }
  // Emergency = 24hr ATMs within 2km, closest first
  const results = await ATM.findNearest(parseFloat(lat), parseFloat(lng), {
    radiusKm: 2,
    limit: 5,
    filters: { is24Hours: true },
  });
  res.json(results);
}

async function routeATMs(req, res) {
  const { originLat, originLng, destLat, destLng, bank, maxDeviationKm } = req.query;
  if (!originLat || !originLng || !destLat || !destLng) {
    return res.status(400).json({ error: 'originLat, originLng, destLat, destLng are required' });
  }
  const results = await ATM.findAlongRoute(
    parseFloat(originLat), parseFloat(originLng),
    parseFloat(destLat), parseFloat(destLng),
    { bank, maxDeviationKm: maxDeviationKm ? parseFloat(maxDeviationKm) : 5 }
  );
  res.json(results);
}

async function createATM(req, res) {
  try {
    const atm = await ATM.create(req.body);
    res.status(201).json(atm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function bulkCreateATMs(req, res) {
  try {
    const { atms } = req.body; // array of ATM objects, e.g. parsed from CSV on the frontend
    if (!Array.isArray(atms)) return res.status(400).json({ error: 'atms must be an array' });
    const result = await ATM.bulkCreate(atms);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateATM(req, res) {
  const atm = await ATM.update(req.params.id, req.body);
  res.json(atm);
}

async function deleteATM(req, res) {
  await ATM.remove(req.params.id);
  res.status(204).send();
}

module.exports = {
  getAllATMs, getATM, searchATMs, nearestATMs, emergencyNearest,
  routeATMs, createATM, bulkCreateATMs, updateATM, deleteATM,
};
