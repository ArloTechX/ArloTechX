import { Link } from 'react-router-dom';
import { AtSign, Globe, MessageSquareShare, Share2 } from 'lucide-react';
import Logo from '../common/Logo';
import { companyInfo, navLinks } from '../../data/site';
import { services } from '../../data/services';

const Footer = () => {
  return (
    <footer className="section-shell pb-8 pt-12">
      <div className="section-inner premium-card relative overflow-hidden rounded-[2rem] p-8 md:p-10">
        <div className="absolute inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/55 to-transparent" />

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo className="h-10 w-10" />
            <p className="text-sm leading-relaxed text-slate-600">
              ArloTechX builds premium software, web platforms, and AI-enabled products for modern businesses worldwide.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="transition hover:text-blue-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Core Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>{service.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>{companyInfo.email}</li>
              <li>{companyInfo.phone}</li>
              <li>{companyInfo.name}</li>
            </ul>
            <div className="mt-6 flex items-center gap-3 text-slate-500">
              {[AtSign, Globe, MessageSquareShare, Share2].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="inline-flex rounded-full border border-blue-100 bg-white p-2.5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                  aria-label="Social media"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-blue-100 pt-5 text-xs text-slate-500">
          Copyright {new Date().getFullYear()} ArloTechX. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
