import { useEffect, useMemo, useState } from 'react';
import { PAYMENTS_UPDATED_EVENT, readPayments, writePayments } from '../utils/payments';

const usePayments = () => {
  const [payments, setPayments] = useState(() => []);

  const refreshPayments = async () => {
    const next = await readPayments();
    setPayments(next);
    return next;
  };

  const savePayments = async (value) => {
    const saved = await writePayments(value);
    setPayments(saved);
    return saved;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshPayments();

    const onInternalUpdate = () => {
      refreshPayments();
    };

    const onFocus = () => {
      refreshPayments();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshPayments();
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

  const addPayment = async (payload) => {
    const entry = {
      id: `pay-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    return savePayments([entry, ...payments]);
  };

  const updatePayment = async (id, payload) => {
    return savePayments(payments.map((item) => (item.id === id ? { ...item, ...payload } : item)));
  };

  const deletePayment = async (id) => {
    return savePayments(payments.filter((item) => item.id !== id));
  };

  const paymentSummary = useMemo(
    () => ({
      total: payments.length,
      paid: payments.filter((item) => item.status === 'Paid').length,
      verified: payments.filter((item) => item.status === 'Verified').length,
      pending: payments.filter((item) => item.status === 'Pending').length,
      failed: payments.filter((item) => item.status === 'Failed').length,
    }),
    [payments],
  );

  return { payments, refreshPayments, addPayment, updatePayment, deletePayment, paymentSummary };
};

export default usePayments;
