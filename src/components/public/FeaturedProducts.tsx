import React from 'react';
import { ArrowUpRight, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/mockData';
import { CommercialProductVisual } from '../common/BrandVisuals';

export const FeaturedProducts: React.FC = () => {
  const { setSelectedProduct, navigateToFirmCatalogue } = useApp();

  // Curated 4 spotlight products representative of both firms
  const spotlightProducts = PRODUCTS.slice(0, 4);

  return (
    <section id="products" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Commercial Directory Links */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-slate-200 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#991B1B] tracking-wider uppercase mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Showroom Selection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-950 tracking-tight">
            Curated Products &amp; Appliances
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-normal">
            A preview of high-demand bicycles and home appliances currently available across our showrooms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigateToFirmCatalogue('kamal-enterprises')}
            className="px-4 py-2 rounded-lg bg-rose-50 text-[#991B1B] border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Kamal Enterprises Catalogue &rarr;
          </button>
          <button
            onClick={() => navigateToFirmCatalogue('kamal-industries')}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            Kamal Industries Catalogue &rarr;
          </button>
        </div>
      </div>

      {/* Grid of 4 Substantial Commercial Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {spotlightProducts.map((product) => {
          const isEnterprises = product.applicableFirms.includes('kamal-enterprises');
          const isIndustries = product.applicableFirms.includes('kamal-industries');
          const firmLabel =
            isEnterprises && isIndustries
              ? 'Enterprises & Industries'
              : isEnterprises
              ? 'Kamal Enterprises'
              : 'Kamal Industries';

          const firmColor = isEnterprises ? 'text-[#991B1B]' : 'text-slate-900';

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer"
            >
              {/* Product Visual Area */}
              <div className="relative aspect-4/3 w-full border-b border-slate-100 overflow-hidden">
                <CommercialProductVisual
                  type={product.categoryId}
                  name={product.name}
                  brand={product.brand}
                />

                {/* Showroom Availability Tag */}
                <div className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-900/85 text-white backdrop-blur-xs shadow-xs">
                  In Showroom
                </div>

                {/* OEM Brand Badge */}
                <div className="absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white/95 text-slate-900 shadow-xs border border-slate-200">
                  {product.brand}
                </div>
              </div>

              {/* Product Details Area */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${firmColor} mb-1`}>
                    {firmLabel}
                  </div>

                  <h3 className="text-base font-display font-bold text-slate-900 group-hover:text-[#991B1B] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {product.subtitle}
                  </p>
                </div>

                {/* Pricing and Action Zone */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-display font-black text-slate-950 tabular-nums">
                        ₹{product.indicativePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      Special Showroom Offer
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 group-hover:text-[#991B1B] transition-colors">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
