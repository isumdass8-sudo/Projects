import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ATMCard from '../components/ATMCard';
import { atmsApi, districtsApi } from '../api/client';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({});
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  const query = searchParams.get('q') || '';
  const bankParam = searchParams.get('bank') || '';

  useEffect(() => {
    districtsApi.getAll().then(setDistricts).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const searchFilters = {
      bank: bankParam || query,
      city: !bankParam ? query : undefined,
      ...filters,
    };
    atmsApi
      .search(searchFilters)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query, bankParam, filters]);

  function handleSearch(newQuery) {
    setSearchParams(newQuery ? { q: newQuery } : {});
  }

  function handleDistrict(districtName) {
    setSearchParams(districtName ? { district: districtName } : {});
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold mb-4">Search ATMs</h1>

      <div className="max-w-xl mb-4">
        <SearchBar onSearch={handleSearch} placeholder="Bank, city, or district..." />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select
          className="text-sm px-3 py-2 rounded border border-mist bg-white"
          onChange={(e) => handleDistrict(e.target.value)}
          defaultValue=""
        >
          <option value="">All districts</option>
          {districts.map((d) => (
            <option key={d.district_id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      <FilterPanel active={filters} onChange={setFilters} />

      <div className="mt-6">
        {loading ? (
          <p className="text-ink/50">Searching...</p>
        ) : results.length === 0 ? (
          <p className="text-ink/50">No ATMs found. Try a different search or fewer filters.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {results.map((atm) => (
              <ATMCard key={atm.atm_id} atm={atm} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
