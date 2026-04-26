import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const STORE_COLLECTION = 'appStore';

export const getStoreDocRef = (key) => doc(db, STORE_COLLECTION, key);

export const readStoreValue = async (key, fallbackValue) => {
  try {
    const snapshot = await getDoc(getStoreDocRef(key));
    if (!snapshot.exists()) return fallbackValue;
    const data = snapshot.data();
    if (!data || typeof data !== 'object' || !('value' in data)) return fallbackValue;
    return data.value;
  } catch {
    return fallbackValue;
  }
};

export const writeStoreValue = async (key, value) => {
  await setDoc(
    getStoreDocRef(key),
    {
      value,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return value;
};
