import React, { useState, useRef } from 'react';
import { QuickBill, BillFormat, QuickBillSettingsConfig, DocType } from '../../../types/quickbill';
import { QuickBillDocument } from './QuickBillDocument';
import { downloadBillPdf, printBillDocument } from '../../../utils/quickBillExport';
import { Printer, FileDown, Check, ArrowLeft, Sparkles, Receipt, FileText } from 'lucide-react';

interface QuickBillDesignPreviewProps {
  settings: QuickBillSettingsConfig;
  onBack: () => void;
}

export const QuickBillDesignPreview: React.FC<QuickBillDesignPreviewProps> = ({
  settings,
  onBack,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<BillFormat>('premium');
  const [previewDocType, setPreviewDocType] = useState<DocType>('bill');
  const documentRef = useRef<HTMLDivElement>(null);

  const validityDate = new Date();
  validityDate.setDate(validityDate.getDate() + 7);

  // Exact temporary demo data specified in Section 26
  const sampleDemoBill: QuickBill = {
    id: 'demo-sample-bill',
    docType: previewDocType,
    billNo: previewDocType === 'quotation' ? 'KCW-Q-0101' : 'KCW-B-0101',
    date: new Date().toISOString().split('T')[0],
    time: '12:30 PM',
    customerName: previewDocType === 'quotation' ? 'Pankaj Sharma' : 'Rajesh Kumar',
    customerMobile: '9876543210',
    validUntil: previewDocType === 'quotation' ? validityDate.toISOString().split('T')[0] : undefined,
    validDays: previewDocType === 'quotation' ? 7 : undefined,
    items: [
      {
        id: 'demo-1',
        particulars: 'Hero Sprint 26T MTB Mountain Bicycle',
        brand: 'Hero Cycles',
        qty: 1,
        rate: 8500,
        discountType: 'fixed',
        discountValue: 500,
        discountAmount: 500, // One item-level discount (Section 26)
        amount: 8000,
      },
      {
        id: 'demo-2',
        particulars: 'Cycle Tube 26 × 1.95 (Schrader Valve)',
        brand: 'Ralson',
        qty: 2,
        rate: 180,
        discountAmount: 0,
        amount: 360,
      },
      {
        id: 'demo-3',
        particulars: 'Hawkins Classic 5L Pressure Cooker',
        brand: 'Hawkins',
        qty: 1,
        rate: 1950,
        discountAmount: 0,
        amount: 1950,
      },
    ],
    subtotal: 10810,
    totalItemDiscount: 500,
    overallDiscountType: 'fixed',
    overallDiscountValue: 200,
    overallDiscountAmount: 200, // One overall bill discount (Section 26)
    grandTotal: 10110,
    terms:
      previewDocType === 'quotation'
        ? settings.defaultQuotationTerms
        : settings.defaultBillTerms,
    warranty: {
      enabled: previewDocType === 'bill', // Warranty stamp on BILL only
      title: 'Kamal Cycle World Bicycle Frame Warranty',
      period: '1 Year',
      covered: 'Bicycle frame weld cracks, front rigid fork integrity',
      notCovered: 'Tires, tubes, brake pads, rough usage',
      conditions: 'Valid with this original bill memo at our Udhampur workshop',
      message: '1 Year Comprehensive Frame Warranty guaranteed by Kamal Cycle World, Udhampur.',
      style: selectedFormat === 'classic' ? 'seal' : selectedFormat === 'premium' ? 'box' : 'stamp',
    },
    includeSignature: true, // Sample signature area (Section 26)
    signatureDataUrl:
      settings.signatureDataUrl ||
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="50"><text x="10" y="35" font-family="cursive" font-size="24" fill="%23781D22">Kamal Singh</text></svg>',
    format: selectedFormat,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Bar with Format Switcher & Back button */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            type="button"
            className="min-h-[44px] px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#781D22]" />
            <span>← Back to Quick Bill</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Design Preview: Bill &amp; Quotation
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Demo Stationery</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Inspect Classic Modern, Premium and Compact layouts for both Bills and Quotations
            </p>
          </div>
        </div>

        {/* Document Type Switcher: BILL vs QUOTATION */}
        <div className="inline-flex rounded-xl bg-stone-200/80 p-1">
          <button
            type="button"
            onClick={() => setPreviewDocType('bill')}
            className={`min-h-[38px] px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              previewDocType === 'bill'
                ? 'bg-[#781D22] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Preview BILL</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDocType('quotation')}
            className={`min-h-[38px] px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              previewDocType === 'quotation'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Preview QUOTATION</span>
          </button>
        </div>

        {/* Live Format Switcher */}
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setSelectedFormat('classic')}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFormat === 'classic'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>1. Classic Modern</span>
            {selectedFormat === 'classic' && <Check className="w-3.5 h-3.5 text-[#781D22]" />}
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('premium')}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFormat === 'premium'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>2. Premium</span>
            {selectedFormat === 'premium' && <Check className="w-3.5 h-3.5 text-[#781D22]" />}
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('compact')}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFormat === 'compact'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>3. Compact</span>
            {selectedFormat === 'compact' && <Check className="w-3.5 h-3.5 text-[#781D22]" />}
          </button>
        </div>

        {/* Print / Save Sample PDF */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={printBillDocument}
            className="min-h-[44px] px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Test Print</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (documentRef.current) downloadBillPdf(documentRef.current, sampleDemoBill);
            }}
            className="min-h-[44px] px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-[#D4AF37]" />
            <span>Export Demo PDF</span>
          </button>
        </div>
      </div>

      {/* Document View Canvas */}
      <div className="bg-stone-200/60 p-4 sm:p-8 rounded-3xl flex justify-center items-start">
        <div className="quickbill-printable-area w-full">
          <QuickBillDocument
            documentRef={documentRef}
            bill={sampleDemoBill}
            profile={settings.profile}
            includeEandOE={settings.includeEandOE}
          />
        </div>
      </div>
    </div>
  );
};
