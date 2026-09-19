import PageHero from '../components/PageHero';
import ContactForm from '../components/ContactForm';
import heroImage from '../assets/gallery/event-awards-tent.jpg';

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Let's talk about Kandy tourism"
        description="Membership inquiries, partnership ideas, or press requests — we'd love to hear from you."
        image={heroImage}
      />

      <section className="container-ktma py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-teal-950">Get in touch</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Fill in the form and our team will respond within two business days. For urgent matters,
              reach us directly using the details below.
            </p>

            <ul className="mt-8 space-y-6">
              <ContactItem label="Address">
                Kandy Tourism Marketing Association<br />Kandy, Central Province, Sri Lanka
              </ContactItem>
              <ContactItem label="Email">
                <a href="mailto:info@kandytourism.lk" className="hover:text-clay-600">info@kandytourism.lk</a>
              </ContactItem>
              <ContactItem label="Phone">
                <a href="tel:+94812345678" className="hover:text-clay-600">+94 81 234 5678</a>
              </ContactItem>
            </ul>

            <div className="mt-8 overflow-hidden rounded-2xl border border-teal-950/8">
              <iframe
                title="KTMA location map"
                src="https://www.google.com/maps?q=Kandy,+Sri+Lanka&output=embed"
                width="100%"
                height="240"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-teal-950/5 md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactItem({ label, children }) {
  return (
    <li>
      <p className="text-xs font-semibold uppercase tracking-wide text-clay-600">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-700">{children}</p>
    </li>
  );
}
