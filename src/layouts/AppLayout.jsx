import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '../components/layout/AppSidebar';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell relative lg:grid lg:grid-cols-[auto_1fr]">
      <AppSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((prev) => !prev)}
      />

      <div className="min-h-screen lg:ml-0">
        <AppHeader onOpenMobile={() => setMobileOpen(true)} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </div>
  );
};

export default AppLayout;

