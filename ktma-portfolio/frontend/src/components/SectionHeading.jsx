export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && <p className="eyebrow uppercase">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-500">{description}</p>
      )}
    </div>
  );
}
