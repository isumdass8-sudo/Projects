const FILTERS = [
  { key: 'is24Hours', label: '24 Hours' },
  { key: 'cashDeposit', label: 'Cash Deposit' },
  { key: 'wheelchair', label: 'Wheelchair Access' },
  { key: 'driveThrough', label: 'Drive-Through' },
  { key: 'foreignCard', label: 'Foreign Card Accepted' },
];

export default function FilterPanel({ active, onChange }) {
  function toggle(key) {
    onChange({ ...active, [key]: !active[key] });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => toggle(key)}
          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
            active[key]
              ? 'bg-harbor text-paper border-harbor'
              : 'bg-white text-ink/70 border-mist hover:border-harbor'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
