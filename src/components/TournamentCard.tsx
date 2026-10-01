'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Trophy, Users, ShieldAlert, CheckCircle2, ExternalLink, Play, Tv } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export interface TournamentData {
  id: string;
  title: string;
  bannerImage: string;
  gameMode: string; // SOLO, DUO, SQUAD
  mapName: string;
  entryFee: number;
  prizePool: number;
  winnerPrize: number;
  runnerUpPrize?: number;
  totalSlots: number;
  remainingSlots: number;
  matchDate: string;
  matchTime: string;
  status: string; // REGISTRATION_OPEN, FULL, LIVE, COMPLETED, UPCOMING, CANCELLED
  isUserJoined?: boolean;
  liveStreamUrl?: string | null;
}

interface TournamentCardProps {
  tournament: TournamentData;
  onJoinClick?: (t: TournamentData) => void;
}

export default function TournamentCard({ tournament, onJoinClick }: TournamentCardProps) {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();

  const filledSlots = tournament.totalSlots - tournament.remainingSlots;
  const slotPercentage = Math.min(100, Math.round((filledSlots / tournament.totalSlots) * 100));

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'SOLO':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'DUO':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      case 'SQUAD':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LIVE':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/30 border border-red-500 text-red-400 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            {t('live')}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-700 text-gray-300">
            {t('completed')}
          </span>
        );
      case 'FULL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600/20 border border-amber-500/40 text-amber-400">
            {t('full')}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
            {t('registration_open')}
          </span>
        );
    }
  };

  const isFull = tournament.remainingSlots <= 0 || tournament.status === 'FULL';
  const isRegistrationClosed = tournament.status !== 'REGISTRATION_OPEN';

  // Smart fallback to user's local images
  const getBannerImage = () => {
    const raw = tournament.bannerImage;
    if (raw && raw.startsWith('/images/')) return raw;
    if (tournament.gameMode === 'SOLO') return '/images/image.png';
    if (tournament.gameMode === 'SQUAD') return '/images/image2.png';
    if (tournament.gameMode === 'DUO') return '/images/image3.png';
    return '/images/image4.png';
  };

  const cardImage = getBannerImage();
  const liveUrl = tournament.liveStreamUrl || settings.youtube_live_url || 'https://www.youtube.com';

  return (
    <div className="bg-white dark:bg-charcoal-900 border border-slate-200/90 dark:border-charcoal-800 hover:border-ff-orange dark:hover:border-ff-orange/60 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Banner & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-charcoal-800">
        <img
          src={cardImage}
          alt={tournament.title}
          className="w-full h-full object-cover brightness-100 contrast-[1.05] saturate-[1.08] group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider shadow-md backdrop-blur-md ${getModeBadge(tournament.gameMode)}`}>
            {tournament.gameMode}
          </span>
          <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-md">
            <MapPin className="w-3.5 h-3.5 text-ff-orange" />
            {tournament.mapName}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {getStatusBadge(tournament.status)}
        </div>

        {/* User joined badge */}
        {tournament.isUserJoined && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs sm:text-sm font-black tracking-wide shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>YOU ARE REGISTERED</span>
          </div>
        )}

        {/* Live Broadcast Badge on Media */}
        {tournament.status === 'LIVE' && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black tracking-wider shadow-xl border border-white/30 animate-pulse transition-transform hover:scale-105"
            title="Watch Full Match Live Broadcast"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            <span>🔴 LIVE MATCH</span>
          </a>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title - Bigger font */}
          <Link href={`/matches/${tournament.id}`}>
            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white group-hover:text-ff-orange transition-colors line-clamp-1">
              {tournament.title}
            </h3>
          </Link>

          {/* Time & Date - Larger and clearer */}
          <div className="flex items-center gap-5 mt-2.5 text-sm font-semibold text-slate-600 dark:text-gray-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-ff-orange" />
              <span>{tournament.matchDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>{tournament.matchTime}</span>
            </div>
          </div>

          {/* Financials: Entry Fee vs Prize Pool - Modern Box with Large text */}
          <div className="grid grid-cols-2 gap-3 mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200/90 dark:border-charcoal-800">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                {t('entry_fee')}
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                {tournament.entryFee === 0 ? 'FREE' : `৳${tournament.entryFee}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                {t('prize_pool')}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-display flex items-center justify-end gap-1">
                <Trophy className="w-5 h-5 text-amber-500 inline" />
                ৳{tournament.prizePool.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Slots Progress Bar - High contrast */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-semibold mb-1.5">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-ff-orange" />
                <span>{t('slots')}</span>
              </span>
              <span className="text-slate-900 dark:text-white font-bold">
                {filledSlots} / {tournament.totalSlots} ({slotPercentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-charcoal-950 h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-charcoal-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  slotPercentage >= 90
                    ? 'bg-gradient-to-r from-red-500 to-ff-orange'
                    : 'bg-gradient-to-r from-ff-orange to-ff-yellow'
                }`}
                style={{ width: `${slotPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons Area */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-charcoal-800/80 space-y-2.5">
          <div className="flex items-center gap-3">
            <Link
              href={`/matches/${tournament.id}`}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-charcoal-700 text-center text-sm font-bold transition-all shadow-sm"
            >
              {t('view_details')}
            </Link>

            {tournament.isUserJoined ? (
              <Link
                href={`/matches/${tournament.id}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-center text-sm font-black hover:bg-emerald-500/25 transition-all shadow-sm"
              >
                ROOM DETAILS
              </Link>
            ) : isFull ? (
              <button
                disabled
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 text-slate-400 dark:text-gray-500 text-center text-sm font-bold cursor-not-allowed"
              >
                {t('full')}
              </button>
            ) : isRegistrationClosed ? (
              <button
                disabled
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 text-slate-400 dark:text-gray-500 text-center text-sm font-bold cursor-not-allowed"
              >
                {t('closed')}
              </button>
            ) : (
              <button
                onClick={() => onJoinClick && onJoinClick(tournament)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black text-center text-sm font-black uppercase tracking-wider shadow-glow-orange/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {t('join_now')}
              </button>
            )}
          </div>

          {/* YouTube Live (Full Match) Option */}
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold transition-all duration-200 border ${
              tournament.status === 'LIVE'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white border-red-500 shadow-md shadow-red-500/30 hover:brightness-110 animate-pulse'
                : 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 shadow-sm hover:scale-[1.01]'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="truncate">
              {tournament.status === 'LIVE'
                ? (language === 'bn' ? '🔴 ইউটিউবে ফুল ম্যাচ সরাসরি দেখুন' : '🔴 Watch Live Full Match on YouTube')
                : (language === 'bn' ? '📺 ইউটিউবে লাইভ দেখুন (Full Match)' : 'Watch on YouTube Live (Full Match)')}
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-75 flex-shrink-0 ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}
