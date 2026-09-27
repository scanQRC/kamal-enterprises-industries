import React from 'react';
import { MapPin, Phone, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KamalLogo } from '../common/KamalLogo';

export const Footer: React.FC = () => {
  const { navigateToHome, navigateToFirmCatalogue, navigateToAdmin } = useApp();

  const handleNavClick = (sectionId: string) => {
    navigateToHome();
    setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <footer id="contact" className="bg-white border-t border-slate-200 mt-20 text-slate-700">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* ======================================================== */}
        {/* TOP ROW: LOGO | ADDRESS | PHONE | SOCIALS (From Reference) */}
        {/* ======================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-200">
          {/* Brand Logo Placeholder */}
          <div className="flex items-center shrink-0">
            <button
              onClick={navigateToHome}
              type="button"
              className="text-left cursor-pointer focus:outline-hidden"
            >
              <KamalLogo size="md" variant="red" />
            </button>
          </div>

          {/* Confirmed Business Address (Clickable for maps) */}
          <div className="flex items-start gap-3.5 text-sm sm:text-base text-slate-700 max-w-md">
            <MapPin className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
            <span className="leading-snug">
              Opposite J&amp;K Bank, Chabutra (Main) Bazar,
              <br />
              Udhampur, Jammu &amp; Kashmir, India
            </span>
          </div>

          {/* Confirmed Phone Contact (Clickable on Mobile) */}
          <div className="flex items-center gap-3 text-sm sm:text-base text-slate-900 font-bold">
            <Phone className="w-5 h-5 text-slate-900 shrink-0" />
            <a
              href="tel:09906048324"
              className="hover:text-[#A31D1D] transition-colors"
            >
              099060 48324
            </a>
          </div>

          {/* Social Media Placeholder Icons (Matching Reference) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              aria-label="Facebook placeholder"
              className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-[#A31D1D] transition-colors text-xs font-bold"
            >
              f
            </button>
            <button
              type="button"
              aria-label="Instagram placeholder"
              className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-[#A31D1D] transition-colors text-xs font-bold"
            >
              ig
            </button>
            <button
              type="button"
              aria-label="YouTube placeholder"
              className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-[#A31D1D] transition-colors text-xs font-bold"
            >
              yt
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM ROW: NAVIGATION LINKS | COPYRIGHT | ADMIN LOGIN   */}
        {/* ======================================================== */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-sm text-slate-500">
          {/* Navigation Links matching reference */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 font-semibold text-slate-800">
            <button
              onClick={() => handleNavClick('home')}
              className="hover:text-[#A31D1D] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleNavClick('firms')}
              className="hover:text-[#A31D1D] transition-colors cursor-pointer"
            >
              Our Firms
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleNavClick('categories')}
              className="hover:text-[#A31D1D] transition-colors cursor-pointer"
            >
              Products
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleNavClick('service')}
              className="hover:text-[#A31D1D] transition-colors cursor-pointer"
            >
              Service &amp; Repair
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-[#A31D1D] transition-colors cursor-pointer"
            >
              About
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-[#A31D1D] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Copyright & Discreet Admin Portal */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <p>© 2026 Kamal Enterprises &amp; Kamal Industries. All rights reserved.</p>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <button
              onClick={navigateToAdmin}
              type="button"
              className="text-slate-600 hover:text-slate-950 inline-flex items-center gap-1.5 transition-colors cursor-pointer font-semibold"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
