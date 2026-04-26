import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuoteCTASection = () => {
  return (
    <section className="section-shell pt-8">
      <div className="section-inner">
        <div className="premium-card relative overflow-hidden rounded-[2rem] p-8 md:p-12">
          <div className="absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-sky-200/70 blur-[120px]" />
          <div className="absolute -right-16 top-12 h-48 w-48 rounded-full bg-blue-200/75 blur-[110px]" />

          <p className="glass-chip relative">Custom Pricing</p>
          <h2 className="relative mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight text-slate-800 md:text-5xl">
            Ready to launch your next digital product with ArloTechX?
          </h2>
          <p className="relative mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            Share your requirements and we will deliver a tailored roadmap, timeline, and quote aligned with your business goals.
          </p>
          <Link to="/contact" className="btn-primary relative mt-8">
            Request a Quote <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuoteCTASection;
