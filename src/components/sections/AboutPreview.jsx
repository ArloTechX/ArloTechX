import { motion as Motion } from 'framer-motion';
import { highlightFeatures } from '../../data/services';
import SectionHeader from '../common/SectionHeader';

const AboutPreview = () => {
  return (
    <section className="section-shell">
      <div className="section-inner grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <SectionHeader
          eyebrow="About ArloTechX"
          title="Global Innovation With Client-Focused Product Engineering"
          description="We align business goals, design clarity, and advanced engineering to build digital solutions that win trust and deliver long-term value."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {highlightFeatures.map((item, index) => (
            <Motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="premium-card group relative overflow-hidden rounded-2xl p-6"
            >
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-blue-200/50 blur-2xl transition duration-300 group-hover:bg-blue-300/60" />
              <p className="text-xs uppercase tracking-[0.2em] text-blue-600">Capability 0{index + 1}</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-slate-800">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
