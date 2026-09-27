/**
 * KAMAL BUSINESS — Data Models & Architecture Foundations
 * Principle: "Shared today, separable tomorrow."
 * Every transactional record belongs strictly to a firm_id.
 */

export type FirmId = 'kamal-enterprises' | 'kamal-industries';

export interface FirmInfo {
  id: FirmId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  establishedYear: number;
  primaryAccent: string;
  accentClass: string;
  categories: string[];
}

export type Role = 'super_admin' | 'firm_admin' | 'staff' | 'technician';

export type Permission =
  | 'products:read'
  | 'products:write'
  | 'stock:read'
  | 'stock:manage'
  | 'billing:create'
  | 'billing:manage'
  | 'repair:manage'
  | 'suppliers:read'
  | 'suppliers:manage'
  | 'reports:view'
  | 'tally:sync'
  | 'users:manage'
  | 'settings:manage';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  allowedFirms: FirmId[];
  roleByFirm: Record<FirmId, Role>;
  permissionsByFirm: Record<FirmId, Permission[]>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  applicableFirms: FirmId[];
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  applicableFirms: FirmId[];
  origin?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  brand: string;
  categoryId: string;
  applicableFirms: FirmId[];
  subtitle: string;
  description: string;
  specifications: Record<string, string>;
  mrp: number;
  indicativePrice: number;
  warrantyMonths: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  features: string[];
}

export interface ProductFirmStock {
  id: string;
  productId: string;
  firmId: FirmId;
  currentStock: number;
  minThreshold: number;
  showroomLocation: string;
  sellingPrice: number;
  lastUpdated: string;
}

export interface Review {
  id: string;
  productId: string;
  firmId: FirmId;
  customerName: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean; // Requires moderation before public appearance
}

export interface Supplier {
  id: string;
  firmIds: FirmId[];
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  city: string;
  category: string;
}

export interface Customer {
  id: string;
  firmId: FirmId;
  name: string;
  phone: string;
  email?: string;
  city: string;
  totalPurchases: number;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  taxPercent: number;
  total: number;
}

export interface Purchase {
  id: string;
  firmId: FirmId;
  supplierId: string;
  supplierName: string;
  invoiceNumber: string;
  invoiceDate: string;
  items: PurchaseItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  status: 'draft' | 'approved' | 'posted';
  ocrSourceId?: string;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxPercent: number;
  total: number;
}

export interface Sale {
  id: string;
  firmId: FirmId;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  paymentMode: 'cash' | 'upi' | 'card' | 'credit';
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
  createdAt: string;
  tallyStatus: 'pending' | 'synced';
}

export interface RepairPart {
  productId: string;
  partName: string;
  quantity: number;
  unitPrice: number;
}

export interface RepairJob {
  id: string;
  firmId: FirmId;
  jobCardNo: string;
  itemType: 'bicycle' | 'cookware' | 'gas_stove' | 'appliance';
  brandModel: string;
  customerName: string;
  customerPhone: string;
  issueDescription: string;
  status: 'received' | 'in_progress' | 'waiting_for_parts' | 'ready' | 'delivered';
  parts: RepairPart[];
  labourCharge: number;
  totalCost: number;
  receivedDate: string;
  promisedDate: string;
  technicianName: string;
}

export interface OCRDraftItem {
  id: string;
  rawText: string;
  matchedProductId?: string;
  matchedProductName?: string;
  barcode?: string;
  sku?: string;
  unit?: string; // Piece, Pair, Set, Packet, Box, Meter, Kg, etc.
  quantity: number;
  rate: number;
  mrp?: number;
  discount?: number;
  gstPercent?: number;
  confidence: number;
  isVerified: boolean;
  isMatched?: boolean;
}

export interface OCRDraft {
  id: string;
  firmId: FirmId;
  originalFileName: string;
  originalFileType?: 'photo' | 'gallery' | 'pdf' | 'none';
  originalFileData?: string; // Data URL or preview reference
  pageCount?: number;
  fileSizeBytes?: number;
  qualityState?: 'GOOD' | 'WARNING' | 'UNREADABLE';
  qualityNote?: string;
  isLowQualitySource?: boolean;
  scanDate: string;
  extractedSupplier: string;
  extractedGstin?: string;
  extractedInvoiceNo: string;
  extractedDate: string;
  extractedSubtotal?: number;
  extractedTax?: number;
  extractedDiscount?: number;
  extractedTotal: number;
  status: 'draft' | 'matching' | 'review_required' | 'approved' | 'rejected';
  items: OCRDraftItem[];
  approvedBy?: string;
  approvedAt?: string;
  auditTrailId?: string;
}

export interface TallySyncBatch {
  id: string;
  firmId: FirmId;
  batchNumber: string;
  fromDate: string;
  toDate: string;
  recordCount: number;
  totalAmount: number;
  status: 'synced' | 'pending' | 'failed';
  syncedAt?: string;
  syncNote: string;
}

export interface AuditLog {
  id: string;
  firmId?: FirmId;
  userId: string;
  userEmail: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}
