import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Wrench,
  FileText,
  Search,
  ScanLine,
  Users,
  Building2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Clock,
  Printer,
  ChevronRight,
  Filter,
  DollarSign,
  Shield,
  Upload,
  Layers,
  ArrowRight,
  Bike,
  Flame,
  ChefHat,
  Baby,
  Truck,
  Settings,
  Bell,
  Check,
  PackagePlus,
  Receipt,
  Camera,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FIRMS, REPAIR_JOBS, TALLY_BATCHES, SUPPLIERS, AUTHORISED_USERS } from '../../data/mockData';
import { FirmId, Product, Sale } from '../../types';
import { KamalLogo } from '../common/KamalLogo';
import { QuickActionGrid } from './QuickActionGrid';

// ==========================================
// 1. DASHBOARD MODULE (Mobile-First Business Dashboard)
// ==========================================
export const DashboardModule: React.FC = () => {
  const {
    adminFirm,
    currentUser,
    setActiveAdminModule,
    products,
    productStocks,
    ocrDrafts,
    recentSales,
    setIsScannerOpen,
    setIsBillUploadOpen,
    setIsAddProductOpen,
  } = useApp();

  const firm = FIRMS[adminFirm];
  const isEnterprises = adminFirm === 'kamal-enterprises';

  // Live isolated calculations
  const firmProducts = products.filter((p) => p.applicableFirms.includes(adminFirm));
  const firmStocks = productStocks.filter((s) => s.firmId === adminFirm);
  const totalStockUnits = firmStocks.reduce((acc, s) => acc + s.currentStock, 0);

  const firmSales = recentSales.filter((s) => s.firmId === adminFirm);
  const todaySalesTotal = firmSales.reduce((acc, s) => acc + s.grandTotal, 0);

  const firmDrafts = ocrDrafts.filter((d) => d.firmId === adminFirm);
  const pendingBillReviews = firmDrafts.filter(
    (d) => d.status === 'review_required' || d.status === 'draft'
  ).length;

  const firmRepairs = REPAIR_JOBS.filter((r) => r.firmId === adminFirm);
  const openRepairs = firmRepairs.filter((r) => r.status !== 'delivered').length;

  // Estimated today's purchase total from approved invoices
  const approvedPurchases = firmDrafts.filter((d) => d.status === 'approved');
  const todayPurchaseTotal = approvedPurchases.reduce((acc, d) => acc + d.extractedTotal, 48200);

  return (
    <div className="space-y-5 sm:space-y-6 text-left pb-6">
      {/* ======================================================== */}
      {/* TOP HEADER: Firm Branding, Title, Admin Profile, Notifications */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Branding & Title */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="shrink-0 pt-0.5">
            <KamalLogo
              size="sm"
              variant={isEnterprises ? 'red' : 'navy'}
              showSubtitle={true}
              subtitleText={firm.shortName.toUpperCase()}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isEnterprises
                    ? 'bg-[#781D22]/10 text-[#781D22]'
                    : 'bg-stone-900/10 text-stone-900'
                }`}
              >
                {firm.name}
              </span>
              <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                GSTIN: {firm.gstin}
              </span>
            </div>
            <h1 className="mt-1 text-lg sm:text-2xl font-serif font-bold text-stone-900 tracking-tight leading-snug">
              Operational Management Dashboard
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Live floor stock, counter POS billing, bill imports, and camera barcode verification.
            </p>
          </div>
        </div>

        {/* Right: Admin Profile & Notifications */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 text-stone-800 font-bold flex items-center justify-center text-xs">
              {currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-stone-900 block truncate max-w-[130px]">
                {currentUser?.name || 'Authorized Admin'}
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">
                {currentUser?.email || 'admin@kamalbusiness.com'}
              </span>
            </div>
          </div>

          {/* Notifications Chip */}
          <button
            onClick={() => setIsBillUploadOpen(true)}
            type="button"
            title="Pending Bill Reviews"
            className="relative p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {pendingBillReviews > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {pendingBillReviews}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUMMARY CHIPS / CARDS: Today's Sales, Purchase, Stock, Pending Reviews */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Today's Sales */}
        <button
          onClick={() => setActiveAdminModule('sale-billing')}
          type="button"
          className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer group active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span className="font-semibold text-stone-600">Today's Sales</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tabular-nums">
            ₹{todaySalesTotal.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <span>{firmSales.length} counter invoices</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* 2. Today's Purchase */}
        <button
          onClick={() => setActiveAdminModule('purchase-ocr')}
          type="button"
          className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer group active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span className="font-semibold text-stone-600">Today's Purchase</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tabular-nums">
            ₹{todayPurchaseTotal.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-1 flex items-center gap-1">
            <span>{approvedPurchases.length} approved invoices</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* 3. Stock Items */}
        <button
          onClick={() => setActiveAdminModule('stock-search')}
          type="button"
          className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer group active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span className="font-semibold text-stone-600">Stock Items</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tabular-nums">
            {totalStockUnits} units
          </div>
          <div className="text-[11px] text-purple-700 font-medium mt-1 flex items-center gap-1">
            <span>{firmProducts.length} registered products</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* 4. Pending Bill Reviews */}
        <button
          onClick={() => setIsBillUploadOpen(true)}
          type="button"
          className={`p-4 rounded-2xl border shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer group active:scale-[0.98] ${
            pendingBillReviews > 0
              ? 'bg-amber-50/80 border-amber-200/90'
              : 'bg-white border-stone-200'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span className="font-semibold text-stone-800">Pending Bill Reviews</span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                pendingBillReviews > 0 ? 'bg-amber-200 text-amber-900' : 'bg-stone-100 text-stone-500'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-xl sm:text-2xl font-serif font-bold tabular-nums ${
              pendingBillReviews > 0 ? 'text-amber-900' : 'text-stone-900'
            }`}
          >
            {pendingBillReviews} Pending
          </div>
          <div className="text-[11px] font-bold text-amber-800 mt-1 flex items-center gap-1">
            <span>{pendingBillReviews > 0 ? 'Click to Review OCR Bills' : 'All Bills Verified'}</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* ======================================================== */}
      {/* QUICK ACTION GRID (Requirement 1: 2-column mobile grid of clickable chips) */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-6 rounded-3xl bg-stone-50/80 border border-stone-200">
        <QuickActionGrid />
      </div>

      {/* ======================================================== */}
      {/* RECENT OPERATIONAL SNAPSHOT */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Recent Invoices */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Recent Invoices ({firm.shortName})
              </h3>
            </div>
            <button
              onClick={() => setActiveAdminModule('sale-billing')}
              className="text-xs font-semibold text-[#781D22] hover:underline cursor-pointer"
            >
              Billing Workstation &rarr;
            </button>
          </div>
          <div className="mt-3 divide-y divide-stone-100 text-xs">
            {firmSales.length === 0 ? (
              <p className="py-4 text-stone-400 italic">No sales recorded yet for this session.</p>
            ) : (
              firmSales.slice(0, 4).map((sale) => (
                <div key={sale.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-stone-800">{sale.invoiceNo}</span>
                    <p className="text-[11px] text-stone-500">
                      {sale.customerName} · {sale.items.length} item(s) via {sale.paymentMode.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-stone-900 tabular-nums">
                      ₹{sale.grandTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-stone-400 block">{sale.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Workshop Repair Jobs */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#781D22]" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Workshop Job Cards
              </h3>
            </div>
            <button
              onClick={() => setActiveAdminModule('repair-service')}
              className="text-xs font-semibold text-[#781D22] hover:underline cursor-pointer"
            >
              View Service &rarr;
            </button>
          </div>
          <div className="mt-3 space-y-2.5 text-xs">
            {firmRepairs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-stone-800 text-[11px]">
                    {job.jobCardNo}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-sm font-semibold ${
                      job.status === 'ready'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {job.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 font-bold text-stone-900">{job.brandModel}</p>
                <div className="mt-1.5 text-[10px] text-stone-500 flex items-center justify-between">
                  <span>Customer: {job.customerName}</span>
                  <span className="font-bold text-stone-800">Est: ₹{job.totalCost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. STOCK SEARCH MODULE (Fast Stock Engine)
// ==========================================
export const StockSearchModule: React.FC<{ categoryScope?: string; title?: string }> = ({
  categoryScope,
  title = 'Fast Stock Search Engine',
}) => {
  const { adminFirm, products, productStocks, adjustStock, setIsScannerOpen, setIsAddProductOpen } =
    useApp();
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');

  const firm = FIRMS[adminFirm];

  const filtered = products.filter((p) => {
    if (!p.applicableFirms.includes(adminFirm)) return false;
    if (categoryScope && categoryScope !== 'all') {
      if (
        categoryScope === 'bicycles' &&
        !p.categoryId.includes('bike') &&
        !p.categoryId.includes('mtb') &&
        !p.categoryId.includes('high-end')
      ) {
        return false;
      }
      if (
        categoryScope === 'kids' &&
        !p.categoryId.includes('kid') &&
        !p.categoryId.includes('tri-cycles') &&
        !p.categoryId.includes('prams')
      ) {
        return false;
      }
      if (
        categoryScope === 'appliances' &&
        !p.categoryId.includes('gas') &&
        !p.categoryId.includes('appliance')
      ) {
        return false;
      }
      if (categoryScope === 'cookware' && !p.categoryId.includes('cookware')) {
        return false;
      }
      if (categoryScope === 'accessories' && !p.categoryId.includes('accessories')) {
        return false;
      }
    }
    if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.categoryId.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 text-left">
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">{title}</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Locate items for {firm.name} by Product Name, Barcode, SKU, Brand, or Category.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              type="button"
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-amber-200"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Camera Scan</span>
            </button>
            <button
              onClick={() => setIsAddProductOpen(true)}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type Product Name, EAN-13 Barcode, SKU or Model..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 text-xs font-medium focus:outline-hidden focus:border-stone-900 bg-stone-50/50"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-700">
            {filtered.length} products found in {firm.shortName}
          </span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-[#781D22] font-semibold hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Barcode &amp; SKU</th>
                <th className="py-3 px-4 text-center">Floor Stock</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-center">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => {
                const stockRec = productStocks.find(
                  (s) => s.productId === item.id && s.firmId === adminFirm
                );
                const currentStock = stockRec?.currentStock ?? 0;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/60">
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 block">{item.name}</span>
                      <span className="text-[11px] text-stone-500">
                        {item.brand} · Category: {item.categoryId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-700">
                      <span className="block font-bold">{item.barcode}</span>
                      <span className="text-stone-400">{item.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full font-bold tabular-nums text-xs ${
                          currentStock > 4
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {currentStock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-stone-900 tabular-nums">
                      ₹{item.indicativePrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => adjustStock(item.id, adminFirm, 1)}
                          title="Add 1 unit to stock"
                          className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 font-bold text-stone-800"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => adjustStock(item.id, adminFirm, -1)}
                          disabled={currentStock <= 0}
                          title="Deduct 1 unit from stock"
                          className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 font-bold text-stone-800 disabled:opacity-30"
                        >
                          -1
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. PURCHASE & OCR DRAFTS MODULE (Add Purchase)
// ==========================================
export const PurchaseOCRModule: React.FC = () => {
  const {
    adminFirm,
    ocrDrafts,
    setIsBillUploadOpen,
    openScanner,
  } = useApp();
  const firm = FIRMS[adminFirm];

  const firmDrafts = ocrDrafts.filter((d) => d.firmId === adminFirm);

  return (
    <div className="space-y-5 text-left">
      {/* Title */}
      <div>
        <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
          Add Purchase &amp; Bill Verification ({firm.shortName})
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Strict Mandate: All supplier bills require human verification before inventory is credited.
        </p>
      </div>

      {/* ======================================================== */}
      {/* G, W. PROMINENT BILL / INVOICE SECTION (App-Like Touch Grid) */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">
            BILL / INVOICE CAPTURE
          </span>
          <span className="text-[11px] text-stone-400 font-medium">
            Tap an action below to start
          </span>
        </div>

        {/* 4 Large Mobile Touch Cards (Requirement W) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* 1. Take Photo (Requirement H) */}
          <button
            onClick={() => setIsBillUploadOpen(true)}
            type="button"
            className="p-4 rounded-2xl border-2 border-stone-200 hover:border-[#781D22] hover:bg-rose-50/40 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer group active:scale-[0.98] shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#781D22] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-stone-900 block group-hover:text-[#781D22]">
                Take Photo
              </span>
              <span className="text-[10px] text-stone-500">Document Frame</span>
            </div>
          </button>

          {/* 2. Gallery (Requirement I) */}
          <button
            onClick={() => setIsBillUploadOpen(true)}
            type="button"
            className="p-4 rounded-2xl border-2 border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer group active:scale-[0.98] shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-stone-900 block group-hover:text-stone-950">
                Gallery
              </span>
              <span className="text-[10px] text-stone-500">JPG, PNG, WebP</span>
            </div>
          </button>

          {/* 3. PDF (Requirement J) */}
          <button
            onClick={() => setIsBillUploadOpen(true)}
            type="button"
            className="p-4 rounded-2xl border-2 border-stone-200 hover:border-blue-700 hover:bg-blue-50/40 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer group active:scale-[0.98] shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-stone-900 block group-hover:text-blue-900">
                PDF Document
              </span>
              <span className="text-[10px] text-stone-500">Multi-page Invoices</span>
            </div>
          </button>

          {/* 4. Scan Item (Requirement T) */}
          <button
            onClick={() => openScanner('BARCODE', undefined, 'Purchase Item Barcode Scanner')}
            type="button"
            className="p-4 rounded-2xl border-2 border-stone-200 hover:border-amber-600 hover:bg-amber-50/40 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer group active:scale-[0.98] shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ScanLine className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-stone-900 block group-hover:text-amber-900">
                Scan Item
              </span>
              <span className="text-[10px] text-stone-500">Barcode Finder</span>
            </div>
          </button>
        </div>

        {/* S. Add Purchase Without Bill fallback */}
        <div className="pt-2 text-center border-t border-stone-100">
          <button
            onClick={() => setIsBillUploadOpen(true)}
            type="button"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline cursor-pointer"
          >
            + Add Purchase Without Bill (Manual Entry · No Bill Attached)
          </button>
        </div>
      </div>

      {/* Purchase Bills & Drafts List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Supplier Invoices &amp; Drafts ({firmDrafts.length})
          </h3>
          <span className="text-[11px] text-stone-400">
            {firmDrafts.filter((d) => d.status === 'approved').length} Approved ·{' '}
            {firmDrafts.filter((d) => d.status !== 'approved').length} Pending Review
          </span>
        </div>

        <div className="space-y-3">
          {firmDrafts.map((draft) => (
            <div
              key={draft.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-800">
                    {draft.extractedInvoiceNo}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase ${
                      draft.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {draft.status.replace('_', ' ')}
                  </span>
                  {draft.isLowQualitySource && (
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-rose-100 text-rose-800 font-bold uppercase">
                      Low Quality Source
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-stone-900 mt-1">
                  Supplier: {draft.extractedSupplier}
                </h4>
                <p className="text-xs text-stone-500">
                  File: {draft.originalFileName} · Date: {draft.extractedDate} · Total: ₹
                  {draft.extractedTotal.toLocaleString('en-IN')}
                </p>
                {draft.approvedBy && (
                  <p className="text-[10px] text-emerald-700 font-medium mt-1">
                    ✓ Approved by {draft.approvedBy} on {draft.approvedAt}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBillUploadOpen(true)}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer shadow-xs"
                >
                  {draft.status === 'approved' ? 'View Bill & Audit Trail' : 'Review & Approve Bill'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. SALE / BILLING MODULE (with Barcode Scan Workflow)
// ==========================================
export const SaleBillingModule: React.FC = () => {
  const { adminFirm, products, addSaleInvoice, setIsScannerOpen, openScanner, setActiveAdminModule } = useApp();
  const firm = FIRMS[adminFirm];

  const [cart, setCart] = useState<
    Array<{
      productId: string;
      name: string;
      barcode: string;
      qty: number;
      price: number;
      discount: number;
    }>
  >([
    {
      productId: 'prod-001',
      name: 'Avon Element 26T Hybrid Bicycle',
      barcode: '8901234500018',
      qty: 1,
      price: 7299,
      discount: 300,
    },
  ]);

  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanNotice, setScanNotice] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('Pradip Trivedi');
  const [customerPhone, setCustomerPhone] = useState('+91 99060 44331');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card'>('upi');
  const [invoiceSuccess, setInvoiceSuccess] = useState<string | null>(null);

  // Workflow (Requirement 7): Scanning an existing product barcode adds/finds that product.
  // If scanned again, increment quantity.
  const handleBarcodeSubmit = (codeToScan?: string) => {
    const code = (codeToScan || barcodeInput).trim();
    if (!code) return;

    // Search product
    const prod = products.find(
      (p) => p.barcode === code && p.applicableFirms.includes(adminFirm)
    );

    if (prod) {
      setCart((prev) => {
        const existingIdx = prev.findIndex((item) => item.productId === prod.id);
        if (existingIdx >= 0) {
          // Increment quantity
          const updated = [...prev];
          updated[existingIdx].qty += 1;
          return updated;
        } else {
          // Add new item
          return [
            ...prev,
            {
              productId: prod.id,
              name: prod.name,
              barcode: prod.barcode,
              qty: 1,
              price: prod.indicativePrice,
              discount: 0,
            },
          ];
        }
      });
      setScanNotice(`✓ Added "${prod.name}" (Barcode: ${code})`);
      setBarcodeInput('');
    } else {
      setScanNotice(`⚠️ Barcode ${code} not found under ${firm.shortName}`);
    }

    setTimeout(() => setScanNotice(null), 3000);
  };

  const handleUpdateQty = (idx: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, i) => (i === idx ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemove = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const subtotal = cart.reduce((acc, c) => acc + c.qty * c.price, 0);
  const discountTotal = cart.reduce((acc, c) => acc + c.discount, 0);
  const grandTotal = subtotal - discountTotal;

  const handleFinalizeBill = () => {
    if (cart.length === 0) {
      alert('Cannot finalize an empty cart.');
      return;
    }

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      firmId: adminFirm,
      invoiceNo: `${firm.id === 'kamal-enterprises' ? 'KE' : 'KI'}-INV-${Date.now().toString().slice(-6)}`,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '+91 99060 00000',
      items: cart.map((c) => ({
        id: `sitem-${Date.now()}-${c.productId}`,
        productId: c.productId,
        productName: c.name,
        quantity: c.qty,
        unitPrice: c.price,
        discount: c.discount,
        taxPercent: 12,
        total: c.qty * c.price - c.discount,
      })),
      paymentMode,
      subtotal,
      discountTotal,
      grandTotal,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tallyStatus: 'pending',
    };

    addSaleInvoice(newSale);
    setInvoiceSuccess(`Invoice ${newSale.invoiceNo} generated & printed! Stock updated.`);
    setCart([]);
    setTimeout(() => setInvoiceSuccess(null), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 text-left">
      {/* Left: Billing Workstation */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-stone-400">
                POS Billing Workstation
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Counter Sale Invoice ({firm.shortName})
              </h3>
            </div>
            <span className="font-mono text-xs font-semibold text-stone-600">
              Series: {firm.id === 'kamal-enterprises' ? 'KE-INV-26' : 'KI-INV-26'}
            </span>
          </div>

          {/* Quick Bill Offline Memo Link Banner */}
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#781D22] shrink-0" />
              <span className="text-stone-800 font-medium">
                Looking for <strong>Quick / Dasti Customer Bill</strong> (Kamal Cycle World standalone offline memo)?
              </span>
            </div>
            <button
              onClick={() => setActiveAdminModule('quick-bill')}
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-[#781D22] hover:bg-[#60171B] text-white font-bold text-xs cursor-pointer shadow-2xs transition-colors shrink-0"
            >
              Open Quick Bill →
            </button>
          </div>

          {/* Barcode Fast-Entry Bar (Requirement 7) */}
          <div className="mt-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <label className="block text-[11px] font-bold text-stone-700 uppercase">
              Barcode / SKU Fast-Scanner
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSubmit()}
                placeholder="Scan or enter barcode (e.g. 8901234500018)..."
                className="flex-1 px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs bg-white"
              />
              <button
                onClick={() => handleBarcodeSubmit()}
                type="button"
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer"
              >
                Add Item
              </button>
              <button
                onClick={() =>
                  openScanner(
                    'BARCODE',
                    (res: { code: string }) => handleBarcodeSubmit(res.code),
                    'Billing Barcode Scanner'
                  )
                }
                type="button"
                title="Open Camera Scanner"
                className="px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Camera</span>
              </button>
            </div>

            {scanNotice && (
              <div className="text-xs font-semibold text-emerald-800 animate-in fade-in">
                {scanNotice}
              </div>
            )}
          </div>

          {/* Cart Items Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Unit Price</th>
                  <th className="py-2.5 px-2 text-right">Discount</th>
                  <th className="py-2.5 px-2 text-right">Line Total</th>
                  <th className="py-2.5 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-stone-400 italic">
                      Cart is empty. Scan an EAN-13 barcode or use the fast entry bar above.
                    </td>
                  </tr>
                ) : (
                  cart.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-stone-900 block">{item.name}</span>
                        <span className="font-mono text-[10px] text-stone-400">{item.barcode}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleUpdateQty(idx, -1)}
                            className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold">{item.qty}</span>
                          <button
                            onClick={() => handleUpdateQty(idx, 1)}
                            className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right tabular-nums">₹{item.price}</td>
                      <td className="py-2.5 px-2 text-right tabular-nums text-stone-500">
                        ₹{item.discount}
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold tabular-nums text-stone-900">
                        ₹{item.qty * item.price - item.discount}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => handleRemove(idx)}
                          className="text-stone-400 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right: Payment & Finalize */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100">
            Payment &amp; Finalization
          </h4>

          {invoiceSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold text-center animate-in fade-in">
              ✓ {invoiceSuccess}
            </div>
          )}

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Gross Subtotal:</span>
              <span className="tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Discounts:</span>
              <span className="tabular-nums">-₹{discountTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-stone-100 flex justify-between text-base font-serif font-bold text-stone-900">
              <span>Grand Total:</span>
              <span className="tabular-nums">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <label className="block text-[11px] font-bold text-stone-600 uppercase mb-2">
              Payment Mode
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['upi', 'cash', 'card'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMode(m)}
                  type="button"
                  className={`py-2 rounded-xl border font-bold uppercase cursor-pointer ${
                    paymentMode === m
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleFinalizeBill}
          type="button"
          disabled={cart.length === 0}
          className="mt-6 w-full py-3.5 rounded-xl bg-[#781D22] text-white text-xs font-bold hover:bg-[#62161b] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-40"
        >
          <Printer className="w-4 h-4 text-[#D4AF37]" />
          <span>Finalize &amp; Print Counter Bill</span>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 5. BARCODE SCAN MODULE (In-page trigger)
// ==========================================
export const BarcodeScanModule: React.FC = () => {
  const { openScanner } = useApp();
  return (
    <div className="max-w-xl mx-auto py-8 text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
        <ScanLine className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-stone-900">Universal Camera Scanner</h3>
      <p className="text-xs text-stone-500 max-w-sm mx-auto">
        Activate the camera to scan product barcodes, verify stock, or read QR codes.
      </p>
      <button
        onClick={() => openScanner('CHOICE')}
        type="button"
        className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
      >
        Open Dedicated Scanner (QR / Barcode)
      </button>
    </div>
  );
};

// Export remaining modules unchanged
export {
  RepairServiceModule,
  TallySyncModule,
  SuppliersModule,
  ReportsModule,
  UsersRolesModule,
  SettingsModule,
} from './AdminModulesPart2';
