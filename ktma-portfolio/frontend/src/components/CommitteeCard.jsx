const AVATAR_PALETTE = ['bg-teal-800', 'bg-clay-600', 'bg-forest-700', 'bg-teal-700'];

function paletteIndex(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i);
  return sum % AVATAR_PALETTE.length;
}

export default function CommitteeCard({ member }) {
  const initials = member.full_name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return (
    <div className="group rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-teal-950/5 transition-shadow hover:shadow-soft">
      <div
        className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full font-display text-lg font-semibold text-sand-50 ring-4 ring-gold-400/25 ${AVATAR_PALETTE[paletteIndex(member.full_name)]}`}
      >
        {initials}
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-teal-950">{member.full_name}</h3>
      <p className="mt-1 text-sm font-medium text-clay-600">{member.role}</p>
      <p className="mt-1 text-xs text-ink-500">{member.term}</p>
    </div>
  );
}
