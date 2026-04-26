import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search } from 'lucide-react';
import InstallAppButton from '../common/InstallAppButton';

const AppHeader = ({ onOpenMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('q') || '';

  const onSearchChange = (value) => {
    const nextParams = new URLSearchParams(location.search);
    const nextValue = value.trimStart();

    if (nextValue) {
      nextParams.set('q', nextValue);
    } else {
      nextParams.delete('q');
    }

    const nextSearch = nextParams.toString();
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : '',
      },
      { replace: true },
    );
  };

  const searchPlaceholder = location.pathname.startsWith('/services')
    ? 'Search services...'
    : 'Search projects, services...';

  return (
    <header className="sticky top-0 z-10 border-b border-blue-100 bg-white/85 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            className="inline-flex rounded-lg border border-blue-100 bg-white p-2 text-slate-600 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="relative hidden w-[320px] md:block">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input-shell pl-9"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <InstallAppButton />
          <button type="button" className="inline-flex rounded-xl border border-blue-100 bg-white p-2.5 text-slate-500">
            <Bell size={18} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center justify-center rounded-xl border border-blue-100 bg-white p-1.5"
            aria-label="Open admin profile"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">AX</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
