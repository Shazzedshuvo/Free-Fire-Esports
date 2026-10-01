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
          isRoomCredentialsPublished: isPublished,
        }),
      });

      if (res.ok) {
        alert(isPublished ? 'Room ID & Password published to registered players!' : 'Room credentials saved as draft.');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white tracking-wide flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-ff-orange" />
            <span>TOURNAMENT MANAGEMENT</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Create custom rooms, manage entry slots, publish room IDs, and enter final results.
          </p>
        </div>

        <Link
          href="/admin/tournaments/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase text-xs tracking-wider shadow-glow-orange transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Tournament</span>
        </Link>
      </div>

      {/* Tournaments Table */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">
            No tournaments found. Click "Create Tournament" to publish a match.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-charcoal-950 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Tournament</th>
                  <th className="py-3 px-3">Mode & Map</th>
                  <th className="py-3 px-3">Slots</th>
                  <th className="py-3 px-3">Fee / Prize</th>
                  <th className="py-3 px-3">Room ID / Pass</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800">
                {tournaments.map((t) => (
                  <tr key={t.id} className="hover:bg-charcoal-800/40 transition-colors">
                    <td className="py-3 px-3 max-w-[200px]">
                      <Link href={`/matches/${t.id}`} className="font-bold text-white hover:text-ff-amber line-clamp-1">
                        {t.title}
                      </Link>
                      <span className="text-[10px] text-gray-400 block">
                        {t.matchDate} at {t.matchTime}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-charcoal-950 text-ff-amber border border-charcoal-800">
                        {t.gameMode}
                      </span>
                      <span className="text-[11px] text-gray-300 block mt-0.5">{t.mapName}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-white">{t.totalSlots - t.remainingSlots}</span>
                      <span className="text-gray-500"> / {t.totalSlots}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-gray-300 block">Fee: <strong>৳{t.entryFee}</strong></span>
                      <span className="text-amber-400 font-bold">Prize: ৳{t.prizePool}</span>
                    </td>
                    <td className="py-3 px-3">
                      {t.roomId ? (
                        <div>
                          <div className="font-mono text-white text-[11px] font-bold">
                            ID: {t.roomId}
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              t.isRoomCredentialsPublished
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {t.isRoomCredentialsPublished ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Not set</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        className="px-2 py-1 rounded-lg bg-charcoal-950 border border-charcoal-700 text-white text-[11px] focus:outline-none"
                      >
                        <option value="REGISTRATION_OPEN">REGISTRATION OPEN</option>
                        <option value="FULL">FULL</option>
                        <option value="LIVE">LIVE NOW</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openRoomModal(t)}
                          className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-ff-orange hover:text-black text-gray-300 transition-colors"
                          title="Manage Room ID & Password"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/admin/results`}
                          className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-amber-500 hover:text-black text-gray-300 transition-colors"
                          title="Add Results & Distribute Prizes"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(t.id, t.title)}
                          className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors"
                          title="Delete Tournament"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
          <div className="bg-charcoal-900 border border-charcoal-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-ff-amber" />
              <span>Room Credentials: {roomModalTourney.title}</span>
            </h3>

            <form onSubmit={handleSaveRoomCredentials} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Custom Room ID *
                </label>
                <input
                  type="text"
                  required
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="e.g. 782190"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white font-mono text-sm focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Room Password *
                </label>
                <input
                  type="text"
                  required
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="e.g. FF2026"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white font-mono text-sm focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-charcoal-950 border border-charcoal-800 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="publishCheckbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-ff-orange rounded bg-charcoal-900 border-charcoal-700 focus:ring-ff-orange"
                />
                <label htmlFor="publishCheckbox" className="text-xs font-bold text-white cursor-pointer">
                  Publish to registered players now
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRoomModalTourney(null)}
                  className="flex-1 py-2 rounded-xl bg-charcoal-800 text-xs font-bold text-gray-300 hover:bg-charcoal-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRoom}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black uppercase text-xs"
                >
                  {savingRoom ? 'Saving...' : 'Save & Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
