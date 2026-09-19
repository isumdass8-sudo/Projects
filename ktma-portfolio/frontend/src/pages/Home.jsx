import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import DestinationCard from '../components/DestinationCard';
import { fetchWithFallback } from '../utils/api';
import { fallbackDestinations, fallbackGallery, resolveImage } from '../data/fallbackData';

import heroImage from '../assets/gallery/123456789.jpg';
import duoImage from '../assets/gallery/event-duo.jpg';
import tourismDayImage from '../assets/gallery/tourism-worldtourismday.jpg';

export default function Home() {
  const [destinations, setDestinations] = useState(fallbackDestinations);
  const [gallery, setGallery] = useState(fallbackGallery);
  const myTwoPhoto = gallery.find((image) => image.image_url === 'my 2.jpg')
    || fallbackGallery.find((image) => image.image_url === 'my 2.jpg');
  const communityGallery = gallery
    .filter((image) => !/royal/i.test(image.title || image.name || ''))
    .filter((image) => image.image_url !== 'event-gathering.jpg')
    .filter((image) => image.image_url !== 'my 2.jpg')
    .slice(0, 7);
  const communityPreview = myTwoPhoto ? [myTwoPhoto, ...communityGallery] : communityGallery;

  useEffect(() => {
    fetchWithFallback('/destinations', fallbackDestinations).then((data) =>
      setDestinations(
        data.map((destination) =>
          destination.id === 1
            ? { ...destination, image_url: '987654321.jpg' }
            : destination.id === 4
              ? { ...destination, image_url: 'my 7.jpg' }
              : destination,
        ),
      ),
    );
    fetchWithFallback('/gallery', fallbackGallery).then(setGallery);
  }, []);

  return (
    <>
      {/* HERO */}
      <section
        className="relative overflow-hidden bg-sand-50 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(247, 239, 227, 0.9), rgba(247, 239, 227, 0.8)), url(${heroImage})`,
        }}
      >
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-forest-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl" />

        <div className="container-ktma relative grid grid-cols-1 items-center gap-12 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="eyebrow uppercase">Kandy Tourism Marketing Association</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] text-teal-950 md:text-5xl lg:text-6xl">
              Sri Lanka&rsquo;s cultural capital, <span className="text-clay-600">told by the people</span> who live it.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-500">
              KTMA unites Kandy&rsquo;s hoteliers, guides, and tourism businesses to promote sustainable,
              authentic travel across the hill country — from sacred temples to misty tea estates.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/about" className="btn-primary">
                Discover KTMA
              </Link>
              <Link to="/contact" className="btn-outline">
                Get in touch
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-teal-950/10 pt-8">
              <Stat value="50+" label="Member businesses" />
              <Stat value="12+" label="Annual events" />
              <Stat value="2018" label="Founded" />
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div
              className="relative aspect-[4/5] overflow-hidden shadow-soft"
              style={{ borderRadius: '58% 42% 61% 39% / 45% 48% 52% 55%' }}
            >
              <img src={heroImage} alt="Visitors enjoying Kandy tourism" className="h-full w-full object-cover" />
            </div>
            <div
              className="absolute -bottom-6 -left-8 hidden h-32 w-32 items-center justify-center bg-gold-500 p-6 text-center shadow-soft sm:flex"
              style={{ borderRadius: '42% 58% 39% 61% / 55% 45% 55% 45%' }}
            >
              <span className="font-display text-sm font-semibold leading-tight text-teal-950">
                Discover Sri lanka
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section id="mission" className="border-y border-teal-950/8 bg-sand-100">
        <div className="container-ktma grid grid-cols-1 gap-10 py-16 md:grid-cols-2 md:py-20">
          <div className="rounded-3xl bg-teal-950 p-8 text-sand-50 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-400">Our Mission</span>
            <p className="mt-4 font-display text-2xl leading-snug">
              To unite local tourism stakeholders and elevate Kandy&rsquo;s hospitality industry through
              strategic global marketing, sustainable practices, and authentic cultural experiences.
            </p>
          </div>
          <div className="rounded-3xl bg-sand-100 p-8 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-wide text-clay-600">Our Vision</span>
            <p className="mt-4 font-display text-2xl leading-snug text-teal-950">
              To position Kandy as Asia&rsquo;s premier, sustainable, and culturally vibrant travel destination.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="container-ktma py-20">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Featured destinations"
            title="Where Kandy invites you to wander"
            description="A curated look at the temples, landscapes, and traditions that make the hill capital unforgettable."
          />
          <Link to="/contact" className="btn-outline shrink-0">Plan a visit</Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </section>

      {/* HIGHLIGHT / ANNOUNCEMENT */}
      <section className="bg-sand-100 py-20">
        <div className="container-ktma grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="order-2 grid grid-cols-2 gap-4 md:order-1">
            <img src={duoImage} alt="KTMA members together" className="h-full w-full rounded-2xl bg-sand-200 object-contain" style={{ aspectRatio: '3/4' }} />
            <img src={tourismDayImage} alt="World Tourism Day celebration" className="mt-8 h-full w-full rounded-2xl object-cover" style={{ aspectRatio: '3/4' }} />
          </div>
          <div className="order-1 md:order-2">
            <p className="eyebrow uppercase">Latest highlight</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-teal-950 md:text-4xl">
              KTMA Cricket Tournament brought members together on the field
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-500">
              Hoteliers, guides, and tourism partners gathered at Katukelle Grounds for a day of friendly
              competition, traditional Kandyan dance performances, and an awards presentation celebrating
              the strength of the KTMA community.
            </p>
            <Link to="/events" className="btn-gold mt-7 inline-flex">
              See all events
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="container-ktma py-20">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="From the community"
            title="Moments from KTMA gatherings"
          />
          <Link to="/gallery" className="btn-outline shrink-0">View full gallery</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {communityPreview.slice(0, 8).map((img) => (
            <div key={img.id} className="aspect-square overflow-hidden rounded-2xl">
              <img
                src={resolveImage(img.image_url)}
                alt={img.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-ktma pb-20">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-teal-950 px-8 py-14 text-center text-sand-50 md:px-16">
          <h2 className="max-w-xl font-display text-3xl font-semibold text-sand-50 md:text-4xl">
            Ready to grow your tourism business with KTMA?
          </h2>
          <p className="max-w-lg text-sm text-sand-200/85 md:text-base">
            Join a network of hoteliers, guides, and tourism businesses working together to market
            Kandy to the world.
          </p>
          <Link to="/contact" className="btn-gold">
            Become a member
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold text-teal-950">{value}</p>
      <p className="mt-1 text-xs leading-snug text-ink-500">{label}</p>
    </div>
  );
}
