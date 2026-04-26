import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers3, MessageCircleQuestion } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import QuickActions from '../components/dashboard/QuickActions';
import StatusBadge from '../components/ui/StatusBadge';
import { inquiries, serviceModules } from '../data/appData';
import { useProjects } from '../hooks/useProjects';
import usePageMeta from '../hooks/usePageMeta';
import { db } from '../lib/firebase';

const initialDashboardMetrics = {
  totalProjects: 0,
  activeClients: 0,
  servicesCount: 0,
  pendingRequests: 0,
  completedWorks: 0,
  avgDelivery: 0,
  prevAvgDelivery: 0,
};
const DEFAULT_AVG_DELIVERY = 1.2;
const DEFAULT_PREV_AVG_DELIVERY = 2.1;

const toDateValue = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value?.toDate === 'function') {
    const next = value.toDate();
    return next instanceof Date && !Number.isNaN(next.getTime()) ? next : null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toWeeks = (milliseconds) => milliseconds / (1000 * 60 * 60 * 24 * 7);

const getAverage = (values) => {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
};

const calculateDeliveryMetrics = (projects) => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const completedProjects = (Array.isArray(projects) ? projects : []).filter(
    (project) => String(project?.status || '').toLowerCase() === 'completed',
  );

  const completedDurations = completedProjects
    .map((project) => {
      const createdAt = toDateValue(project?.createdAt);
      const completedAt = toDateValue(project?.completedAt || project?.updatedAt);
      if (!createdAt || !completedAt) return null;
      const diff = completedAt.getTime() - createdAt.getTime();
      if (diff <= 0) return null;
      return toWeeks(diff);
    })
    .filter((value) => Number.isFinite(value) && value > 0);

  const previousMonthDurations = completedProjects
    .map((project) => {
      const createdAt = toDateValue(project?.createdAt);
      const completedAt = toDateValue(project?.completedAt || project?.updatedAt);
      if (!createdAt || !completedAt) return null;
      if (completedAt < startOfPreviousMonth || completedAt >= startOfCurrentMonth) return null;
      const diff = completedAt.getTime() - createdAt.getTime();
      if (diff <= 0) return null;
      return toWeeks(diff);
    })
    .filter((value) => Number.isFinite(value) && value > 0);

  return {
    avgDelivery: getAverage(completedDurations),
    prevAvgDelivery: getAverage(previousMonthDurations),
  };
};

const normalizeDocArray = (snapshot) =>
  (snapshot?.docs || []).map((item) => ({
    id: item.id,
    ...(item.data() || {}),
  }));

