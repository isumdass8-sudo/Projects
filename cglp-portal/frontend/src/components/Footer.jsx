import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-parchment/90 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg mb-2">Ceylon Green Life Plantation</h3>
          <p className="text-sm text-parchment/60 leading-relaxed">
            Student demo project modelled on a real Sri Lankan agribusiness. Not affiliated
            with or endorsed by the company; built for academic purposes only.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-parchment/70">
            <li><Link to="/plans">Partnership Plans</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/news">News &amp; Updates</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-parchment/70">
            <li><Link to="/login">Log in</Link></li>
            <li><Link to="/register">Create an account</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold mb-3">Contact</h4>
          <p className="text-sm text-parchment/70">Seeduwa, Sri Lanka<br />Academic project build</p>
        </div>
      </div>
      <div className="border-t border-parchment/10 py-5 text-center text-xs text-parchment/50">
        Built as a personal / academic full-stack project — {new Date().getFullYear()}
      </div>
    </footer>
  );
}
