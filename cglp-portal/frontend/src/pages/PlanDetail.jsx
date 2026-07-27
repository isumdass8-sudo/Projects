import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function PlanDetail() {
  const { code } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    client.get(`/plans/${code}`).then((res) => setPlan(res.data)).catch(() => setPlan(false));
  }, [code]);

  if (plan === null) return <div className="max-w-4xl mx-auto px-5 py-20">Loading…</div>;
  if (plan === false) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-20 text-center">
        <p className="text-forest-dark/70">Plan not found.</p>
        <Link to="/plans" className="text-guava-dark font-semibold hover:underline">Back to plans</Link>
      </div>
    );
  }

  const projectedMonthly = amount ? (Number(amount) * Number(plan.monthly_rate)).toFixed(2) : null;

  async function handleContribute(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      navigate('/login', { state: { from: `/plans/${code}` } });
      return;
    }

    setSubmitting(true);
    try {
      await client.post('/contributions', { plan_id: plan.id, amount: Number(amount) });
      setSuccess('Contribution created! Head to your dashboard to see it grow.');
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-5 py-16">
      <Link to="/plans" className="text-sm text-forest-dark/60 hover:text-guava-dark">← All plans</Link>
      <h1 className="font-display text-4xl text-forest-dark mt-4 mb-2">{plan.name}</h1>
      <p className="text-forest-dark/60 mb-8">{plan.tagline}</p>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-forest-dark/70 leading-relaxed mb-6">{plan.description}</p>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/60 rounded-xl p-4 border border-forest/10">
              <dt className="text-forest-dark/50">Minimum contribution</dt>
              <dd className="font-display text-lg text-forest-dark">
                Rs. {Number(plan.min_contribution).toLocaleString()}
              </dd>
            </div>
            <div className="bg-white/60 rounded-xl p-4 border border-forest/10">
              <dt className="text-forest-dark/50">Monthly rate</dt>
              <dd className="font-display text-lg text-forest-dark">
                {(plan.monthly_rate * 100).toFixed(2)}%
              </dd>
            </div>
            <div className="bg-white/60 rounded-xl p-4 border border-forest/10 col-span-2">
              <dt className="text-forest-dark/50">Term length</dt>
              <dd className="font-display text-lg text-forest-dark">{plan.duration_months} months</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleContribute} className="bg-white/70 rounded-2xl p-6 border border-forest/10 h-fit">
          <h2 className="font-display text-xl text-forest-dark mb-4">Contribute to this plan</h2>
          <label className="block text-sm font-medium text-forest-dark/70 mb-1">Amount (Rs.)</label>
          <input
            type="number"
            min={plan.min_contribution}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Min. ${Number(plan.min_contribution).toLocaleString()}`}
            className="w-full rounded-lg border border-forest/20 px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-guava"
            required
          />
          {projectedMonthly && (
            <p className="text-xs text-forest-dark/60 mb-3">
              Projected monthly income: <span className="font-mono text-forest-dark">Rs. {projectedMonthly}</span>
            </p>
          )}
          {error && <p className="text-sm text-guava-dark mb-3">{error}</p>}
          {success && <p className="text-sm text-forest mb-3">{success}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-forest text-parchment font-semibold hover:bg-forest-dark disabled:opacity-60"
          >
            {user ? (submitting ? 'Submitting…' : 'Contribute Now') : 'Log in to Contribute'}
          </button>
          <p className="text-xs text-forest-dark/40 mt-3">
            Simulated for demo purposes — no real payment is processed.
          </p>
        </form>
      </div>
    </section>
  );
}
