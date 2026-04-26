import { Link } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import usePageMeta from '../hooks/usePageMeta';
import useClients from '../hooks/useClients';
import useRequests from '../hooks/useRequests';
import { useProjects } from '../hooks/useProjects';

const AdminDashboardPage = () => {
  usePageMeta({ title: 'Admin Dashboard', description: 'Private admin dashboard for ArloTechX.' });
  const { clients } = useClients();
  const { requests } = useRequests();
  const { projects } = useProjects();

  const stats = [
    { label: 'Total Clients', value: String(clients.length), delta: 'Live storage data', tone: 'blue' },
    { label: 'Total Requests', value: String(requests.length), delta: 'From inquiry inbox', tone: 'amber' },
    {
      label: 'Active Projects',
      value: String(projects.filter((project) => project.status !== 'Completed').length),
      delta: 'Current delivery pipeline',
      tone: 'emerald',
    },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Admin Workspace</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-slate-800">ArloTechX Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Manage private modules and control operational workflows.</p>
        </div>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="mb-6">
        <div className="premium-panel p-5">
          <h2 className="font-display text-xl font-semibold text-slate-800">Quick Actions</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            <Link to="/admin/requests" className="block rounded-xl border border-blue-100 bg-white p-3 text-sm font-medium text-slate-700 hover:border-blue-200">
              Review Requests
            </Link>
            <Link to="/admin/projects" className="block rounded-xl border border-blue-100 bg-white p-3 text-sm font-medium text-slate-700 hover:border-blue-200">
              Manage Projects
            </Link>
            <Link to="/admin/services" className="block rounded-xl border border-blue-100 bg-white p-3 text-sm font-medium text-slate-700 hover:border-blue-200">
              Manage Services
            </Link>
          </div>
        </div>
      </section>

      <section className="premium-panel p-5">
        <h2 className="mb-4 font-display text-xl font-semibold text-slate-800">Latest Requests</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {requests.slice(0, 4).map((item) => (
            <article key={item.id} className="rounded-xl border border-blue-100 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {item.company} • {item.projectType}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default AdminDashboardPage;
