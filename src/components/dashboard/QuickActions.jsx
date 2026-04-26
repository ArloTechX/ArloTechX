import { ArrowUpRight, FilePlus2, FolderKanban, UsersRound } from 'lucide-react';

const actions = [
  { icon: FilePlus2, label: 'Create Proposal' },
  { icon: FolderKanban, label: 'Add Project' },
  { icon: UsersRound, label: 'Invite Client' },
];

const QuickActions = () => {
  return (
    <section className="premium-panel p-5">
      <h3 className="font-display text-xl font-semibold text-slate-800">Quick Actions</h3>
      <p className="mt-1 text-sm text-slate-600">Start common workflows from your command panel.</p>
      <div className="mt-4 space-y-3">
        {actions.map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-blue-100 bg-white px-3.5 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <item.icon size={16} className="text-blue-600" />
              {item.label}
            </span>
            <ArrowUpRight size={14} className="text-slate-400" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;

