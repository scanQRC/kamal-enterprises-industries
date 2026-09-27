import React, { useState } from 'react';
import { Star, Check, Phone, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { REVIEWS } from '../../data/mockData';
import { ProductSilhouette } from '../common/BrandVisuals';
import { ModalHeader } from '../common/ModalHeader';
import { useModalDismiss } from '../../hooks/useModalDismiss';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useApp();
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [inquirySent, setInquirySent] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', location: '', rating: 5, comment: '' });

  const handleClose = () => {
    setSelectedProduct(null);
  };

  const { handleBackdropClick } = useModalDismiss({
    isOpen: Boolean(selectedProduct),
    onDismiss: handleClose,
    closeOnEsc: true,
    closeOnBackdrop: true,
    historyKey: 'product',
  });

  if (!selectedProduct) return null;

  const reviews = REVIEWS.filter((r) => r.productId === selectedProduct.id && r.isApproved);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    setReviewSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden text-left flex flex-col max-h-[92vh] sm:max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Header with Title on Left, Back & Large Accessible Close Button on Right */}
        <ModalHeader
          title={<span id="modal-product-title">{selectedProduct.name}</span>}
          subtitle={`${selectedProduct.brand} · SKU: ${selectedProduct.sku}`}
          onClose={handleClose}
          onBack={handleClose}
          backLabel="Back"
          closeAriaLabel="Close product specifications"
        />

        {/* Modal scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
          {/* Main product visual & core details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left image carrier */}
            <div className="md:col-span-5 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="relative aspect-4/3 w-full">
                <ProductSilhouette type={selectedProduct.categoryId} name={selectedProduct.name} />
              </div>

              {/* Barcode representation */}
              <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>EAN-13:</span>
                <span className="font-bold text-stone-800">{selectedProduct.barcode}</span>
              </div>
            </div>

            {/* Right details */}
            <div className="md:col-span-7 space-y-3">
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-stone-200/70 text-stone-700 text-[11px] font-semibold tracking-wide uppercase">
                {selectedProduct.brand}
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-tight">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-stone-600 font-normal leading-relaxed">
                {selectedProduct.subtitle}
              </p>

              {/* Price block */}
              <div className="pt-2 flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
                  ₹{selectedProduct.indicativePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-stone-400 line-through tabular-nums">
                  MRP ₹{selectedProduct.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                  Save ₹{(selectedProduct.mrp - selectedProduct.indicativePrice).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Public Showroom Availability */}
              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Showroom Availability:
                  </span>
                  <span className="font-medium text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>In Stock · Available for Inspection</span>
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-stone-500 font-light">
                  Visit our Udhampur showroom for trial fitting, inspection, and immediate delivery.
                </p>
              </div>

              {/* Inquiry Action */}
              <div className="pt-3">
                {inquirySent ? (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 border border-emerald-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Inquiry sent to showroom floor. Our representative will contact you.</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setInquirySent(true)}
                      type="button"
                      className="flex-1 min-h-[44px] px-4 rounded-xl bg-[#181614] text-white text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Phone className="w-4 h-4 text-[#D4AF37]" />
                      <span>Inquire / Reserve at Showroom</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs: Specifications & Customer Reviews */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex items-center gap-4 border-b border-stone-200 pb-2">
              <button
                onClick={() => setActiveTab('specs')}
                type="button"
                className={`text-xs font-semibold pb-2 -mb-2.5 transition-colors cursor-pointer min-h-[40px] ${
                  activeTab === 'specs'
                    ? 'text-stone-900 border-b-2 border-[#781D22]'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                type="button"
                className={`text-xs font-semibold pb-2 -mb-2.5 transition-colors cursor-pointer min-h-[40px] ${
                  activeTab === 'reviews'
                    ? 'text-stone-900 border-b-2 border-[#781D22]'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Customer Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab 1: Technical Specifications Table */}
            {activeTab === 'specs' && (
              <div className="mt-4 space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {selectedProduct.description}
                </p>

                <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <tbody>
                      {Object.entries(selectedProduct.specifications).map(([key, val], idx) => (
                        <tr
                          key={key}
                          className={idx % 2 === 0 ? 'bg-stone-50/50' : 'bg-white'}
                        >
                          <td className="py-2.5 px-4 font-medium text-stone-600 w-1/3 border-b border-stone-100">
                            {key}
                          </td>
                          <td className="py-2.5 px-4 text-stone-900 border-b border-stone-100">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Key Features */}
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Key Engineered Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                    {selectedProduct.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#781D22] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Customer Reviews & Ratings */}
            {activeTab === 'reviews' && (
              <div className="mt-4 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-stone-800">
                      4.9 out of 5 · Verified Showroom Buyers
                    </span>
                  </div>
                </div>

                {/* List of Reviews */}
                <div className="space-y-3">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-stone-500 italic">No published reviews yet.</p>
                  ) : (
                    reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl bg-white border border-stone-200 text-xs text-left"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 text-stone-500">
                          <span className="font-semibold text-stone-900">{rev.customerName}</span>
                          <span className="text-[11px]">{rev.createdAt}</span>
                        </div>
                        <h5 className="mt-2 font-medium text-stone-900">{rev.title}</h5>
                        <p className="mt-1 text-stone-600 font-light leading-relaxed">{rev.comment}</p>
                        <div className="mt-2 text-[10px] text-emerald-800 font-medium">
                          ✓ Verified Showroom Purchase · {rev.location}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Write Review Form */}
                <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200 text-left">
                  <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1">
                    Submit a Showroom Review
                  </h4>
                  <p className="text-[11px] text-stone-500 mb-3">
                    Reviews are authenticated and reviewed by store moderation before public display.
                  </p>

                  {reviewSubmitted ? (
                    <div className="p-3 bg-emerald-100/70 text-emerald-800 rounded-lg text-xs font-medium">
                      Thank you. Your review has been submitted for moderation and will appear after verification.
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          placeholder="Your Name"
                          className="h-10 px-3 rounded-lg border border-stone-300 bg-white"
                        />
                        <input
                          type="text"
                          value={newReview.location}
                          onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                          placeholder="City / Area"
                          className="h-10 px-3 rounded-lg border border-stone-300 bg-white"
                        />
                      </div>
                      <textarea
                        rows={2}
                        required
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Write your experience with this model..."
                        className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-lg bg-[#181614] text-white text-xs font-semibold hover:bg-stone-800 cursor-pointer min-h-[44px]"
                      >
                        Submit Review for Moderation
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky Dismiss Bar: Guaranteed secondary exit point */}
        <div className="px-4 sm:px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleClose}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-semibold cursor-pointer min-h-[44px] px-2"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500" />
            <span>← Back to Listing</span>
          </button>

          <button
            onClick={handleClose}
            type="button"
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
