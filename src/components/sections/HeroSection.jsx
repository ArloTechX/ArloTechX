import { ArrowRight, BarChart3, Bot, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { stats } from '../../data/site';

const floatingBadge = [
  { label: 'AI Automation', icon: Bot, className: 'left-4 top-10 md:left-8' },
  { label: 'Cloud Native', icon: ShieldCheck, className: 'right-6 top-20 md:right-2' },
  { label: 'Product Scale', icon: Sparkles, className: 'left-12 bottom-12 md:left-16' },
];

const HeroSection = () => {
  return (
    <section className="section-shell pt-14 md:pt-20">
      <div className="section-inner grid items-center gap-12 xl:grid-cols-[1.03fr_0.97fr]">
        <div className="relative">
          <Motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="glass-chip"
          >
            Premium Software Agency
          </Motion.p>

          <Motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-7 max-w-3xl font-display text-[2.25rem] font-semibold leading-[1.02] text-slate-800 md:text-6xl xl:text-7xl"
          >
            We Build Smart Digital
            <span className="mt-1 block bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Solutions for Modern Business
            </span>
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-7 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg"
          >
            ArloTechX crafts software, web platforms, AI systems, and digital automation infrastructure that looks premium,
            performs fast, and scales confidently.
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link to="/contact" className="btn-primary">
              Get Started <ArrowRight size={17} />
            </Link>
            <Link to="/services" className="btn-secondary">
              View Services
            </Link>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-2"
          >
            {stats.map((item) => (
              <div key={item.label} className="premium-card rounded-2xl p-4">
                <p className="text-2xl font-semibold text-blue-700">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              </div>
            ))}
          </Motion.div>
        </div>

        <div className="relative min-h-[500px]">
          <div className="absolute left-1/2 top-1/2 h-[88%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-blue-200/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.86),rgba(248,250,255,0.95))] shadow-[0_30px_80px_rgba(30,64,175,0.14)] backdrop-blur-xl">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(96,165,250,0.2),transparent_46%)]" />

            <Motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="relative z-10 h-full p-6 md:p-8"
            >
              <div className="premium-card rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-600">Intelligence Console</p>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">Live</span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold text-slate-800">ArloTechX Command Layer</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Real-time delivery metrics, AI task pipelines, and deployment snapshots in one premium control surface.
                </p>

                <div className="mt-6 space-y-3">
                  {[82, 67, 91].map((value, index) => (
                    <div key={index}>
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                        <span>{['Automation', 'Performance', 'Security'][index]}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-blue-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-500" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="premium-card rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-600">Pipeline Speed</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-800">2.7x</p>
                  <p className="text-xs text-slate-600">faster project rollout</p>
                </div>
                <div className="premium-card rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <BarChart3 size={18} />
                    <p className="text-xs uppercase tracking-[0.18em]">Delivery Score</p>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-slate-800">98.2</p>
                  <p className="text-xs text-slate-600">client trust index</p>
                </div>
              </div>
            </Motion.div>
          </div>

          {floatingBadge.map((badge, index) => (
            <Motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.14, duration: 0.5 }}
              className={`absolute ${badge.className}`}
            >
              <div className="premium-card flex items-center gap-2 rounded-full px-4 py-2 text-sm text-blue-700">
                <badge.icon size={15} className="text-blue-600" />
                {badge.label}
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
