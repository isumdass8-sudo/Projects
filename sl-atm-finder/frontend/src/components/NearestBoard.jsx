import { Link } from 'react-router-dom';

function Row({ label, value, unit }) {
  return (
    <div className="flex items-baseline justify-between border-b border-boardText/10 py-2">
      <span className="text-xs uppercase tracking-widest text-boardText/60">{label}</span>
      <span className="board-flicker text-lg">
        {value} <span className="text-sm text-boardText/70">{unit}</span>
      </span>
    </div>
  );
}

export default function NearestBoard({ atm }) {
  if (!atm) return null;

  return (
    <div className="board rounded p-5 max-w-md">
      <p className="text-xs uppercase tracking-[0.2em] text-boardText/50 mb-2">
        Nearest ATM
      </p>
      <h3 className="text-2xl font-semibold mb-1">{atm.name}</h3>
      <p className="text-boardText/70 text-sm mb-4">{atm.address}, {atm.city}</p>

      <Row label="Distance" value={atm.distanceKm} unit="km" />
      <Row label="Walking" value={atm.walkingMinutes} unit="min" />
      <Row label="Driving" value={atm.drivingMinutes} unit="min" />

      <div className="flex gap-3 mt-4">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${atm.latitude},${atm.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 text-center bg-gold text-ink font-medium py-2 rounded hover:brightness-95"
        >
          Get Directions
        </a>
        <Link
          to={`/atm/${atm.atm_id}`}
          className="flex-1 text-center border border-boardText/30 text-boardText py-2 rounded hover:bg-boardText/10"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
