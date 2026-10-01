'use client';

import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          <span>PRIVACY & DATA PROTECTION POLICY</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">
          How we collect, store, and protect your personal information and transaction records.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white/75 dark:bg-charcoal-900 backdrop-blur-xl border border-white/80 dark:border-charcoal-800 shadow-xl space-y-6 text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-4 border-emerald-500 pl-3">
            Information We Collect
          </h2>
          <p>
            We collect personal details necessary to verify your esports identity and process bKash payments, including your name, email address, mobile number, Free Fire in-game name, and numeric Free Fire UID.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-4 border-emerald-500 pl-3">
            Payment Data & Encryption
          </h2>
          <p>
            We never store your bKash PIN, bank passwords, or confidential financial credentials. We only record Transaction IDs (TrxID), amounts, and sending mobile numbers to reconcile deposit statements securely.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-4 border-emerald-500 pl-3">
            Data Confidentiality
          </h2>
          <p>
            Your contact information is strictly protected and will never be sold or transferred to external third parties.
          </p>
        </section>
      </div>
    </div>
  );
}
