import { motion as Motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { processSteps } from '../../data/process';

const ProcessSection = () => {
  return (
    <section className="section-shell">
      <div className="section-inner">
        <SectionHeader
          eyebrow="Workflow"
          title="A Transparent Delivery Model From Idea to Scale"
          description="Every phase is designed to keep quality high, communication clear, and progress predictable."
          align="center"
        />

        <div className="relative mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {processSteps.map((step, index) => (
            <Motion.article
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="premium-card group relative overflow-hidden rounded-3xl p-6"
            >
              <div className="absolute -right-12 top-0 h-28 w-28 rounded-full bg-blue-100/70 blur-3xl transition group-hover:bg-blue-200/70" />
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-200 bg-blue-600 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-slate-800">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
