import { useEffect, useState } from 'react';
import { defaultSettings, readSettings, writeSettings } from '../utils/settings';

const useSettings = () => {
  const [settings, setSettings] = useState(() => ({ ...defaultSettings }));

  const refreshSettings = async () => {
    const next = await readSettings();
    setSettings(next);
    return next;
  };

  const saveSettings = async (nextSettings) => {
    const saved = await writeSettings(nextSettings);
    setSettings(saved);
    return saved;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSettings();

    const onFocus = () => {
      refreshSettings();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSettings();
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return { settings, saveSettings, refreshSettings };
};

export default useSettings;
