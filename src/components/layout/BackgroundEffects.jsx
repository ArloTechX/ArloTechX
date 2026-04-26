import { motion as Motion } from 'framer-motion';

const BackgroundEffects = () => {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(59,130,246,0.26)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.18)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(125,211,252,0.4),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(147,197,253,0.45),transparent_42%)]" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-sky-300/35 blur-[120px]" />
      <div className="absolute right-[-4rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-blue-300/30 blur-[130px]" />
      <div className="absolute bottom-[-7rem] left-1/3 h-64 w-64 rounded-full bg-indigo-200/40 blur-[120px]" />

      <Motion.div
        className="absolute left-[10%] top-[24%] h-36 w-36 rounded-full border border-blue-200/65"
        animate={{ y: [0, -12, 0], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
      <Motion.div
        className="absolute right-[11%] top-[35%] h-24 w-24 rounded-2xl border border-sky-200/70"
        animate={{ y: [0, 16, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default BackgroundEffects;
