import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { readStoreValue, writeStoreValue } from '../utils/firebaseStore';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'arlotechx:admin-sidebar-collapsed';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isDocumentPreviewRoute = location.pathname.startsWith('/admin/documents/');

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let isMounted = true;
    const loadCollapsedState = async () => {
      const value = await readStoreValue(SIDEBAR_COLLAPSED_STORAGE_KEY, false);
      if (isMounted) {
        setCollapsed(value === true || value === 'true');
      }
    };
    loadCollapsedState();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    writeStoreValue(SIDEBAR_COLLAPSED_STORAGE_KEY, Boolean(collapsed)).catch(() => {});
  }, [collapsed]);

  return (
    <div
      className={`min-h-screen overflow-x-hidden text-slate-800 ${
        isDocumentPreviewRoute
          ? 'bg-slate-100'
          : 'bg-[radial-gradient(900px_500px_at_8%_-10%,rgba(56,189,248,0.16),transparent_62%),radial-gradient(820px_460px_at_95%_8%,rgba(59,130,246,0.18),transparent_58%),linear-gradient(180deg,#f8fbff_0%,#f4f8ff_55%,#f8fbff_100%)]'
      } ${isDocumentPreviewRoute ? '' : 'relative'}`}
    >
      {!isDocumentPreviewRoute ? (
        <AdminSidebar
          onLogout={() => navigate('/', { replace: true })}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />
      ) : null}
      <div className={`min-h-screen min-w-0 ${isDocumentPreviewRoute ? '' : collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {!isDocumentPreviewRoute ? <AdminHeader onOpenMobile={() => setMobileMenuOpen(true)} /> : null}
        <main className={`min-w-0 ${isDocumentPreviewRoute ? 'px-3 py-5 sm:px-5' : 'px-3 py-6 sm:px-4 md:px-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
