import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/contributions', label: 'Contributions' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/users', label: 'Users' }
];

export default function AdminLayout() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-forest-dark dark:text-parchment mb-6">Admin Dashboard</h1>
      <div className="flex gap-2 border-b border-forest/10 dark:border-parchment/10 mb-8">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                isActive
                  ? 'border-guava text-guava-dark'
                  : 'border-transparent text-forest-dark/60 dark:text-parchment/60 hover:text-forest-dark dark:hover:text-parchment'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </section>
  );
}
