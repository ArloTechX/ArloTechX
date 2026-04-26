import { useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock3,
  Download,
  Filter,
  Mail,
  MessageSquareText,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import useRequests from '../hooks/useRequests';
import useClients from '../hooks/useClients';
import useSettings from '../hooks/useSettings';
import { REQUEST_STATUSES } from '../utils/requests';
import usePageMeta from '../hooks/usePageMeta';
import { buildAcceptedMessage, buildCancelMessage, openWhatsAppChat, sanitizePhoneNumber } from '../utils/whatsapp';

const formatDate = (iso) => {
  if (!iso) return '-';
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? '-' : parsed.toLocaleString();
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'NA';

const RequestsPage = () => {
  usePageMeta({ title: 'Requests', description: 'Incoming lead and inquiry request management for ArloTechX.' });

  const { requests, updateRequestStatus, deleteRequest } = useRequests();
  const { convertRequestToClient } = useClients();
  const { settings } = useSettings();
  const [selectedId, setSelectedId] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projectTypeFilter, setProjectTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [convertLoadingId, setConvertLoadingId] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const projectTypeOptions = useMemo(() => {
    return ['All', ...new Set(requests.map((item) => item.projectType).filter(Boolean))];
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const list = requests.filter((item) => {
      const matchSearch =
        !normalizedSearch ||
        [item.name, item.email, item.company, item.projectType, item.message]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchProject = projectTypeFilter === 'All' || item.projectType === projectTypeFilter;

      return matchSearch && matchStatus && matchProject;
    });

    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'Oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return (a.name || '').localeCompare(b.name || '');
    });

    return sorted;
  }, [requests, search, statusFilter, projectTypeFilter, sortBy]);

  const selectedRequest = useMemo(() => {
    if (!filteredRequests.length) return null;
    return filteredRequests.find((item) => item.id === selectedId) || filteredRequests[0];
  }, [filteredRequests, selectedId]);

  const stats = useMemo(() => {
    const total = requests.length;
    const newCount = requests.filter((item) => item.status === 'New').length;
    const inProgressCount = requests.filter((item) => item.status === 'In Progress').length;
    const completedCount = requests.filter((item) => item.status === 'Completed').length;

    return [
      { label: 'Total Requests', value: total, icon: Sparkles, tone: 'from-blue-50 to-blue-100/70 text-blue-700' },
      { label: 'New Requests', value: newCount, icon: MessageSquareText, tone: 'from-sky-50 to-sky-100/70 text-sky-700' },
      { label: 'In Progress', value: inProgressCount, icon: Clock3, tone: 'from-amber-50 to-amber-100/70 text-amber-700' },
      { label: 'Completed', value: completedCount, icon: CheckCircle2, tone: 'from-emerald-50 to-emerald-100/70 text-emerald-700' },
    ];
  }, [requests]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setProjectTypeFilter('All');
    setSortBy('Newest');
  };

  const exportCsv = () => {
    if (!requests.length) return;

    const header = ['Name', 'Email', 'Phone', 'Company', 'Project Type', 'Budget', 'Status', 'Created At', 'Message'];
    const rows = requests.map((item) => [
      item.name,
      item.email,
      item.phone,
      item.company,
      item.projectType,
      item.budget,
      item.status,
      item.createdAt,
      item.message?.replace(/\n/g, ' '),
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'arlotechx-requests.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const onDelete = (request) => {
    if (!request?.id) return;
    const sanitizedPhone = sanitizePhoneNumber(request.phone);
    if (!sanitizedPhone) {
      setFeedback({ type: 'error', message: 'Phone number is missing. Cannot open WhatsApp for this request.' });
      return;
    }

    const confirmDelete = window.confirm('Open WhatsApp with cancel message and delete this request?');
    if (!confirmDelete) return;

    const message = buildCancelMessage(request, settings);
    if (!String(message || '').trim()) {
      setFeedback({ type: 'error', message: 'Could not generate cancellation message.' });
      return;
    }

    const waResult = openWhatsAppChat(request.phone, message);
    if (!waResult.ok) {
      setFeedback({ type: 'error', message: waResult.reason || 'Unable to open WhatsApp.' });
      return;
    }

    deleteRequest(request.id);
    if (selectedId === request.id) setSelectedId('');
    setFeedback({ type: 'success', message: 'WhatsApp opened with cancellation message and request deleted successfully.' });
  };

  const onConvertToClient = async (request) => {
    if (!request?.id) return;

    const sanitizedPhone = sanitizePhoneNumber(request.phone);
    if (!sanitizedPhone) {
      setFeedback({ type: 'error', message: 'Phone number is missing. Cannot open WhatsApp for this request.' });
      return;
    }

    const confirmConvert = window.confirm(
      'Send accepted WhatsApp message and move this person to Clients?',
    );
    if (!confirmConvert) return;

    try {
      const message = buildAcceptedMessage(request, settings);
      if (!String(message || '').trim()) {
        setFeedback({ type: 'error', message: 'Could not generate accepted message.' });
        return;
      }

      const waResult = openWhatsAppChat(request.phone, message);
      if (!waResult.ok) {
        setFeedback({ type: 'error', message: waResult.reason || 'Could not open WhatsApp.' });
        return;
      }

      setFeedback({ type: '', message: '' });
      setConvertLoadingId(request.id);

      const result = convertRequestToClient(request);
      if (!result.ok) {
        setFeedback({ type: 'error', message: result.reason || 'Failed to save client.' });
        return;
      }

      deleteRequest(request.id);
      if (selectedId === request.id) {
        setSelectedId('');
      }
      setFeedback({
        type: 'success',
        message: result.existed
          ? 'Client already exists. Request removed.'
          : 'Client added successfully.',
      });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to remove request.' });
    } finally {
      setConvertLoadingId('');
    }
  };

  if (requests.length === 0) {
    return (
      <>
        <PageHeader
          title="Requests"
          description="Incoming lead and inquiry request management for ArloTechX."
          actions={
            <button type="button" className="btn-secondary" onClick={() => window.location.reload()}>
              <RefreshCw size={15} /> Refresh
            </button>
          }
        />
        <Motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="premium-panel p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
            <MessageSquareText size={24} />
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold text-slate-800">No Requests Yet</h2>
          <p className="mt-2 text-sm text-slate-600">When users submit the contact form, their requests will appear here for admin review.</p>
          <button type="button" className="btn-primary mt-6" onClick={() => window.location.reload()}>
            <RefreshCw size={15} /> Check Again
          </button>
        </Motion.section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Requests"
        description="Manage incoming inquiries with a CRM-style workflow: triage, update status, and follow-up quickly."
        actions={
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
            <button type="button" className="btn-secondary" onClick={clearFilters}>
              <Filter size={15} /> Clear Filters
            </button>
            <button type="button" className="btn-secondary" onClick={exportCsv}>
              <Download size={15} /> Export
            </button>
            <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        }
      />
      {feedback.message ? (
        <div
          className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <section className="mb-6 grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <Motion.article
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`premium-panel min-w-0 bg-gradient-to-br p-4 sm:p-5 ${item.tone}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs sm:tracking-[0.14em]">{item.label}</p>
              <item.icon size={16} />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-800 sm:mt-3 sm:text-3xl">{item.value}</p>
          </Motion.article>
        ))}
      </section>

      <section className="premium-panel mb-5 p-3 sm:p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="relative xl:col-span-2">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input-shell pl-9"
              placeholder="Search by name, email, company, or message"
            />
          </label>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="input-shell">
            <option value="All">All Statuses</option>
            {REQUEST_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select value={projectTypeFilter} onChange={(event) => setProjectTypeFilter(event.target.value)} className="input-shell">
            {projectTypeOptions.map((projectType) => (
              <option key={projectType} value={projectType}>
                {projectType === 'All' ? 'All Project Types' : projectType}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="input-shell">
            <option value="Newest">Sort: Newest</option>
            <option value="Oldest">Sort: Oldest</option>
            <option value="Name">Sort: Name A-Z</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="premium-panel min-w-0 p-2.5 sm:p-3 md:p-4">
          <div className="space-y-3">
            {filteredRequests.map((item, index) => {
              const active = selectedRequest?.id === item.id;
              return (
                <Motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full max-w-full overflow-hidden rounded-2xl border p-3 text-left transition sm:p-4 ${
                    active
                      ? 'border-blue-300 bg-blue-50/80 shadow-[0_8px_24px_rgba(37,99,235,0.14)]'
                      : 'border-blue-100 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                  }`}
                >
                  <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-semibold text-white sm:h-11 sm:w-11 sm:text-sm">
                        {getInitials(item.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{item.name}</p>
                        <p className="truncate text-xs text-slate-500">{item.email}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{item.company || 'No company'}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                    <p><span className="font-semibold">Project:</span> {item.projectType}</p>
                    <p><span className="font-semibold">Budget:</span> {item.budget || '-'}</p>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-500">Submitted: {formatDate(item.createdAt)}</p>
                </Motion.button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <Motion.aside
            key={selectedRequest?.id || 'empty'}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="premium-panel min-w-0 p-4 sm:p-5"
          >
            {selectedRequest ? (
              <>
                <div className="flex min-w-0 items-start justify-between gap-3 border-b border-blue-100 pb-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Request Details</p>
                    <h3 className="mt-1 break-words font-display text-xl font-semibold text-slate-800 sm:text-2xl">{selectedRequest.name}</h3>
                    <p className="truncate text-sm text-slate-500">{selectedRequest.company || 'No company provided'}</p>
                  </div>
                  <StatusBadge status={selectedRequest.status} />
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <p className="break-all"><span className="font-semibold text-slate-700">Email:</span> {selectedRequest.email}</p>
                  <p><span className="font-semibold text-slate-700">Phone:</span> {selectedRequest.phone || '-'}</p>
                  <p><span className="font-semibold text-slate-700">Project Type:</span> {selectedRequest.projectType}</p>
                  <p><span className="font-semibold text-slate-700">Budget:</span> {selectedRequest.budget || '-'}</p>
                  <p><span className="font-semibold text-slate-700">Submitted:</span> {formatDate(selectedRequest.createdAt)}</p>
                </div>

                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Message</p>
                  <p className="break-words text-sm leading-relaxed text-slate-700">{selectedRequest.message}</p>
                </div>

                <div className="mt-4 border-t border-blue-100 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Update Status</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {REQUEST_STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateRequestStatus(selectedRequest.id, status)}
                        className={`w-full rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          selectedRequest.status === status
                            ? 'border-blue-300 bg-blue-600 text-white'
                            : 'border-blue-100 bg-white text-blue-700 hover:border-blue-300'
                        }`}
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <a href={`mailto:${selectedRequest.email}`} className="btn-secondary px-3 py-2 text-xs">
                    <Mail size={13} /> Reply
                  </a>
                  <button
                    type="button"
                    onClick={() => onConvertToClient(selectedRequest)}
                    disabled={convertLoadingId === selectedRequest.id}
                    className="btn-secondary px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Users size={13} /> {convertLoadingId === selectedRequest.id ? 'Converting...' : 'Convert to Client'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(selectedRequest)}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No request matches the current filters.</p>
              </div>
            )}
          </Motion.aside>
        </AnimatePresence>
      </section>
    </>
  );
};

export default RequestsPage;
