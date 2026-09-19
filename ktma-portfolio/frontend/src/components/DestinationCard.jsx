import { resolveImage } from '../data/fallbackData';

export default function DestinationCard({ destination }) {
  const img = destination.image_url?.startsWith('http')
    ? destination.image_url
    : resolveImage(destination.image_url);

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-teal-950/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img
          src={img}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-sand-50/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-900">
          {destination.category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-teal-950">{destination.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {destination.description || destination.summary}
        </p>
      </div>
    </article>
  );
}
