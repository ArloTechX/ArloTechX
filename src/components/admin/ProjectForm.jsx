import { useMemo, useState } from 'react';

const STATUS_OPTIONS = ['New', 'Planning', 'In Progress', 'Near Launch', 'Review', 'Build Phase', 'Completed'];

const toFormValues = (initialValues) => {
  if (!initialValues) {
    return {
      title: '',
      description: '',
      category: 'Web',
      image: '',
      techStack: '',
      liveLink: '',
      githubLink: '',
      status: 'New',
      progress: '0',
      clientName: '',
      company: '',
    };
  }

  return {
    title: initialValues.title || '',
    description: initialValues.description || '',
    category: initialValues.category || 'Web',
    image: initialValues.image || '',
    techStack: Array.isArray(initialValues.techStack) ? initialValues.techStack.join(', ') : '',
    liveLink: initialValues.liveLink || '',
    githubLink: initialValues.githubLink || '',
    status: initialValues.status || 'New',
    progress: String(initialValues.progress ?? 0),
    clientName: initialValues.clientName || '',
    company: initialValues.company || '',
  };
};

const ProjectForm = ({ initialValues, onSubmit, onCancel, loading = false }) => {
  const [form, setForm] = useState(() => toFormValues(initialValues));
  const [error, setError] = useState('');

  const isEdit = Boolean(initialValues?.id);

  const submitLabel = useMemo(() => (loading ? 'Saving...' : isEdit ? 'Update Project' : 'Add Project'), [isEdit, loading]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    const parsedProgress = Number(form.progress);
    if (!Number.isFinite(parsedProgress) || parsedProgress < 0 || parsedProgress > 100) {
      setError('Progress must be a number between 0 and 100.');
      return;
    }

    const normalized = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      image: form.image.trim() || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      techStack: form.techStack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      liveLink: form.liveLink.trim() || '#',
      githubLink: form.githubLink.trim() || '#',
      status: form.status,
      progress: Math.round(parsedProgress),
      clientName: form.clientName.trim(),
      company: form.company.trim(),
    };

    onSubmit(normalized);
  };

  return (
    <form onSubmit={handleSubmit} className="premium-panel p-5">
      <h2 className="font-display text-xl font-semibold text-slate-800">{isEdit ? 'Edit Project' : 'Add Project'}</h2>

      <div className="mt-4 grid gap-3">
        {[
          ['Title', 'title'],
          ['Client Name', 'clientName'],
          ['Company', 'company'],
          ['Image URL', 'image'],
          ['Live Link', 'liveLink'],
          ['GitHub Link', 'githubLink'],
        ].map(([label, key]) => (
          <label key={key} className="text-sm text-slate-600">
            {label}
            <input
              value={form[key]}
              onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
              className="input-shell mt-1.5"
            />
          </label>
        ))}

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm text-slate-600">
            Category
            <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} className="input-shell mt-1.5">
              <option>Web</option>
              <option>AI</option>
              <option>Business</option>
              <option>UI/UX</option>
            </select>
          </label>

          <label className="text-sm text-slate-600">
            Status
            <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} className="input-shell mt-1.5">
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-600">
            Progress %
            <input
              type="number"
              min="0"
              max="100"
              value={form.progress}
              onChange={(event) => setForm((prev) => ({ ...prev, progress: event.target.value }))}
              className="input-shell mt-1.5"
            />
          </label>
        </div>

        <label className="text-sm text-slate-600">
          Tech Stack (comma separated)
          <input
            value={form.techStack}
            onChange={(event) => setForm((prev) => ({ ...prev, techStack: event.target.value }))}
            className="input-shell mt-1.5"
            placeholder="React, Node.js, PostgreSQL"
          />
        </label>

        <label className="text-sm text-slate-600">
          Description
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="input-shell mt-1.5 min-h-[120px]"
          />
        </label>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {submitLabel}
          </button>
          {onCancel ? (
            <button type="button" onClick={onCancel} className="btn-secondary">
              {isEdit ? 'Cancel' : 'Back'}
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default ProjectForm;
