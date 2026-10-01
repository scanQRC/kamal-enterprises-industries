import {
  QuickBill,
  SavedMasterItem,
  WarrantyTemplate,
  QuickBillSettingsConfig,
  DocType,
} from '../types/quickbill';

const SETTINGS_KEY = 'kamal_quickbill_settings';
const SAVED_ITEMS_KEY = 'kamal_quickbill_saved_items';
const WARRANTY_TEMPLATES_KEY = 'kamal_quickbill_warranties';
const DOCUMENTS_KEY = 'kamal_quickbill_history';

// Default Business Profile from prompt
export const DEFAULT_BUSINESS_PROFILE = {
  businessName: 'KAMAL CYCLE WORLD',
  dealsIn: 'Bicycle, Tricycle, Baby Walker, Jhulla, Kids Items',
  businessLine: 'SALE • SERVICE • SPARE',
  address: 'MALHOTRA ENCLAVE, CHABUTRA BAZAR, UDHAMPUR (J&K) - 182101',
  contact: '01992-271627',
  email: 'kamalcycleworld@gmail.com',
};

export const DEFAULT_BILL_TERMS = [
  'Goods once sold will not be taken back.',
  'Exchange allowed within 3 days in unused original condition with this memo.',
  'Warranty, if applicable, is covered under manufacturer/showroom terms only.',
  'All disputes subject to Udhampur (J&K) jurisdiction.',
];

export const DEFAULT_QUOTATION_TERMS = [
  'Prices quoted are valid for 7 days from the date of quotation.',
  'Delivery and color options subject to showroom stock availability.',
  'Standard showroom warranty terms apply upon final bill confirmation.',
  'All disputes subject to Udhampur (J&K) jurisdiction.',
];

export const DEFAULT_SETTINGS: QuickBillSettingsConfig = {
  profile: DEFAULT_BUSINESS_PROFILE,
  billPrefix: 'KCW-B-',
  nextBillNumber: 101,
  quotationPrefix: 'KCW-Q-',
  nextQuotationNumber: 101,
  defaultFormat: 'premium',
  defaultBillTerms: DEFAULT_BILL_TERMS,
  defaultQuotationTerms: DEFAULT_QUOTATION_TERMS,
  defaultQuotationValidityDays: 7,
  includeEandOE: true,
  signatureDataUrl: null,
  signatureName: 'Authorized Signatory',
};

export const SEED_SAVED_ITEMS: SavedMasterItem[] = [
  {
    id: 'item-1',
    name: 'Hero Sprint 26T MTB Bicycle',
    brand: 'Hero Cycles',
    defaultRate: 7800,
    category: 'Bicycles',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-2',
    name: 'Firefox Road Runner 700C',
    brand: 'Firefox',
    defaultRate: 14500,
    category: 'Bicycles',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-3',
    name: 'Avon Junior 20T Kids Bicycle',
    brand: 'Avon',
    defaultRate: 4200,
    category: 'Bicycles',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-4',
    name: 'Baby Walker with Musical Toy Tray',
    brand: 'Kamal Baby',
    defaultRate: 1450,
    category: 'Kids',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-5',
    name: 'Foldable Baby Jhulla / Cradle',
    brand: 'Comfort Baby',
    defaultRate: 2100,
    category: 'Kids',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-6',
    name: 'Cycle Tube 26 × 1.95 (Schrader Valve)',
    brand: 'Ralson',
    defaultRate: 180,
    category: 'Spares',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-7',
    name: 'Heavy Duty Metal Floor Air Pump',
    brand: 'Kamal Pro',
    defaultRate: 450,
    category: 'Accessories',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-8',
    name: 'Rechargeable LED Cycle Headlight + Horn',
    brand: 'CycLites',
    defaultRate: 350,
    category: 'Accessories',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-9',
    name: 'Heavy Duty Alloy Kickstand',
    brand: 'Standard',
    defaultRate: 220,
    category: 'Spares',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-10',
    name: 'Pressure Cooker 5L Gasket & Safety Valve',
    brand: 'Hawkins / Prestige',
    defaultRate: 120,
    category: 'Appliances',
    createdAt: new Date().toISOString(),
  },
];

