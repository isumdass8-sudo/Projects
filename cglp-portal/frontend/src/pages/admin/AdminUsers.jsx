import React, { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  function load() {
    client.get('/admin/users').then((res) => setRows(res.data));
  }

  useEffect(() => { load(); }, []);

  async function changeRole(id, role) {
    setError('');
    try {
      await client.patch(`/admin/users/${id}/role`, { role });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update role.');
    }
  }

  return (
    <div className="bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-2xl overflow-x-auto">
      {error && <p className="text-sm text-guava-dark p-4">{error}</p>}
      <table className="w-full text-sm">
        <thead className="bg-forest/5 dark:bg-parchment/5 text-forest-dark/60 dark:text-parchment/60 text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Joined</th>
            <th className="text-left px-4 py-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className="border-t border-forest/5 dark:border-parchment/5">
              <td className="px-4 py-3">{u.full_name}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3 font-mono text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  className="rounded-lg border border-forest/20 dark:border-parchment/20 dark:bg-forest-dark px-2 py-1 text-sm"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-forest-dark/40 dark:text-parchment/40 p-4">
        Note: role changes take effect the next time that user logs in.
      </p>
    </div>
  );
}
