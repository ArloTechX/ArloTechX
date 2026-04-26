import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Pencil, Plus, Trash2, Users, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import GenerateDropdown from '../components/clients/GenerateDropdown';
import useClients from '../hooks/useClients';
import usePageMeta from '../hooks/usePageMeta';
import { CLIENT_PROJECT_TYPES, CLIENT_STATUSES } from '../utils/clients';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: CLIENT_PROJECT_TYPES[0],
  projectName: '',
  projectDescription: '',
  timeline: '',
  pricingItemsText: '',
  totalAmount: '',
  advancePaid: '',
  balanceDue: '',
  status: CLIENT_STATUSES[0],
};

const formatDate = (iso) => {
  if (!iso) return '-';
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? '-' : parsed.toLocaleDateString();
};

const parsePricingItems = (rawText) => {
  if (!rawText.trim()) return [];

  return rawText
    .split('\n')
    .map((line, index) => {
      const [descriptionPart, quantityPart, amountPart] = line.split('|').map((item) => item?.trim() || '');
      if (!descriptionPart) return null;
      return {
        id: `line-${index + 1}`,
        description: descriptionPart,
        quantity: Number(quantityPart) || 1,
        amount: Number(amountPart) || 0,
      };
    })
    .filter(Boolean);
};

const stringifyPricingItems = (items) => {
  if (!Array.isArray(items) || !items.length) return '';
  return items.map((item) => `${item.description || ''} | ${item.quantity || 1} | ${item.amount || 0}`).join('\n');
};