export const SEED_WARRANTY_TEMPLATES: WarrantyTemplate[] = [
  {
    id: 'w-bicycle-1yr',
    title: 'Kamal Cycle World Bicycle Frame Warranty',
    period: '1 Year',
    covered: 'Bicycle frame weld cracks, front rigid fork integrity, bottom bracket shell failure',
    notCovered: 'Tires, tubes, brake pads, paint scratches, accidental collisions or rough misuse',
    conditions: 'Valid with this original bill memo and serial number verification at our Udhampur workshop',
    defaultMessage: '1 Year Comprehensive Frame Warranty guaranteed by Kamal Cycle World, Udhampur.',
    defaultStyle: 'seal',
  },
  {
    id: 'w-service-6mo',
    title: '6 Months Free Periodic Tuning & Service',
    period: '6 Months',
    covered: '2 Free periodic check-ups: Gear tuning, brake adjustments, chain lubing, spoke tightening',
    notCovered: 'Replacement parts, consumable spares, puncture repair',
    conditions: 'Available at Kamal Cycle World Workshop, Chabutra Bazar, Udhampur',
    defaultMessage: 'Complimentary 6 Months Periodic Service Guarantee on bicycle purchases.',
    defaultStyle: 'box',
  },
  {
    id: 'w-kids-3mo',
    title: 'Kids Product Quality Guarantee',
    period: '3 Months',
    covered: 'Chassis manufacturing defects, wheel bracket pin breakage under normal use',
    notCovered: 'Plastic body cracking due to external drops, battery corrosion, fabric tearing',
    conditions: 'Bring item to showroom with original customer bill',
    defaultMessage: '3 Months Quality Guarantee for walker/jhulla chassis and mobility hardware.',
    defaultStyle: 'stamp',
  },
];

class QuickBillStorage {
  private get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  // --- SETTINGS ---
  getSettings(): QuickBillSettingsConfig {
    const raw = this.get<any>(SETTINGS_KEY, DEFAULT_SETTINGS);
    // Migration: ensure new fields exist
    return {
      profile: raw.profile || DEFAULT_BUSINESS_PROFILE,
      billPrefix: raw.billPrefix || 'KCW-B-',
      nextBillNumber: raw.nextBillNumber || 101,
      quotationPrefix: raw.quotationPrefix || 'KCW-Q-',
      nextQuotationNumber: raw.nextQuotationNumber || 101,
      defaultFormat: raw.defaultFormat || 'premium',
      defaultBillTerms: raw.defaultBillTerms || raw.defaultTerms || DEFAULT_BILL_TERMS,
      defaultQuotationTerms: raw.defaultQuotationTerms || DEFAULT_QUOTATION_TERMS,
      defaultQuotationValidityDays: raw.defaultQuotationValidityDays || 7,
      includeEandOE: raw.includeEandOE !== undefined ? raw.includeEandOE : true,
      signatureDataUrl: raw.signatureDataUrl || null,
      signatureName: raw.signatureName || 'Authorized Signatory',
    };
  }

  saveSettings(settings: QuickBillSettingsConfig): void {
    this.set(SETTINGS_KEY, settings);
  }

  getNextDocumentNumber(docType: DocType): string {
    const settings = this.getSettings();
    if (docType === 'quotation') {
      const num = settings.nextQuotationNumber || 101;
      return `${settings.quotationPrefix}${num.toString().padStart(4, '0')}`;
    }
    const num = settings.nextBillNumber || 101;
    return `${settings.billPrefix}${num.toString().padStart(4, '0')}`;
  }

  incrementDocumentNumber(docType: DocType): void {
    const settings = this.getSettings();
    if (docType === 'quotation') {
      settings.nextQuotationNumber = (settings.nextQuotationNumber || 101) + 1;
    } else {
      settings.nextBillNumber = (settings.nextBillNumber || 101) + 1;
    }
    this.saveSettings(settings);
  }

  // --- SAVED ITEMS ---
  getSavedItems(): SavedMasterItem[] {
    const items = this.get<SavedMasterItem[]>(SAVED_ITEMS_KEY, []);
    if (!items || items.length === 0) {
      this.set(SAVED_ITEMS_KEY, SEED_SAVED_ITEMS);
      return SEED_SAVED_ITEMS;
    }
    return items;
  }

