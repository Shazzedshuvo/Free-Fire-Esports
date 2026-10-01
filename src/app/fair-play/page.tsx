'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, Ban, Lock } from 'lucide-react';

export default function FairPlayPage() {
  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
          <span>FAIR PLAY & ANTI-CHEAT POLICY</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Our commitment to 100% fair competition and integrity in competitive mobile esports.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
          <p>
            <strong>Strict Warning:</strong> We enforce automated and manual anti-cheat monitoring in all tournament lobbies. Cheating not only forfeits your entry fee and prize pool, but also leads to an immediate permanent ban on your device, phone number, and Free Fire UID.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white border-l-2 border-emerald-400 pl-3">
            Prohibited Software & Modifications
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
            <li>Any third-party hack scripts, APK mod menus, auto-aim (aimbot), or wallhacks (ESP).</li>
            <li>Modified game config files, high-damage antennas, or white-body textures.</li>
            <li>Use of VPN services to mask location or manipulate server tick rates and ping lag.</li>
            <li>Account boosting, smurfing with fake low-level accounts, or identity fraud.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white border-l-2 border-emerald-400 pl-3">
            Reporting Rule Violations
          </h2>
          <p>
            If you encounter suspected cheating during a tournament, please record video proof or take high-resolution screenshots and submit them to our support marshals on WhatsApp within 15 minutes of the match completion. All reports are reviewed by tournament managers prior to final prize release.
          </p>
        </section>
      </div>
    </div>
  );
}
