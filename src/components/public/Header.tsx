import React, { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KamalLogo } from '../common/KamalLogo';

export const Header: React.FC = () => {
  const { navigateToHome, navigateToFirmCatalogue, navigateToAdmin } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
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
    <header
      style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#ffffff', opacity: 1 }}
      className="sticky top-0 z-[1000] w-full bg-white opacity-100 border-b border-black/[0.08] shadow-xs"
    >
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 min-h-[110px] sm:min-h-[136px] py-2 sm:py-3 flex items-center justify-between gap-3 sm:gap-6 bg-white">
        {/* Left: Reusable KAMAL Logo Component */}
        <div className="flex items-center shrink-0">
          <button
            onClick={navigateToHome}
            type="button"
            className="flex items-center text-left cursor-pointer focus:outline-hidden group shrink-0"
          >
            <KamalLogo size="lg" variant="red" />
          </button>
        </div>

        {/* Center: 6 Clean Navigation Links (Matching Approved Reference) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-sm lg:text-base font-semibold text-slate-800">
          <button
            onClick={() => handleNavClick('home')}
            type="button"
            className={`py-2 transition-colors cursor-pointer relative ${
              activeSection === 'home'
                ? 'text-[#A31D1D] font-bold'
                : 'hover:text-[#A31D1D]'
            }`}
          >
            Home
            {activeSection === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A31D1D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('firms')}
            type="button"
            className={`py-2 transition-colors cursor-pointer relative ${
              activeSection === 'firms'
                ? 'text-[#A31D1D] font-bold'
                : 'hover:text-[#A31D1D]'
            }`}
          >
            Our Firms
            {activeSection === 'firms' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A31D1D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('categories')}
            type="button"
            className={`py-2 transition-colors cursor-pointer relative ${
              activeSection === 'categories'
                ? 'text-[#A31D1D] font-bold'
                : 'hover:text-[#A31D1D]'
            }`}
          >
            Products
            {activeSection === 'categories' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A31D1D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('service')}
            type="button"
            className={`py-2 transition-colors cursor-pointer relative ${
              activeSection === 'service'
                ? 'text-[#A31D1D] font-bold'
                : 'hover:text-[#A31D1D]'
            }`}
          >
            Service &amp; Repair
            {activeSection === 'service' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A31D1D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('about')}
            type="button"
            className={`py-2 transition-colors cursor-pointer relative ${
              activeSection === 'about'
                ? 'text-[#A31D1D] font-bold'
                : 'hover:text-[#A31D1D]'
            }`}
          >
            About
            {activeSection === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A31D1D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            type="button"
            className={`py-2 transition-colors cursor-pointer relative ${
              activeSection === 'contact'
                ? 'text-[#A31D1D] font-bold'
                : 'hover:text-[#A31D1D]'
            }`}
          >
            Contact
            {activeSection === 'contact' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A31D1D] rounded-full" />
            )}
          </button>
        </nav>

        {/* Right: Discreet Admin Login (Matching Reference) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={navigateToAdmin}
            type="button"
            title="Authorised Staff Portal"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#A31D1D] transition-colors py-2 px-1 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-slate-700" />
            <span>Admin Login</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Toggle navigation menu"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-800 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1 text-sm font-medium text-slate-800">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2.5 hover:text-[#A31D1D] border-b border-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('firms')}
              className="text-left py-2.5 hover:text-[#A31D1D] border-b border-slate-100"
            >
              Our Firms (Enterprises &amp; Industries)
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="text-left py-2.5 hover:text-[#A31D1D] border-b border-slate-100"
            >
              Products &amp; Categories
            </button>
            <button
              onClick={() => handleNavClick('service')}
              className="text-left py-2.5 hover:text-[#A31D1D] border-b border-slate-100"
            >
              Service &amp; Repair
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2.5 hover:text-[#A31D1D] border-b border-slate-100"
            >
              About Kamal
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-2.5 hover:text-[#A31D1D] border-b border-slate-100"
            >
              Contact &amp; Locations
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateToFirmCatalogue('kamal-enterprises');
                }}
                className="py-2.5 px-3 rounded-lg bg-rose-50 text-[#A31D1D] text-center border border-rose-100"
              >
                Kamal Enterprises
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateToFirmCatalogue('kamal-industries');
                }}
                className="py-2.5 px-3 rounded-lg bg-blue-50 text-[#1E3A8A] text-center border border-blue-100"
              >
                Kamal Industries
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateToAdmin();
              }}
              className="mt-2 py-2.5 px-3 rounded-lg bg-slate-100 text-slate-800 text-center text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
