'use client';

import React from 'react';
import { Flame, Trophy, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ff-orange to-ff-red flex items-center justify-center mx-auto shadow-glow-orange mb-3">
          <Flame className="w-7 h-7 text-black fill-current animate-pulse" />
        </div>
        <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
          ABOUT FREE FIRE ESPORTS BD
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">
          Empowering Bangladeshi gamers with professional competitive infrastructure, automated bKash prize payouts, and fair play lobbies.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <p>
          Founded in 2026, Free Fire Esports BD is the premier community and tournament platform built exclusively for mobile battle royale competitors in Bangladesh. Our mission is to bridge grassroots passionate gamers with competitive prize-winning opportunities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 text-center">
            <Trophy className="w-6 h-6 text-ff-amber mx-auto mb-2" />
            <h3 className="font-display font-bold text-white text-base">Verified Payouts</h3>
            <p className="text-xs text-gray-400 mt-1">Guaranteed prize distributions sent directly to winner bKash wallets.</p>
          </div>
          <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 text-center">
            <Zap className="w-6 h-6 text-ff-orange mx-auto mb-2" />
            <h3 className="font-display font-bold text-white text-base">Instant Room IDs</h3>
            <p className="text-xs text-gray-400 mt-1">Direct credential release 15 minutes before match start.</p>
          </div>
          <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 text-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h3 className="font-display font-bold text-white text-base">100% Anti-Cheat</h3>
            <p className="text-xs text-gray-400 mt-1">Zero tolerance policy against emulators, hacks, and teaming.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
