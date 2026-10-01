import React from 'react';
import {
  Receipt,
  FileText,
  Upload,
  ScanLine,
  PackagePlus,
  Search,
  Package,
  Users,
  Truck,
  Wrench,
  BarChart3,
  RefreshCw,
  Shield,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickActionGrid: React.FC = () => {
  const {
    adminFirm,
    setActiveAdminModule,
    openScanner,
    setIsBillUploadOpen,
    setIsAddProductOpen,
  } = useApp();

  const isEnterprises = adminFirm === 'kamal-enterprises';

  const actions = [
    {
      id: 'quick-bill',
      label: 'Quick Bill',
      sub: 'Offline / Dasti Memo',
      icon: Receipt,
      iconColor: 'text-[#781D22]',
      bgColor: 'bg-amber-100/70',
      highlight: true,
      onClick: () => setActiveAdminModule('quick-bill'),
    },
    {
      id: 'new-sale',
      label: 'New Sale',
      sub: 'POS Counter Bill',
      icon: Receipt,
      iconColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50/70',
      onClick: () => setActiveAdminModule('sale-billing'),
    },
    {
      id: 'new-purchase',
      label: 'New Purchase',
      sub: 'Vouchers & Bills',
      icon: FileText,
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-50/70',
      onClick: () => setActiveAdminModule('purchase-ocr'),
    },
    {
      id: 'upload-bill',
      label: 'Upload Bill',
      sub: 'Photo / PDF OCR',
      icon: Upload,
      iconColor: 'text-[#A31D1D]',
      bgColor: 'bg-rose-50/70',
      highlight: true,
      onClick: () => setIsBillUploadOpen(true),
    },
    {
      id: 'scan',
      label: 'Scan',
      sub: 'QR & Barcode Scanner',
      icon: ScanLine,
      iconColor: 'text-amber-700',
      bgColor: 'bg-amber-50/70',
      highlight: true,
      onClick: () => openScanner('CHOICE'),
    },
    {
      id: 'add-product',
      label: 'Add Product',
      sub: 'New Master Item',
      icon: PackagePlus,
      iconColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50/70',
      onClick: () => setIsAddProductOpen(true),
    },
    {
      id: 'stock-search',
      label: 'Stock Search',
      sub: 'Fast Inventory Lookup',
      icon: Search,
      iconColor: 'text-purple-700',
      bgColor: 'bg-purple-50/70',
      onClick: () => setActiveAdminModule('stock-search'),
    },
    {
      id: 'products',
      label: 'Products',
      sub: 'Master Catalogues',
      icon: Package,
      iconColor: 'text-stone-700',
      bgColor: 'bg-stone-100',
      onClick: () => setActiveAdminModule('products'),
    },
    {
      id: 'customers',
      label: 'Customers',
      sub: 'Profiles & History',
      icon: Users,
      iconColor: 'text-cyan-700',
      bgColor: 'bg-cyan-50/70',
      onClick: () => setActiveAdminModule('customers'),
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      sub: 'Vendors & GST',
      icon: Truck,
      iconColor: 'text-amber-800',
      bgColor: 'bg-amber-50/70',
      onClick: () => setActiveAdminModule('suppliers'),
    },
    {
      id: 'repair-service',
      label: isEnterprises ? 'Service / Repair' : 'Service & Assembly',
      sub: 'Job Cards & Workshop',
      icon: Wrench,
      iconColor: 'text-[#781D22]',
      bgColor: 'bg-rose-50/70',
      onClick: () => setActiveAdminModule('repair-service'),
    },
    {
      id: 'reports',
      label: 'Reports',
      sub: 'Analytics & P&L',
      icon: BarChart3,
      iconColor: 'text-teal-700',
      bgColor: 'bg-teal-50/70',
      onClick: () => setActiveAdminModule('reports'),
    },
    {
      id: 'tally-sync',
      label: 'Tally Sync',
      sub: 'Prime Integration',
      icon: RefreshCw,
      iconColor: 'text-sky-700',
      bgColor: 'bg-sky-50/70',
      onClick: () => setActiveAdminModule('tally-sync'),
    },
    {
      id: 'users-roles',
      label: 'Users & Roles',
      sub: 'RBAC Security',
      icon: Shield,
      iconColor: 'text-slate-800',
      bgColor: 'bg-slate-100',
      onClick: () => setActiveAdminModule('users-roles'),
    },
    {
      id: 'settings',
      label: 'Settings',
      sub: 'Firm Preferences',
      icon: Settings,
      iconColor: 'text-stone-700',
      bgColor: 'bg-stone-100',
      onClick: () => setActiveAdminModule('settings'),
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Quick Action Command Center
        </h3>
        <span className="text-[11px] font-medium text-stone-400">
          {actions.length} Modules Available
        </span>
      </div>

      {/* 2-Column Mobile Grid, 3-4 Column Tablet/Desktop Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              type="button"
              className={`p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all text-left flex items-start gap-3 cursor-pointer group active:scale-[0.98] ${
                act.highlight
                  ? isEnterprises
                    ? 'ring-1 ring-[#781D22]/20 hover:border-[#781D22]'
                    : 'ring-1 ring-stone-900/15 hover:border-stone-900'
                  : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${act.bgColor} ${act.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>

              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs sm:text-sm text-stone-900 block truncate group-hover:text-[#A31D1D] transition-colors">
                  {act.label}
                </span>
                <span className="text-[10px] sm:text-[11px] text-stone-400 block truncate font-normal mt-0.5">
                  {act.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
