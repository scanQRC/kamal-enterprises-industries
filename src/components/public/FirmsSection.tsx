import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FirmsSection: React.FC = () => {
  const { navigateToFirmCatalogue } = useApp();

  return (
    <section id="firms" className="py-12 sm:py-16 lg:py-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-stretch">
        {/* ========================================================= */}
        {/* CARD 1: KAMAL ENTERPRISES (Left Card)                     */}
        {/* Subtle warm ivory/cream visual treatment                  */}
        {/* Asset: /assets/images/kamal-enterprises.png              */}
        {/* ========================================================= */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigateToFirmCatalogue('kamal-enterprises')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigateToFirmCatalogue('kamal-enterprises');
            }
          }}
          className="group bg-gradient-to-br from-[#FCFAF7] to-[#F7F2EA] rounded-3xl border border-[#EAE2D5] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-left cursor-pointer relative"
        >
          <div className="flex flex-col sm:grid sm:grid-cols-12 gap-6 sm:gap-6 lg:gap-8 items-center h-full">
            {/* Left Content Column */}
            <div className="w-full sm:col-span-6 flex flex-col justify-between h-full order-1">
              <div>
                <h3 className="font-script text-4xl sm:text-4xl lg:text-[42px] xl:text-[46px] text-[#A31D1D] font-bold tracking-normal leading-[1.15]">
                  Kamal Enterprises
                </h3>

                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  Bicycles, Cycling Accessories,
                  <br className="hidden sm:inline" /> Home Appliances, Cookware
                  <br className="hidden sm:inline" /> and More
                </p>

                {/* Restrained red accent line */}
                <div className="w-12 h-0.5 bg-[#A31D1D] my-4 sm:my-5 rounded-full" />
              </div>

              {/* Desktop/Tablet CTA */}
              <div className="hidden sm:flex mt-6 sm:mt-8 items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#A31D1D] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#A31D1D] transition-colors">
                  Explore Kamal Enterprises
                </span>
              </div>
            </div>

            {/* Right Large Product Photograph */}
            <div className="w-full sm:col-span-6 h-full flex items-center order-2">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white/70 shadow-xs border border-[#EAE2D5]">
                <img
                  src="/assets/images/kamal-enterprises.png"
                  alt="Kamal Enterprises — Bicycles, cycling accessories, and home appliances"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Mobile-only CTA */}
            <div className="sm:hidden w-full order-3 flex items-center gap-3 pt-1">
              <span className="w-10 h-10 rounded-full bg-[#A31D1D] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold text-slate-900 group-hover:text-[#A31D1D] transition-colors">
                Explore Kamal Enterprises
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 2: KAMAL INDUSTRIES (Right Card)                    */}
        {/* Subtle cool/light-blue visual treatment                  */}
        {/* Asset: /assets/images/kamal-industries.png               */}
        {/* ======================================================== */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigateToFirmCatalogue('kamal-industries')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigateToFirmCatalogue('kamal-industries');
            }
          }}
          className="group bg-gradient-to-br from-[#F5F9FD] to-[#EAF2FA] rounded-3xl border border-[#D7E4F2] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-left cursor-pointer relative"
        >
          <div className="flex flex-col sm:grid sm:grid-cols-12 gap-6 sm:gap-6 lg:gap-8 items-center h-full">
            {/* Left Content Column */}
            <div className="w-full sm:col-span-6 flex flex-col justify-between h-full order-1">
              <div>
                <h3 className="font-script text-4xl sm:text-4xl lg:text-[42px] xl:text-[46px] text-[#1E3A8A] font-bold tracking-normal leading-[1.15]">
                  Kamal Industries
                </h3>

                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  All Types of Bicycles
                  <br className="hidden sm:inline" /> and Cycling Accessories
                </p>

                {/* Restrained navy accent line */}
                <div className="w-12 h-0.5 bg-[#1E3A8A] my-4 sm:my-5 rounded-full" />
              </div>

              {/* Desktop/Tablet CTA */}
              <div className="hidden sm:flex mt-6 sm:mt-8 items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                  Explore Kamal Industries
                </span>
              </div>
            </div>

            {/* Right Large Product Photograph */}
            <div className="w-full sm:col-span-6 h-full flex items-center order-2">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white/70 shadow-xs border border-[#D7E4F2]">
                <img
                  src="/assets/images/kamal-industries.png"
                  alt="Kamal Industries — All types of bicycles and cycling accessories"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Mobile-only CTA */}
            <div className="sm:hidden w-full order-3 flex items-center gap-3 pt-1">
              <span className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                Explore Kamal Industries
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
