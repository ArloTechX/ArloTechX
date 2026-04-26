import { motion as Motion } from 'framer-motion';

const Card = ({ children, className = '' }) => {
  return (
    <Motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border border-blue-100 bg-white/90 shadow-[0_10px_30px_rgba(37,99,235,0.08)] ${className}`}
    >
      {children}
    </Motion.div>
  );
};

export default Card;

