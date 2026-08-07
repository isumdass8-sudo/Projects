import { useEffect, useState } from 'react';
import ATMCard from '../components/ATMCard';
import MapView from '../components/MapView';
import { atmsApi } from '../api/client';
import { useGeolocation } from '../utils/useGeolocation';

export default function Emergency() {
  const { position, error, loading, locate } = useGeolocation();
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!position) return;
    atmsApi.emergency(position.lat, position.lng).then((r) => {
      setResults(r);
      setSearched(true);
    });
  }, [position]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-coral/10 border border-coral/30 rounded p-5 mb-6">
        <h1 className="text-2xl font-display font-bold text-coral mb-1">
          Emergency ATM Finder
        </h1>
        <p className="text-ink/70 text-sm mb-4">
          24-hour ATMs within 2 km of your current location, closest first.
        </p>
        <button
          onClick={locate}
          className="px-5 py-2.5 bg-coral text-white rounded font-medium"
        >
          {loading ? 'Locating...' : '📍 Find ATMs Near Me'}
        </button>
        {error && <p className="text-coral text-sm mt-2">{error}</p>}
      </div>

      {position && (
        <div className="h-64 rounded overflow-hidden border border-mist mb-6">
          <MapView atms={results} userLocation={position} focusLocation={position} />
        </div>
      )}

      {searched && (
        results.length === 0 ? (
          <p className="text-ink/50">No 24-hour ATMs found within 2km. Try the regular search instead.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {results.map((atm) => (
              <ATMCard key={atm.atm_id} atm={atm} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
