'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  X,
  Wallet,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Headphones,
  Send,
  Sparkles,
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export type PaymentProvider = 'bKash' | 'Nagad' | 'Upay' | 'Rocket';

interface ProviderOption {
  id: PaymentProvider;
  name: string;
  bnName: string;
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  logoText: string;
  tag: string;
}

const PROVIDERS: ProviderOption[] = [
  {
    id: 'bKash',
    name: 'bKash',
    bnName: 'বিকাশ',
    color: '#E2136E',
    bgLight: 'bg-pink-500/10',
    borderColor: 'border-pink-500',
    textColor: 'text-pink-600 dark:text-pink-400',
    logoText: 'bKash',
    tag: 'Personal (Send Money)',
  },
  {
    id: 'Nagad',
    name: 'Nagad',
    bnName: 'নগদ',
    color: '#F7941D',
    bgLight: 'bg-orange-500/10',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-600 dark:text-orange-400',
    logoText: 'Nagad',
    tag: 'Personal (Send Money)',
  },
  {
    id: 'Upay',
    name: 'Upay',
    bnName: 'উপায়',
    color: '#005697',
    bgLight: 'bg-sky-500/10',
    borderColor: 'border-sky-500',
    textColor: 'text-sky-600 dark:text-sky-400',
    logoText: 'Upay',
    tag: 'Personal (Send Money)',
  },
  {
    id: 'Rocket',
    name: 'Rocket',
    bnName: 'রকেট',
    color: '#8C3494',
    bgLight: 'bg-purple-500/10',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    logoText: 'Rocket',
    tag: 'Personal (Send Money)',
  },
];

export const OFFICIAL_DEPOSIT_NUMBER = '01719052334';

