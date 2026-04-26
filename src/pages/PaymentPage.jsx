import { useMemo, useState } from 'react';
import { Copy, Download, QrCode } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import usePageMeta from '../hooks/usePageMeta';
import usePaymentSettings from '../hooks/usePaymentSettings';
import { resolvePaymentQr } from '../utils/paymentQr';

const PaymentPage = () => {
  usePageMeta({ title: 'Payment', description: 'ArloTechX payment details including UPI and bank transfer information.' });
  const { paymentSettings } = usePaymentSettings();
  const [copied, setCopied] = useState(false);
  const [upiNotice, setUpiNotice] = useState('');
  const qr = useMemo(() => resolvePaymentQr(paymentSettings), [paymentSettings]);

  const handleCopyUpi = async () => {
    if (!paymentSettings.upiId) return;
    try {
      await navigator.clipboard.writeText(paymentSettings.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleOpenUpiApp = () => {
    if (!qr.upiLink) return;

    setUpiNotice('');
    const startedAt = Date.now();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setUpiNotice('');
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange, { once: true });

    window.location.href = qr.upiLink;

    window.setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange);

      // If page is still visible after attempting deep link, app likely didn't open.
      if (document.visibilityState === 'visible' && Date.now() - startedAt >= 1200) {
        setUpiNotice('No UPI app handler found on this device/browser. Scan the QR with a mobile UPI app or copy the UPI ID.');
      }
    }, 1600);
  };

  return (
    <>
      <PageHeader title="Payment Details" description="Use the secure payment details below and share your payment screenshot with our support team." />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="premium-panel p-6">
          <h2 className="font-display text-2xl font-semibold text-slate-800">Company & Bank Details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ['Company Name', paymentSettings.companyName],
              ['UPI ID', paymentSettings.upiId],
              ['Account Holder Name', paymentSettings.accountHolderName],
              ['Bank Name', paymentSettings.bankName],
              ['Account Number', paymentSettings.accountNumber],
              ['IFSC Code', paymentSettings.ifscCode],
              ['Support Phone', paymentSettings.supportPhone],
              ['Support Email', paymentSettings.supportEmail],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-blue-100 bg-white p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{value || '-'}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={handleCopyUpi} className="btn-secondary">
              <Copy size={14} /> {copied ? 'Copied' : 'Copy UPI ID'}
            </button>
            {qr.imageUrl ? (
              <a href={qr.imageUrl} download className="btn-primary">
                <Download size={14} /> Download QR
              </a>
            ) : null}
            {qr.upiLink ? (
              <button type="button" onClick={handleOpenUpiApp} className="btn-secondary">
                Pay with UPI App
              </button>
            ) : null}
          </div>
          {upiNotice ? <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">{upiNotice}</p> : null}
        </article>

        <aside className="space-y-4">
          <article className="premium-panel p-6">
            <h3 className="font-display text-xl font-semibold text-slate-800">QR Code</h3>
            <div className="mt-4 rounded-2xl border border-blue-100 bg-white p-4">
              {qr.imageUrl ? (
                <img src={qr.imageUrl} alt="Payment QR code" className="mx-auto w-full max-w-[280px] rounded-xl border border-blue-100 object-contain" />
              ) : (
                <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50 text-blue-700">
                  <QrCode size={30} />
                </div>
              )}
            </div>
            {qr.source === 'upi' ? <p className="mt-2 text-xs text-slate-500">QR generated from UPI deep link for browser compatibility.</p> : null}
          </article>

          <article className="premium-panel p-6">
            <h3 className="font-display text-xl font-semibold text-slate-800">Payment Instructions</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{paymentSettings.paymentInstructions || 'No payment instructions configured yet.'}</p>
            <p className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
              After payment, share screenshot with us for quicker confirmation.
            </p>
          </article>
        </aside>
      </section>
    </>
  );
};

export default PaymentPage;
