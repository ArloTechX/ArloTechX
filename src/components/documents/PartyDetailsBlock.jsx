import MetadataBlock from './MetadataBlock';

const PartyDetailsBlock = ({ leftTitle, leftRows, rightTitle, rightRows }) => {
  return (
    <section className="doc-grid-2 doc-avoid-break">
      <MetadataBlock title={leftTitle} rows={leftRows} />
      <MetadataBlock title={rightTitle} rows={rightRows} />
    </section>
  );
};

export default PartyDetailsBlock;

