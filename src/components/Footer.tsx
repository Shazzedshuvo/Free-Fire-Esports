'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Headphones, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-charcoal-900 border-t border-slate-200 dark:border-charcoal-800 text-slate-600 dark:text-gray-400 text-sm mt-16 pb-20 md:pb-8 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ff-orange to-ff-red flex items-center justify-center shadow-glow-orange">
                <Flame className="w-5 h-5 text-black fill-current" />
              </div>
              <span className="font-display font-black text-2xl text-slate-900 dark:text-white tracking-wider">
                FREE FIRE <span className="text-ff-orange">ESPORTS</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
              Bangladesh premier esports competitive platform for Free Fire players. Automated bKash verification, custom lobbies, daily cash rewards, and 100% fair play.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                <span>bKash</span> Verified
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-ff-orange" /> Instant Room ID
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-slate-900 dark:text-white uppercase tracking-wider text-base mb-4 border-l-2 border-ff-orange pl-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-ff-orange transition-colors">
                  {t('nav_home')}
                </Link>
              </li>
              <li>
                <Link href="/matches" className="hover:text-ff-orange transition-colors">
                  {t('nav_matches')}
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-ff-orange transition-colors">
                  {t('nav_leaderboard')}
                </Link>
              </li>
              <li>
                <Link href="/how-to-deposit" className="hover:text-ff-orange transition-colors">
                  {t('nav_how_to_deposit')}
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-ff-orange transition-colors">
                  {t('nav_notices')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Rules & Fair Play */}
          <div>
            <h4 className="font-display font-bold text-slate-900 dark:text-white uppercase tracking-wider text-base mb-4 border-l-2 border-ff-amber pl-2.5">
              Rules & Security
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/rules" className="hover:text-ff-orange transition-colors">
                  Tournament Rules & Regulations
                </Link>
              </li>
              <li>
                <Link href="/fair-play" className="hover:text-ff-orange transition-colors">
                  Anti-Cheat & Fair Play Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-ff-orange transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-ff-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-ff-orange transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Community */}
          <div>
            <h4 className="font-display font-bold text-slate-900 dark:text-white uppercase tracking-wider text-base mb-4 border-l-2 border-emerald-500 pl-2.5">
              Player Community
            </h4>
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-3.5 font-medium">
              Need assistance with deposits or match credentials? Connect with our tournament marshals.
            </p>
            <div className="space-y-2.5">
              <a
                href="https://wa.me/8801892837461"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-bold shadow-sm"
              >
                <Headphones className="w-4 h-4" />
                <span>WhatsApp Official Support</span>
              </a>
              <a
                href="https://t.me/ff_esports_bd"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-all text-sm font-bold shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Telegram Official Channel</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-charcoal-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-gray-400 gap-4">
          <p>© 2026 Free Fire Esports Bangladesh. All rights reserved. Free Fire is a registered trademark of Garena.</p>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold">
            Secure Platform • bKash Payment Integration • 100% Anti-Cheat Policy
          </p>
        </div>
      </div>
    </footer>
  );
}
