import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import NearestBoard from '../components/NearestBoard';
import MapView from '../components/MapView';
import { banksApi, atmsApi } from '../api/client';
import { useGeolocation } from '../utils/useGeolocation';

export default function Home() {
  const navigate = useNavigate();
  const { position, error, loading, locate } = useGeolocation();
  const [banks, setBanks] = useState([]);
  const [nearest, setNearest] = useState(null);
  const [nearestList, setNearestList] = useState([]);

  useEffect(() => {
    banksApi.getAll().then(setBanks).catch(() => {});
  }, []);

  useEffect(() => {
    if (!position) return;
    atmsApi
      .nearest(position.lat, position.lng, { limit: 5 })
      .then((results) => {
        setNearestList(results);
        setNearest(results[0] || null);
      })
      .catch(() => {});
  }, [position]);

  function handleSearch(query) {
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <section className="mb-10">
        <p className="text-gold font-mono text-sm uppercase tracking-widest mb-2">
          Island-wide ATM &amp; branch locator
        </p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-ink leading-tight mb-4">
          Find the nearest cash, <br className="hidden sm:block" />
          wherever you are in Sri Lanka.
        </h1>
        <div className="max-w-xl">
          <SearchBar onSearch={handleSearch} />
        </div>
        <button
          onClick={locate}
          className="mt-3 text-sm font-medium text-harbor hover:text-harborLight underline underline-offset-4"
        >
          {loading ? 'Locating you...' : '📍 Use my current location'}
        </button>
        {error && <p className="text-coral text-sm mt-2">{error}</p>}
      </section>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Nearest ATM board + map */}
        <div className="lg:col-span-3 space-y-6">
          <div className="h-80 rounded overflow-hidden border border-mist">
            <MapView
              atms={nearestList}
              userLocation={position}
              focusLocation={position}
            />
          </div>

          {nearest ? (
            <NearestBoard atm={nearest} />
          ) : (
            <div className="bg-white border border-dashed border-mist rounded p-6 text-center text-ink/50">
              Tap "Use my current location" to see your nearest ATM here.
            </div>
          )}
        </div>

        {/* Popular banks */}
        <aside className="lg:col-span-2">
          <h2 className="font-display font-semibold text-lg mb-3">Popular Banks</h2>
          <div className="grid grid-cols-2 gap-2">
            {banks.slice(0, 12).map((bank) => (
              <button
                key={bank.bank_id}
                onClick={() => navigate(`/search?bank=${encodeURIComponent(bank.name)}`)}
                className="text-left px-3 py-2.5 bg-white border border-mist rounded hover:border-harbor transition-colors"
              >
                <span className="text-sm font-medium text-ink">{bank.short_name || bank.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-coral/10 border border-coral/30 rounded p-4">
            <h3 className="font-display font-semibold text-coral mb-1">Need cash urgently?</h3>
            <p className="text-sm text-ink/70 mb-3">
              Find the nearest 24-hour ATM within 2km.
            </p>
            <button
              onClick={() => navigate('/emergency')}
              className="text-sm px-4 py-2 bg-coral text-white rounded font-medium hover:brightness-95"
            >
              Emergency ATM Finder
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
