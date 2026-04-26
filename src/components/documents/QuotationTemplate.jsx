import DocumentLayout from './DocumentLayout';
import DocumentHeader from './DocumentHeader';
import PartyDetailsBlock from './PartyDetailsBlock';
import PricingTable from './PricingTable';
import SummaryBlock from './SummaryBlock';
import SignatureBlock from './SignatureBlock';

const defaultQuotationTerms = [
  '50% advance required to initiate the project.',
  'Remaining balance to be cleared before final delivery.',
  'This quotation is valid for 7 days from the date of issue.',
];

const getQuotationTerms = (value) => {
  const parsed = String(value || '')
    .split('\n')
    .map((line) => line.replace(/^[\s\-*\u2022]+/, '').trim())
    .filter(Boolean);

  return parsed.length ? parsed : defaultQuotationTerms;
};

const QuotationTemplate = ({ data }) => {
  const quotationTerms = getQuotationTerms(data.quotationTerms);

  return (
    <DocumentLayout>
      <DocumentHeader
        company={data.company}
        title="QUOTATION"
        numberLabel="Quotation No"
        documentNumber={data.documentNumber}
        dateValue={data.generatedDate}
      />

      <PartyDetailsBlock
        leftTitle="Prepared For"
        leftRows={[
          { label: 'Client', value: data.client.name },
          { label: 'Company', value: data.client.company },
          { label: 'Email', value: data.client.email },
          { label: 'Phone', value: data.client.phone },
        ]}
        rightTitle="Project Details"
        rightRows={[
          { label: 'Project', value: data.client.projectName },
          { label: 'Type', value: data.client.projectType },
          { label: 'Description', value: data.client.projectDescription },
        ]}
      />

      <PricingTable items={data.serviceItems} />

      <section className="doc-grid-2">
        <SummaryBlock title="Terms & Conditions">
          <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-700">
            {quotationTerms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </SummaryBlock>
        <SummaryBlock title="Total Investment" compact>
          <p className="text-3xl font-semibold text-slate-900">{data.currency.total}</p>
        </SummaryBlock>
      </section>

      <SignatureBlock
        leftTitle="Authorized Signature"
        leftValue={data.company.name}
        rightTitle="Client Signature"
        rightValue={data.client.name}
      />
    </DocumentLayout>
  );
};

export default QuotationTemplate;

