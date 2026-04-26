import appLogo from '../../assets/logo.jpg';

const Logo = ({ className = '' }) => (
  <div className="inline-flex items-center gap-3 rounded-full border border-blue-100 bg-white/85 px-2.5 py-1.5 shadow-[0_8px_20px_rgba(59,130,246,0.1)] backdrop-blur">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-blue-300/35 blur-md" />
      <img src={appLogo} alt="ArloTechX logo" className={`app-logo relative ${className}`.trim()} />
    </div>
    <div className="pr-1">
      <p className="font-display text-base font-semibold tracking-wide text-slate-800">ArloTechX</p>
      <p className="text-[10px] uppercase tracking-[0.24em] text-blue-600">Global Innovation</p>
    </div>
  </div>
);

export default Logo;