  saveItem(item: Omit<SavedMasterItem, 'id' | 'createdAt'>): SavedMasterItem {
    const items = this.getSavedItems();
    const newItem: SavedMasterItem = {
      ...item,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.set(SAVED_ITEMS_KEY, items);
    return newItem;
  }

  updateItem(updated: SavedMasterItem): void {
    const items = this.getSavedItems().map((it) => (it.id === updated.id ? updated : it));
    this.set(SAVED_ITEMS_KEY, items);
  }

  deleteItem(id: string): void {
    const items = this.getSavedItems().filter((it) => it.id !== id);
    this.set(SAVED_ITEMS_KEY, items);
  }

  // --- WARRANTY TEMPLATES ---
  getWarrantyTemplates(): WarrantyTemplate[] {
    const templates = this.get<WarrantyTemplate[]>(WARRANTY_TEMPLATES_KEY, []);
    if (!templates || templates.length === 0) {
      this.set(WARRANTY_TEMPLATES_KEY, SEED_WARRANTY_TEMPLATES);
      return SEED_WARRANTY_TEMPLATES;
    }
    return templates;
  }

  saveWarrantyTemplate(t: Omit<WarrantyTemplate, 'id'>): WarrantyTemplate {
    const templates = this.getWarrantyTemplates();
    const newT: WarrantyTemplate = {
      ...t,
      id: `w-${Date.now()}`,
    };
    templates.push(newT);
    this.set(WARRANTY_TEMPLATES_KEY, templates);
    return newT;
  }

  updateWarrantyTemplate(updated: WarrantyTemplate): void {
    const templates = this.getWarrantyTemplates().map((t) => (t.id === updated.id ? updated : t));
    this.set(WARRANTY_TEMPLATES_KEY, templates);
  }

  deleteWarrantyTemplate(id: string): void {
    const templates = this.getWarrantyTemplates().filter((t) => t.id !== id);
    this.set(WARRANTY_TEMPLATES_KEY, templates);
  }

  // --- DOCUMENT (BILLS & QUOTATIONS) HISTORY ---
  getDocuments(): QuickBill[] {
    const docs = this.get<QuickBill[]>(DOCUMENTS_KEY, []);
    // Migration: ensure every record has docType
    return docs.map((d) => ({
      ...d,
      docType: d.docType || 'bill',
    }));
  }

  // Backward compatibility alias
  getBills(): QuickBill[] {
    return this.getDocuments();
  }

  saveDocument(doc: QuickBill): void {
    const docs = this.getDocuments();
    const existingIndex = docs.findIndex((b) => b.id === doc.id);

    if (existingIndex >= 0) {
      // Correct existing document
      docs[existingIndex] = {
        ...doc,
        isCorrected: true,
        lastEditedAt: new Date().toISOString(),
      };
    } else {
      // New document
      docs.unshift(doc);
      this.incrementDocumentNumber(doc.docType);
    }
    this.set(DOCUMENTS_KEY, docs);
  }

  // Backward compatibility alias
  saveBill(bill: QuickBill): void {
    this.saveDocument(bill);
  }

  deleteDocument(id: string): void {
    const docs = this.getDocuments().filter((b) => b.id !== id);
    this.set(DOCUMENTS_KEY, docs);
  }

  deleteBill(id: string): void {
    this.deleteDocument(id);
  }

  checkDocumentNumberExists(num: string, excludeId?: string): boolean {
    const docs = this.getDocuments();
    return docs.some(
      (b) => b.billNo.toLowerCase() === num.trim().toLowerCase() && b.id !== excludeId
    );
  }

  checkBillNumberExists(billNo: string, excludeId?: string): boolean {
    return this.checkDocumentNumberExists(billNo, excludeId);
  }

  /**
   * Section 14: CREATE BILL FROM QUOTATION
   * Copies quotation information into a NEW Bill draft with fresh Bill number.
   * Preserves the original quotation completely unchanged!
   */
  createBillFromQuotation(quotation: QuickBill): QuickBill {
    const settings = this.getSettings();
    const newBillNo = this.getNextDocumentNumber('bill');

    const newBill: QuickBill = {
      ...quotation,
      id: `bill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      docType: 'bill',
      billNo: newBillNo,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      terms: settings.defaultBillTerms,
      // For converted bill: warranty is initially ready or can be enabled
      warranty: {
        enabled: false,
        title: '',
        period: '',
        covered: '',
        notCovered: '',
        conditions: '',
        message: '',
        style: 'seal',
      },
      validUntil: undefined,
      validDays: undefined,
      isCorrected: false,
      lastEditedAt: undefined,
      createdAt: new Date().toISOString(),
      notes: `Converted from Quotation #${quotation.billNo}`,
    };

    return newBill;
  }
}

export const quickBillStorage = new QuickBillStorage();
