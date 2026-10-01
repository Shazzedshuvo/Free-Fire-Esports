'use client';

import React from 'react';
import { ShieldAlert, Crosshair, Trophy, AlertTriangle } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-ff-orange" />
          <span>OFFICIAL TOURNAMENT RULES & REGULATIONS</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">
          Mandatory rules for all participants in Solo, Duo, and Squad custom lobbies.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-6 text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-2 border-ff-orange pl-3">
            1. Player Eligibility & UID Verification
          </h2>
          <p>
            All participants must possess a legitimate Free Fire account. The numeric UID entered during registration must match the in-game UID of the account joining the custom room. Any player joining with an unverified or alternate account will be kicked from the room without refund.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-2 border-ff-orange pl-3">
            2. Room Entry & Punctuality
          </h2>
          <p>
            Custom Room ID and Room Password are automatically disclosed exactly 10 minutes before match start time inside your "My Matches" dashboard (টুর্নামেন্ট শুরু হওয়ার ১০ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে). All players must enter the room at least 3-5 minutes prior to the designated match start. The match starts promptly at the stated time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-2 border-ff-orange pl-3">
            3. Device Restrictions
          </h2>
          <p>
            All tournaments hosted on this platform are <strong>Mobile Only (Android / iOS)</strong>. The use of PC emulators (BlueStacks, LDPlayer, GameLoop, etc.), trigger hardware attachments, keyboard/mouse converters, or modified operating systems is strictly prohibited. Detected emulator users will receive an immediate permanent suspension.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-2 border-ff-orange pl-3">
            4. Teaming & Griefing in Solo Matches
          </h2>
          <p>
            Teaming or peaceful cooperation in Solo lobbies is zero tolerance. If two players are found sharing vehicles, avoiding combat, or communicating during a solo match, both will be banned and forfeit all wallet balances.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white border-l-2 border-ff-orange pl-3">
            5. Prize Payout Verification
          </h2>
          <p>
            Prize payouts are calculated based on final placement rank and eliminations verified by custom room match logs. Winners receive automatic wallet credits immediately following marshal confirmation.
          </p>
        </section>
      </div>
    </div>
  );
}
