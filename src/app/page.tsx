'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import NoticeSection from '@/components/NoticeSection';
import TournamentCard, { TournamentData } from '@/components/TournamentCard';
import JoinModal from '@/components/JoinModal';
import HowToPlay from '@/components/HowToPlay';
import { useLanguage } from '@/context/LanguageContext';
import { Gamepad2, Trophy, Flame, ArrowRight, ShieldCheck, Headphones, Zap } from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<TournamentData | null>(null);

  // Filters
  const [modeFilter, setModeFilter] = useState('ALL');
  const [priceFilter, setPriceFilter] = useState('ALL'); // ALL, FREE, PAID

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      let url = '/api/tournaments?status=ALL';
      if (modeFilter !== 'ALL') url += `&mode=${modeFilter}`;
      if (priceFilter === 'FREE') url += '&filter=free';
      if (priceFilter === 'PAID') url += '&filter=paid';

      const res = await fetch(url);
      const data = await res.json();
      if (data.tournaments) {
        setTournaments(data.tournaments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [modeFilter, priceFilter]);

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Official Notices */}
      <NoticeSection />

      {/* Tournaments Section */}
      <section className="my-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-ff-orange/15 text-ff-orange">
                <Gamepad2 className="w-7 h-7 text-ff-orange" />
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white tracking-wide">
                ACTIVE & UPCOMING TOURNAMENTS
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 mt-2 font-medium">
              Select your match mode, reserve your slot, and secure your room entrance.
            </p>
          </div>

          {/* Mode & Price Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 p-1 rounded-xl shadow-sm">
              {['ALL', 'SOLO', 'DUO', 'SQUAD'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setModeFilter(mode)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    modeFilter === mode
                      ? 'bg-ff-orange text-black font-black shadow-glow-orange/30'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 p-1 rounded-xl shadow-sm">
              {['ALL', 'PAID', 'FREE'].map((price) => (
                <button
                  key={price}
                  onClick={() => setPriceFilter(price)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    priceFilter === price
                      ? 'bg-amber-500 text-black font-black shadow-glow-amber/30'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tournaments Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-100 dark:bg-charcoal-900 animate-pulse border border-slate-200 dark:border-charcoal-800"></div>
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
            <Gamepad2 className="w-14 h-14 text-slate-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-slate-900 dark:text-white font-bold text-xl">No tournaments found for selected filter.</p>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1.5">Try resetting the filter to view all active custom rooms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {tournaments.map((t) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                onJoinClick={(tourney) => setSelectedTournament(tourney)}
              />
            ))}
          </div>
        )}
      </section>

      {/* How To Play */}
      <HowToPlay />

      {/* Community & Fast Deposit Callout */}
      <section className="my-14 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-charcoal-900 dark:via-charcoal-900 dark:to-charcoal-950 border-2 border-ff-orange/30 p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-ff-orange/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-black uppercase tracking-wider">
            24/7 INSTANT SYSTEM
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white mt-3">
            NEED TO TOP UP YOUR WALLET?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 mt-2.5 leading-relaxed font-medium">
            Deposit BDT safely via bKash personal or merchant payment. Verified instantaneously with zero hidden fees. Ready to jump into the next custom room lobby!
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/deposit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase text-sm tracking-wider shadow-glow-orange transition-all hover:scale-[1.02]"
            >
              <span>Deposit via bKash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-to-deposit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-charcoal-700 transition-colors shadow-sm"
            >
              <span>Step-by-step Guide</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tournament Join Modal */}
      {selectedTournament && (
        <JoinModal
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
          onSuccess={() => {
            fetchTournaments();
          }}
        />
      )}
    </div>
  );
}
