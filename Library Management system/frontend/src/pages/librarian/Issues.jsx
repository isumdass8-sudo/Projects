import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function LibrarianIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ book_id: '', member_id: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  async function loadIssues() {
    try {
      const res = await api.get('/issues');
      setIssues(res.data.issues);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadIssues(); }, []);

  async function handleIssue(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/issues', { book_id: parseInt(form.book_id), member_id: parseInt(form.member_id) });
      setSuccess('Book issued successfully!');
      setShowForm(false);
      setForm({ book_id: '', member_id: '' });
      loadIssues();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  }

  async function handleReturn(issueId) {
    if (!window.confirm('Mark this book as returned?')) return;
    try {
      const res = await api.put(`/issues/${issueId}/return`);
      const fine = res.data.fine;
      if (fine) {
        setSuccess(`Book returned. Late fine: Rs. ${fine.amount} (${fine.days_late} days overdue)`);
      } else {
        setSuccess('Book returned successfully — no fine.');
      }
      loadIssues();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Return failed');
    }
  }

  const filtered = issues.filter(i => filter === 'all' ? true : i.status === filter);

  function isOverdue(issue) {
    return issue.status === 'issued' && new Date(issue.due_date) < new Date();
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🔄 Issue & Return</h1>
        <button onClick={() => { setShowForm(true); setError(''); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Issue Book
        </button>
      </div>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-indigo-100">
          <h2 className="text-lg font-semibold mb-4">Issue a Book</h2>
          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleIssue} className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Book ID</label>
              <input required type="number" value={form.book_id} onChange={e => setForm({ ...form, book_id: e.target.value })}
                placeholder="e.g. 1"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Member ID</label>
              <input required type="number" value={form.member_id} onChange={e => setForm({ ...form, member_id: e.target.value })}
                placeholder="e.g. 1"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
              Issue Book
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50">
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {['all', 'issued', 'returned'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors
              ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No records found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Book</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Member</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Issue Date</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Due Date</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(issue => (
                <tr key={issue.id} className={`hover:bg-gray-50 ${isOverdue(issue) ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-3 font-medium text-gray-800">{issue.book_title}</td>
                  <td className="px-6 py-3 text-gray-500">{issue.member_name}</td>
                  <td className="px-6 py-3 text-gray-500">{issue.issue_date?.split('T')[0]}</td>
                  <td className="px-6 py-3 text-gray-500">{issue.due_date?.split('T')[0]}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                      ${issue.status === 'returned' ? 'bg-green-100 text-green-700'
                        : isOverdue(issue) ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-700'}`}>
                      {isOverdue(issue) ? 'overdue' : issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {issue.status === 'issued' && (
                      <button onClick={() => handleReturn(issue.id)}
                        className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-700">
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
