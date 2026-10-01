import React from 'react';
import { QuickBill, QuickBillBusinessProfile } from '../../../types/quickbill';
import { WarrantyStamp } from './WarrantyStamps';

interface QuickBillDocumentProps {
  bill: QuickBill;
  profile: QuickBillBusinessProfile;
  includeEandOE?: boolean;
  className?: string;
  documentRef?: React.RefObject<HTMLDivElement | null>;
}

export const QuickBillDocument: React.FC<QuickBillDocumentProps> = ({
  bill,
  profile,
  includeEandOE = true,
  className = '',
  documentRef,
}) => {
  const isQuotation = bill.docType === 'quotation';
  const docTitle = isQuotation ? 'QUOTATION' : 'BILL';
  const docNumberLabel = isQuotation ? 'Quotation No.' : 'Bill No.';

  const hasAnyItemDiscount = bill.items.some(
    (it) => it.discountAmount && it.discountAmount > 0
  );

  const formatCurrency = (amt: number) => {
    return `₹${amt.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // -------------------------------------------------------------
  // FORMAT 2: PREMIUM (Default & Recommended Commercial Standard)
  // Clean, modern business stationery with strong typography,
  // refined dividers, and clear commercial hierarchy.
  // -------------------------------------------------------------
  if (bill.format === 'premium') {
    return (
      <div
        ref={documentRef}
        className={`quickbill-document bg-[#FCFAF7] text-stone-900 border border-stone-300 rounded-2xl p-7 sm:p-10 max-w-[820px] mx-auto shadow-md print:bg-white print:border-black print:rounded-none print:p-6 print:shadow-none print:max-w-none print:w-full ${className}`}
      >
        {/* ======================================================== */}
        {/* HEADER: Left Brand Area + Right Document Meta Block      */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-stone-800 pb-5 mb-5 gap-4 print:border-black">
          {/* Left Brand Area */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-stone-950 uppercase leading-none">
              {profile.businessName}
            </h1>
            <p className="text-xs font-semibold text-stone-700 print:text-black tracking-wide pt-1">
              Bicycle • Tricycle • Baby Walker • Jhulla • Kids Items
            </p>
            <div className="inline-block py-0.5 text-[11px] font-bold tracking-widest text-[#781D22] print:text-black uppercase">
              {profile.businessLine}
            </div>
            <p className="text-[11px] text-stone-600 print:text-black leading-snug">
              {profile.address}
            </p>
            <p className="text-[11px] font-semibold text-stone-800 print:text-black">
              Contact: <span className="font-mono">{profile.contact}</span>
            </p>
          </div>

          {/* Right Document Meta Box */}
          <div className="sm:text-right bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-stone-200 print:border-none print:p-0 min-w-[200px]">
            <div className="inline-block sm:block text-xl sm:text-2xl font-black font-serif tracking-widest text-[#781D22] print:text-black uppercase pb-1 border-b sm:border-b-0 border-stone-200">
              {docTitle}
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div>
                <span className="text-[10px] font-bold text-stone-500 print:text-black uppercase tracking-wider">
                  {docNumberLabel}:{' '}
                </span>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {bill.billNo}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-500 print:text-black uppercase tracking-wider">
                  Date:{' '}
                </span>
                <span className="font-medium text-stone-800">{bill.date}</span>
              </div>

              {/* Quotation Validity Banner */}
              {isQuotation && bill.validUntil && (
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-stone-500 print:text-black uppercase tracking-wider">
                    Valid Until:{' '}
                  </span>
                  <span className="font-bold text-stone-900 font-mono">
                    {bill.validUntil}
                  </span>
                  {bill.validDays && (
                    <span className="text-[10px] text-stone-500 block">
                      ({bill.validDays} Days from date of issue)
                    </span>
                  )}
                </div>
              )}

              {bill.isCorrected && (
                <div className="text-[10px] font-bold text-amber-700 print:text-black pt-0.5">
                  [ Revised / Corrected ]
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CUSTOMER DETAILS BLOCK                                    */}
        {/* ======================================================== */}
        <div className="bg-white rounded-xl border border-stone-200 p-3.5 sm:p-4 mb-5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs print:border-black print:rounded-none">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 print:text-black block">
              {isQuotation ? 'Quotation Issued To' : 'Billed To Customer'}
            </span>
            <span className="text-sm font-bold text-stone-900">
              {bill.customerName || (isQuotation ? 'Prospective Customer' : 'Valued Customer')}
            </span>
          </div>
          {bill.customerMobile && (
            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 print:text-black block">
                Mobile Number
              </span>
              <span className="text-xs font-mono font-bold text-stone-800">
                +91 {bill.customerMobile}
              </span>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* ITEMS TABLE: Qty | Particulars | Rate | Discount | Amount */}
        {/* ======================================================== */}
        <div className="rounded-xl border border-stone-200 overflow-hidden mb-5 bg-white shadow-2xs print:border-black print:rounded-none">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-stone-100/90 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[10px] print:border-black print:bg-stone-200">
                <th className="p-3 w-14 text-center">Qty</th>
                <th className="p-3 text-left">Particulars</th>
                <th className="p-3 w-24 text-right">Rate</th>
                {hasAnyItemDiscount && <th className="p-3 w-20 text-right">Discount</th>}
                <th className="p-3 w-28 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 print:divide-stone-300">
              {bill.items.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="p-3 text-center font-bold text-stone-900 font-mono">
                    {item.qty}
                  </td>
                  <td className="p-3 font-semibold text-stone-900">
                    <div>{item.particulars}</div>
                    {item.brand && (
                      <span className="text-[10px] font-normal text-stone-500 print:text-black">
                        Brand / Make: {item.brand}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right text-stone-800 font-mono">
                    {formatCurrency(item.rate)}
                  </td>
                  {hasAnyItemDiscount && (
                    <td className="p-3 text-right text-emerald-800 print:text-black font-mono">
                      {item.discountAmount > 0 ? `-${formatCurrency(item.discountAmount)}` : '-'}
                    </td>
                  )}
                  <td className="p-3 text-right font-bold text-stone-900 font-mono">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ======================================================== */}
        {/* SUMMARY & TOTAL                                          */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="text-xs text-stone-500 print:text-black max-w-sm">
            {includeEandOE && (
              <span className="font-semibold text-[10px] uppercase tracking-wider block mb-1">
                E. &amp; O. E. · Computer Generated {docTitle}
              </span>
            )}
            <p className="text-[11px] leading-relaxed">
              {isQuotation
                ? 'Thank you for your inquiry. This quotation reflects our best current showroom pricing.'
                : 'Thank you for your valued patronage at Kamal Cycle World, Udhampur.'}
            </p>
          </div>

          <div className="w-full sm:w-72 bg-white rounded-xl border border-stone-200 p-4 space-y-2 shadow-2xs print:border-black print:rounded-none">
            <div className="flex justify-between text-xs text-stone-600 print:text-black">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-stone-800">{formatCurrency(bill.subtotal)}</span>
            </div>
            {bill.totalItemDiscount > 0 && (
              <div className="flex justify-between text-xs text-emerald-800 print:text-black">
                <span>Item Discount:</span>
                <span className="font-mono">-{formatCurrency(bill.totalItemDiscount)}</span>
              </div>
            )}
            {bill.overallDiscountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-800 print:text-black">
                <span>
                  Overall Discount {bill.overallDiscountType === 'percentage' && `(${bill.overallDiscountValue}%)`}:
                </span>
                <span className="font-mono">-{formatCurrency(bill.overallDiscountAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t-2 border-stone-800 flex justify-between items-baseline print:border-black">
              <span className="text-xs font-black tracking-wider uppercase text-stone-900">
                {isQuotation ? 'QUOTED TOTAL:' : 'TOTAL AMOUNT:'}
              </span>
              <span className="text-xl font-black font-mono text-[#781D22] print:text-black">
                {formatCurrency(bill.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* OPTIONAL WARRANTY STAMP (BILL ONLY)                      */}
        {/* ======================================================== */}
        {!isQuotation && bill.warranty?.enabled && (
          <div className="mb-6">
            <WarrantyStamp warranty={bill.warranty} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TERMS & SIGNATURE (Above: For KAMAL CYCLE WORLD)         */}
        {/* ======================================================== */}
        <div className="pt-4 border-t border-stone-200 grid grid-cols-12 gap-4 text-xs print:border-black">
          <div className="col-span-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 print:text-black block mb-1">
              {isQuotation ? 'Quotation Terms & Conditions:' : 'Terms & Conditions:'}
            </span>
            <ol className="list-decimal list-inside space-y-0.5 text-[10px] text-stone-600 print:text-black leading-relaxed">
              {bill.terms.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ol>
          </div>

          <div className="col-span-4 flex flex-col justify-end items-center text-center">
            <div className="text-[10px] font-bold text-stone-700 print:text-black uppercase mb-1">
              For {profile.businessName}
            </div>
            {bill.includeSignature && bill.signatureDataUrl ? (
              <div className="mb-1">
                <img
                  src={bill.signatureDataUrl}
                  alt="Authorized Signature"
                  className="h-12 max-w-[140px] object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="h-10" />
            )}
            <div className="border-t border-stone-300 w-full pt-1 font-bold text-[10px] text-stone-900 print:border-black">
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FORMAT 1: CLASSIC MODERN
  // Clean, structured tabular layout with strong traditional styling
  // -------------------------------------------------------------
  if (bill.format === 'classic') {
    return (
      <div
        ref={documentRef}
        className={`quickbill-document bg-white text-stone-900 border-2 border-stone-800 p-6 sm:p-8 max-w-[800px] mx-auto shadow-sm print:border-black print:p-6 print:shadow-none print:max-w-none print:w-full ${className}`}
      >
        {/* Header Block */}
        <div className="border-b-2 border-stone-800 pb-4 mb-4 text-center relative print:border-black">
          <div className="text-sm font-bold tracking-widest text-[#781D22] print:text-black uppercase">
            // {docTitle} //
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-stone-950 uppercase mt-0.5">
            {profile.businessName}
          </h1>
          <p className="text-xs font-semibold text-stone-700 print:text-black tracking-wider mt-0.5">
            Bicycle • Tricycle • Baby Walker • Jhulla • Kids Items
          </p>
          <div className="inline-block my-1 px-3 py-0.5 bg-stone-100 border border-stone-300 rounded text-[11px] font-bold tracking-widest text-stone-800 print:border-black print:bg-transparent uppercase">
            {profile.businessLine}
          </div>
          <p className="text-[11px] text-stone-600 print:text-black leading-snug">
            {profile.address}
          </p>
          <p className="text-[11px] font-semibold text-stone-800 print:text-black mt-0.5">
            Phone: {profile.contact}
          </p>
        </div>

        {/* Bill Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 border border-stone-800 p-3 mb-4 text-xs print:border-black">
          <div>
            <div className="flex gap-2">
              <span className="font-bold text-stone-700 print:text-black w-20">Customer:</span>
              <span className="font-semibold text-stone-900 text-sm">{bill.customerName || (isQuotation ? 'Prospective Customer' : 'Cash Customer')}</span>
            </div>
            {bill.customerMobile && (
              <div className="flex gap-2 mt-1">
                <span className="font-bold text-stone-700 print:text-black w-20">Contact:</span>
                <span className="font-mono text-stone-900">{bill.customerMobile}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="flex justify-end gap-2">
              <span className="font-bold text-stone-700 print:text-black">{docNumberLabel}:</span>
              <span className="font-bold font-mono text-stone-900 text-sm">{bill.billNo}</span>
            </div>
            <div className="flex justify-end gap-2 mt-1">
              <span className="font-bold text-stone-700 print:text-black">Date:</span>
              <span className="font-medium text-stone-900">{bill.date}</span>
            </div>
            {isQuotation && bill.validUntil && (
              <div className="flex justify-end gap-2 mt-0.5 text-stone-700 print:text-black">
                <span className="font-bold">Valid Until:</span>
                <span className="font-mono font-semibold">{bill.validUntil}</span>
              </div>
            )}
            {bill.isCorrected && (
              <div className="text-[10px] font-bold text-amber-700 print:text-black mt-0.5">
                [ Corrected Document ]
              </div>
            )}
          </div>
        </div>

        {/* Items Table: Qty | Particulars | Rate | Discount | Amount */}
        <table className="w-full border-collapse border border-stone-800 text-xs mb-4 print:border-black">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-800 font-bold text-stone-800 print:bg-stone-200 print:border-black">
              <th className="border-r border-stone-800 p-2 w-14 text-center print:border-black">Qty</th>
              <th className="border-r border-stone-800 p-2 text-left print:border-black">Particulars</th>
              <th className="border-r border-stone-800 p-2 w-24 text-right print:border-black">Rate</th>
              {hasAnyItemDiscount && (
                <th className="border-r border-stone-800 p-2 w-20 text-right print:border-black">Disc</th>
              )}
              <th className="p-2 w-28 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item) => (
              <tr key={item.id} className="border-b border-stone-300 print:border-stone-400">
                <td className="border-r border-stone-800 p-2 text-center font-bold text-stone-900 print:border-black">
                  {item.qty}
                </td>
                <td className="border-r border-stone-800 p-2 font-medium text-stone-900 print:border-black">
                  {item.particulars}
                  {item.brand && (
                    <span className="text-[10px] text-stone-500 print:text-black block">
                      Brand: {item.brand}
                    </span>
                  )}
                </td>
                <td className="border-r border-stone-800 p-2 text-right font-mono text-stone-900 print:border-black">
                  {formatCurrency(item.rate)}
                </td>
                {hasAnyItemDiscount && (
                  <td className="border-r border-stone-800 p-2 text-right font-mono text-stone-600 print:border-black print:text-black">
                    {item.discountAmount > 0 ? `-${formatCurrency(item.discountAmount)}` : '-'}
                  </td>
                )}
                <td className="p-2 text-right font-bold font-mono text-stone-900">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculation Summary Block */}
        <div className="flex justify-end mb-6">
          <div className="w-64 border border-stone-800 text-xs print:border-black">
            <div className="flex justify-between p-2 border-b border-stone-300">
              <span className="text-stone-600 print:text-black">Subtotal:</span>
              <span className="font-mono font-medium">{formatCurrency(bill.subtotal)}</span>
            </div>
            {bill.totalItemDiscount > 0 && (
              <div className="flex justify-between p-2 border-b border-stone-300 text-stone-700">
                <span>Item Discount:</span>
                <span className="font-mono text-emerald-800 print:text-black">
                  -{formatCurrency(bill.totalItemDiscount)}
                </span>
              </div>
            )}
            {bill.overallDiscountAmount > 0 && (
              <div className="flex justify-between p-2 border-b border-stone-300 text-stone-700">
                <span>
                  Overall Discount {bill.overallDiscountType === 'percentage' && `(${bill.overallDiscountValue}%)`}:
                </span>
                <span className="font-mono text-emerald-800 print:text-black">
                  -{formatCurrency(bill.overallDiscountAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between p-2 bg-stone-100 font-bold text-sm border-t border-stone-800 print:bg-transparent print:border-black">
              <span>{isQuotation ? 'QUOTED TOTAL:' : 'TOTAL AMOUNT:'}</span>
              <span className="font-mono text-base font-black">{formatCurrency(bill.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Optional Warranty Stamp (BILL ONLY) */}
        {!isQuotation && bill.warranty?.enabled && (
          <div className="mb-6">
            <WarrantyStamp warranty={bill.warranty} />
          </div>
        )}

        {/* Terms & Conditions & Signatures */}
        <div className="grid grid-cols-12 gap-4 pt-4 border-t-2 border-stone-800 print:border-black text-[10px]">
          <div className="col-span-8 space-y-1">
            <div className="font-bold uppercase tracking-wider text-stone-700 print:text-black">
              {isQuotation ? 'Quotation Terms:' : 'Terms & Conditions:'}
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-stone-600 print:text-black">
              {bill.terms.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            {includeEandOE && (
              <div className="font-bold text-[9px] text-stone-500 print:text-black mt-2">
                E. &amp; O. E. (Errors &amp; Omissions Excepted)
              </div>
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-end items-center text-center">
            <div className="text-[10px] font-bold text-stone-700 print:text-black uppercase mb-1">
              For {profile.businessName}
            </div>
            {bill.includeSignature && bill.signatureDataUrl ? (
              <div className="mb-1">
                <img
                  src={bill.signatureDataUrl}
                  alt="Authorized Signature"
                  className="h-12 max-w-[140px] object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="h-10" />
            )}
            <div className="border-t border-stone-800 w-full pt-1 font-bold text-[10px] text-stone-800 print:border-black print:text-black">
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FORMAT 3: COMPACT
  // Space-saving slip layout for quick counter slips
  // -------------------------------------------------------------
  return (
    <div
      ref={documentRef}
      className={`quickbill-document bg-white text-stone-900 border border-stone-400 p-4 sm:p-5 max-w-[620px] mx-auto text-xs print:border-black print:p-4 print:max-w-none print:w-full ${className}`}
    >
      {/* Compact Header */}
      <div className="text-center border-b border-dashed border-stone-400 pb-3 mb-3 print:border-black">
        <div className="text-xs font-bold text-[#781D22] uppercase tracking-wider">
          {docTitle}
        </div>
        <h1 className="text-xl font-bold tracking-tight uppercase">
          {profile.businessName}
        </h1>
        <p className="text-[10px] font-semibold text-stone-600 print:text-black">
          Bicycle • Tricycle • Baby Walker • Jhulla • Kids Items
        </p>
        <p className="text-[10px] text-stone-500 print:text-black">
          {profile.address} · Ph: {profile.contact}
        </p>
      </div>

      {/* Bill Meta Row */}
      <div className="flex justify-between border-b border-stone-300 pb-2 mb-2 text-[11px] print:border-black">
        <div>
          <div><span className="font-semibold">Cust:</span> {bill.customerName || (isQuotation ? 'Prospective Customer' : 'Cash')}</div>
          {bill.customerMobile && <div><span className="font-semibold">Mob:</span> {bill.customerMobile}</div>}
        </div>
        <div className="text-right">
          <div><span className="font-semibold">{docNumberLabel}:</span> <span className="font-mono font-bold">{bill.billNo}</span></div>
          <div><span className="font-semibold">Date:</span> {bill.date}</div>
          {isQuotation && bill.validUntil && (
            <div><span className="font-semibold">Valid:</span> {bill.validUntil}</div>
          )}
        </div>
      </div>

      {/* Compact Table */}
      <table className="w-full border-collapse text-[11px] mb-3">
        <thead>
          <tr className="border-b border-stone-400 font-bold text-stone-700 print:border-black print:text-black">
            <th className="py-1 text-center w-12">Qty</th>
            <th className="py-1 text-left">Particulars</th>
            <th className="py-1 text-right w-16">Rate</th>
            {hasAnyItemDiscount && <th className="py-1 text-right w-14">Disc</th>}
            <th className="py-1 text-right w-18">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 print:divide-stone-300">
          {bill.items.map((item) => (
            <tr key={item.id}>
              <td className="py-1 text-center font-bold font-mono">{item.qty}</td>
              <td className="py-1 font-medium text-stone-900">
                {item.particulars}
                {item.brand && <span className="text-[9px] text-stone-500 print:text-black block">{item.brand}</span>}
              </td>
              <td className="py-1 text-right font-mono">{formatCurrency(item.rate)}</td>
              {hasAnyItemDiscount && (
                <td className="py-1 text-right font-mono text-stone-600 print:text-black">
                  {item.discountAmount > 0 ? `-${formatCurrency(item.discountAmount)}` : '-'}
                </td>
              )}
              <td className="py-1 text-right font-bold font-mono">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Compact Totals */}
      <div className="border-t border-stone-400 pt-2 mb-3 space-y-1 text-[11px] print:border-black">
        {bill.totalItemDiscount > 0 && (
          <div className="flex justify-between text-stone-600 print:text-black">
            <span>Item Disc:</span>
            <span>-{formatCurrency(bill.totalItemDiscount)}</span>
          </div>
        )}
        {bill.overallDiscountAmount > 0 && (
          <div className="flex justify-between text-stone-600 print:text-black">
            <span>Overall Disc:</span>
            <span>-{formatCurrency(bill.overallDiscountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm font-black pt-1 border-t border-dashed border-stone-400 print:border-black">
          <span>{isQuotation ? 'QUOTED TOTAL:' : 'NET TOTAL:'}</span>
          <span className="font-mono text-base">{formatCurrency(bill.grandTotal)}</span>
        </div>
      </div>

      {/* Optional Warranty if BILL */}
      {!isQuotation && bill.warranty?.enabled && (
        <div className="mb-3">
          <WarrantyStamp warranty={bill.warranty} />
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-dashed border-stone-400 pt-2 text-[9px] text-stone-500 print:text-black space-y-1 print:border-black">
        <p>{bill.terms[0] || (isQuotation ? 'Quotation valid as per terms.' : 'Goods once sold will not be taken back.')}</p>
        {includeEandOE && <p>E. &amp; O. E. · Subject to Udhampur Jurisdiction.</p>}
        <div className="pt-2 flex justify-between items-end">
          <span className="italic">{isQuotation ? 'Official Quotation' : 'Customer Copy'}</span>
          <div className="text-right">
            <span className="text-[8px] text-stone-600 block">For {profile.businessName}</span>
            <span className="font-bold border-t border-stone-400 pt-0.5 inline-block print:border-black">
              Authorized Signatory
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
