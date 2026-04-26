import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { projectFilters, projectModules } from '../data/appData';
import usePageMeta from '../hooks/usePageMeta';

const ProjectsPage = () => {
  usePageMeta({ title: 'Projects', description: 'ArloTechX project dashboard and delivery status overview.' });

  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return projectModules;
    return projectModules.filter((item) => item.category === filter);
  }, [filter]);

  return (
    <>
      <PageHeader
        title="Projects"
        description="Track project progress, status, and delivery pipeline in a product-style workspace."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {projectFilters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              filter === item ? 'border-blue-300 bg-blue-600 text-white' : 'border-blue-100 bg-white text-blue-700 hover:bg-blue-50'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => (
          <article key={project.id} className="premium-panel overflow-hidden">
            <div className="relative h-44">
              <img src={project.image} alt={project.title} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full border border-blue-100 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                {project.category}
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-slate-800">{project.title}</h3>
                <StatusBadge status={project.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{project.description}</p>
              <div className="mt-3">
                <div className="h-2 rounded-full bg-blue-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${project.progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{project.progress}% complete</p>
              </div>
              <button type="button" className="btn-secondary mt-4 w-full justify-between">
                Open Project <ExternalLink size={14} />
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
};

export default ProjectsPage;

