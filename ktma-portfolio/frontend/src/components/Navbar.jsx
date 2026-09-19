import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoFull from '../assets/images/logo-full.png';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/members', label: 'Members' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-sand-50/95 shadow-[0_1px_0_0_rgba(15,61,64,0.08)] backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="container-ktma flex items-center justify-between py-3">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logoFull} alt="KTMA logo" className="h-12 w-auto md:h-14" />
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-teal-900 text-sand-50'
                    : 'text-ink-700 hover:bg-teal-900/8 hover:text-teal-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-teal-900/15 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`h-0.5 w-5 bg-teal-900 transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-5 bg-teal-900 transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-5 bg-teal-900 transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <div className="border-t border-teal-900/10 bg-sand-50 md:hidden">
          <div className="container-ktma flex flex-col gap-1 py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold ${
                    isActive ? 'bg-teal-900 text-sand-50' : 'text-ink-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
