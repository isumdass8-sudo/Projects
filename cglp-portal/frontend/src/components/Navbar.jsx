import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/plans', label: 'Plans' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/our-lands', label: 'Our Lands' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isStaffOrAdmin = user && ['admin', 'staff'].includes(user.role);

  return (
    <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-forest-dark/90 backdrop-blur border-b border-forest/10 dark:border-parchment/10">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-lg font-semibold text-forest-dark dark:text-parchment tracking-tight">
          Ceylon Green Life <span className="text-guava">Plantation</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `transition-colors hover:text-guava-dark ${isActive ? 'text-guava-dark' : 'text-forest-dark/80 dark:text-parchment/80'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isStaffOrAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `font-semibold ${isActive ? 'text-guava-dark' : 'text-gold'}`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-forest/20 dark:border-parchment/20 hover:bg-forest/5 dark:hover:bg-parchment/5"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-forest-dark dark:text-parchment hover:text-guava-dark"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-sm px-4 py-2 rounded-full border border-forest/20 dark:border-parchment/20 hover:bg-forest/5 dark:hover:bg-parchment/5"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-forest-dark dark:text-parchment hover:text-guava-dark">
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-forest text-parchment hover:bg-forest-dark"
              >
                Start Partnering
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-forest-dark dark:text-parchment" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3 border-t border-forest/10 dark:border-parchment/10">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-1 text-sm font-medium">
              {l.label}
            </Link>
          ))}
          {isStaffOrAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-semibold text-gold">
              Admin
            </Link>
          )}
          <button onClick={toggle} className="text-left text-sm">
            {dark ? '☀️ Light mode' : '🌙 Dark mode'}
          </button>
          <hr className="border-forest/10 dark:border-parchment/10" />
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-semibold">
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate('/');
                }}
                className="text-left text-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold">
                Log in
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="text-sm font-semibold text-guava-dark">
                Start Partnering
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
