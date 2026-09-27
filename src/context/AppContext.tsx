import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirmId, Product, ProductFirmStock, User, OCRDraft, Sale, AuditLog } from '../types';
import { AUTHORISED_USERS, PRODUCTS, PRODUCT_STOCKS, OCR_DRAFTS, RECENT_SALES } from '../data/mockData';

interface AppContextType {
  // Public navigation
  view: 'landing' | 'catalogue' | 'admin';
  setView: (view: 'landing' | 'catalogue' | 'admin') => void;
  publicFirm: FirmId;
  setPublicFirm: (firm: FirmId) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;

  // Admin access & RBAC
  currentUser: User | null;
  adminFirm: FirmId;
  setAdminFirm: (firm: FirmId) => void;
  activeAdminModule: string;
  setActiveAdminModule: (module: string) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  login: (email: string, otp: string) => { success: boolean; message: string };
  loginWithGoogle: (email: string) => { success: boolean; message: string };
  logout: () => void;
  hasPermission: (perm: string) => boolean;

  // Live Inventory & Transaction State
  products: Product[];
  productStocks: ProductFirmStock[];
  ocrDrafts: OCRDraft[];
  recentSales: Sale[];
  auditLogs: AuditLog[];

  // Interactive Quick Action Modals & Universal Scanner
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  scannerMode: 'CHOICE' | 'QR' | 'BARCODE';
  setScannerMode: (mode: 'CHOICE' | 'QR' | 'BARCODE') => void;
  scannerCallback: ((result: { type: 'qr' | 'barcode'; code: string; payload?: any }) => void) | null;
  scannerContextTitle?: string;
  openScanner: (
    mode?: 'CHOICE' | 'QR' | 'BARCODE',
    onScan?: (result: { type: 'qr' | 'barcode'; code: string; payload?: any }) => void,
    contextTitle?: string
  ) => void;
  closeScanner: () => void;

  isBillUploadOpen: boolean;
  setIsBillUploadOpen: (open: boolean) => void;
  isAddProductOpen: boolean;
  setIsAddProductOpen: (open: boolean) => void;
  prefilledBarcode: string;
  setPrefilledBarcode: (code: string) => void;
  reviewDraft: OCRDraft | null;
  setReviewDraft: (draft: OCRDraft | null) => void;

  // State operations
  addProduct: (newProd: Product, initialStock: number) => void;
  adjustStock: (productId: string, firmId: FirmId, delta: number) => void;
  setAbsoluteStock: (productId: string, firmId: FirmId, newQty: number) => void;
  approveDraftBill: (
    draftId: string,
    approvedItems: Array<{
      productId?: string;
      productName: string;
      barcode?: string;
      sku?: string;
      quantity: number;
      rate: number;
      salePrice?: number;
    }>,
    invoiceMeta?: { supplier: string; invoiceNo: string; date: string }
  ) => { success: boolean; message: string; auditId: string };
  saveBillDraft: (draft: OCRDraft) => void;
  discardBillDraft: (draftId: string) => void;
  addSaleInvoice: (sale: Sale) => void;

