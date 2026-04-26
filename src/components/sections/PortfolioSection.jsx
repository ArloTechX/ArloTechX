import { useMemo, useState } from 'react';
import { Code2, ExternalLink } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { projectCategories, projects } from '../../data/projects';

const PortfolioSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="section-shell">
      <div className="section-inner">
        <SectionHeader
          eyebrow="Portfolio"
          title="Project Showcases Engineered for Real Business Impact"
          description="A curated look at high-performing digital products designed for growth, speed, and measurable results."
        />

        <div className="mt-9 flex flex-wrap gap-3">
          {projectCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                activeCategory === category
                  ? 'border border-blue-300 bg-blue-600 text-white shadow-[0_10px_22px_rgba(37,99,235,0.25)]'
                  : 'border border-blue-100 bg-white text-blue-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <Motion.article
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="premium-card group overflow-hidden rounded-3xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/35 via-blue-500/10 to-transparent" />
                <p className="absolute left-4 top-4 rounded-full border border-blue-100 bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-blue-700">
                  {project.category}
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-slate-800">{project.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((stack) => (
                    <span key={stack} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {stack}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={project.demoUrl} className="btn-primary px-4 py-2.5 text-xs uppercase tracking-[0.1em]">
                    <ExternalLink size={14} /> Live Demo
                  </a>
                  <a href={project.githubUrl} className="btn-secondary px-4 py-2.5 text-xs uppercase tracking-[0.1em]">
                    <Code2 size={14} /> GitHub
                  </a>
                </div>
              </div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
