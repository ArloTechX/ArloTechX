import { motion as Motion } from 'framer-motion';

const SectionHeader = ({ eyebrow, title, description, align = 'left' }) => {
  const alignmentClass = align === 'center' ? 'mx-auto text-center' : 'text-left';
  const descriptionClass = align === 'center' ? 'mx-auto' : '';
  const eyebrowClass = align === 'center' ? 'mx-auto' : '';

  return (
    <Motion.header
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55 }}
      className={`max-w-3xl ${alignmentClass}`}
    >
      {eyebrow ? <p className={`glass-chip mb-4 ${eyebrowClass}`}>{eyebrow}</p> : null}
      <h2 className="font-display text-3xl font-semibold leading-[1.08] text-slate-800 md:text-4xl xl:text-5xl">{title}</h2>
      {description ? (
        <p className={`mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg ${descriptionClass}`}>{description}</p>
      ) : null}
    </Motion.header>
  );
};

export default SectionHeader;