const DashboardPage = () => {
  usePageMeta({
    title: 'Dashboard',
    description: 'ArloTechX SaaS dashboard overview for projects, clients, services, and incoming requests.',
  });

  const { projects } = useProjects();
  const [metrics, setMetrics] = useState(initialDashboardMetrics);

  useEffect(() => {
    let isMounted = true;

    const applyMetrics = (nextProjects, nextActiveClients, nextServices, nextPendingRequests, nextCompletedProjects) => {
      const deliveryMetrics = calculateDeliveryMetrics(nextCompletedProjects);

      if (!isMounted) return;

      setMetrics({
        totalProjects: nextProjects.length,
        activeClients: nextActiveClients.length,
        servicesCount: nextServices.length,
        pendingRequests: nextPendingRequests.length,
        completedWorks: nextCompletedProjects.length,
        avgDelivery: deliveryMetrics.avgDelivery,
        prevAvgDelivery: deliveryMetrics.prevAvgDelivery,
      });
    };

    const projectsQuery = query(collection(db, 'projects'));
    const activeClientsQuery = query(collection(db, 'clients'), where('status', '==', 'Active'));
    const servicesQuery = query(collection(db, 'services'));
    const pendingRequestsQuery = query(collection(db, 'requests'), where('status', '!=', 'Completed'));
    const completedProjectsQuery = query(collection(db, 'projects'), where('status', '==', 'Completed'));

    const loadInitial = async () => {
      try {
        const [projectsSnapshot, activeClientsSnapshot, servicesSnapshot, pendingRequestsSnapshot, completedProjectsSnapshot] = await Promise.all([
          getDocs(projectsQuery),
          getDocs(activeClientsQuery),
          getDocs(servicesQuery),
          getDocs(pendingRequestsQuery),
          getDocs(completedProjectsQuery),
        ]);

        applyMetrics(
          normalizeDocArray(projectsSnapshot),
          normalizeDocArray(activeClientsSnapshot),
          normalizeDocArray(servicesSnapshot),
          normalizeDocArray(pendingRequestsSnapshot),
          normalizeDocArray(completedProjectsSnapshot),
        );
      } catch {
        if (isMounted) {
          setMetrics(initialDashboardMetrics);
        }
      }
    };

    loadInitial();

    let liveProjects = [];
    let liveActiveClients = [];
    let liveServices = [];
    let livePendingRequests = [];
    let liveCompletedProjects = [];

    const syncLiveMetrics = () => {
      applyMetrics(liveProjects, liveActiveClients, liveServices, livePendingRequests, liveCompletedProjects);
    };

    const unsubscribeProjects = onSnapshot(
      projectsQuery,
      (snapshot) => {
        liveProjects = normalizeDocArray(snapshot);
        syncLiveMetrics();
      },
      () => {},
    );

    const unsubscribeClients = onSnapshot(
      activeClientsQuery,
      (snapshot) => {
        liveActiveClients = normalizeDocArray(snapshot);
        syncLiveMetrics();
      },
      () => {},
    );

    const unsubscribeServices = onSnapshot(
      servicesQuery,
      (snapshot) => {
        liveServices = normalizeDocArray(snapshot);
        syncLiveMetrics();
      },
      () => {},
    );

    const unsubscribeRequests = onSnapshot(
      pendingRequestsQuery,
      (snapshot) => {
        livePendingRequests = normalizeDocArray(snapshot);
        syncLiveMetrics();
      },
      () => {},
    );

    const unsubscribeCompletedProjects = onSnapshot(
      completedProjectsQuery,
      (snapshot) => {
        liveCompletedProjects = normalizeDocArray(snapshot);
        syncLiveMetrics();
      },
      () => {},
    );

    return () => {
      isMounted = false;
      unsubscribeProjects();
      unsubscribeClients();
      unsubscribeServices();
      unsubscribeRequests();
      unsubscribeCompletedProjects();
    };
  }, []);

  const dashboardProjects = projects
    .filter((project) => project.status !== 'Completed')
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
    .slice(0, 4);

  const avgDeliveryForDisplay = metrics.avgDelivery > 0 ? metrics.avgDelivery : DEFAULT_AVG_DELIVERY;
  const previousAvgForDisplay = metrics.prevAvgDelivery > 0 ? metrics.prevAvgDelivery : DEFAULT_PREV_AVG_DELIVERY;
  const avgDeliveryValue = `${avgDeliveryForDisplay.toFixed(1)}w`;

  const avgDeliveryDelta = useMemo(() => {
    if (avgDeliveryForDisplay < previousAvgForDisplay) return `Down from ${previousAvgForDisplay.toFixed(1)}w`;
    if (avgDeliveryForDisplay > previousAvgForDisplay) return `Up from ${previousAvgForDisplay.toFixed(1)}w`;
    return `Same as ${previousAvgForDisplay.toFixed(1)}w`;
  }, [avgDeliveryForDisplay, previousAvgForDisplay]);

  const dashboardStats = useMemo(
    () => [
      { label: 'Total Projects', value: String(metrics.totalProjects), delta: 'Live from Firestore', tone: 'blue' },
      { label: 'Active Clients', value: String(metrics.activeClients), delta: 'Status: Active', tone: 'cyan' },
      { label: 'Services Offered', value: String(metrics.servicesCount), delta: 'Live service count', tone: 'indigo' },
      { label: 'Pending Requests', value: String(metrics.pendingRequests), delta: 'Status not completed', tone: 'amber' },
      { label: 'Completed Works', value: String(metrics.completedWorks), delta: 'Projects marked completed', tone: 'emerald' },
      { label: 'Avg. Delivery Time', value: avgDeliveryValue, delta: avgDeliveryDelta, tone: 'violet' },
    ],
    [metrics, avgDeliveryValue, avgDeliveryDelta],
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back to ArloTechX control center. Track projects, clients, service demand, and incoming requests from one premium workspace."
      />

      <section className="premium-panel mb-6 overflow-hidden p-6 md:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <p className="section-kicker">Platform Overview</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-slate-800 md:text-4xl">ArloTechX Client Delivery Command Center</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              Manage software delivery, monitor active clients, and convert leads with a single product-style operational interface.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/projects" className="btn-primary">
                <Layers3 size={16} /> View Projects
              </Link>
              <Link to="/contact" className="btn-secondary">
                <MessageCircleQuestion size={16} /> Contact Team
              </Link>
            </div>
          </div>

          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="premium-panel bg-gradient-to-br from-blue-50 to-white p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Service Highlights</p>
            <ul className="mt-3 space-y-2">
              {serviceModules.slice(0, 4).map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded-lg border border-blue-100 bg-white px-3 py-2.5">
                  <span className="text-sm font-medium text-slate-700">{item.title}</span>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          </Motion.div>
        </div>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardStats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="mb-6 grid items-start gap-6 xl:grid-cols-[1.28fr_0.72fr]">
        <div className="premium-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-slate-800">Live Project Progress</h3>
            <Link to="/projects" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              View all
            </Link>
          </div>

          {dashboardProjects.length ? (
            <div className="space-y-3">
              {dashboardProjects.map((project) => (
                <article key={project.id} className="rounded-xl border border-blue-100 bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{project.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{project.description}</p>
                      {project.clientName || project.company ? (
                        <p className="mt-1 text-xs font-medium text-blue-700">{project.clientName || project.company}</p>
                      ) : null}
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="mt-3">
                    <div className="h-2 rounded-full bg-blue-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${project.progress || 0}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{project.progress || 0}% completion</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-6 text-center">
              <p className="text-sm font-medium text-slate-700">No active projects yet</p>
            </div>
          )}
        </div>

        <QuickActions />
      </section>

      <section className="premium-panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-slate-800">Latest Inquiry Summary</h3>
          <Link to="/contact" className="text-sm font-medium text-blue-700 hover:text-blue-800">
            Contact sales
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {inquiries.slice(0, 4).map((item) => (
            <article key={`${item.name}-${item.company}`} className="rounded-xl border border-blue-100 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {item.company} • {item.request}
              </p>
              <p className="mt-2 text-xs text-slate-600">{item.message}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
