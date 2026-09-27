import React, { useState, useEffect } from 'react';
import { PackagePlus, X, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FIRMS } from '../../data/mockData';
import { Product } from '../../types';

export const AddProductModal: React.FC = () => {
  const {
    isAddProductOpen,
    setIsAddProductOpen,
    prefilledBarcode,
    setPrefilledBarcode,
    adminFirm,
    addProduct,
  } = useApp();

  const firm = FIRMS[adminFirm];

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Atlas Pro Series');
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('bicycles');
  const [mrp, setMrp] = useState<number>(8500);
  const [sellingPrice, setSellingPrice] = useState<number>(7200);
  const [initialStock, setInitialStock] = useState<number>(6);
  const [subtitle, setSubtitle] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledBarcode) {
      setBarcode(prefilledBarcode);
      setSku(`SKU-${prefilledBarcode.slice(-5)}`);
    } else {
      setBarcode(`890${Date.now().toString().slice(-10)}`);
      setSku(`SKU-${Date.now().toString().slice(-5)}`);
    }
  }, [prefilledBarcode, isAddProductOpen]);

  const handleClose = () => {
    setIsAddProductOpen(false);
    setPrefilledBarcode('');
    setName('');
    setSuccessMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-5)}`,
      barcode: barcode.trim(),
      name: name.trim(),
      brand: brand.trim(),
      categoryId: categoryId,
      applicableFirms: [adminFirm],
      subtitle: subtitle.trim() || 'Verified inventory item',
      description: `Registered under ${firm.name} inventory catalog.`,
      specifications: { RegisteredBy: 'Admin', Firm: firm.shortName },
      mrp: Number(mrp),
      indicativePrice: Number(sellingPrice),
      warrantyMonths: 12,
      rating: 4.8,
      reviewCount: 0,
      features: ['Genuine showroom stock', 'Full warranty support'],
    };

    addProduct(newProduct, Number(initialStock));
    setSuccessMsg(`✓ Product "${newProduct.name}" added to ${firm.name} with ${initialStock} units!`);

    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  if (!isAddProductOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <PackagePlus className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 leading-tight">
                Add New Master Product ({firm.shortName})
              </h3>
              <p className="text-[11px] text-stone-500">Manual Catalogue Entry</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="w-8 h-8 rounded-full hover:bg-stone-200/70 flex items-center justify-center text-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs text-left">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 font-semibold text-center animate-in fade-in">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Product Full Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Hero Sprint Pro 26T Mountain Bike"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold focus:outline-hidden focus:border-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Brand</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
              >
                <option value="bicycles">Bicycles</option>
                <option value="accessories">Cycling Accessories</option>
                <option value="tri-cycles">Tri-cycles &amp; Kids</option>
                <option value="appliances">Home Appliances</option>
                <option value="cookware">Cookware</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Barcode (Pre-filled from Scan) *
              </label>
              <input
                type="text"
                required
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold bg-amber-50/50"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Stock SKU *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">MRP (₹)</label>
              <input
                type="number"
                min="0"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 tabular-nums"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Sale Price (₹)</label>
              <input
                type="number"
                min="0"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Initial Qty</label>
              <input
                type="number"
                min="0"
                value={initialStock}
                onChange={(e) => setInitialStock(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold tabular-nums text-emerald-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Short Description / Subtitle
            </label>
            <input
              type="text"
              placeholder="e.g. 21-Speed Alloy Hybrid with Disc Brakes"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-600"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 cursor-pointer shadow-xs"
            >
              Save Product &amp; Set Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