const ClientsPage = () => {
  usePageMeta({ title: 'Clients', description: 'Manage your clients and their details.' });

  const navigate = useNavigate();
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const [form, setForm] = useState(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) =>
      [client.name, client.email, client.phone, client.company, client.projectType, client.status]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [clients, search]);

  const resetForm = () => {
    setForm(initialForm);
    setEditClient(null);
    setIsFormOpen(false);
    setError('');
  };

  const openAddForm = () => {
    setForm(initialForm);
    setEditClient(null);
    setError('');
    setIsFormOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.company.trim()) {
      setError('Name, email, and company are required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      projectType: form.projectType,
      projectName: form.projectName.trim(),
      projectDescription: form.projectDescription.trim(),
      timeline: form.timeline.trim(),
      pricingItems: parsePricingItems(form.pricingItemsText),
      totalAmount: Number(form.totalAmount) || 0,
      advancePaid: Number(form.advancePaid) || 0,
      balanceDue: Number(form.balanceDue) || 0,
      status: form.status,
    };

    if (editClient?.id) {
      updateClient(editClient.id, payload);
    } else {
      addClient(payload);
    }

    resetForm();
  };

  const handleEdit = (client) => {
    setEditClient(client);
    setIsFormOpen(true);
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      company: client.company || '',
      projectType: client.projectType || CLIENT_PROJECT_TYPES[0],
      projectName: client.projectName || '',
      projectDescription: client.projectDescription || '',
      timeline: client.timeline || '',
      pricingItemsText: stringifyPricingItems(client.pricingItems),
      totalAmount: client.totalAmount ? String(client.totalAmount) : '',
      advancePaid: client.advancePaid ? String(client.advancePaid) : '',
      balanceDue: client.balanceDue ? String(client.balanceDue) : '',
      status: client.status || CLIENT_STATUSES[0],
    });
    setError('');
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this client?');
    if (!confirmed) return;
    deleteClient(id);
    if (editClient?.id === id) {
      resetForm();
    }
  };

  const handleGenerate = (client, type) => {
    if (!client?.id) return;
    navigate(`/admin/documents/${type}/${client.id}`);
  };

  return (
    <>
      <PageHeader
        title="Clients"
        description="Manage your clients and their details."
        actions={
          <button type="button" onClick={openAddForm} className="btn-primary">
            <Plus size={15} /> Add Client
          </button>
        }
      />

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <Motion.form
            key="client-form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="premium-panel mb-5 p-4 sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-blue-100 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Admin Action</p>
                <h2 className="font-display text-xl font-semibold text-slate-800">{editClient ? 'Edit Client' : 'Add Client'}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-blue-600" />
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-blue-100 bg-white p-2 text-slate-500 hover:border-blue-200 hover:text-blue-700"
                  aria-label="Close client form"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="input-shell"
                placeholder="Client name *"
              />
              <input
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="input-shell"
                placeholder="Client email *"
                type="email"
              />
              <input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="input-shell"
                placeholder="Phone"
              />
              <input
                value={form.company}
                onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                className="input-shell"
                placeholder="Company *"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={form.projectType}
                  onChange={(event) => setForm((prev) => ({ ...prev, projectType: event.target.value }))}
                  className="input-shell"
                >
                  {CLIENT_PROJECT_TYPES.map((projectType) => (
                    <option key={projectType} value={projectType}>
                      {projectType}
                    </option>
                  ))}
                </select>
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="input-shell"
                >
                  {CLIENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <input
                value={form.projectName}
                onChange={(event) => setForm((prev) => ({ ...prev, projectName: event.target.value }))}
                className="input-shell"
                placeholder="Project name (for documents)"
              />

              <input
                value={form.timeline}
                onChange={(event) => setForm((prev) => ({ ...prev, timeline: event.target.value }))}
                className="input-shell"
                placeholder="Timeline (e.g., 6 weeks)"
              />

              <textarea
                value={form.projectDescription}
                onChange={(event) => setForm((prev) => ({ ...prev, projectDescription: event.target.value }))}
                className="input-shell min-h-[100px]"
                placeholder="Project description"
              />

              <textarea
                value={form.pricingItemsText}
                onChange={(event) => setForm((prev) => ({ ...prev, pricingItemsText: event.target.value }))}
                className="input-shell min-h-[120px]"
                placeholder="Pricing lines (one per line): Service | Qty | Amount"
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  value={form.totalAmount}
                  onChange={(event) => setForm((prev) => ({ ...prev, totalAmount: event.target.value }))}
                  className="input-shell"
                  placeholder="Total amount"
                  type="number"
                  min="0"
                />
                <input
                  value={form.advancePaid}
                  onChange={(event) => setForm((prev) => ({ ...prev, advancePaid: event.target.value }))}
                  className="input-shell"
                  placeholder="Advance paid"
                  type="number"
                  min="0"
                />
                <input
                  value={form.balanceDue}
                  onChange={(event) => setForm((prev) => ({ ...prev, balanceDue: event.target.value }))}
                  className="input-shell"
                  placeholder="Balance due"
                  type="number"
                  min="0"
                />
              </div>
            </div>

            {error ? <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button type="submit" className="btn-primary w-full">
                {editClient ? 'Update Client' : 'Add Client'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary w-full">
                Cancel
              </button>
            </div>
          </Motion.form>
        ) : (
          <Motion.section
            key="client-list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="premium-panel mb-5 min-w-0 p-3 sm:p-4"
          >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-slate-800">Client Directory</h2>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input-shell w-full sm:w-72"
              placeholder="Search clients..."
            />
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-blue-50 text-xs uppercase tracking-[0.12em] text-blue-700">
                <tr>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3">Company</th>
                  <th className="px-3 py-3">Project Type</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Created</th>
                  <th className="px-3 py-3">Converted</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-t border-blue-100">
                    <td className="px-3 py-3 font-medium text-slate-700">{client.name}</td>
                    <td className="px-3 py-3 text-slate-600">{client.email}</td>
                    <td className="px-3 py-3 text-slate-600">{client.phone || '-'}</td>
                    <td className="px-3 py-3 text-slate-600">{client.company}</td>
                    <td className="px-3 py-3 text-slate-600">{client.projectType}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={client.status} />
                    </td>
                    <td className="px-3 py-3 text-slate-600">{formatDate(client.createdAt)}</td>
                    <td className="px-3 py-3 text-slate-600">{client.convertedAt ? formatDate(client.convertedAt) : '-'}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <GenerateDropdown onSelect={(type) => handleGenerate(client, type)} />
                        <button type="button" onClick={() => handleEdit(client)} className="btn-secondary px-3 py-2 text-xs">
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(client.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredClients.map((client) => (
              <article key={client.id} className="rounded-2xl border border-blue-100 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{client.name}</p>
                    <p className="text-xs text-slate-500">{client.company}</p>
                  </div>
                  <StatusBadge status={client.status} />
                </div>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <p className="break-all">{client.email}</p>
                  <p>{client.phone || '-'}</p>
                  <p>{client.projectType}</p>
                  <p>Created: {formatDate(client.createdAt)}</p>
                  {client.convertedAt ? <p>Converted: {formatDate(client.convertedAt)}</p> : null}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <GenerateDropdown onSelect={(type) => handleGenerate(client, type)} align="right" />
                  </div>
                  <button type="button" onClick={() => handleEdit(client)} className="btn-secondary px-3 py-2 text-xs">
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(client.id)}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
          </Motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClientsPage;
