/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);

// Optional admin role check:
// If true, user must exist in `admins/{uid}` with { role: 'admin' }.
const ENABLE_ADMIN_ROLE_CHECK = false;

const hasAdminRole = async (uid) => {
  if (!uid) return false;
  const adminSnapshot = await getDoc(doc(db, 'admins', uid));
  if (!adminSnapshot.exists()) return false;
  const data = adminSnapshot.data();
  return data?.role === 'admin';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (!ENABLE_ADMIN_ROLE_CHECK) {
        setUser(nextUser);
        setLoading(false);
        return;
      }

      try {
        const isAdmin = await hasAdminRole(nextUser.uid);
        if (!isAdmin) {
          await signOut(auth);
          setUser(null);
        } else {
          setUser(nextUser);
        }
      } catch {
        await signOut(auth);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    if (!ENABLE_ADMIN_ROLE_CHECK) {
      return credential.user;
    }

    const isAdmin = await hasAdminRole(credential.user.uid);
    if (!isAdmin) {
      await signOut(auth);
      throw new Error('Access denied. This account is not an admin.');
    }

    return credential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
