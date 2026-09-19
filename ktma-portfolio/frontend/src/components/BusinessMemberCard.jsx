export default function BusinessMemberCard({ business }) {
  return (
    <div className="flex flex-col rounded-2xl border border-teal-950/8 bg-white p-6 transition-colors hover:border-gold-400/60">
      <span className="eyebrow uppercase">{business.category}</span>
      <h3 className="mt-2 font-display text-lg font-semibold text-teal-950">{business.business_name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{business.description}</p>
      {business.location && (
        <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-clay-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s7-7.5 7-12.5A7 7 0 0 0 5 9.5C5 14.5 12 22 12 22Z" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          {business.location}
        </p>
      )}
    </div>
  );
}
