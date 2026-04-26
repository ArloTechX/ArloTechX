import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Building2, Globe2, ImageIcon, Mail, Phone, Save, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import usePageMeta from '../hooks/usePageMeta';
import useSettings from '../hooks/useSettings';

const fieldConfig = [
  {
    title: 'Company Info',
    fields: [
      { key: 'companyName', label: 'Company Name' },
      { key: 'tagline', label: 'Tagline' },
      { key: 'description', label: 'Description', multiline: true },
      { key: 'logoUrl', label: 'Logo URL' },
    ],
  },
  {
    title: 'Contact Info',
    fields: [
      { key: 'email', label: 'Email' },
      { key: 'supportEmail', label: 'Support Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'address', label: 'Address' },
      { key: 'companyAddress', label: 'Company Address' },
      { key: 'website', label: 'Website' },
      { key: 'businessHours', label: 'Business Hours' },
      { key: 'footerText', label: 'Footer Text' },
    ],
  },
  {
    title: 'Payment & Document Defaults',
    fields: [
      { key: 'upiId', label: 'UPI ID' },
      { key: 'bankName', label: 'Bank Name' },
      { key: 'accountNumber', label: 'Account Number' },
      { key: 'supportDays', label: 'Support Days' },
      { key: 'defaultRevisionCount', label: 'Default Revision Count' },
      { key: 'quotationTerms', label: 'Quotation Terms', multiline: true },
      { key: 'defaultTerms', label: 'Default Terms', multiline: true },
    ],
  },
  {
    title: 'Social Links',
    fields: [
      { key: 'linkedin', label: 'LinkedIn' },
      { key: 'github', label: 'GitHub' },
      { key: 'instagram', label: 'Instagram' },
      { key: 'whatsapp', label: 'WhatsApp' },
    ],
  },
];

const SettingsPage = () => {
  usePageMeta({ title: 'Settings', description: 'Manage company profile and platform settings for ArloTechX.' });

  const { settings, saveSettings } = useSettings();
  const [formData, setFormData] = useState(() => settings);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const logoPreview = useMemo(() => {
    return formData.logoUrl?.trim() || settings.logoUrl?.trim() || '';
  }, [formData.logoUrl, settings.logoUrl]);

  const onEdit = () => {
    setFormData(settings);
    setFeedback({ type: '', message: '' });
    setIsEditing(true);
  };

  const onCancel = () => {
    setFormData(settings);
    setFeedback({ type: '', message: '' });
    setIsEditing(false);
  };

  const onSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const next = Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, String(value || '').trim()]));
      const saved = await saveSettings(next);
      setFormData(saved);
      setIsEditing(false);
      setFeedback({ type: 'success', message: 'Settings updated successfully.' });
    } catch {
      setFeedback({ type: 'error', message: 'Unable to save settings right now. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure organization profile, branding preferences, and account controls."
        actions={
          isEditing ? (
            <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
              <button type="button" onClick={onCancel} className="btn-secondary">
                <X size={15} /> Cancel
              </button>
              <button type="submit" form="settings-form" disabled={isSaving} className="btn-primary disabled:opacity-70">
                <Save size={15} /> {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <button type="button" onClick={onEdit} className="btn-primary">
              Edit
            </button>
          )
        }
      />

      {feedback.message ? (
        <p
          className={`mb-4 rounded-xl border px-4 py-2 text-sm ${
            feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      <Motion.form
        id="settings-form"
        onSubmit={onSave}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid min-w-0 gap-6 xl:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="min-w-0 space-y-6">
          {fieldConfig.map((section) => (
            <article key={section.title} className="premium-panel min-w-0 p-5">
              <h3 className="font-display text-xl font-semibold text-slate-800">{section.title}</h3>
              <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
                {section.fields.map((field) => {
                  const isLogoUrl = field.key === 'logoUrl';
                  return (
                  <label key={field.key} className={`${field.multiline ? 'sm:col-span-2' : ''} min-w-0 text-sm text-slate-600`}>
                    <span className="font-medium">{field.label}</span>
                    {isEditing ? (
                      field.multiline ? (
                        <textarea
                          value={formData[field.key]}
                          onChange={(event) => setFormData((prev) => ({ ...prev, [field.key]: event.target.value }))}
                          className="input-shell mt-1.5 min-h-[120px]"
                        />
                      ) : (
                        <input
                          value={formData[field.key]}
                          onChange={(event) => setFormData((prev) => ({ ...prev, [field.key]: event.target.value }))}
                          className={`input-shell mt-1.5 min-w-0 w-full box-border ${isLogoUrl ? 'overflow-hidden text-ellipsis whitespace-nowrap' : ''}`}
                        />
                      )
                    ) : (
                      <p
                        className={`mt-1.5 min-w-0 rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm text-slate-700 ${
                          isLogoUrl ? 'overflow-hidden text-ellipsis whitespace-nowrap' : ''
                        }`}
                        title={settings[field.key] || '-'}
                      >
                        {settings[field.key] || '-'}
                      </p>
                    )}
                  </label>
                )})}
              </div>
            </article>
          ))}
        </div>

        <div className="min-w-0 space-y-6">
          <article className="premium-panel min-w-0 p-5">
            <h3 className="font-display text-xl font-semibold text-slate-800">Brand Preview</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="min-w-0 rounded-xl border border-blue-100 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Company</p>
                <p className="mt-1 font-semibold text-slate-800">{isEditing ? formData.companyName || '-' : settings.companyName || '-'}</p>
                <p className="text-slate-500">{isEditing ? formData.tagline || '-' : settings.tagline || '-'}</p>
              </div>

              <div className="min-w-0 rounded-xl border border-blue-100 bg-white p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Logo Preview</p>
                <div className="flex h-32 items-center justify-center rounded-xl border border-blue-100 bg-white p-3">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="h-full max-h-full w-full max-w-full object-contain object-center" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-blue-200 bg-blue-50 text-blue-700">
                      <ImageIcon size={16} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>

          <article className="premium-panel min-w-0 p-5">
            <h3 className="font-display text-xl font-semibold text-slate-800">Quick Contact</h3>
            <div className="mt-4 grid gap-3">
              {[
                { icon: Mail, label: settings.email || '-', title: 'Primary Email' },
                { icon: Phone, label: settings.phone || '-', title: 'Phone' },
                { icon: Globe2, label: settings.website || '-', title: 'Website' },
                { icon: Building2, label: settings.address || '-', title: 'Address' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-blue-100 bg-white p-3 text-sm text-slate-600">
                  <item.icon size={16} className="mb-1 text-blue-700" />
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.title}</p>
                  <p className="mt-1 font-medium text-slate-700">{item.label}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </Motion.form>
    </>
  );
};

export default SettingsPage;
