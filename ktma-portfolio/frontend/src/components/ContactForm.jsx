import { useState } from 'react';
import { submitContactForm } from '../utils/api';

const initialState = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState('');

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email address.';
    if (!form.message.trim()) next.message = 'Please enter a message.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setServerError('');
    try {
      await submitContactForm(form);
      setStatus('success');
      setForm(initialState);
    } catch (err) {
      setStatus('error');
      setServerError(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-forest-700/10 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-700 text-sand-50">
          &#10003;
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-teal-950">Message sent</h3>
        <p className="mt-2 text-sm text-ink-500">
          Thank you for reaching out — the KTMA team will get back to you shortly.
        </p>
        <button className="btn-outline mt-6" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={update('name')}
            className={inputClass(errors.name)}
            placeholder="Your name"
          />
        </Field>
        <Field label="Email address" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            className={inputClass(errors.email)}
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Phone (optional)">
          <input
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            className={inputClass()}
            placeholder="+94 7X XXX XXXX"
          />
        </Field>
        <Field label="Subject (optional)">
          <input
            type="text"
            value={form.subject}
            onChange={update('subject')}
            className={inputClass()}
            placeholder="Membership inquiry, partnership, etc."
          />
        </Field>
      </div>

      <Field label="Message" error={errors.message}>
        <textarea
          value={form.message}
          onChange={update('message')}
          rows={5}
          className={inputClass(errors.message)}
          placeholder="Tell us how we can help..."
        />
      </Field>

      {status === 'error' && (
        <p className="rounded-xl bg-clay-600/10 px-4 py-3 text-sm text-clay-700">{serverError}</p>
      )}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary disabled:opacity-60">
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink-700">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs font-medium text-clay-700">{error}</span>}
    </label>
  );
}

function inputClass(error) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500/50 focus:border-teal-700 focus:outline-none ${
    error ? 'border-clay-600' : 'border-teal-950/12'
  }`;
}
