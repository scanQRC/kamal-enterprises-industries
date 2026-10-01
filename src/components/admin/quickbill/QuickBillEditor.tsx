import React, { useState, useRef, useEffect } from 'react';
import {
  QuickBill,
  QuickBillItem,
  SavedMasterItem,
  DiscountType,
  BillFormat,
  QuickBillSettingsConfig,
  DocType,
} from '../../../types/quickbill';
import { quickBillStorage } from '../../../services/quickBillStorage';
import {
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
  Sparkles,
  RotateCcw,
  Receipt,
  FileText,
  User,
  Phone,
  Calendar,
  AlertTriangle,
  BookmarkPlus,
  Eye,
  Clock,
} from 'lucide-react';

interface QuickBillEditorProps {
  initialBill?: QuickBill | null;
  initialDocType?: DocType;
  settings: QuickBillSettingsConfig;
  onPreview: (bill: QuickBill) => void;
  onCancel: () => void;
}

export const QuickBillEditor: React.FC<QuickBillEditorProps> = ({
  initialBill,
  initialDocType = 'bill',
  settings,
  onPreview,
  onCancel,
}) => {
  // Document Type: 'bill' or 'quotation' (Section 3)
  const [docType, setDocType] = useState<DocType>(
    initialBill?.docType || initialDocType || 'bill'
  );

  // --- Bill / Quotation Meta State ---
  const [billNo, setBillNo] = useState<string>(() => {
    if (initialBill?.billNo) return initialBill.billNo;
    return quickBillStorage.getNextDocumentNumber(
      initialBill?.docType || initialDocType || 'bill'
    );
  });
  const [billNoWarning, setBillNoWarning] = useState<string | null>(null);

  const [date, setDate] = useState<string>(() => {
    return initialBill?.date || new Date().toISOString().split('T')[0];
  });

  // Quotation Validity (Section 14)
  const [validDays, setValidDays] = useState<number>(
    initialBill?.validDays || settings.defaultQuotationValidityDays || 7
  );
  const [validUntil, setValidUntil] = useState<string>(() => {
    if (initialBill?.validUntil) return initialBill.validUntil;
    const d = new Date();
    d.setDate(d.getDate() + (settings.defaultQuotationValidityDays || 7));
    return d.toISOString().split('T')[0];
  });

  const [customerName, setCustomerName] = useState<string>(initialBill?.customerName || '');
  const [customerMobile, setCustomerMobile] = useState<string>(initialBill?.customerMobile || '');
  const [format, setFormat] = useState<BillFormat>(
    initialBill?.format || settings.defaultFormat || 'premium'
  );

  // --- Items State ---
  const [items, setItems] = useState<QuickBillItem[]>(initialBill?.items || []);
  const [deletedItemBackup, setDeletedItemBackup] = useState<{
    item: QuickBillItem;
    index: number;
  } | null>(null);

  // --- Current Item In-Progress ---
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [particulars, setParticulars] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [qty, setQty] = useState<string>('1');
  const [rate, setRate] = useState<string>('');
  const [hasItemDiscount, setHasItemDiscount] = useState<boolean>(false);
  const [itemDiscountType, setItemDiscountType] = useState<DiscountType>('fixed');
  const [itemDiscountValue, setItemDiscountValue] = useState<string>('');
  const [saveForFuture, setSaveForFuture] = useState<boolean>(false);

  // Autocomplete & Saved items
  const [savedItems, setSavedItems] = useState<SavedMasterItem[]>([]);
  const [suggestions, setSuggestions] = useState<SavedMasterItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // --- Finalization State ---
  const [overallDiscountType, setOverallDiscountType] = useState<DiscountType | 'none'>(
    initialBill?.overallDiscountType || 'none'
  );
  const [overallDiscountValue, setOverallDiscountValue] = useState<string>(
    initialBill?.overallDiscountValue?.toString() || ''
  );

  // Warranty is strictly optional and only on BILL by default (Section 15)
  const [applyWarranty, setApplyWarranty] = useState<boolean>(
    docType === 'bill' ? Boolean(initialBill?.warranty?.enabled) : false
  );
  const [warrantyTemplateId, setWarrantyTemplateId] = useState<string>(
    initialBill?.warranty?.templateId || 'w-bicycle-1yr'
  );
  const [warrantyTitle, setWarrantyTitle] = useState<string>(
    initialBill?.warranty?.title || 'Kamal Cycle World Warranty'
  );
  const [warrantyPeriod, setWarrantyPeriod] = useState<string>(
    initialBill?.warranty?.period || '1 Year'
  );
  const [warrantyCovered, setWarrantyCovered] = useState<string>(
    initialBill?.warranty?.covered || 'Frame weld integrity and rigid fork failure'
  );
  const [warrantyNotCovered, setWarrantyNotCovered] = useState<string>(
    initialBill?.warranty?.notCovered || 'Tires, tubes, brake wear, misuse'
  );
  const [warrantyConditions, setWarrantyConditions] = useState<string>(
    initialBill?.warranty?.conditions || 'Valid with original bill memo at Udhampur showroom'
  );
  const [warrantyMessage, setWarrantyMessage] = useState<string>(
    initialBill?.warranty?.message || '1 Year Comprehensive Frame Warranty guaranteed by Kamal Cycle World.'
  );
  const [warrantyStyle, setWarrantyStyle] = useState<'seal' | 'box' | 'stamp'>(
    initialBill?.warranty?.style || 'seal'
  );

  const [includeSignature, setIncludeSignature] = useState<boolean>(
    initialBill ? initialBill.includeSignature : Boolean(settings.signatureDataUrl)
  );

  // Terms: Separate Default Terms for Bill vs Quotation (Section 17)
  const [terms, setTerms] = useState<string[]>(() => {
    if (initialBill?.terms) return initialBill.terms;
    return docType === 'quotation'
      ? settings.defaultQuotationTerms
      : settings.defaultBillTerms;
  });

  // Active step: 'items' | 'finalize'
  const [editorStep, setEditorStep] = useState<'items' | 'finalize'>('items');

  // Input refs for high-speed focus
  const particularsInputRef = useRef<HTMLInputElement>(null);
  const qtyInputRef = useRef<HTMLInputElement>(null);
  const rateInputRef = useRef<HTMLInputElement>(null);

  // Load saved items
  useEffect(() => {
    setSavedItems(quickBillStorage.getSavedItems());
  }, []);

  // Update Valid Until when validDays changes
  const handleValidityDaysChange = (days: number) => {
    setValidDays(days);
    const baseDate = new Date(date || new Date());
    baseDate.setDate(baseDate.getDate() + days);
    setValidUntil(baseDate.toISOString().split('T')[0]);
  };

  // Switching Document Type (Section 3)
  const handleDocTypeChange = (newType: DocType) => {
    if (newType === docType) return;
    setDocType(newType);

    // If not editing an already saved document, update prefix/number
    if (!initialBill) {
      setBillNo(quickBillStorage.getNextDocumentNumber(newType));
      if (newType === 'quotation') {
        setTerms(settings.defaultQuotationTerms);
        setApplyWarranty(false); // Quotation: warranty not active before sale
        handleValidityDaysChange(validDays);
      } else {
        setTerms(settings.defaultBillTerms);
      }
    }
  };

  // Check duplicate document numbers
  useEffect(() => {
    if (billNo.trim()) {
      const exists = quickBillStorage.checkDocumentNumberExists(billNo, initialBill?.id);
      if (exists) {
        setBillNoWarning(
          `Notice: ${docType === 'quotation' ? 'Quotation' : 'Bill'} No. "${billNo}" already exists in local history.`
        );
      } else {
        setBillNoWarning(null);
      }
    }
  }, [billNo, initialBill, docType]);

  // Autocomplete suggestions
  useEffect(() => {
    if (particulars.trim().length > 1) {
      const term = particulars.toLowerCase();
      const filtered = savedItems.filter(
        (it) =>
          it.name.toLowerCase().includes(term) ||
          (it.brand && it.brand.toLowerCase().includes(term))
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [particulars, savedItems]);

  // Sync warranty template when selected
  useEffect(() => {
    if (warrantyTemplateId) {
      const templates = quickBillStorage.getWarrantyTemplates();
      const t = templates.find((tmp) => tmp.id === warrantyTemplateId);
      if (t) {
        setWarrantyTitle(t.title);
        setWarrantyPeriod(t.period);
        setWarrantyCovered(t.covered);
        setWarrantyNotCovered(t.notCovered);
        setWarrantyConditions(t.conditions);
        setWarrantyMessage(t.defaultMessage);
        setWarrantyStyle(t.defaultStyle);
      }
    }
  }, [warrantyTemplateId]);

  const handleSelectSuggestion = (item: SavedMasterItem) => {
    setParticulars(item.name);
    if (item.brand) setBrand(item.brand);
    if (item.defaultRate && !rate) setRate(item.defaultRate.toString());
    setShowSuggestions(false);
    rateInputRef.current?.focus();
  };

  // Calculate current item amount
  const calculateCurrentItem = (): {
    discountAmount: number;
    netAmount: number;
    rawTotal: number;
  } => {
    const q = parseFloat(qty) || 0;
    const r = parseFloat(rate) || 0;
    const rawTotal = q * r;

    let discountAmount = 0;
    if (hasItemDiscount && itemDiscountValue) {
      const discVal = parseFloat(itemDiscountValue) || 0;
      if (itemDiscountType === 'fixed') {
        discountAmount = Math.min(discVal, rawTotal);
      } else {
        discountAmount = (rawTotal * Math.min(discVal, 100)) / 100;
      }
    }

    const netAmount = Math.max(0, rawTotal - discountAmount);
    return { discountAmount, netAmount, rawTotal };
  };

  const currentItemCalc = calculateCurrentItem();

  // Reset item fields & auto-focus Particulars
  const resetItemFields = () => {
    setEditingItemId(null);
    setParticulars('');
    setBrand('');
    setQty('1');
    setRate('');
    setHasItemDiscount(false);
    setItemDiscountType('fixed');
    setItemDiscountValue('');
    setSaveForFuture(false);
    setShowSuggestions(false);
    setTimeout(() => {
      particularsInputRef.current?.focus();
    }, 50);
  };

  // FAST ITEM ENTRY LOGIC (Section 4)
  const handleNextOrFinish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If the fresh next-item form is EMPTY and NEXT is pressed:
    // DO NOT create a blank item! Proceed toward Finish Items.
    if (!particulars.trim()) {
      if (items.length > 0) {
        setEditorStep('finalize');
      } else {
        alert('Please enter item particulars before proceeding.');
        particularsInputRef.current?.focus();
      }
      return;
    }

    const q = parseFloat(qty) || 1;
    const r = parseFloat(rate) || 0;
    const { discountAmount, netAmount } = calculateCurrentItem();

    const newItem: QuickBillItem = {
      id: editingItemId || `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      particulars: particulars.trim(),
      brand: brand.trim() || undefined,
      qty: q,
      rate: r,
      discountType: hasItemDiscount ? itemDiscountType : undefined,
      discountValue:
        hasItemDiscount && itemDiscountValue ? parseFloat(itemDiscountValue) : undefined,
      discountAmount,
      amount: netAmount,
    };

    if (saveForFuture && particulars.trim()) {
      const existing = savedItems.some(
        (it) => it.name.toLowerCase() === particulars.trim().toLowerCase()
      );
      if (!existing) {
        const saved = quickBillStorage.saveItem({
          name: particulars.trim(),
          brand: brand.trim() || undefined,
          defaultRate: r > 0 ? r : undefined,
        });
        setSavedItems((prev) => [saved, ...prev]);
      }
    }

    if (editingItemId) {
      setItems((prev) => prev.map((it) => (it.id === editingItemId ? newItem : it)));
    } else {
      setItems((prev) => [...prev, newItem]);
    }

    resetItemFields();
  };

  const handleEditItem = (item: QuickBillItem) => {
    setEditingItemId(item.id);
    setParticulars(item.particulars);
    setBrand(item.brand || '');
    setQty(item.qty.toString());
    setRate(item.rate.toString());
    if (item.discountAmount && item.discountAmount > 0) {
      setHasItemDiscount(true);
      setItemDiscountType(item.discountType || 'fixed');
      setItemDiscountValue(item.discountValue?.toString() || item.discountAmount.toString());
    } else {
      setHasItemDiscount(false);
      setItemDiscountType('fixed');
      setItemDiscountValue('');
    }
    setEditorStep('items');
    setTimeout(() => {
      particularsInputRef.current?.focus();
    }, 50);
  };

  const handleDeleteItem = (index: number) => {
    const itemToDelete = items[index];
    setDeletedItemBackup({ item: itemToDelete, index });
    setItems((prev) => prev.filter((_, i) => i !== index));

    setTimeout(() => {
      setDeletedItemBackup((curr) => (curr?.item.id === itemToDelete.id ? null : curr));
    }, 8000);
  };

  const handleUndoDelete = () => {
    if (deletedItemBackup) {
      setItems((prev) => {
        const next = [...prev];
        next.splice(deletedItemBackup.index, 0, deletedItemBackup.item);
        return next;
      });
      setDeletedItemBackup(null);
    }
  };

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + it.qty * it.rate, 0);
  const totalItemDiscount = items.reduce((acc, it) => acc + (it.discountAmount || 0), 0);
  const netItemTotal = subtotal - totalItemDiscount;

  let overallDiscountAmount = 0;
  if (overallDiscountType !== 'none' && overallDiscountValue) {
    const discVal = parseFloat(overallDiscountValue) || 0;
    if (overallDiscountType === 'fixed') {
      overallDiscountAmount = Math.min(discVal, netItemTotal);
    } else if (overallDiscountType === 'percentage') {
      overallDiscountAmount = (netItemTotal * Math.min(discVal, 100)) / 100;
    }
  }

  const grandTotal = Math.max(0, netItemTotal - overallDiscountAmount);

  const handleProceedToPreview = () => {
    if (items.length === 0) {
      alert('Please add at least one item before previewing.');
      setEditorStep('items');
      return;
    }

    const compiledBill: QuickBill = {
      id: initialBill?.id || `doc-${Date.now()}`,
      docType,
      billNo: billNo.trim() || quickBillStorage.getNextDocumentNumber(docType),
      date,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      validUntil: docType === 'quotation' ? validUntil : undefined,
      validDays: docType === 'quotation' ? validDays : undefined,
      items,
      subtotal,
      totalItemDiscount,
      overallDiscountType: overallDiscountType !== 'none' ? overallDiscountType : undefined,
      overallDiscountValue:
        overallDiscountType !== 'none' && overallDiscountValue
          ? parseFloat(overallDiscountValue)
          : undefined,
      overallDiscountAmount,
      grandTotal,
      terms,
      warranty:
        docType === 'bill' && applyWarranty
          ? {
              enabled: true,
              templateId: warrantyTemplateId,
              title: warrantyTitle,
              period: warrantyPeriod,
              covered: warrantyCovered,
              notCovered: warrantyNotCovered,
              conditions: warrantyConditions,
              message: warrantyMessage,
              style: warrantyStyle,
            }
          : {
              enabled: false,
              title: '',
              period: '',
              covered: '',
              notCovered: '',
              conditions: '',
              message: '',
              style: 'seal',
            },
      includeSignature,
      signatureDataUrl: includeSignature ? settings.signatureDataUrl || undefined : undefined,
      format,
      isCorrected: initialBill ? true : false,
      createdAt: initialBill?.createdAt || new Date().toISOString(),
    };

    onPreview(compiledBill);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden text-left flex flex-col">
      {/* Top Header & Navigation */}
      <div className="px-4 sm:px-6 py-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            type="button"
            className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#781D22]" />
            <span>← Back</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                {initialBill
                  ? `Edit ${docType === 'quotation' ? 'Quotation' : 'Bill'}`
                  : `Create New ${docType === 'quotation' ? 'Customer Quotation' : 'Customer Bill'}`}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Offline Mode
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Kamal Cycle World · {docType === 'quotation' ? 'Price Estimate / Quote' : 'Counter Sale Memo'} · Zero Stock Impact
            </p>
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setEditorStep('items')}
            className={`min-h-[36px] px-3.5 rounded-xl transition-all cursor-pointer ${
              editorStep === 'items'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            1. Items Entry ({items.length})
          </button>
          <button
            type="button"
            onClick={() => {
              if (items.length > 0) setEditorStep('finalize');
              else alert('Please add at least one item first.');
            }}
            className={`min-h-[36px] px-3.5 rounded-xl transition-all cursor-pointer ${
              editorStep === 'finalize'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            2. Finalize &amp; Terms
          </button>
        </div>
      </div>

      {billNoWarning && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 bg-amber-50 border border-amber-300 rounded-2xl text-amber-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{billNoWarning}</span>
        </div>
      )}

      {/* Main Billing Workspace */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ========================================================================= */}
        {/* DOCUMENT TYPE SELECTION (Section 3: START OF CREATION)                   */}
        {/* ========================================================================= */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Document Type
            </span>
            <span className="text-xs text-stone-700">
              Choose whether you are generating a sale Bill or a price Quotation
            </span>
          </div>

          <div className="inline-flex rounded-xl bg-stone-200/80 p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleDocTypeChange('bill')}
              className={`flex-1 sm:flex-initial min-h-[40px] px-5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                docType === 'bill'
                  ? 'bg-[#781D22] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>BILL</span>
            </button>
            <button
              type="button"
              onClick={() => handleDocTypeChange('quotation')}
              className={`flex-1 sm:flex-initial min-h-[40px] px-5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                docType === 'quotation'
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>QUOTATION</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: ITEMS ENTRY VIEW                                                  */}
        {/* ========================================================================= */}
        {editorStep === 'items' && (
          <div className="space-y-6">
            {/* Customer Details Strip */}
            <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  {docType === 'quotation' ? 'Quotation Details' : 'Customer & Memo Details'}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  KAMAL CYCLE WORLD · UDHAMPUR
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Customer Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#781D22]/20 focus:border-[#781D22]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Contact Mobile (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="tel"
                      inputMode="tel"
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value)}
                      placeholder="e.g. 94191XXXXX"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#781D22]/20 focus:border-[#781D22]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {docType === 'quotation' ? 'Quotation No.' : 'Bill Memo No.'}
                  </label>
                  <div className="relative">
                    <Receipt className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={billNo}
                      onChange={(e) => setBillNo(e.target.value)}
                      placeholder={docType === 'quotation' ? 'KCW-Q-0101' : 'KCW-B-0101'}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-300 bg-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#781D22]/20 focus:border-[#781D22]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#781D22]/20 focus:border-[#781D22]"
                    />
                  </div>
                </div>
              </div>

              {/* Quotation Validity Row (Section 14) */}
              {docType === 'quotation' && (
                <div className="mt-3 pt-3 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1E3A8A]" />
                    <span className="font-semibold text-stone-700">Validity Preset:</span>
                    <div className="flex items-center gap-1">
                      {[7, 15, 30].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => handleValidityDaysChange(days)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            validDays === days
                              ? 'bg-[#1E3A8A] text-white'
                              : 'bg-white border border-stone-300 text-stone-700'
                          }`}
                        >
                          {days} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-700">Valid Until:</span>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="h-8 px-2.5 rounded-lg border border-stone-300 bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick-Pick Popular Item Pills for 1-Tap Entry */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Quick Pick Common Items</span>
                </span>
                <span className="text-[10px] text-stone-400">Tap to populate instantly</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {savedItems.slice(0, 6).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-stone-300 text-stone-800 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all active:scale-[0.98] shrink-0 flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{s.name}</span>
                    {s.defaultRate && (
                      <span className="font-mono text-emerald-800 text-[11px] bg-emerald-50 px-1 rounded">
                        ₹{s.defaultRate}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* FAST ITEM ENTRY FORM */}
            <form
              onSubmit={handleNextOrFinish}
              className="bg-amber-50/40 p-4 sm:p-5 rounded-3xl border-2 border-stone-300/80 shadow-xs relative"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#781D22] animate-pulse" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    {editingItemId ? '✏️ Edit Item Line' : '⚡ Fast Item Entry (Press NEXT to proceed)'}
                  </span>
                </div>
                {editingItemId && (
                  <button
                    type="button"
                    onClick={resetItemFields}
                    className="text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer underline"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                {/* Particulars with Autocomplete */}
                <div className="sm:col-span-6 relative">
                  <label className="block text-[11px] font-bold text-stone-800 mb-1">
                    Particulars / Product Description *
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      ref={particularsInputRef}
                      type="text"
                      required
                      value={particulars}
                      onChange={(e) => setParticulars(e.target.value)}
                      placeholder="e.g. Hero Sprint 26T MTB / Cycle Tube 26x1.95"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#781D22]/30 focus:border-[#781D22]"
                    />
                  </div>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-300 rounded-2xl shadow-xl z-30 overflow-hidden text-xs">
                      {suggestions.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => handleSelectSuggestion(s)}
                          className="p-2.5 hover:bg-amber-50 cursor-pointer border-b border-stone-100 last:border-0 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-semibold text-stone-900">{s.name}</span>
                            {s.brand && (
                              <span className="text-[10px] text-stone-500 block">{s.brand}</span>
                            )}
                          </div>
                          {s.defaultRate && (
                            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                              ₹{s.defaultRate}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Qty */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-800 mb-1">Qty *</label>
                  <input
                    ref={qtyInputRef}
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="any"
                    required
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white text-center font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#781D22]/30 focus:border-[#781D22]"
                  />
                </div>

                {/* Rate */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-800 mb-1">Rate (₹) *</label>
                  <input
                    ref={rateInputRef}
                    type="number"
                    inputMode="decimal"
                    step="any"
                    required
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white text-right font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#781D22]/30 focus:border-[#781D22]"
                  />
                </div>

                {/* Line Amount */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-500 mb-1 text-right">
                    Line Amount
                  </label>
                  <div className="h-10 px-3 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-end font-mono font-bold text-stone-900 text-sm">
                    ₹{currentItemCalc.netAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Item-Level Discount Option */}
              <div className="mt-3 pt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasItemDiscount}
                      onChange={(e) => setHasItemDiscount(e.target.checked)}
                      className="w-4 h-4 rounded text-[#781D22] focus:ring-[#781D22]"
                    />
                    <span className="font-semibold text-stone-700">Apply Item Discount</span>
                  </label>

                  {hasItemDiscount && (
                    <div className="inline-flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-stone-300">
                      <div className="inline-flex rounded-lg bg-stone-100 p-0.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setItemDiscountType('fixed')}
                          className={`px-2 py-0.5 rounded-md font-bold cursor-pointer transition-all ${
                            itemDiscountType === 'fixed'
                              ? 'bg-white text-stone-900 shadow-2xs'
                              : 'text-stone-500'
                          }`}
                        >
                          ₹
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemDiscountType('percentage')}
                          className={`px-2 py-0.5 rounded-md font-bold cursor-pointer transition-all ${
                            itemDiscountType === 'percentage'
                              ? 'bg-white text-stone-900 shadow-2xs'
                              : 'text-stone-500'
                          }`}
                        >
                          %
                        </button>
                      </div>

                      <input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        placeholder={itemDiscountType === 'fixed' ? 'Discount ₹' : 'Discount %'}
                        value={itemDiscountValue}
                        onChange={(e) => setItemDiscountValue(e.target.value)}
                        className="w-24 h-7 px-2 rounded-lg border border-stone-200 font-mono text-right text-xs focus:outline-none focus:border-[#781D22]"
                      />

                      {currentItemCalc.discountAmount > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-800">
                          (-₹{currentItemCalc.discountAmount.toFixed(0)})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer text-stone-600">
                  <input
                    type="checkbox"
                    checked={saveForFuture}
                    onChange={(e) => setSaveForFuture(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-700"
                  />
                  <BookmarkPlus className="w-3.5 h-3.5 text-stone-500" />
                  <span className="text-[11px] font-medium">Save item for future use</span>
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-stone-500 hidden sm:inline">
                  Tip: Press <kbd className="px-1.5 py-0.5 bg-stone-200 rounded font-mono text-[10px]">Enter</kbd> to save and start next item
                </span>

                <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial min-h-[44px] px-6 rounded-2xl bg-[#781D22] hover:bg-[#60171B] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <span>{editingItemId ? 'Update Item' : 'NEXT (Next Item)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (particulars.trim()) {
                        handleNextOrFinish();
                      }
                      if (items.length > 0 || particulars.trim()) {
                        setEditorStep('finalize');
                      } else {
                        alert('Please add at least one item.');
                      }
                    }}
                    className="flex-1 sm:flex-initial min-h-[44px] px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                    <span>Finish Items →</span>
                  </button>
                </div>
              </div>
            </form>

            {deletedItemBackup && (
              <div className="p-3 bg-stone-900 text-white rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
                <span>
                  Deleted "<strong>{deletedItemBackup.item.particulars}</strong>".
                </span>
                <button
                  type="button"
                  onClick={handleUndoDelete}
                  className="px-3 py-1 bg-[#D4AF37] text-stone-950 font-bold rounded-lg hover:bg-amber-400 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>
              </div>
            )}

            {/* Added Items List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                  Items on This {docType === 'quotation' ? 'Quotation' : 'Memo'} ({items.length})
                </span>
                <span className="text-xs font-mono font-bold text-stone-900">
                  Subtotal: ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-3xl text-stone-400 text-xs">
                  No items added yet. Type an item above and press <strong>NEXT</strong>.
                </div>
              ) : (
                <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                        <th className="p-3 text-center w-14">Qty</th>
                        <th className="p-3">Particulars</th>
                        <th className="p-3 text-right w-24">Rate</th>
                        <th className="p-3 text-right w-20">Disc</th>
                        <th className="p-3 text-right w-28">Net Amount</th>
                        <th className="p-3 text-center w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-stone-50/70">
                          <td className="p-3 text-center font-bold font-mono text-stone-900">
                            {item.qty}
                          </td>
                          <td className="p-3 font-semibold text-stone-900">
                            <div>{item.particulars}</div>
                            {item.brand && (
                              <span className="text-[10px] text-stone-400 font-normal">
                                {item.brand}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right font-mono">₹{item.rate}</td>
                          <td className="p-3 text-right font-mono text-emerald-800">
                            {item.discountAmount > 0 ? `-₹${item.discountAmount}` : '-'}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-stone-900">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditItem(item)}
                                title="Edit Item"
                                className="min-h-[36px] min-w-[36px] p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(idx)}
                                title="Delete Item"
                                className="min-h-[36px] min-w-[36px] p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bottom Bar: Proceed to Finalize */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-stone-500">
                  Items: <strong>{items.length}</strong>
                </span>
                <span className="text-sm font-bold text-stone-900">
                  Subtotal: <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (items.length === 0) {
                    alert('Please add at least one item first.');
                    return;
                  }
                  setEditorStep('finalize');
                }}
                disabled={items.length === 0}
                className="min-h-[44px] px-6 rounded-2xl bg-[#781D22] hover:bg-[#60171B] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all ml-auto"
              >
                <span>Continue to Discounts &amp; Terms</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: FINALIZE, OVERALL DISCOUNT, WARRANTY, FORMAT & SIGNATURE          */}
        {/* ========================================================================= */}
        {editorStep === 'finalize' && (
          <div className="space-y-6">
            {/* Format Selection */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide mb-2">
                Select Commercial Stationery Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('classic')}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    format === 'classic'
                      ? 'bg-white border-[#781D22] ring-2 ring-[#781D22]/20 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-stone-900">1. Classic Modern</span>
                    {format === 'classic' && <Check className="w-4 h-4 text-[#781D22]" />}
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    Simplicity with clean, crisp borders modeled after traditional counter memos.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('premium')}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    format === 'premium'
                      ? 'bg-white border-[#781D22] ring-2 ring-[#781D22]/20 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-stone-900">2. Premium</span>
                      <span className="px-1.5 py-0.2 bg-[#D4AF37]/20 text-[#855B14] rounded text-[9px] font-black uppercase">
                        Standard
                      </span>
                    </div>
                    {format === 'premium' && <Check className="w-4 h-4 text-[#781D22]" />}
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    Refined modern typography, clean hierarchy, and executive stationery framing.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('compact')}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    format === 'compact'
                      ? 'bg-white border-[#781D22] ring-2 ring-[#781D22]/20 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-stone-900">3. Compact</span>
                    {format === 'compact' && <Check className="w-4 h-4 text-[#781D22]" />}
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    High-density receipt layout optimized for single-page counter slips.
                  </p>
                </button>
              </div>
            </div>

            {/* Overall Bill/Quotation Discount */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200">
              <span className="block text-xs font-bold text-stone-800 uppercase tracking-wide mb-2">
                Overall {docType === 'quotation' ? 'Quotation' : 'Bill'} Discount
              </span>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="inline-flex rounded-xl bg-stone-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOverallDiscountType('none');
                      setOverallDiscountValue('');
                    }}
                    className={`min-h-[36px] px-3 rounded-lg font-semibold cursor-pointer ${
                      overallDiscountType === 'none'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500'
                    }`}
                  >
                    No Discount
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverallDiscountType('fixed')}
                    className={`min-h-[36px] px-3 rounded-lg font-semibold cursor-pointer ${
                      overallDiscountType === 'fixed'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500'
                    }`}
                  >
                    Discount ₹
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverallDiscountType('percentage')}
                    className={`min-h-[36px] px-3 rounded-lg font-semibold cursor-pointer ${
                      overallDiscountType === 'percentage'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500'
                    }`}
                  >
                    Discount %
                  </button>
                </div>

                {overallDiscountType !== 'none' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="any"
                      placeholder={overallDiscountType === 'fixed' ? 'Amount in ₹' : 'Percentage %'}
                      value={overallDiscountValue}
                      onChange={(e) => setOverallDiscountValue(e.target.value)}
                      className="w-32 h-10 px-3 rounded-xl border border-stone-300 font-mono text-xs focus:outline-none focus:border-[#781D22]"
                    />
                    {overallDiscountAmount > 0 && (
                      <span className="text-xs font-semibold text-emerald-800 font-mono">
                        Deducts -₹{overallDiscountAmount.toFixed(0)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Optional Warranty Stamp (Section 15: BILL ONLY) */}
            {docType === 'bill' ? (
              <div className="bg-white p-4 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyWarranty}
                      onChange={(e) => setApplyWarranty(e.target.checked)}
                      className="w-4 h-4 rounded text-[#781D22] focus:ring-[#781D22]"
                    />
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                      Apply Warranty Stamp on Bill
                    </span>
                  </label>
                  {applyWarranty && (
                    <span className="text-[10px] font-semibold text-[#781D22] bg-[#781D22]/10 px-2 py-0.5 rounded">
                      Warranty Active
                    </span>
                  )}
                </div>

                {applyWarranty && (
                  <div className="space-y-4 pt-3 border-t border-stone-200 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Warranty Template
                        </label>
                        <select
                          value={warrantyTemplateId}
                          onChange={(e) => setWarrantyTemplateId(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                        >
                          {quickBillStorage.getWarrantyTemplates().map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title} ({t.period})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Visual Stamp Format
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setWarrantyStyle('seal')}
                            className={`h-10 rounded-xl border font-semibold cursor-pointer ${
                              warrantyStyle === 'seal'
                                ? 'bg-amber-50 border-[#781D22] text-[#781D22]'
                                : 'bg-white border-stone-300 text-stone-600'
                            }`}
                          >
                            1. Seal
                          </button>
                          <button
                            type="button"
                            onClick={() => setWarrantyStyle('box')}
                            className={`h-10 rounded-xl border font-semibold cursor-pointer ${
                              warrantyStyle === 'box'
                                ? 'bg-stone-100 border-stone-900 text-stone-900'
                                : 'bg-white border-stone-300 text-stone-600'
                            }`}
                          >
                            2. Box
                          </button>
                          <button
                            type="button"
                            onClick={() => setWarrantyStyle('stamp')}
                            className={`h-10 rounded-xl border font-semibold cursor-pointer ${
                              warrantyStyle === 'stamp'
                                ? 'bg-blue-50 border-blue-800 text-blue-900'
                                : 'bg-white border-stone-300 text-stone-600'
                            }`}
                          >
                            3. Stamp
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Warranty Period
                        </label>
                        <input
                          type="text"
                          value={warrantyPeriod}
                          onChange={(e) => setWarrantyPeriod(e.target.value)}
                          placeholder="e.g. 1 Year / 6 Months"
                          className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Covered Particulars
                        </label>
                        <input
                          type="text"
                          value={warrantyCovered}
                          onChange={(e) => setWarrantyCovered(e.target.value)}
                          placeholder="e.g. Frame manufacturing defects"
                          className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Warranty Guarantee Message
                      </label>
                      <input
                        type="text"
                        value={warrantyMessage}
                        onChange={(e) => setWarrantyMessage(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 text-xs">
                <span className="font-bold text-blue-900 block mb-1">
                  ℹ️ Quotation Pre-Sale Terms
                </span>
                <p className="text-blue-800 leading-relaxed">
                  Active showroom warranty stamps are issued upon actual sale. Standard warranty coverage conditions are stated in the quotation terms below.
                </p>
              </div>
            )}

            {/* Signature & Terms (Sections 16 & 17) */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSignature}
                    onChange={(e) => setIncludeSignature(e.target.checked)}
                    className="w-4 h-4 rounded text-[#781D22] focus:ring-[#781D22]"
                  />
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                    Add Authorized Digital Signature
                  </span>
                </label>
                {includeSignature && !settings.signatureDataUrl && (
                  <span className="text-[10px] text-amber-700">
                    (No signature image stored yet in Settings; will show manual line)
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {docType === 'quotation' ? 'Quotation Terms' : 'Bill Terms'} (One per line)
                </label>
                <textarea
                  rows={3}
                  value={terms.join('\n')}
                  onChange={(e) => setTerms(e.target.value.split('\n').filter((t) => t.trim()))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white font-medium"
                />
              </div>
            </div>

            {/* Final Summary Card */}
            <div className="p-5 rounded-3xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-xs text-stone-300">
                <div>
                  Subtotal: <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totalItemDiscount > 0 && (
                  <div className="text-emerald-400">
                    Item Discounts:{' '}
                    <span className="font-mono">-₹{totalItemDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {overallDiscountAmount > 0 && (
                  <div className="text-emerald-400">
                    Overall Discount:{' '}
                    <span className="font-mono">-₹{overallDiscountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                  {docType === 'quotation' ? 'TOTAL QUOTED AMOUNT' : 'FINAL NET PAYABLE'}
                </div>
                <div className="text-3xl font-black font-mono text-[#D4AF37]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setEditorStep('items')}
                className="min-h-[44px] px-5 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-stone-600" />
                <span>← Back to Items</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToPreview}
                className="min-h-[44px] px-8 rounded-2xl bg-[#781D22] hover:bg-[#60171B] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
              >
                <Eye className="w-4 h-4 text-[#D4AF37]" />
                <span>Preview Customer {docType === 'quotation' ? 'Quotation' : 'Bill'} →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
