'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { TournamentData } from './TournamentCard';
import {
  X,
  AlertCircle,
  Wallet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Flame,
} from 'lucide-react';

interface JoinModalProps {
  tournament: TournamentData | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function JoinModal({ tournament, onClose, onSuccess }: JoinModalProps) {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Duo / Squad team fields
  const [teamName, setTeamName] = useState('');
  const [player1Name, setPlayer1Name] = useState(user?.ffPlayerName || '');
  const [player1Uid, setPlayer1Uid] = useState(user?.ffUid || '');

  const [player2Name, setPlayer2Name] = useState('');
  const [player2Uid, setPlayer2Uid] = useState('');

  const [player3Name, setPlayer3Name] = useState('');
  const [player3Uid, setPlayer3Uid] = useState('');

  const [player4Name, setPlayer4Name] = useState('');
  const [player4Uid, setPlayer4Uid] = useState('');

  const [player5Name, setPlayer5Name] = useState('');
  const [player5Uid, setPlayer5Uid] = useState('');

  if (!tournament) return null;

  const userBalance = user?.wallet?.balance || 0;
  const entryFee = tournament.entryFee;
  const balanceAfter = userBalance - entryFee;
  const hasEnoughBalance = userBalance >= entryFee;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (!hasEnoughBalance) {
      setError('Insufficient wallet balance. Please deposit money to proceed.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/tournaments/${tournament.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: tournament.gameMode !== 'SOLO' ? teamName : undefined,
          player1Name: player1Name || user.ffPlayerName,
          player1Uid: player1Uid || user.ffUid,
          player2Name: tournament.gameMode !== 'SOLO' ? player2Name : undefined,
          player2Uid: tournament.gameMode !== 'SOLO' ? player2Uid : undefined,
          player3Name: tournament.gameMode === 'SQUAD' ? player3Name : undefined,
          player3Uid: tournament.gameMode === 'SQUAD' ? player3Uid : undefined,
          player4Name: tournament.gameMode === 'SQUAD' ? player4Name : undefined,
          player4Uid: tournament.gameMode === 'SQUAD' ? player4Uid : undefined,
          player5Name: tournament.gameMode === 'SQUAD' ? player5Name : undefined,
          player5Uid: tournament.gameMode === 'SQUAD' ? player5Uid : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to join tournament.');
      } else {
        setSuccessMsg(data.message || 'You have successfully joined this tournament.');
        await refreshUser();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-charcoal-800 bg-slate-50/80 dark:bg-charcoal-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-ff-orange/15 text-ff-orange">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
              {t('confirm_join_title')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Tournament Overview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200 dark:border-charcoal-700/80 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs font-black text-ff-orange uppercase tracking-wider block">
                {tournament.gameMode} MATCH • {tournament.mapName}
              </span>
              <h4 className="text-slate-900 dark:text-white font-black font-display text-lg mt-0.5">
                {tournament.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">
                {tournament.matchDate} at {tournament.matchTime}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider font-bold block">
                {t('entry_fee')}
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-display">
                ৳{tournament.entryFee}
              </span>
            </div>
          </div>

          {/* Wallet Calculation Breakdown */}
          {user ? (
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 space-y-2.5">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-gray-400 font-medium">
                <span>{t('current_balance')}:</span>
                <span className="font-bold text-slate-900 dark:text-gray-200">৳{userBalance.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-red-500 font-medium">
                <span>Entry Fee Deduction:</span>
                <span className="font-bold">-৳{entryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-charcoal-800 pt-2 flex items-center justify-between text-sm font-bold">
                <span className="text-slate-800 dark:text-gray-300">Balance After Joining:</span>
                <span className={balanceAfter >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-display text-base font-black' : 'text-red-500'}>
                  ৳{balanceAfter.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm font-medium">
              Please sign in to register for this match.
            </div>
          )}

          {/* Insufficient Balance Warning */}
          {user && !hasEnoughBalance && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3.5 text-sm text-red-600 dark:text-red-300">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base">{t('join_balance_warning')}</p>
                <p className="mt-1 text-slate-600 dark:text-gray-400 font-medium">
                  You need ৳{(entryFee - userBalance).toFixed(2)} more to join this match.
                </p>
                <Link
                  href="/deposit"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors shadow-sm"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{t('deposit_money')}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-600 dark:text-red-400 text-sm flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-sm space-y-2.5">
              <div className="flex items-center gap-2.5 font-black text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Registration Successful!</span>
              </div>
              <p className="font-medium">{successMsg}</p>
              <div className="pt-2">
                <Link
                  href="/my-matches"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-sm hover:bg-emerald-400 transition-colors shadow-md"
                >
                  <span>Go to My Matches (Room ID)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Registration Form (if not already success) */}
          {!successMsg && user && hasEnoughBalance && (
            <form onSubmit={handleJoin} className="space-y-4">
              {tournament.gameMode !== 'SOLO' && (
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                    Team / Clan Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Apex Predators BD"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none shadow-sm"
                  />
                </div>
              )}

              {/* Player 1 (Leader / User) */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700/60">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1">
                    {t('player_1')} Name
                  </label>
                  <input
                    type="text"
                    required
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1">
                    {t('player_1')} UID
                  </label>
                  <input
                    type="text"
                    required
                    value={player1Uid}
                    onChange={(e) => setPlayer1Uid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Duo Additional Player */}
              {(tournament.gameMode === 'DUO' || tournament.gameMode === 'SQUAD') && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700/60">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1">
                      {t('player_2')} Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={player2Name}
                      onChange={(e) => setPlayer2Name(e.target.value)}
                      placeholder="Player 2 IGN"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1">
                      {t('player_2')} UID *
                    </label>
                    <input
                      type="text"
                      required
                      value={player2Uid}
                      onChange={(e) => setPlayer2Uid(e.target.value)}
                      placeholder="12345678"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Squad Players 3 & 4 */}
              {tournament.gameMode === 'SQUAD' && (
                <>
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700/60">
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1">
                        {t('player_3')} Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={player3Name}
                        onChange={(e) => setPlayer3Name(e.target.value)}
                        placeholder="Player 3 IGN"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1">
                        {t('player_3')} UID *
                      </label>
                      <input
                        type="text"
                        required
                        value={player3Uid}
                        onChange={(e) => setPlayer3Uid(e.target.value)}
                        placeholder="Player 3 UID"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700/60">
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1">
                        {t('player_4')} Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={player4Name}
                        onChange={(e) => setPlayer4Name(e.target.value)}
                        placeholder="Player 4 IGN"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1">
                        {t('player_4')} UID *
                      </label>
                      <input
                        type="text"
                        required
                        value={player4Uid}
                        onChange={(e) => setPlayer4Uid(e.target.value)}
                        placeholder="Player 4 UID"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-charcoal-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-700 dark:text-gray-300 font-bold text-sm transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase text-sm tracking-wider shadow-glow-orange/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? t('loading') : `${t('confirm')} (৳${entryFee})`}
                </button>
              </div>
            </form>
          )}

          {!user && (
            <div className="pt-2 flex items-center justify-center">
              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black text-center text-sm uppercase tracking-wider shadow-md"
              >
                Sign In to Join Match
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
