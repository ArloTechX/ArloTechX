import { useState } from 'react';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import Logo from '../components/common/Logo';
import usePageMeta from '../hooks/usePageMeta';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  usePageMeta({ title: 'Admin Login', description: 'Secure admin login for ArloTechX dashboard.' });

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setError('Please enter email and password.');
      return;
    }

    setLoading(true);

    try {
      await login(normalizedEmail, password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (authError) {
      const code = authError?.code || '';
      const message = authError?.message || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Check your mobile internet/Wi-Fi and try again.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase. Add it in Authentication > Settings > Authorized domains.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is disabled in Firebase. Enable it in Authentication > Sign-in method.');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Try again later.');
      } else if (message.includes('Access denied')) {
        setError(message);
      } else {
        setError(`Login failed. ${code || message || 'Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(900px_500px_at_8%_-10%,rgba(56,189,248,0.2),transparent_62%),radial-gradient(820px_460px_at_95%_8%,rgba(59,130,246,0.2),transparent_58%),linear-gradient(180deg,#f8fbff_0%,#f4f8ff_55%,#f8fbff_100%)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-blue-100 bg-white/95 p-6 shadow-[0_20px_45px_rgba(37,99,235,0.12)]">
        <Logo className="h-10 w-10" />
        <h1 className="mt-5 font-display text-3xl font-semibold text-slate-800">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-600">Login to access private admin modules.</p>

        <form onSubmit={handleSubmit} autoComplete="off" className="mt-5 space-y-4">
          <label className="block text-sm text-slate-600">
            Email
            <input
              type="email"
              name="admin_email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="off"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              placeholder="admin@arlotechx.com"
              required
            />
          </label>

          <label className="block text-sm text-slate-600">
            Password
            <input
              type="password"
              name="admin_password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              placeholder="Enter password"
              required
            />
          </label>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
          >
            <LockKeyhole size={15} /> {loading ? 'Signing In...' : 'Login'}
          </button>

          <Link
            to="/"
            className="inline-flex w-full items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Back to Home
          </Link>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
