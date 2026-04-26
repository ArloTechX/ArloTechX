import xLogo from '../../assets/X_logo.png';

const DocumentHeader = ({ company, title, numberLabel, documentNumber, dateLabel = 'Date', dateValue }) => {
  const companyName = company.name || 'ArloTechX';
  const tagline = company.tagline || 'Global Innovation & Software Solutions';

  return (
    <header className="doc-header">
      <div className="doc-company">
        <img src={xLogo} alt="ArloTechX Logo" className="doc-logo" />
        <div className="doc-company-text">
          <h1>{companyName}</h1>
          <p>{tagline}</p>
          <p>{company.email || 'arlotechx@gmail.com'}</p>
          <p>{company.phone || '+91 8637427067'}</p>
        </div>
      </div>

      <div className="doc-meta-box">
        <p className="doc-meta-title">{title}</p>
        <p>
          {numberLabel}: {documentNumber}
        </p>
        <p>
          {dateLabel}: {dateValue}
        </p>
      </div>
    </header>
  );
};

export default DocumentHeader;
