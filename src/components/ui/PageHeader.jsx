import { motion as Motion } from 'framer-motion';

const PageHeader = ({ title, description, actions }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6 flex flex-wrap items-start justify-between gap-3 sm:gap-4"
    >
      <div className="min-w-0 flex-1">
        <span className="section-kicker">ArloTechX Platform</span>
        <h1 className="section-title mt-3">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end [&>*]:w-full sm:[&>*]:w-auto">{actions}</div> : null}
    </Motion.div>
  );
};

export default PageHeader;

