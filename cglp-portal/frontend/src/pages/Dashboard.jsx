import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

async function downloadPdf(path, filename) {
  try {
    const res = await client.get(path, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert('Could not download the file. Please try again.');
  }
}

function ContributionCard({ c, onSelect, selected }) {
  const progress = Math.round((c.monthsCompleted / c.duration_months) * 100);
  return (
    <button
      onClick={() => onSelect(c)}
      className={`text-left w-full bg-white/70 rounded-2xl p-5 border transition-all ${
        selected ? 'border-guava shadow-md' : 'border-forest/10 hover:border-forest/30'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-display text-lg text-forest-dark">{c.plan_name}</h3>
          <p className="text-xs text-forest-dark/50 font-mono">Started {c.start_date}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            c.isMatured ? 'bg-gold/20 text-soil' : 'bg-forest/10 text-forest-dark'
          }`}
        >
          {c.isMatured ? 'Matured' : 'Active'}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-forest-dark/50 text-xs">Contributed</div>
          <div className="font-mono font-semibold text-forest-dark">Rs. {c.amount.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-forest-dark/50 text-xs">Income so far</div>
          <div className="font-mono font-semibold text-guava-dark">Rs. {c.totalPaidOut.toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-4 h-2 w-full bg-forest/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold to-guava" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-1 text-xs text-forest-dark/50">
        {c.monthsCompleted}/{c.duration_months} months
      </div>
      <div className="mt-3 flex gap-3 text-xs">
        <button
          onClick={(e) => { e.stopPropagation(); downloadPdf(`/contributions/${c.id}/agreement`, `agreement-${c.id}.pdf`); }}
          className="text-guava-dark hover:underline"
        >
          Download agreement (PDF)
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); downloadPdf(`/contributions/${c.id}/certificate`, `certificate-${c.id}.pdf`); }}
          className="text-guava-dark hover:underline"
        >
          Download certificate (QR)
        </button>
      </div>
    </button>
  );
}

function DocumentsPanel() {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function load() {
    client.get('/documents/me').then((res) => setDocs(res.data));
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    try {
      await client.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDownload(doc) {
    await downloadPdf(`/documents/${doc.id}/download`, doc.file_name);
  }

  return (
    <div className="mt-10 bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-2xl p-5">
      <h3 className="font-display text-lg text-forest-dark dark:text-parchment mb-3">Documents</h3>
      <label className="inline-block text-sm font-semibold text-guava-dark hover:underline cursor-pointer">
        {uploading ? 'Uploading…' : '+ Upload a document (PDF/PNG/JPG)'}
        <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleUpload} className="hidden" disabled={uploading} />
      </label>
      {error && <p className="text-sm text-guava-dark mt-2">{error}</p>}
      <ul className="mt-4 space-y-2 text-sm">
        {docs.map((d) => (
          <li key={d.id} className="flex justify-between items-center border-b border-forest/5 dark:border-parchment/5 pb-2">
            <span>{d.file_name}</span>
            <button onClick={() => handleDownload(d)} className="text-guava-dark hover:underline text-xs">
              Download
            </button>
          </li>
        ))}
        {docs.length === 0 && <li className="text-forest-dark/50 dark:text-parchment/50">No documents uploaded yet.</li>}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    client.get('/contributions/me').then((res) => {
      setData(res.data);
      if (res.data.contributions.length > 0) setSelected(res.data.contributions[0]);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    client.get(`/contributions/${selected.id}/payouts`).then((res) => setSchedule(res.data));
  }, [selected]);

  if (!data) return <div className="max-w-6xl mx-auto px-5 py-20">Loading your dashboard…</div>;

  const chartData = schedule
    ? (() => {
        let running = 0;
        return schedule.schedule.map((p) => {
          if (p.status === 'paid') running += p.amount;
          return { month: `M${p.month_number}`, cumulative: Number(running.toFixed(2)), status: p.status };
        });
      })()
    : [];

  return (
    <section className="max-w-6xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl text-forest-dark mb-1">Welcome back, {user?.full_name?.split(' ')[0]}</h1>
      <p className="text-forest-dark/60 mb-8">Here's how your contributions are growing.</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-forest text-parchment rounded-2xl p-6">
          <div className="text-xs uppercase tracking-wide text-parchment/60">Total contributed</div>
          <div className="font-display text-3xl mt-1">Rs. {data.totals.totalContributed.toLocaleString()}</div>
        </div>
        <div className="bg-guava-dark text-parchment rounded-2xl p-6">
          <div className="text-xs uppercase tracking-wide text-parchment/70">Total income earned</div>
          <div className="font-display text-3xl mt-1">Rs. {data.totals.totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-white/70 border border-forest/10 rounded-2xl p-6">
          <div className="text-xs uppercase tracking-wide text-forest-dark/50">Active contributions</div>
          <div className="font-display text-3xl mt-1 text-forest-dark">{data.contributions.length}</div>
        </div>
      </div>

      {data.contributions.length === 0 ? (
        <div className="bg-white/60 border border-forest/10 rounded-2xl p-10 text-center">
          <p className="text-forest-dark/70 mb-4">You don't have any contributions yet.</p>
          <Link to="/plans" className="px-5 py-2.5 rounded-full bg-forest text-parchment font-semibold hover:bg-forest-dark">
            Browse Partnership Plans
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-display text-xl text-forest-dark">Your Contributions</h2>
            {data.contributions.map((c) => (
              <ContributionCard key={c.id} c={c} selected={selected?.id === c.id} onSelect={setSelected} />
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl text-forest-dark mb-4">
              Monthly Income Growth {selected ? `— ${selected.plan_name}` : ''}
            </h2>
            <div className="bg-white/70 border border-forest/10 rounded-2xl p-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E85D75" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#E85D75" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1F3A2E" strokeOpacity={0.08} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#1F3A2E" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#1F3A2E" width={70} />
                  <Tooltip formatter={(v) => [`Rs. ${v.toLocaleString()}`, 'Cumulative income']} />
                  <Area type="monotone" dataKey="cumulative" stroke="#C43F58" fill="url(#incomeFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {schedule && (
              <div className="mt-4 bg-white/70 border border-forest/10 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-forest/5 text-forest-dark/60 text-xs uppercase">
                    <tr>
                      <th className="text-left px-4 py-2">Month</th>
                      <th className="text-left px-4 py-2">Payout date</th>
                      <th className="text-right px-4 py-2">Amount</th>
                      <th className="text-right px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="max-h-64">
                    {schedule.schedule.slice(0, 8).map((p) => (
                      <tr key={p.month_number} className="border-t border-forest/5">
                        <td className="px-4 py-2 font-mono">{p.month_number}</td>
                        <td className="px-4 py-2 font-mono text-forest-dark/60">{p.payout_date}</td>
                        <td className="px-4 py-2 text-right font-mono">Rs. {p.amount.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              p.status === 'paid' ? 'bg-forest/10 text-forest-dark' : 'bg-gold/15 text-soil'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      <DocumentsPanel />
    </section>
  );
}
