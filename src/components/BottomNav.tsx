'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Flame, Gamepad2, Wallet, Bell, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();

  // If on admin routes, don't show user bottom nav
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { href: '/', label: t('nav_home'), icon: Flame },
    { href: '/matches', label: t('nav_matches'), icon: Gamepad2 },
    { href: user ? '/wallet' : '/login', label: t('nav_wallet'), icon: Wallet },
    { href: '/notices', label: t('nav_notices'), icon: Bell },
    { href: user ? '/dashboard' : '/login', label: user ? 'Profile' : 'Login', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-charcoal-700/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-orange-600 dark:text-ff-amber font-bold scale-105'
                  : 'text-slate-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-orange-500/15 dark:bg-ff-orange/20 shadow-sm' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-600 dark:text-ff-amber stroke-[2.5]' : ''}`} />
              </div>
              <span className="text-[10px] font-bold tracking-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
