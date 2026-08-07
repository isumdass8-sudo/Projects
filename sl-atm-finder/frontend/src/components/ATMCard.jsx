import { Link } from 'react-router-dom';

const badge = (label) => (
  <span
    key={label}
    className="text-[11px] px-2 py-0.5 rounded-full bg-harbor/10 text-harbor font-medium"
  >
    {label}
  </span>
);

export default function ATMCard({ atm }) {
  const badges = [];
  if (atm.is_24_hours) badges.push('24 Hours');
  if (atm.cash_deposit) badges.push('Cash Deposit');
  if (atm.wheelchair_access) badges.push('Wheelchair');
  if (atm.drive_through) badges.push('Drive-Through');
  if (atm.foreign_card) badges.push('Foreign Card');

  return (
    <Link
      to={`/atm/${atm.atm_id}`}
      className="block bg-white rounded border border-mist p-4 hover:border-harbor transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-harbor font-semibold uppercase tracking-wide">
            {atm.bank_name || atm.bank_short_name}
          </p>
          <h3 className="font-display font-semibold text-ink mt-0.5">{atm.name}</h3>
          <p className="text-sm text-ink/60 mt-1">{atm.address}, {atm.city}</p>
        </div>
        {typeof atm.distanceKm === 'number' && (
          <div className="text-right shrink-0">
            <p className="font-mono text-lg font-semibold text-harbor">{atm.distanceKm} km</p>
            <p className="text-xs text-ink/50">{atm.drivingMinutes} min drive</p>
          </div>
        )}
      </div>
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">{badges.map(badge)}</div>
      )}
    </Link>
  );
}
