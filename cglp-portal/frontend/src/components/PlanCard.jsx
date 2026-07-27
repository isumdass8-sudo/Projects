import React from 'react';
import { Link } from 'react-router-dom';

export default function PlanCard({ plan }) {
  return (
    <div className="bg-white/60 border border-forest/10 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-soil bg-gold/15 px-2 py-1 rounded">
          {plan.duration_months}-month term
        </span>
        <span className="text-xs font-mono text-forest/60">{(plan.monthly_rate * 100).toFixed(2)}%/mo</span>
      </div>
      <h3 className="font-display text-xl text-forest-dark">{plan.name}</h3>
      <p className="text-sm text-forest-dark/70 leading-relaxed">{plan.tagline}</p>
      <p className="text-sm text-forest-dark/60 leading-relaxed flex-1">{plan.description}</p>
      <div className="flex items-center justify-between pt-2 border-t border-forest/10">
        <span className="text-sm font-semibold text-forest-dark">
          Min. Rs. {Number(plan.min_contribution).toLocaleString()}
        </span>
        <Link
          to={`/plans/${plan.code}`}
          className="text-sm font-semibold text-guava-dark hover:underline"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
