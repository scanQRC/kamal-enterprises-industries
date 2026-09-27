import React from 'react';
import { ArrowRight } from 'lucide-react';

export const ServiceSection: React.FC = () => {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="service" className="my-12 sm:my-16 lg:my-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 
        Wide Horizontal Dark Photographic Section matching Reference:
        Left (45–50%): Deep dark premium content area with large headline, concise text, outline pill button
        Right (50–55%): Large bicycle service & repair photograph
        Asset path: /assets/images/kamal-service.png
      */}
      <div className="relative rounded-3xl bg-[#0B0F19] text-white overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px] lg:min-h-[500px]">
        {/* Left Content Column (approx 50%) */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 xl:p-16 text-left flex flex-col justify-center order-1">
          {/* Subtle red accent badge/indicator */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#A31D1D]" />
            <span className="text-xs uppercase tracking-widest font-bold text-slate-300">
              Workshop &amp; Maintenance
            </span>
          </div>

          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl text-white tracking-tight leading-[1.1] text-balance">
            Expert Service
            <br />
            &amp; Repair Support
          </h2>

          {/* Restrained red accent line */}
          <div className="w-12 h-0.5 bg-[#A31D1D] my-5 sm:my-6 rounded-full" />

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-lg text-balance">
            Keep your bicycles and applicable products in top condition with professional service support.
          </p>

          <div className="mt-8 sm:mt-10">
            <button
              onClick={scrollToContact}
              type="button"
              className="inline-flex items-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full border border-slate-500 hover:border-white text-white text-sm sm:text-base font-semibold transition-all hover:bg-white/10 active:scale-[0.99] cursor-pointer group"
            >
              <span>Know More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Photographic Area (approx 50%) */}
        <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-auto min-h-[280px] lg:min-h-full overflow-hidden order-2 bg-slate-900">
          <img
            src="/assets/images/kamal-service.png"
            alt="Expert bicycle service and repair technician precision tuning bicycle in workshop"
            className="w-full h-full object-cover object-[center_center] sm:object-[center_35%]"
          />
          {/* Subtle dark gradient overlay connecting smoothly on desktop */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0F19] to-transparent hidden lg:block pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0B0F19] to-transparent lg:hidden pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
