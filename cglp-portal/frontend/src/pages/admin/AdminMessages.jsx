import React, { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminMessages() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    client.get('/admin/messages').then((res) => setRows(res.data));
  }, []);

  return (
    <div className="space-y-4">
      {rows.map((m) => (
        <div key={m.id} className="bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-2xl p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-semibold text-forest-dark dark:text-parchment">{m.name}</div>
              <div className="text-xs text-forest-dark/50 dark:text-parchment/50">{m.email} {m.phone && `· ${m.phone}`}</div>
            </div>
            <div className="text-xs font-mono text-forest-dark/40 dark:text-parchment/40">
              {new Date(m.created_at).toLocaleString()}
            </div>
          </div>
          <p className="text-sm text-forest-dark/70 dark:text-parchment/70">{m.message}</p>
        </div>
      ))}
      {rows.length === 0 && (
        <p className="text-sm text-forest-dark/50 dark:text-parchment/50">No messages yet.</p>
      )}
    </div>
  );
}
