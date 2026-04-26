import {
  ArrowUpRight,
  BrainCircuit,
  Cable,
  Globe,
  LayoutDashboard,
  MonitorCog,
  Palette,
  ServerCog,
  ShieldCheck,
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { services } from '../../data/services';

const iconMap = {
  Globe,
  MonitorCog,
  Palette,
  BrainCircuit,
  LayoutDashboard,
  Cable,
  ServerCog,
  ShieldCheck,
};

const ServicesGrid = () => {
  return (
    <section className="section-shell">
      <div className="section-inner">
        <SectionHeader
          eyebrow="Services"
          title="End-to-End Digital Execution for Software-Driven Businesses"
          description="From web products to AI integration and platform operations, we deliver premium outcomes through a modern engineering stack."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Globe;
            return (
              <Motion.article
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="group premium-card relative h-full overflow-hidden rounded-3xl p-6"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent" />
                <div className="absolute -right-12 -top-8 h-28 w-28 rounded-full bg-sky-200/60 blur-3xl transition duration-300 group-hover:bg-sky-300/70" />

                <div className="relative inline-flex rounded-2xl border border-blue-200 bg-white p-3 text-blue-700 shadow-[0_10px_24px_rgba(59,130,246,0.14)]">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-slate-800">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-700 transition group-hover:text-blue-800">
                  Learn More
                  <ArrowUpRight size={15} />
                </div>
              </Motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
