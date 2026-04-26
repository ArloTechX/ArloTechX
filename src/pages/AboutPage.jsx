import { Building2, Compass, Gem, Target } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import usePageMeta from '../hooks/usePageMeta';

const cards = [
  {
    icon: Target,
    title: 'Mission',
    text: 'Deliver high-quality software and digital systems that help businesses scale with confidence.',
  },
  {
    icon: Compass,
    title: 'Vision',
    text: 'Be the most trusted technology execution partner for modern growth-stage organizations.',
  },
  {
    icon: Gem,
    title: 'Values',
    text: 'Transparency, technical excellence, design quality, and long-term client partnerships.',
  },
];

const AboutPage = () => {
  usePageMeta({ title: 'About Company', description: 'About ArloTechX mission, values, and delivery model.' });

  return (
    <>
      <PageHeader
        title="About Company"
        description="ArloTechX is a software innovation partner delivering web apps, AI products, and scalable digital platforms."
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="premium-panel p-6 md:p-7">
          <div className="section-kicker">Company Profile</div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-800">Global Innovation & Software Solutions</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
            We build premium digital products through strategy-led planning, modern architecture, and polished user
            experience. Our team blends engineering, design, and product execution to deliver software that creates
            measurable business value.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {cards.map((item) => (
              <div key={item.title} className="rounded-xl border border-blue-100 bg-white p-4">
                <item.icon className="text-blue-600" size={18} />
                <h3 className="mt-2 text-sm font-semibold text-slate-800">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="premium-panel p-6">
          <h3 className="font-display text-xl font-semibold text-slate-800">Why Teams Choose ArloTechX</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Custom-built solutions aligned with your workflows</li>
            <li>Premium UI quality with product-first thinking</li>
            <li>Fast delivery cycles with clear project visibility</li>
            <li>Scalable architecture for long-term growth</li>
            <li>Reliable post-launch support and optimization</li>
          </ul>
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            <Building2 size={16} className="mb-2" />
            Trusted by startups, SaaS teams, and enterprise innovation units.
          </div>
        </article>
      </section>
    </>
  );
};

export default AboutPage;

