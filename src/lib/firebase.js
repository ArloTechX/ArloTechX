import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import 'firebase/auth';
import { browserLocalPersistence, getAuth, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDf18sDyLxZqyFgnyt9uN6pB0G3KIYm810',
  authDomain: 'arlotechx-db.firebaseapp.com',
  projectId: 'arlotechx-db',
  storageBucket: 'arlotechx-db.firebasestorage.app',
  messagingSenderId: '80389593920',
  appId: '1:80389593920:web:1c6301b52155826f2e38a5',
  measurementId: 'G-BNR7EKKP5P',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let auth;
try {
  auth = getAuth(app);
} catch {
  auth = initializeAuth(app, { persistence: browserLocalPersistence });
}

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch(() => {});
}

export { app, db, auth };
