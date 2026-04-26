import { Save } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';
import usePaymentSettings from '../../hooks/usePaymentSettings';
import { useEffect, useState } from 'react';
import { resolvePaymentQr } from '../../utils/paymentQr';

const PaymentSettingsPage = () => {
  usePageMeta({ title: 'Payment Settings', description: 'Manage payment details and QR code shown on public Payment page.' });
  const { paymentSettings, savePaymentSettings } = usePaymentSettings();
  const [form, setForm] = useState(() => paymentSettings);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(paymentSettings);
  }, [paymentSettings]);

  const qr = resolvePaymentQr(form);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setMessage('');
  };

  const onSave = async (event) => {
    event.preventDefault();
    const saved = await savePaymentSettings(form);
    setForm(saved);
    setMessage('Payment settings updated successfully.');
  };

  return (
    <>
      <PageHeader title="Payment Settings" description="Update UPI, bank details, support contacts, and QR code for public payment page." />

      {message ? <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{message}</p> : null}

      <form onSubmit={onSave} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="premium-panel p-5">
          <h2 className="font-display text-xl font-semibold text-slate-800">Payment Details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ['companyName', 'Company Name'],
              ['upiId', 'UPI ID'],
              ['accountHolderName', 'Account Holder Name'],
              ['bankName', 'Bank Name'],
              ['accountNumber', 'Account Number'],
              ['ifscCode', 'IFSC Code'],
              ['supportPhone', 'Support Phone'],
              ['supportEmail', 'Support Email'],
              ['qrCodeUrl', 'QR Code URL'],
            ].map(([key, label]) => (
              <label key={key} className="text-sm text-slate-600">
                {label}
                <input value={form[key] || ''} onChange={(event) => onChange(key, event.target.value)} className="input-shell mt-1.5" />
              </label>
            ))}

            <label className="text-sm text-slate-600 sm:col-span-2">
              Payment Instructions
              <textarea
                value={form.paymentInstructions || ''}
                onChange={(event) => onChange('paymentInstructions', event.target.value)}
                className="input-shell mt-1.5 min-h-[120px]"
              />
            </label>
          </div>

          <button type="submit" className="btn-primary mt-5">
            <Save size={15} /> Save Payment Settings
          </button>
        </section>

        <aside className="premium-panel p-5">
          <h2 className="font-display text-xl font-semibold text-slate-800">QR Preview</h2>
          <div className="mt-4 rounded-2xl border border-blue-100 bg-white p-4">
            {qr.imageUrl ? (
              <img src={qr.imageUrl} alt="Payment QR preview" className="mx-auto w-full max-w-[280px] rounded-xl border border-blue-100 object-contain" />
            ) : (
              <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50 text-sm text-blue-700">
                Add QR Code URL to preview
              </div>
            )}
          </div>
          {qr.source === 'upi' ? (
            <p className="mt-2 text-xs text-slate-500">
              UPI deep link detected. Preview uses generated QR image instead of loading `upi://` directly.
            </p>
          ) : null}
          <p className="mt-3 text-xs text-slate-500">Public `/payment` page reads this data instantly from shared storage.</p>
        </aside>
      </form>
    </>
  );
};

export default PaymentSettingsPage;
