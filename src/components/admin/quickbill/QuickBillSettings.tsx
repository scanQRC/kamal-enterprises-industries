import React, { useState, useEffect } from 'react';
import {
  QuickBillSettingsConfig,
  SavedMasterItem,
  WarrantyTemplate,
  BillFormat,
} from '../../../types/quickbill';
import { quickBillStorage } from '../../../services/quickBillStorage';
import {
  Save,
  Building,
  Hash,
  FileText,
  Bookmark,
  ShieldCheck,
  FileSignature,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Upload,
  RotateCcw,
} from 'lucide-react';

interface QuickBillSettingsProps {
  onSettingsUpdated: (newSettings: QuickBillSettingsConfig) => void;
}

export const QuickBillSettings: React.FC<QuickBillSettingsProps> = ({
  onSettingsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'numbering' | 'format' | 'items' | 'terms' | 'warranties' | 'signature'
  >('profile');

  const [settings, setSettings] = useState<QuickBillSettingsConfig>(() =>
    quickBillStorage.getSettings()
  );
  const [savedItems, setSavedItems] = useState<SavedMasterItem[]>([]);
  const [warrantyTemplates, setWarrantyTemplates] = useState<WarrantyTemplate[]>([]);

  // Item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemBrand, setNewItemBrand] = useState('');
  const [newItemRate, setNewItemRate] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Warranty template form state
  const [newWTitle, setNewWTitle] = useState('');
  const [newWPeriod, setNewWPeriod] = useState('');
  const [newWCovered, setNewWCovered] = useState('');
  const [newWNotCovered, setNewWNotCovered] = useState('');
  const [newWConditions, setNewWConditions] = useState('');
  const [newWMessage, setNewWMessage] = useState('');
  const [newWStyle, setNewWStyle] = useState<'seal' | 'box' | 'stamp'>('seal');

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const loadData = () => {
    setSettings(quickBillStorage.getSettings());
    setSavedItems(quickBillStorage.getSavedItems());
    setWarrantyTemplates(quickBillStorage.getWarrantyTemplates());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = (updated: QuickBillSettingsConfig) => {
    quickBillStorage.saveSettings(updated);
    setSettings(updated);
    onSettingsUpdated(updated);
    setSaveStatus('Settings successfully saved to local device.');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // Signature Upload Handler
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const updated = {
          ...settings,
          signatureDataUrl: dataUrl,
        };
        handleSaveSettings(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = () => {
    const updated = {
      ...settings,
      signatureDataUrl: null,
    };
    handleSaveSettings(updated);
  };

  // Add or update saved master item
  const handleSaveMasterItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    if (editingItemId) {
      quickBillStorage.updateItem({
        id: editingItemId,
        name: newItemName.trim(),
        brand: newItemBrand.trim() || undefined,
        defaultRate: newItemRate ? parseFloat(newItemRate) : undefined,
        createdAt: new Date().toISOString(),
      });
      setEditingItemId(null);
    } else {
      quickBillStorage.saveItem({
        name: newItemName.trim(),
        brand: newItemBrand.trim() || undefined,
        defaultRate: newItemRate ? parseFloat(newItemRate) : undefined,
      });
    }

    setNewItemName('');
    setNewItemBrand('');
    setNewItemRate('');
    setSavedItems(quickBillStorage.getSavedItems());
  };

  const handleDeleteMasterItem = (id: string) => {
    quickBillStorage.deleteItem(id);
    setSavedItems(quickBillStorage.getSavedItems());
  };

  // Save warranty template
  const handleSaveWarrantyTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWTitle.trim() || !newWPeriod.trim()) return;

    quickBillStorage.saveWarrantyTemplate({
      title: newWTitle.trim(),
      period: newWPeriod.trim(),
      covered: newWCovered.trim(),
      notCovered: newWNotCovered.trim(),
      conditions: newWConditions.trim(),
      defaultMessage: newWMessage.trim() || `${newWPeriod} warranty covered by showroom.`,
      defaultStyle: newWStyle,
    });

    setNewWTitle('');
    setNewWPeriod('');
    setNewWCovered('');
    setNewWNotCovered('');
    setNewWConditions('');
    setNewWMessage('');
    setWarrantyTemplates(quickBillStorage.getWarrantyTemplates());
  };

  const handleDeleteWarrantyTemplate = (id: string) => {
    quickBillStorage.deleteWarrantyTemplate(id);
    setWarrantyTemplates(quickBillStorage.getWarrantyTemplates());
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-lg font-bold text-stone-900 leading-tight">
            Quick Bill Settings &amp; Configuration
          </h2>
          <p className="text-xs text-stone-500">
            Customize Business Profile, numbering, default terms, templates, and signature
          </p>
        </div>

        {saveStatus && (
          <div className="p-2 px-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-stone-200 no-scrollbar text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`min-h-[40px] px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#781D22] text-white shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Business Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('numbering')}
          className={`min-h-[40px] px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'numbering'
              ? 'bg-[#781D22] text-white shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Bill Numbering</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('format')}
          className={`min-h-[40px] px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'format'
              ? 'bg-[#781D22] text-white shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Default Bill Format</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('items')}
          className={`min-h-[40px] px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'items'
              ? 'bg-[#781D22] text-white shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Items ({savedItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('warranties')}
          className={`min-h-[40px] px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'warranties'
              ? 'bg-[#781D22] text-white shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Warranty Templates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`min-h-[40px] px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'terms'
              ? 'bg-[#781D22] text-white shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Default Terms</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('signature')}
          className={`min-h-[40px] px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'signature'
              ? 'bg-[#781D22] text-white shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileSignature className="w-3.5 h-3.5" />
          <span>Authorized Signature</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. BUSINESS PROFILE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-4 max-w-2xl text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Business Name (Stationery Header)
            </label>
            <input
              type="text"
              value={settings.profile.businessName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, businessName: e.target.value },
                })
              }
              className="w-full h-10 px-3 rounded-xl border border-stone-300 font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Deals in (Product Lines)
            </label>
            <input
              type="text"
              value={settings.profile.dealsIn}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, dealsIn: e.target.value },
                })
              }
              className="w-full h-10 px-3 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Business Tagline / Subtitle
            </label>
            <input
              type="text"
              value={settings.profile.businessLine}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, businessLine: e.target.value },
                })
              }
              className="w-full h-10 px-3 rounded-xl border border-stone-300 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Store Address
            </label>
            <textarea
              rows={2}
              value={settings.profile.address}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, address: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Store Phone / Contact
            </label>
            <input
              type="text"
              value={settings.profile.contact}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, contact: e.target.value },
                })
              }
              className="w-full h-10 px-3 rounded-xl border border-stone-300 font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleSaveSettings(settings)}
              className="min-h-[44px] px-6 rounded-2xl bg-[#781D22] text-white font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:bg-[#60171B]"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DOCUMENT NUMBERING TAB (SEPARATE BILL & QUOTATION NUMBERING)            */}
      {/* ========================================================================= */}
      {activeTab === 'numbering' && (
        <div className="space-y-6 max-w-xl text-xs">
          {/* Bill Numbering Box */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Bill Numbering Sequence
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-[#781D22] font-bold">
                BILL SERIES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Bill Prefix
                </label>
                <input
                  type="text"
                  value={settings.billPrefix}
                  onChange={(e) => setSettings({ ...settings, billPrefix: e.target.value })}
                  placeholder="e.g. KCW-B-"
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 font-mono font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Next Bill Sequence Number
                </label>
                <input
                  type="number"
                  value={settings.nextBillNumber}
                  onChange={(e) =>
                    setSettings({ ...settings, nextBillNumber: parseInt(e.target.value) || 1 })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 font-mono font-bold bg-white"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Next Generated Bill Memo:</span>
              <span className="font-mono font-black text-[#781D22] text-sm">
                {settings.billPrefix}{settings.nextBillNumber.toString().padStart(4, '0')}
              </span>
            </div>
          </div>

          {/* Quotation Numbering Box */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Quotation Numbering Sequence (Independent)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#1E3A8A] font-bold">
                QUOTATION SERIES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Quotation Prefix
                </label>
                <input
                  type="text"
                  value={settings.quotationPrefix}
                  onChange={(e) => setSettings({ ...settings, quotationPrefix: e.target.value })}
                  placeholder="e.g. KCW-Q-"
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 font-mono font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Next Quotation Sequence Number
                </label>
                <input
                  type="number"
                  value={settings.nextQuotationNumber}
                  onChange={(e) =>
                    setSettings({ ...settings, nextQuotationNumber: parseInt(e.target.value) || 1 })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 font-mono font-bold bg-white"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Next Generated Quotation:</span>
              <span className="font-mono font-black text-[#1E3A8A] text-sm">
                {settings.quotationPrefix}{settings.nextQuotationNumber.toString().padStart(4, '0')}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleSaveSettings(settings)}
              className="min-h-[44px] px-6 rounded-2xl bg-[#781D22] text-white font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:bg-[#60171B]"
            >
              <Save className="w-4 h-4" />
              <span>Save Numbering Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DEFAULT BILL FORMAT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'format' && (
        <div className="space-y-4 text-xs">
          <p className="text-stone-600">
            Choose the default stationery style for newly generated customer bills.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() =>
                handleSaveSettings({ ...settings, defaultFormat: 'classic' })
              }
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                settings.defaultFormat === 'classic'
                  ? 'bg-amber-50/50 border-[#781D22] ring-2 ring-[#781D22]/20'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="font-bold text-sm text-stone-900 mb-1">1. Classic Modern</div>
              <p className="text-stone-500 text-[11px]">
                Crisp tabular lines modeled after traditional dasti/handwritten memos.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                handleSaveSettings({ ...settings, defaultFormat: 'premium' })
              }
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                settings.defaultFormat === 'premium'
                  ? 'bg-amber-50/50 border-[#781D22] ring-2 ring-[#781D22]/20'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="font-bold text-sm text-stone-900 mb-1 flex items-center gap-1.5">
                <span>2. Premium</span>
                <span className="text-[9px] bg-[#D4AF37]/20 text-[#855B14] px-1.5 py-0.2 rounded font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-stone-500 text-[11px]">
                Refined stationery typography, clean whitespace, and subtle accents.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                handleSaveSettings({ ...settings, defaultFormat: 'compact' })
              }
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                settings.defaultFormat === 'compact'
                  ? 'bg-amber-50/50 border-[#781D22] ring-2 ring-[#781D22]/20'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="font-bold text-sm text-stone-900 mb-1">3. Compact</div>
              <p className="text-stone-500 text-[11px]">
                Space-efficient receipt layout optimized for single-page counter slips.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SAVED ITEMS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'items' && (
        <div className="space-y-6 text-xs">
          {/* Add/Edit Master Item Form */}
          <form
            onSubmit={handleSaveMasterItem}
            className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 uppercase tracking-wide">
                {editingItemId ? 'Edit Saved Master Item' : 'Add New Reusable Master Item'}
              </span>
              {editingItemId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItemId(null);
                    setNewItemName('');
                    setNewItemBrand('');
                    setNewItemRate('');
                  }}
                  className="text-stone-500 hover:text-stone-800 underline"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Item Particulars *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Hero Sprint 26T MTB"
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Brand / Make (Optional)
                </label>
                <input
                  type="text"
                  value={newItemBrand}
                  onChange={(e) => setNewItemBrand(e.target.value)}
                  placeholder="e.g. Hero Cycles"
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Default Rate (₹ Optional)
                </label>
                <input
                  type="number"
                  value={newItemRate}
                  onChange={(e) => setNewItemRate(e.target.value)}
                  placeholder="7800"
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="min-h-[40px] px-5 rounded-xl bg-stone-900 text-white font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>{editingItemId ? 'Update Item' : 'Add to Reusable Items'}</span>
            </button>
          </form>

          {/* List of saved master items */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3 text-right">Default Rate</th>
                  <th className="p-3 text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {savedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="p-3 font-semibold text-stone-900">{item.name}</td>
                    <td className="p-3 text-stone-600">{item.brand || '—'}</td>
                    <td className="p-3 text-right font-mono font-bold text-stone-900">
                      {item.defaultRate ? `₹${item.defaultRate}` : '—'}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(item.id);
                            setNewItemName(item.name);
                            setNewItemBrand(item.brand || '');
                            setNewItemRate(item.defaultRate?.toString() || '');
                          }}
                          className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMasterItem(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. WARRANTY TEMPLATES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'warranties' && (
        <div className="space-y-6 text-xs">
          {/* Add Warranty Template Form */}
          <form
            onSubmit={handleSaveWarrantyTemplate}
            className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
          >
            <span className="font-bold text-stone-800 uppercase tracking-wide block">
              Create New Warranty Template
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  value={newWTitle}
                  onChange={(e) => setNewWTitle(e.target.value)}
                  placeholder="e.g. 1 Year Frame Warranty"
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Period *
                </label>
                <input
                  type="text"
                  required
                  value={newWPeriod}
                  onChange={(e) => setNewWPeriod(e.target.value)}
                  placeholder="e.g. 1 Year / 6 Months"
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Stamp Style
                </label>
                <select
                  value={newWStyle}
                  onChange={(e) => setNewWStyle(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="seal">1. Classic Seal</option>
                  <option value="box">2. Rectangular Box</option>
                  <option value="stamp">3. Compact Stamp</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  What is Covered
                </label>
                <input
                  type="text"
                  value={newWCovered}
                  onChange={(e) => setNewWCovered(e.target.value)}
                  placeholder="e.g. Frame cracks, rigid fork weld defects"
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  What is Not Covered
                </label>
                <input
                  type="text"
                  value={newWNotCovered}
                  onChange={(e) => setNewWNotCovered(e.target.value)}
                  placeholder="e.g. Tires, tubes, rough usage"
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Guarantee Message
              </label>
              <input
                type="text"
                value={newWMessage}
                onChange={(e) => setNewWMessage(e.target.value)}
                placeholder="Message printed inside warranty stamp"
                className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-white"
              />
            </div>

            <button
              type="submit"
              className="min-h-[40px] px-5 rounded-xl bg-stone-900 text-white font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Save Warranty Template</span>
            </button>
          </form>

          {/* List of templates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {warrantyTemplates.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{t.title}</span>
                  <span className="text-[10px] font-extrabold bg-[#781D22] text-white px-2 py-0.5 rounded uppercase">
                    {t.period}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">{t.defaultMessage}</p>
                <div className="pt-2 flex justify-between items-center text-[10px] text-stone-400">
                  <span>Style: {t.defaultStyle.toUpperCase()}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteWarrantyTemplate(t.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DEFAULT TERMS TAB (BILL & QUOTATION SPECIFIC TERMS)                    */}
      {/* ========================================================================= */}
      {activeTab === 'terms' && (
        <div className="space-y-6 max-w-xl text-xs">
          {/* Default Bill Terms */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <label className="block text-[11px] font-bold text-stone-900 uppercase tracking-wider">
                Default Bill Terms &amp; Conditions (One per line)
              </label>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-[#781D22] font-bold">
                BILL TERMS
              </span>
            </div>
            <textarea
              rows={4}
              value={settings.defaultBillTerms.join('\n')}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultBillTerms: e.target.value.split('\n').filter((t) => t.trim()),
                })
              }
              className="w-full p-3 rounded-xl border border-stone-300 font-medium bg-white"
            />
          </div>

          {/* Default Quotation Terms */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <label className="block text-[11px] font-bold text-stone-900 uppercase tracking-wider">
                Default Quotation Terms &amp; Conditions (One per line)
              </label>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#1E3A8A] font-bold">
                QUOTATION TERMS
              </span>
            </div>
            <textarea
              rows={4}
              value={settings.defaultQuotationTerms.join('\n')}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultQuotationTerms: e.target.value.split('\n').filter((t) => t.trim()),
                })
              }
              className="w-full p-3 rounded-xl border border-stone-300 font-medium bg-white"
            />

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Default Quotation Validity Period (Days)
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={settings.defaultQuotationValidityDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultQuotationValidityDays: parseInt(e.target.value) || 7,
                  })
                }
                className="w-32 h-10 px-3 rounded-xl border border-stone-300 font-bold bg-white"
              />
              <span className="text-stone-500 text-[11px] ml-2">days from issue date</span>
            </div>
          </div>

          {/* Print E. & O. E. */}
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-stone-50 border border-stone-200">
            <input
              type="checkbox"
              checked={settings.includeEandOE}
              onChange={(e) =>
                setSettings({ ...settings, includeEandOE: e.target.checked })
              }
              className="w-4 h-4 rounded text-[#781D22]"
            />
            <span className="font-semibold text-stone-800">
              Print "E. &amp; O. E. (Errors &amp; Omissions Excepted)" on Customer Documents
            </span>
          </label>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleSaveSettings(settings)}
              className="min-h-[44px] px-6 rounded-2xl bg-[#781D22] text-white font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:bg-[#60171B]"
            >
              <Save className="w-4 h-4" />
              <span>Save Default Terms</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. AUTHORIZED SIGNATURE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'signature' && (
        <div className="space-y-4 max-w-md text-xs">
          <p className="text-stone-600 leading-relaxed">
            Upload the shop's authorized signatory once. It will be stored locally on this device and can be placed automatically onto customer bills.
          </p>

          {settings.signatureDataUrl ? (
            <div className="p-4 rounded-2xl border border-stone-300 bg-stone-50 text-center space-y-3">
              <div className="p-3 bg-white rounded-xl border border-stone-200 inline-block shadow-2xs">
                <img
                  src={settings.signatureDataUrl}
                  alt="Stored Authorized Signature"
                  className="h-16 max-w-[200px] object-contain mx-auto"
                />
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Active Stored Signature · Kamal Cycle World
              </p>
              <div>
                <button
                  type="button"
                  onClick={handleRemoveSignature}
                  className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold cursor-pointer"
                >
                  Remove Stored Signature
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed border-stone-300 rounded-3xl text-center space-y-3">
              <FileSignature className="w-8 h-8 text-stone-400 mx-auto" />
              <div>
                <span className="font-bold text-stone-800 block">No Signature Uploaded</span>
                <span className="text-[11px] text-stone-500">
                  Select a PNG, JPEG, or WebP image of your signature stamp
                </span>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white font-bold cursor-pointer shadow-xs hover:bg-stone-800">
                <Upload className="w-4 h-4 text-[#D4AF37]" />
                <span>Upload Signature Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
