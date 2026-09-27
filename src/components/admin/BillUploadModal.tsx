import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  FileText,
  X,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  ShieldCheck,
  ArrowRight,
  FileCheck,
  FileUp,
  Sparkles,
  Image,
  Eye,
  RefreshCw,
  AlertCircle,
  ScanLine,
  Layers,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FIRMS } from '../../data/mockData';
import { OCRDraft } from '../../types';

interface BillLineItem {
  id: string;
  productName: string;
  brand: string;
  barcode: string;
  sku: string;
  unit: string; // Piece, Pair, Set, Packet, Box, Meter, Kg, etc.
  quantity: number;
  rate: number;
  mrp: number;
  gstPercent: number;
  discountPercent: number;
  confidence: number;
  hasWarning?: boolean;
  isMatched?: boolean;
  matchedProductId?: string;
}

export const BillUploadModal: React.FC = () => {
  const {
    isBillUploadOpen,
    setIsBillUploadOpen,
    adminFirm,
    currentUser,
    products,
    approveDraftBill,
    saveBillDraft,
    reviewDraft,
    setReviewDraft,
    openScanner,
  } = useApp();

  const firm = FIRMS[adminFirm];

  // Workflow steps:
  // 'upload' | 'camera_capture' | 'photo_preview' | 'quality_check' | 'extracting' | 'review' | 'confirmation_summary' | 'confirmed'
  const [step, setStep] = useState<
    | 'upload'
    | 'camera_capture'
    | 'photo_preview'
    | 'quality_check'
    | 'extracting'
    | 'review'
    | 'confirmation_summary'
    | 'confirmed'
  >('upload');

  // Source Bill metadata
  const [billSourceType, setBillSourceType] = useState<'photo' | 'gallery' | 'pdf' | 'none'>('photo');
  const [billFileName, setBillFileName] = useState('');
  const [billFileSize, setBillFileSize] = useState<number>(0);
  const [billPageCount, setBillPageCount] = useState<number>(1);
  const [billPreviewUrl, setBillPreviewUrl] = useState<string | null>(null);

  // Quality check state (Requirements K & L)
  const [qualityState, setQualityState] = useState<'GOOD' | 'WARNING' | 'UNREADABLE'>('GOOD');
  const [qualityMessage, setQualityMessage] = useState('');
  const [isLowQualitySource, setIsLowQualitySource] = useState(false);

  // Review Form Fields
  const [supplier, setSupplier] = useState('Atlas Cycle Industries Ltd');
  const [billNumber, setBillNumber] = useState('AT-INV-2026-9842');
  const [billDate, setBillDate] = useState('2026-09-25');
  const [gstin, setGstin] = useState('03AABCA1234F1Z8');
  const [cgst, setCgst] = useState(6);
  const [sgst, setSgst] = useState(6);

  // View Original Bill modal state
  const [viewOriginalModal, setViewOriginalModal] = useState(false);

  // Audit information after approval
  const [auditInfo, setAuditInfo] = useState<{
    auditId: string;
    message: string;
    approvedAt: string;
  } | null>(null);

  // Editable Bill Items (with loose/non-barcode items and units support)
  const [items, setItems] = useState<BillLineItem[]>([
    {
      id: 'item-1',
      productName: 'Atlas Ultimate 26T Hybrid Bicycle',
      brand: 'Atlas',
      barcode: '8901234500018',
      sku: 'ATL-MTB-26-BLK',
      unit: 'Piece',
      quantity: 5,
      rate: 5400,
      mrp: 7500,
      gstPercent: 12,
      discountPercent: 2,
      confidence: 0.96,
      isMatched: true,
      matchedProductId: 'prod-001',
    },
    {
      id: 'item-2',
      productName: 'High-Tensile Hub Axle Steel Bolts (Loose Spares)',
      brand: 'Genuine Spare',
      barcode: '', // LOOSE / NON-BARCODE ITEM (Requirement P)
      sku: 'SP-BOLT-M10',
      unit: 'Packet',
      quantity: 20,
      rate: 45,
      mrp: 75,
      gstPercent: 18,
      discountPercent: 0,
      confidence: 0.62,
      hasWarning: true,
      isMatched: false,
    },
    {
      id: 'item-3',
      productName: 'Atlas Precision Cycling Helmet (Matte Black)',
      brand: 'Atlas Pro',
      barcode: '8901234500070',
      sku: 'ATL-ACC-HLM-01',
      unit: 'Piece',
      quantity: 10,
      rate: 650,
      mrp: 1100,
      gstPercent: 18,
      discountPercent: 5,
      confidence: 0.94,
      isMatched: true,
      matchedProductId: 'prod-007',
    },
  ]);

  // Video stream refs for live document camera capture
  const videoCaptureRef = useRef<HTMLVideoElement | null>(null);
  const captureStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream helper
  const stopCaptureStream = () => {
    if (captureStreamRef.current) {
      captureStreamRef.current.getTracks().forEach((track) => track.stop());
      captureStreamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCaptureStream();
    };
  }, []);

  // When step changes to camera_capture, start hardware camera
  useEffect(() => {
    if (step === 'camera_capture') {
      let isMounted = true;
      async function startCaptureCamera() {
        try {
          if (!navigator.mediaDevices?.getUserMedia) return;
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
            audio: false,
          });
          if (!isMounted) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          captureStreamRef.current = stream;
          if (videoCaptureRef.current) {
            videoCaptureRef.current.srcObject = stream;
            videoCaptureRef.current.play().catch(() => {});
          }
        } catch {
          // Camera permission denied or unavailable
        }
      }
      startCaptureCamera();
      return () => {
        isMounted = false;
        stopCaptureStream();
      };
    } else {
      stopCaptureStream();
    }
  }, [step]);

  const handleClose = () => {
    stopCaptureStream();
    setIsBillUploadOpen(false);
    setReviewDraft(null);
    setStep('upload');
    setBillPreviewUrl(null);
    setIsLowQualitySource(false);
  };

  // ==========================================
  // H. TAKE PHOTO WORKFLOW
  // ==========================================
  const handleStartTakePhoto = () => {
    setBillSourceType('photo');
    setStep('camera_capture');
  };

  const handleCaptureSnapshot = () => {
    if (videoCaptureRef.current && canvasRef.current) {
      const video = videoCaptureRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setBillPreviewUrl(dataUrl);
        setBillFileName(`bill_photo_${Date.now().toString().slice(-6)}.jpg`);
        setBillFileSize(480000);
        setBillPageCount(1);
        stopCaptureStream();
        setStep('photo_preview');
      }
    } else {
      // Fallback preview
      setBillPreviewUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80');
      setBillFileName('captured_tax_invoice.jpg');
      setBillFileSize(512000);
      setBillPageCount(1);
      setStep('photo_preview');
    }
  };

  // ==========================================
  // I. GALLERY SELECTION WORKFLOW
  // ==========================================
  const handleSelectGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBillSourceType('gallery');
    setBillFileName(file.name);
    setBillFileSize(file.size);
    setBillPageCount(1);
    const url = URL.createObjectURL(file);
    setBillPreviewUrl(url);
    runQualityCheck(file.name, file.size, 'gallery');
  };

  // ==========================================
  // J. PDF UPLOAD WORKFLOW
  // ==========================================
  const handleSelectPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBillSourceType('pdf');
    setBillFileName(file.name);
    setBillFileSize(file.size);
    setBillPageCount(2); // Multi-page support
    setBillPreviewUrl(null);
    runQualityCheck(file.name, file.size, 'pdf');
  };

  // ==========================================
  // S. MANUAL PURCHASE WITHOUT BILL
  // ==========================================
  const handlePurchaseWithoutBill = () => {
    setBillSourceType('none');
    setBillFileName('No Bill Attached');
    setBillPreviewUrl(null);
    setSupplier('Direct Local Vendor');
    setBillNumber(`MANUAL-PUR-${Date.now().toString().slice(-5)}`);
    setStep('review');
  };

  // ==========================================
  // K & L. PRACTICAL IMAGE QUALITY CHECK (Requirements K & L)
  // ==========================================
  const runQualityCheck = (name: string, sizeBytes: number, type: 'photo' | 'gallery' | 'pdf') => {
    setStep('quality_check');

    // Simulate practical quality inspection
    setTimeout(() => {
      if (name.toLowerCase().includes('dark') || name.toLowerCase().includes('blur') || sizeBytes < 20000) {
        setQualityState('UNREADABLE');
        setQualityMessage('Image too blurred or resolution too low. Important GST and price areas cannot be deciphered.');
      } else if (name.toLowerCase().includes('glare') || sizeBytes < 90000) {
        setQualityState('WARNING');
        setQualityMessage('Bill image quality is poor (mild glare or low contrast). The bill may not be read accurately. Please verify the extracted information carefully.');
      } else {
        setQualityState('GOOD');
        setQualityMessage('Bill document clarity verified. Optimal resolution for OCR extraction.');
        // Automatically progress to extraction if GOOD
        setTimeout(() => {
          setStep('extracting');
          setTimeout(() => setStep('review'), 1200);
        }, 600);
      }
    }, 700);
  };

  // Testing quality scenarios directly
  const simulateQualityScenario = (scenario: 'GOOD' | 'WARNING' | 'UNREADABLE') => {
    setBillSourceType('gallery');
    setBillFileName(
      scenario === 'GOOD'
        ? 'atlas_tax_invoice_clear.jpg'
        : scenario === 'WARNING'
        ? 'supplier_bill_glare_warning.jpg'
        : 'blurred_dark_unreadable.jpg'
    );
    setBillFileSize(scenario === 'GOOD' ? 450000 : scenario === 'WARNING' ? 85000 : 15000);
    setBillPreviewUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80');
    setStep('quality_check');

    setTimeout(() => {
      setQualityState(scenario);
      if (scenario === 'GOOD') {
        setQualityMessage('Bill document clarity verified. Optimal resolution for OCR extraction.');
        setTimeout(() => {
          setStep('extracting');
          setTimeout(() => setStep('review'), 1200);
        }, 500);
      } else if (scenario === 'WARNING') {
        setQualityMessage('The bill may not be read accurately due to low lighting or light blur. Please verify the extracted information carefully.');
      } else {
        setQualityMessage('Image too blurred, bill is cropped, or image too dark. OCR engine cannot safely extract numbers.');
      }
    }, 600);
  };

  const handleContinueAnyway = () => {
    setIsLowQualitySource(true);
    setStep('extracting');
    setTimeout(() => setStep('review'), 1000);
  };

  // ==========================================
  // REVIEW & EDIT ITEM HANDLERS (Requirement N, O, P)
  // ==========================================
  const handleItemChange = (id: string, field: keyof BillLineItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // If barcode or name changes, check product matching
          if (field === 'barcode' || field === 'productName') {
            const matched = products.find(
              (p) =>
                (updated.barcode && p.barcode === updated.barcode) ||
                p.name.toLowerCase() === updated.productName.toLowerCase()
            );
            updated.isMatched = Boolean(matched);
            updated.matchedProductId = matched?.id;
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Scan barcode directly inside line items (Requirement T)
  const handleScanBarcodeForLine = (itemId: string) => {
    openScanner('BARCODE', (result) => {
      handleItemChange(itemId, 'barcode', result.code);
    }, 'Scan Line Item Barcode');
  };

  const handleAddItem = () => {
    const newItem: BillLineItem = {
      id: `item-${Date.now()}`,
      productName: 'Loose Cycle Bearing 1/4" Grade-A',
      brand: 'Master Hardware',
      barcode: '', // Barcode optional (Requirement P)
      sku: `SP-BRG-${Date.now().toString().slice(-4)}`,
      unit: 'Piece',
      quantity: 50,
      rate: 8,
      mrp: 15,
      gstPercent: 18,
      discountPercent: 0,
      confidence: 1.0,
      isMatched: false,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  const taxAmount = (subtotal * (cgst + sgst)) / 100;
  const grandTotal = subtotal + taxAmount;

  // Save Draft (Mandatory rule: Does not modify stock)
  const handleSaveDraft = () => {
    const draftId = `draft-${Date.now()}`;
    const draft: OCRDraft = {
      id: draftId,
      firmId: adminFirm,
      originalFileName: billFileName || 'manual_entry.pdf',
      originalFileType: billSourceType,
      originalFileData: billPreviewUrl || undefined,
      pageCount: billPageCount,
      fileSizeBytes: billFileSize,
      qualityState,
      isLowQualitySource,
      scanDate: new Date().toISOString().split('T')[0],
      extractedSupplier: supplier,
      extractedGstin: gstin,
      extractedInvoiceNo: billNumber,
      extractedDate: billDate,
      extractedTotal: grandTotal,
      status: 'review_required',
      items: items.map((i) => ({
        id: i.id,
        rawText: `${i.productName} qty:${i.quantity} rate:${i.rate}`,
        matchedProductId: i.matchedProductId,
        matchedProductName: i.productName,
        barcode: i.barcode,
        sku: i.sku,
        unit: i.unit,
        quantity: i.quantity,
        rate: i.rate,
        mrp: i.mrp,
        confidence: i.confidence,
        isVerified: false,
        isMatched: i.isMatched,
      })),
    };

    saveBillDraft(draft);
    handleClose();
    alert(`Draft saved with ID ${draftId}. Live inventory remains unchanged until approved.`);
  };

  // Final Approval (Mandatory Rule: ONLY this commits stock)
  const handleProceedToConfirmation = () => {
    setStep('confirmation_summary');
  };

  const handleFinalApproval = () => {
    const draftId = `draft-${Date.now()}`;
    const result = approveDraftBill(
      draftId,
      items.map((i) => ({
        productId: i.matchedProductId,
        productName: i.productName,
        barcode: i.barcode,
        sku: i.sku,
        quantity: Number(i.quantity),
        rate: Number(i.rate),
        salePrice: Number(i.mrp),
      })),
      {
        supplier,
        invoiceNo: billNumber,
        date: billDate,
      }
    );

    setAuditInfo({
      auditId: result.auditId,
      message: result.message,
      approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });

    setStep('confirmed');
  };

  if (!isBillUploadOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[94vh]">
        {/* Hidden Canvas for Camera Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* ======================================================== */}
        {/* MODAL HEADER */}
        {/* ======================================================== */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#781D22]/10 text-[#781D22] flex items-center justify-center">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 leading-tight">
                Add Purchase — Bill Entry ({firm.shortName})
              </h3>
              <p className="text-[11px] text-stone-500">
                Phase: {step.replace('_', ' ').toUpperCase()} · Mandate: Zero Silent Stock Edits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 'review' && billPreviewUrl && (
              <button
                onClick={() => setViewOriginalModal(true)}
                type="button"
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Original Bill</span>
              </button>
            )}

            <button
              onClick={handleClose}
              type="button"
              className="w-8 h-8 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL BODY */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Strict Mandate Notice */}
          <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Strict Business Rule:</span> Uploading or extracting a bill NEVER modifies inventory automatically.
              Extracted draft items must be verified, matched, and approved by an authorized administrator before being committed to live stock.
            </div>
          </div>

          {/* ==================================================== */}
          {/* G. BILL / INVOICE SECTION (Requirement G) */}
          {/* ==================================================== */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  BILL / INVOICE SOURCE
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select how you would like to import the supplier purchase invoice.
                </p>
              </div>

              {/* Three Large Touch Options (Requirement G) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Take Photo (Requirement H) */}
                <button
                  type="button"
                  onClick={handleStartTakePhoto}
                  className="p-5 rounded-2xl border-2 border-stone-200 hover:border-[#781D22] hover:bg-rose-50/30 transition-all text-center flex flex-col items-center justify-center gap-2.5 cursor-pointer group shadow-2xs active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#781D22] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-stone-900 block group-hover:text-[#781D22]">
                      Take Photo
                    </span>
                    <span className="text-[11px] text-stone-500">Live camera capture</span>
                  </div>
                </button>

                {/* 2. Gallery (Requirement I) */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="p-5 rounded-2xl border-2 border-stone-200 hover:border-stone-900 hover:bg-stone-50/70 transition-all text-center flex flex-col items-center justify-center gap-2.5 cursor-pointer group shadow-2xs active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Image className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-stone-900 block group-hover:text-stone-950">
                      Gallery
                    </span>
                    <span className="text-[11px] text-stone-500">JPG, PNG, WebP image</span>
                  </div>
                </button>

                {/* 3. PDF (Requirement J) */}
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="p-5 rounded-2xl border-2 border-stone-200 hover:border-blue-700 hover:bg-blue-50/40 transition-all text-center flex flex-col items-center justify-center gap-2.5 cursor-pointer group shadow-2xs active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-stone-900 block group-hover:text-blue-900">
                      PDF Document
                    </span>
                    <span className="text-[11px] text-stone-500">Multi-page tax invoices</span>
                  </div>
                </button>
              </div>

              {/* Hidden File Inputs */}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleSelectGallery}
              />
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleSelectPdf}
              />

              {/* S. Add Purchase Without Bill (Requirement S) */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handlePurchaseWithoutBill}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline cursor-pointer"
                >
                  + Add Purchase Without Bill (Manual Entry)
                </button>
              </div>

              {/* Quality Testing Triggers for AI Studio Preview */}
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Test OCR Quality Checks &amp; Scenarios (AI Studio Preview):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => simulateQualityScenario('GOOD')}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-900 font-semibold text-left cursor-pointer"
                  >
                    <span>✓ Clear Bill (Good Quality)</span>
                    <span className="block text-[10px] text-emerald-700 font-normal">
                      Passes straight to extraction
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => simulateQualityScenario('WARNING')}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-900 font-semibold text-left cursor-pointer"
                  >
                    <span>⚠️ Poor Lighting (Warning)</span>
                    <span className="block text-[10px] text-amber-700 font-normal">
                      Prompts review &amp; flags values
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => simulateQualityScenario('UNREADABLE')}
                    className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-900 font-semibold text-left cursor-pointer"
                  >
                    <span>✕ Blurred Bill (Unreadable)</span>
                    <span className="block text-[10px] text-rose-700 font-normal">
                      Rejects and prompts retake
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* H. LIVE CAMERA CAPTURE (Requirement H) */}
          {/* ==================================================== */}
          {step === 'camera_capture' && (
            <div className="space-y-4">
              <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl bg-black overflow-hidden flex items-center justify-center border-2 border-stone-800 shadow-md">
                <video ref={videoCaptureRef} playsInline muted className="w-full h-full object-cover" />

                {/* Document Bill Capture Frame Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-5/6 h-5/6 border-2 border-white/80 rounded-xl relative shadow-xl">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400" />
                  </div>
                </div>

                <div className="absolute top-3 inset-x-3 text-center pointer-events-none">
                  <div className="inline-block px-3 py-1.5 rounded-full bg-black/75 text-white text-[11px] font-medium backdrop-blur-xs">
                    Place complete bill inside the frame · Avoid glare &amp; shadows
                  </div>
                </div>
              </div>

              {/* Capture Instructions & Action Bar */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="flex-1 py-3 rounded-2xl bg-[#781D22] text-white text-xs font-bold hover:bg-[#62161b] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Photo of Bill</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PHOTO PREVIEW (Requirement H) */}
          {/* ==================================================== */}
          {step === 'photo_preview' && billPreviewUrl && (
            <div className="space-y-4">
              <div className="aspect-16/10 rounded-2xl overflow-hidden border border-stone-300 bg-stone-100 flex items-center justify-center">
                <img
                  src={billPreviewUrl}
                  alt="Captured Bill Preview"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('camera_capture')}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer"
                >
                  Retake Photo
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('upload')}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => runQualityCheck(billFileName, billFileSize, 'photo')}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
                  >
                    Use Photo &amp; Run Quality Check &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* K & L. QUALITY CHECK RESULTS (Requirements K & L) */}
          {/* ==================================================== */}
          {step === 'quality_check' && (
            <div className="py-8 text-center space-y-4">
              {qualityState === 'GOOD' ? (
                <div className="space-y-2 animate-in fade-in">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900">Good Quality Verified</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">{qualityMessage}</p>
                </div>
              ) : qualityState === 'WARNING' ? (
                <div className="space-y-3 animate-in fade-in p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left max-w-lg mx-auto">
                  <div className="flex items-center gap-2.5 text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                    <span className="font-bold text-sm">⚠ Bill Image Quality is Poor</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {qualityMessage}
                  </p>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('upload')}
                      className="px-4 py-2 rounded-xl border border-amber-300 bg-white text-stone-800 text-xs font-semibold cursor-pointer"
                    >
                      Retake / Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueAnyway}
                      className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold hover:bg-amber-900 cursor-pointer"
                    >
                      Continue Anyway (Flag Uncertain Fields)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left max-w-lg mx-auto">
                  <div className="flex items-center gap-2.5 text-rose-900">
                    <AlertCircle className="w-5 h-5 text-rose-700" />
                    <span className="font-bold text-sm">Unable to Read This Bill</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    {qualityMessage}
                  </p>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('camera_capture')}
                      className="px-4 py-2 rounded-xl bg-rose-800 text-white text-xs font-bold hover:bg-rose-900 cursor-pointer"
                    >
                      Retake Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('upload')}
                      className="px-4 py-2 rounded-xl border border-rose-300 bg-white text-stone-800 text-xs font-semibold cursor-pointer"
                    >
                      Choose Another File
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* M. EXTRACTING / OCR PROCESSING */}
          {/* ==================================================== */}
          {step === 'extracting' && (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center text-[#781D22] animate-pulse">
                <Sparkles className="w-7 h-7 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-stone-900">
                Extracting Invoice Fields &amp; Matching Products...
              </h4>
              <p className="text-xs text-stone-500">
                Parsing Supplier, GSTIN, line items, and prices into Draft record.
              </p>
            </div>
          )}

          {/* ==================================================== */}
          {/* N, O, P. PURCHASE REVIEW & EDIT SCREEN */}
          {/* ==================================================== */}
          {step === 'review' && (
            <div className="space-y-4">
              {/* Quality Banner if low quality source */}
              {isLowQualitySource && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between">
                  <span className="font-bold">LOW QUALITY SOURCE: Please inspect highlighted fields carefully.</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 font-bold uppercase">
                    Audit Flagged
                  </span>
                </div>
              )}

              {/* Invoice Meta Grid */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                    Invoice #
                  </label>
                  <input
                    type="text"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 font-mono font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                    Bill Date
                  </label>
                  <input
                    type="date"
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                    Supplier GSTIN
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 font-mono bg-white"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Bill Line Items ({items.length})
                  </h4>
                  <button
                    onClick={handleAddItem}
                    type="button"
                    className="text-xs font-bold text-[#781D22] hover:underline cursor-pointer"
                  >
                    + Add Non-Barcode / Loose Spare Item
                  </button>
                </div>

                <div className="border border-stone-200 rounded-2xl overflow-x-auto bg-white">
                  <table className="w-full text-left text-xs min-w-[750px]">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[10px] uppercase font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Product Name &amp; Matching</th>
                        <th className="py-2.5 px-2">Barcode / SKU</th>
                        <th className="py-2.5 px-2">Unit</th>
                        <th className="py-2.5 px-2 text-right">Qty</th>
                        <th className="py-2.5 px-2 text-right">Purchase Rate</th>
                        <th className="py-2.5 px-2 text-right">MRP / Sale</th>
                        <th className="py-2.5 px-2 text-right">Total</th>
                        <th className="py-2.5 px-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {items.map((item) => {
                        const lineTotal = item.quantity * item.rate;
                        const isUncertain = item.confidence < 0.7 || item.hasWarning;
                        return (
                          <tr key={item.id} className={isUncertain ? 'bg-amber-50/40' : ''}>
                            {/* Product Name & Matching Status (Requirement O) */}
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={item.productName}
                                onChange={(e) =>
                                  handleItemChange(item.id, 'productName', e.target.value)
                                }
                                className="w-full font-bold text-stone-900 border-b border-dashed border-stone-300 focus:outline-hidden"
                              />
                              <div className="flex items-center gap-1.5 mt-1">
                                {item.isMatched ? (
                                  <span className="inline-block px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                                    MATCHED
                                  </span>
                                ) : (
                                  <span className="inline-block px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-[9px] font-bold">
                                    NEW / UNMATCHED
                                  </span>
                                )}
                                {isUncertain && (
                                  <span className="inline-block px-1.5 py-0.5 rounded-sm bg-rose-100 text-rose-800 text-[9px] font-bold">
                                    ⚠ Verify Rate
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Barcode & SKU (Optional for loose parts) */}
                            <td className="py-2 px-2">
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  placeholder="Barcode (Optional)"
                                  value={item.barcode}
                                  onChange={(e) =>
                                    handleItemChange(item.id, 'barcode', e.target.value)
                                  }
                                  className="w-24 font-mono text-[11px] border-b border-dashed border-stone-300 focus:outline-hidden"
                                />
                                <button
                                  onClick={() => handleScanBarcodeForLine(item.id)}
                                  type="button"
                                  title="Scan Barcode for this item (Requirement T)"
                                  className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700"
                                >
                                  <ScanLine className="w-3 h-3" />
                                </button>
                              </div>
                              <input
                                type="text"
                                placeholder="SKU"
                                value={item.sku}
                                onChange={(e) => handleItemChange(item.id, 'sku', e.target.value)}
                                className="w-24 text-[10px] text-stone-400 font-mono border-b border-dashed border-stone-200 focus:outline-hidden mt-0.5"
                              />
                            </td>

                            {/* Unit (Requirement P: Piece, Packet, Box, Meter, Kg, etc.) */}
                            <td className="py-2 px-2">
                              <select
                                value={item.unit}
                                onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                                className="px-1.5 py-1 rounded-md border border-stone-200 text-[11px] bg-white font-medium"
                              >
                                <option value="Piece">Piece</option>
                                <option value="Pair">Pair</option>
                                <option value="Set">Set</option>
                                <option value="Packet">Packet</option>
                                <option value="Box">Box</option>
                                <option value="Meter">Meter</option>
                                <option value="Kg">Kg</option>
                              </select>
                            </td>

                            {/* Qty */}
                            <td className="py-2 px-2 text-right">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(item.id, 'quantity', Number(e.target.value))
                                }
                                className="w-14 text-right font-bold tabular-nums border-b border-dashed border-stone-300 focus:outline-hidden"
                              />
                            </td>

                            {/* Purchase Rate */}
                            <td className="py-2 px-2 text-right">
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) =>
                                  handleItemChange(item.id, 'rate', Number(e.target.value))
                                }
                                className="w-16 text-right font-bold tabular-nums border-b border-dashed border-stone-300 focus:outline-hidden"
                              />
                            </td>

                            {/* Sale Price */}
                            <td className="py-2 px-2 text-right">
                              <input
                                type="number"
                                value={item.mrp}
                                onChange={(e) =>
                                  handleItemChange(item.id, 'mrp', Number(e.target.value))
                                }
                                className="w-16 text-right tabular-nums text-stone-600 border-b border-dashed border-stone-300 focus:outline-hidden"
                              />
                            </td>

                            <td className="py-2 px-2 text-right font-bold text-stone-900 tabular-nums">
                              ₹{lineTotal.toLocaleString('en-IN')}
                            </td>

                            <td className="py-2 px-2 text-center">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-stone-400 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-stone-500">
                  <span>Lines: {items.length}</span> ·{' '}
                  <span>Total Quantity: {items.reduce((acc, i) => acc + i.quantity, 0)} units</span>
                </div>
                <div className="flex items-center gap-6 font-semibold">
                  <div>
                    <span className="text-stone-500 mr-1.5">Tax ({cgst + sgst}%):</span>
                    <span className="tabular-nums">₹{Math.round(taxAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 mr-1.5">Grand Total:</span>
                    <span className="text-base font-bold text-stone-900 tabular-nums">
                      ₹{Math.round(grandTotal).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Q. Mandatory Action Buttons (Requirement Q) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
                >
                  Discard
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold cursor-pointer"
                  >
                    Save Draft (No Stock Change)
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToConfirmation}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#781D22] hover:bg-[#62161b] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Approve &amp; Add to Inventory</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* CONFIRMATION SUMMARY MODAL BEFORE FINAL COMMIT (Requirement Q) */}
          {/* ==================================================== */}
          {step === 'confirmation_summary' && (
            <div className="space-y-4 max-w-md mx-auto py-4 text-left">
              <div className="text-center">
                <h4 className="text-base font-bold text-stone-900">
                  Confirm Inventory Credit
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Confirming will permanently commit these purchased items into live website inventory.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-stone-500">Destination Firm:</span>
                  <span className="font-bold text-[#781D22]">{firm.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Supplier:</span>
                  <span className="font-bold text-stone-800">{supplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Bill Number:</span>
                  <span className="font-mono font-bold text-stone-800">{billNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Lines / Units:</span>
                  <span className="font-bold text-stone-900">
                    {items.length} lines ({items.reduce((acc, i) => acc + i.quantity, 0)} units)
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1.5 font-bold text-sm">
                  <span>Grand Total:</span>
                  <span className="tabular-nums">₹{Math.round(grandTotal).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                >
                  Back to Review
                </button>
                <button
                  type="button"
                  onClick={handleFinalApproval}
                  className="flex-1 py-2.5 rounded-xl bg-[#781D22] text-white text-xs font-bold hover:bg-[#62161b] cursor-pointer shadow-xs"
                >
                  Confirm &amp; Commit Stock
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* CONFIRMED & AUDITED RECORD (Requirement Q & V) */}
          {/* ==================================================== */}
          {step === 'confirmed' && auditInfo && (
            <div className="py-8 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-stone-900">
                  Purchase Approved &amp; Stock Updated!
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                  {auditInfo.message}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-stone-200 pb-1.5 font-bold text-stone-800">
                  <span>Audit Trail Record:</span>
                  <span className="font-mono text-stone-900">{auditInfo.auditId}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Approving Admin:</span>
                  <span className="font-semibold text-stone-800">{currentUser?.name || 'Administrator'}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Committed Firm:</span>
                  <span className="font-semibold text-[#781D22]">{firm.name}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Timestamp:</span>
                  <span className="font-mono">{auditInfo.approvedAt}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Done &amp; Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* R. VIEW ORIGINAL BILL MODAL (Requirement R) */}
      {/* ==================================================== */}
      {viewOriginalModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900">Original Source Bill</h4>
                <p className="text-[11px] text-stone-500 font-mono">{billFileName}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewOriginalModal(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto flex items-center justify-center bg-stone-50 rounded-2xl p-2">
              {billPreviewUrl ? (
                <img
                  src={billPreviewUrl}
                  alt="Original Document"
                  className="max-h-[60vh] object-contain rounded-xl"
                />
              ) : (
                <div className="py-12 text-center text-stone-400">
                  <FileText className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-xs">PDF Document: {billFileName}</p>
                </div>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setViewOriginalModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
