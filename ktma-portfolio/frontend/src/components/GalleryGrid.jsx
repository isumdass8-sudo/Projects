import { useMemo, useState } from 'react';
import { resolveImage } from '../data/fallbackData';

export default function GalleryGrid({ images }) {
  const categories = useMemo(() => {
    const set = new Set(images.map((img) => img.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [images]);

  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = active === 'All' ? images : images.filter((img) => img.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === cat
                ? 'bg-teal-900 text-sand-50'
                : 'bg-white text-ink-700 ring-1 ring-teal-950/10 hover:ring-teal-900/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setLightbox(idx)}
            className={`group relative overflow-hidden rounded-2xl bg-teal-950/5 ${
              idx % 5 === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <img
              src={resolveImage(img.image_url)}
              alt={img.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-teal-950/70 via-teal-950/0 to-teal-950/0 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="p-3 text-left text-xs font-semibold text-sand-50">{img.title}</p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-500">No photos in this category yet.</p>
      )}

      {lightbox !== null && filtered[lightbox] && (
        <Lightbox
          images={filtered}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={setLightbox}
        />
      )}
    </div>
  );
}

function Lightbox({ images, index, onClose, onNavigate }) {
  const img = images[index];

  const go = (dir) => {
    const next = (index + dir + images.length) % images.length;
    onNavigate(next);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-teal-950/95 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-sand-50/10 text-sand-50 hover:bg-sand-50/20"
        onClick={onClose}
        aria-label="Close"
      >
        &#10005;
      </button>

      <button
        className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-sand-50/10 text-sand-50 hover:bg-sand-50/20 md:left-8"
        onClick={(e) => { e.stopPropagation(); go(-1); }}
        aria-label="Previous image"
      >
        &#8249;
      </button>

      <figure className="max-h-[85vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <img
          src={resolveImage(img.image_url)}
          alt={img.title}
          className="max-h-[75vh] w-full rounded-xl object-contain"
        />
        <figcaption className="mt-4 text-center text-sm font-medium text-sand-100">
          {img.title}
        </figcaption>
      </figure>

      <button
        className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-sand-50/10 text-sand-50 hover:bg-sand-50/20 md:right-8"
        onClick={(e) => { e.stopPropagation(); go(1); }}
        aria-label="Next image"
      >
        &#8250;
      </button>
    </div>
  );
}
