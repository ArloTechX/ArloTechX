import { useEffect, useMemo, useState } from 'react';
import { serviceCatalog } from '../data/services';
import { ensureUniqueSlug, readServices, SERVICES_UPDATED_EVENT, slugifyService, writeServices } from '../utils/services';

const defaultServices = serviceCatalog.map((item) => ({ ...item, status: 'Active', badge: item.category }));

const useServices = () => {
  const [services, setServices] = useState(() => defaultServices);

  const refreshServices = async () => {
    const next = await readServices();
    setServices(next);
    return next;
  };

  const saveServices = async (nextServices) => {
    const saved = await writeServices(nextServices);
    setServices(saved);
    return saved;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshServices();

    const onInternalUpdate = () => {
      refreshServices();
    };

    const onFocus = () => {
      refreshServices();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshServices();
      }
    };

    window.addEventListener(SERVICES_UPDATED_EVENT, onInternalUpdate);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener(SERVICES_UPDATED_EVENT, onInternalUpdate);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const activeServices = useMemo(() => services.filter((service) => service.status === 'Active'), [services]);

  const addService = async (payload) => {
    const now = new Date().toISOString();
    const baseSlug = slugifyService(payload.slug || payload.title || '');
    const slug = ensureUniqueSlug(baseSlug, services);
    const entry = {
      ...payload,
      id: payload.id || `svc-${Date.now()}`,
      slug,
      createdAt: now,
      updatedAt: now,
    };
    return saveServices([entry, ...services]);
  };

  const updateService = async (id, payload) => {
    const now = new Date().toISOString();
    const current = services.find((service) => service.id === id);
    if (!current) return services;

    const baseSlug = slugifyService(payload.slug || payload.title || current.title || current.slug);
    const slug = ensureUniqueSlug(baseSlug, services, id);

    const nextServices = services.map((service) =>
      service.id === id
        ? {
            ...service,
            ...payload,
            slug,
            updatedAt: now,
          }
        : service,
    );

    return saveServices(nextServices);
  };

  const deleteService = async (id) => {
    return saveServices(services.filter((service) => service.id !== id));
  };

  const getServiceBySlug = (slug, options = { includeDraft: false }) => {
    const includeDraft = Boolean(options?.includeDraft);
    const source = includeDraft ? services : activeServices;
    return source.find((service) => service.slug === slug);
  };

  return {
    services,
    activeServices,
    refreshServices,
    saveServices,
    addService,
    updateService,
    deleteService,
    getServiceBySlug,
  };
};

export default useServices;
