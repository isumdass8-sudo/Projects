import { NavLink } from 'react-router-dom';
import logoIcon from '../assets/images/logo-icon.png';

export default function Footer() {
  return (
    <footer className="bg-teal-950 text-sand-100">
      <div className="container-ktma grid grid-cols-1 gap-10 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="KTMA" className="h-11 w-auto" />
            <span className="font-display text-xl font-semibold text-sand-50">
              KTMA
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand-200/80">
            Kandy Tourism Marketing Association — uniting local tourism stakeholders to elevate
            Kandy&rsquo;s hospitality industry through strategic marketing, sustainable practice,
            and authentic cultural experience.
          </p>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-sand-50">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-sand-200/80">
            <li><NavLink to="/about" className="hover:text-gold-400">About Us</NavLink></li>
            <li><NavLink to="/members" className="hover:text-gold-400">Members</NavLink></li>
            <li><NavLink to="/events" className="hover:text-gold-400">Events</NavLink></li>
            <li><NavLink to="/gallery" className="hover:text-gold-400">Gallery</NavLink></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-sand-50">Association</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-sand-200/80">
            <li><NavLink to="/about#mission" className="hover:text-gold-400">Mission &amp; Vision</NavLink></li>
            <li><NavLink to="/members#committee" className="hover:text-gold-400">Executive Committee</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-gold-400">Membership Inquiries</NavLink></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-sand-50">Contact</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-sand-200/80">
            <li>Kandy, Central Province, Sri Lanka</li>
            <li>
              <a href="mailto:info@kandytourism.lk" className="hover:text-gold-400">
                info@kandytourism.lk
              </a>
            </li>
            <li>
              <a href="tel:+94812345678" className="hover:text-gold-400">
                +94 81 234 5678
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            <SocialIcon label="Facebook">
              <path d="M13.5 9H15V6.5h-1.5C11.6 6.5 10.5 7.6 10.5 9.5V11H9v2.5h1.5V19H13v-5.5h1.7l.3-2.5h-2V9.7c0-.5.2-.7.7-.7Z" />
            </SocialIcon>
            <SocialIcon label="Instagram">
              <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="12" cy="12" r="3.3" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="16.2" cy="7.8" r="0.9" />
            </SocialIcon>
          </div>
        </div>
      </div>

      <div className="border-t border-sand-50/10">
        <div className="container-ktma flex flex-col items-center justify-between gap-3 py-6 text-xs text-sand-200/60 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Kandy Tourism Marketing Association. All rights reserved.</p>
          <p>Designed &amp; built as a student full-stack portfolio project.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ children, label }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-50/20 text-sand-100 transition-colors hover:border-gold-400 hover:text-gold-400"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        {children}
      </svg>
    </a>
  );
}
