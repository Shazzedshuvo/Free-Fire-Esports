'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Trophy, Zap, Shield, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Slide {
  id: string;
  badge: string;
  title: string;
  desc: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: string;
  accent: string;
}

const defaultSlides: Slide[] = [
  {
    id: '1',
    badge: '🏆 BANGLADESH #1 FREE FIRE ESPORTS',
    title: 'DOMINATE THE BATTLEFIELD, WIN REAL BDT CASH',
    desc: 'Compete in daily verified Solo, Duo, and Squad custom tournaments. Instant bKash deposits, fair play anti-cheat protection, and direct cash payouts.',
    ctaText: 'Browse Tournaments',
    ctaLink: '/matches',
    secondaryCtaText: 'Add Funds (bKash)',
    secondaryCtaLink: '/deposit',
    image: '/images/image.png',
    accent: 'from-ff-orange to-ff-amber',
  },
  {
    id: '2',
    badge: '⚡ WEEKLY SQUAD CHAMPIONSHIP',
    title: 'SQUAD WAR NIGHT - ৳10,000 PRIZE POOL',
    desc: 'Assemble your clan. 12 elite squads battle it out for the weekly trophy. Verified custom room ID release 10 minutes before the match start time.',
    ctaText: 'Join Squad Tournament',
    ctaLink: '/matches',
    secondaryCtaText: 'Tournament Rules',
    secondaryCtaLink: '/rules',
    image: '/images/image2.png',
    accent: 'from-amber-400 to-yellow-500',
  },
  {
    id: '3',
    badge: '🛡️ ZERO DELAY BKASH SYSTEM',
    title: 'INSTANT DEPOSIT & GUARANTEED PRIZE PAYOUTS',
    desc: 'Fastest deposit verification in Bangladesh. Enter your bKash TrxID, get instant wallet balance, and withdraw or enter tournaments effortlessly.',
    ctaText: 'Deposit Now (bKash)',
    ctaLink: '/deposit',
    secondaryCtaText: 'How to Deposit Guide',
    secondaryCtaLink: '/how-to-deposit',
    image: '/images/image3.png',
    accent: 'from-emerald-400 to-teal-500',
  },
  {
    id: '4',
    badge: '🔥 PRO LEAGUE ELITE SHOWDOWN',
    title: 'BERMUDA & KALAHARI GRAND MASTERS',
    desc: 'Showcase your headshot skills and strategic zone rotations against the top Free Fire players across Bangladesh. 100% anti-cheat protected lobbies.',
    ctaText: 'View Leaderboard',
    ctaLink: '/leaderboard',
    secondaryCtaText: 'Community Support',
    secondaryCtaLink: '/support',
    image: '/images/image4.png',
    accent: 'from-ff-red via-ff-orange to-ff-amber',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % defaultSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = defaultSlides[current];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-100/60 dark:bg-slate-900 border border-white/80 dark:border-charcoal-800 shadow-2xl mb-12 backdrop-blur-xl">
      {/* ================= FULL BACKGROUND IMAGE BANNER ================= */}
      <div className="relative min-h-[480px] sm:min-h-[520px] lg:min-h-[540px] flex items-center overflow-hidden">
        
        {/* Full Background Image (Crystal Clear, covers entire banner) */}
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover object-left sm:object-center brightness-105 contrast-[1.06] saturate-[1.12] transition-opacity duration-700 animate-in fade-in"
        />

        {/* Soft Ambient Overlay (Day Mode: crystal glass tint; Dark Mode: soft dark tint) */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/10 to-transparent dark:from-black/80 dark:via-black/25 dark:to-transparent lg:bg-gradient-to-r lg:from-white/40 lg:via-white/15 lg:to-transparent dark:lg:from-black/50 dark:lg:via-black/25 dark:lg:to-transparent pointer-events-none transition-colors"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-ff-orange/15 via-transparent to-transparent pointer-events-none"></div>

        {/* Right Side Floating Brand Badge on the artwork (Glass effect) */}
        <div className="hidden lg:flex absolute top-6 right-6 z-20 items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 dark:bg-black/50 backdrop-blur-xl border border-white/60 dark:border-white/20 text-xs font-black text-slate-900 dark:text-white shadow-lg transition-colors">
          <Flame className="w-4 h-4 text-ff-orange fill-current" />
          <span>FREE FIRE ESPORTS BD</span>
        </div>

        {/* ================= LEFT-ALIGNED ULTRA-MODERN FROSTED GLASS CARD ================= */}
        <div className="relative z-10 w-full p-4 sm:p-7 lg:p-10 flex justify-start">
          <div className="w-full lg:max-w-2xl bg-white/45 dark:bg-black/45 backdrop-blur-2xl p-6 sm:p-8 lg:p-9 rounded-3xl border border-white/70 dark:border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-4 text-left transition-all">
            
            {/* Top Badge & Live Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/50 dark:bg-ff-orange/20 border border-white/70 dark:border-ff-orange/60 text-orange-600 dark:text-ff-amber text-xs sm:text-sm font-black tracking-wider uppercase backdrop-blur-xl shadow-sm">
                <Flame className="w-4 h-4 text-ff-orange fill-current" />
                <span>{slide.badge}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 dark:bg-emerald-500/20 border border-emerald-500/40 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold backdrop-blur-xl shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>LIVE TOURNAMENTS</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white tracking-wide leading-tight drop-shadow-sm dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-800 dark:text-gray-100 leading-relaxed font-semibold">
              {slide.desc}
            </p>

            {/* 10-Minute Room ID & Password Notice Bar (Frosted Glass Style) */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/20 dark:bg-black/40 backdrop-blur-xl border border-amber-500/40 dark:border-ff-orange/50 text-xs sm:text-sm font-bold text-amber-950 dark:text-ff-amber flex items-center gap-2.5 shadow-sm">
              <span className="text-lg flex-shrink-0">🔔</span>
              <span className="leading-snug">
                <strong>জরুরি নিয়ম:</strong> টুর্নামেন্ট শুরু হওয়ার <strong className="bg-white/80 dark:bg-black/70 text-slate-950 dark:text-white px-2 py-0.5 rounded-lg border border-white/80 dark:border-ff-orange/60 shadow-sm backdrop-blur-md">১০ মিনিট আগে</strong> রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে।
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-ff-orange via-amber-500 to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black uppercase text-xs sm:text-sm tracking-wider shadow-glow-orange hover:scale-105 active:scale-95 transition-all"
              >
                <span className="w-5 h-5 rounded-full bg-white/40 backdrop-blur-sm text-slate-950 flex items-center justify-center font-mono text-[10px]">▶</span>
                <span>{slide.ctaText}</span>
              </Link>

              {slide.secondaryCtaText && (
                <Link
                  href={slide.secondaryCtaLink || '/'}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/40 hover:bg-white/60 text-slate-900 border border-white/70 dark:bg-white/15 dark:hover:bg-white/25 dark:border-white/30 dark:text-white font-bold text-xs sm:text-sm backdrop-blur-xl transition-all shadow-sm"
                >
                  <span>{slide.secondaryCtaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-ff-orange" />
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Subtle Slide Dots Indicator on the Banner */}
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
          {defaultSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current
                  ? 'w-7 bg-ff-orange shadow-glow-orange/50'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
