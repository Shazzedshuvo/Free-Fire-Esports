'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Send, Copy, ArrowRight, ShieldCheck, CheckCircle2, HelpCircle, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const OFFICIAL_NUMBER = '01719052334';

export default function HowToDepositPage() {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(OFFICIAL_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      num: '১',
      titleBn: 'বিকাশ, নগদ বা রকেট অ্যাপ ওপেন করুন',
      titleEn: 'Open Mobile Banking App or Dial USSD Code',
      descBn: 'আপনার স্মার্টফোনে অফিশিয়াল bKash, Nagad, Upay বা Rocket অ্যাপ ওপেন করুন অথবা কিপ্যাড ফোন থেকে সরাসরি ডায়াল কোড (*247# / *167#) চাপুন।',
      icon: Smartphone,
    },
    {
      num: '২',
      titleBn: '"Send Money" (সেন্ড মানি) অপশন নির্বাচন করুন',
      titleEn: 'Select "Send Money" Option',
      descBn: 'অ্যাপের প্রধান মেনু থেকে অবশ্যই "Send Money" (সেন্ড মানি) অপশনটি বেছে নিন। এটি আমাদের অফিশিয়াল পার্সোনাল নম্বর।',
      icon: Send,
    },
    {
      num: '৩',
      titleBn: 'আমাদের অফিশিয়াল নম্বর ও টাকার পরিমাণ দিন',
      titleEn: 'Enter Official Number & Amount',
      descBn: `প্রাপক নম্বরে আমাদের পার্সোনাল নম্বর ${OFFICIAL_NUMBER} লিখুন এবং আপনার ফ্রি ফায়ার ওয়ালেটে যত টাকা যোগ করতে চান ঠিক সেই পরিমাণ টাকা বসান।`,
      icon: Send,
    },
    {
      num: '৪',
      titleBn: 'গোপন পিন দিয়ে সেন্ড মানি করুন ও TrxID কপি করুন',
      titleEn: 'Complete Transfer & Copy TrxID',
      descBn: 'আপনার সিক্রেট পিন কোড দিয়ে টাকা পাঠানো সম্পন্ন করুন। টাকা সফলভাবে যাওয়ার সাথে সাথে স্ক্রিনে আসা ১০ ডিজিটের Transaction ID (TrxID) টি কপি করুন বা স্ক্রিনশট রাখুন।',
      icon: Copy,
    },
    {
      num: '৫',
      titleBn: 'ওয়েবসাইটের ডিপোজিট পেইজে এসে TrxID সাবমিট করুন',
      titleEn: 'Open Deposit Page & Submit Details',
      descBn: 'আমাদের ওয়েবসাইটের "ডিপোজিট" উইন্ডোতে যান, যে মাধ্যম (bKash/Nagad/Rocket) থেকে টাকা পাঠিয়েছেন তা সিলেক্ট করুন এবং আপনার পাঠানো TrxID ও প্রেরক নম্বরটি লিখে সাবমিট করুন।',
      icon: Smartphone,
    },
    {
      num: '৬',
      titleBn: 'তাৎক্ষণিক ভেরিফিকেশন ও ওয়ালেটে ব্যালেন্স জমা',
      titleEn: 'Instant Verification & Wallet Balance Added',
      descBn: 'রিকোয়েস্ট সাবমিট করার সাথে সাথেই অ্যাডমিন TrxID মিলিয়ে আপনার অ্যাকাউন্টে টাকা ক্রেডিট করে দেবেন। এরপর আপনি সরাসরি টুর্নামেন্টে জয়েন করতে পারবেন!',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      {/* Title & Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 text-sm font-black text-orange-600 dark:text-ff-amber tracking-widest uppercase bg-orange-500/10 dark:bg-charcoal-800 px-4 py-1.5 rounded-full border border-orange-500/30 dark:border-charcoal-700 shadow-sm backdrop-blur-md">
          <Flame className="w-4 h-4 text-ff-orange fill-current" />
          <span>সহজ ডিপোজিট নির্দেশিকা (Step-by-Step Tutorial)</span>
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-wide">
          কীভাবে ওয়ালেটে টাকা যোগ করবেন?
        </h1>
        <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 font-semibold leading-relaxed">
          খুব সহজে নিচের ৬টি ধাপ অনুসরণ করে আপনার বিকাশ, নগদ বা রকেট থেকে ওয়ালেটে টাকা অ্যাড করুন এবং ফ্রি ফায়ার টুর্নামেন্টে জয়েন করুন।
        </p>
      </div>

      {/* Official Number Highlight Card (Frosted Glass) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-charcoal-900/90 backdrop-blur-2xl border border-white/90 dark:border-charcoal-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-ff-orange text-2xl font-black shadow-sm flex-shrink-0">
            📱
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-slate-600 dark:text-gray-400 uppercase tracking-wider">
              অফিশিয়াল পার্সোনাল নম্বর (Send Money): bKash / Nagad / Upay / Rocket
            </div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-slate-950 dark:text-ff-amber tracking-wider mt-0.5">
              {OFFICIAL_NUMBER}
            </div>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-ff-orange via-amber-500 to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow-glow-orange active:scale-95"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? 'নম্বর কপি হয়েছে! ✓' : 'নম্বর কপি করুন (Copy)'}</span>
        </button>
      </div>

      {/* Steps List (Premium Glassmorphic Cards with Clear Bangla Explanations) */}
      <div className="space-y-5">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="p-6 rounded-3xl bg-white/80 dark:bg-charcoal-900/90 backdrop-blur-2xl border border-white/90 dark:border-charcoal-800 hover:border-ff-orange/60 dark:hover:border-ff-orange/60 transition-all flex items-start gap-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-xl group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ff-orange via-amber-500 to-ff-amber flex items-center justify-center font-display font-black text-slate-950 text-xl flex-shrink-0 shadow-glow-orange/40 group-hover:scale-105 transition-transform">
                {s.num}
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white transition-colors">
                  {s.titleBn}
                </h3>
                <div className="text-xs font-bold text-orange-600 dark:text-ff-amber">
                  {s.titleEn}
                </div>
                <p className="text-sm sm:text-base text-slate-800 dark:text-gray-200 leading-relaxed font-semibold pt-1">
                  {s.descBn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Notice (Translucent Glass Style) */}
      <div className="p-6 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/15 backdrop-blur-xl border border-emerald-500/40 flex items-start gap-4 shadow-sm">
        <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
            ১০০% নিরাপদ ও সুরক্ষিত ট্রানজেকশন গ্যারান্টি
          </p>
          <p className="text-sm sm:text-base text-slate-700 dark:text-gray-200 font-semibold leading-relaxed">
            প্রতিটি TrxID ডুপ্লিকেট প্রটেকশন সিস্টেমে সুরক্ষিত। আপনার টাকা সাথে সাথে ভেরিফাই করে সঠিক অ্যাকাউন্টে জমা হবে। মনে রাখবেন, আপনার মোবাইল ব্যাংকিং পিন বা পাসওয়ার্ড কখনোই কাউকে শেয়ার করবেন না।
          </p>
        </div>
      </div>

      {/* Direct CTA to Deposit Modal/Page */}
      <div className="text-center pt-2">
        <Link
          href="/deposit"
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-ff-orange via-amber-500 to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black uppercase text-base tracking-wider shadow-glow-orange hover:scale-105 active:scale-95 transition-all"
        >
          <span>সরাসরি ডিপোজিট করুন (Deposit Now)</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
