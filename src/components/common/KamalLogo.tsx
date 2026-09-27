import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'red' | 'navy' | 'dark' | 'white' | 'light' | 'enterprises' | 'industries';
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
}

/**
 * Reusable KAMAL Brand Lockup Component
 * 
 * STRUCTURE:
 * Two separate rows in normal layout flow (flex-col, items-start):
 * 
 * ROW 1:
 * Kamal (approved elegant red script, dominant brand wordmark)
 * 
 * [Positive breathing gap: 5px - 6px, absolutely no negative margins or overlapping]
 * 
 * ROW 2:
 * Enterprises | Industries
 * - Pure script text, no badges, no backgrounds, no borders
 * - Enterprises = red (#A31D1D)
 * - Separator = slate vertical bar (|)
 * - Industries = navy/blue (#1E3A8A)
 * - Starts under the left/K of Kamal and ends around the l/middle area
 */
export const KamalLogo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'red',
  showSubtitle = true,
  subtitleText,
  className = '',
}) => {
  // Sizing definitions keeping strictly identical ~3.8:1 proportions:
  // - size="lg": Header brand lockup (approved size on desktop & mobile)
  // - size="md": Footer brand lockup (proportionately scaled, identical geometry)
  const sizes = {
    sm: {
      brand: 'text-3xl sm:text-4xl',
      subText: 'text-[11px] sm:text-[13px]',
      sepText: 'text-[10px] sm:text-[12px]',
      gap: 'gap-1',
      indent: 'pl-0.5',
    },
    md: {
      // Proportionately scaled for Footer
      brand: 'text-[48px] sm:text-[56px] lg:text-[64px]',
      subText: 'text-[13px] sm:text-[15px] lg:text-[17px]',
      sepText: 'text-[12px] sm:text-[14px] lg:text-[16px]',
      gap: 'gap-1 sm:gap-1.5', // positive 4px-6px gap, no overlap
      indent: 'pl-0.5 sm:pl-1',
    },
    lg: {
      // Header brand lockup (Desktop & Mobile)
      brand: 'text-[68px] sm:text-[84px] lg:text-[98px]',
      subText: 'text-[18px] sm:text-[22px] lg:text-[26px]',
      sepText: 'text-[15px] sm:text-[19px] lg:text-[22px]',
      gap: 'gap-[5px] sm:gap-[6px]', // positive ~5-6px breathing gap, never touches bottom strokes
      indent: 'pl-1 sm:pl-1.5',
    },
    xl: {
      brand: 'text-[78px] sm:text-[94px] lg:text-[110px]',
      subText: 'text-[21px] sm:text-[25px] lg:text-[29px]',
      sepText: 'text-[18px] sm:text-[21px] lg:text-[25px]',
      gap: 'gap-1.5 sm:gap-2',
      indent: 'pl-1 sm:pl-2',
    },
  };

  const s = sizes[size] || sizes.md;

  // Specific brand colors
  const primaryBrandColor =
    variant === 'white'
      ? 'text-white'
      : variant === 'navy' || variant === 'industries'
      ? 'text-[#1E3A8A]'
      : 'text-[#A31D1D]'; // Kamal red

  return (
    <div className={`flex flex-col items-start select-none shrink-0 ${s.gap} ${className}`}>
      {/* ROW 1: Kamal on TOP in approved elegant red script */}
      <span className={`font-script font-bold leading-none ${s.brand} ${primaryBrandColor} tracking-normal`}>
        Kamal
      </span>

      {/* ROW 2: Enterprises | Industries with clear positive breathing gap */}
      {showSubtitle && (
        subtitleText ? (
          /* Custom subtitle for specific admin/firm views */
          <span className={`font-sans font-bold uppercase leading-none text-[10px] tracking-[0.2em] text-slate-700`}>
            {subtitleText}
          </span>
        ) : (
          /* Dual Brand Structure:
             "Enterprises" (Red Script) | "Industries" (Navy/Blue Script)
             Normal layout flow, positive gap, no badges, no overlapping strokes. */
          <div className={`flex items-baseline gap-1.5 sm:gap-2 ${s.indent} whitespace-nowrap`}>
            <span
              className={`font-script font-bold leading-none text-[#A31D1D] tracking-normal ${s.subText}`}
            >
              Enterprises
            </span>
            <span className={`text-slate-400 font-light leading-none select-none px-0.5 ${s.sepText}`}>
              |
            </span>
            <span
              className={`font-script font-bold leading-none text-[#1E3A8A] tracking-normal ${s.subText}`}
            >
              Industries
            </span>
          </div>
        )
      )}
    </div>
  );
};

// Also export as Logo for convenience
export const Logo = KamalLogo;
