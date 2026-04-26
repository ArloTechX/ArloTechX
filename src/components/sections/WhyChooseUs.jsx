import { CheckCheck, Sparkles } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { whyChooseUs } from '../../data/services';

const WhyChooseUs = () => {
  return (
    <section className="section-shell">
      <div className="section-inner grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="premium-card relative overflow-hidden rounded-3xl p-7 md:p-9">
          <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-blue-200/60 blur-3xl" />
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Built for Growth, Designed for Trust"
            description="We combine fast execution with refined architecture and world-class user experience to produce outcomes that last."
          />
          <div className="mt-8 space-y-4">
            <div className="premium-card rounded-2xl p-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Sparkles size={16} />
                <p className="text-sm font-semibold">Premium Process</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">Structured delivery with transparent communication and milestone-based execution.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {whyChooseUs.map((point, index) => (
            <Motion.article
              key={point}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.42, delay: index * 0.05 }}
              className="premium-card group rounded-2xl p-5"
            >
              <div className="inline-flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700">
                <CheckCheck size={17} />
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em]">Advantage</h3>
              </div>
              <p className="mt-4 font-display text-xl font-semibold text-slate-800">{point}</p>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
