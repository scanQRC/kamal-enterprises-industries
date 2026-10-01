import React, { useState, useEffect } from 'react';
import { QuickBill, QuickBillSettingsConfig, DocType } from '../../../types/quickbill';
import { quickBillStorage } from '../../../services/quickBillStorage';
import { QuickBillEditor } from './QuickBillEditor';
import { QuickBillHistory } from './QuickBillHistory';
import { QuickBillSettings } from './QuickBillSettings';
import { QuickBillDesignPreview } from './QuickBillDesignPreview';
import { QuickBillPreviewModal } from './QuickBillPreviewModal';
import {
  Receipt,
  History,
  Settings,
  Eye,
  PlusCircle,
  WifiOff,
  Sparkles,
  Bike,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const QuickBillModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'preview' | 'settings'>('new');
  const [settings, setSettings] = useState<QuickBillSettingsConfig>(() =>
    quickBillStorage.getSettings()
  );

  // Bill being actively edited or viewed
  const [activeBillForEdit, setActiveBillForEdit] = useState<QuickBill | null>(null);
  const [startingDocType, setStartingDocType] = useState<DocType>('bill');
  const [previewModalBill, setPreviewModalBill] = useState<QuickBill | null>(null);

  // Quick stats
  const [billsCount, setBillsCount] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);

  const refreshStats = () => {
    const bills = quickBillStorage.getBills();
    setBillsCount(bills.length);
    const todayStr = new Date().toISOString().split('T')[0];
    const todays = bills.filter((b) => b.date === todayStr);
    const sum = todays.reduce((acc, b) => acc + (b.grandTotal || 0), 0);
    setTodayTotal(sum);
  };

  useEffect(() => {
    refreshStats();
  }, [activeTab, previewModalBill]);

  // Handle previewing a bill from editor
  const handleOpenPreview = (bill: QuickBill) => {
    setPreviewModalBill(bill);
  };

  // Handle edit request from preview modal or history
  const handleEditBill = (bill: QuickBill) => {
    setPreviewModalBill(null);
    setActiveBillForEdit(bill);
    setStartingDocType(bill.docType);
    setActiveTab('new');
  };

  // Handle start fresh new bill or quotation
  const handleNewDocument = (type: DocType = 'bill') => {
    setPreviewModalBill(null);
    setActiveBillForEdit(null);
    setStartingDocType(type);
    setActiveTab('new');
  };

  // Handle converting an existing quotation into a new Bill draft
  const handleConvertQuotationToBill = (quotation: QuickBill) => {
    const convertedBill = quickBillStorage.createBillFromQuotation(quotation);
    setPreviewModalBill(null);
    setActiveBillForEdit(convertedBill);
    setStartingDocType('bill');
    setActiveTab('new');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Module Identity Header & Offline Badge */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#781D22] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Receipt className="w-6 h-6 text-[#D4AF37]" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-stone-900">
                  QUICK BILL
                </h1>
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                  Offline Bill &amp; Quotation
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <WifiOff className="w-3 h-3 text-emerald-600" />
                  <span>100% Offline Ready</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Shop counter digital replacement for handwritten/dasti bills · Zero stock deduction · Standalone memo
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-right">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Today's Memos
              </span>
              <span className="font-mono text-xs font-black text-stone-900">
                ₹{todayTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-right">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Total Saved
              </span>
              <span className="font-mono text-xs font-black text-stone-900">
                {billsCount} docs
              </span>
            </div>
          </div>
        </div>

        {/* Module Sub-Navigation Bar */}
        <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-stone-100 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => handleNewDocument('bill')}
            className={`min-h-[42px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'new' && (!activeBillForEdit || activeBillForEdit.docType === 'bill')
                ? 'bg-[#781D22] text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>{activeBillForEdit ? 'Active Document Editor' : '+ New Bill'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNewDocument('quotation')}
            className={`min-h-[42px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'new' && activeBillForEdit?.docType === 'quotation'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-blue-400" />
            <span>+ New Quotation</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveBillForEdit(null);
              setActiveTab('history');
            }}
            className={`min-h-[42px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-[#781D22] text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Document History ({billsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`min-h-[42px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'preview'
                ? 'bg-[#781D22] text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Design Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`min-h-[42px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#781D22] text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Quick Bill Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeTab === 'new' && (
        <QuickBillEditor
          initialBill={activeBillForEdit}
          initialDocType={startingDocType}
          settings={settings}
          onPreview={handleOpenPreview}
          onCancel={() => {
            if (activeBillForEdit) {
              setActiveBillForEdit(null);
              setActiveTab('history');
            } else {
              handleNewDocument('bill');
            }
          }}
        />
      )}

      {activeTab === 'history' && (
        <QuickBillHistory
          settings={settings}
          onViewBill={(b) => setPreviewModalBill(b)}
          onEditBill={handleEditBill}
          onNewBill={(type) => handleNewDocument(type || 'bill')}
          onCreateBillFromQuotation={handleConvertQuotationToBill}
        />
      )}

      {activeTab === 'preview' && (
        <QuickBillDesignPreview
          settings={settings}
          onBack={() => handleNewDocument('bill')}
        />
      )}

      {activeTab === 'settings' && (
        <QuickBillSettings
          onSettingsUpdated={(newS) => {
            setSettings(newS);
          }}
        />
      )}

      {/* Full Screen Bill Preview & Actions Modal */}
      {previewModalBill && (
        <QuickBillPreviewModal
          bill={previewModalBill}
          settings={settings}
          isOpen={Boolean(previewModalBill)}
          onClose={() => setPreviewModalBill(null)}
          onEditBill={() => handleEditBill(previewModalBill)}
          onNewBill={() => handleNewDocument('bill')}
          onCreateBillFromQuotation={handleConvertQuotationToBill}
        />
      )}
    </div>
  );
};
