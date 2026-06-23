import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function MemberHistory() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/issues/me');
        setIssues(res.data.issues);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  function isOverdue(issue) {
    return issue.status === 'issued' && new Date(issue.due_date) < new Date();
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📋 My Borrowing History</h1>
        <p className="text-gray-500 mt-1">All books you have borrowed from the library.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : issues.length === 0 ? (
          <div className="p-8 text-center text-gray-400">You haven't borrowed any books yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Book</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Issue Date</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Due Date</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Return Date</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {issues.map(issue => (
                <tr key={issue.id} className={`hover:bg-gray-50 ${isOverdue(issue) ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-3 font-medium text-gray-800">{issue.book_title}</td>
                  <td className="px-6 py-3 text-gray-500">{issue.issue_date?.split('T')[0]}</td>
                  <td className="px-6 py-3 text-gray-500">{issue.due_date?.split('T')[0]}</td>
                  <td className="px-6 py-3 text-gray-500">{issue.return_date ? issue.return_date.split('T')[0] : '—'}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                      ${issue.status === 'returned' ? 'bg-green-100 text-green-700'
                        : isOverdue(issue) ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-700'}`}>
                      {isOverdue(issue) ? 'overdue' : issue.status}
                    </span>
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
