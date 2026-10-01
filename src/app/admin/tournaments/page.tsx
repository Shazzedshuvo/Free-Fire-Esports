'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  PlusCircle,
  Key,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Room Credentials Modal
  const [roomModalTourney, setRoomModalTourney] = useState<any | null>(null);
  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [matchLiveUrl, setMatchLiveUrl] = useState('');
  const [matchStatus, setMatchStatus] = useState('REGISTRATION_OPEN');
  const [isPublished, setIsPublished] = useState(false);
  const [savingRoom, setSavingRoom] = useState(false);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      if (data.tournaments) setTournaments(data.tournaments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const openRoomModal = (t: any) => {
    setRoomModalTourney(t);
    setRoomId(t.roomId || '');
    setRoomPassword(t.roomPassword || '');
    setMatchLiveUrl(t.liveStreamUrl || '');
    setMatchStatus(t.status || 'REGISTRATION_OPEN');
    setIsPublished(Boolean(t.isRoomCredentialsPublished));
  };

  const handleSaveRoomCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomModalTourney) return;

    try {
      setSavingRoom(true);
      const res = await fetch(`/api/tournaments/${roomModalTourney.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          roomPassword,
          liveStreamUrl: matchLiveUrl || null,
          status: matchStatus,
          isRoomCredentialsPublished: isPublished,
        }),
      });

      if (res.ok) {
        alert(isPublished ? 'Room ID, Password & Live Stream published to registered players!' : 'Room credentials saved as draft.');
        setRoomModalTourney(null);
        fetchTournaments();
      } else {
        alert('Failed to update credentials.');
      }
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setSavingRoom(false);
    }
  };

  const handleStatusChange = async (tournamentId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchTournaments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete tournament "${title}"?`)) return;
    try {
      const res = await fetch(`/api/tournaments/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTournaments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-3">
            <Gamepad2 className="w-7 h-7 text-ff-orange" />
            <span>TOURNAMENT & ROOM MANAGEMENT (টুর্নামেন্ট ও রুম পরিচালনা)</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-gray-300 font-semibold mt-1">
            কাস্টম রুম তৈরি, রুম আইডি ও পাসওয়ার্ড প্রকাশ, লাইভ স্ট্রিম ও স্ট্যাটাস নিয়ন্ত্রণ।
          </p>
        </div>

        <Link
          href="/admin/tournaments/create"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-md hover:scale-105 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ নতুন টুর্নামেন্ট তৈরি করুন</span>
        </Link>
      </div>

      {/* Tournaments Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-gray-400 text-sm font-semibold">
            কোনো টুর্নামেন্ট পাওয়া যায়নি। উপরে "+ নতুন টুর্নামেন্ট তৈরি করুন" বাটনে ক্লিক করুন।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-slate-100 dark:bg-charcoal-950 text-slate-700 dark:text-gray-300 uppercase text-xs font-black">
                <tr>
                  <th className="py-3.5 px-3">Tournament (টুর্নামেন্ট)</th>
                  <th className="py-3.5 px-3">Mode & Map (মোড)</th>
                  <th className="py-3.5 px-3">Slots (স্লট)</th>
                  <th className="py-3.5 px-3">Fee / Prize (ফি / প্রাইজ)</th>
                  <th className="py-3.5 px-3">Room ID / Pass (রুম তথ্য)</th>
                  <th className="py-3.5 px-3">Status (স্ট্যাটাস)</th>
                  <th className="py-3.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-charcoal-800">
                {tournaments.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="py-3.5 px-3 max-w-[220px]">
                      <Link href={`/matches/${t.id}`} className="font-black text-sm sm:text-base text-slate-900 dark:text-white hover:text-ff-orange line-clamp-1">
                        {t.title}
                      </Link>
                      <span className="text-xs text-slate-500 dark:text-gray-400 font-mono block mt-0.5">
                        🗓️ {t.matchDate} at {t.matchTime}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-orange-500/10 text-orange-600 dark:text-ff-amber border border-orange-500/30">
                        {t.gameMode}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-gray-300 block mt-1">{t.mapName}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-black text-slate-900 dark:text-white text-sm">{t.totalSlots - t.remainingSlots}</span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-gray-400"> / {t.totalSlots}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-slate-700 dark:text-gray-300 block text-xs font-semibold">ফি: <strong className="text-slate-900 dark:text-white">৳{t.entryFee}</strong></span>
                      <span className="text-amber-600 dark:text-amber-400 font-black text-sm">প্রাইজ: ৳{t.prizePool}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      {t.roomId ? (
                        <div className="space-y-1">
                          <div className="font-mono text-slate-900 dark:text-white text-xs font-black">
                            ID: {t.roomId}
                          </div>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block ${
                              t.isRoomCredentialsPublished
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {t.isRoomCredentialsPublished ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not set</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs font-black focus:outline-none"
                      >
                        <option value="REGISTRATION_OPEN">REGISTRATION OPEN</option>
                        <option value="FULL">FULL</option>
                        <option value="LIVE">🔴 LIVE NOW</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openRoomModal(t)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-orange-500 hover:text-black dark:bg-charcoal-800 dark:hover:bg-ff-orange dark:hover:text-black text-slate-700 dark:text-gray-200 transition-colors shadow-sm"
                          title="রুম আইডি ও পাসওয়ার্ড দিন"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/results`}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-black dark:bg-charcoal-800 dark:hover:bg-amber-500 dark:hover:text-black text-slate-700 dark:text-gray-200 transition-colors shadow-sm"
                          title="রেজাল্ট ও প্রাইজ দিন"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(t.id, t.title)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white dark:bg-charcoal-800 dark:hover:bg-red-600 dark:hover:text-white text-red-500 transition-colors shadow-sm"
                          title="Delete Tournament"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Room ID & Password Modal */}
      {roomModalTourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-charcoal-900 border border-slate-300 dark:border-charcoal-700 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-ff-amber" />
              <span>রুম ক্রেডেনশিয়াল: {roomModalTourney.title}</span>
            </h3>

            <form onSubmit={handleSaveRoomCredentials} className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Custom Room ID *
                </label>
                <input
                  type="text"
                  required
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="e.g. 782190"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-sm font-bold focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Room Password *
                </label>
                <input
                  type="text"
                  required
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="e.g. FF2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-sm font-bold focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 block mb-1">
                  Match-specific Live Stream URL (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={matchLiveUrl}
                  onChange={(e) => setMatchLiveUrl(e.target.value)}
                  placeholder="https://youtube.com/live/... (খালি রাখলে সেটিংসের লিঙ্ক হবে)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-xs sm:text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Tournament Status (টুর্নামেন্ট স্ট্যাটাস)
                </label>
                <select
                  value={matchStatus}
                  onChange={(e) => setMatchStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-black focus:border-ff-orange focus:outline-none"
                >
                  <option value="REGISTRATION_OPEN">REGISTRATION_OPEN (রেজিস্ট্রেশন চলছে)</option>
                  <option value="LIVE">🔴 LIVE (লাইভ সম্প্রচার চলছে - Live Now)</option>
                  <option value="FULL">FULL (রুম ফুল)</option>
                  <option value="COMPLETED">COMPLETED (ম্যাচ সম্পন্ন)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="publishCheckbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-ff-orange rounded bg-white dark:bg-charcoal-900 border-slate-300 dark:border-charcoal-700 focus:ring-ff-orange"
                />
                <label htmlFor="publishCheckbox" className="text-xs sm:text-sm font-black text-slate-800 dark:text-white cursor-pointer">
                  প্লেয়ারদের ড্যাশবোর্ডে রুম আইডি ও পাসওয়ার্ড প্রকাশ করুন (Publish Now)
                </label>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRoomModalTourney(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingRoom}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black uppercase text-xs sm:text-sm"
                >
                  {savingRoom ? 'সংরক্ষণ হচ্ছে...' : 'সেভ ও আপডেট'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
