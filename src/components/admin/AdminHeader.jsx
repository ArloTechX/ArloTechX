import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import useRequests from '../../hooks/useRequests';
import InstallAppButton from '../common/InstallAppButton';

const routeTitles = {
  '/admin': 'Dashboard',
  '/admin/clients': 'Clients',
  '/admin/requests': 'Requests',
  '/admin/projects': 'Projects',
  '/admin/services': 'Services',
  '/admin/payment-settings': 'Payment Settings',
  '/admin/payments': 'Payments',
  '/admin/settings': 'Settings',
};

const AdminHeader = ({ onOpenMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { requests } = useRequests();

  const currentTitle = useMemo(() => routeTitles[location.pathname] || 'Admin Panel', [location.pathname]);
  const newRequestsCount = useMemo(() => requests.filter((req) => req.status === 'New').length, [requests]);

  return (
    <header className="sticky top-0 z-10 border-b border-blue-100 bg-white/85 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            className="inline-flex rounded-lg border border-blue-100 bg-white p-2 text-slate-600 shadow-sm lg:hidden"
            aria-label="Open admin menu"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700 sm:text-xs sm:tracking-[0.15em]">Admin Panel</p>
            <h1 className="truncate font-display text-base font-semibold text-slate-800 sm:text-lg">ArloTechX {currentTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <InstallAppButton />
          <button
            type="button"
            onClick={() => navigate('/admin/requests')}
            className="relative shrink-0 rounded-xl border border-blue-100 bg-white p-2.5 text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
            aria-label="Open requests"
          >
            <Bell size={17} />
            {newRequestsCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {newRequestsCount > 99 ? '99+' : newRequestsCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
