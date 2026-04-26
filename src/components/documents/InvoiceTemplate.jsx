import DocumentLayout from './DocumentLayout';
import DocumentHeader from './DocumentHeader';
import PartyDetailsBlock from './PartyDetailsBlock';
import PricingTable from './PricingTable';
import SummaryBlock from './SummaryBlock';
import SignatureBlock from './SignatureBlock';

const InvoiceTemplate = ({ data }) => {
  const supportWindow = data.supportDays && data.supportDays !== '-' ? data.supportDays : 'as per agreed service terms';

  return (
    <DocumentLayout>
      <DocumentHeader
        company={data.company}
        title="INVOICE"
        numberLabel="Invoice No"
        documentNumber={data.documentNumber}
        dateValue={data.generatedDate}
      />

      <PartyDetailsBlock
        leftTitle="Bill To"
        leftRows={[
          { label: 'Client', value: data.client.name },
          { label: 'Company', value: data.client.company },
          { label: 'Email', value: data.client.email },
          { label: 'Phone', value: data.client.phone },
        ]}
        rightTitle="Project"
        rightRows={[
          { label: 'Project', value: data.client.projectName },
          { label: 'Type', value: data.client.projectType },
          { label: 'Description', value: data.client.projectDescription },
        ]}
      />

      <PricingTable items={data.serviceItems} />

      <section className="doc-grid-2">
        <SummaryBlock title="Payment Details">
          <p>UPI: {data.company.upiId}</p>
          <p>Bank: {data.company.bankName}</p>
          <p>Account No: {data.company.accountNumber}</p>
          <p>Website: {data.company.website || '-'}</p>
        </SummaryBlock>
        <SummaryBlock title="Amount Summary">
          <p className="doc-total-line">
            <span>Total</span>
            <strong>{data.currency.total}</strong>
          </p>
          <p className="doc-total-line">
            <span>Advance Paid</span>
            <strong>{data.currency.advance}</strong>
          </p>
          <p className="doc-total-line doc-total-line-strong">
            <span>Balance Due</span>
            <strong>{data.currency.balance}</strong>
          </p>
        </SummaryBlock>
      </section>

      <section className="doc-block doc-avoid-break">
        <p className="doc-block-title">Additional Invoice Notes</p>

        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
          <div>
            <p className="font-semibold text-slate-900">Payment Terms</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>50% advance payment received for project initiation.</li>
              <li>Remaining balance must be paid before final delivery/handover.</li>
              <li>Payment is due immediately upon receipt of this invoice unless otherwise agreed in writing.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Delivery Note</p>
            <p className="mt-1">
              Final project files, deployment credentials, source code, and supporting assets will be handed over after full payment confirmation.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Service Declaration</p>
            <p className="mt-1">
              This invoice reflects the agreed commercial value for the services delivered/provided by {data.company.name} for the above-mentioned
              project.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Support Note</p>
            <p className="mt-1">
              Post-delivery support, if included, will be provided for {supportWindow}.
            </p>
          </div>
        </div>
      </section>

      <SignatureBlock
        leftTitle="Prepared By"
        leftValue={data.company.name}
        rightTitle="Client Signature"
        rightValue={data.client.name}
      />

      <footer className="mt-4 border-t border-slate-200 pt-3 text-xs leading-relaxed text-slate-600 doc-avoid-break">
        <p className="font-semibold text-slate-700">Authorized by {data.company.name}</p>
        <p>This invoice is system-generated and valid with company authorization/signature.</p>
        <p className="mt-2 font-medium text-slate-700">Confidential Business Document</p>
        <p>This invoice is issued for internal business and client payment reference only.</p>
        <p className="mt-2">Payment due upon receipt unless otherwise agreed in writing.</p>
        <p>{data.company.footerText || `Thank you for choosing ${data.company.name}.`}</p>
      </footer>
    </DocumentLayout>
  );
};

export default InvoiceTemplate;
