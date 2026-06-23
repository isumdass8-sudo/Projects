import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

function StatCard({ label, value, icon, accent, sub }) {
  return (
    <div className={`bg-white dark:bg-navy-light rounded-xl p-5 border-t-4 ${accent} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold text-navy dark:text-white">{value ?? '—'}</span>
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-navy-light border border-slate-200 dark:border-navy-muted rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-navy dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export default function LibrarianDashboard() {
  const { user } = useAuth();
  const [overview, setOverview]   = useState(null);
  const [trends, setTrends]       = useState([]);
  const [popular, setPopular]     = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading]     = useState(true);
  const now = new Date();

  useEffect(() => {
    async function load() {
      try {
        const [ov, tr, po, br] = await Promise.all([
          api.get('/stats/overview'),
          api.get('/stats/monthly-trends'),
          api.get('/stats/popular-books'),
          api.get('/stats/issue-status'),
        ]);
        setOverview(ov.data);
        setTrends(tr.data.trends.map(t => ({ ...t, month: t.month.slice(5) + '/' + t.month.slice(0,4) })));
        setPopular(po.data.books.map(b => ({ ...b, title: b.title.length > 20 ? b.title.slice(0,18)+'…' : b.title })));
        setBreakdown(br.data.breakdown.filter(b => b.value > 0));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-slate-400 mb-1">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1 className="font-display text-3xl font-bold text-navy dark:text-white">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
        </div>
        <div className="flex gap-2">
          <a href="/librarian/reports" className="border border-slate-200 dark:border-navy-muted text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-light px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            📊 Reports
          </a>
          <a href="/librarian/issues" className="bg-amber hover:bg-amber-light text-navy font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
            + Issue Book
          </a>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Books"    value={overview?.totalBooks}    icon="📚" accent="border-blue-400" sub={`${overview?.totalCopies ?? '—'} copies`} />
        <StatCard label="Available"      value={overview?.availableCopies} icon="✅" accent="border-emerald-400" />
        <StatCard label="Active Members" value={overview?.activeMembers} icon="👥" accent="border-purple-400" />
        <StatCard label="Currently Out"  value={overview?.issuedBooks}   icon="🔄" accent="border-amber-400" />
        <StatCard label="Overdue"        value={overview?.overdueBooks}  icon="⚠️" accent="border-red-400" sub={overview?.overdueBooks > 0 ? 'needs attention' : 'all on time'} />
        <StatCard label="Total Fines"    value={`Rs.${Number(overview?.totalFines||0).toFixed(0)}`} icon="💰" accent="border-orange-400" />
        <StatCard label="Collected"      value={`Rs.${Number(overview?.collectedFines||0).toFixed(0)}`} icon="✓"  accent="border-teal-400" />
        <StatCard label="Pending Fines"  value={`Rs.${(Number(overview?.totalFines||0)-Number(overview?.collectedFines||0)).toFixed(0)}`} icon="⏳" accent="border-slate-400" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Monthly Trends - Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-light rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-navy dark:text-white mb-1">Borrowing Trends</h2>
          <p className="text-xs text-slate-400 mb-5">Issues vs returns over the last 6 months</p>
          {loading ? (
            <div className="h-52 flex items-center justify-center text-slate-300 text-sm">Loading chart...</div>
          ) : trends.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-slate-300 text-sm">No data yet — issue some books to see trends.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trends} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="issued"   name="Issued"   stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
                <Line type="monotone" dataKey="returned" name="Returned" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Issue Status - Pie Chart */}
        <div className="bg-white dark:bg-navy-light rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-navy dark:text-white mb-1">Issue Status</h2>
          <p className="text-xs text-slate-400 mb-5">All-time breakdown</p>
          {loading ? (
            <div className="h-52 flex items-center justify-center text-slate-300 text-sm">Loading...</div>
          ) : breakdown.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-slate-300 text-sm">No data yet.</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={breakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {breakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {breakdown.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-slate-500 dark:text-slate-400">{b.name}</span>
                    </div>
                    <span className="font-semibold text-navy dark:text-white">{b.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Popular Books - Bar Chart */}
      <div className="bg-white dark:bg-navy-light rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-navy dark:text-white mb-1">Most Borrowed Books</h2>
        <p className="text-xs text-slate-400 mb-5">Top 8 titles by borrow count</p>
        {loading ? (
          <div className="h-52 flex items-center justify-center text-slate-300 text-sm">Loading chart...</div>
        ) : popular.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-slate-300 text-sm">No borrowing data yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={popular} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="title" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="borrow_count" name="Times Borrowed" fill="#6366f1" radius={[4,4,0,0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Layout>
  );
}
