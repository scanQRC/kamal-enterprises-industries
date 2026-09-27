import React from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface ModalHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  onClose: () => void;
  onBack?: () => void;
  backLabel?: string;
  closeAriaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  icon,
  onClose,
  onBack,
  backLabel = 'Back',
  closeAriaLabel = 'Close dialog',
  className = '',
  children,
}) => {
  return (
    <div
      className={`sticky top-0 z-30 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200/90 bg-[#FAF8F5]/98 backdrop-blur-md flex items-center justify-between gap-3 shadow-xs ${className}`}
    >
      {/* Left side: Back or Icon + Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        {onBack && (
          <button
            onClick={onBack}
            type="button"
            aria-label={backLabel}
            className="min-h-[44px] min-w-[44px] -ml-2 sm:-ml-1 px-2.5 rounded-xl hover:bg-stone-200/60 active:bg-stone-300/60 text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-stone-700" />
            <span className="text-xs font-semibold hidden sm:inline">{backLabel}</span>
          </button>
        )}

        {icon && <div className="shrink-0">{icon}</div>}

        <div className="min-w-0 flex-1">
          <div className="text-sm sm:text-base font-bold text-stone-900 leading-snug truncate">
            {title}
          </div>
          {subtitle && (
            <div className="text-[11px] text-stone-500 font-normal truncate mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Optional children + Prominent Accessible Close Button */}
      <div className="flex items-center gap-2 shrink-0">
        {children}

        <button
          onClick={onClose}
          type="button"
          aria-label={closeAriaLabel}
          title="Close (Esc)"
          className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 hover:text-stone-950 flex items-center justify-center transition-colors cursor-pointer border border-stone-200/80 shadow-2xs"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
