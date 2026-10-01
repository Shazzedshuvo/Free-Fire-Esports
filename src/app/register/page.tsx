'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Flame, Lock, User, Mail, Phone, Gamepad2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    ffPlayerName: '',
    ffUid: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await register(formData);
    if (!res.success) {
      setError(res.error || 'Registration failed.');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="py-8 max-w-xl mx-auto">
      <div className="p-6 sm:p-8 rounded-3xl bg-white/75 dark:bg-charcoal-900 backdrop-blur-xl border border-white/80 dark:border-charcoal-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ff-orange to-ff-red flex items-center justify-center mx-auto shadow-glow-orange">
            <Flame className="w-7 h-7 text-white fill-current animate-pulse" />
          </div>
          <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white tracking-wide">
            {t('register_title')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
            Create your tournament account and link your Free Fire player profile.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                {t('full_name')} *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Shuvo Ahmed"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                {t('username')} (Unique) *
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="FireKnight99"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* FF Player Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                {t('ff_name')} *
              </label>
              <input
                type="text"
                name="ffPlayerName"
                required
                value={formData.ffPlayerName}
                onChange={handleChange}
                placeholder="★FIRE_KNIGHT★"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>

            {/* FF UID */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                {t('ff_uid')} *
              </label>
              <input
                type="text"
                name="ffUid"
                required
                value={formData.ffUid}
                onChange={handleChange}
                placeholder="782394110"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs font-mono focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mobile Number */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                {t('mobile')} (bKash Number) *
              </label>
              <input
                type="text"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                {t('email')} *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="player@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                {t('password')} *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                {t('confirm_password')} *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ff-orange via-amber-500 to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black uppercase text-xs sm:text-sm tracking-wider shadow-glow-orange transition-all disabled:opacity-50"
            >
              {loading ? t('loading') : t('register_btn')}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-200 dark:border-charcoal-800">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {t('already_have_account')}
          </Link>
        </div>
      </div>
    </div>
  );
}
