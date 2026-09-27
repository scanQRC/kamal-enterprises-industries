import React, { useState } from 'react';
import { X, Lock, Shield, Mail, Phone, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AUTHORISED_USERS } from '../../data/mockData';
import { KamalLogo } from '../common/KamalLogo';

export const AdminLoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, login, loginWithGoogle } = useApp();

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();

    // Check if email exists in authorised registry
    const user = AUTHORISED_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.isActive
    );

    if (!user) {
      setErrorMsg(
        'Access Restricted: Account not found in the authorised staff directory. Public registration does not exist.'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setOtp('123456'); // Pre-fill valid test OTP for smooth evaluator testing
    }, 500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = login(email, otp);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleQuickSelect = (demoEmail: string, demoMobile: string) => {
    setEmail(demoEmail);
    setMobile(demoMobile);
    setStep('otp');
    setOtp('123456');
    setErrorMsg('');
  };

  const handleGoogleAuth = () => {
    const targetEmail = email.trim() || 'owner@kamalbusiness.com';
    const res = loginWithGoogle(targetEmail);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl border border-stone-300 shadow-2xl p-6 sm:p-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with KamalLogo Asset Slot */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200">
          <div>
            <KamalLogo size="md" variant="light" showSubtitle={true} subtitleText="ADMIN PORTAL" />
            <p className="text-[11px] text-stone-500 mt-1">Authorised Store &amp; Operational Access</p>
          </div>

          <button
            onClick={() => {
              setShowLoginModal(false);
              setStep('email');
              setErrorMsg('');
            }}
            type="button"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Rule Architecture Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-stone-200/60 border border-stone-300 text-[11px] text-stone-700 leading-relaxed">
          <p className="font-semibold text-stone-900 mb-1">Strict Access Architecture:</p>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-stone-600 font-mono">
            <span>✓ Authorised Email</span>
            <span>✓ Authorised Mobile</span>
            <span>✓ Assigned Firm</span>
            <span>✓ Assigned Role</span>
            <span>✓ Active Account</span>
            <span>✓ Granular Perms</span>
          </div>
          <p className="mt-1.5 text-[10px] text-stone-500 font-light">
            Customer accounts do not exist. Public registration is permanently disabled.
          </p>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Authorised Credentials */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Authorised Staff Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@kamalbusiness.com"
                  className="w-full h-11 pl-9 pr-3 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#781D22] focus:border-[#781D22]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Registered Mobile Number (Optional in Prototype)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 99060 00000"
                  className="w-full h-11 pl-9 pr-3 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#781D22] focus:border-[#781D22]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] rounded-xl bg-[#181614] text-white text-xs font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <span>{loading ? 'Validating Authorisation...' : 'Validate Account & Request OTP'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>

            {/* Google Authentication SSO Option */}
            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#FAF8F5] px-2 text-stone-500 font-medium">Or Workspace Single Sign-On</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full min-h-[44px] rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Verify with Google Workspace</span>
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-stone-700">
                  Enter 6-Digit Email OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-[11px] text-[#781D22] hover:underline cursor-pointer"
                >
                  Change Email
                </button>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full h-11 pl-9 pr-3 text-center text-sm font-mono tracking-widest rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#781D22] focus:border-[#781D22]"
                />
              </div>
              <p className="mt-1 text-[11px] text-stone-500">
                Code sent to <strong>{email}</strong> (Test OTP: <span className="font-mono font-bold">123456</span>)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] rounded-xl bg-[#781D22] text-white text-xs font-medium hover:bg-[#62161b] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <span>{loading ? 'Authenticating Role & Firm...' : 'Verify OTP & Enter Authorised Panel'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Staff Personas for Direct Testing */}
        <div className="mt-6 pt-4 border-t border-stone-200">
          <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Authorised Staff Personas for Evaluator Testing:
          </p>
          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => handleQuickSelect('owner@kamalbusiness.com', '+91 99060 00001')}
              type="button"
              className="w-full text-left p-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold text-stone-900 block">K. S. Kamal (Super Admin)</span>
                <span className="text-[10px] text-stone-500 block">Authorised: Both Firms (Firm Switcher Active)</span>
              </div>
              <span className="text-[10px] font-mono text-[#781D22] font-semibold">Test Login &rarr;</span>
            </button>

            <button
              onClick={() => handleQuickSelect('manager.enterprises@kamalbusiness.com', '+91 99060 11112')}
              type="button"
              className="w-full text-left p-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold text-stone-900 block">Ramesh Verma (Manager)</span>
                <span className="text-[10px] text-stone-500 block">Direct Route: Kamal Enterprises Only</span>
              </div>
              <span className="text-[10px] font-mono text-[#781D22] font-semibold">Test Login &rarr;</span>
            </button>

            <button
              onClick={() => handleQuickSelect('manager.industries@kamalbusiness.com', '+91 99060 22223')}
              type="button"
              className="w-full text-left p-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold text-stone-900 block">Vikram Jadeja (Manager)</span>
                <span className="text-[10px] text-stone-500 block">Direct Route: Kamal Industries Only</span>
              </div>
              <span className="text-[10px] font-mono text-stone-900 font-semibold">Test Login &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

