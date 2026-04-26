import { Link, NavLink } from 'react-router-dom';
import {
  Boxes,
  Building2,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  MessageSquareMore,
  Settings2,
  CreditCard,
  UsersRound,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { appNav } from '../../data/appData';
import Logo from '../common/Logo';

const iconMap = {
  LayoutDashboard,
  Building2,
  Boxes,
  FolderKanban,
  UsersRound,
  Inbox,
  MessageSquareMore,
  Settings2,
  CreditCard,
};

const AppSidebar = ({ mobileOpen, onCloseMobile, collapsed, onToggleCollapsed }) => {
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
            <Link to="/dashboard" className={`${collapsed ? 'hidden' : 'block'}`} onClick={onCloseMobile}>
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
            {appNav.map((item) => {
              const Icon = iconMap[item.icon] ?? LayoutDashboard;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-transparent text-slate-600 hover:border-blue-100 hover:bg-white hover:text-blue-700'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  onClick={onCloseMobile}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className={`${collapsed ? 'hidden' : 'inline'}`}>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="shrink-0 border-t border-blue-100/80 bg-transparent p-3">
            <div className="rounded-xl border border-blue-100/70 bg-transparent p-3">
              <p className={`text-xs font-semibold uppercase tracking-[0.15em] text-blue-600 ${collapsed ? 'hidden' : 'block'}`}>
                ArloTechX Suite
              </p>
              <p className={`mt-1 text-xs text-slate-500 ${collapsed ? 'hidden' : 'block'}`}>
                Global Innovation & Software Solutions
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;

