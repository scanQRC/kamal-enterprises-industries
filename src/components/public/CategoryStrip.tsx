import React from 'react';
import { Bike, Cog, Flame, CookingPot, Wrench, Headphones } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CategoryStrip: React.FC = () => {
  const { navigateToFirmCatalogue } = useApp();

  const categories = [
    {
      title: 'Bicycles',
      subtitle: '(All Types)',
      icon: Bike,
      onClick: () => navigateToFirmCatalogue('kamal-industries', 'bicycles-all'),
    },
    {
      title: 'Cycling',
      subtitle: 'Accessories',
      icon: Cog,
      onClick: () => navigateToFirmCatalogue('kamal-industries', 'cycling-accessories'),
    },
    {
      title: 'Home',
      subtitle: 'Appliances',
      icon: Flame,
      onClick: () => navigateToFirmCatalogue('kamal-enterprises', 'gas-stoves'),
    },
    {
      title: 'Cookware',
      subtitle: '& Kitchenware',
      icon: CookingPot,
      onClick: () => navigateToFirmCatalogue('kamal-enterprises', 'cookware'),
    },
    {
      title: 'Service',
      subtitle: '& Repair',
      icon: Wrench,
      onClick: () => {
        const el = document.getElementById('service');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      title: 'Trusted',
      subtitle: 'Support',
      icon: Headphones,
      onClick: () => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <section id="categories" className="py-8 sm:py-12 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 
        Refined Compact Discovery Strip:
        Lighter, cleaner, more compact and visually integrated with subtle borders.
        On desktop: 6 elegant columns in a single horizontal strip.
        On mobile/tablet: Clean 2-to-3 column arrangement with comfortable touch targets.
      */}
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 lg:divide-x divide-slate-100 sm:divide-slate-200/60">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={cat.onClick}
                type="button"
                className="group py-5 sm:py-6 px-3 sm:px-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:bg-rose-50/40 focus:outline-hidden"
              >
                {/* Simple red line icon */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#A31D1D] mb-2 sm:mb-2.5 transition-transform group-hover:scale-105">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.6]" />
                </div>

                {/* Two-line label */}
                <span className="font-sans text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#A31D1D] transition-colors leading-tight">
                  {cat.title}
                </span>
                <span className="font-sans text-[11px] sm:text-xs text-slate-500 font-normal leading-tight mt-0.5">
                  {cat.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
