import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function LibrarianMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ user_id: '', student_id: '', department: '', membership_type: 'standard' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadMembers() {
    try {
      const res = await api.get('/members');
      setMembers(res.data.members);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadMembers(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/members', form);
      setSuccess('Member profile created successfully');
      setShowForm(false);
      setForm({ user_id: '', student_id: '', department: '', membership_type: 'standard' });
      loadMembers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this member profile?')) return;
    try {
      await api.delete(`/members/${id}`);
      setSuccess('Member deleted');
      loadMembers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">👥 Members</h1>
        <button onClick={() => { setShowForm(true); setError(''); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Add Member
        </button>
      </div>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-indigo-100">
          <h2 className="text-lg font-semibold mb-4">Create Member Profile</h2>
          <p className="text-sm text-gray-500 mb-4">The user must already have a registered account. Enter their user ID here.</p>
          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">User ID *</label>
              <input required type="number" value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })}
                placeholder="e.g. 2"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Student ID</label>
              <input value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })}
                placeholder="e.g. STU2026001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Department</label>
              <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. Information Technology"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Membership Type</label>
              <select value={form.membership_type} onChange={e => setForm({ ...form, membership_type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
                Create Member
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No members found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Student ID</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Department</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Type</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{m.name}</td>
                  <td className="px-6 py-3 text-gray-500">{m.email}</td>
                  <td className="px-6 py-3 text-gray-500">{m.student_id || '—'}</td>
                  <td className="px-6 py-3 text-gray-500">{m.department || '—'}</td>
                  <td className="px-6 py-3 capitalize text-gray-500">{m.membership_type}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
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
