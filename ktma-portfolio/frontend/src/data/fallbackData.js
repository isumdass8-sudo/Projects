// Fallback content mirrors database/schema.sql seed data.
// The site fetches from the Express + MySQL API first; if that request
// fails (e.g. backend not running yet), these keep the UI fully populated
// for demos, screenshots, and local development without a DB.

import eventTeamPanorama from '../assets/gallery/event-team-panorama.jpg';
import eventTeamFull from '../assets/gallery/event-team-full.jpg';
import eventCricketAction from '../assets/gallery/event-cricket-action.jpg';
import eventCulturalDance from '../assets/gallery/event-cultural-dance.jpg';
import eventGathering from '../assets/gallery/event-gathering.jpg';
import eventAwardsTent from '../assets/gallery/event-awards-tent.jpg';
import eventTeamDusk from '../assets/gallery/event-team-dusk.jpg';
import eventGroup1 from '../assets/gallery/event-group-1.jpg';
import eventDuo from '../assets/gallery/event-duo.jpg';
import tourismWorldTourismDay from '../assets/gallery/tourism-worldtourismday.jpg';
import tourismCoconut1 from '../assets/gallery/tourism-coconut-1.jpg';
import nineArche from '../assets/gallery/nine-arche.jpg';
import executiveCommittee from '../assets/gallery/executive-committee.jpg';
import newDestinationImage from '../assets/gallery/987654321.jpg';
import my1 from '../assets/gallery/my 1.jpg';
import my2 from '../assets/gallery/my 2.jpg';
import my3 from '../assets/gallery/my 3.jpg';
import my4 from '../assets/gallery/my 4.jpg';
import my5 from '../assets/gallery/my 5.jpg';
import my6 from '../assets/gallery/my 6.jpg';
import my7 from '../assets/gallery/my 7.jpg';


export const galleryImages = {
  'event-team-panorama.jpg': eventTeamPanorama,
  'event-team-full.jpg': eventTeamFull,
  'event-cricket-action.jpg': eventCricketAction,
  'event-cultural-dance.jpg': eventCulturalDance,
  'event-gathering.jpg': eventGathering,
  'event-awards-tent.jpg': eventAwardsTent,
  'event-team-dusk.jpg': eventTeamDusk,
  'event-group-1.jpg': eventGroup1,
  'event-duo.jpg': eventDuo,
  'tourism-worldtourismday.jpg': tourismWorldTourismDay,
  'tourism-coconut-1.jpg': tourismCoconut1,
  'nine-arche.jpg': nineArche,
  'executive-committee.jpg': executiveCommittee,
  '987654321.jpg': newDestinationImage,
  'my 1.jpg': my1,
  'my 2.jpg': my2,
  'my 3.jpg': my3,
  'my 4.jpg': my4,
  'my 5.jpg': my5,
  'my 6.jpg': my6,
  'my 7.jpg': my7,
};

export const resolveImage = (filename) => galleryImages[filename] || '';

export const fallbackCommittee = [
  { id: 1, full_name: 'Namal Danasekara', role: 'Main Advisor', term: '2026-2028', photo_url: 'executive-committee.jpg' },
  { id: 2, full_name: 'Chethiya Yatawara', role: 'Advisor', term: '2026-2028', photo_url: 'executive-committee.jpg' },
  { id: 3, full_name: 'Azard Suhood', role: 'President', term: '2026-2028', photo_url: 'executive-committee.jpg' },
  { id: 4, full_name: 'Sena Bandara', role: 'Secretary', term: '2026-2028', photo_url: 'executive-committee.jpg' },
  { id: 5, full_name: 'Priyantha Dissanayake', role: 'Treasurer', term: '2026-2028', photo_url: 'executive-committee.jpg' },
  { id: 6, full_name: 'Angelo Ferdinand', role: 'National Organizer', term: '2026-2028', photo_url: 'executive-committee.jpg' },
  { id: 7, full_name: 'Sampath Chaminda Lal', role: 'Vice Secretary', term: '2026-2028', photo_url: 'executive-committee.jpg' },
  { id: 8, full_name: 'W.M.J.P. Wijekoon', role: 'Vice President', term: '2026-2028', photo_url: 'executive-committee.jpg' },
  { id: 9, full_name: 'Nalin Nanayakkara', role: 'Accountant', term: '2026-2028', photo_url: 'executive-committee.jpg' },
];

export const fallbackBusinessMembers = [
  { id: 1, business_name: 'Sanura Silks', category: 'Retail & Handloom', description: 'Traditional Kandyan handloom textiles and silk products supporting local artisans.', location: 'Kandy City Centre', featured: 1 },
  { id: 2, business_name: 'Abey Silk Centre', category: 'Retail & Handloom', description: 'Fine silks and souvenirs for the discerning traveller.', location: 'Kandy', featured: 0 },
  { id: 3, business_name: 'Eventro Photography', category: 'Event Services', description: 'Official event and wedding photography partner for KTMA activations.', location: 'Kandy', featured: 0 },
  { id: 4, business_name: 'Oshin Silva & Co.', category: 'Hospitality Partner', description: 'Hospitality and travel trade partner supporting KTMA member events.', location: 'Kandy', featured: 0 },
];

