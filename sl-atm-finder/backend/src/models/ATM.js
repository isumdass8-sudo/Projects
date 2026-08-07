const { pool } = require('../config/db');
const { haversineDistanceKm, estimateTravelTime } = require('../utils/haversine');

const BASE_SELECT = `
  SELECT
    a.atm_id, a.name, a.address, a.city, a.latitude, a.longitude,
    a.service_type, a.is_24_hours, a.cash_deposit, a.wheelchair_access,
    a.drive_through, a.foreign_card, a.status,
    b.bank_id, b.name AS bank_name, b.short_name AS bank_short_name,
    d.district_id, d.name AS district_name
  FROM atms a
  JOIN banks b ON a.bank_id = b.bank_id
  LEFT JOIN districts d ON a.district_id = d.district_id
`;

const ATM = {
  async getAll(limit = 200) {
    const [rows] = await pool.query(`${BASE_SELECT} ORDER BY a.name LIMIT ?`, [limit]);
    return rows;
  },

  async getById(atmId) {
    const [rows] = await pool.query(`${BASE_SELECT} WHERE a.atm_id = ?`, [atmId]);
    return rows[0] || null;
  },

  async searchByBank(bankName) {
    const [rows] = await pool.query(
      `${BASE_SELECT} WHERE b.name LIKE ? OR b.short_name LIKE ? ORDER BY a.city`,
      [`%${bankName}%`, `%${bankName}%`]
    );
    return rows;
  },

  async searchByCity(city) {
    const [rows] = await pool.query(`${BASE_SELECT} WHERE a.city LIKE ? ORDER BY b.name`, [
      `%${city}%`,
    ]);
    return rows;
  },

  async searchByDistrict(districtName) {
    const [rows] = await pool.query(`${BASE_SELECT} WHERE d.name = ? ORDER BY a.city, b.name`, [
      districtName,
    ]);
    return rows;
  },

  /**
   * Generic search with optional filters.
   * filters: { bank, city, district, is24Hours, cashDeposit, wheelchair, driveThrough, foreignCard, serviceType }
   */
  async search(filters = {}) {
    const conditions = [];
    const params = [];

    if (filters.bank) {
      conditions.push('(b.name LIKE ? OR b.short_name LIKE ?)');
      params.push(`%${filters.bank}%`, `%${filters.bank}%`);
    }
    if (filters.city) {
      conditions.push('a.city LIKE ?');
      params.push(`%${filters.city}%`);
    }
    if (filters.district) {
      conditions.push('d.name = ?');
      params.push(filters.district);
    }
    if (filters.serviceType) {
      conditions.push('a.service_type = ?');
      params.push(filters.serviceType);
    }
    if (filters.is24Hours) {
      conditions.push('a.is_24_hours = TRUE');
    }
    if (filters.cashDeposit) {
      conditions.push('a.cash_deposit = TRUE');
    }
    if (filters.wheelchair) {
      conditions.push('a.wheelchair_access = TRUE');
    }
    if (filters.driveThrough) {
      conditions.push('a.drive_through = TRUE');
    }
    if (filters.foreignCard) {
      conditions.push('a.foreign_card = TRUE');
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [rows] = await pool.query(`${BASE_SELECT} ${whereClause} ORDER BY a.name`, params);
    return rows;
  },

  /**
   * Find nearest ATMs to a given point.
   * Fetches a bounding-box subset first (fast, uses the lat/lng index),
   * then ranks precisely with the Haversine formula in JS.
   * radiusKm limits how far out to look; limit caps result count.
   */
  async findNearest(lat, lng, { radiusKm = 10, limit = 10, filters = {} } = {}) {
    // Rough bounding box to pre-filter rows before precise distance calc.
    const latDelta = radiusKm / 111; // ~111km per degree latitude
    const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

    const conditions = [
      'a.latitude BETWEEN ? AND ?',
      'a.longitude BETWEEN ? AND ?',
      "a.status = 'active'",
    ];
    const params = [lat - latDelta, lat + latDelta, lng - lngDelta, lng + lngDelta];

    if (filters.bank) {
      conditions.push('(b.name LIKE ? OR b.short_name LIKE ?)');
      params.push(`%${filters.bank}%`, `%${filters.bank}%`);
    }
    if (filters.is24Hours) conditions.push('a.is_24_hours = TRUE');
    if (filters.cashDeposit) conditions.push('a.cash_deposit = TRUE');
    if (filters.wheelchair) conditions.push('a.wheelchair_access = TRUE');
    if (filters.driveThrough) conditions.push('a.drive_through = TRUE');
    if (filters.foreignCard) conditions.push('a.foreign_card = TRUE');

    const [rows] = await pool.query(
      `${BASE_SELECT} WHERE ${conditions.join(' AND ')}`,
      params
    );

    const withDistance = rows
      .map((atm) => {
        const distanceKm = haversineDistanceKm(lat, lng, atm.latitude, atm.longitude);
        const { walkingMinutes, drivingMinutes } = estimateTravelTime(distanceKm);
        return { ...atm, distanceKm: Math.round(distanceKm * 100) / 100, walkingMinutes, drivingMinutes };
      })
      .filter((atm) => atm.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit);

    return withDistance;
  },

  /**
   * Find ATMs of a given bank roughly along a route between two points.
   * Simple approach for a student project: checks perpendicular distance
   * from the straight line between origin and destination.
   */
  async findAlongRoute(originLat, originLng, destLat, destLng, { bank, maxDeviationKm = 5 } = {}) {
    const rows = await this.search({ bank });

    const routeDistanceKm = haversineDistanceKm(originLat, originLng, destLat, destLng);

    return rows
      .map((atm) => {
        const distFromOrigin = haversineDistanceKm(originLat, originLng, atm.latitude, atm.longitude);
        const distFromDest = haversineDistanceKm(atm.latitude, atm.longitude, destLat, destLng);
        // How much of a detour this ATM adds vs going straight
        const detourKm = distFromOrigin + distFromDest - routeDistanceKm;
        return { ...atm, detourKm: Math.round(detourKm * 100) / 100 };
      })
      .filter((atm) => atm.detourKm <= maxDeviationKm)
      .sort((a, b) => a.detourKm - b.detourKm);
  },

  async create(atm) {
    const {
      bank_id, district_id, name, address, city, latitude, longitude,
      service_type = 'atm', is_24_hours = false, cash_deposit = false,
      wheelchair_access = false, drive_through = false, foreign_card = false,
      source = 'manual', osm_id = null,
    } = atm;

    const [result] = await pool.query(
      `INSERT INTO atms
        (bank_id, district_id, name, address, city, latitude, longitude,
         service_type, is_24_hours, cash_deposit, wheelchair_access,
         drive_through, foreign_card, source, osm_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bank_id, district_id, name, address, city, latitude, longitude,
        service_type, is_24_hours, cash_deposit, wheelchair_access,
        drive_through, foreign_card, source, osm_id]
    );
    return this.getById(result.insertId);
  },

  async bulkCreate(atmList) {
    if (!atmList.length) return { inserted: 0 };
    const values = atmList.map((a) => [
      a.bank_id, a.district_id || null, a.name, a.address, a.city,
      a.latitude, a.longitude, a.service_type || 'atm',
      !!a.is_24_hours, !!a.cash_deposit, !!a.wheelchair_access,
      !!a.drive_through, !!a.foreign_card, a.source || 'csv_import', a.osm_id || null,
    ]);
    const [result] = await pool.query(
      `INSERT INTO atms
        (bank_id, district_id, name, address, city, latitude, longitude,
         service_type, is_24_hours, cash_deposit, wheelchair_access,
         drive_through, foreign_card, source, osm_id)
       VALUES ?`,
      [values]
    );
    return { inserted: result.affectedRows };
  },

  async update(atmId, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return this.getById(atmId);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k]);
    await pool.query(`UPDATE atms SET ${setClause} WHERE atm_id = ?`, [...values, atmId]);
    return this.getById(atmId);
  },

  async remove(atmId) {
    await pool.query('DELETE FROM atms WHERE atm_id = ?', [atmId]);
  },

  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM atms');
    return rows[0].total;
  },
};

module.exports = ATM;
