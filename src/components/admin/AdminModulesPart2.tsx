import React, { useState } from 'react';
import {
  Wrench,
  RefreshCw,
  Truck,
  BarChart3,
  Shield,
  Settings,
  Plus,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  FIRMS,
  REPAIR_JOBS,
  TALLY_BATCHES,
  SUPPLIERS,
  AUTHORISED_USERS,
  CUSTOMERS,
} from '../../data/mockData';

// ==========================================
// 6. REPAIR / SERVICE MODULE
// ==========================================
export const RepairServiceModule: React.FC = () => {
  const { adminFirm } = useApp();
  const jobs = REPAIR_JOBS.filter((j) => j.firmId === adminFirm);

  return (
    <div className="space-y-5 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Workshop &amp; Repair Job Cards
          </h2>
          <p className="text-xs text-stone-500">
            Track technician labor, genuine spare parts consumed, and delivery status.
          </p>
        </div>
        <button
          type="button"
          className="px-3.5 py-2 rounded-xl bg-[#181614] text-white text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>New Job Card</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="font-mono text-xs font-bold text-stone-800">
                  {job.jobCardNo}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase ${
                    job.status === 'ready'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {job.status.replace('_', ' ')}
                </span>
              </div>

              <h4 className="mt-3 text-sm font-bold text-stone-900">{job.brandModel}</h4>
              <p className="text-xs text-stone-600 mt-1 font-light">{job.issueDescription}</p>

              {/* Spare Parts Detail */}
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs">
                <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-1">
                  Parts Replaced / Serviced:
                </span>
                {job.parts.map((p, i) => (
                  <div key={i} className="flex justify-between text-stone-600 text-[11px] py-0.5">
                    <span>
                      {p.partName} (x{p.quantity})
                    </span>
                    <span className="tabular-nums font-semibold">₹{p.unitPrice * p.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between text-stone-600 text-[11px] py-0.5">
                  <span>Labour / Calibration Charge:</span>
                  <span className="tabular-nums font-semibold">₹{job.labourCharge}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Technician: {job.technicianName}</span>
              <span className="font-serif font-bold text-stone-900">Total: ₹{job.totalCost}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. TALLY SYNC MODULE
// ==========================================
export const TallySyncModule: React.FC = () => {
  const { adminFirm } = useApp();
  const batches = TALLY_BATCHES.filter((b) => b.firmId === adminFirm);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleTriggerSync = () => {
    setSyncInProgress(true);
    setTimeout(() => {
      setSyncInProgress(false);
      setSyncDone(true);
      setTimeout(() => setSyncDone(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/90 text-xs text-blue-900">
        <div className="flex items-center gap-2 font-semibold">
          <RefreshCw className="w-4 h-4 text-blue-700 shrink-0" />
          <span>Tally Prime Integration Workflow</span>
        </div>
        <p className="mt-1 text-[11px] text-blue-800 leading-relaxed font-light">
          Website is the primary daily operational system. Approved counter sales and purchase records first enter the website, then Tally sync happens afterward via XML batches.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-stone-400">
            Tenant: {FIRMS[adminFirm].name}
          </span>
          <h3 className="text-base font-serif font-bold text-stone-900">
            Pending Accounting Records for Tally
          </h3>
          <p className="text-xs text-stone-500">
            Voucher series: <strong>{adminFirm === 'kamal-enterprises' ? 'KE-SALES-26' : 'KI-SALES-26'}</strong>
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={syncInProgress}
          type="button"
          className="min-h-[44px] px-5 py-2 rounded-xl bg-[#181614] text-white text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${syncInProgress ? 'animate-spin' : ''}`} />
          <span>{syncInProgress ? 'Exporting XML...' : 'Generate Tally XML Batch'}</span>
        </button>
      </div>

      {syncDone && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
          ✓ Tally XML voucher payload generated successfully. Duplicate sync protection verified.
        </div>
      )}

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-stone-100 text-xs font-bold text-stone-900 uppercase tracking-wider">
          Previous Sync Batches
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[10px] uppercase">
            <tr>
              <th className="py-2.5 px-4">Batch Number</th>
              <th className="py-2.5 px-4">Date Range</th>
              <th className="py-2.5 px-4 text-center">Vouchers</th>
              <th className="py-2.5 px-4 text-right">Batch Total</th>
              <th className="py-2.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {batches.map((b) => (
              <tr key={b.id} className="hover:bg-stone-50/50">
                <td className="py-3 px-4 font-mono font-bold text-stone-800">{b.batchNumber}</td>
                <td className="py-3 px-4 text-stone-600">
                  {b.fromDate} to {b.toDate}
                </td>
                <td className="py-3 px-4 text-center font-mono tabular-nums">{b.recordCount}</td>
                <td className="py-3 px-4 text-right font-serif font-bold text-stone-900 tabular-nums">
                  ₹{b.totalAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase ${
                      b.status === 'synced'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 8. SUPPLIERS MODULE
// ==========================================
export const SuppliersModule: React.FC = () => {
  const { adminFirm } = useApp();
  const suppliers = SUPPLIERS.filter((s) => s.firmIds.includes(adminFirm));

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Authorised Suppliers &amp; Distributors
          </h2>
          <p className="text-xs text-stone-500">
            Verified vendor directory and factory distribution channels for {FIRMS[adminFirm].name}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((sup) => (
          <div key={sup.id} className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">
              Vendor ID: {sup.id}
            </span>
            <h4 className="text-sm font-bold text-stone-900 mt-1">{sup.name}</h4>
            <p className="text-xs text-stone-500">{sup.category} · {sup.city}</p>

            <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
              <div>Contact Person: <strong>{sup.contactPerson}</strong></div>
              <div>Phone: <span className="font-mono">{sup.phone}</span></div>
              <div>GSTIN: <span className="font-mono">{sup.gstin}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 9. CUSTOMERS MODULE
// ==========================================
export const CustomersModule: React.FC = () => {
  const { adminFirm } = useApp();
  const firmCustomers = CUSTOMERS.filter((c) => c.firmId === adminFirm);

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Customer Directory ({FIRMS[adminFirm].shortName})
          </h2>
          <p className="text-xs text-stone-500">
            Registered retail and showroom customers with purchase histories.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs min-w-[500px]">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[10px] uppercase">
            <tr>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">City</th>
              <th className="py-3 px-4 text-right">Total Purchases</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {firmCustomers.map((cust) => (
              <tr key={cust.id} className="hover:bg-stone-50/50">
                <td className="py-3 px-4 font-bold text-stone-900">{cust.name}</td>
                <td className="py-3 px-4 font-mono text-stone-600">{cust.phone}</td>
                <td className="py-3 px-4 text-stone-600">{cust.city}</td>
                <td className="py-3 px-4 text-right font-serif font-bold text-stone-900 tabular-nums">
                  ₹{cust.totalPurchases.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 10. REPORTS MODULE
// ==========================================
export const ReportsModule: React.FC = () => {
  const { adminFirm } = useApp();
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-lg font-serif font-bold text-stone-900">
          Operational &amp; Tax Reports
        </h2>
        <p className="text-xs text-stone-500">
          Reconciled counters for {FIRMS[adminFirm].name}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500">Month-to-Date Revenue</span>
          <p className="mt-2 text-2xl font-serif font-bold text-stone-900 tabular-nums">₹4,28,450</p>
          <span className="text-[11px] text-emerald-700">12% GST breakdown reconciled</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500">Workshop Repair Earnings</span>
          <p className="mt-2 text-2xl font-serif font-bold text-stone-900 tabular-nums">₹28,600</p>
          <span className="text-[11px] text-stone-500">Labor charges &amp; spare margins</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500">Current Valuation at Cost</span>
          <p className="mt-2 text-2xl font-serif font-bold text-stone-900 tabular-nums">₹14,90,000</p>
          <span className="text-[11px] text-stone-500">Active showroom floor inventory</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 11. USERS & ROLES MODULE (RBAC)
// ==========================================
export const UsersRolesModule: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-lg font-serif font-bold text-stone-900">
          Staff Authentication &amp; RBAC Directory
        </h2>
        <p className="text-xs text-stone-500">
          Firm isolation and granular permissions matrix.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs min-w-[500px]">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[10px] uppercase">
            <tr>
              <th className="py-3 px-4">Staff Member</th>
              <th className="py-3 px-4">Authorised Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {AUTHORISED_USERS.map((u) => (
              <tr key={u.id} className="hover:bg-stone-50/50">
                <td className="py-3 px-4 font-bold text-stone-900">{u.name}</td>
                <td className="py-3 px-4 text-stone-600 font-mono">{u.email}</td>
                <td className="py-3 px-4 font-semibold text-stone-700 capitalize">
                  {u.allowedFirms.length > 1 ? 'Super Admin (Both)' : 'Firm Admin'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[10px] px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-bold uppercase">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 12. SETTINGS MODULE
// ==========================================
export const SettingsModule: React.FC = () => {
  const { adminFirm } = useApp();
  const firm = FIRMS[adminFirm];

  return (
    <div className="max-w-2xl space-y-6 text-left">
      <div>
        <h2 className="text-lg font-serif font-bold text-stone-900">
          Firm Configuration &amp; Tenant Profile
        </h2>
        <p className="text-xs text-stone-500">Operational settings for {firm.name}.</p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block text-stone-600 mb-1 font-semibold">Firm Registered Legal Name</label>
          <input
            type="text"
            readOnly
            value={firm.name}
            className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-stone-50 font-bold text-stone-800"
          />
        </div>

        <div>
          <label className="block text-stone-600 mb-1 font-semibold">Commercial Showroom Address</label>
          <input
            type="text"
            readOnly
            value={firm.address}
            className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-stone-600 mb-1 font-semibold">GSTIN</label>
            <input
              type="text"
              readOnly
              value={firm.gstin}
              className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-stone-50 font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1 font-semibold">Invoice Numbering Prefix</label>
            <input
              type="text"
              readOnly
              value={firm.id === 'kamal-enterprises' ? 'KE-INV-26' : 'KI-INV-26'}
              className="w-full h-10 px-3 rounded-xl border border-stone-300 bg-stone-50 font-mono font-bold"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-stone-500">
          <span>Tenant Separation Architecture:</span>
          <span className="font-mono text-emerald-800 font-bold">ISOLATED &amp; SEPARABLE</span>
        </div>
      </div>
    </div>
  );
};
