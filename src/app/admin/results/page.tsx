'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Award, CheckCircle2, AlertCircle, Save, Sparkles } from 'lucide-react';

export default function AdminResultsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTourney, setSelectedTourney] = useState<any | null>(null);

  // Results rows
  const [resultsRows, setResultsRows] = useState<any[]>([
    { rank: 1, playerNameOrTeam: '', kills: 0, placementPoints: 20, totalPoints: 20, prizeEarned: 0, userId: '' },
    { rank: 2, playerNameOrTeam: '', kills: 0, placementPoints: 15, totalPoints: 15, prizeEarned: 0, userId: '' },
    { rank: 3, playerNameOrTeam: '', kills: 0, placementPoints: 10, totalPoints: 10, prizeEarned: 0, userId: '' },
  ]);

  useEffect(() => {
    fetch('/api/tournaments')
      .then((res) => res.json())
      .then((data) => {
        if (data.tournaments) {
          setTournaments(data.tournaments);
          if (data.tournaments.length > 0) {
            setSelectedTourneyId(data.tournaments[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedTourneyId) return;
    setLoading(true);
    fetch(`/api/tournaments/${selectedTourneyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tournament) {
          const t = data.tournament;
          setSelectedTourney(t);

          // If results already exist, prefill; otherwise create default top 3 with preset prizes
          if (t.results && t.results.length > 0) {
            setResultsRows(t.results);
          } else {
            setResultsRows([
              {
                rank: 1,
                playerNameOrTeam: t.participants?.[0]?.player1Name || '',
                kills: 0,
                placementPoints: 20,
                totalPoints: 20,
                prizeEarned: t.winnerPrize || 0,
                userId: t.participants?.[0]?.userId || '',
              },
              {
                rank: 2,
                playerNameOrTeam: t.participants?.[1]?.player1Name || '',
                kills: 0,
                placementPoints: 15,
                totalPoints: 15,
                prizeEarned: t.runnerUpPrize || 0,
                userId: t.participants?.[1]?.userId || '',
              },
              {
                rank: 3,
                playerNameOrTeam: t.participants?.[2]?.player1Name || '',
                kills: 0,
                placementPoints: 10,
                totalPoints: 10,
                prizeEarned: t.thirdPlacePrize || 0,
                userId: t.participants?.[2]?.userId || '',
              },
            ]);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedTourneyId]);

  const handleRowChange = (index: number, field: string, val: any) => {
    setResultsRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };

      // Auto update total points
      if (field === 'kills' || field === 'placementPoints') {
        const k = Number(field === 'kills' ? val : next[index].kills) || 0;
        const p = Number(field === 'placementPoints' ? val : next[index].placementPoints) || 0;
        next[index].totalPoints = p + k * 2;
      }
      return next;
    });
  };

  const handleParticipantSelect = (index: number, participantId: string) => {
    const p = selectedTourney?.participants?.find((part: any) => part.id === participantId);
    if (p) {
      setResultsRows((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          playerNameOrTeam: p.teamName || p.player1Name,
          userId: p.userId,
        };
        return next;
      });
    }
  };

  const handlePublishResults = async () => {
    if (!selectedTourneyId) return;

    if (!confirm('Are you sure you want to publish results? This will mark the tournament as COMPLETED and automatically credit the configured prize money to each winner\'s wallet.')) {
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/tournaments/${selectedTourneyId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          results: resultsRows,
          winnerTeam: resultsRows[0]?.playerNameOrTeam,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Tournament results and prizes published!');
      } else {
        alert(data.error || 'Failed to publish results.');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl text-white tracking-wide flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          <span>TOURNAMENT RESULTS & PRIZE PAYOUTS</span>
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Enter final match standings, eliminations, and automatically credit winner prize wallets.
        </p>
      </div>

      {/* Select Tournament */}
      <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-3">
        <label className="text-xs font-semibold text-gray-300 block">
          Select Tournament to Award Results:
        </label>
        <select
          value={selectedTourneyId}
          onChange={(e) => setSelectedTourneyId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs font-bold focus:border-ff-orange focus:outline-none"
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.gameMode} - {t.mapName}) [Status: {t.status}]
            </option>
          ))}
        </select>
      </div>

      {/* Results Form */}
      {selectedTourney && (
        <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-800 pb-3">
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                {selectedTourney.title}
              </h2>
              <span className="text-xs text-gray-400">
                Prize Pool: ৳{selectedTourney.prizePool} • Winner: ৳{selectedTourney.winnerPrize}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-charcoal-950 text-ff-amber border border-charcoal-800">
              {selectedTourney.status}
            </span>
          </div>

          {/* Results rows table */}
          <div className="space-y-4">
            {resultsRows.map((row, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-charcoal-950 border border-charcoal-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-base text-amber-400">
                    Rank #{row.rank} {idx === 0 ? '🏆 (Winner)' : idx === 1 ? '🥈 (Runner-up)' : '🥉 (3rd Place)'}
                  </span>

                  {/* Pick from registered participants */}
                  {selectedTourney.participants?.length > 0 && (
                    <select
                      onChange={(e) => handleParticipantSelect(idx, e.target.value)}
                      className="px-2 py-1 rounded bg-charcoal-900 border border-charcoal-700 text-[11px] text-gray-300 focus:outline-none"
                    >
                      <option value="">Select registered player...</option>
                      {selectedTourney.participants.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          Slot #{p.slotNumber}: {p.teamName || p.player1Name} (UID: {p.player1Uid})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Player / Team Name</label>
                    <input
                      type="text"
                      required
                      value={row.playerNameOrTeam}
                      onChange={(e) => handleRowChange(idx, 'playerNameOrTeam', e.target.value)}
                      placeholder="e.g. ★FIRE_KNIGHT★"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Eliminations (Kills)</label>
                    <input
                      type="number"
                      value={row.kills}
                      onChange={(e) => handleRowChange(idx, 'kills', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Total Points</label>
                    <input
                      type="number"
                      value={row.totalPoints}
                      onChange={(e) => handleRowChange(idx, 'totalPoints', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-sky-400 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-emerald-400 font-bold block mb-1">Prize Payout (৳)</label>
                    <input
                      type="number"
                      value={row.prizeEarned}
                      onChange={(e) => handleRowChange(idx, 'prizeEarned', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-emerald-400 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-charcoal-800">
            <button
              type="button"
              disabled={saving}
              onClick={handlePublishResults}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-ff-orange to-ff-red hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-glow-orange flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Trophy className="w-4 h-4" />
              <span>{saving ? 'Processing Payouts...' : 'Confirm Results & Auto-Credit Prizes to Wallets'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
