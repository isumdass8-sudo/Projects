import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, issuesRes] = await Promise.all([
          api.get('/members/me').catch(() => ({ data: { member: null } })),
          api.get('/issues/me').catch(() => ({ data: { issues: [] } })),
        ]);
        setProfile(profileRes.data.member);
        setIssues(issuesRes.data.issues);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  const activeBooks = issues.filter(i => i.status === 'issued').length;
  const returnedBooks = issues.filter(i => i.status === 'returned').length;
  const overdueBooks = issues.filter(i => i.status === 'issued' && new Date(i.due_date) < new Date()).length;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name} 👋</h1>
        <p className="text-gray-500 mt-1">Here's your library overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-2xl">📖</div>
          <div>
            <p className="text-sm text-gray-500">Books Borrowed</p>
            <p className="text-2xl font-bold text-gray-800">{activeBooks}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">✅</div>
          <div>
            <p className="text-sm text-gray-500">Returned</p>
            <p className="text-2xl font-bold text-gray-800">{returnedBooks}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl">⚠️</div>
          <div>
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-2xl font-bold text-gray-800">{overdueBooks}</p>
          </div>
        </div>
      </div>

      {/* Member profile */}
      {profile && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">My Library Profile</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><p className="text-gray-400">Student ID</p><p className="font-medium">{profile.student_id || '—'}</p></div>
            <div><p className="text-gray-400">Department</p><p className="font-medium">{profile.department || '—'}</p></div>
            <div><p className="text-gray-400">Membership</p><p className="font-medium capitalize">{profile.membership_type}</p></div>
            <div><p className="text-gray-400">Status</p>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">{profile.status}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent issues */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Borrowing Activity</h2>
        {issues.length === 0 ? (
          <p className="text-gray-400 text-sm">You haven't borrowed any books yet.</p>
        ) : (
          <div className="space-y-3">
            {issues.slice(0, 5).map(issue => (
              <div key={issue.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{issue.book_title}</p>
                  <p className="text-xs text-gray-400">Due: {issue.due_date?.split('T')[0]}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                  ${issue.status === 'returned' ? 'bg-green-100 text-green-700'
                    : new Date(issue.due_date) < new Date() ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-700'}`}>
                  {issue.status === 'issued' && new Date(issue.due_date) < new Date() ? 'overdue' : issue.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
