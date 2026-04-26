import DocumentLayout from './DocumentLayout';
import DocumentHeader from './DocumentHeader';
import PartyDetailsBlock from './PartyDetailsBlock';
import SignatureBlock from './SignatureBlock';

const AgreementTemplate = ({ data }) => {
  const projectType = data.client.projectType || '-';
  const projectDescription = data.client.projectDescription || 'Detailed project scope as per technical requirements.';
  const timeline = data.client.timeline || 'Estimated completion within [X days].';
  const totalProjectValue = data.totals?.totalAmount > 0 ? data.currency.total : 'INR XX,XXX';
  const supportWindow = data.supportDays && data.supportDays !== '-' ? data.supportDays : '[7-30 days]';

  return (
    <DocumentLayout>
      <DocumentHeader
        company={data.company}
        title="CLIENT SERVICE AGREEMENT"
        numberLabel="Agreement No"
        documentNumber={data.documentNumber}
        dateValue={data.agreementDate}
      />

      <PartyDetailsBlock
        leftTitle="Service Provider"
        leftRows={[
          { label: 'Company', value: data.company.name },
          { label: 'Email', value: data.company.email },
          { label: 'Phone', value: data.company.phone },
          { label: 'Address', value: data.company.address },
        ]}
        rightTitle="Client"
        rightRows={[
          { label: 'Name', value: data.client.name },
          { label: 'Company', value: data.client.company },
          { label: 'Email', value: data.client.email },
          { label: 'Phone', value: data.client.phone },
        ]}
      />

      <section className="doc-avoid-break rounded-xl border border-slate-200 bg-white p-5">
        <ol className="space-y-4 text-sm leading-relaxed text-slate-700">
          <li className="border-b border-slate-200 pb-4">
            <p className="text-base font-semibold text-slate-900">1. PROJECT SPECIFICATIONS</p>
            <p className="mt-2">Type: {projectType}</p>
            <p>Description: {projectDescription}</p>
            <p>Timeline: {timeline}</p>
          </li>

          <li className="border-b border-slate-200 pb-4">
            <p className="text-base font-semibold text-slate-900">2. PAYMENT TERMS</p>
            <p className="mt-2">Total Project Value: {totalProjectValue}</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>50% Advance Payment: Mandatory for project initiation.</li>
              <li>50% Final Payment: Due immediately upon completion.</li>
            </ul>
          </li>

          <li className="border-b border-slate-200 pb-4">
            <p className="text-base font-semibold text-slate-900">3. DELIVERY & HANDOVER</p>
            <p className="mt-2">The final solution will be delivered only after full payment.</p>
            <p>Includes source codes and documentation.</p>
          </li>

          <li className="border-b border-slate-200 pb-4">
            <p className="text-base font-semibold text-slate-900">4. REVISION POLICY</p>
            <p className="mt-2">Client is entitled to 2-3 rounds of free revisions based on original scope.</p>
          </li>

          <li className="border-b border-slate-200 pb-4">
            <p className="text-base font-semibold text-slate-900">5. CANCELLATION POLICY</p>
            <p className="mt-2">The advance payment remains non-refundable to cover administrative setup costs.</p>
          </li>

          <li className="border-b border-slate-200 pb-4">
            <p className="text-base font-semibold text-slate-900">6. INTELLECTUAL PROPERTY</p>
            <p className="mt-2">Full ownership rights transferred to the Client immediately upon 100% payment receipt.</p>
          </li>

          <li>
            <p className="text-base font-semibold text-slate-900">7. POST-DEPLOYMENT SUPPORT</p>
            <p className="mt-2">Provides {supportWindow} of free maintenance and technical support for bugs post-launch.</p>
          </li>
        </ol>
      </section>

      <SignatureBlock
        leftTitle="Authorized Signatory"
        leftValue={data.company.name || 'ArloTechX'}
        rightTitle="Client Signature"
        rightValue={data.client.name || '-'}
      />
    </DocumentLayout>
  );
};

export default AgreementTemplate;
