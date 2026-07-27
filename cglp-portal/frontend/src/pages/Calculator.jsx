import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import client from '../api/client';

export default function Calculator() {
  const [plans, setPlans] = useState([]);
  const [planId, setPlanId] = useState('');
  const [amount, setAmount] = useState(50000);

  useEffect(() => {
    client.get('/plans').then((res) => {
      setPlans(res.data);
      if (res.data.length > 0) setPlanId(res.data[0].id);
    });
  }, []);

  const plan = plans.find((p) => p.id === Number(planId));

  const projection = useMemo(() => {
    if (!plan || !amount) return { rows: [], totalIncome: 0, finalValue: 0 };
    const monthlyAmount = Number(amount) * Number(plan.monthly_rate);
    let cumulative = 0;
    const rows = [];
    for (let m = 1; m <= plan.duration_months; m++) {
      cumulative += monthlyAmount;
      if (m % Math.ceil(plan.duration_months / 12) === 0 || m === plan.duration_months) {
        rows.push({ month: `M${m}`, income: Number(cumulative.toFixed(2)) });
      }
    }
    return {
      rows,
      totalIncome: Number(cumulative.toFixed(2)),
      finalValue: Number((Number(amount) + cumulative).toFixed(2))
    };
  }, [plan, amount]);

  return (
    <section className="max-w-5xl mx-auto px-5 py-16">
      <span className="text-xs font-mono uppercase tracking-widest text-soil bg-gold/15 px-3 py-1 rounded-full">
        Plan ahead
      </span>
      <h1 className="font-display text-4xl text-forest-dark dark:text-parchment mt-5 mb-3">
        Investment Return Calculator
      </h1>
      <p className="text-forest-dark/70 dark:text-parchment/70 max-w-2xl mb-10">
        See a projected income estimate for any plan and contribution amount. This is a
        simulation for planning purposes only, not a guarantee of returns.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-2xl p-6 space-y-5 h-fit">
          <div>
            <label className="block text-sm font-medium text-forest-dark/70 dark:text-parchment/70 mb-1">
              Partnership Plan
            </label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="w-full rounded-lg border border-forest/20 dark:border-parchment/20 dark:bg-forest-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-guava"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-dark/70 dark:text-parchment/70 mb-1">
              Contribution Amount (Rs.)
            </label>
            <input
              type="number"
              min={plan?.min_contribution || 0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-forest/20 dark:border-parchment/20 dark:bg-forest-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-guava"
            />
            {plan && (
              <p className="text-xs text-forest-dark/50 dark:text-parchment/50 mt-1">
                Minimum: Rs. {Number(plan.min_contribution).toLocaleString()}
              </p>
            )}
          </div>

          {plan && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-forest/5 dark:bg-parchment/5 rounded-xl p-4">
                <div className="text-xs text-forest-dark/50 dark:text-parchment/50">Monthly rate</div>
                <div className="font-display text-lg text-forest-dark dark:text-parchment">
                  {(plan.monthly_rate * 100).toFixed(2)}%
                </div>
              </div>
              <div className="bg-forest/5 dark:bg-parchment/5 rounded-xl p-4">
                <div className="text-xs text-forest-dark/50 dark:text-parchment/50">Term</div>
                <div className="font-display text-lg text-forest-dark dark:text-parchment">
                  {plan.duration_months} months
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-forest text-parchment rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wide text-parchment/60">Total projected income</div>
              <div className="font-display text-2xl mt-1">Rs. {projection.totalIncome.toLocaleString()}</div>
            </div>
            <div className="bg-guava-dark text-parchment rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wide text-parchment/70">Value at end of term</div>
              <div className="font-display text-2xl mt-1">Rs. {projection.finalValue.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-2xl p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projection.rows}>
                <CartesianGrid stroke="#1F3A2E" strokeOpacity={0.08} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={70} />
                <Tooltip formatter={(v) => [`Rs. ${v.toLocaleString()}`, 'Cumulative income']} />
                <Bar dataKey="income" fill="#E85D75" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
