import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import Logo from '../common/Logo';
import { navLinks } from '../../data/site';

const linkClass = ({ isActive }) =>
  `group relative px-1.5 py-1 text-sm font-medium transition ${
    isActive ? 'text-blue-700' : 'text-slate-600 hover:text-blue-700'
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div className="section-inner rounded-2xl border border-blue-100/80 bg-white/72 shadow-[0_14px_32px_rgba(37,99,235,0.12)] backdrop-blur-2xl">
        <div className="flex items-center justify-between px-3 py-3 md:px-5">
          <Link to="/" aria-label="ArloTechX home">
            <Logo className="h-9 w-9" />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-blue-500 transition-all duration-300 ${
                        isActive ? 'w-[70%] opacity-100' : 'w-0 opacity-0 group-hover:w-[70%] group-hover:opacity-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link to="/contact" className="btn-primary px-5 py-2.5 text-[13px]">
              Start Project
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-white text-blue-700 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <Motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-blue-100/80 px-4 pb-4 pt-3 md:hidden"
            >
              <div className="flex flex-col gap-3">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-2 text-sm transition ${
                        isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700'
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary mt-1 w-full">
                  Get a Quote
                </Link>
              </div>
            </Motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
