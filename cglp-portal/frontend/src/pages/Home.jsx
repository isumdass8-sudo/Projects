import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import PlanCard from '../components/PlanCard';

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    client.get('/plans').then((res) => setPlans(res.data.slice(0, 3)));
    client.get('/testimonials').then((res) => setTestimonials(res.data));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-soil bg-gold/15 px-3 py-1 rounded-full mb-6">
            ISO 9001:2015 · Seeduwa, Sri Lanka
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-forest-dark leading-tight">
            Grow your future <span className="leaf-underline text-guava-dark">one harvest</span> at a time.
          </h1>
          <p className="mt-6 text-forest-dark/70 leading-relaxed max-w-md">
            Join thousands of contributors partnering in Apple Guava cultivation and modern
            agriculture across Sri Lanka — track your contribution and monthly income from
            your own dashboard.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/plans" className="px-6 py-3 rounded-full bg-forest text-parchment font-semibold hover:bg-forest-dark">
              Explore Plans
            </Link>
            <Link to="/register" className="px-6 py-3 rounded-full border border-forest/30 font-semibold hover:bg-forest/5">
              Create Account
            </Link>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            <div>
              <div className="font-display text-2xl text-forest-dark">300+</div>
              <div className="text-forest-dark/60">Acres cultivated</div>
            </div>
            <div>
              <div className="font-display text-2xl text-forest-dark">5,000+</div>
              <div className="text-forest-dark/60">Contributors</div>
            </div>
            <div>
              <div className="font-display text-2xl text-forest-dark">5</div>
              <div className="text-forest-dark/60">Partnership models</div>
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/5] rounded-3xl bg-gradient-to-br from-forest-light to-forest-dark overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 200 240" className="w-3/4 text-parchment/90">
            <g fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="100" cy="150" r="55" opacity="0.25" />
              <circle cx="100" cy="150" r="38" opacity="0.45" />
              <circle cx="100" cy="150" r="20" opacity="0.7" />
            </g>
            <path
              d="M100 40 C 70 70, 70 110, 100 130 C 130 110, 130 70, 100 40 Z"
              fill="#E85D75"
              opacity="0.9"
            />
            <path d="M100 20 L100 45" stroke="#C9A227" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="absolute bottom-6 left-6 text-parchment/80 text-xs font-mono">
            growth, ring by ring
          </span>
        </div>
      </section>

      {/* Plans preview */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl text-forest-dark">Popular Partnership Plans</h2>
          <Link to="/plans" className="text-sm font-semibold text-guava-dark hover:underline">
            View all plans →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-forest/5 py-16 mt-8">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="font-display text-3xl text-forest-dark mb-8">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white/70 rounded-2xl p-6 border border-forest/10">
                <div className="text-gold mb-2">{'★'.repeat(t.rating)}</div>
                <p className="text-sm text-forest-dark/80 leading-relaxed">{t.comment}</p>
                <div className="mt-4 text-sm font-semibold text-forest-dark">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
