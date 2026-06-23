import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkProvider } from './context/DarkContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LibrarianDashboard from './pages/librarian/Dashboard';
import LibrarianBooks from './pages/librarian/Books';
import LibrarianMembers from './pages/librarian/Members';
import LibrarianIssues from './pages/librarian/Issues';
import LibrarianReports from './pages/librarian/Reports';
import MemberDashboard from './pages/member/Dashboard';
import MemberBooks from './pages/member/Books';
import MemberHistory from './pages/member/History';

const Lib = ({ children }) => <ProtectedRoute allowedRoles={['librarian','super_admin']}>{children}</ProtectedRoute>;
const Mem = ({ children }) => <ProtectedRoute allowedRoles={['member']}>{children}</ProtectedRoute>;

export default function App() {
  return (
    <DarkProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/librarian/dashboard" element={<Lib><LibrarianDashboard /></Lib>} />
            <Route path="/librarian/books"     element={<Lib><LibrarianBooks /></Lib>} />
            <Route path="/librarian/members"   element={<Lib><LibrarianMembers /></Lib>} />
            <Route path="/librarian/issues"    element={<Lib><LibrarianIssues /></Lib>} />
            <Route path="/librarian/reports"   element={<Lib><LibrarianReports /></Lib>} />
            <Route path="/member/dashboard"    element={<Mem><MemberDashboard /></Mem>} />
            <Route path="/member/books"        element={<Mem><MemberBooks /></Mem>} />
            <Route path="/member/history"      element={<Mem><MemberHistory /></Mem>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DarkProvider>
  );
}
