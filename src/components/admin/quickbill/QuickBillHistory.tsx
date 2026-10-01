import React, { useState, useEffect } from 'react';
import { QuickBill, QuickBillSettingsConfig, DocType } from '../../../types/quickbill';
import { quickBillStorage } from '../../../services/quickBillStorage';
import {
  Search,
  Calendar,
  Receipt,
  FileText,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Filter,
} from 'lucide-react';

interface QuickBillHistoryProps {
  settings: QuickBillSettingsConfig;
  onViewBill: (bill: QuickBill) => void;
  onEditBill: (bill: QuickBill) => void;
  onNewBill: (type?: DocType) => void;
  onCreateBillFromQuotation: (quotation: QuickBill) => void;
}

export const QuickBillHistory: React.FC<QuickBillHistoryProps> = ({
  settings,
  onViewBill,
  onEditBill,
  onNewBill,
  onCreateBillFromQuotation,
}) => {
  const [documents, setDocuments] = useState<QuickBill[]>([]);
  const [docTypeFilter, setDocTypeFilter] = useState<'all' | 'bill' | 'quotation'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const loadDocuments = () => {
    setDocuments(quickBillStorage.getDocuments());
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = (id: string, billNo: string, docType: DocType) => {
    const label = docType === 'quotation' ? 'Quotation' : 'Bill';
    if (window.confirm(`Are you sure you want to delete ${label} #${billNo} from local history?`)) {
      quickBillStorage.deleteDocument(id);
      loadDocuments();
    }
  };

  // Filter logic: Search by Document No, Customer Name, Contact No, Date + Type Filter
  const filteredDocs = documents.filter((b) => {
    // Type filter
    if (docTypeFilter !== 'all' && b.docType !== docTypeFilter) return false;

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      b.billNo.toLowerCase().includes(term) ||
      b.customerName.toLowerCase().includes(term) ||
      b.customerMobile.includes(term) ||
      b.items.some((it) => it.particulars.toLowerCase().includes(term));

    const matchesDate = !dateFilter || b.date === dateFilter;

    return matchesSearch && matchesDate;
  });

  const totalBills = documents.filter((d) => d.docType === 'bill').length;
  const totalQuotations = documents.filter((d) => d.docType === 'quotation').length;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-5 text-left">
      {/* Header & New Document CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-lg font-bold text-stone-900 leading-tight">
            Document History (Local Offline Records)
          </h2>
          <p className="text-xs text-stone-500">
            Stored securely on this device · Fast search, reprint, PDF, share &amp; quotation conversion
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNewBill('quotation')}
            className="min-h-[42px] px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4 text-[#1E3A8A]" />
            <span>+ New Quotation</span>
          </button>

          <button
            type="button"
            onClick={() => onNewBill('bill')}
            className="min-h-[42px] px-5 rounded-xl bg-[#781D22] hover:bg-[#60171B] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Receipt className="w-4 h-4 text-[#D4AF37]" />
            <span>+ New Bill</span>
          </button>
        </div>
      </div>

      {/* Type Filter Pills & Search Bar (Section 19) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Type Tabs: ALL | BILLS | QUOTATIONS */}
        <div className="inline-flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setDocTypeFilter('all')}
            className={`min-h-[36px] px-3.5 rounded-lg transition-all cursor-pointer ${
              docTypeFilter === 'all'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Documents ({documents.length})
          </button>
          <button
            type="button"
            onClick={() => setDocTypeFilter('bill')}
            className={`min-h-[36px] px-3.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              docTypeFilter === 'bill'
                ? 'bg-white text-[#781D22] shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Bills ({totalBills})</span>
          </button>
          <button
            type="button"
            onClick={() => setDocTypeFilter('quotation')}
            className={`min-h-[36px] px-3.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              docTypeFilter === 'quotation'
                ? 'bg-white text-[#1E3A8A] shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quotations ({totalQuotations})</span>
          </button>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-10 pl-9 pr-3 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-[#781D22]"
            />
          </div>
          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter('')}
              className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Document No (KCW-B- / KCW-Q-), Customer, Mobile, or Item..."
          className="w-full h-10 pl-10 pr-3 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-[#781D22]"
        />
      </div>

      {/* Document List Table */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-3xl text-stone-400 text-xs">
          <Receipt className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="font-semibold text-stone-600">No documents found in local history</p>
          <p className="text-[11px] text-stone-400 mt-1">
            {searchTerm || dateFilter || docTypeFilter !== 'all'
              ? 'Try changing your search filters.'
              : 'Create your first bill or quotation to view it here.'}
          </p>
        </div>
      ) : (
        <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                <th className="p-3 w-28">Type</th>
                <th className="p-3">Doc No &amp; Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items Summary</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center w-52">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDocs.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50/70">
                  {/* Type Badge (BILL vs QUOTATION) */}
                  <td className="p-3">
                    {b.docType === 'quotation' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#1E3A8A] border border-blue-200">
                        <FileText className="w-3 h-3" />
                        <span>QUOTATION</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#781D22] border border-red-200">
                        <Receipt className="w-3 h-3" />
                        <span>BILL</span>
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <span className="font-mono font-bold text-stone-900 block text-sm">
                      {b.billNo}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {b.date} {b.time ? `· ${b.time}` : ''}
                    </span>
                    {b.docType === 'quotation' && b.validUntil && (
                      <span className="text-[10px] text-blue-700 block font-medium">
                        Valid: {b.validUntil}
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <span className="font-bold text-stone-900 block">
                      {b.customerName || (b.docType === 'quotation' ? 'Prospective Customer' : 'Cash Customer')}
                    </span>
                    {b.customerMobile && (
                      <span className="text-[11px] text-stone-500 font-mono block">
                        {b.customerMobile}
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-stone-700">
                    <div className="max-w-xs truncate">
                      {b.items.map((i) => `${i.qty}× ${i.particulars}`).join(', ')}
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {b.items.length} item{b.items.length > 1 ? 's' : ''}
                      {b.warranty?.enabled ? ' · With Warranty' : ''}
                    </span>
                  </td>

                  <td className="p-3 text-right font-mono font-black text-stone-900 text-sm">
                    ₹{b.grandTotal.toLocaleString('en-IN')}
                  </td>

                  <td className="p-3 text-center">
                    {b.isCorrected ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>Corrected</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{b.docType === 'quotation' ? 'Quoted' : 'Issued'}</span>
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => onViewBill(b)}
                        title="View / Print / PDF / Share"
                        className="min-h-[34px] px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-600" />
                        <span>View</span>
                      </button>

                      {/* CREATE BILL FROM QUOTATION (Section 14 & 19) */}
                      {b.docType === 'quotation' && (
                        <button
                          type="button"
                          onClick={() => onCreateBillFromQuotation(b)}
                          title="Convert this quotation into a brand new Bill draft"
                          className="min-h-[34px] px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-1 text-[11px] cursor-pointer shadow-2xs"
                        >
                          <Receipt className="w-3 h-3 text-emerald-700" />
                          <span>Make Bill</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onEditBill(b)}
                        title="Edit / Correct Document"
                        className="min-h-[34px] p-2 rounded-xl hover:bg-amber-50 text-stone-700 hover:text-amber-800 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(b.id, b.billNo, b.docType)}
                        title="Delete Document"
                        className="min-h-[34px] p-2 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
