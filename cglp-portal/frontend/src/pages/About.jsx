import React from 'react';

export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-16">
      <span className="text-xs font-mono uppercase tracking-widest text-soil bg-gold/15 px-3 py-1 rounded-full">
        About the company
      </span>
      <h1 className="font-display text-4xl text-forest-dark mt-5 mb-6">
        Strengthening agriculture, empowering communities.
      </h1>
      <p className="text-forest-dark/70 leading-relaxed mb-4">
        Ceylon Green Life Plantation (Pvt) Ltd is an ISO 9001:2015 certified agricultural
        company based in Seeduwa, Sri Lanka, founded in 2023. The company works across
        modern farming, Apple Guava cultivation, and partnership programmes that connect
        everyday contributors with Sri Lanka's agricultural economy.
      </p>
      <p className="text-forest-dark/70 leading-relaxed mb-4">
        Its approach blends direct sourcing from smallholder farmers, managed estate
        cultivation under a profit-sharing model, individually managed cultivation plots,
        an agricultural trading network, and a brand/distribution network — five distinct
        ways for people to take part in agriculture without running a farm themselves.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 my-10">
        {[
          ['300+', 'Acres under cultivation'],
          ['5,000+', 'Contributors nationwide'],
          ['500+', 'Partner farmers']
        ].map(([n, l]) => (
          <div key={l} className="bg-white/60 rounded-2xl p-6 text-center border border-forest/10">
            <div className="font-display text-3xl text-forest-dark">{n}</div>
            <div className="text-sm text-forest-dark/60 mt-1">{l}</div>
          </div>
        ))}
      </div>

      <div className="bg-forest/5 rounded-2xl p-6 text-sm text-forest-dark/70 leading-relaxed">
        <strong className="text-forest-dark">A note on this project:</strong> this site is a
        personal, academic full-stack build — a customer portal concept modelled on a real
        company's publicly described services. It is not the company's official website and
        isn't affiliated with or endorsed by it. Any contribution amounts, monthly rates, and
        account balances here are simulated for demonstration purposes only.
      </div>
    </section>
  );
}
