'use client';

import React from 'react';
import { UserPlus, Wallet, Gamepad2, Trophy, Key, Crosshair, Award, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HowToPlay() {
  const { t } = useLanguage();

  const steps = [
    {
      step: '01',
      title: 'Create Account',
      bnTitle: 'একাউন্ট খুলুন',
      desc: 'Register in 60s with your Free Fire in-game name & numeric UID.',
      bnDesc: 'আপনার ফ্রি ফায়ার গেম নেম এবং ইউআইডি দিয়ে ১ মিনিটে একাউন্ট খুলুন।',
      icon: UserPlus,
      color: 'from-orange-500 to-amber-500',
    },
    {
      step: '02',
      title: 'Deposit via bKash',
      bnTitle: 'বিকাশ ডিপোজিট',
      desc: 'Send money to official bKash number & submit TrxID for instant balance.',
      bnDesc: 'অফিসিয়াল বিকাশ নম্বরে টাকা পাঠিয়ে TrxID দিয়ে ওয়ালেটে ব্যালেন্স নিন।',
      icon: Wallet,
      color: 'from-amber-500 to-yellow-500',
    },
    {
      step: '03',
      title: 'Choose Match & Join',
      bnTitle: 'ম্যাচ বেছে নিন',
      desc: 'Select Solo, Duo, or Squad match and confirm entry fee deduction.',
      bnDesc: 'সোলো, ডুও বা স্কোয়াড ম্যাচ বেছে এন্ট্রি ফি দিয়ে স্লট নিশ্চিত করুন।',
      icon: Gamepad2,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      step: '04',
      title: 'Get Room ID & Win',
      bnTitle: 'রুম আইডি ও প্রাইজ',
      desc: 'Room ID & password are revealed 10m before start. Win & cash out!',
      bnDesc: 'টুর্নামেন্ট শুরু হওয়ার ১০ মিনিট আগে রুম আইডি ও পাসওয়ার্ড দেওয়া হবে। কাস্টম লবিতে খেলে প্রাইজ জিতুন!',
      icon: Trophy,
      color: 'from-ff-orange to-ff-red',
    },
  ];

  return (
    <section className="my-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs sm:text-sm font-black text-ff-orange tracking-widest uppercase bg-orange-500/10 dark:bg-charcoal-800 px-4 py-1.5 rounded-full border border-orange-500/20 dark:border-charcoal-700 inline-block shadow-sm">
          QUICK START GUIDE
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white mt-3">
          {t('how_to_play_title')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 mt-2 font-medium">
          Everything you need to jump into high-stakes Free Fire tournaments and win real cash in Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 hover:border-ff-orange dark:hover:border-ff-orange/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-md hover:shadow-xl"
            >
              <span className="absolute top-4 right-4 font-display font-black text-3xl text-slate-200 dark:text-charcoal-700 group-hover:text-ff-orange/30 transition-colors">
                {s.step}
              </span>

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${s.color} p-0.5 flex items-center justify-center mb-5 shadow-md`}
              >
                <div className="w-full h-full bg-slate-900 dark:bg-charcoal-950 rounded-[14px] flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-ff-orange transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-300 mt-2 leading-relaxed font-medium">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
