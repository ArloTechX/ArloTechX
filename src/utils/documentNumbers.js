import { getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getStoreDocRef } from './firebaseStore';

const DOCUMENT_COUNTER_STORAGE_KEY = 'arlotechx_document_counters';
const DOCUMENT_NUMBER_MAP_STORAGE_KEY = 'documentNumbers';

const DOCUMENT_PREFIX = {
  quotation: 'ATX-Q',
  agreement: 'ATX-AGR',
  invoice: 'ATX-INV',
};

const TYPE_COUNTER_KEY = {
  quotation: 'quotationCounter',
  agreement: 'agreementCounter',
  invoice: 'invoiceCounter',
};

const getSafeObject = (value) => (value && typeof value === 'object' ? value : {});

const padSequence = (value) => String(value).padStart(3, '0');

const getCounters = async () => {
  try {
    const snapshot = await getDoc(getStoreDocRef(DOCUMENT_COUNTER_STORAGE_KEY));
    if (!snapshot.exists()) return {};
    const data = snapshot.data();
    return getSafeObject(data?.value);
  } catch {
    return {};
  }
};

export const getNextDocumentNumber = async (type) => {
  const normalizedType = String(type || '').toLowerCase();
  const prefix = DOCUMENT_PREFIX[normalizedType] || 'ATX-DOC';
  const counterRef = getStoreDocRef(DOCUMENT_COUNTER_STORAGE_KEY);

  const nextSequence = await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    const counters = counterSnap.exists() ? getSafeObject(counterSnap.data()?.value) : {};
    const next = Number(counters[normalizedType] || 0) + 1;

    counters[normalizedType] = next;

    transaction.set(
      counterRef,
      {
        value: counters,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return next;
  });

  return `${prefix}-${padSequence(nextSequence)}`;
};

export const getOrCreateDocumentNumber = async (clientId, type) => {
  const normalizedType = String(type || '').toLowerCase();
  const safeClientId = String(clientId || '').trim();
  const prefix = DOCUMENT_PREFIX[normalizedType];

  if (!safeClientId || !prefix) {
    return getNextDocumentNumber(normalizedType);
  }

  const mapRef = getStoreDocRef(DOCUMENT_NUMBER_MAP_STORAGE_KEY);
  const counterRef = getStoreDocRef(DOCUMENT_COUNTER_STORAGE_KEY);

  return runTransaction(db, async (transaction) => {
    const mapSnap = await transaction.get(mapRef);
    const counterSnap = await transaction.get(counterRef);

    const map = mapSnap.exists() ? getSafeObject(mapSnap.data()?.value) : {};
    const counters = counterSnap.exists() ? getSafeObject(counterSnap.data()?.value) : {};

    const clientRecords = getSafeObject(map[safeClientId]);
    const existingRecord = clientRecords[normalizedType];
    const now = new Date().toISOString();

    if (existingRecord && typeof existingRecord === 'object' && existingRecord.number) {
      clientRecords[normalizedType] = {
        ...existingRecord,
        lastGeneratedAt: now,
      };

      map[safeClientId] = clientRecords;

      transaction.set(
        mapRef,
        {
          value: map,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      return existingRecord.number;
    }

    const counterKey = TYPE_COUNTER_KEY[normalizedType];
    const next = Number(counters[counterKey] || 0) + 1;

    counters[counterKey] = next;
    counters[normalizedType] = next;

    const number = `${prefix}-${padSequence(next)}`;

    clientRecords[normalizedType] = {
      number,
      createdAt: now,
      lastGeneratedAt: now,
    };
    map[safeClientId] = clientRecords;

    transaction.set(
      counterRef,
      {
        value: counters,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    transaction.set(
      mapRef,
      {
        value: map,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return number;
  });
};

export const readDocumentCounters = getCounters;
