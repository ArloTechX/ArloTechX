import { motion as Motion } from 'framer-motion';

const toneMap = {
  blue: 'from-blue-50 to-blue-100/70 text-blue-700',
  cyan: 'from-cyan-50 to-cyan-100/70 text-cyan-700',
  indigo: 'from-indigo-50 to-indigo-100/70 text-indigo-700',
  amber: 'from-amber-50 to-amber-100/70 text-amber-700',
  emerald: 'from-emerald-50 to-emerald-100/70 text-emerald-700',
  violet: 'from-violet-50 to-violet-100/70 text-violet-700',
};

const StatCard = ({ label, value, delta, tone = 'blue' }) => {
  return (
    <Motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`premium-panel bg-gradient-to-br p-5 ${toneMap[tone] ?? toneMap.blue}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-800">{value}</p>
      <p className="mt-2 text-xs text-slate-600">{delta}</p>
    </Motion.article>
  );
};

export default StatCard;