export const fallbackDestinations = [
  {
    id: 1,
    name: 'Temple of the Sacred Tooth Relic',
    summary: "Sri Lanka's most venerated Buddhist shrine.",
    description:
      'Set on the edge of Kandy Lake, the Temple of the Sacred Tooth Relic (Sri Dalada Maligawa) is the spiritual heart of the city and a UNESCO World Heritage Site, drawing pilgrims and travellers from across the globe.',
    image_url: '987654321.jpg',
    category: 'Heritage',
  },
  {
    id: 2,
    name: 'Nine Arch Bridge & Hill Country Rail',
    summary: "An icon of Sri Lanka's hill country.",
    description:
      'Wind through misty tea estates aboard the scenic highland railway, crossing colonial-era viaducts framed by emerald plantations.',
    image_url: 'nine-arche.jpg',
    category: 'Nature',
  },
  {
    id: 3,
    name: 'Royal Botanical Gardens, Peradeniya',
    summary: 'A living museum of tropical flora.',
    description:
      "Just outside Kandy, 147 acres of orchid houses, giant bamboo, and a canopy of century-old trees make this one of Asia's finest botanical gardens.",
    image_url: 'event-gathering.jpg',
    category: 'Nature',
  },
  {
    id: 4,
    name: 'Traditional Kandyan Culture',
    summary: 'Dance, drumming, and centuries of ceremony.',
    description:
      'Experience the rhythm of the Kandyan dance tradition — vibrant costumes, ritual drumming, and choreography passed down through generations.',
    image_url: 'my 7.jpg',
    category: 'Culture',
  },
];

export const fallbackEvents = [
  {
    id: 1,
    title: 'KTMA Cricket Tournament',
    event_date: '2025-12-17',
    location: 'Katukelle Grounds, Kandy',
    summary:
      'Members, hoteliers and tourism partners came together for a friendly cricket tournament celebrating the KTMA community, complete with traditional dance performances and an awards presentation.',
    cover_image: 'event-team-panorama.jpg',
  },
  {
    id: 2,
    title: 'World Tourism Day 2023',
    event_date: '2023-09-27',
    location: 'Kandy City',
    summary:
      'KTMA joined the global "I Love Sri Lanka" campaign for World Tourism Day, welcoming visitors and promoting Kandy as a premier cultural destination.',
    cover_image: 'tourism-worldtourismday.jpg',
  },
];

export const fallbackGallery = [
  { id: 1, title: 'Cricket Tournament — Team Panorama', category: 'Events', image_url: 'event-team-panorama.jpg', event_id: 1 },
  { id: 2, title: 'Cricket Tournament — Full Squad', category: 'Events', image_url: 'event-team-full.jpg', event_id: 1 },
  { id: 3, title: 'Cricket Tournament — Match Action', category: 'Events', image_url: 'event-cricket-action.jpg', event_id: 1 },
  { id: 4, title: 'Cultural Dance Performance', category: 'Culture', image_url: 'event-cultural-dance.jpg', event_id: 1 },
  { id: 5, title: 'Members Gathering', category: 'Events', image_url: 'event-gathering.jpg', event_id: 1 },
  { id: 6, title: 'Awards Presentation', category: 'Events', image_url: 'event-awards-tent.jpg', event_id: 1 },
  { id: 7, title: 'Team at Dusk', category: 'Events', image_url: 'event-team-dusk.jpg', event_id: 1 },
  { id: 8, title: 'Association Members', category: 'Events', image_url: 'event-group-1.jpg', event_id: 1 },
  { id: 9, title: 'Association Duo', category: 'Events', image_url: 'event-duo.jpg', event_id: 1 },
  { id: 10, title: 'World Tourism Day — Visit Sri Lanka', category: 'Culture', image_url: 'tourism-worldtourismday.jpg', event_id: 2 },
  { id: 11, title: 'World Tourism Day — Nine Arch Bridge', category: 'Culture', image_url: 'nine-arche.jpg', event_id: 2 },
  { id: 12, title: 'Executive Committee 2026–2028', category: 'Association', image_url: 'executive-committee.jpg', event_id: null },
  { id: 13, title: 'Kandyan Cultural Performance', category: 'Culture', image_url: 'my 1.jpg', event_id: 1 },
  { id: 14, title: 'KTMA Members at the Grounds', category: 'Events', image_url: 'my 2.jpg', event_id: 1 },
  { id: 15, title: 'Traditional Kandyan Dance', category: 'Culture', image_url: 'my 3.jpg', event_id: 1 },
  { id: 16, title: 'Cricket Tournament Match Action', category: 'Events', image_url: 'my 4.jpg', event_id: 1 },
  { id: 17, title: 'Community Coconut Stall', category: 'Community', image_url: 'my 5.jpg', event_id: null },
  { id: 18, title: 'Community Outreach at Kandy Branch', category: 'Community', image_url: 'my 6.jpg', event_id: null },
];

export const getFallbackEventWithGallery = (id) => {
  const event = fallbackEvents.find((e) => String(e.id) === String(id));
  if (!event) return null;
  const gallery = fallbackGallery.filter((g) => String(g.event_id) === String(id));
  return { ...event, gallery };
};
