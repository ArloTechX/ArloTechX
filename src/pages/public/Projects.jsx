import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import { useProjects } from '../../hooks/useProjects';
import usePageMeta from '../../hooks/usePageMeta';

const filters = ['All', 'Web', 'AI', 'Business', 'UI/UX'];

const PublicProjectsPage = () => {
  usePageMeta({ title: 'Projects', description: 'Public portfolio showcase for ArloTechX projects.' });
  const { projects } = useProjects();
  const [activeFilter, setActiveFilter] = useState('All');

  const visibleProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <>
      <PageHeader
        title="Projects"
        description="Explore selected ArloTechX deliveries across web, AI, business, and UI/UX categories."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              activeFilter === filter ? 'border-blue-300 bg-blue-600 text-white' : 'border-blue-100 bg-white text-blue-700 hover:bg-blue-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleProjects.map((project) => (
          <Motion.article key={project.id} whileHover={{ y: -4 }} className="premium-panel overflow-hidden">
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

              <div className="mt-3 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn-primary flex-1 justify-center px-3 py-2 text-xs">
                  <ExternalLink size={14} /> View Live
                </a>
                <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn-secondary flex-1 justify-center px-3 py-2 text-xs">
                  <Code2 size={14} /> GitHub
                </a>
              </div>
            </div>
          </Motion.article>
        ))}
      </section>
    </>
  );
};

export default PublicProjectsPage;
