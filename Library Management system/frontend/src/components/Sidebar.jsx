import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDark } from '../context/DarkContext';

const librarianLinks = [
  { to: '/librarian/dashboard', label: 'Dashboard',     icon: '▦' },
  { to: '/librarian/books',     label: 'Books',         icon: '◫' },
  { to: '/librarian/members',   label: 'Members',       icon: '◎' },
  { to: '/librarian/issues',    label: 'Issue & Return',icon: '⇄' },
  { to: '/librarian/reports',   label: 'Reports',       icon: '📊' },
];

const memberLinks = [
  { to: '/member/dashboard', label: 'Dashboard',    icon: '▦' },
  { to: '/member/books',     label: 'Browse Books', icon: '◫' },
  { to: '/member/history',   label: 'My Borrowing', icon: '≡' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useDark();
  const location = useLocation();
  const navigate = useNavigate();
  const links = user?.role === 'member' ? memberLinks : librarianLinks;

  return (
    <aside className="w-60 min-h-screen bg-navy flex flex-col shrink-0">
      <div className="px-6 py-6 border-b border-navy-light">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center text-navy font-bold text-sm">L</div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">LibraryOS</p>
            <p className="text-navy-muted text-xs capitalize mt-0.5">{user?.role?.replace('_',' ')}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-navy-muted text-xs font-medium uppercase tracking-widest px-3 mb-3">Menu</p>
        {links.map(link => {
          const active = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${active ? 'bg-amber text-navy' : 'text-slate-400 hover:text-white hover:bg-navy-light'}`}>
              <span className="text-base w-5 text-center">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-navy-light space-y-1">
        <button onClick={toggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-navy-light transition-all">
          <span className="w-5 text-center">{dark ? '☀' : '☾'}</span>
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-navy-light transition-all">
          <span className="w-5 text-center">→</span>Sign Out
        </button>
        <div className="flex items-center gap-2 px-3 pt-3 mt-2 border-t border-navy-light">
          <div className="w-7 h-7 rounded-full bg-amber flex items-center justify-center text-navy text-xs font-bold shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
            <p className="text-navy-muted text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
