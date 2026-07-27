import React, { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminContributions() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    client.get('/admin/contributions').then((res) => setRows(res.data));
  }, []);

  return (
    <div className="bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-2xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-forest/5 dark:bg-parchment/5 text-forest-dark/60 dark:text-parchment/60 text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-3">Customer</th>
            <th className="text-left px-4 py-3">Plan</th>
            <th className="text-right px-4 py-3">Amount</th>
            <th className="text-left px-4 py-3">Start date</th>
            <th className="text-left px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-t border-forest/5 dark:border-parchment/5">
              <td className="px-4 py-3">
                <div className="font-medium">{c.full_name}</div>
                <div className="text-xs text-forest-dark/50 dark:text-parchment/50">{c.email}</div>
              </td>
              <td className="px-4 py-3">{c.plan_name}</td>
              <td className="px-4 py-3 text-right font-mono">Rs. {c.amount.toLocaleString()}</td>
              <td className="px-4 py-3 font-mono">{c.start_date}</td>
              <td className="px-4 py-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-forest/10 dark:bg-parchment/10">
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="p-6 text-sm text-forest-dark/50 dark:text-parchment/50">No contributions yet.</p>
      )}
    </div>
  );
}
