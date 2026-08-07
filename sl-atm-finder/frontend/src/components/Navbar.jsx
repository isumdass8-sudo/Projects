import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-gold' : 'text-paper/80 hover:text-paper'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-harbor sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-gold text-xl font-display font-bold">SL</span>
          <span className="text-paper font-display font-semibold tracking-tight">
            ATM Finder
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/search" className={navLinkClass}>Search</NavLink>
          <NavLink to="/map" className={navLinkClass}>Map</NavLink>
          {user && <NavLink to="/favorites" className={navLinkClass}>Favorites</NavLink>}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-paper/70 text-sm hidden sm:inline">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 rounded border border-paper/30 text-paper hover:bg-paper/10"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-3 py-1.5 text-paper/80 hover:text-paper">
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm px-3 py-1.5 rounded bg-gold text-ink font-medium hover:brightness-95"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
