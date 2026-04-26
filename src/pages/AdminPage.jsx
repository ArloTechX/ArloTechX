import { BarChart3, Briefcase, ListChecks, Mail, PlusCircle } from 'lucide-react';
import usePageMeta from '../hooks/usePageMeta';

const cards = [
  { title: 'Total Projects', value: '12', icon: Briefcase },
  { title: 'Active Services', value: '8', icon: ListChecks },
  { title: 'New Leads', value: '24', icon: Mail },
  { title: 'Conversion Rate', value: '31%', icon: BarChart3 },
];

const AdminPage = () => {
  usePageMeta({
    title: 'Admin Dashboard',
    description: 'Admin overview panel for ArloTechX services, projects, and lead management.',
  });

  return (
    <section className="px-4 py-14 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-2xl border border-cyan-400/20 bg-slate-900/60 p-6 shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Admin Panel</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-slate-100">Dashboard (Placeholder)</h1>
          <p className="mt-2 text-sm text-slate-300">
            Add authentication and backend integration to manage services, projects, and form submissions in production.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-cyan-400/20 bg-slate-900/60 p-5 shadow-glow">
              <card.icon className="text-cyan-300" size={22} />
              <p className="mt-4 text-sm text-slate-300">{card.title}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">{card.value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {['Services', 'Portfolio Projects', 'Contact Leads'].map((module) => (
            <section key={module} className="rounded-2xl border border-cyan-400/20 bg-slate-900/60 p-6 shadow-glow">
              <h2 className="font-display text-xl font-semibold text-slate-100">Manage {module}</h2>
              <p className="mt-2 text-sm text-slate-300">Use add/edit/delete actions after connecting this dashboard to your backend.</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 px-4 py-2 text-sm text-cyan-200 hover:border-cyan-200"
              >
                <PlusCircle size={16} /> Add New
              </button>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
