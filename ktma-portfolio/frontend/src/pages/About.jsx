import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import heroImage from '../assets/gallery/event-gathering.jpg';
import committeeImage from '../assets/gallery/tourism-worldtourismday.jpg';

const objectives = [
  {
    title: 'Sustainable Growth',
    text: 'Promote responsible tourism practices that protect Kandy\u2019s heritage sites and natural landscapes for future generations.',
  },
  {
    title: 'Strategic Marketing',
    text: 'Position Kandy on the global stage through coordinated campaigns, partnerships, and digital presence.',
  },
  {
    title: 'Member Collaboration',
    text: 'Create a unified voice for hoteliers, guides, and tourism businesses to share resources and opportunities.',
  },
  {
    title: 'Cultural Preservation',
    text: 'Champion authentic Kandyan traditions, crafts, and ceremonies as living parts of the visitor experience.',
  },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About KTMA"
        title="A united voice for Kandy's tourism industry"
        description="The Kandy Tourism Marketing Association brings together the people and businesses shaping how the world experiences Sri Lanka's cultural capital."
        image={heroImage}
      />

      {/* Association profile */}
      <section className="container-ktma py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow uppercase">Association profile</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-teal-950 md:text-4xl">
              Organized by industry, driven by community
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-500">
              KTMA is a member-led association representing hotels, guest houses, tour operators, guides,
              artisans, and hospitality service providers across Kandy. We exist to make sure the region&rsquo;s
              tourism growth benefits the local community while showcasing Kandy&rsquo;s culture with pride and
              authenticity.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              From coordinated marketing campaigns to community events like our annual cricket tournament,
              KTMA creates opportunities for members to connect, collaborate, and grow together.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-soft">
            <img src={committeeImage} alt="KTMA executive committee" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="border-y border-teal-950/8 bg-white py-20">
        <div className="container-ktma">
          <SectionHeading eyebrow="Why we exist" title="Mission &amp; Vision" align="center" />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-teal-950 p-10 text-sand-50">
              <span className="text-xs font-semibold uppercase tracking-wide text-gold-400">Mission</span>
              <p className="mt-4 font-display text-2xl leading-snug">
                To unite local tourism stakeholders and elevate Kandy&rsquo;s hospitality industry through
                strategic global marketing, sustainable practices, and authentic cultural experiences.
              </p>
            </div>
            <div className="rounded-3xl bg-sand-100 p-10">
              <span className="text-xs font-semibold uppercase tracking-wide text-clay-600">Vision</span>
              <p className="mt-4 font-display text-2xl leading-snug text-teal-950">
                To position Kandy as Asia&rsquo;s premier, sustainable, and culturally vibrant travel destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="container-ktma py-20">
        <SectionHeading eyebrow="What guides us" title="Our objectives" align="center" />
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {objectives.map((o, i) => (
            <div key={o.title} className="rounded-2xl border border-teal-950/8 bg-white p-7">
              <span className="font-display text-3xl text-gold-500">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-teal-950">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{o.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
