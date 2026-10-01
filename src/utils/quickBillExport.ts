import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QuickBill } from '../types/quickbill';

/**
 * Generates a clean, crisp PDF from the document DOM container
 */
export async function generateBillPdf(
  element: HTMLElement,
  bill: QuickBill
): Promise<{ blob: Blob; filename: string }> {
  const docTitle = bill.docType === 'quotation' ? 'Quotation' : 'Bill';
  const filename = `${docTitle}_${bill.billNo.replace(/[^a-zA-Z0-9_-]/g, '_')}_${bill.date}.pdf`;

  // Render to canvas with 2x scale for sharp text & lines
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // A4 portrait dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Margins in mm
  const margin = 10;
  const contentWidth = pdfWidth - margin * 2;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  // Add image scaled to fit A4 width
  pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, Math.min(contentHeight, pdfHeight - margin * 2));

  const blob = pdf.output('blob');
  return { blob, filename };
}

/**
 * Downloads generated PDF directly to user's device
 */
export async function downloadBillPdf(element: HTMLElement, bill: QuickBill): Promise<string> {
  const { blob, filename } = await generateBillPdf(element, bill);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return filename;
}

/**
 * Shares PDF via Web Share API or falls back to download
 */
export async function shareBillPdf(
  element: HTMLElement,
  bill: QuickBill
): Promise<{ shared: boolean; method: 'native' | 'download'; message: string }> {
  const { blob, filename } = await generateBillPdf(element, bill);
  const file = new File([blob], filename, { type: 'application/pdf' });

  // Check if native Web Share with files is supported
  if (
    navigator.canShare &&
    navigator.canShare({ files: [file] }) &&
    navigator.share
  ) {
    try {
      const docLabel = bill.docType === 'quotation' ? 'Quotation' : 'Bill';
      await navigator.share({
        title: `Customer ${docLabel} ${bill.billNo} - Kamal Cycle World`,
        text: `Customer ${docLabel} ${bill.billNo} for ${bill.customerName || 'Customer'} (Total: ₹${bill.grandTotal})`,
        files: [file],
      });
      return { shared: true, method: 'native', message: `${docLabel} shared successfully!` };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { shared: false, method: 'native', message: 'Share canceled.' };
      }
      console.warn('Native share failed, falling back to download:', err);
    }
  }

  // Fallback: direct download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);

  return {
    shared: true,
    method: 'download',
    message: 'PDF saved to your device. You can attach it directly to WhatsApp or Email.',
  };
}

/**
 * Print utility using native window.print()
 */
export function printBillDocument(): void {
  window.print();
}
