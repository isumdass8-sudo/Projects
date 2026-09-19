export default function PageHero({ eyebrow, title, description, image }) {
  return (
    <section className="relative overflow-hidden bg-teal-950 text-sand-50">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/85 to-teal-950/70" />
        </div>
      )}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="container-ktma relative py-20 md:py-28">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-gold-400">{eyebrow}</p>}
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-sand-50 md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-sand-200/85">{description}</p>
        )}
      </div>
    </section>
  );
}
