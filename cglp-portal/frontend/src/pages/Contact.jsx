import React, { useState } from 'react';
import client from '../api/client';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await client.post('/contact', form);
      setStatus(res.data.message);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus(err.response?.data?.error || 'Something went wrong.');
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-5 py-16">
      <h1 className="font-display text-4xl text-forest-dark mb-2">Get in touch</h1>
      <p className="text-forest-dark/60 mb-8">Questions about a plan? Send a message and we'll respond.</p>
      <form onSubmit={handleSubmit} className="bg-white/70 rounded-2xl p-6 border border-forest/10 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-forest/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-guava"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-forest/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-guava"
          />
        </div>
        <input
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-lg border border-forest/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-guava"
        />
        <textarea
          required
          rows={5}
          placeholder="Your message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-forest/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-guava"
        />
        {status && <p className="text-sm text-forest-dark/70">{status}</p>}
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-forest text-parchment font-semibold hover:bg-forest-dark"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
