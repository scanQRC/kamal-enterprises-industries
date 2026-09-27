import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Hero: React.FC = () => {
  const { navigateToFirmCatalogue } = useApp();

  const scrollToFirms = () => {
    const el = document.getElementById('firms');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-[580px] sm:min-h-[620px] md:min-h-[660px] lg:min-h-[700px] overflow-hidden flex items-center bg-[#EAE6DF]"
    >
      {/* 
        ========================================================================
        HERO PHOTOGRAPH: kamal-hero.png
        High-impact commercial photography of family cycling on mountain road.
        Asset path: /assets/images/kamal-hero.png
        Preserves cyclists prominently on center/right with responsive cover.
        ========================================================================
      */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img
          src="/assets/images/kamal-hero.png"
          alt="Kamal cycling lifestyle — family riding bicycles on mountain road"
          className="w-full h-full object-cover object-[75%_center] sm:object-[70%_center] md:object-[75%_center] lg:object-[80%_center]"
        />

        {/* 
          Desktop Left Side Light Gradient Wash:
          Ensures high contrast readability for left-aligned typography while
          leaving the cycling subjects and alpine landscape 100% visible on the right.
        */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:w-3/5 lg:w-1/2 pointer-events-none" />

        {/* Mobile Light Wash: Ensures readability on narrow viewports */}
        <div className="sm:hidden absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/40 pointer-events-none" />
      </div>

      {/* 
        ========================================================================
        HERO CONTENT CONTAINER: FULL DESKTOP SYSTEM (1200–1400px)
        Ensures wide, professional presentation matching approved reference.
        ========================================================================
      */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="w-full max-w-2xl text-left">
          {/* Headline: Large Display Serif from approved reference */}
          <h1 className="font-serif font-extrabold text-slate-950 text-5xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-[1.06] text-balance">
            Trusted
            <br />
            Products.
            <br />
            <span className="text-slate-950">Better Lives.</span>
          </h1>

          {/* Red Accent Line from Reference */}
          <div className="w-14 h-1 bg-[#A31D1D] rounded-full my-5 sm:my-6" />

          {/* Supporting Copy */}
          <p
            style={{ color: '#111111', opacity: 1 }}
            className="text-[#111111] opacity-100 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-xl text-balance"
          >
            Quality bicycles, cycling accessories, home appliances, cookware and more — with dependable service.
          </p>

          {/* Primary Action Button (Pill shape with Arrow) */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={scrollToFirms}
              type="button"
              className="inline-flex items-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#A31D1D] text-white text-base sm:text-lg font-bold hover:bg-[#881818] active:scale-[0.99] transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Explore Us</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
