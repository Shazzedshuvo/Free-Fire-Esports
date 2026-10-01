'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import JoinModal from '@/components/JoinModal';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  ShieldAlert,
  CheckCircle2,
  Key,
  Copy,
  Check,
  ArrowLeft,
  Flame,
  Award,
  Tv,
  Play,
  ExternalLink,
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();

  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tournaments/${id}`);
      const data = await res.json();
      if (data.tournament) {
        setTournament(data.tournament);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTournament();
  }, [id]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-ff-orange border-t-transparent animate-spin"></div>
        <p className="text-gray-400 text-sm">Loading tournament arena...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-white">Tournament not found</h2>
        <Link href="/matches" className="text-ff-amber hover:underline text-sm mt-3 inline-block">
          Return to All Tournaments
        </Link>
      </div>
    );
  }

  const filledSlots = tournament.totalSlots - tournament.remainingSlots;
  const isFull = tournament.remainingSlots <= 0 || tournament.status === 'FULL';
  const isJoined = tournament.isUserJoined;
  const canSeeCredentials = tournament.canSeeRoomCredentials;

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/matches"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-gray-400 hover:text-ff-orange dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tournaments</span>
        </Link>
      </div>

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        <div className="relative h-72 sm:h-96 md:h-[420px] w-full">
          <img
            src={
              tournament.bannerImage && tournament.bannerImage.startsWith('/images/')
                ? tournament.bannerImage
                : tournament.gameMode === 'SOLO'
                ? '/images/image.png'
                : tournament.gameMode === 'SQUAD'
                ? '/images/image2.png'
                : tournament.gameMode === 'DUO'
                ? '/images/image3.png'
                : '/images/image4.png'
            }
            alt={tournament.title}
            className="w-full h-full object-cover brightness-95 contrast-[1.05] saturate-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider bg-ff-orange text-black shadow-glow-orange/30">
              {tournament.gameMode}
            </span>
            <span className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-black/75 text-white border border-white/20 flex items-center gap-1.5 backdrop-blur-md shadow-md">
              <MapPin className="w-4 h-4 text-ff-orange" />
              {tournament.mapName}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <span className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-black/75 border border-white/20 text-ff-amber backdrop-blur-md shadow-md">
              {tournament.status.replace('_', ' ')}
            </span>
          </div>

          {/* Banner Bottom Details */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide drop-shadow-md">
                {tournament.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5 mt-3 text-sm sm:text-base text-gray-200 font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-ff-orange" />
                  <span>{tournament.matchDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>{tournament.matchTime}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button on Hero */}
            <div>
              {isJoined ? (
                <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-black font-black text-sm shadow-xl">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>YOU ARE REGISTERED</span>
                </div>
              ) : isFull ? (
                <button
                  disabled
                  className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-gray-400 font-bold text-sm uppercase cursor-not-allowed"
                >
                  ROOM FULL
                </button>
              ) : tournament.status !== 'REGISTRATION_OPEN' ? (
                <button
                  disabled
                  className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-gray-400 font-bold text-sm uppercase cursor-not-allowed"
                >
                  REGISTRATION CLOSED
                </button>
              ) : (
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase text-sm sm:text-base tracking-wider shadow-glow-orange hover:scale-105 active:scale-95 transition-all"
                >
                  JOIN NOW (৳{tournament.entryFee})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔴 YouTube Live Full Match Broadcast Section */}
      <div className={`p-6 sm:p-7 rounded-2xl border transition-all shadow-md ${
        tournament.status === 'LIVE'
          ? 'bg-gradient-to-r from-red-600/10 via-red-500/5 to-transparent border-red-500/50 shadow-red-500/10'
          : 'bg-white dark:bg-charcoal-900 border-slate-200 dark:border-charcoal-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl ${
              tournament.status === 'LIVE' ? 'bg-red-600 text-white animate-pulse shadow-lg' : 'bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-500/20'
            }`}>
              <Tv className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                  Watch on YouTube Live (Full Match)
                </h2>
                {tournament.status === 'LIVE' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white animate-pulse">
                    🔴 LIVE NOW
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1 font-medium">
                {tournament.status === 'LIVE'
                  ? 'ম্যাচটি বর্তমানে ইউটিউবে সরাসরি সম্প্রচার চলছে! ফুল ম্যাচ দেখতে পাশের বাটনে ক্লিক করুন।'
                  : 'এই টুর্নামেন্টের ফুল ম্যাচ ইউটিউবে লাইভ এবং রেকর্ডিং সম্প্রচার করা হবে। সরাসরি দেখতে যুক্ত হোন।'}
              </p>
            </div>
          </div>

          <div>
            <a
              href={tournament.liveStreamUrl || settings.youtube_live_url || 'https://www.youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md ${
                tournament.status === 'LIVE'
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30 hover:scale-105 animate-pulse'
                  : 'bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/40 hover:scale-105'
              }`}
            >
              <svg className="w-5 h-5 fill-current text-red-600 dark:text-red-400" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>{tournament.status === 'LIVE' ? '🔴 Watch Live Full Match' : 'Watch on YouTube Live (Full Match)'}</span>
              <ExternalLink className="w-4 h-4 opacity-75" />
            </a>
          </div>
        </div>
      </div>

      {/* Credentials Reveal Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
        <div className="flex items-center gap-2.5 mb-4 border-b border-slate-200 dark:border-charcoal-800 pb-3">
          <div className="p-2 rounded-xl bg-ff-orange/15 text-ff-orange">
            <Key className="w-5 h-5" />
          </div>
          <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">
            {t('room_credentials')}
          </h2>
        </div>

        {canSeeCredentials && tournament.roomId ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-bold">
              ✅ {t('room_published_notice')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs text-slate-500 dark:text-gray-400 block uppercase font-bold">
                    {t('room_id')}
                  </span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {tournament.roomId}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(tournament.roomId, 'roomId')}
                  className="px-3.5 py-2 rounded-lg bg-slate-200 dark:bg-charcoal-800 hover:bg-slate-300 dark:hover:bg-charcoal-700 text-xs font-bold text-slate-800 dark:text-gray-200 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'roomId' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'roomId' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs text-slate-500 dark:text-gray-400 block uppercase font-bold">
                    {t('room_password')}
                  </span>
                  <span className="text-2xl font-black font-mono text-ff-orange dark:text-ff-amber">
                    {tournament.roomPassword || 'None'}
                  </span>
                </div>
                {tournament.roomPassword && (
                  <button
                    onClick={() => handleCopy(tournament.roomPassword, 'roomPass')}
                    className="px-3.5 py-2 rounded-lg bg-slate-200 dark:bg-charcoal-800 hover:bg-slate-300 dark:hover:bg-charcoal-700 text-xs font-bold text-slate-800 dark:text-gray-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedKey === 'roomPass' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'roomPass' ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : isJoined ? (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm leading-relaxed flex items-center gap-3">
            <Clock className="w-6 h-6 flex-shrink-0 text-amber-500" />
            <div>
              <p className="font-bold text-base">Room Credentials Protected</p>
              <p className="text-slate-600 dark:text-gray-300 mt-1 font-medium">{t('room_locked_notice')}</p>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 text-slate-600 dark:text-gray-400 text-sm leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-slate-400 dark:text-gray-500 flex-shrink-0" />
              <span className="font-medium">Room ID & password are protected. Join this tournament to unlock room credentials.</span>
            </div>
            {!isFull && tournament.status === 'REGISTRATION_OPEN' && (
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black text-sm uppercase tracking-wider shadow-sm flex-shrink-0"
              >
                Join Now
              </button>
            )}
          </div>
        )}
      </div>

      {/* Prize Breakdown & Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prize Pool Breakdown */}
        <div className="md:col-span-2 p-6 sm:p-7 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-charcoal-800 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">
                {t('prize_distribution')}
              </h2>
            </div>
            <span className="font-display font-black text-xl text-amber-600 dark:text-amber-400">
              Total: ৳{tournament.prizePool.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-charcoal-950 border border-amber-500/30 text-center">
              <Award className="w-7 h-7 text-amber-500 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-slate-600 dark:text-gray-300 uppercase block">1st Place</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-display">৳{tournament.winnerPrize}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-gradient-to-br dark:from-gray-400/20 dark:to-charcoal-950 border border-slate-200 dark:border-gray-400/40 text-center">
              <Award className="w-7 h-7 text-slate-500 dark:text-gray-300 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-slate-600 dark:text-gray-300 uppercase block">2nd Place</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-display">৳{tournament.runnerUpPrize || 0}</span>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/10 dark:bg-gradient-to-br dark:from-orange-700/20 dark:to-charcoal-950 border border-orange-500/30 text-center">
              <Award className="w-7 h-7 text-orange-500 dark:text-orange-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-slate-600 dark:text-gray-300 uppercase block">3rd Place</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-display">৳{tournament.thirdPlacePrize || 0}</span>
            </div>
          </div>

          {tournament.perKillPrize > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 text-sm flex items-center justify-between text-slate-700 dark:text-gray-300 font-medium">
              <span className="font-bold text-ff-orange">Per Kill Bounty:</span>
              <span className="font-bold text-slate-900 dark:text-white font-display text-base">৳{tournament.perKillPrize} per elimination</span>
            </div>
          )}
        </div>

        {/* Slots Information */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-charcoal-800 pb-3 mb-4">
              <Users className="w-6 h-6 text-ff-orange" />
              <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">
                Slot Information
              </h2>
            </div>

            <div className="space-y-3.5 text-sm font-semibold">
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Total Slots:</span>
                <span className="font-black text-slate-900 dark:text-white">{tournament.totalSlots}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Filled Slots:</span>
                <span className="font-black text-ff-orange dark:text-ff-amber">{filledSlots}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Available Slots:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{tournament.remainingSlots}</span>
              </div>
            </div>

            <div className="mt-5">
              <div className="w-full bg-slate-200 dark:bg-charcoal-950 h-3 rounded-full overflow-hidden border border-slate-300 dark:border-charcoal-800">
                <div
                  className="h-full bg-gradient-to-r from-ff-orange to-ff-amber rounded-full"
                  style={{ width: `${Math.round((filledSlots / tournament.totalSlots) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            {!isJoined && !isFull && tournament.status === 'REGISTRATION_OPEN' && (
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase text-sm tracking-wider shadow-glow-orange transition-all hover:scale-[1.02]"
              >
                Join Now (৳{tournament.entryFee})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rules Section */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
        <h2 className="font-display font-black text-xl text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-ff-orange" />
          <span>{t('tournament_rules')}</span>
        </h2>
        <div className="text-sm text-slate-700 dark:text-gray-300 whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-charcoal-950 p-5 rounded-xl border border-slate-200 dark:border-charcoal-800 font-medium">
          {tournament.rules}
        </div>
      </div>

      {/* Participants List */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-charcoal-800 pb-3 mb-5">
          <h2 className="font-display font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-ff-orange dark:text-ff-amber" />
            <span>Registered Players & Teams ({tournament.participants?.length || 0})</span>
          </h2>
        </div>

        {tournament.participants?.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-gray-500 py-8 text-center font-medium">
            No players have joined this tournament yet. Be the first to register!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {tournament.participants.map((p: any) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800/80 flex items-center gap-3.5 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/15 dark:bg-charcoal-800 flex items-center justify-center font-display font-black text-sm text-ff-orange">
                  #{p.slotNumber}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {p.teamName || p.player1Name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                    UID: {p.player1Uid}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results if Completed */}
      {tournament.results?.length > 0 && (
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
          <h2 className="font-display font-black text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Tournament Results & Standings</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 dark:bg-charcoal-950 text-slate-600 dark:text-gray-400 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Player / Team</th>
                  <th className="py-3 px-4">Kills</th>
                  <th className="py-3 px-4">Total Points</th>
                  <th className="py-3 px-4 text-right">Prize Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-charcoal-800">
                {tournament.results.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-charcoal-800/50">
                    <td className="py-3 px-4 font-black text-amber-600 dark:text-amber-400">#{r.rank}</td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-bold">{r.playerNameOrTeam}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-gray-300 font-medium">{r.kills}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-gray-300 font-medium">{r.totalPoints}</td>
                    <td className="py-3 px-4 text-right font-black text-emerald-600 dark:text-emerald-400">
                      {r.prizeEarned > 0 ? `৳${r.prizeEarned}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {isJoinModalOpen && (
        <JoinModal
          tournament={tournament}
          onClose={() => setIsJoinModalOpen(false)}
          onSuccess={() => {
            setIsJoinModalOpen(false);
            fetchTournament();
          }}
        />
      )}
    </div>
  );
}