  // Navigation helpers
  navigateToFirmCatalogue: (firmId: FirmId, categoryId?: string) => void;
  navigateToHome: () => void;
  navigateToAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<'landing' | 'catalogue' | 'admin'>('landing');
  const [publicFirm, setPublicFirm] = useState<FirmId>('kamal-enterprises');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Admin state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminFirm, setAdminFirm] = useState<FirmId>('kamal-enterprises');
  const [activeAdminModule, setActiveAdminModule] = useState<string>('dashboard');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Live Inventory & Transaction State
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [productStocks, setProductStocks] = useState<ProductFirmStock[]>(PRODUCT_STOCKS);
  const [ocrDrafts, setOcrDrafts] = useState<OCRDraft[]>(OCR_DRAFTS);
  const [recentSales, setRecentSales] = useState<Sale[]>(RECENT_SALES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'aud-init-01',
      firmId: 'kamal-enterprises',
      userId: 'usr-001',
      userEmail: 'kamal.mgmt@gmail.com',
      action: 'SYSTEM_STARTUP',
      module: 'security',
      details: 'Audit logging active for Kamal Business multi-firm operations',
      timestamp: '2026-09-26 09:00:00',
    },
  ]);

  // Interactive Quick Action Modals & Universal Scanner Service
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerMode, setScannerMode] = useState<'CHOICE' | 'QR' | 'BARCODE'>('CHOICE');
  const [scannerCallback, setScannerCallback] = useState<
    ((result: { type: 'qr' | 'barcode'; code: string; payload?: any }) => void) | null
  >(null);
  const [scannerContextTitle, setScannerContextTitle] = useState<string | undefined>(undefined);

  const openScanner = (
    mode: 'CHOICE' | 'QR' | 'BARCODE' = 'CHOICE',
    onScan?: (result: { type: 'qr' | 'barcode'; code: string; payload?: any }) => void,
    contextTitle?: string
  ) => {
    setScannerMode(mode);
    setScannerCallback(() => onScan || null);
    setScannerContextTitle(contextTitle);
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
    setScannerCallback(null);
    setScannerContextTitle(undefined);
  };

  const [isBillUploadOpen, setIsBillUploadOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [prefilledBarcode, setPrefilledBarcode] = useState('');
  const [reviewDraft, setReviewDraft] = useState<OCRDraft | null>(null);

  // Sync route on hash changes or back button (Requirement 5)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;

      // 1. If any modal was open, close it first
      if (selectedProduct) {
        setSelectedProduct(null);
        return;
      }
      if (showLoginModal) {
        setShowLoginModal(false);
        return;
      }
      if (isScannerOpen) {
        setIsScannerOpen(false);
        return;
      }
      if (isBillUploadOpen) {
        setIsBillUploadOpen(false);
        return;
      }
      if (isAddProductOpen) {
        setIsAddProductOpen(false);
        return;
      }

      // 2. If in admin sub-module, go back to admin dashboard
      if (view === 'admin' && activeAdminModule !== 'dashboard') {
        setActiveAdminModule('dashboard');
        return;
      }

      // 3. Routing
      if (hash.startsWith('#product/')) {
        const pId = hash.replace('#product/', '');
        const found = products.find((p) => p.id === pId);
        if (found) setSelectedProduct(found);
      } else if (hash.startsWith('#catalogue/')) {
        const parts = hash.split('/');
        const f = parts[1] as FirmId;
        if (f === 'kamal-enterprises' || f === 'kamal-industries') {
          setPublicFirm(f);
          setView('catalogue');
        }
      } else if (hash === '#admin') {
        if (currentUser) {
          setView('admin');
        } else {
          setShowLoginModal(true);
        }
      } else {
        if (view !== 'admin') {
          setView('landing');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    currentUser,
    view,
    selectedProduct,
    showLoginModal,
    isScannerOpen,
    isBillUploadOpen,
    isAddProductOpen,
    activeAdminModule,
    products,
  ]);

  const login = (email: string, otp: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = AUTHORISED_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.isActive
    );

    if (!user) {
      return {
        success: false,
        message: 'Account not found in the authorised staff directory. Access denied.',
      };
    }

    if (otp !== '123456' && otp !== '999999' && otp.length !== 6) {
      return {
        success: false,
        message: 'Invalid OTP verification code. Please check your authorised email.',
      };
    }

    setCurrentUser(user);
    if (user.allowedFirms.length === 1) {
      setAdminFirm(user.allowedFirms[0]);
    } else if (!user.allowedFirms.includes(adminFirm)) {
      setAdminFirm(user.allowedFirms[0]);
    }

    setShowLoginModal(false);
    setView('admin');
    window.location.hash = '#admin';

    return {
      success: true,
      message: `Welcome, ${user.name}. Authenticated for ${
        user.allowedFirms.length > 1 ? 'both firms' : user.allowedFirms[0]
      }.`,
    };
  };

  const loginWithGoogle = (email: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = AUTHORISED_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.isActive
    );

    if (!user) {
      return {
        success: false,
        message: 'Google Account is not pre-registered in authorised staff registry.',
      };
    }

    setCurrentUser(user);
    if (user.allowedFirms.length === 1) {
      setAdminFirm(user.allowedFirms[0]);
    } else {
      setAdminFirm(user.allowedFirms[0]);
    }

    setShowLoginModal(false);
    setView('admin');
    window.location.hash = '#admin';

    return {
      success: true,
      message: `Verified via Google Workspace. Welcome, ${user.name}.`,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setView('landing');
    window.location.hash = '';
  };

  const hasPermission = (perm: string): boolean => {
    if (!currentUser) return false;
    const perms = currentUser.permissionsByFirm[adminFirm] || [];
    return perms.includes(perm as any) || currentUser.roleByFirm[adminFirm] === 'super_admin';
  };

  // State Management Operations
  const addProduct = (newProd: Product, initialStock: number) => {
    setProducts((prev) => [newProd, ...prev]);

    // Create stock record isolated by current firm
    const newStock: ProductFirmStock = {
      id: `stk-${Date.now()}-${adminFirm.substring(6, 9)}`,
      productId: newProd.id,
      firmId: adminFirm,
      currentStock: Math.max(0, initialStock),
      minThreshold: 3,
      showroomLocation: 'Central Reception Display',
      sellingPrice: newProd.indicativePrice,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setProductStocks((prev) => [newStock, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      firmId: adminFirm,
      userId: currentUser?.id || 'usr-staff',
      userEmail: currentUser?.email || 'staff@kamalbusiness.com',
      action: 'ADD_PRODUCT',
      module: 'inventory',
      details: `Added new product "${newProd.name}" (Barcode: ${newProd.barcode}) with initial stock ${initialStock}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const adjustStock = (productId: string, firmId: FirmId, delta: number) => {
    setProductStocks((prev) =>
      prev.map((s) => {
        if (s.productId === productId && s.firmId === firmId) {
          const nextStock = Math.max(0, s.currentStock + delta);
          return {
            ...s,
            currentStock: nextStock,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      })
    );

    const prod = products.find((p) => p.id === productId);
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      firmId,
      userId: currentUser?.id || 'usr-staff',
      userEmail: currentUser?.email || 'staff@kamalbusiness.com',
      action: 'ADJUST_STOCK',
      module: 'inventory',
      details: `Adjusted stock for "${prod?.name || productId}" by ${delta > 0 ? '+' : ''}${delta}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const setAbsoluteStock = (productId: string, firmId: FirmId, newQty: number) => {
    setProductStocks((prev) => {
      const exists = prev.some((s) => s.productId === productId && s.firmId === firmId);
      if (exists) {
        return prev.map((s) => {
          if (s.productId === productId && s.firmId === firmId) {
            return {
              ...s,
              currentStock: Math.max(0, newQty),
              lastUpdated: new Date().toISOString().split('T')[0],
            };
          }
          return s;
        });
      } else {
        const newRecord: ProductFirmStock = {
          id: `stk-${Date.now()}-${firmId.substring(6, 9)}`,
          productId,
          firmId,
          currentStock: Math.max(0, newQty),
          minThreshold: 3,
          showroomLocation: 'Main Floor Bay',
          sellingPrice: products.find((p) => p.id === productId)?.indicativePrice || 0,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        return [newRecord, ...prev];
      }
    });
  };

  /**
   * CRITICAL MANDATE:
   * Only this function commits approved bill data to live inventory!
   */
  const approveDraftBill = (
    draftId: string,
    approvedItems: Array<{
      productId?: string;
      productName: string;
      barcode?: string;
      sku?: string;
      quantity: number;
      rate: number;
      salePrice?: number;
    }>,
    invoiceMeta?: { supplier: string; invoiceNo: string; date: string }
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const auditId = `aud-${Date.now()}`;

    // 1. Commit inventory increments for activeFirm
    approvedItems.forEach((item) => {
      // Find matching product by productId, barcode or name
      let prod = products.find(
        (p) =>
          (item.productId && p.id === item.productId) ||
          (item.barcode && p.barcode === item.barcode) ||
          p.name.toLowerCase() === item.productName.toLowerCase()
      );

      if (prod) {
        // Increment existing stock
        adjustStock(prod.id, adminFirm, item.quantity);
      } else {
        // Create new catalogue product from approved bill line
        const newProdId = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const createdProd: Product = {
          id: newProdId,
          sku: item.sku || `SKU-${Date.now().toString().slice(-6)}`,
          barcode: item.barcode || `890${Date.now().toString().slice(-10)}`,
          name: item.productName,
          brand: 'Verified Brand',
          categoryId: adminFirm === 'kamal-industries' ? 'bicycles-all' : 'appliances',
          applicableFirms: [adminFirm],
          subtitle: 'Added via Approved Purchase Bill',
          description: `Imported via approved purchase invoice ${invoiceMeta?.invoiceNo || draftId}.`,
          specifications: { Rate: `₹${item.rate}`, VerifiedBy: currentUser?.name || 'Admin' },
          mrp: item.salePrice || Math.round(item.rate * 1.3),
          indicativePrice: item.salePrice || Math.round(item.rate * 1.25),
          warrantyMonths: 12,
          rating: 4.8,
          reviewCount: 1,
          features: ['Genuine manufacturer sourced', 'Inventory verified'],
        };
        addProduct(createdProd, item.quantity);
      }
    });

    // 2. Mark draft as approved
    setOcrDrafts((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? {
              ...d,
              status: 'approved',
              approvedBy: currentUser?.name || 'Administrator',
              approvedAt: timestamp,
            }
          : d
      )
    );

    // 3. Create mandatory immutable Audit Record
    const audit: AuditLog = {
      id: auditId,
      firmId: adminFirm,
      userId: currentUser?.id || 'usr-admin',
      userEmail: currentUser?.email || 'admin@kamalbusiness.com',
      action: 'APPROVE_PURCHASE_BILL',
      module: 'purchase_ocr',
      details: `Approved Bill ${invoiceMeta?.invoiceNo || draftId} from "${
        invoiceMeta?.supplier || 'Supplier'
      }". Total ${approvedItems.length} lines committed to ${adminFirm} inventory.`,
      timestamp,
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return {
      success: true,
      message: `Invoice approved! ${approvedItems.reduce((acc, i) => acc + i.quantity, 0)} units committed to ${
        adminFirm === 'kamal-enterprises' ? 'Kamal Enterprises' : 'Kamal Industries'
      } stock.`,
      auditId,
    };
  };

  const saveBillDraft = (draft: OCRDraft) => {
    setOcrDrafts((prev) => {
      const exists = prev.some((d) => d.id === draft.id);
      if (exists) {
        return prev.map((d) => (d.id === draft.id ? draft : d));
      }
      return [draft, ...prev];
    });
  };

  const discardBillDraft = (draftId: string) => {
    setOcrDrafts((prev) => prev.filter((d) => d.id !== draftId));
  };

  const addSaleInvoice = (sale: Sale) => {
    setRecentSales((prev) => [sale, ...prev]);
    // Decrement sold items from firm stock
    sale.items.forEach((item) => {
      adjustStock(item.productId, sale.firmId, -item.quantity);
    });

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      firmId: sale.firmId,
      userId: currentUser?.id || 'usr-staff',
      userEmail: currentUser?.email || 'staff@kamalbusiness.com',
      action: 'NEW_SALE_INVOICE',
      module: 'billing',
      details: `Generated Invoice ${sale.invoiceNo} for customer ${sale.customerName}. Total: ₹${sale.grandTotal}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const navigateToFirmCatalogue = (firmId: FirmId, categoryId?: string) => {
    setPublicFirm(firmId);
    if (categoryId) {
      setCategoryFilter(categoryId);
    } else {
      setCategoryFilter('all');
    }
    setView('catalogue');
    window.location.hash = `#catalogue/${firmId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setSelectedProduct(null);
    setShowLoginModal(false);
    setIsScannerOpen(false);
    setIsBillUploadOpen(false);
    setIsAddProductOpen(false);
    setView('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    if (currentUser) {
      setView('admin');
      window.location.hash = '#admin';
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        publicFirm,
        setPublicFirm,
        selectedProduct,
        setSelectedProduct,
        categoryFilter,
        setCategoryFilter,
        currentUser,
        adminFirm,
        setAdminFirm,
        activeAdminModule,
        setActiveAdminModule,
        showLoginModal,
        setShowLoginModal,
        login,
        loginWithGoogle,
        logout,
        hasPermission,
        products,
        productStocks,
        ocrDrafts,
        recentSales,
        auditLogs,
        isScannerOpen,
        setIsScannerOpen,
        scannerMode,
        setScannerMode,
        scannerCallback,
        scannerContextTitle,
        openScanner,
        closeScanner,
        isBillUploadOpen,
        setIsBillUploadOpen,
        isAddProductOpen,
        setIsAddProductOpen,
        prefilledBarcode,
        setPrefilledBarcode,
        reviewDraft,
        setReviewDraft,
        addProduct,
        adjustStock,
        setAbsoluteStock,
        approveDraftBill,
        saveBillDraft,
        discardBillDraft,
        addSaleInvoice,
        navigateToFirmCatalogue,
        navigateToHome,
        navigateToAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
