const SectionTitle = ({ eyebrow, title, description }) => {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">{eyebrow}</p> : null}
      <h2 className="mt-3 font-display text-3xl font-semibold text-slate-800 md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{description}</p> : null}
    </div>
  );
};

export default SectionTitle;

