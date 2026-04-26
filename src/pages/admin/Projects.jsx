import { useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import ProjectForm from '../../components/admin/ProjectForm';
import ProjectList from '../../components/admin/ProjectList';
import { useProjects } from '../../hooks/useProjects';
import usePageMeta from '../../hooks/usePageMeta';

const AdminProjectsPage = () => {
  usePageMeta({ title: 'Admin Projects', description: 'Manage project CRUD operations in admin panel.' });

  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const openAddForm = () => {
    setEditProject(null);
    setIsFormOpen(true);
  };

  const openEditForm = (project) => {
    setEditProject(project);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditProject(null);
    setIsFormOpen(false);
  };

  const handleSave = (payload) => {
    setLoading(true);

    if (editProject) {
      updateProject(editProject.id, payload);
      setMessage('Project updated successfully.');
    } else {
      addProject(payload);
      setMessage('Project added successfully.');
    }

    closeForm();
    setLoading(false);
  };

  const handleDelete = (project) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${project.title}"?`);
    if (!confirmDelete) return;

    deleteProject(project.id);
    if (editProject?.id === project.id) {
      closeForm();
    }
    setMessage('Project deleted successfully.');
  };

  return (
    <>
      <div className="mb-6">
        <p className="section-kicker">Admin Projects</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-semibold text-slate-800">Project Management</h1>
          {!isFormOpen ? (
            <button type="button" onClick={openAddForm} className="btn-primary">
              <Plus size={15} /> Add Project
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-slate-600">Add, edit, and delete projects. Changes are reflected instantly in public view.</p>
      </div>

      {message ? <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{message}</p> : null}

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <Motion.section key="project-form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <ProjectForm
              key={editProject?.id || 'new-project'}
              initialValues={editProject}
              onSubmit={handleSave}
              onCancel={closeForm}
              loading={loading}
            />
          </Motion.section>
        ) : (
          <Motion.section key="project-list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2 className="mb-3 font-display text-xl font-semibold text-slate-800">Project List</h2>
            <ProjectList projects={projects} onEdit={openEditForm} onDelete={handleDelete} />
          </Motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminProjectsPage;
