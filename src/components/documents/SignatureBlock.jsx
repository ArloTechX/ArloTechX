import signature from '../../assets/arlotechx_sign.png';

const SignatureBlock = ({ leftTitle, leftValue, rightTitle, rightValue }) => {
  return (
    <section className="signature-row doc-signatures doc-avoid-break">
      <div className="signature-box signature-center">
        <p className="signature-label">{leftTitle}</p>
        {signature ? <img src={signature} alt="ArloTechX Signature" className="signature-image" /> : null}
        <p className="signature-name">{leftValue || 'ArloTechX'}</p>
      </div>
      <div className="signature-box client-sign">
        <p className="signature-label">{rightTitle}</p>
        <div className="sign-space" />
        <p className="signature-name client-name">{rightValue || '-'}</p>
      </div>
    </section>
  );
};

export default SignatureBlock;
