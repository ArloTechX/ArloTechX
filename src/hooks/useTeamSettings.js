import { useEffect, useState } from 'react';
import { defaultTeamSettings, normalizeTeamSettings, readTeamSettings, TEAM_SETTINGS_UPDATED_EVENT, writeTeamSettings } from '../utils/team';

const useTeamSettings = () => {
  const [teamSettings, setTeamSettings] = useState(() => normalizeTeamSettings(defaultTeamSettings));

  const refreshTeamSettings = async () => {
    const next = await readTeamSettings();
    setTeamSettings(next);
    return next;
  };

  const saveTeamSettings = async (nextValue) => {
    const saved = await writeTeamSettings(nextValue);
    setTeamSettings(saved);
    return saved;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshTeamSettings();

    const onInternalUpdate = () => {
      refreshTeamSettings();
    };

    const onFocus = () => {
      refreshTeamSettings();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshTeamSettings();
      }
    };

    window.addEventListener(TEAM_SETTINGS_UPDATED_EVENT, onInternalUpdate);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener(TEAM_SETTINGS_UPDATED_EVENT, onInternalUpdate);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return { teamSettings, saveTeamSettings, refreshTeamSettings };
};

export default useTeamSettings;
