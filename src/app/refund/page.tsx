'use client';

import React from 'react';
import { RefreshCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide flex items-center gap-2">
          <RefreshCcw className="w-7 h-7 text-sky-400" />
          <span>REFUND & CANCELLATION POLICY</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Rules regarding tournament cancellations, entry fee refunds, and deposit queries.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white border-l-2 border-sky-400 pl-3">
            Tournament Cancellation by Administration
          </h2>
          <p>
            If a tournament is cancelled due to game server outages, maintenance by Garena, or insufficient participants prior to the start time, 100% of the entry fee is automatically refunded directly to every enrolled player's wallet balance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white border-l-2 border-sky-400 pl-3">
            Player No-Show or Failure to Join Custom Room
          </h2>
          <p>
            If a player has registered and the room ID/password are published on time, but the player fails to enter the custom room before the designated start time, no refund will be provided as that slot was reserved and denied to other competitors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white border-l-2 border-sky-400 pl-3">
            Duplicate or Overpaid bKash Transactions
          </h2>
          <p>
            In the event that an accidental duplicate transaction or overpayment occurs, players should contact our official support with the bKash TrxID and phone statement for a prompt resolution.
          </p>
        </section>
      </div>
    </div>
  );
}
