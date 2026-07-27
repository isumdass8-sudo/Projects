import React, { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { io } from 'socket.io-client';
import client from '../../api/client';

export default function AdminOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [feed, setFeed] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    client.get('/admin/analytics').then((res) => setAnalytics(res.data));

    // Real-time dashboard: connect to the backend's socket.io server and
    // join the admin room to receive live events as they happen.
    const socket = io();
    socketRef.current = socket;
    socket.emit('join-admin');

    socket.on('new_contribution', (payload) => {
      setFeed((f) => [{ type: 'contribution', ...payload }, ...f].slice(0, 20));
    });
    socket.on('new_contact_message', (payload) => {
      setFeed((f) => [{ type: 'message', ...payload }, ...f].slice(0, 20));
    });

    return () => socket.disconnect();
  }, []);

  if (!analytics) return <div>Loading analytics…</div>;

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard label="Customers" value={analytics.totalCustomers} />
        <StatCard label="Contributions" value={analytics.totalContributions} />
        <StatCard label="Total Contributed" value={`Rs. ${analytics.totalContributed.toLocaleString()}`} />
        <StatCard label="Income Paid Out" value={`Rs. ${analytics.totalIncomePaid.toLocaleString()}`} accent />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-2xl p-5">
          <h3 className="font-display text-lg text-forest-dark dark:text-parchment mb-4">Contributions by Plan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.byPlan}>
                <CartesianGrid stroke="#1F3A2E" strokeOpacity={0.08} vertical={false} />
                <XAxis dataKey="plan_name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#2F4F3E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-2xl p-5">
          <h3 className="font-display text-lg text-forest-dark dark:text-parchment mb-4">Signups Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.signupsByMonth}>
                <CartesianGrid stroke="#1F3A2E" strokeOpacity={0.08} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#C43F58" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-guava animate-pulse" />
          <h3 className="font-display text-lg text-forest-dark dark:text-parchment">Live Activity</h3>
        </div>
        {feed.length === 0 ? (
          <p className="text-sm text-forest-dark/50 dark:text-parchment/50">
            Waiting for new contributions or messages… try submitting one from another tab.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {feed.map((item, i) => (
              <li key={i} className="border-b border-forest/5 dark:border-parchment/5 pb-2">
                {item.type === 'contribution' ? (
                  <span>
                    <strong>{item.full_name}</strong> contributed Rs. {item.amount.toLocaleString()} to{' '}
                    <strong>{item.plan_name}</strong>
                  </span>
                ) : (
                  <span>
                    New message from <strong>{item.name}</strong>: {item.message.slice(0, 80)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`rounded-2xl p-5 ${accent ? 'bg-guava-dark text-parchment' : 'bg-forest text-parchment'}`}>
      <div className="text-xs uppercase tracking-wide text-parchment/60">{label}</div>
      <div className="font-display text-2xl mt-1">{value}</div>
    </div>
  );
}
