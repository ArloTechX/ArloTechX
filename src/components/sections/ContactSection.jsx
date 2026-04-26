import { useState } from 'react';
import { Building2, Mail, Phone, Send } from 'lucide-react';
import { companyInfo } from '../../data/site';
import { saveLeadToFirebase } from '../../firebase/firebase.config';
import { validateContactForm } from '../../utils/validators';

const initialValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: '',
  message: '',
};

const ContactSection = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      setStatus({ type: 'error', text: 'Please correct the highlighted fields.' });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: '', text: '' });

      const payload = { ...values, createdAt: new Date().toISOString() };

      await saveLeadToFirebase(payload);

      setStatus({ type: 'success', text: 'Your message has been sent. Our team will contact you shortly.' });
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-shell">
      <div className="section-inner grid gap-7 xl:grid-cols-[1.08fr_0.92fr]">
        <form onSubmit={handleSubmit} className="premium-card rounded-[2rem] p-6 md:p-8">
          <p className="glass-chip">Contact ArloTechX</p>
          <h2 className="mt-5 font-display text-3xl font-semibold text-slate-800 md:text-4xl">Start Your Project</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            Tell us what you want to build. We will respond with strategy, timeline, and next execution steps.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter your name' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'you@company.com' },
              { label: 'Phone *', name: 'phone', type: 'tel', placeholder: 'Enter at least 10 digits' },
              { label: 'Company', name: 'company', type: 'text', placeholder: 'Company name' },
            ].map((field) => (
              <label key={field.name} className="text-sm text-slate-700">
                {field.label}
                <input
                  type={field.type}
                  name={field.name}
                  value={values[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.name === 'phone'}
                  className="input-premium"
                />
                {errors[field.name] ? <span className="mt-1 block text-xs text-rose-500">{errors[field.name]}</span> : null}
              </label>
            ))}
          </div>

          <label className="mt-4 block text-sm text-slate-700">
            Project Type
            <select name="projectType" value={values.projectType} onChange={handleChange} className="input-premium">
              <option value="">Select Project Type</option>
              <option value="Website Development">Website Development</option>
              <option value="Web App Development">Web App Development</option>
              <option value="AI Integration">AI Integration</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Other">Other</option>
            </select>
            {errors.projectType ? <span className="mt-1 block text-xs text-rose-500">{errors.projectType}</span> : null}
          </label>

          <label className="mt-4 block text-sm text-slate-700">
            Message
            <textarea
              name="message"
              rows={5}
              value={values.message}
              onChange={handleChange}
              placeholder="Tell us your business goal, timeline, and expected outcome..."
              className="input-premium resize-none"
            />
            {errors.message ? <span className="mt-1 block text-xs text-rose-500">{errors.message}</span> : null}
          </label>

          {status.text ? (
            <p className={`mt-4 text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>{status.text}</p>
          ) : null}

          <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <Send size={15} />
          </button>
        </form>

        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email', value: companyInfo.email, text: 'For project inquiries and collaboration' },
            { icon: Phone, title: 'Phone', value: companyInfo.phone, text: 'Speak with our project strategy team' },
            { icon: Building2, title: 'Company', value: companyInfo.name, text: companyInfo.tagline },
          ].map((item) => (
            <article key={item.title} className="premium-card rounded-3xl p-6">
              <div className="inline-flex rounded-2xl border border-blue-100 bg-blue-50 p-3 text-blue-700">
                <item.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-slate-800">{item.title}</h3>
              <p className="mt-2 text-sm font-medium text-blue-700">{item.value}</p>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
