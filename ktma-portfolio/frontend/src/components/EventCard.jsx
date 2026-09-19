import { Link } from 'react-router-dom';
import { resolveImage } from '../data/fallbackData';

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function EventCard({ event }) {
  const img = resolveImage(event.cover_image);
  return (
    <Link
      to={`/events/${event.id}`}
      className="group grid grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-teal-950/5 transition-transform hover:-translate-y-1 md:grid-cols-2"
    >
      <div className="relative h-64 overflow-hidden md:h-full">
        <img
          src={img}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-center p-8">
        <p className="eyebrow uppercase">{formatDate(event.event_date)} · {event.location}</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-teal-950">{event.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">{event.summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-800">
          View gallery
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
