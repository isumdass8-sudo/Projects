import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import GalleryGrid from '../components/GalleryGrid';
import { fetchWithFallback } from '../utils/api';
import { getFallbackEventWithGallery } from '../data/fallbackData';
import { resolveImage } from '../data/fallbackData';

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function EventDetail() {
  const { id } = useParams();
  const fallback = getFallbackEventWithGallery(id);
  const [event, setEvent] = useState(fallback);

  useEffect(() => {
    fetchWithFallback(`/events/${id}`, fallback).then(setEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!event) {
    return (
      <div className="container-ktma py-24 text-center">
        <h1 className="font-display text-2xl text-teal-950">Event not found</h1>
        <Link to="/events" className="btn-outline mt-6 inline-flex">Back to events</Link>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={`${formatDate(event.event_date)} \u00b7 ${event.location}`}
        title={event.title}
        description={event.summary}
        image={resolveImage(event.cover_image)}
      />
      <section className="container-ktma py-20">
        <Link to="/events" className="text-sm font-semibold text-teal-800 hover:underline">
          &larr; All events
        </Link>
        <h2 className="mt-6 font-display text-2xl font-semibold text-teal-950">Photo gallery</h2>
        <div className="mt-8">
          <GalleryGrid images={event.gallery || []} />
        </div>
      </section>
    </>
  );
}
