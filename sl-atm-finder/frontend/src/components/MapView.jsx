import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix default marker icon paths (Vite/webpack bundling breaks Leaflet's
// default asset resolution) - load icons from a CDN instead.
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#C99A2E;border:3px solid white;box-shadow:0 0 0 2px rgba(0,0,0,0.2)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// Sri Lanka's approximate geographic center - default view when no
// user location or search result is available yet.
const SRI_LANKA_CENTER = [7.8731, 80.7718];

export default function MapView({ atms = [], userLocation, focusLocation }) {
  const center = focusLocation
    ? [focusLocation.lat, focusLocation.lng]
    : userLocation
    ? [userLocation.lat, userLocation.lng]
    : SRI_LANKA_CENTER;

  return (
    <MapContainer center={center} zoom={userLocation ? 14 : 8} className="leaflet-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap center={focusLocation ? [focusLocation.lat, focusLocation.lng] : null} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {atms.map((atm) => (
        <Marker key={atm.atm_id} position={[atm.latitude, atm.longitude]} icon={defaultIcon}>
          <Popup>
            <strong>{atm.name}</strong>
            <br />
            {atm.bank_name}
            <br />
            {atm.address}, {atm.city}
            {typeof atm.distanceKm === 'number' && (
              <>
                <br />
                {atm.distanceKm} km away
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
