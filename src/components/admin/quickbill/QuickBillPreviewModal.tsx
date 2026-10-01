import React, { useRef, useState } from 'react';
import { QuickBill, QuickBillSettingsConfig } from '../../../types/quickbill';
import { QuickBillDocument } from './QuickBillDocument';
import {
  downloadBillPdf,
  shareBillPdf,
  printBillDocument,
} from '../../../utils/quickBillExport';
import {
  Printer,
  FileDown,
  Share2,
  ArrowLeft,
  PlusCircle,
  CheckCircle,
  Save,
  Check,
  X,
  Sparkles,
  Receipt,
  FileText,
} from 'lucide-react';
import { quickBillStorage } from '../../../services/quickBillStorage';

interface QuickBillPreviewModalProps {
  bill: QuickBill;
  settings: QuickBillSettingsConfig;
  isOpen: boolean;
  onClose: () => void;
  onEditBill: () => void;
  onNewBill: () => void;
  onCreateBillFromQuotation?: (quotation: QuickBill) => void;
}

export const QuickBillPreviewModal: React.FC<QuickBillPreviewModalProps> = ({
  bill: initialBill,
  settings,
  isOpen,
  onClose,
  onEditBill,
  onNewBill,
  onCreateBillFromQuotation,
}) => {
  const [bill, setBill] = useState<QuickBill>(initialBill);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  const isQuotation = bill.docType === 'quotation';
  const docTypeLabel = isQuotation ? 'Quotation' : 'Bill';

  React.useEffect(() => {
    setBill(initialBill);
  }, [initialBill]);

  if (!isOpen) return null;

  const handleSaveToHistory = () => {
    setIsSaving(true);
    quickBillStorage.saveDocument(bill);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 200);
  };

  const handlePrint = () => {
    handleSaveToHistory();
    setTimeout(() => {
      printBillDocument();
    }, 150);
  };

  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    try {
      setIsSaving(true);
      handleSaveToHistory();
      const filename = await downloadBillPdf(documentRef.current, bill);
      setExportNotice(`Saved PDF: ${filename}`);
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('PDF error:', err);
      alert('Error generating PDF. Please use the Print option as fallback.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSharePdf = async () => {
    if (!documentRef.current) return;
    try {
      setIsSaving(true);
      handleSaveToHistory();
      const res = await shareBillPdf(documentRef.current, bill);
      setExportNotice(res.message);
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Share error:', err);
      handleDownloadPdf();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${docTypeLabel} Document Preview`}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
    >
      <div className="bg-[#FAF8F5] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[96vh] my-auto">
        {/* Sticky Actions Bar (No-Print) */}
        <div className="no-print sticky top-0 z-30 px-4 sm:px-6 py-3.5 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
          {/* Left: Back to edit */}
          <div className="flex items-center gap-2">
            <button
              onClick={onEditBill}
              type="button"
              className="min-h-[44px] px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
              <span>← EDIT {docTypeLabel.toUpperCase()}</span>
            </button>

            <div className="hidden md:block">
              <span className="text-xs font-bold text-stone-200">
                {docTypeLabel} #{bill.billNo}
              </span>
              <span className="text-[11px] text-stone-400 block font-mono">
                {bill.customerName || 'Customer'} · Total: ₹{bill.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Center: Live Format Switcher */}
          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setBill((prev) => ({ ...prev, format: 'classic' }))}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                bill.format === 'classic'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Classic
            </button>
            <button
              type="button"
              onClick={() => setBill((prev) => ({ ...prev, format: 'premium' }))}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                bill.format === 'premium'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Premium
            </button>
            <button
              type="button"
              onClick={() => setBill((prev) => ({ ...prev, format: 'compact' }))}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                bill.format === 'compact'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Compact
            </button>
          </div>

          {/* Right: Close button */}
          <button
            onClick={onClose}
            type="button"
            aria-label="Close Preview"
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export notice alert */}
        {exportNotice && (
          <div className="no-print mx-4 sm:mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span>{exportNotice}</span>
            <button
              type="button"
              onClick={() => setExportNotice(null)}
              className="text-stone-500 hover:text-stone-800 text-sm font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Scrollable Document Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-stone-200/60 flex justify-center items-start">
          <div className="quickbill-printable-area w-full">
            <QuickBillDocument
              documentRef={documentRef}
              bill={bill}
              profile={settings.profile}
              includeEandOE={settings.includeEandOE}
            />
          </div>
        </div>

        {/* Action Toolbar at Bottom */}
        <div className="no-print px-4 sm:px-6 py-4 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSaveToHistory}
              disabled={isSaving}
              className={`min-h-[44px] px-4 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-stone-300 hover:bg-stone-50 text-stone-700'
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Saved in History</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-stone-500" />
                  <span>Save {docTypeLabel}</span>
                </>
              )}
            </button>

            {/* CREATE BILL FROM QUOTATION (Section 14 & 18) */}
            {isQuotation && onCreateBillFromQuotation && (
              <button
                type="button"
                onClick={() => onCreateBillFromQuotation(bill)}
                className="min-h-[44px] px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Receipt className="w-4 h-4 text-emerald-700" />
                <span>CREATE BILL FROM QUOTATION</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNewBill}
              className="min-h-[44px] px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#781D22]" />
              <span>NEW DOCUMENT</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSharePdf}
              disabled={isSaving}
              className="min-h-[44px] px-4 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-[0.98] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4 text-[#D4AF37]" />
              <span>SHARE PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isSaving}
              className="min-h-[44px] px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <FileDown className="w-4 h-4 text-[#D4AF37]" />
              <span>SAVE PDF</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] px-6 rounded-xl bg-[#781D22] hover:bg-[#60171B] active:scale-[0.98] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>PRINT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
