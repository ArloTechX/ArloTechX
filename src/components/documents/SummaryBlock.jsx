const SummaryBlock = ({ title, children, compact = false }) => {
  return (
    <section className={`doc-block ${compact ? 'doc-block-compact' : ''} doc-avoid-break`}>
      <p className="doc-block-title">{title}</p>
      <div className="mt-2 text-sm text-slate-700">{children}</div>
    </section>
  );
};

export default SummaryBlock;

