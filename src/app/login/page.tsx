'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Flame, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login({ emailOrUsername, password });
    if (!res.success) {
      setError(res.error || 'Login failed.');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  // Quick Demo fill buttons
  const fillDemo = (userRole: 'player' | 'admin') => {
    if (userRole === 'player') {
      setEmailOrUsername('player@freefire.com');
      setPassword('player123');
    } else {
      setEmailOrUsername('admin@freefire.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="p-8 rounded-3xl bg-white/75 dark:bg-charcoal-900 backdrop-blur-xl border border-white/80 dark:border-charcoal-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ff-orange to-ff-red flex items-center justify-center mx-auto shadow-glow-orange">
            <Flame className="w-7 h-7 text-white fill-current animate-pulse" />
          </div>
          <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white tracking-wide">
            {t('login_title')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
            Enter your credentials to manage your wallet and tournaments.
          </p>
        </div>

        {/* Demo Fast Fill Pill */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-gray-400 font-bold">Quick Demo Accounts:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemo('player')}
              className="px-2.5 py-1 rounded bg-orange-500/15 hover:bg-orange-500/25 text-orange-600 dark:text-ff-amber font-bold"
            >
              Player
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="px-2.5 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 font-bold"
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
              Email or Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="FireKnight99 or player@freefire.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                {t('password')}
              </label>
              <button
                type="button"
                onClick={() => alert('For password reset, please contact official WhatsApp/Telegram support with your verified FF UID and mobile number.')}
                className="text-[11px] text-orange-600 dark:text-ff-amber hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-ff-orange via-amber-500 to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black uppercase text-xs sm:text-sm tracking-wider shadow-glow-orange transition-all disabled:opacity-50"
          >
            {loading ? t('loading') : t('login_btn')}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200 dark:border-charcoal-800">
          <Link
            href="/register"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {t('dont_have_account')}
          </Link>
        </div>
      </div>
    </div>
  );
}
