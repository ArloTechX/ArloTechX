import { motion as Motion } from 'framer-motion';

const GlowCard = ({ children, className = '' }) => {
  return (
    <Motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className={`premium-card relative overflow-hidden p-6 ${className}`}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />
      <div className="relative">{children}</div>
    </Motion.div>
  );
};

export default GlowCard;
