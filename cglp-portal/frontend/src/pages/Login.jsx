import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-display text-3xl text-forest-dark mb-6">Log in</h1>
      <form onSubmit={handleSubmit} className="bg-white/70 rounded-2xl p-6 border border-forest/10 space-y-4">
        <div>
          <label className="block text-sm font-medium text-forest-dark/70 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-forest/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-guava"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest-dark/70 mb-1">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-forest/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-guava"
          />
        </div>
        {error && <p className="text-sm text-guava-dark">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-full bg-forest text-parchment font-semibold hover:bg-forest-dark disabled:opacity-60"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="text-sm text-forest-dark/60 mt-4">
        No account yet? <Link to="/register" className="text-guava-dark font-semibold hover:underline">Create one</Link>
      </p>
    </section>
  );
}
