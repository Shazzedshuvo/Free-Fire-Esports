'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Send,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SupportPage() {
  const { t } = useLanguage();
  const [ticketSubject, setTicketSubject] = useState('');
  const [category, setCategory] = useState('DEPOSIT');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-ff-amber tracking-widest uppercase bg-charcoal-800 px-3 py-1 rounded-full border border-charcoal-700">
          24/7 PLAYER ASSISTANCE
        </span>
        <h1 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white mt-3">
          {t('support_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-2 font-medium">
          {t('support_subtitle')}
        </p>
      </div>

      {/* Instant Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* WhatsApp Card */}
        <div className="p-6 rounded-2xl bg-white/75 dark:bg-charcoal-900 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              {t('whatsapp_support')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium leading-relaxed">
              Direct chat with tournament coordinators for urgent deposit verifications, room disputes, or UID corrections.
            </p>
          </div>
          <a
            href="https://wa.me/8801719052334"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors shadow-lg"
          >
            {t('chat_now')} (+880 1719-052334)
          </a>
        </div>

        {/* Telegram Card */}
        <div className="p-6 rounded-2xl bg-white/75 dark:bg-charcoal-900 backdrop-blur-xl border border-sky-500/30 hover:border-sky-500/60 transition-all shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              {t('telegram_support')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium leading-relaxed">
              Join 25,000+ players in our verified Telegram channel for room alerts, flash tournament releases, and daily code giveaways.
            </p>
          </div>
          <a
            href="https://t.me/ff_esports_bd"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors shadow-lg"
          >
            {t('join_telegram')} (@ff_esports_bd)
          </a>
        </div>
      </div>

      {/* Support Ticket Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/75 dark:bg-charcoal-900 backdrop-blur-xl border border-white/80 dark:border-charcoal-800 shadow-xl">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-charcoal-800 pb-3">
          <HelpCircle className="w-5 h-5 text-ff-orange" />
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            {t('ticket_support')}
          </h2>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-white font-bold text-base">Support Ticket Created!</h3>
            <p className="text-xs text-emerald-300 max-w-md mx-auto">
              Our support team has received your ticket. A resolution will be delivered to your account notifications within 30 minutes.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setTicketSubject('');
                setMessage('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-charcoal-800 text-xs font-bold text-gray-300"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Topic Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
                >
                  <option value="DEPOSIT">bKash Deposit Inquiry</option>
                  <option value="TOURNAMENT">Match / Custom Room Issue</option>
                  <option value="ACCOUNT">Free Fire UID Correction</option>
                  <option value="OTHER">Other Inquiry / Report</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Deposit pending over 10 minutes"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                Detailed Message / Explanation *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include your bKash TrxID, tournament ID, or screenshot details..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-ff-orange via-amber-500 to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black uppercase text-xs tracking-wider shadow-glow-orange transition-all"
            >
              CREATE SUPPORT TICKET
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
