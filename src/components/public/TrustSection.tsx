import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Building, ArrowRight } from 'lucide-react';
import { BRANDS } from '../../data/mockData';

export const TrustSection: React.FC = () => {
  return (
    <section id="about" className="py-20 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Left Narrative Column */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#991B1B] tracking-wider uppercase mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Three Decades of Commercial Leadership</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-950 tracking-tight text-balance">
              The KAMAL Commercial Legacy.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Founded over thirty years ago in Udhampur, the KAMAL name stands for uncompromising merchandise authenticity, fair commercial pricing, and long-term customer relationships.
            </p>

            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                  100%
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Direct Factory Procurement
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Sourced directly from authorized manufacturing facilities with full warranty validation.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-[#991B1B] flex items-center justify-center font-bold text-sm shrink-0">
                  0%
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Zero Counterfeit Or Grey-Market Stock
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Every ball bearing, tube, valve, and gasket is guaranteed authentic original equipment.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                  90D
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Complimentary 90-Day Inspection
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Every bicycle sold includes a free 90-day comprehensive check-up and spoke re-tensioning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Brand Partner Wall */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Accredited OEM Brands &amp; Manufacturers
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  Official Retail Network
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {BRANDS.map((brand) => (
                  <div
                    key={brand.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col items-center justify-center min-h-[80px]"
                  >
                    <span className="font-display text-sm font-extrabold text-slate-900 tracking-wide">
                      {brand.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium mt-1">
                      {brand.origin}
                    </span>
                  </div>
                ))}
              </div>

              {/* Institutional / Wholesale Banner */}
              <div className="mt-8 p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Institutional Fleet &amp; Wholesale Supply
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Schools, corporate fitness programs, and commercial bulk procurements.
                  </p>
                </div>
                <a
                  href="#contact"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0"
                >
                  <span>Commercial Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
