import { Link, NavLink } from 'react-router-dom';
import {
  Boxes,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Settings2,
  UsersRound,
  LogOut,
  X,
  CreditCard,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

const adminNav = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Clients', path: '/admin/clients', icon: UsersRound },
  { label: 'Requests', path: '/admin/requests', icon: Inbox },
  { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { label: 'Team Management', path: '/admin/team', icon: UsersRound },
  { label: 'Services', path: '/admin/services', icon: Boxes },
  { label: 'Payment Settings', path: '/admin/payment-settings', icon: CreditCard },
  { label: 'Payments', path: '/admin/payments', icon: Receipt },
  { label: 'Settings', path: '/admin/settings', icon: Settings2 },
];

const AdminSidebar = ({ onLogout, mobileOpen, onCloseMobile, collapsed, onToggleCollapsed }) => {
  const { logout } = useAuth();

  return (
    <>
      {mobileOpen ? <button type="button" className="fixed inset-0 z-40 bg-slate-900/25 lg:hidden" onClick={onCloseMobile} /> : null}

      <aside
        className={`fixed left-0 top-0 z-50 h-[100dvh] border-r border-blue-100 bg-white/92 backdrop-blur-xl transition-all duration-300 lg:sticky lg:z-20 lg:h-screen ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-blue-100 p-4">
            <Link to="/admin" className={`${collapsed ? 'hidden' : 'block'}`} onClick={onCloseMobile}>
              <Logo className="h-9 w-9" />
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleCollapsed}
                className="hidden rounded-lg border border-blue-100 bg-white p-2 text-slate-500 lg:inline-flex"
                aria-label="Toggle sidebar"
              >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-lg border border-blue-100 bg-white p-2 text-slate-500 lg:hidden"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-3">
            {adminNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-transparent text-slate-600 hover:border-blue-100 hover:bg-white hover:text-blue-700'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
                onClick={onCloseMobile}
              >
                <item.icon size={18} className="shrink-0" />
                <span className={`${collapsed ? 'hidden' : 'inline'}`}>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="shrink-0 border-t border-blue-100/80 bg-transparent p-3">
            <button
              type="button"
              onClick={async () => {
                await logout();
                onLogout();
              }}
              title={collapsed ? 'Logout' : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-slate-600 transition hover:border-blue-100 hover:bg-white hover:text-blue-700 ${
                collapsed ? 'justify-center' : 'justify-start'
              }`}
            >
              <LogOut size={18} className="shrink-0" />
              <span className={`${collapsed ? 'hidden' : 'inline'}`}>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
