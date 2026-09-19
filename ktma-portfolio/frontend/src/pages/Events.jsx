import { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import EventCard from '../components/EventCard';
import { fetchWithFallback } from '../utils/api';
import { fallbackEvents } from '../data/fallbackData';
import heroImage from '../assets/gallery/event-cricket-action.jpg';

export default function Events() {
  const [events, setEvents] = useState(fallbackEvents);

  useEffect(() => {
    fetchWithFallback('/events', fallbackEvents).then(setEvents);
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Events & activities"
        title="Where the KTMA community comes together"
        description="From friendly tournaments to national tourism campaigns, these are the moments that bring our members together."
        image={heroImage}
      />

      <section className="container-ktma py-20">
        <div className="space-y-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {events.length === 0 && (
          <p className="text-center text-sm text-ink-500">No events published yet — check back soon.</p>
        )}
      </section>
    </>
  );
}
