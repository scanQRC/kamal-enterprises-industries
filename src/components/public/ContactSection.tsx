import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Building2 } from 'lucide-react';
import { FIRMS } from '../../data/mockData';

export const ContactSection: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    firmInterest: 'kamal-enterprises',
    inquiryType: 'product_inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        {/* Contact Info & Showrooms */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#991B1B] tracking-wider uppercase mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Commercial Showroom Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-950 tracking-tight">
            Visit Our Showrooms
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Inspect our full lineup of bicycles, test ride current models, or drop off your bicycle or cookware for precision maintenance.
          </p>

          <div className="mt-8 space-y-6">
            {/* Showroom 1: Kamal Enterprises */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-display text-sm font-bold text-slate-900">
                  Kamal Enterprises (Main Showroom)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#991B1B]">
                  Cycles &amp; Appliances
                </span>
              </div>
              <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{FIRMS['kamal-enterprises'].address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#991B1B] shrink-0" />
                  <a href={`tel:${FIRMS['kamal-enterprises'].phone}`} className="font-semibold text-slate-900 hover:text-[#991B1B]">
                    {FIRMS['kamal-enterprises'].phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Mon – Sat: 10:00 AM – 8:30 PM (Sun: 10:00 AM – 2:00 PM)</span>
                </div>
              </div>
            </div>

            {/* Showroom 2: Kamal Industries */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-display text-sm font-bold text-slate-900">
                  Kamal Industries (Bicycle Center)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-900">
                  Enthusiast &amp; Spares
                </span>
              </div>
              <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{FIRMS['kamal-industries'].address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-900 shrink-0" />
                  <a href={`tel:${FIRMS['kamal-industries'].phone}`} className="font-semibold text-slate-900 hover:text-[#991B1B]">
                    {FIRMS['kamal-industries'].phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Mon – Sat: 9:30 AM – 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Capture / Commercial Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md">
            <h3 className="text-xl font-display font-extrabold text-slate-950">
              Commercial Inquiry &amp; Workshop Booking
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
              Direct connection to our showroom sales desk and chief workshop technician.
            </p>

            {formSubmitted ? (
              <div className="mt-8 p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-emerald-950">Inquiry Received By Showroom Desk</h4>
                <p className="mt-1.5 text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                  Thank you, <strong className="font-semibold">{formData.name}</strong>. Our showroom manager will call you at <strong className="font-semibold">{formData.phone}</strong> shortly to confirm pricing, stock availability, or your service bay slot.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  type="button"
                  className="mt-5 text-xs font-bold text-emerald-900 underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#991B1B] bg-slate-50/60 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98250 00000"
                      className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#991B1B] bg-slate-50/60 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                      Business Division
                    </label>
                    <select
                      value={formData.firmInterest}
                      onChange={(e) => setFormData({ ...formData, firmInterest: e.target.value })}
                      className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#991B1B] bg-slate-50/60 font-medium text-slate-800 cursor-pointer"
                    >
                      <option value="kamal-enterprises">Kamal Enterprises (Cycles, Cookware, Appliances)</option>
                      <option value="kamal-industries">Kamal Industries (Performance Bicycles &amp; Gear)</option>
                      <option value="both">Both Divisions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                      Inquiry Intent
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#991B1B] bg-slate-50/60 font-medium text-slate-800 cursor-pointer"
                    >
                      <option value="product_inquiry">Price &amp; Showroom Stock Check</option>
                      <option value="service_booking">Workshop Service Bay Reservation</option>
                      <option value="bulk_order">Wholesale / Fleet Institutional Order</option>
                      <option value="spares_inquiry">Original Factory Spare Part Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                    Requirement Note (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Looking for Firefox 29er MTB in medium frame, or Hawkins 5L pressure cooker gasket..."
                    className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#991B1B] bg-slate-50/60 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] rounded-xl bg-slate-950 text-white text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Submit Inquiry to Showroom Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
