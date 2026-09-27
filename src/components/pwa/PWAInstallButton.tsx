import React, { useState } from 'react';
import { Download, Share2, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  variant?: 'compact' | 'full' | 'subtle';
  className?: string;
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'compact', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, suppress button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'subtle') {
      return (
        <button
          onClick={install}
          type="button"
          aria-label="Install Kamal Business App"
          className={`inline-flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-[#781D22] transition-colors ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Install App</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        type="button"
        aria-label="Install Kamal Business Web App"
        className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium tracking-tight rounded-md bg-[#781D22] text-white hover:bg-[#62161b] active:scale-[0.98] transition-all shadow-sm ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="whitespace-nowrap">Install PWA</span>
      </button>
    );
  }

  // iOS Safari flow (WebKit beforeinstallprompt fallback)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          type="button"
          aria-label="Install on iPhone / iPad"
          className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-stone-300 text-stone-700 bg-white/80 hover:bg-stone-50 transition-colors ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#781D22]" />
          <span className="whitespace-nowrap">Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-[#FAF8F5] border border-stone-200 p-6 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#1E1B18] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-sm">
                    K
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900 font-serif tracking-wide">
                      KAMAL BUSINESS
                    </h3>
                    <p className="text-[11px] text-stone-500">Add to iPhone Home Screen</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-stone-700">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-stone-100">
                  <Share2 className="w-4 h-4 text-[#781D22] shrink-0 mt-0.5" />
                  <span>
                    1. Tap the <strong>Share</strong> button on your Safari bottom navigation bar.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-stone-100">
                  <Download className="w-4 h-4 text-[#781D22] shrink-0 mt-0.5" />
                  <span>
                    2. Scroll down the actions sheet and tap <strong>Add to Home Screen</strong>.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                type="button"
                className="mt-5 w-full h-11 rounded-lg bg-[#1E1B18] text-white text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback subtle affordance for browsers where install prompt isn't fired yet
  return (
    <>
      <button
        onClick={() => setShowIOSGuide(true)}
        title="Install as Progressive Web App"
        className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
      >
        <Smartphone className="w-3.5 h-3.5 text-stone-500" />
        <span className="whitespace-nowrap">Install App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#FAF8F5] border border-stone-200 p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#1E1B18] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-sm">
                  K
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 font-serif tracking-wide">
                    KAMAL BUSINESS PWA
                  </h3>
                  <p className="text-[11px] text-stone-500">Install to Home Screen or Desktop</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-stone-700">
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-stone-100">
                <Share2 className="w-4 h-4 text-[#781D22] shrink-0 mt-0.5" />
                <span>
                  On mobile: Tap browser menu / <strong>Share</strong> and choose <strong>Add to Home Screen</strong>.
                </span>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-stone-100">
                <Download className="w-4 h-4 text-[#781D22] shrink-0 mt-0.5" />
                <span>
                  On Chrome/Edge Desktop: Click the <strong>Install</strong> icon in the address bar.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              type="button"
              className="mt-5 w-full h-11 rounded-lg bg-[#1E1B18] text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
