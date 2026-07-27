import React, { useEffect, useState } from 'react';
import client from '../api/client';
import PlanCard from '../components/PlanCard';

export default function Plans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    client.get('/plans').then((res) => setPlans(res.data));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <span className="text-xs font-mono uppercase tracking-widest text-soil bg-gold/15 px-3 py-1 rounded-full">
        Five ways to partner
      </span>
      <h1 className="font-display text-4xl text-forest-dark mt-5 mb-3">Partnership Plans</h1>
      <p className="text-forest-dark/70 max-w-2xl mb-10">
        Each plan reflects a real partnership model, with a locked-in monthly rate and term
        length so you always know what to expect.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>
    </section>
  );
}
