import { useEffect, useState } from 'react';
import ATMCard from '../components/ATMCard';
import { userApi } from '../api/client';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    userApi.getFavorites().then(setFavorites).catch(() => {});
    userApi.getRecentlyViewed().then(setRecent).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold mb-4">Your Favorite ATMs</h1>
      {favorites.length === 0 ? (
        <p className="text-ink/50 mb-10">
          No favorites yet. Tap "Add to Favorites" on any ATM's details page.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {favorites.map((atm) => (
            <ATMCard key={atm.atm_id} atm={atm} />
          ))}
        </div>
      )}

      <h2 className="text-xl font-display font-bold mb-4">Recently Viewed</h2>
      {recent.length === 0 ? (
        <p className="text-ink/50">Nothing viewed yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {recent.map((atm) => (
            <ATMCard key={atm.atm_id} atm={atm} />
          ))}
        </div>
      )}
    </div>
  );
}
