const EARTH_RADIUS_KM = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate great-circle distance between two lat/lng points using
 * the Haversine formula. Returns distance in kilometers.
 */
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Rough travel time estimates given a straight-line distance.
 * These are estimates only — real routing (Leaflet Routing Machine / OSRM)
 * gives accurate road-based times. Useful as a quick fallback.
 */
function estimateTravelTime(distanceKm) {
  const walkingSpeedKmh = 5;
  const drivingSpeedKmh = 30; // conservative, accounts for city traffic

  return {
    walkingMinutes: Math.round((distanceKm / walkingSpeedKmh) * 60),
    drivingMinutes: Math.round((distanceKm / drivingSpeedKmh) * 60),
  };
}

module.exports = { haversineDistanceKm, estimateTravelTime };
