import React from 'react';
import { QuickBillWarranty } from '../../../types/quickbill';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

interface WarrantyStampProps {
  warranty: QuickBillWarranty;
  className?: string;
  isMonoPrint?: boolean;
}

export const WarrantyStamp: React.FC<WarrantyStampProps> = ({
  warranty,
  className = '',
}) => {
  if (!warranty.enabled) return null;

  switch (warranty.style) {
    case 'seal':
      return (
        <div
          className={`relative border-2 border-dashed border-[#781D22] p-3 rounded-2xl bg-amber-50/40 text-stone-900 flex items-start gap-3 print:border-black print:bg-transparent ${className}`}
        >
          {/* Classic Circular Seal Emblem */}
          <div className="shrink-0 w-12 h-12 rounded-full border-2 border-[#781D22] flex flex-col items-center justify-center bg-white shadow-2xs print:border-black">
            <Award className="w-5 h-5 text-[#781D22] print:text-black" />
            <span className="text-[8px] font-black uppercase tracking-tighter text-[#781D22] print:text-black leading-none mt-0.5">
              SEAL
            </span>
          </div>

          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#781D22] print:text-black uppercase tracking-wide">
                {warranty.title}
              </span>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-[#781D22] text-white print:bg-black print:text-white uppercase tracking-wider">
                {warranty.period}
              </span>
            </div>

            <p className="text-[11px] text-stone-700 print:text-black font-medium mt-1 leading-snug">
              {warranty.message}
            </p>

            {warranty.covered && (
              <p className="text-[10px] text-stone-600 print:text-black mt-1 leading-tight">
                <span className="font-semibold text-stone-800 print:text-black">Covered:</span> {warranty.covered}
              </p>
            )}

            {warranty.conditions && (
              <p className="text-[9px] text-stone-500 print:text-black italic mt-1 leading-tight">
                * {warranty.conditions}
              </p>
            )}
          </div>
        </div>
      );

    case 'box':
      return (
        <div
          className={`border border-stone-800 rounded-xl p-3 bg-stone-50/70 text-stone-900 print:bg-transparent print:border-black ${className}`}
        >
          <div className="flex items-center justify-between border-b border-stone-300 pb-1.5 mb-1.5 print:border-black">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-stone-800 print:text-black" />
              <span className="text-xs font-bold tracking-wider uppercase text-stone-900 print:text-black">
                {warranty.title}
              </span>
            </div>
            <span className="text-[11px] font-bold text-stone-900 print:text-black border border-stone-800 px-2 py-0.5 rounded print:border-black">
              Period: {warranty.period}
            </span>
          </div>

          <p className="text-[11px] text-stone-800 print:text-black leading-snug">
            {warranty.message}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-1.5 border-t border-stone-200 text-[10px] print:border-black">
            {warranty.covered && (
              <div>
                <span className="font-bold text-stone-900 print:text-black">Covered: </span>
                <span className="text-stone-700 print:text-black">{warranty.covered}</span>
              </div>
            )}
            {warranty.notCovered && (
              <div>
                <span className="font-bold text-stone-900 print:text-black">Excluded: </span>
                <span className="text-stone-700 print:text-black">{warranty.notCovered}</span>
              </div>
            )}
          </div>
        </div>
      );

    case 'stamp':
      return (
        <div
          className={`inline-flex items-center gap-3 border-2 border-[#1E3A8A] rounded-xl px-3.5 py-2 bg-blue-50/40 text-left print:border-black print:bg-transparent ${className}`}
        >
          <div className="shrink-0 w-8 h-8 rounded-full border-2 border-[#1E3A8A] flex items-center justify-center print:border-black">
            <CheckCircle2 className="w-4 h-4 text-[#1E3A8A] print:text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] print:text-black">
                {warranty.title}
              </span>
              <span className="text-[10px] font-extrabold bg-[#1E3A8A] text-white px-1.5 py-0.2 rounded print:bg-black">
                {warranty.period}
              </span>
            </div>
            <p className="text-[10px] text-stone-700 print:text-black font-medium leading-tight mt-0.5">
              {warranty.message}
            </p>
          </div>
        </div>
      );
  }
};
