import { motion as Motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const ProjectList = ({ projects, onEdit, onDelete }) => {
  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Motion.article
          key={project.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-panel p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-800">{project.title}</h3>
              <p className="mt-1 text-xs text-slate-500">
                {project.category}
                {project.company ? ` • ${project.company}` : ''}
              </p>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <p className="mt-2 text-sm text-slate-600">{project.description}</p>
          <div className="mt-2">
            <div className="h-2 rounded-full bg-blue-100">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${project.progress || 0}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-500">{project.progress || 0}% completion</p>
          </div>
          <p className="mt-2 text-xs text-slate-500">Tech: {Array.isArray(project.techStack) ? project.techStack.join(', ') || 'N/A' : 'N/A'}</p>

          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => onEdit(project)} className="btn-secondary px-3 py-2 text-xs">
              <Pencil size={14} /> Edit
            </button>
            <button type="button" onClick={() => onDelete(project)} className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </Motion.article>
      ))}
    </div>
  );
};

export default ProjectList;
