import React, { useState } from 'react';
import {
  LayoutDashboard,
  Search,
  Package,
  Receipt,
  ScanLine,
  Wrench,
  Truck,
  BarChart3,
  RefreshCw,
  Users,
  Settings,
  LogOut,
  Building2,
  ChevronDown,
  ArrowLeft,
  Menu,
  X,
  Bike,
  Baby,
  Flame,
  ChefHat,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FIRMS } from '../../data/mockData';
import { FirmId } from '../../types';
import { KamalLogo } from '../common/KamalLogo';
import {
  DashboardModule,
  StockSearchModule,
  PurchaseOCRModule,
  SaleBillingModule,
  BarcodeScanModule,
  RepairServiceModule,
  TallySyncModule,
  SuppliersModule,
  ReportsModule,
  UsersRolesModule,
  SettingsModule,
} from './AdminModules';
import { CustomersModule } from './AdminModulesPart2';
import { UniversalScannerModal } from './UniversalScannerModal';
import { BillUploadModal } from './BillUploadModal';
import { AddProductModal } from './AddProductModal';
import { QuickBillModule } from './quickbill/QuickBillModule';

export const AdminLayout: React.FC = () => {
  const {
    currentUser,
    adminFirm,
    setAdminFirm,
    activeAdminModule,
    setActiveAdminModule,
    logout,
    navigateToHome,
  } = useApp();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [firmDropdownOpen, setFirmDropdownOpen] = useState(false);

  // STRICT PRIVATE PROTECTION: If unauthenticated, never render AdminLayout
  if (!currentUser) {
    return null;
  }

  const firm = FIRMS[adminFirm];
  const isEnterprises = adminFirm === 'kamal-enterprises';
  const isSuperAdmin = currentUser?.allowedFirms.length === 2;

  // Operational priority items (common to both firms)
  const operationalItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quick-bill', label: 'Quick Bill (Offline)', icon: Receipt },
    { id: 'stock-search', label: 'Stock Search', icon: Search },
    { id: 'barcode-scan', label: 'Barcode Scan', icon: ScanLine },
    { id: 'sale-billing', label: 'Sale / Billing', icon: Receipt },
    { id: 'purchase-ocr', label: 'Purchase (OCR)', icon: Receipt },
    { id: 'repair-service', label: isEnterprises ? 'Service & Repair' : 'Service & Assembly', icon: Wrench },
    { id: 'tally-sync', label: 'Tally Sync', icon: RefreshCw },
  ];

  // Firm-specific product & category management items
  const enterprisesCategoryItems = [
    { id: 'products', label: 'Products (All)', icon: Package },
    { id: 'ent-bicycles', label: 'Bicycles (Kids & Adults)', icon: Bike },
    { id: 'ent-accessories', label: 'Cycling Accessories', icon: ShoppingBag },
    { id: 'ent-kids', label: 'Kids Products (Walkers/Prams)', icon: Baby },
    { id: 'ent-appliances', label: 'Home Appliances', icon: Flame },
    { id: 'ent-gas-stoves', label: 'Gas Stoves', icon: Flame },
    { id: 'ent-cookware', label: 'Cookware', icon: ChefHat },
  ];

  const industriesCategoryItems = [
    { id: 'products', label: 'Products (All)', icon: Package },
    { id: 'ind-bicycles', label: 'Bicycles – All Types', icon: Bike },
    { id: 'ind-accessories', label: 'Cycling Accessories', icon: ShoppingBag },
  ];

  const secondaryItems = [
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'users-roles', label: 'Users & Roles', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const categoryItems = isEnterprises ? enterprisesCategoryItems : industriesCategoryItems;

  const handleModuleSelect = (id: string) => {
    setActiveAdminModule(id);
    setMobileDrawerOpen(false);
  };

  const handleSwitchFirm = (target: FirmId) => {
    setAdminFirm(target);
    setActiveAdminModule('dashboard');
    setFirmDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col">
      {/* Top Operational Bar */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isEnterprises
            ? 'bg-[#FAF8F5]/95 border-[#781D22]/20'
            : 'bg-[#FAF8F5]/95 border-stone-300'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
          {/* Left: Brand & Firm Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              type="button"
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-stone-600 hover:bg-stone-200/50 cursor-pointer"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Central Reusable Logo Placeholder */}
            <div className="flex items-center">
              <KamalLogo
                size="sm"
                variant="light"
                showSubtitle={true}
                subtitleText={firm.shortName.toUpperCase()}
              />
            </div>

            {/* Sibling Firm Switcher / Badge */}
            <div className="relative ml-2 sm:ml-4">
              {isSuperAdmin ? (
                <button
                  onClick={() => setFirmDropdownOpen(!firmDropdownOpen)}
                  type="button"
                  className={`min-h-[40px] px-3 py-1 text-xs font-semibold rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    isEnterprises
                      ? 'bg-[#781D22]/10 border-[#781D22]/30 text-[#781D22]'
                      : 'bg-stone-900/10 border-stone-800/30 text-stone-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{firm.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
              ) : (
                <div
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 ${
                    isEnterprises
                      ? 'bg-[#781D22]/10 border-[#781D22]/30 text-[#781D22]'
                      : 'bg-stone-900/10 border-stone-800/30 text-stone-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{firm.name}</span>
                </div>
              )}

              {/* Dropdown for multi-firm access */}
              {firmDropdownOpen && isSuperAdmin && (
                <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-white border border-stone-200 shadow-xl py-2 z-50 text-left animate-in fade-in">
                  <div className="px-3.5 py-1.5 text-[10px] uppercase font-semibold text-stone-400 border-b border-stone-100">
                    Switch Operational Context
                  </div>
                  <button
                    onClick={() => handleSwitchFirm('kamal-enterprises')}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between cursor-pointer ${
                      adminFirm === 'kamal-enterprises'
                        ? 'bg-[#781D22]/10 text-[#781D22] font-semibold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>Kamal Enterprises</span>
                    {adminFirm === 'kamal-enterprises' && <span>✓</span>}
                  </button>
                  <button
                    onClick={() => handleSwitchFirm('kamal-industries')}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between cursor-pointer ${
                      adminFirm === 'kamal-industries'
                        ? 'bg-stone-900/10 text-stone-900 font-semibold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>Kamal Industries</span>
                    {adminFirm === 'kamal-industries' && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Active User & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-semibold text-stone-900 block truncate max-w-[160px]">
                {currentUser?.name || 'Staff User'}
              </span>
              <span className="text-[10px] text-stone-500 font-mono block">
                {currentUser?.email}
              </span>
            </div>

            <button
              onClick={navigateToHome}
              title="Return to Public Website"
              type="button"
              aria-label="Back to Public Website"
              className="min-h-[44px] px-3 sm:px-3.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-[#A31D1D]" />
              <span className="hidden xs:inline">Back to </span>
              <span>Website</span>
            </button>

            <button
              onClick={logout}
              title="Sign Out of Portal"
              type="button"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Operational Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Desktop Left Operational Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-stone-200 p-3 shadow-xs space-y-4 text-left">
            {/* Quick return to public website */}
            <div className="pb-2 border-b border-slate-100">
              <button
                onClick={navigateToHome}
                type="button"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-slate-200/80"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#A31D1D]" />
                <span>← Back to Website</span>
              </button>
            </div>

            {/* 1. Operational Priority Navigation */}
            <div>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Operational Priority
              </div>
              <div className="space-y-0.5 mt-1">
                {operationalItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeAdminModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleModuleSelect(item.id)}
                      type="button"
                      className={`w-full min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left ${
                        isActive
                          ? isEnterprises
                            ? 'bg-[#781D22] text-white shadow-xs'
                            : 'bg-stone-900 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Firm Products & Categories */}
            <div className="pt-2 border-t border-stone-100">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                {firm.shortName} Catalogues
              </div>
              <div className="space-y-0.5 mt-1">
                {categoryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeAdminModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleModuleSelect(item.id)}
                      type="button"
                      className={`w-full min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left ${
                        isActive
                          ? isEnterprises
                            ? 'bg-[#781D22] text-white shadow-xs'
                            : 'bg-stone-900 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Secondary Administration */}
            <div className="pt-2 border-t border-stone-100">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Administration
              </div>
              <div className="space-y-0.5 mt-1">
                {secondaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeAdminModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleModuleSelect(item.id)}
                      type="button"
                      className={`w-full min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left ${
                        isActive
                          ? isEnterprises
                            ? 'bg-[#781D22] text-white shadow-xs'
                            : 'bg-stone-900 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Center Work Area */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {/* Sub-module contextual Back navigation (Requirement 4) */}
          {activeAdminModule !== 'dashboard' && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between gap-3 animate-in fade-in">
              <button
                onClick={() => setActiveAdminModule('dashboard')}
                type="button"
                aria-label="Back to Admin Dashboard"
                className="min-h-[44px] px-3.5 sm:px-4 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-stone-200/80 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-[#A31D1D]" />
                <span>← Back to Dashboard</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-stone-400 font-mono">
                  {firm.shortName} · {activeAdminModule}
                </span>
                <button
                  onClick={navigateToHome}
                  type="button"
                  aria-label="Back to Website Home"
                  className="min-h-[44px] px-3 rounded-xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Website Home</span>
                </button>
              </div>
            </div>
          )}

          {activeAdminModule === 'dashboard' && <DashboardModule />}
          {activeAdminModule === 'quick-bill' && <QuickBillModule />}
          {activeAdminModule === 'stock-search' && <StockSearchModule title="Fast Stock Search" />}
          {activeAdminModule === 'barcode-scan' && <BarcodeScanModule />}
          {activeAdminModule === 'sale-billing' && <SaleBillingModule />}
          {activeAdminModule === 'purchase-ocr' && <PurchaseOCRModule />}
          {activeAdminModule === 'repair-service' && <RepairServiceModule />}
          {activeAdminModule === 'tally-sync' && <TallySyncModule />}

          {/* Product category modules */}
          {activeAdminModule === 'products' && <StockSearchModule title="All Master Products" />}
          {activeAdminModule === 'ent-bicycles' && <StockSearchModule categoryScope="bicycles" title="Enterprises — Bicycles" />}
          {activeAdminModule === 'ent-accessories' && <StockSearchModule categoryScope="accessories" title="Enterprises — Cycling Accessories" />}
          {activeAdminModule === 'ent-kids' && <StockSearchModule categoryScope="kids" title="Enterprises — Kids Products & Mobility" />}
          {activeAdminModule === 'ent-appliances' && <StockSearchModule categoryScope="appliances" title="Enterprises — Home Appliances" />}
          {activeAdminModule === 'ent-gas-stoves' && <StockSearchModule categoryScope="appliances" title="Enterprises — Gas Stoves" />}
          {activeAdminModule === 'ent-cookware' && <StockSearchModule categoryScope="cookware" title="Enterprises — Cookware & Pressure Cookers" />}

          {activeAdminModule === 'ind-bicycles' && <StockSearchModule categoryScope="bicycles" title="Industries — All Bicycle Ranges" />}
          {activeAdminModule === 'ind-accessories' && <StockSearchModule categoryScope="accessories" title="Industries — Cycling Accessories" />}

          {/* Secondary Administration */}
          {activeAdminModule === 'customers' && <CustomersModule />}
          {activeAdminModule === 'suppliers' && <SuppliersModule />}
          {activeAdminModule === 'reports' && <ReportsModule />}
          {activeAdminModule === 'users-roles' && <UsersRolesModule />}
          {activeAdminModule === 'settings' && <SettingsModule />}
        </main>
      </div>

      {/* Global Business Action Modals */}
      <UniversalScannerModal />
      <BillUploadModal />
      <AddProductModal />

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-[#FAF8F5] h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <KamalLogo size="sm" variant="light" showSubtitle={true} subtitleText={firm.shortName} />
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Return to Website in Mobile Drawer */}
              <div className="mt-3 pb-3 border-b border-stone-200">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    navigateToHome();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#A31D1D]" />
                  <span>← Back to Website</span>
                </button>
              </div>

              {/* Operational Priority */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Operational Priority
                </p>
                <div className="space-y-1">
                  {operationalItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeAdminModule === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleModuleSelect(item.id)}
                        className={`w-full min-h-[44px] px-3 py-2 text-xs font-medium rounded-xl flex items-center gap-3 text-left cursor-pointer ${
                          isActive
                            ? isEnterprises
                              ? 'bg-[#781D22] text-white'
                              : 'bg-stone-900 text-white'
                            : 'text-stone-700 hover:bg-stone-200/60'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categories */}
              <div className="mt-4 pt-3 border-t border-stone-200">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  {firm.shortName} Categories
                </p>
                <div className="space-y-1">
                  {categoryItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeAdminModule === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleModuleSelect(item.id)}
                        className={`w-full min-h-[44px] px-3 py-2 text-xs font-medium rounded-xl flex items-center gap-3 text-left cursor-pointer ${
                          isActive
                            ? isEnterprises
                              ? 'bg-[#781D22] text-white'
                              : 'bg-stone-900 text-white'
                            : 'text-stone-700 hover:bg-stone-200/60'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={logout}
                className="w-full min-h-[44px] rounded-xl bg-stone-200 text-stone-800 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* Mobile Fixed Bottom Operational Bar (Thumb zone) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 grid grid-cols-5 h-16 items-center px-1">
        <button
          onClick={() => setActiveAdminModule('dashboard')}
          type="button"
          className={`flex flex-col items-center justify-center min-h-[48px] text-[10px] font-medium transition-colors ${
            activeAdminModule === 'dashboard'
              ? isEnterprises
                ? 'text-[#781D22]'
                : 'text-stone-900'
              : 'text-stone-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveAdminModule('quick-bill')}
          type="button"
          className={`flex flex-col items-center justify-center min-h-[48px] text-[10px] font-medium transition-colors ${
            activeAdminModule === 'quick-bill'
              ? isEnterprises
                ? 'text-[#781D22] font-bold'
                : 'text-stone-900 font-bold'
              : 'text-stone-500'
          }`}
        >
          <Receipt className="w-4 h-4 mb-0.5 text-[#D4AF37]" />
          <span>Quick Bill</span>
        </button>

        <button
          onClick={() => setActiveAdminModule('stock-search')}
          type="button"
          className={`flex flex-col items-center justify-center min-h-[48px] text-[10px] font-medium transition-colors ${
            activeAdminModule === 'stock-search'
              ? isEnterprises
                ? 'text-[#781D22]'
                : 'text-stone-900'
              : 'text-stone-400'
          }`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span>Stock</span>
        </button>

        <button
          onClick={() => setActiveAdminModule('sale-billing')}
          type="button"
          className={`flex flex-col items-center justify-center min-h-[48px] text-[10px] font-medium transition-colors ${
            activeAdminModule === 'sale-billing'
              ? isEnterprises
                ? 'text-[#781D22]'
                : 'text-stone-900'
              : 'text-stone-400'
          }`}
        >
          <Receipt className="w-4 h-4 mb-0.5" />
          <span>Billing</span>
        </button>

        <button
          onClick={() => setActiveAdminModule('repair-service')}
          type="button"
          className={`flex flex-col items-center justify-center min-h-[48px] text-[10px] font-medium transition-colors ${
            activeAdminModule === 'repair-service'
              ? isEnterprises
                ? 'text-[#781D22]'
                : 'text-stone-900'
              : 'text-stone-400'
          }`}
        >
          <Wrench className="w-4 h-4 mb-0.5" />
          <span>Service</span>
        </button>

        <button
          onClick={() => setMobileDrawerOpen(true)}
          type="button"
          className="flex flex-col items-center justify-center min-h-[48px] text-[10px] font-medium text-stone-400 hover:text-stone-700"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
};
