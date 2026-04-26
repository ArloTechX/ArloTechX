const MetadataBlock = ({ title, rows = [] }) => {
  return (
    <section className="doc-block">
      <p className="doc-block-title">{title}</p>
      <div className="mt-2 space-y-1">
        {rows.map((row) => (
          <p key={row.label} className="doc-row">
            <span className="doc-label">{row.label}:</span> {row.value || '-'}
          </p>
        ))}
      </div>
    </section>
  );
};

export default MetadataBlock;

