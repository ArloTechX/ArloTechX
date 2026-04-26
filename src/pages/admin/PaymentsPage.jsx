import { useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';
import usePayments from '../../hooks/usePayments';

const initialForm = {
  clientName: '',
  company: '',
  amount: '',
  paymentDate: '',
  paymentMethod: '',
  transactionId: '',
  status: 'Pending',
  screenshotUrl: '',
  notes: '',
};

const PaymentsPage = () => {
  usePageMeta({ title: 'Payments', description: 'View and manage payment records from admin.' });
  const { payments, addPayment, updatePayment, deletePayment, paymentSummary } = usePayments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payments
      .filter((payment) => (statusFilter === 'All' ? true : payment.status === statusFilter))
      .filter((payment) => {
        if (!query) return true;
        return [payment.clientName, payment.company, payment.transactionId, payment.paymentMethod, payment.amount].join(' ').toLowerCase().includes(query);
      });
  }, [payments, search, statusFilter]);

  const resetForm = () => {
    setIsFormOpen(false);
    setEditId('');
    setForm(initialForm);
    setError('');
  };

  const openAdd = () => {
    setForm(initialForm);
    setEditId('');
    setIsFormOpen(true);
    setError('');
  };

  const openEdit = (payment) => {
    setEditId(payment.id);
    setForm({
      clientName: payment.clientName || '',
      company: payment.company || '',
      amount: payment.amount || '',
      paymentDate: payment.paymentDate || '',
      paymentMethod: payment.paymentMethod || '',
      transactionId: payment.transactionId || '',
      status: payment.status || 'Pending',
      screenshotUrl: payment.screenshotUrl || '',
      notes: payment.notes || '',
    });
    setIsFormOpen(true);
    setError('');
  };

  const onSave = async (event) => {
    event.preventDefault();
    if (!form.clientName.trim() || !form.amount.trim()) {
      setError('Client name and amount are required.');
      return;
    }

    const payload = {
      clientName: form.clientName.trim(),
      company: form.company.trim(),
      amount: form.amount.trim(),
      paymentDate: form.paymentDate.trim(),
      paymentMethod: form.paymentMethod.trim(),
      transactionId: form.transactionId.trim(),
      status: form.status,
      screenshotUrl: form.screenshotUrl.trim(),
      notes: form.notes.trim(),
    };

    if (editId) {
      await updatePayment(editId, payload);
    } else {
      await addPayment(payload);
    }
    resetForm();
  };

  const onDelete = async (payment) => {
    const confirmed = window.confirm(`Delete payment record for ${payment.clientName}?`);
    if (!confirmed) return;
    await deletePayment(payment.id);
    if (editId === payment.id) resetForm();
  };

  return (
    <>
      <PageHeader
        title="Payments"
        description="Track payment records, update statuses, and manage transaction history."
        actions={
          <button type="button" onClick={openAdd} className="btn-primary">
            <Plus size={15} /> Add Payment
          </button>
        }
      />

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total', paymentSummary.total],
          ['Pending', paymentSummary.pending],
          ['Paid', paymentSummary.paid],
          ['Verified', paymentSummary.verified],
          ['Failed', paymentSummary.failed],
        ].map(([label, value]) => (
          <article key={label} className="premium-panel p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-slate-800">{value}</p>
          </article>
        ))}
      </section>

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <Motion.form key="payment-form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} onSubmit={onSave} className="premium-panel mb-5 p-5">
            <div className="mb-4 flex items-center justify-between border-b border-blue-100 pb-3">
              <h2 className="font-display text-2xl font-semibold text-slate-800">{editId ? 'Edit Payment' : 'Add Payment'}</h2>
              <button type="button" onClick={resetForm} className="rounded-lg border border-blue-100 bg-white p-2 text-slate-500">
                <X size={14} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['clientName', 'Client Name *'],
                ['company', 'Company'],
                ['amount', 'Amount *'],
                ['paymentDate', 'Payment Date'],
                ['paymentMethod', 'Payment Method'],
                ['transactionId', 'Transaction ID / Reference No'],
                ['screenshotUrl', 'Screenshot URL'],
              ].map(([key, label]) => (
                <label key={key} className="text-sm text-slate-600">
                  {label}
                  <input value={form[key] || ''} onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))} className="input-shell mt-1.5" />
                </label>
              ))}
              <label className="text-sm text-slate-600">
                Status
                <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} className="input-shell mt-1.5">
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Verified">Verified</option>
                  <option value="Failed">Failed</option>
                </select>
              </label>
              <label className="text-sm text-slate-600 sm:col-span-2">
                Notes
                <textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} className="input-shell mt-1.5 min-h-[100px]" />
              </label>
            </div>

            {error ? <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button type="submit" className="btn-primary">
                {editId ? 'Update Payment' : 'Add Payment'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </Motion.form>
        ) : null}
      </AnimatePresence>

      <section className="premium-panel p-4">
        <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="input-shell" placeholder="Search client, transaction ID, method..." />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="input-shell sm:w-44">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Verified">Verified</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-blue-50 text-xs uppercase tracking-[0.12em] text-blue-700">
              <tr>
                <th className="px-3 py-3">Client</th>
                <th className="px-3 py-3">Company</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Method</th>
                <th className="px-3 py-3">Reference</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-t border-blue-100">
                  <td className="px-3 py-3 font-medium text-slate-700">{payment.clientName}</td>
                  <td className="px-3 py-3 text-slate-600">{payment.company || '-'}</td>
                  <td className="px-3 py-3 text-slate-600">{payment.amount}</td>
                  <td className="px-3 py-3 text-slate-600">{payment.paymentDate || '-'}</td>
                  <td className="px-3 py-3 text-slate-600">{payment.paymentMethod || '-'}</td>
                  <td className="px-3 py-3 text-slate-600">{payment.transactionId || '-'}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={() => openEdit(payment)} className="btn-secondary px-3 py-2 text-xs">
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(payment)}
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
          {filteredPayments.map((payment) => (
            <article key={payment.id} className="rounded-2xl border border-blue-100 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{payment.clientName}</p>
                  <p className="text-xs text-slate-500">{payment.company || '-'}</p>
                </div>
                <StatusBadge status={payment.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">Amount: {payment.amount || '-'}</p>
              <p className="text-xs text-slate-500">
                {payment.paymentDate || '-'} | {payment.paymentMethod || '-'}
              </p>
              <p className="mt-1 text-xs text-slate-500">Ref: {payment.transactionId || '-'}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => openEdit(payment)} className="btn-secondary px-3 py-2 text-xs">
                  <Pencil size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(payment)}
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>

        {!filteredPayments.length ? (
          <article className="mt-3 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-6 text-center text-sm text-slate-600">
            No payment records found.
          </article>
        ) : null}
      </section>
    </>
  );
};

export default PaymentsPage;
