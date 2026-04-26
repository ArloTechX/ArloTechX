import { ArrowLeft, ArrowRight, BrainCircuit, Cable, Globe, MonitorCog, Palette, ServerCog } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import useServices from '../hooks/useServices';
import usePageMeta from '../hooks/usePageMeta';

const iconMap = {
  Globe,
  MonitorCog,
  Palette,
  BrainCircuit,
  Cable,
  ServerCog,
};

const DetailBlock = ({ title, items }) => (
  <article className="premium-panel p-5">
    <h2 className="font-display text-xl font-semibold text-slate-800">{title}</h2>
    <ul className="mt-3 space-y-2 text-sm text-slate-600">
      {items.map((item) => (
        <li key={item} className="rounded-xl border border-blue-100 bg-white px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  </article>
);

const ServiceDetailsPage = () => {
  const { slug = '' } = useParams();
  const { getServiceBySlug } = useServices();
  const service = getServiceBySlug(slug);
  const Icon = iconMap[service?.icon] || Globe;

  usePageMeta({
    title: service ? service.title : 'Service Not Found',
    description: service ? service.shortDescription : 'Requested service details are not available.',
  });

  if (!service) {
    return (
      <section className="premium-panel p-7 text-center">
        <h1 className="font-display text-3xl font-semibold text-slate-800">Service not found</h1>
        <p className="mt-2 text-sm text-slate-600">The requested service slug does not exist. Please return to the services page.</p>
        <Link to="/services" className="btn-primary mt-5">
          <ArrowLeft size={15} /> Back to Services
        </Link>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        title={service.title}
        description={service.shortDescription}
        actions={
          <Link to="/services" className="btn-secondary">
            <ArrowLeft size={15} /> Back
          </Link>
        }
      />

      <section className="premium-panel mb-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="inline-flex rounded-2xl border border-blue-100 bg-blue-50 p-3 text-blue-700">
            <Icon size={22} />
          </div>
          <span className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
            {service.badge || service.category}
          </span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate-600">{service.fullDescription}</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <DetailBlock title="Features" items={service.features} />
        <DetailBlock title="Benefits" items={service.benefits} />
        <DetailBlock title="Process" items={service.process} />
        <DetailBlock title="Technologies" items={service.technologies} />
      </section>

      <section className="premium-panel mt-6 p-6">
        <h2 className="font-display text-xl font-semibold text-slate-800">Pricing Note</h2>
        <p className="mt-2 text-sm text-slate-600">{service.pricingNote}</p>
        <div className="mt-5">
          <Link to="/contact" className="btn-primary">
            {service.ctaText || 'Request This Service'} <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailsPage;
