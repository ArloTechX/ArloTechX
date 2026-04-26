import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import usePageMeta from '../hooks/usePageMeta';
import useRequests from '../hooks/useRequests';
import useSettings from '../hooks/useSettings';

const initialState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: '',
  budget: '',
  message: '',
};

const ContactPage = () => {
  usePageMeta({ title: 'Contact', description: 'Send project requests and contact the ArloTechX team.' });

  const { addRequest } = useRequests();
  const { settings } = useSettings();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const contactRows = [
    { label: 'Email', value: settings.email },
    { label: 'Phone', value: settings.phone },
    { label: 'Business', value: settings.companyName },
    { label: 'Support Email', value: settings.supportEmail },
    { label: 'WhatsApp', value: settings.whatsapp },
    { label: 'Website', value: settings.website },
    { label: 'Address', value: settings.address },
  ];
  const companyName = settings.companyName || 'Company';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email.';
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10,}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Enter valid phone number (minimum 10 digits).';
    }

    if (!form.projectType.trim()) nextErrors.projectType = 'Project type is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setStatus({ type: '', text: '' });

    if (!validate()) {
      setStatus({ type: 'error', text: 'Please fix the highlighted fields.' });
      return;
    }

    setLoading(true);
    addRequest(form);
    setForm(initialState);
    setStatus({ type: 'success', text: 'Request submitted successfully. Our team will contact you shortly.' });
    setLoading(false);
  };

  return (
    <>
      <PageHeader title="Contact" description="Submit project requests directly from your ArloTechX client portal." />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={onSubmit} className="premium-panel p-6">
          <h2 className="font-display text-xl font-semibold text-slate-800">Request a Project Quote</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ['Name', 'name', 'text', true],
              ['Email', 'email', 'email', true],
              ['Phone', 'phone', 'tel', true],
              ['Company', 'company', 'text', false],
            ].map(([label, name, type, required]) => (
              <label key={name} className="text-sm text-slate-600">
                {label}
                {required ? ' *' : ''}
                <input
                  className="input-shell mt-1.5"
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={required}
                />
                {errors[name] ? <span className="mt-1 block text-xs text-rose-600">{errors[name]}</span> : null}
              </label>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              Project Type *
              <select className="input-shell mt-1.5" name="projectType" value={form.projectType} onChange={handleChange}>
                <option value="">Select</option>
                <option>Website Development</option>
                <option>Web App Development</option>
                <option>UI/UX Design</option>
                <option>AI Integration</option>
                <option>API Integration</option>
              </select>
              {errors.projectType ? <span className="mt-1 block text-xs text-rose-600">{errors.projectType}</span> : null}
            </label>
            <label className="text-sm text-slate-600">
              Budget
              <select className="input-shell mt-1.5" name="budget" value={form.budget} onChange={handleChange}>
                <option value="">Select range</option>
                <option>$5k - $10k</option>
                <option>$10k - $20k</option>
                <option>$20k - $40k</option>
                <option>$40k+</option>
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm text-slate-600">
            Message
            <textarea
              className="input-shell mt-1.5 min-h-[130px] resize-none"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your requirements, timelines, and goals..."
            />
            {errors.message ? <span className="mt-1 block text-xs text-rose-600">{errors.message}</span> : null}
          </label>

          {status.text ? (
            <p className={`mt-3 text-sm ${status.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>{status.text}</p>
          ) : null}

          <button type="submit" disabled={loading} className="btn-primary mt-5 disabled:opacity-70">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>

        <aside className="space-y-4">
          <div className="premium-panel p-5">
            <h3 className="font-display text-lg font-semibold text-slate-800">{companyName} Contact Desk</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {contactRows.map((row) => (
                <li key={row.label}>
                  {row.label}: {row.value || '-'}
                </li>
              ))}
            </ul>
          </div>
          <div className="premium-panel p-5">
            <h3 className="font-display text-lg font-semibold text-slate-800">Response SLA</h3>
            <p className="mt-2 text-sm text-slate-600">Typical response in under 24 business hours.</p>
          </div>
          <div className="premium-panel p-5">
            <h3 className="font-display text-lg font-semibold text-slate-800">Privacy</h3>
            <p className="mt-2 text-sm text-slate-600">Submitted requests are visible only in Admin &gt; Requests.</p>
          </div>
        </aside>
      </section>
    </>
  );
};

export default ContactPage;
