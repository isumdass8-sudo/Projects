import { useEffect, useState } from 'react';
import MapView from '../components/MapView';
import FilterPanel from '../components/FilterPanel';
import { atmsApi } from '../api/client';
import { useGeolocation } from '../utils/useGeolocation';

export default function MapPage() {
  const { position, locate, loading } = useGeolocation();
  const [atms, setAtms] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (position) {
      atmsApi.nearest(position.lat, position.lng, { radiusKm: 20, limit: 50, ...filters }).then(setAtms);
    } else {
      atmsApi.getAll(100).then(setAtms);
    }
  }, [position, filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display font-bold">Map View</h1>
        <button
          onClick={locate}
          className="text-sm px-4 py-2 bg-harbor text-paper rounded font-medium hover:bg-harborLight"
        >
          {loading ? 'Locating...' : '📍 Center on my location'}
        </button>
      </div>

      <FilterPanel active={filters} onChange={setFilters} />

      <div className="h-[32rem] mt-4 rounded overflow-hidden border border-mist">
        <MapView atms={atms} userLocation={position} focusLocation={position} />
      </div>
      <p className="text-xs text-ink/40 mt-2">Showing {atms.length} locations</p>
    </div>
  );
}
