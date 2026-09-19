import { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import CommitteeCard from '../components/CommitteeCard';
import BusinessMemberCard from '../components/BusinessMemberCard';
import { fetchWithFallback } from '../utils/api';
import { fallbackCommittee, fallbackBusinessMembers } from '../data/fallbackData';
import heroImage from '../assets/gallery/event-gathering.jpg';
import groupPhoto from '../assets/gallery/executive-committee.jpg';

export default function Members() {
  const [committee, setCommittee] = useState(fallbackCommittee);
  const [businesses, setBusinesses] = useState(fallbackBusinessMembers);

  useEffect(() => {
    fetchWithFallback('/members/committee', fallbackCommittee).then(setCommittee);
    fetchWithFallback('/members/business', fallbackBusinessMembers).then(setBusinesses);
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Our members"
        title="The people and businesses behind Kandy tourism"
        description="From our executive committee to member hotels and service providers, KTMA is powered by a shared commitment to the region."
        image={heroImage}
      />

      {/* Committee */}
      <section id="committee" className="container-ktma py-20">
        <SectionHeading
          eyebrow="Executive committee"
          title={'2026\u20132028 leadership'}
          description="Elected to guide KTMA's strategy, events, and partnerships over the current term."
        />
        <div className="mt-10 overflow-hidden rounded-3xl shadow-soft">
          <img src={groupPhoto} alt="KTMA members group photo" className="h-100 w-full object-cover md:h-100" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {committee.map((member) => (
            <CommitteeCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* Business members */}
      <section className="border-t border-teal-950/8 bg-white py-20">
        <div className="container-ktma">
          <SectionHeading
            eyebrow="Member directory"
            title="Businesses supporting KTMA"
            description="A growing network of hospitality, retail, and event partners across Kandy."
          />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b) => (
              <BusinessMemberCard key={b.id} business={b} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
