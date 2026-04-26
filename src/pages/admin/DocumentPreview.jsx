import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Share2 } from 'lucide-react';
import useClients from '../../hooks/useClients';
import useSettings from '../../hooks/useSettings';
import { useProjects } from '../../hooks/useProjects';
import { getOrCreateDocumentNumber } from '../../utils/documentNumbers';
import { mapDocumentData } from '../../utils/documentDataMapper';
import { buildDocumentShareMessage, openWhatsAppChat, sanitizePhoneNumber } from '../../utils/whatsapp';
import QuotationTemplate from '../../components/documents/QuotationTemplate';
import AgreementTemplate from '../../components/documents/AgreementTemplate';
import InvoiceTemplate from '../../components/documents/InvoiceTemplate';

const typeLabelMap = {
  quotation: 'Quotation',
  agreement: 'Agreement',
  invoice: 'Invoice',
};

const DocumentPreview = () => {
  const navigate = useNavigate();
  const { type, clientId } = useParams();
  const normalizedType = String(type || '').toLowerCase();
  const isSupportedType = normalizedType in typeLabelMap;
  const { clients } = useClients();
  const { settings } = useSettings();
  const { projects } = useProjects();
  const [documentNumber, setDocumentNumber] = useState('-');
  const [printError, setPrintError] = useState('');
  const [shareFeedback, setShareFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    let isMounted = true;

    const loadDocumentNumber = async () => {
      if (!isSupportedType || !clientId) {
        if (isMounted) setDocumentNumber('-');
        return;
      }

      try {
        const nextNumber = await getOrCreateDocumentNumber(clientId, normalizedType);
        if (isMounted) {
          setDocumentNumber(nextNumber);
        }
      } catch {
        if (isMounted) {
          setDocumentNumber('-');
        }
      }
    };

    loadDocumentNumber();

    return () => {
      isMounted = false;
    };
  }, [clientId, isSupportedType, normalizedType]);

  const client = useMemo(() => clients.find((item) => item.id === clientId) || null, [clients, clientId]);

  const data = useMemo(() => {
    if (!client || !isSupportedType) return null;
    return mapDocumentData({
      type: normalizedType,
      client,
      settings,
      projects,
      documentNumber,
    });
  }, [client, isSupportedType, normalizedType, settings, projects, documentNumber]);

  const warnings = useMemo(() => {
    if (!data) return [];
    const list = [];
    if (!data.client.email || data.client.email === '-') list.push('Client email is missing.');
    if (!data.client.phone || data.client.phone === '-') list.push('Client phone is missing.');
    if (!data.client.company || data.client.company === '-') list.push('Client company is missing.');
    if (!data.company.email || data.company.email === '-') list.push('Company email is missing in Settings.');
    if (!data.company.phone || data.company.phone === '-') list.push('Company phone is missing in Settings.');
    if (data.totals.totalAmount <= 0) list.push('Total amount is 0. Update client pricing fields for financial documents.');
    return list;
  }, [data]);

  const renderTemplate = () => {
    if (!data) return null;
    if (normalizedType === 'quotation') return <QuotationTemplate data={data} />;
    if (normalizedType === 'agreement') return <AgreementTemplate data={data} />;
    return <InvoiceTemplate data={data} />;
  };

  const onDownloadPdf = () => {
    try {
      setPrintError('');
      window.print();
    } catch {
      setPrintError('Unable to open print dialog. Please try again.');
    }
  };

  const onShare = () => {
    setShareFeedback({ type: '', message: '' });

    if (!client) {
      setShareFeedback({ type: 'error', message: 'Client details are missing. Unable to share this document.' });
      return;
    }

    const sanitizedPhone = sanitizePhoneNumber(client.phone);
    if (!sanitizedPhone) {
      setShareFeedback({
        type: 'error',
        message: 'Client phone number is missing or invalid. Add a valid phone number in Clients before sharing.',
      });
      return;
    }

    const message = buildDocumentShareMessage(normalizedType, client.name, documentNumber, data?.company?.name || 'ArloTechX');
    const result = openWhatsAppChat(sanitizedPhone, message);
    if (!result.ok) {
      setShareFeedback({ type: 'error', message: result.reason || 'Unable to open WhatsApp at the moment.' });
      return;
    }

    setShareFeedback({
      type: 'success',
      message: 'WhatsApp opened with prefilled message. Please attach the PDF manually and send.',
    });
  };

  if (!isSupportedType) {
    return (
      <section className="premium-panel p-6">
        <h1 className="font-display text-2xl font-semibold text-slate-800">Invalid document type</h1>
        <p className="mt-2 text-sm text-slate-600">The selected document type is not supported.</p>
        <button type="button" onClick={() => navigate('/admin/clients')} className="btn-primary mt-4">
          <ArrowLeft size={15} /> Back to Clients
        </button>
      </section>
    );
  }

  if (!client) {
    return (
      <section className="premium-panel p-6">
        <h1 className="font-display text-2xl font-semibold text-slate-800">Client not found</h1>
        <p className="mt-2 text-sm text-slate-600">This client record was not found. Please return to Clients and try again.</p>
        <button type="button" onClick={() => navigate('/admin/clients')} className="btn-primary mt-4">
          <ArrowLeft size={15} /> Back to Clients
        </button>
      </section>
    );
  }

  return (
    <section className="doc-preview-shell">
      <div className="doc-toolbar print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Document Preview</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-slate-800">
            {typeLabelMap[normalizedType]} for {client.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">Document No: {documentNumber}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-secondary">
            <Eye size={15} /> Preview
          </button>
          <button type="button" onClick={onDownloadPdf} className="btn-primary">
            <Download size={15} /> Download PDF
          </button>
          <button type="button" onClick={onShare} className="btn-secondary">
            <Share2 size={15} /> Share on WhatsApp
          </button>
          <button type="button" onClick={() => navigate('/admin/clients')} className="btn-secondary">
            <ArrowLeft size={15} /> Cancel
          </button>
        </div>
      </div>

      {warnings.length ? (
        <div className="doc-warning print:hidden">
          <p className="font-semibold">Data checks</p>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {warnings.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {printError ? <p className="text-sm text-rose-600 print:hidden">{printError}</p> : null}
      {shareFeedback.message ? (
        <p className={`text-sm print:hidden ${shareFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
          {shareFeedback.message}
        </p>
      ) : null}
      <p className="text-xs text-slate-500 print:hidden">
        WhatsApp will open with a prefilled message. Attach the PDF manually before sending.
      </p>

      <div className="doc-canvas">{renderTemplate()}</div>
    </section>
  );
};

export default DocumentPreview;
