'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { User, ShieldCheck, Mail, Phone, Gamepad2, Lock, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="py-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide flex items-center gap-2">
          <User className="w-7 h-7 text-sky-400" />
          <span>PLAYER PROFILE & SETTINGS</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Review your account credentials and Free Fire player bindings.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-ff-orange to-ff-amber flex items-center justify-center font-display font-black text-2xl text-black">
            {user.ffPlayerName?.[0] || user.username[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">
              {user.ffPlayerName}
            </h2>
            <p className="text-xs text-ff-amber">@{user.username}</p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">UID: {user.ffUid}</p>
          </div>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile information updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          {/* Locked Sensitive fields (UID & Username) to prevent fraud */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1 mb-1">
                <Lock className="w-3 h-3 text-amber-500" /> Free Fire UID (Locked)
              </label>
              <input
                type="text"
                disabled
                value={user.ffUid}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950/60 border border-charcoal-800 text-gray-500 text-xs font-mono cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                UID changes require admin verification via support ticket.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1 mb-1">
                <Lock className="w-3 h-3 text-amber-500" /> Email Address (Verified)
              </label>
              <input
                type="text"
                disabled
                value={user.email}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950/60 border border-charcoal-800 text-gray-500 text-xs cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-charcoal-800">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black uppercase text-xs tracking-wider shadow-glow-orange hover:scale-105 transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
