import { useEffect, useState } from 'react';
import { defaultPaymentSettings, PAYMENTS_UPDATED_EVENT, readPaymentSettings, writePaymentSettings } from '../utils/payments';

const usePaymentSettings = () => {
  const [paymentSettings, setPaymentSettings] = useState(() => ({ ...defaultPaymentSettings }));

  const refreshPaymentSettings = async () => {
    const next = await readPaymentSettings();
    setPaymentSettings(next);
    return next;
  };

  const savePaymentSettings = async (value) => {
    const saved = await writePaymentSettings(value);
    setPaymentSettings(saved);
    return saved;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshPaymentSettings();

    const onInternalUpdate = () => {
      refreshPaymentSettings();
    };

    const onFocus = () => {
      refreshPaymentSettings();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshPaymentSettings();
      }
    };

    window.addEventListener(PAYMENTS_UPDATED_EVENT, onInternalUpdate);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener(PAYMENTS_UPDATED_EVENT, onInternalUpdate);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return { paymentSettings, savePaymentSettings, refreshPaymentSettings };
};

export default usePaymentSettings;
