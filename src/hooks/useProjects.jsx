/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { readStoreValue, writeStoreValue } from '../utils/firebaseStore';

const STORAGE_KEY = 'arlx_projects_store';
const PROJECTS_UPDATED_EVENT = 'arlotechx:projects-updated';
const ProjectsContext = createContext(null);

const ensureProjectShape = (project, index) => {
  return {
    id: project.id || `proj-${Date.now()}-${index}`,
    title: project.title || '',
    description: project.description || '',
    image: project.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    category: project.category || 'Web',
    status: project.status || 'New',
    progress: Number.isFinite(Number(project.progress)) ? Math.min(100, Math.max(0, Number(project.progress))) : 0,
    clientName: project.clientName || '',
    company: project.company || '',
    techStack: Array.isArray(project.techStack) ? project.techStack : [],
    liveLink: project.liveLink || '#',
    githubLink: project.githubLink || '#',
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || project.createdAt || new Date().toISOString(),
  };
};

const readProjects = async () => {
  const value = await readStoreValue(STORAGE_KEY, []);
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => ensureProjectShape(item, index));
};

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => []);
  const hasMountedRef = useRef(false);
  const skipPersistRef = useRef(false);

  useEffect(() => {
    const refreshProjects = async () => {
      const next = await readProjects();
      skipPersistRef.current = true;
      setProjects(next);
    };

    refreshProjects();

    const handleInternalUpdate = () => {
      refreshProjects();
    };

    const handleFocus = () => {
      refreshProjects();
    };

    window.addEventListener(PROJECTS_UPDATED_EVENT, handleInternalUpdate);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener(PROJECTS_UPDATED_EVENT, handleInternalUpdate);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }

    writeStoreValue(STORAGE_KEY, projects)
      .then(() => {
        window.dispatchEvent(new CustomEvent(PROJECTS_UPDATED_EVENT));
      })
      .catch(() => {});
  }, [projects]);

  const addProject = (payload) => {
    const next = ensureProjectShape({
      ...payload,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setProjects((prev) => [next, ...prev]);
    return next;
  };

  const updateProject = (id, payload) => {
    setProjects((prev) =>
      prev.map((item) =>
        item.id === id
          ? ensureProjectShape({
              ...item,
              ...payload,
              updatedAt: new Date().toISOString(),
            })
          : item,
      ),
    );
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const value = useMemo(() => ({ projects, addProject, updateProject, deleteProject }), [projects]);

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectsProvider');
  }
  return context;
};