export default function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const { user, refreshUser } = useAuth();
  const { t, language } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('bKash');

  // Form Fields
  const [amount, setAmount] = useState<string>('100');
  const [senderNumber, setSenderNumber] = useState<string>(user?.mobileNumber || '');
  const [transactionId, setTransactionId] = useState<string>('');
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);

  // States
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Countdown timer for Step 3
  const [countdown, setCountdown] = useState<number>(3);

  // Quick amount selections
  const quickAmounts = [50, 100, 200, 500, 1000];

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError(null);
      setCountdown(3);
      if (user?.mobileNumber && !senderNumber) {
        setSenderNumber(user.mobileNumber);
      }
    }
  }, [isOpen, user]);

  // Countdown effect when reaching step 3
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 3) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, onClose]);

  if (!isOpen) return null;

  const currentProviderObj = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(OFFICIAL_DEPOSIT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Screenshot file size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to request deposit.');
      return;
    }

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 50 || numAmount > 25000) {
      setError('Deposit amount must be between ৳50 and ৳25,000.');
      return;
    }

    if (!senderNumber || senderNumber.trim().length < 11) {
      setError('Please enter a valid 11-digit sender phone number.');
      return;
    }

    if (!transactionId || transactionId.trim().length < 6) {
      setError(`Please enter a valid ${selectedProvider} Transaction ID (TrxID).`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount,
          senderNumber: senderNumber.trim(),
          transactionId: transactionId.trim().toUpperCase(),
          method: selectedProvider,
          screenshotUrl: screenshotBase64,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit deposit request.');
      } else {
        await refreshUser();
        if (onSuccess) onSuccess();
        // Advance to step 3 (countdown & completion)
        setStep(3);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Step Indicator */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-charcoal-800 bg-slate-50/80 dark:bg-charcoal-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/15 text-ff-orange">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                {step === 1 && 'Select Payment Provider'}
                {step === 2 && 'Send Money & Confirm'}
                {step === 3 && 'Deposit Submitted!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                Step {step} of 3 • Instant 24/7 Processing
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ================= STEP 1: SELECT PROVIDER ================= */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center sm:text-left">
                <span className="text-xs font-black uppercase tracking-widest text-ff-orange">
                  PAYMENT GATEWAYS
                </span>
                <h4 className="font-display font-black text-xl text-slate-900 dark:text-white mt-0.5">
                  Select Your Provider (প্রোভাইডার বেছে নিন)
                </h4>
                <p className="text-sm text-slate-600 dark:text-gray-300 mt-1 font-medium">
                  Choose which mobile banking service you want to send money from:
                </p>
              </div>

              {/* Provider Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                {PROVIDERS.map((p) => {
                  const isSelected = selectedProvider === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProvider(p.id)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-28 group ${
                        isSelected
                          ? `${p.borderColor} ${p.bgLight} shadow-lg scale-[1.02] ring-2 ring-orange-500/30`
                          : 'border-slate-200 dark:border-charcoal-700 hover:border-slate-300 dark:hover:border-charcoal-600 bg-slate-50/50 dark:bg-charcoal-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className="font-black text-lg tracking-wider"
                          style={{ color: p.color }}
                        >
                          {p.name}
                        </span>
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-charcoal-600"></div>
                        )}
                      </div>

                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm block">
                          {p.bnName}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium block">
                          Send Money
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase text-sm tracking-wider shadow-glow-orange flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Continue with {selectedProvider} (পরবর্তী ধাপ)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: SEND MONEY & DETAILS ================= */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Provider Badge */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-charcoal-800 border border-slate-200 dark:border-charcoal-700">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm"
                    style={{ backgroundColor: currentProviderObj.color }}
                  >
                    {currentProviderObj.name[0]}
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-gray-400 block font-semibold">
                      Selected Provider
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {currentProviderObj.name} ({currentProviderObj.bnName})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-ff-orange hover:underline px-2.5 py-1 rounded-lg hover:bg-orange-500/10"
                >
                  Change
                </button>
              </div>

              {/* Official Number Send Money Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border-2 border-dashed border-ff-orange/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-ff-orange">
                    Send Money করুন এই নম্বরে:
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-600 dark:text-amber-400">
                    Personal Number
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 mt-2 bg-white dark:bg-charcoal-950 p-3 rounded-xl border border-slate-200 dark:border-charcoal-700 shadow-sm">
                  <span className="font-mono font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-wider">
                    {OFFICIAL_DEPOSIT_NUMBER}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>
              </div>

              {/* Amount Input & Quick Select Chips */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                  Deposit Amount (টাকার পরিমাণ - ৳ BDT) *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max="25000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white font-bold text-sm focus:border-ff-orange focus:outline-none shadow-sm"
                />

                {/* Quick Amount Chips */}
                <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(String(q))}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        amount === String(q)
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-charcoal-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200'
                      }`}
                    >
                      ৳{q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender Number Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Sender Mobile Number (যে নম্বর থেকে টাকা পাঠিয়েছেন) *
                </label>
                <input
                  type="tel"
                  required
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white font-bold text-sm focus:border-ff-orange focus:outline-none shadow-sm"
                />
              </div>

              {/* Transaction ID (TrxID) Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  {selectedProvider} Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder="e.g. BKT98765432"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono font-bold text-sm focus:border-ff-orange focus:outline-none shadow-sm"
                />
              </div>

              {/* Screenshot (SS) Upload */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Payment Screenshot Proof (স্ক্রিনশট - অপশনাল)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-950 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-600 dark:text-gray-400">
                    <Upload className="w-4 h-4 text-ff-orange" />
                    <span>{screenshotBase64 ? 'Change Screenshot' : 'Upload Screenshot (SS)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                  </label>
                  {screenshotBase64 && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-500 shadow-sm flex-shrink-0">
                      <img
                        src={screenshotBase64}
                        alt="SS Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Help & Contact Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 space-y-2">
                <p className="text-xs text-slate-600 dark:text-gray-300 font-medium leading-relaxed">
                  ⚠️ টাকা পাঠানোর পর ৫-১০ মিনিটের মধ্যে ওয়ালেটে জমা না হলে WhatsApp বা Telegram-এ যোগাযোগ করুন:
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://wa.me/8801719052334"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-500/25 transition-colors"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>WhatsApp Support</span>
                  </a>
                  <a
                    href="https://t.me/ff_esports_bd"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-sky-500/25 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram Channel</span>
                  </a>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-700 dark:text-gray-300 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-glow-orange disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting...' : `Submit Deposit (৳${amount})`}
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 3: SUCCESS & 3-SECOND COUNTDOWN ================= */}
          {step === 3 && (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <h4 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                  ডিপোজিট রিকোয়েস্ট সফলভাবে জমা হয়েছে!
                </h4>
                <p className="text-sm text-slate-600 dark:text-gray-300 mt-1 font-medium">
                  আপনার ডিপোজিটটি ভেরিফিকেশনের জন্য অ্যাডমিন প্যানেলে পাঠানো হয়েছে।
                </p>
              </div>

              {/* Submission Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-gray-400">
                  <span>Provider:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedProvider}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-gray-400">
                  <span>Amount:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">৳{amount}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-gray-400">
                  <span>TrxID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{transactionId}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-gray-400">
                  <span>Sent To:</span>
                  <span className="font-mono font-bold text-ff-orange">{OFFICIAL_DEPOSIT_NUMBER}</span>
                </div>
              </div>

              {/* Contact Reminder */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-medium">
                টাকা জমা না হলে WhatsApp (01719052334) বা Telegram এ যোগাযোগ করুন।
              </div>

              {/* 3-Second Countdown Box */}
              <div className="pt-2 flex flex-col items-center justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-charcoal-800 border border-slate-200 dark:border-charcoal-700 text-xs font-bold text-slate-700 dark:text-gray-300 shadow-sm">
                  <Clock className="w-4 h-4 text-ff-orange animate-spin" />
                  <span>
                    এই উইন্ডোটি <strong className="text-ff-orange font-black text-sm">{countdown}</strong> সেকেন্ডে বন্ধ হয়ে যাবে...
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white underline"
                >
                  Close Window Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
