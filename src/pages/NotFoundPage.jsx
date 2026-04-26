import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';

const NotFoundPage = () => {
  usePageMeta({ title: 'Not Found', description: 'Requested page not found.' });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fbff_0%,#f4f8ff_55%,#f8fbff_100%)] px-4">
      <div className="w-full max-w-xl rounded-3xl border border-blue-100 bg-white/95 p-8 text-center shadow-[0_14px_36px_rgba(37,99,235,0.1)]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-slate-800">Page Not Found</h1>
        <p className="mt-3 text-sm text-slate-600">The route you requested does not exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

