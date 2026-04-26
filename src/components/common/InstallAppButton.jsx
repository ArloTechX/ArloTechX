import { useCallback, useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => (typeof window !== 'undefined' ? isStandalone() : false));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const onBeforeInstallPrompt = (event) => {
      setDeferredPrompt(event);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const onInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  if (installed) {
    return null;
  }

  if (deferredPrompt) {
    return (
      <button
        type="button"
        onClick={onInstallClick}
        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
        aria-label="Install app"
      >
        <Download size={16} />
        Install App
      </button>
    );
  }

  return null;
};

export default InstallAppButton;
