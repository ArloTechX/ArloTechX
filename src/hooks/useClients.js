import { useEffect, useRef, useState } from 'react';
import { CLIENTS_STORAGE_KEY } from '../utils/clients';
import { readStoreValue, writeStoreValue } from '../utils/firebaseStore';

const CLIENTS_UPDATED_EVENT = 'arlotechx:clients-updated';

const ensureClientShape = (item, index) => {
  const fallbackId = `client-${item.name || 'unknown'}-${item.company || 'na'}-${index}`.toLowerCase().replace(/\s+/g, '-');

  return {
    id: item.id || fallbackId,
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    company: item.company || '',
    projectType: item.projectType || '',
    projectName: item.projectName || '',
    projectDescription: item.projectDescription || '',
    timeline: item.timeline || '',
    pricingItems: Array.isArray(item.pricingItems) ? item.pricingItems : [],
    totalAmount: Number.isFinite(Number(item.totalAmount)) ? Number(item.totalAmount) : 0,
    advancePaid: Number.isFinite(Number(item.advancePaid)) ? Number(item.advancePaid) : 0,
    balanceDue: Number.isFinite(Number(item.balanceDue)) ? Number(item.balanceDue) : 0,
    status: item.status || 'Active',
    createdAt: item.createdAt || new Date().toISOString(),
    source: item.source || 'Manual',
    convertedAt: item.convertedAt || '',
    notes: item.notes || '',
    sourceRequestId: item.sourceRequestId || '',
  };
};

const readClients = async () => {
  const value = await readStoreValue(CLIENTS_STORAGE_KEY, []);
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => ensureClientShape(item, index));
};

const useClients = () => {
  const [clients, setClients] = useState(() => []);
  const hasMountedRef = useRef(false);
  const skipPersistRef = useRef(false);

  useEffect(() => {
    const refreshClients = async () => {
      const next = await readClients();
      skipPersistRef.current = true;
      setClients(next);
    };

    refreshClients();

    const handleInternalUpdate = () => {
      refreshClients();
    };

    const handleFocus = () => {
      refreshClients();
    };

    window.addEventListener(CLIENTS_UPDATED_EVENT, handleInternalUpdate);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener(CLIENTS_UPDATED_EVENT, handleInternalUpdate);
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

    writeStoreValue(CLIENTS_STORAGE_KEY, clients)
      .then(() => {
        window.dispatchEvent(new CustomEvent(CLIENTS_UPDATED_EVENT));
      })
      .catch(() => {});
  }, [clients]);

  const addClient = (payload) => {
    const entry = {
      id: `client-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      projectType: payload.projectType,
      projectName: payload.projectName || '',
      projectDescription: payload.projectDescription || '',
      timeline: payload.timeline || '',
      pricingItems: Array.isArray(payload.pricingItems) ? payload.pricingItems : [],
      totalAmount: Number.isFinite(Number(payload.totalAmount)) ? Number(payload.totalAmount) : 0,
      advancePaid: Number.isFinite(Number(payload.advancePaid)) ? Number(payload.advancePaid) : 0,
      balanceDue: Number.isFinite(Number(payload.balanceDue)) ? Number(payload.balanceDue) : 0,
      status: payload.status,
      createdAt: new Date().toISOString(),
      source: payload.source || 'Manual',
      convertedAt: payload.convertedAt || '',
      notes: payload.notes || '',
      sourceRequestId: payload.sourceRequestId || '',
    };

    setClients((prev) => [entry, ...prev]);
  };

  const updateClient = (id, payload) => {
    setClients((prev) => prev.map((item) => (item.id === id ? { ...item, ...payload } : item)));
  };

  const deleteClient = (id) => {
    setClients((prev) => prev.filter((item) => item.id !== id));
  };

  const convertRequestToClient = (request) => {
    if (!request || !request.id) {
      return { ok: false, reason: 'Invalid request selected.' };
    }

    const normalizedEmail = String(request.email || '').trim().toLowerCase();

    const duplicate = normalizedEmail
      ? clients.find((client) => String(client.email || '').trim().toLowerCase() === normalizedEmail)
      : null;

    if (duplicate) {
      return { ok: true, existed: true, client: duplicate };
    }

    const nowIso = new Date().toISOString();
    const clientEntry = {
      id: `client-${Date.now()}`,
      name: request.name || 'Unknown',
      email: request.email || '',
      phone: request.phone || '',
      company: request.company || '',
      projectType: request.projectType || '',
      projectName: request.projectName || '',
      projectDescription: request.message || '',
      timeline: '',
      pricingItems: [],
      totalAmount: 0,
      advancePaid: 0,
      balanceDue: 0,
      status: 'Active',
      createdAt: request.createdAt || nowIso,
      source: 'Converted from Request',
      convertedAt: nowIso,
      notes: request.message || '',
      sourceRequestId: String(request.id),
    };

    setClients((prev) => [clientEntry, ...prev]);

    return { ok: true, existed: false, client: clientEntry };
  };

  return { clients, addClient, updateClient, deleteClient, convertRequestToClient };
};

export default useClients;
