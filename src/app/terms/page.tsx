'use client';

import React from 'react';
import { FileText, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
          <FileText className="w-7 h-7 text-amber-500" />
          <span>TERMS OF SERVICE & USER AGREEMENT</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">
          By registering an account and using this platform, you agree to comply with all terms herein.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white/75 dark:bg-charcoal-900 backdrop-blur-xl border border-white/80 dark:border-charcoal-800 shadow-xl space-y-6 text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-4 border-amber-500 pl-3">
            1. User Accounts & Identity
          </h2>
          <p>
            Users must provide truthful personal information, including their real mobile number and accurate Free Fire numeric Player UID. Each player is permitted only one primary account. Multi-accounting to exploit promotions or join multiple slots in a single lobby will result in account suspension.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-4 border-amber-500 pl-3">
            2. Financial Wallet & Transactions
          </h2>
          <p>
            Wallet balances are maintained for tournament registration and prize distribution. Deposits made via bKash are converted into tournament credits. Users are strictly responsible for entering valid, legitimate Transaction IDs (TrxID). Submitting falsified TrxIDs will cause immediate account termination.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-4 border-amber-500 pl-3">
            3. Disclaimer & Trademark
          </h2>
          <p>
            Free Fire is a registered trademark of Garena International. This tournament platform operates independently as a competitive esports organizer and is not officially affiliated with or endorsed by Garena.
          </p>
        </section>
      </div>
    </div>
  );
}
