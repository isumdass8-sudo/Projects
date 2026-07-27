import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';

export default function Verify() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get(`/verify/${id}`)
      .then((res) => setResult(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Could not verify this certificate.'));
  }, [id]);

  return (
    <section className="max-w-lg mx-auto px-5 py-20 text-center">
      <h1 className="font-display text-3xl text-forest-dark dark:text-parchment mb-6">Certificate Verification</h1>
      {error && <p className="text-guava-dark">{error}</p>}
      {result && (
        <div className="bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-2xl p-8">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-forest-dark dark:text-parchment font-semibold mb-1">Valid contribution</p>
          <p className="text-sm text-forest-dark/60 dark:text-parchment/60 mb-4">Reference: {result.reference}</p>
          <dl className="text-left text-sm space-y-2">
            <div className="flex justify-between"><dt className="text-forest-dark/60 dark:text-parchment/60">Holder</dt><dd>{result.holderName}</dd></div>
            <div className="flex justify-between"><dt className="text-forest-dark/60 dark:text-parchment/60">Plan</dt><dd>{result.plan}</dd></div>
            <div className="flex justify-between"><dt className="text-forest-dark/60 dark:text-parchment/60">Amount</dt><dd>Rs. {result.amount.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-forest-dark/60 dark:text-parchment/60">Status</dt><dd className="capitalize">{result.status}</dd></div>
          </dl>
        </div>
      )}
    </section>
  );
}
