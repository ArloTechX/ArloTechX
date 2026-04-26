import { useMemo } from 'react';
import { ArrowUpRight, BrainCircuit, Cable, Globe, MonitorCog, Palette, ServerCog } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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

const ServicesPage = () => {
  usePageMeta({ title: 'Services', description: 'ArloTechX service modules and delivery capabilities.' });
  const { activeServices } = useServices();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.trim().toLowerCase() || '';

  const filteredServices = useMemo(() => {
    if (!query) return activeServices;

    return activeServices.filter((service) =>
      [
        service.title,
        service.shortDescription,
        service.category,
        service.badge,
        service.fullDescription,
        service.features,
        service.benefits,
        service.process,
        service.technologies,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [activeServices, query]);

  return (
    <>
      <PageHeader title="Services" description="Explore modular service offerings designed for modern software businesses." />

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredServices.map((service) => {
          const Icon = iconMap[service.icon] || Globe;

          return (
            <article key={service.id} className="premium-panel group p-5">
              <div className="inline-flex rounded-xl border border-blue-100 bg-blue-50 p-2.5 text-blue-700">
                <Icon size={18} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-slate-800">{service.title}</h3>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{service.badge || service.category}</span>
              </div>

              <p className="mt-2 text-sm text-slate-600">{service.shortDescription}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">{service.category || '-'}</p>

              <Link to={`/services/${service.slug}`} className="btn-secondary mt-5 w-full justify-between">
                View Details <ArrowUpRight size={14} />
              </Link>
            </article>
          );
        })}
      </section>

      {!activeServices.length ? (
        <section className="premium-panel mt-6 rounded-2xl border-dashed p-7 text-center">
          <h2 className="font-display text-2xl font-semibold text-slate-800">No active services available</h2>
          <p className="mt-2 text-sm text-slate-600">Services marked Active in Admin will appear here automatically.</p>
        </section>
      ) : null}

      {activeServices.length > 0 && !filteredServices.length ? (
        <section className="premium-panel mt-6 rounded-2xl border-dashed p-7 text-center">
          <h2 className="font-display text-2xl font-semibold text-slate-800">No matching services found</h2>
          <p className="mt-2 text-sm text-slate-600">Try another keyword like web, design, or api.</p>
        </section>
      ) : null}
    </>
  );
};

export default ServicesPage;
