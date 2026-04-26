import { useEffect, useRef, useState } from 'react';
import { REQUESTS_STORAGE_KEY } from '../utils/requests';
import { readStoreValue, writeStoreValue } from '../utils/firebaseStore';

const REQUESTS_UPDATED_EVENT = 'arlotechx:requests-updated';

const ensureRequestShape = (item, index) => {
  const baseId = item.id || `req-legacy-${item.createdAt || 'na'}-${item.email || 'unknown'}-${index}`;
  return {
    id: baseId,
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    company: item.company || '',
    projectType: item.projectType || '',
    budget: item.budget || '',
    message: item.message || '',
    status: item.status || 'New',
    createdAt: item.createdAt || new Date().toISOString(),
  };
};

const readRequests = async () => {
  const value = await readStoreValue(REQUESTS_STORAGE_KEY, []);
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => ensureRequestShape(item, index));
};

const areRequestsEqual = (left, right) => {
  if (left === right) return true;
  if (!Array.isArray(left) || !Array.isArray(right)) return false;
  if (left.length !== right.length) return false;

  return left.every((item, index) => {
    const other = right[index];
    return (
      item.id === other.id &&
      item.name === other.name &&
      item.email === other.email &&
      item.phone === other.phone &&
      item.company === other.company &&
      item.projectType === other.projectType &&
      item.budget === other.budget &&
      item.message === other.message &&
      item.status === other.status &&
      item.createdAt === other.createdAt
    );
  });
};

const persistRequests = async (nextRequests) => {
  await writeStoreValue(REQUESTS_STORAGE_KEY, nextRequests);
  window.dispatchEvent(new CustomEvent(REQUESTS_UPDATED_EVENT));
};

const useRequests = () => {
  const [requests, setRequests] = useState(() => []);
  const hasMountedRef = useRef(false);
  const skipPersistRef = useRef(false);

  useEffect(() => {
    const refreshRequests = async () => {
      const nextRequests = await readRequests();
      skipPersistRef.current = true;
      setRequests((prev) => (areRequestsEqual(prev, nextRequests) ? prev : nextRequests));
    };

    refreshRequests();

    const handleInternalUpdate = () => {
      refreshRequests();
    };

    const handleFocus = () => {
      refreshRequests();
    };

    window.addEventListener(REQUESTS_UPDATED_EVENT, handleInternalUpdate);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener(REQUESTS_UPDATED_EVENT, handleInternalUpdate);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }

    persistRequests(requests).catch(() => {});
  }, [requests]);

  const addRequest = (payload) => {
    const entry = {
      id: `req-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      company: payload.company || '',
      projectType: payload.projectType,
      budget: payload.budget || '',
      message: payload.message,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [entry, ...prev]);
    return entry;
  };

  const updateRequestStatus = (id, status) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const deleteRequest = (id) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
  };

  return { requests, addRequest, updateRequestStatus, deleteRequest };
};

export default useRequests;
