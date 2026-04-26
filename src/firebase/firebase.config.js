import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const FIREBASE_ENABLED = true;

export const saveLeadToFirebase = async (payload) => {
  const collectionRef = collection(db, 'leads');
  await addDoc(collectionRef, {
    ...payload,
    createdAt: payload?.createdAt || new Date().toISOString(),
    createdAtServer: serverTimestamp(),
  });
};
