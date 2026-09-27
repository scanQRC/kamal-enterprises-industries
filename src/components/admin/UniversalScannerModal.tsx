import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  ScanLine,
  X,
  ArrowLeft,
  Camera,
  Flashlight,
  AlertCircle,
  CheckCircle2,
  Plus,
  Receipt,
  Truck,
  Wrench,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FIRMS } from '../../data/mockData';
import { Product } from '../../types';

export const UniversalScannerModal: React.FC = () => {
  const {
    isScannerOpen,
    closeScanner,
    scannerMode,
    setScannerMode,
    scannerCallback,
    scannerContextTitle,
    adminFirm,
    products,
    productStocks,
    adjustStock,
    setActiveAdminModule,
    setIsAddProductOpen,
    setPrefilledBarcode,
    currentUser,
  } = useApp();

  const firm = FIRMS[adminFirm];
  const isSuperAdmin = currentUser?.allowedFirms.length === 2;

  // Camera State
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  // Scanned Results
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<{
    type: 'qr' | 'barcode';
    code: string;
    payload?: any;
  } | null>(null);

  // Barcode specific state
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  const [isBarcodeNotFound, setIsBarcodeNotFound] = useState(false);
  const [stockNotice, setStockNotice] = useState<string | null>(null);

  // QR specific state
  const [qrActionType, setQrActionType] = useState<
    'invoice' | 'product' | 'repair' | 'payment' | 'general' | 'unknown' | null
  >(null);
  const [qrDetails, setQrDetails] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup helper: Always stop tracks and turn off torch
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsTorchOn(false);
    setTorchSupported(false);
  };

  // Camera streaming lifecycle
  useEffect(() => {
    if (!isScannerOpen || scannerMode === 'CHOICE') {
      stopCameraStream();
      setHasCamera(null);
      setCameraError(null);
      setScannedResult(null);
      setMatchedProduct(null);
      setIsBarcodeNotFound(false);
      setQrActionType(null);
      return;
    }

    let isMounted = true;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access is not supported in this browser environment.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setHasCamera(true);
        setCameraError(null);

        // Check torch support
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          const caps: any = (videoTrack.getCapabilities && videoTrack.getCapabilities()) || {};
          if (caps.torch) {
            setTorchSupported(true);
          }
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        if (isMounted) {
          setHasCamera(false);
          setCameraError(
            err.name === 'NotAllowedError'
              ? 'Camera permission denied. You can use manual entry or test codes below.'
              : 'Camera hardware is busy or unavailable. Please use the manual fallback.'
          );
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      stopCameraStream();
    };
  }, [isScannerOpen, scannerMode]);

  // Torch Toggle
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const next = !isTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: next }],
        });
        setIsTorchOn(next);
      } catch {
        // Torch constraint not allowed or failed
      }
    }
  };

  // Close & release
  const handleClose = () => {
    stopCameraStream();
    closeScanner();
  };

  const handleBack = () => {
    if (scannerMode !== 'CHOICE') {
      stopCameraStream();
      setScannerMode('CHOICE');
      setScannedResult(null);
      setMatchedProduct(null);
      setIsBarcodeNotFound(false);
      setQrActionType(null);
    } else {
      handleClose();
    }
  };

  // ==========================================
  // BARCODE PROCESSING ENGINE
  // ==========================================
  const handleProcessBarcode = (code: string) => {
    const clean = code.trim();
    if (!clean) return;

    // If caller provided a direct callback (e.g. from Add Purchase or Billing)
    if (scannerCallback) {
      scannerCallback({ type: 'barcode', code: clean });
      handleClose();
      return;
    }

    setScannedResult({ type: 'barcode', code: clean });

    // Look up in firm's product catalog
    const prod = products.find(
      (p) => p.barcode === clean && p.applicableFirms.includes(adminFirm)
    );

    if (prod) {
      setMatchedProduct(prod);
      setIsBarcodeNotFound(false);
    } else {
      setMatchedProduct(null);
      setIsBarcodeNotFound(true);
    }
  };

  // ==========================================
  // QR PROCESSING & VALIDATION ENGINE
  // ==========================================
  const handleProcessQR = (payload: string) => {
    const clean = payload.trim();
    if (!clean) return;

    if (scannerCallback) {
      scannerCallback({ type: 'qr', code: clean, payload: clean });
      handleClose();
      return;
    }

    setScannedResult({ type: 'qr', code: clean });

    // Validate Kamal-supported QR payloads
    if (clean.startsWith('kamal://invoice/') || clean.includes('invoice/')) {
      const invNo = clean.replace('kamal://invoice/', '');
      setQrActionType('invoice');
      setQrDetails({
        invoiceNo: invNo,
        firm: firm.name,
        date: new Date().toISOString().split('T')[0],
        status: 'Generated & Reconciled',
        amount: 21349,
      });
    } else if (clean.startsWith('kamal://product/') || clean.startsWith('prod-')) {
      const prodId = clean.replace('kamal://product/', '');
      const prod = products.find((p) => p.id === prodId || p.barcode === prodId);
      if (prod) {
        setQrActionType('product');
        setQrDetails(prod);
      } else {
        setQrActionType('unknown');
      }
    } else if (clean.startsWith('kamal://repair/') || clean.includes('repair/')) {
      const cardNo = clean.replace('kamal://repair/', '');
      setQrActionType('repair');
      setQrDetails({
        jobCardNo: cardNo,
        model: 'Avon Hybrid 26T',
        status: 'READY FOR DELIVERY',
        labour: 350,
      });
    } else if (clean.startsWith('upi://pay')) {
      setQrActionType('payment');
      setQrDetails({
        rawUri: clean,
        title: 'UPI Merchant Payment QR',
        beneficiary: 'Kamal Business Enterprise',
      });
    } else if (clean.startsWith('http://') || clean.startsWith('https://')) {
      setQrActionType('general');
      setQrDetails({ url: clean });
    } else {
      setQrActionType('unknown');
    }
  };

  // Context Actions for Barcode Results
  const handleQuickStock = (delta: number) => {
    if (!matchedProduct) return;
    adjustStock(matchedProduct.id, adminFirm, delta);
    setStockNotice(`Stock adjusted by ${delta > 0 ? '+' : ''}${delta}`);
    setTimeout(() => setStockNotice(null), 2500);
  };

  const handleAddToSale = () => {
    handleClose();
    setActiveAdminModule('sale-billing');
  };

  const handleAddToPurchase = () => {
    handleClose();
    setActiveAdminModule('purchase-ocr');
  };

  const handleStartAddProduct = () => {
    if (scannedResult?.code) {
      setPrefilledBarcode(scannedResult.code);
    }
    handleClose();
    setIsAddProductOpen(true);
  };

  if (!isScannerOpen) return null;

  const currentFirmStock = matchedProduct
    ? productStocks.find((s) => s.productId === matchedProduct.id && s.firmId === adminFirm)
        ?.currentStock ?? 0
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]">
        {/* ======================================================== */}
        {/* HEADER: Title & Back / Close */}
        {/* ======================================================== */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/90">
          <div className="flex items-center gap-2.5">
            {scannerMode !== 'CHOICE' ? (
              <button
                onClick={handleBack}
                type="button"
                className="w-8 h-8 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-[#D4AF37]" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-stone-900 leading-tight">
                {scannerMode === 'CHOICE'
                  ? 'Universal Scanner'
                  : scannerMode === 'QR'
                  ? 'QR Scanner'
                  : 'Barcode Scanner'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {scannerContextTitle || `Tenant: ${firm.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Flash / Torch button where supported */}
            {torchSupported && scannerMode !== 'CHOICE' && (
              <button
                onClick={toggleTorch}
                type="button"
                className={`p-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                  isTorchOn
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Flashlight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleClose}
              type="button"
              className="w-8 h-8 rounded-full hover:bg-stone-200/80 flex items-center justify-center text-stone-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BODY: Mode Choice OR Live Camera OR Results */}
        {/* ======================================================== */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* ==================================================== */}
          {/* A. SELECTION SCREEN (Requirement A) */}
          {/* ==================================================== */}
          {scannerMode === 'CHOICE' && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <h4 className="text-base font-bold text-stone-900">Select Scanning Mode</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Choose between 2D QR validation and 1D retail barcode item lookup.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {/* 1. Scan QR Card */}
                <button
                  type="button"
                  onClick={() => setScannerMode('QR')}
                  className="p-5 rounded-2xl border-2 border-stone-200 hover:border-stone-900 hover:bg-stone-50/70 transition-all text-left flex flex-col justify-between gap-3 cursor-pointer group shadow-2xs active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <QrCode className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-stone-900 block group-hover:text-blue-900">
                      Scan QR Code
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                      Invoices, warranty certificates, service job cards &amp; digital payments.
                    </span>
                  </div>
                </button>

                {/* 2. Scan Barcode Card */}
                <button
                  type="button"
                  onClick={() => setScannerMode('BARCODE')}
                  className="p-5 rounded-2xl border-2 border-stone-200 hover:border-[#781D22] hover:bg-rose-50/40 transition-all text-left flex flex-col justify-between gap-3 cursor-pointer group shadow-2xs active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#781D22] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ScanLine className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-stone-900 block group-hover:text-[#781D22]">
                      Scan Barcode
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                      Product catalogue lookups, live floor stock counts, and POS counter billing.
                    </span>
                  </div>
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={handleClose}
                  type="button"
                  className="px-6 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel / Return
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* B. LIVE CAMERA PREVIEW (QR OR BARCODE) */}
          {/* ==================================================== */}
          {scannerMode !== 'CHOICE' && !scannedResult && (
            <div className="space-y-4">
              {/* Viewfinder Video Frame */}
              <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl bg-black overflow-hidden flex items-center justify-center border-2 border-stone-800 shadow-md">
                {hasCamera ? (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Mode Specific Scan Reticle */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {scannerMode === 'QR' ? (
                        /* Square QR Frame */
                        <div className="w-52 h-52 border-2 border-blue-400 rounded-2xl relative shadow-lg">
                          <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-white" />
                          <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-white" />
                          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-white" />
                          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-white" />
                          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 shadow-sm animate-pulse" />
                        </div>
                      ) : (
                        /* Wide Horizontal Barcode Frame */
                        <div className="w-4/5 h-36 border-2 border-red-500/90 rounded-xl relative shadow-lg">
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white" />
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white" />
                          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-red-500 shadow-sm animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                      <span className="px-3.5 py-1 rounded-full bg-black/75 text-white text-[11px] font-semibold backdrop-blur-xs">
                        {scannerMode === 'QR' ? 'Place QR inside frame' : 'Align retail barcode inside frame'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-stone-300">
                    <Camera className="w-10 h-10 mx-auto text-stone-500 mb-2 opacity-60" />
                    <p className="text-xs font-semibold text-stone-200">
                      {cameraError || 'Activating camera hardware...'}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1 max-w-xs mx-auto">
                      Point rear camera at target or use the quick test triggers below.
                    </p>
                  </div>
                )}
              </div>

              {/* Mode Specific Quick Test triggers */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  {scannerMode === 'QR' ? 'Quick Test QR Payloads' : 'Quick Test Retail Barcodes'}
                </label>

                {scannerMode === 'QR' ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => handleProcessQR('kamal://invoice/KE-INV-26-00142')}
                      type="button"
                      className="p-2 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer"
                    >
                      <span className="font-bold text-stone-900 block truncate">Kamal Invoice QR</span>
                      <span className="text-[10px] text-stone-500 font-mono">KE-INV-26-00142</span>
                    </button>
                    <button
                      onClick={() => handleProcessQR('kamal://product/prod-001')}
                      type="button"
                      className="p-2 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer"
                    >
                      <span className="font-bold text-stone-900 block truncate">Product QR</span>
                      <span className="text-[10px] text-stone-500 font-mono">Avon 26T Hybrid</span>
                    </button>
                    <button
                      onClick={() => handleProcessQR('kamal://repair/JC-26-0041')}
                      type="button"
                      className="p-2 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer"
                    >
                      <span className="font-bold text-stone-900 block truncate">Workshop Job Card</span>
                      <span className="text-[10px] text-stone-500 font-mono">JC-26-0041</span>
                    </button>
                    <button
                      onClick={() => handleProcessQR('unknown://invalid-payload-7711')}
                      type="button"
                      className="p-2 text-left rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 cursor-pointer"
                    >
                      <span className="font-bold text-amber-900 block truncate">Unrecognized QR</span>
                      <span className="text-[10px] text-amber-700 font-mono">Invalid payload</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => handleProcessBarcode('8901234500018')}
                      type="button"
                      className="p-2 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer"
                    >
                      <span className="font-bold text-stone-900 block truncate">Avon 26T Hybrid</span>
                      <span className="text-[10px] text-stone-500 font-mono">EAN-13: 8901234500018</span>
                    </button>
                    <button
                      onClick={() => handleProcessBarcode('8901234500056')}
                      type="button"
                      className="p-2 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer"
                    >
                      <span className="font-bold text-stone-900 block truncate">Pigeon Gas Stove</span>
                      <span className="text-[10px] text-stone-500 font-mono">EAN-13: 8901234500056</span>
                    </button>
                    <button
                      onClick={() => handleProcessBarcode('8901234500049')}
                      type="button"
                      className="p-2 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer"
                    >
                      <span className="font-bold text-stone-900 block truncate">Hero Hawk 27T</span>
                      <span className="text-[10px] text-stone-500 font-mono">EAN-13: 8901234500049</span>
                    </button>
                    <button
                      onClick={() => handleProcessBarcode('8909999887711')}
                      type="button"
                      className="p-2 text-left rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 cursor-pointer"
                    >
                      <span className="font-bold text-amber-900 block truncate">Unregistered Code</span>
                      <span className="text-[10px] text-amber-700 font-mono">8909999887711</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Manual Entry Fallback (Requirement D) */}
              <div className="pt-2 border-t border-stone-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (scannerMode === 'QR') {
                      handleProcessQR(manualCode);
                    } else {
                      handleProcessBarcode(manualCode);
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder={
                      scannerMode === 'QR'
                        ? 'Enter QR payload or URL...'
                        : 'Enter Barcode Manually (EAN-13 / Code 128)...'
                    }
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-hidden focus:border-stone-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* C. QR DETECTED RESULTS (Requirement B) */}
          {/* ==================================================== */}
          {scannerMode === 'QR' && scannedResult && (
            <div className="space-y-4 animate-in fade-in text-left">
              {qrActionType === 'invoice' && qrDetails && (
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200/80">
                    <span className="font-bold uppercase text-blue-900">Kamal Tax Invoice Verified</span>
                    <span className="font-mono text-stone-600">{qrDetails.invoiceNo}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Series: {qrDetails.invoiceNo}</h4>
                    <p className="text-stone-600 mt-0.5">Firm: {qrDetails.firm} · Date: {qrDetails.date}</p>
                    <p className="text-base font-serif font-bold text-stone-900 mt-2">
                      Total: ₹{qrDetails.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        handleClose();
                        setActiveAdminModule('sale-billing');
                      }}
                      type="button"
                      className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white font-bold cursor-pointer text-center"
                    >
                      Open in Billing Workstation
                    </button>
                  </div>
                </div>
              )}

              {qrActionType === 'product' && qrDetails && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                    <span className="font-bold uppercase text-emerald-900">Product Authenticity QR</span>
                    <span className="font-mono text-stone-600">{qrDetails.sku}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{qrDetails.name}</h4>
                    <p className="text-stone-600 mt-0.5">{qrDetails.brand} · Price: ₹{qrDetails.indicativePrice}</p>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        handleClose();
                        setActiveAdminModule('stock-search');
                      }}
                      type="button"
                      className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white font-bold cursor-pointer text-center"
                    >
                      View Live Stock
                    </button>
                  </div>
                </div>
              )}

              {qrActionType === 'repair' && qrDetails && (
                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-200/80">
                    <span className="font-bold uppercase text-rose-900">Workshop Job Card QR</span>
                    <span className="font-mono text-stone-600">{qrDetails.jobCardNo}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{qrDetails.model}</h4>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-bold">
                      {qrDetails.status}
                    </span>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        handleClose();
                        setActiveAdminModule('repair-service');
                      }}
                      type="button"
                      className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white font-bold cursor-pointer text-center"
                    >
                      Open Workshop Job Card
                    </button>
                  </div>
                </div>
              )}

              {qrActionType === 'unknown' && (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-stone-900">QR Not Recognized</h4>
                    <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                      This QR payload does not correspond to any active Kamal invoice, product, or workshop record.
                    </p>
                    <p className="text-[11px] font-mono text-stone-400 mt-2 truncate">
                      Payload: {scannedResult.code}
                    </p>
                  </div>
                  <div className="pt-2 flex gap-2 justify-center">
                    <button
                      onClick={() => setScannedResult(null)}
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs cursor-pointer"
                    >
                      Scan Again
                    </button>
                    <button
                      onClick={handleBack}
                      type="button"
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* D. BARCODE FOUND RESULTS (Requirement C) */}
          {/* ==================================================== */}
          {scannerMode === 'BARCODE' && matchedProduct && (
            <div className="space-y-4 animate-in fade-in text-left">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Product Verified
                    </span>
                    <span className="font-mono text-xs text-stone-500">
                      Barcode: {matchedProduct.barcode}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-stone-900 mt-1">{matchedProduct.name}</h4>
                  <p className="text-xs text-stone-600 truncate">
                    {matchedProduct.brand} · SKU: {matchedProduct.sku} · Category: {matchedProduct.categoryId}
                  </p>
                </div>
              </div>

              {/* Product metrics & pricing */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 block uppercase font-medium">
                    Current Stock
                  </span>
                  <span
                    className={`text-lg font-bold tabular-nums ${
                      currentFirmStock > 4 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {currentFirmStock} units
                  </span>
                  <span className="text-[10px] text-stone-400 block truncate">{firm.shortName}</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 block uppercase font-medium">
                    Sale Price
                  </span>
                  <span className="text-lg font-bold text-stone-900 tabular-nums">
                    ₹{matchedProduct.indicativePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-stone-400 block">MRP: ₹{matchedProduct.mrp}</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 block uppercase font-medium">
                    Purchase Rate
                  </span>
                  <span className="text-lg font-bold text-stone-700 tabular-nums">
                    {isSuperAdmin
                      ? `₹${Math.round(matchedProduct.indicativePrice * 0.78).toLocaleString('en-IN')}`
                      : 'Protected'}
                  </span>
                  <span className="text-[10px] text-stone-400 block">Authorized Role</span>
                </div>
              </div>

              {stockNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold text-center animate-in fade-in">
                  ✓ {stockNotice}
                </div>
              )}

              {/* Context Actions (Requirement C) */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToSale}
                    type="button"
                    className="py-2.5 px-3 rounded-xl bg-[#781D22] text-white text-xs font-bold hover:bg-[#62161b] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Add to Sale</span>
                  </button>

                  <button
                    onClick={handleAddToPurchase}
                    type="button"
                    className="py-2.5 px-3 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Add to Purchase</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickStock(1)}
                    type="button"
                    className="py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold cursor-pointer"
                  >
                    +1 Stock In
                  </button>
                  <button
                    onClick={() => handleQuickStock(-1)}
                    type="button"
                    disabled={currentFirmStock <= 0}
                    className="py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 disabled:opacity-40 text-stone-800 text-xs font-semibold cursor-pointer"
                  >
                    -1 Stock Out
                  </button>
                </div>

                <button
                  onClick={() => {
                    setScannedResult(null);
                    setMatchedProduct(null);
                  }}
                  type="button"
                  className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                >
                  Scan Another Code
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* E. BARCODE NOT FOUND (Requirement C) */}
          {/* ==================================================== */}
          {scannerMode === 'BARCODE' && isBarcodeNotFound && scannedResult && (
            <div className="space-y-4 animate-in fade-in text-center p-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900">Product Not Found</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Barcode <span className="font-mono font-bold text-stone-800">{scannedResult.code}</span> is not registered under {firm.name}.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 text-left">
                <p className="font-bold text-stone-800 mb-1">Recommended Action:</p>
                <p className="text-[11px] leading-relaxed">
                  Register this item in the master catalogue. The scanned barcode will be pre-filled automatically.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleStartAddProduct}
                  type="button"
                  className="w-full py-3 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add New Product with This Barcode</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setScannedResult(null);
                      setIsBarcodeNotFound(false);
                    }}
                    type="button"
                    className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                  >
                    Scan Again
                  </button>
                  <button
                    onClick={handleBack}
                    type="button"
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
