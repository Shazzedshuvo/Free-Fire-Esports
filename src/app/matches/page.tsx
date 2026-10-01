'use client';

import React, { useState, useEffect } from 'react';
import TournamentCard, { TournamentData } from '@/components/TournamentCard';
import JoinModal from '@/components/JoinModal';
import { useLanguage } from '@/context/LanguageContext';
import { Gamepad2, Search, Filter } from 'lucide-react';

export default function MatchesPage() {
  const { t } = useLanguage();
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<TournamentData | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      let url = `/api/tournaments?mode=${modeFilter}&status=${statusFilter}`;
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
  }, [modeFilter, statusFilter]);

  const filteredTournaments = tournaments.filter((tourney) =>
    tourney.title.toLowerCase().includes(search.toLowerCase()) ||
    tourney.mapName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-8">
      {/* Title & Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white tracking-wide flex items-center gap-3">
            <div className="p-2 rounded-xl bg-ff-orange/15 text-ff-orange">
              <Gamepad2 className="w-7 h-7 text-ff-orange" />
            </div>
            <span>ALL TOURNAMENTS & MATCHES</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 mt-2 font-medium">
            Browse upcoming, live, and completed Free Fire battle royale custom tournaments.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tournament or map..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none placeholder-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-sm">
        {/* Mode filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-sm font-bold text-slate-600 dark:text-gray-400 mr-2 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-ff-orange" /> Mode:
          </span>
          {['ALL', 'SOLO', 'DUO', 'SQUAD'].map((m) => (
            <button
              key={m}
              onClick={() => setModeFilter(m)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                modeFilter === m
                  ? 'bg-ff-orange text-black font-black shadow-glow-orange/30'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-charcoal-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-sm font-bold text-slate-600 dark:text-gray-400 mr-2">Status:</span>
          {['ALL', 'REGISTRATION_OPEN', 'LIVE', 'COMPLETED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-amber-500 text-black font-black shadow-glow-amber/30'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-charcoal-800'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-slate-100 dark:bg-charcoal-900 animate-pulse border border-slate-200 dark:border-charcoal-800"></div>
          ))}
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
          <Gamepad2 className="w-14 h-14 text-slate-400 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-slate-900 dark:text-white font-bold text-xl">No tournaments found</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1.5">Try changing your search query or filter tags.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTournaments.map((t) => (
            <TournamentCard
              key={t.id}
              tournament={t}
              onJoinClick={(tourney) => setSelectedTournament(tourney)}
            />
          ))}
        </div>
      )}

      {/* Join Modal */}
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
