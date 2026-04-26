import { useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import useServices from '../../hooks/useServices';
import usePageMeta from '../../hooks/usePageMeta';
import { slugifyService } from '../../utils/services';

const initialForm = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  category: '',
  badge: '',
  features: '',
  benefits: '',
  process: '',
  technologies: '',
  pricingNote: '',
  icon: 'Globe',
  status: 'Active',
  imageUrl: '',
  ctaText: 'Request This Service',
  seoTitle: '',
  seoDescription: '',
};

const arrayToText = (value) => (Array.isArray(value) ? value.join('\n') : '');
const textToArray = (value) =>
  String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const ServicesManagementPage = () => {
  usePageMeta({ title: 'Admin Services', description: 'Add, edit, and manage public services from admin.' });
  const { services, addService, updateService, deleteService } = useServices();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState('');
  const [manualSlug, setManualSlug] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isEdit = Boolean(editingServiceId);
  const sortedServices = useMemo(
    () =>
      [...services].sort((a, b) => {
        const left = new Date(b.updatedAt || b.createdAt || 0).getTime();
        const right = new Date(a.updatedAt || a.createdAt || 0).getTime();
        return left - right;
      }),
    [services],
  );

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingServiceId('');
    setManualSlug(false);
    setForm(initialForm);
    setError('');
  };

  const openAddForm = () => {
    setIsFormOpen(true);
    setEditingServiceId('');
    setManualSlug(false);
    setForm(initialForm);
    setError('');
    setMessage('');
  };

  const openEditForm = (service) => {
    setIsFormOpen(true);
    setEditingServiceId(service.id);
    setManualSlug(true);
    setForm({
      title: service.title || '',
      slug: service.slug || '',
      shortDescription: service.shortDescription || '',
      fullDescription: service.fullDescription || '',
      category: service.category || '',
      badge: service.badge || '',
      features: arrayToText(service.features),
      benefits: arrayToText(service.benefits),
      process: arrayToText(service.process),
      technologies: arrayToText(service.technologies),
      pricingNote: service.pricingNote || '',
      icon: service.icon || 'Globe',
      status: service.status === 'Active' ? 'Active' : 'Draft',
      imageUrl: service.imageUrl || '',
      ctaText: service.ctaText || 'Request This Service',
      seoTitle: service.seoTitle || '',
      seoDescription: service.seoDescription || '',
    });
    setError('');
    setMessage('');
  };

  const updateField = (key, value) => {
    if (key === 'title') {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: manualSlug ? prev.slug : slugifyService(value),
      }));
      setError('');
      return;
    }

    if (key === 'slug') {
      setManualSlug(true);
      setForm((prev) => ({ ...prev, slug: slugifyService(value) }));
      setError('');
      return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.shortDescription.trim() || !form.fullDescription.trim()) {
      setError('Title, slug, short description, and full description are required.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      shortDescription: form.shortDescription.trim(),
      fullDescription: form.fullDescription.trim(),
      category: form.category.trim(),
      badge: form.badge.trim(),
      features: textToArray(form.features),
      benefits: textToArray(form.benefits),
      process: textToArray(form.process),
      technologies: textToArray(form.technologies),
      pricingNote: form.pricingNote.trim(),
      icon: form.icon.trim() || 'Globe',
      status: form.status === 'Active' ? 'Active' : 'Draft',
      imageUrl: form.imageUrl.trim(),
      ctaText: form.ctaText.trim() || 'Request This Service',
      seoTitle: form.seoTitle.trim(),
      seoDescription: form.seoDescription.trim(),
    };

    if (isEdit) {
      await updateService(editingServiceId, payload);
      setMessage('Service updated successfully.');
    } else {
      await addService(payload);
      setMessage('Service added successfully.');
    }

    closeForm();
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`Delete "${title}"?`);
    if (!confirmed) return;
    await deleteService(id);
    if (editingServiceId === id) closeForm();
    setMessage('Service deleted successfully.');
  };

  return (
    <>
      <div className="mb-6">
        <p className="section-kicker">Admin Services</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-semibold text-slate-800">Services Management</h1>
          {!isFormOpen ? (
            <button type="button" onClick={openAddForm} className="btn-primary">
              <Plus size={15} /> Add Service
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-slate-600">Create and maintain public service content. Public users can only view active services.</p>
      </div>

      {message ? <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{message}</p> : null}

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <Motion.form
            key="service-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={onSubmit}
            className="premium-panel mb-6 p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-blue-100 pb-3">
              <h2 className="font-display text-2xl font-semibold text-slate-800">{isEdit ? 'Edit Service' : 'Add Service'}</h2>
              <button type="button" onClick={closeForm} className="rounded-lg border border-blue-100 bg-white p-2 text-slate-500 hover:text-blue-700">
                <X size={14} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-slate-600">
                Title *
                <input value={form.title} onChange={(event) => updateField('title', event.target.value)} className="input-shell mt-1.5" />
              </label>
              <label className="text-sm text-slate-600">
                Slug *
                <input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} className="input-shell mt-1.5" />
              </label>
              <label className="text-sm text-slate-600 sm:col-span-2">
                Short Description *
                <textarea value={form.shortDescription} onChange={(event) => updateField('shortDescription', event.target.value)} className="input-shell mt-1.5 min-h-[96px]" />
              </label>
              <label className="text-sm text-slate-600 sm:col-span-2">
                Full Description *
                <textarea value={form.fullDescription} onChange={(event) => updateField('fullDescription', event.target.value)} className="input-shell mt-1.5 min-h-[140px]" />
              </label>

              <label className="text-sm text-slate-600">
                Category
                <input value={form.category} onChange={(event) => updateField('category', event.target.value)} className="input-shell mt-1.5" />
              </label>
              <label className="text-sm text-slate-600">
                Badge
                <input value={form.badge} onChange={(event) => updateField('badge', event.target.value)} className="input-shell mt-1.5" />
              </label>
              <label className="text-sm text-slate-600">
                Icon key
                <input value={form.icon} onChange={(event) => updateField('icon', event.target.value)} className="input-shell mt-1.5" placeholder="Globe, MonitorCog, Palette..." />
              </label>
              <label className="text-sm text-slate-600">
                Status
                <select value={form.status} onChange={(event) => updateField('status', event.target.value)} className="input-shell mt-1.5">
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </label>

              <label className="text-sm text-slate-600 sm:col-span-2">
                Features (one per line)
                <textarea value={form.features} onChange={(event) => updateField('features', event.target.value)} className="input-shell mt-1.5 min-h-[110px]" />
              </label>
              <label className="text-sm text-slate-600 sm:col-span-2">
                Benefits (one per line)
                <textarea value={form.benefits} onChange={(event) => updateField('benefits', event.target.value)} className="input-shell mt-1.5 min-h-[110px]" />
              </label>
              <label className="text-sm text-slate-600 sm:col-span-2">
                Process (one per line)
                <textarea value={form.process} onChange={(event) => updateField('process', event.target.value)} className="input-shell mt-1.5 min-h-[110px]" />
              </label>
              <label className="text-sm text-slate-600 sm:col-span-2">
                Technologies (one per line)
                <textarea value={form.technologies} onChange={(event) => updateField('technologies', event.target.value)} className="input-shell mt-1.5 min-h-[110px]" />
              </label>

              <label className="text-sm text-slate-600 sm:col-span-2">
                Pricing Note
                <textarea value={form.pricingNote} onChange={(event) => updateField('pricingNote', event.target.value)} className="input-shell mt-1.5 min-h-[90px]" />
              </label>

              <label className="text-sm text-slate-600">
                Image URL (optional)
                <input value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} className="input-shell mt-1.5" />
              </label>
              <label className="text-sm text-slate-600">
                CTA text (optional)
                <input value={form.ctaText} onChange={(event) => updateField('ctaText', event.target.value)} className="input-shell mt-1.5" />
              </label>
              <label className="text-sm text-slate-600">
                SEO title (optional)
                <input value={form.seoTitle} onChange={(event) => updateField('seoTitle', event.target.value)} className="input-shell mt-1.5" />
              </label>
              <label className="text-sm text-slate-600">
                SEO description (optional)
                <input value={form.seoDescription} onChange={(event) => updateField('seoDescription', event.target.value)} className="input-shell mt-1.5" />
              </label>
            </div>

            {error ? <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button type="submit" className="btn-primary">
                <Save size={15} /> {isEdit ? 'Update Service' : 'Add Service'}
              </button>
              <button type="button" onClick={closeForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </Motion.form>
        ) : (
          <Motion.section
            key="service-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="premium-panel p-4"
          >
            <h2 className="mb-3 font-display text-xl font-semibold text-slate-800">Service Records</h2>
            <div className="space-y-3">
              {sortedServices.map((service) => (
                <article key={service.id} className="rounded-2xl border border-blue-100 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{service.title}</h3>
                      <p className="text-xs text-slate-500">/{service.slug}</p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        service.status === 'Active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{service.shortDescription}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => openEditForm(service)} className="btn-secondary px-3 py-2 text-xs">
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service.id, service.title)}
                      className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </article>
              ))}

              {!sortedServices.length ? (
                <article className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-6 text-center">
                  <h3 className="font-display text-lg font-semibold text-slate-800">No services found</h3>
                  <p className="mt-2 text-sm text-slate-600">Add your first service to publish it on the public Services page.</p>
                </article>
              ) : null}
            </div>
          </Motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServicesManagementPage;
