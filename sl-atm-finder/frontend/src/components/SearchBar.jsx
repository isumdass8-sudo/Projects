import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search by bank, city, or district...' }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 rounded border border-mist focus:outline-none focus:ring-2 focus:ring-harbor/40"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-harbor text-paper font-medium rounded hover:bg-harborLight"
      >
        Search
      </button>
    </form>
  );
}
