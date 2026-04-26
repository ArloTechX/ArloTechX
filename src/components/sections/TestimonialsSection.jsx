import { Quote, Star } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { testimonials } from '../../data/testimonials';

const TestimonialsSection = () => {
  return (
    <section className="section-shell">
      <div className="section-inner">
        <SectionHeader
          eyebrow="Testimonials"
          title="Trusted by Founders and Product Teams"
          description="Long-term partnerships built on execution quality, speed, and business-first technical strategy."
          align="center"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Motion.article
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="premium-card relative rounded-3xl p-6"
            >
              <Quote className="text-blue-300" size={34} />
              <div className="mt-4 flex items-center gap-1 text-blue-600">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">"{item.quote}"</p>
              <div className="mt-6 border-t border-blue-100 pt-4">
                <p className="font-display text-lg font-semibold text-slate-800">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-blue-600">{item.role}</p>
              </div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
