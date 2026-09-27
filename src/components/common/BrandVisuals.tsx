import React from 'react';

/**
 * Reusable crest icon slot
 */
export const KamalCrest: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl bg-slate-900 border border-slate-800 shadow-md ${className}`}
    >
      <svg viewBox="0 0 100 100" width="70%" height="70%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="44" stroke="#991B1B" strokeWidth="3" />
        <circle cx="50" cy="50" r="38" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* Bold architectural K */}
        <path d="M 30 22 L 42 22 L 42 78 L 30 78 Z" fill="#F8FAFC" />
        <path d="M 42 52 L 68 22 L 78 22 L 50 56 Z" fill="#991B1B" />
        <path d="M 46 52 L 76 78 L 64 78 L 42 60 Z" fill="#D97706" />
        <circle cx="45" cy="55" r="4" fill="#0F172A" stroke="#D97706" strokeWidth="2" />
      </svg>
    </div>
  );
};

/**
 * Commercial Hero Visual
 * High-impact commercial showroom visual (replaces wireframe line-art).
 */
export const CommercialHeroShowcase: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#1E293B] shadow-2xl flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-left ${className}`}
    >
      {/* Background ambient lighting effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#991B1B]/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#D97706]/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(30,41,59,0.5)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Banner Tagline & Dual Division Trust Badges */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#991B1B] text-white shadow-sm">
            Commercial Master Standard
          </span>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            Kamal Enterprises &amp; Kamal Industries · Udhampur
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Both Showrooms Open Today</span>
        </div>
      </div>

      {/* Center Commercial Composite Visual */}
      <div className="relative z-10 my-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Narrative Lead */}
        <div className="lg:col-span-7">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block mb-2">
            Authentic Commercial Distribution · Est. 1994
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            Quality Engineered For Daily Life &amp; Open Roads.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl">
            Partnered with India’s leading manufacturers to bring genuine road bicycles, youth mobility, and durable culinary appliances to thousands of families across Jammu &amp; Kashmir.
          </p>
        </div>

        {/* Right High-Fidelity Silhouette Graphic */}
        <div className="lg:col-span-5 hidden sm:flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-4/3 rounded-2xl bg-gradient-to-t from-slate-900 to-slate-800/90 border border-slate-700/60 p-6 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="text-white font-bold">Showroom Showcase</span>
              <span className="text-amber-400 font-bold">100% Factory Direct</span>
            </div>

            {/* Solid, Realistic Bike Silhouette with depth */}
            <div className="relative my-auto flex items-center justify-center py-2">
              <svg viewBox="0 0 300 170" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Rear & Front Wheel Tires - Solid & Realistic */}
                <circle cx="65" cy="115" r="48" fill="#0F172A" stroke="#1E293B" strokeWidth="8" />
                <circle cx="65" cy="115" r="40" stroke="#991B1B" strokeWidth="3" />
                <circle cx="65" cy="115" r="14" fill="#1E293B" stroke="#D97706" strokeWidth="2" />
                
                <circle cx="235" cy="115" r="48" fill="#0F172A" stroke="#1E293B" strokeWidth="8" />
                <circle cx="235" cy="115" r="40" stroke="#991B1B" strokeWidth="3" />
                <circle cx="235" cy="115" r="14" fill="#1E293B" stroke="#D97706" strokeWidth="2" />

                {/* Spokes subtle styling */}
                <path d="M 65 75 L 65 155 M 25 115 L 105 115" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 235 75 L 235 155 M 195 115 L 275 115" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                {/* Main Hydroformed Bicycle Frame - Bold Solid Tubes */}
                <path d="M 65 115 L 135 115 L 195 55 L 115 55 Z" fill="#991B1B" fillOpacity="0.15" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round" />
                <path d="M 135 115 L 180 40" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 165 38 L 195 38" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />

                {/* Front Fork & Handlebar */}
                <path d="M 235 115 L 195 55 L 210 35" stroke="#FFFFFF" strokeWidth="4.5" strokeLinejoin="round" />
                <path d="M 200 35 L 222 35" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />

                {/* Crankset & Chainring */}
                <circle cx="135" cy="115" r="16" fill="#D97706" stroke="#991B1B" strokeWidth="3" />
                <path d="M 135 105 L 135 125" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />

                {/* Ground reflection shadow */}
                <ellipse cx="150" cy="162" rx="100" ry="6" fill="#000000" opacity="0.4" />
              </svg>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-300">AVON · Firefox · Hero · Prestige</span>
              <span className="text-emerald-400 font-semibold">Immediate Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metrics Bar */}
      <div className="relative z-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
        <div>
          <p className="text-xl sm:text-2xl font-display font-extrabold text-white">30+ Years</p>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Established Commercial Legacy</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-display font-extrabold text-amber-400">2 Divisions</p>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Enterprises &amp; Industries</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-display font-extrabold text-white">10,000+</p>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Customers Across J&amp;K</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-display font-extrabold text-[#991B1B]">100% Spares</p>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Certified Workshop Support</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Commercial Product Visual
 * Solid, rich, realistic product representation for cards (zero line-art wireframes).
 */
export const CommercialProductVisual: React.FC<{
  type: string;
  name: string;
  brand?: string;
  className?: string;
}> = ({ type, name, brand = '', className = '' }) => {
  const isBike =
    type.includes('bike') ||
    type.includes('cycle') ||
    type.includes('mtb') ||
    type.includes('sports') ||
    name.toLowerCase().includes('bicycle') ||
    name.toLowerCase().includes('cycle') ||
    name.toLowerCase().includes('mtb');

  const isCookware =
    type.includes('cookware') ||
    name.toLowerCase().includes('cooker') ||
    name.toLowerCase().includes('pan') ||
    name.toLowerCase().includes('pot') ||
    name.toLowerCase().includes('hawkins') ||
    name.toLowerCase().includes('prestige');

  const isGasStove =
    type.includes('gas') ||
    type.includes('stove') ||
    type.includes('appliance') ||
    name.toLowerCase().includes('gas') ||
    name.toLowerCase().includes('stove') ||
    name.toLowerCase().includes('burner');

  const isAccessory =
    type.includes('accessory') ||
    type.includes('helmet') ||
    name.toLowerCase().includes('helmet') ||
    name.toLowerCase().includes('lock') ||
    name.toLowerCase().includes('pump');

  return (
    <div
      className={`relative w-full h-full min-h-[190px] flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden ${className}`}
    >
      {/* Soft spotlight backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,rgba(241,245,249,0.7)_80%)] pointer-events-none" />

      {/* High-Impact Bicycle Rendering */}
      {isBike && (
        <div className="relative z-10 w-4/5 h-4/5 flex items-center justify-center">
          <svg viewBox="0 0 240 140" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="120" cy="132" rx="85" ry="6" fill="#64748B" opacity="0.2" />

            {/* Rear Wheel with tire tread */}
            <circle cx="50" cy="90" r="38" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
            <circle cx="50" cy="90" r="32" stroke="#991B1B" strokeWidth="2.5" />
            <circle cx="50" cy="90" r="10" fill="#0F172A" stroke="#D97706" strokeWidth="2" />
            
            {/* Front Wheel */}
            <circle cx="190" cy="90" r="38" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
            <circle cx="190" cy="90" r="32" stroke="#991B1B" strokeWidth="2.5" />
            <circle cx="190" cy="90" r="10" fill="#0F172A" stroke="#D97706" strokeWidth="2" />

            {/* Frame Tubes with realistic metallic crimson paint */}
            <path d="M 50 90 L 105 90 L 155 42 L 95 42 Z" fill="#991B1B" fillOpacity="0.2" stroke="#991B1B" strokeWidth="5.5" strokeLinejoin="round" />
            <path d="M 105 90 L 142 30" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 130 28 L 155 28" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />

            {/* Front Fork & Handlebar */}
            <path d="M 190 90 L 155 42 L 168 25" stroke="#0F172A" strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M 160 25 L 180 25" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />

            {/* Chainring */}
            <circle cx="105" cy="90" r="12" fill="#D97706" stroke="#0F172A" strokeWidth="2" />
          </svg>
        </div>
      )}

      {/* High-Impact Cookware Rendering */}
      {isCookware && (
        <div className="relative z-10 w-3/4 h-3/4 flex items-center justify-center">
          <svg viewBox="0 0 200 140" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="126" rx="55" ry="6" fill="#64748B" opacity="0.2" />

            {/* Body of pressure cooker - brushed steel */}
            <rect x="45" y="55" width="110" height="60" rx="14" fill="#E2E8F0" stroke="#0F172A" strokeWidth="3" />
            {/* Lid */}
            <path d="M 45 58 C 45 38 155 38 155 58 Z" fill="#CBD5E1" stroke="#0F172A" strokeWidth="3" />
            {/* Safety Valve */}
            <rect x="94" y="24" width="12" height="16" rx="3" fill="#991B1B" stroke="#0F172A" strokeWidth="2" />
            {/* Long Sturdy Bakelite Handle */}
            <path d="M 155 58 L 190 58" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
            {/* Tri-ply indicator line */}
            <line x1="50" y1="105" x2="150" y2="105" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 2" />
          </svg>
        </div>
      )}

      {/* High-Impact Gas Stove Rendering */}
      {isGasStove && (
        <div className="relative z-10 w-4/5 h-4/5 flex items-center justify-center">
          <svg viewBox="0 0 220 120" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="110" cy="112" rx="75" ry="5" fill="#64748B" opacity="0.2" />

            {/* Toughened Glass Top */}
            <rect x="25" y="45" width="170" height="55" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="3" />
            {/* Brass Burner Left */}
            <circle cx="70" cy="72" r="22" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <circle cx="70" cy="72" r="14" fill="#D97706" stroke="#991B1B" strokeWidth="2" />
            {/* Brass Burner Right */}
            <circle cx="150" cy="72" r="22" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <circle cx="150" cy="72" r="14" fill="#D97706" stroke="#991B1B" strokeWidth="2" />
            {/* Control Knobs */}
            <circle cx="85" cy="94" r="5" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="135" cy="94" r="5" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.5" />
          </svg>
        </div>
      )}

      {/* High-Impact Cycling Accessory Rendering */}
      {isAccessory && (
        <div className="relative z-10 w-3/4 h-3/4 flex items-center justify-center">
          <svg viewBox="0 0 180 130" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="90" cy="115" rx="50" ry="5" fill="#64748B" opacity="0.2" />

            {/* Aerodynamic Helmet */}
            <path
              d="M 30 85 C 30 40 75 25 145 50 C 158 68 140 95 105 95 C 55 95 30 90 30 85 Z"
              fill="#0F172A"
              stroke="#991B1B"
              strokeWidth="3.5"
            />
            {/* Air vents with gold trim */}
            <path d="M 60 52 Q 82 46 108 55" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 72 68 Q 94 62 118 70" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="75" r="5" fill="#991B1B" />
          </svg>
        </div>
      )}

      {/* Fallback Corporate Crest badge if other category */}
      {!isBike && !isCookware && !isGasStove && !isAccessory && (
        <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
          <KamalCrest size={48} />
          <span className="font-display font-bold text-xs text-slate-800 uppercase tracking-widest mt-2">
            KAMAL GENUINE
          </span>
        </div>
      )}
    </div>
  );
};

// Aliases for compatibility
export const ProductSilhouette = CommercialProductVisual;
export const KamalHeroShowcase = CommercialHeroShowcase;
