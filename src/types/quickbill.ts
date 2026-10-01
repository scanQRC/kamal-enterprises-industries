export type DocType = 'bill' | 'quotation';

export type BillFormat = 'classic' | 'premium' | 'compact';

export type DiscountType = 'fixed' | 'percentage';

export type WarrantyStampStyle = 'seal' | 'box' | 'stamp';

export interface QuickBillItem {
  id: string;
  particulars: string;
  brand?: string;
  qty: number;
  rate: number;
  discountType?: DiscountType;
  discountValue?: number; // ₹ or %
  discountAmount: number; // actual deducted amount
  amount: number; // net line amount: (qty * rate) - discountAmount
  isSavedItem?: boolean;
}

export interface QuickBillWarranty {
  enabled: boolean;
  templateId?: string;
  title: string;
  period: string; // e.g., "1 Year", "6 Months"
  covered: string;
  notCovered: string;
  conditions: string;
  message: string;
  style: WarrantyStampStyle;
}

export interface QuickBillBusinessProfile {
  businessName: string;
  dealsIn: string;
  businessLine: string;
  address: string;
  contact: string;
  email?: string;
  gstNote?: string;
}

export interface QuickBill {
  id: string;
  docType: DocType; // 'bill' | 'quotation'
  billNo: string; // Document Number (e.g. KCW-B-0101 or KCW-Q-0101)
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerMobile: string;
  // Quotation specific:
  validUntil?: string; // YYYY-MM-DD
  validDays?: number; // e.g. 7, 15, 30
  convertedToBillId?: string; // If quotation was converted to bill
  items: QuickBillItem[];
  subtotal: number;
  totalItemDiscount: number;
  overallDiscountType?: DiscountType;
  overallDiscountValue?: number;
  overallDiscountAmount: number;
  grandTotal: number;
  terms: string[];
  warranty?: QuickBillWarranty;
  includeSignature: boolean;
  signatureDataUrl?: string;
  format: BillFormat;
  isCorrected?: boolean;
  lastEditedAt?: string;
  createdAt: string;
  notes?: string;
}

export interface SavedMasterItem {
  id: string;
  name: string;
  brand?: string;
  defaultRate?: number;
  category?: string;
  createdAt: string;
}

export interface WarrantyTemplate {
  id: string;
  title: string;
  period: string;
  covered: string;
  notCovered: string;
  conditions: string;
  defaultMessage: string;
  defaultStyle: WarrantyStampStyle;
}

export interface QuickBillSettingsConfig {
  profile: QuickBillBusinessProfile;
  // Separate Numbering (Requirement 5)
  billPrefix: string;
  nextBillNumber: number;
  quotationPrefix: string;
  nextQuotationNumber: number;
  defaultFormat: BillFormat;
  // Separate Terms (Requirement 17)
  defaultBillTerms: string[];
  defaultQuotationTerms: string[];
  defaultQuotationValidityDays: number;
  includeEandOE: boolean;
  signatureDataUrl: string | null;
  signatureName: string;
}
