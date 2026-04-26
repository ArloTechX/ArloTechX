export const statusTone = {
  Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Active: 'bg-blue-100 text-blue-700 border-blue-200',
  Review: 'bg-amber-100 text-amber-700 border-amber-200',
  'On Hold': 'bg-slate-100 text-slate-600 border-slate-200',
  New: 'bg-sky-100 text-sky-700 border-sky-200',
  Qualified: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Pending: 'bg-orange-100 text-orange-700 border-orange-200',
  'In Review': 'bg-violet-100 text-violet-700 border-violet-200',
  'In Progress': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Popular: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  Core: 'bg-blue-100 text-blue-700 border-blue-200',
  Design: 'bg-rose-100 text-rose-700 border-rose-200',
  Trending: 'bg-purple-100 text-purple-700 border-purple-200',
  Stable: 'bg-teal-100 text-teal-700 border-teal-200',
  Ops: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Support: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Near Launch': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Build Phase': 'bg-amber-100 text-amber-700 border-amber-200',
  Paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Verified: 'bg-blue-100 text-blue-700 border-blue-200',
  Failed: 'bg-rose-100 text-rose-700 border-rose-200',
};

export const getStatusTone = (status) => statusTone[status] ?? 'bg-slate-100 text-slate-700 border-slate-200';


