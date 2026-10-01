'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Flame,
  Wallet,
  Trophy,
  Shield,
  HelpCircle,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  PlusCircle,
  Globe,
  LayoutDashboard,
  Gamepad2,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const navLinks = [
    { href: '/', label: t('nav_home'), icon: Flame },
    { href: '/matches', label: t('nav_matches'), icon: Gamepad2 },
    { href: '/leaderboard', label: t('nav_leaderboard'), icon: Trophy },
    { href: '/how-to-deposit', label: t('nav_how_to_deposit'), icon: Wallet },
    { href: '/notices', label: t('nav_notices'), icon: Bell },
    { href: '/support', label: t('nav_support'), icon: HelpCircle },
  ];

  const isAdmin = user && ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'TOURNAMENT_MANAGER', 'MODERATOR'].includes(user.role);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-slate-200 dark:border-charcoal-800 shadow-sm transition-colors duration-200">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-1 gap-2">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ff-orange via-ff-amber to-ff-red flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-6 h-6 text-white fill-current animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-wider text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-orange-400 dark:via-amber-300 dark:to-yellow-400 leading-none">
                FREE FIRE
              </span>
              <span className="text-[10px] tracking-widest font-extrabold uppercase text-orange-600 dark:text-gray-400 mt-0.5">
                ESPORTS BD
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links - Single Line & No Wrap */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-nowrap">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-700 hover:text-orange-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-charcoal-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* Day / Night Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-charcoal-800 dark:border-charcoal-700 text-xs font-bold text-slate-800 dark:text-gray-200 transition-all shadow-sm whitespace-nowrap shrink-0"
              title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="font-bold">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-400 fill-sky-400 shrink-0" />
                  <span className="font-bold">Night</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-charcoal-800 dark:border-charcoal-700 text-xs font-bold hover:border-ff-orange/40 text-slate-800 dark:text-gray-200 transition-all shadow-sm whitespace-nowrap shrink-0"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-orange-600 dark:text-ff-amber shrink-0" />
              <span className="whitespace-nowrap">{language === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Wallet pill if logged in */}
            {user && (
              <Link
                href="/wallet"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 hover:border-orange-500 dark:bg-charcoal-800/90 dark:border-ff-orange/40 text-slate-900 dark:text-white shadow-sm transition-all group whitespace-nowrap shrink-0"
              >
                <div className="w-6 h-6 rounded-full bg-orange-500/15 flex items-center justify-center text-orange-600 dark:text-ff-amber group-hover:scale-110 transition-transform shrink-0">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-right leading-none">
                  <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold mb-0.5">
                    {t('wallet_balance')}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 font-display">
                    ৳{user.wallet?.balance?.toFixed(0) || '0'}
                  </span>
                </div>
                <div className="hidden sm:flex text-emerald-600 dark:text-emerald-400">
                  <PlusCircle className="w-3.5 h-3.5" />
                </div>
              </Link>
            )}

            {/* User Profile / Auth Actions */}
            {user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 dark:border-charcoal-700 text-left transition-colors whitespace-nowrap"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-ff-orange to-ff-red flex items-center justify-center text-white font-bold text-xs ring-2 ring-orange-500/40 shrink-0">
                    {user.ffPlayerName?.[0] || user.username[0]?.toUpperCase()}
                  </div>
                  <div className="hidden md:flex flex-col leading-tight pr-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-gray-200 truncate max-w-[100px]">
                      {user.ffPlayerName || user.username}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                      UID: {user.ffUid}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 rounded-2xl shadow-2xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-charcoal-800">
                      <p className="text-xs font-semibold text-slate-400 dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.fullName}</p>
                      <p className="text-xs text-orange-600 dark:text-ff-amber">@{user.username}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-orange-500" />
                      <span>{t('nav_dashboard')}</span>
                    </Link>

                    <Link
                      href="/my-matches"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
                    >
                      <Gamepad2 className="w-4 h-4 text-amber-500" />
                      <span>{t('my_matches')}</span>
                    </Link>

                    <Link
                      href="/wallet"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
                    >
                      <Wallet className="w-4 h-4 text-emerald-500" />
                      <span>{t('nav_wallet')} / Deposit</span>
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-sky-500" />
                      <span>{t('profile_settings')}</span>
                    </Link>

                    {isAdmin && (
                      <div className="pt-1 mt-1 border-t border-slate-100 dark:border-charcoal-800">
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-orange-700 dark:text-amber-300 font-bold hover:bg-orange-50 dark:hover:bg-ff-orange/20 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-orange-600 dark:text-amber-400" />
                          <span>{t('nav_admin')}</span>
                        </Link>
                      </div>
                    )}

                    <div className="pt-1 mt-1 border-t border-slate-100 dark:border-charcoal-800">
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav_logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-black hover:bg-slate-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-charcoal-800 transition-colors"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/25 transition-all"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-charcoal-800 dark:border-charcoal-700 text-slate-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-charcoal-900 border-b border-slate-200 dark:border-charcoal-700 px-4 pt-2 pb-4 space-y-1 shadow-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-600 dark:bg-ff-orange/15 dark:text-ff-amber border-l-4 border-orange-500'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-charcoal-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600 dark:text-ff-amber' : 'text-slate-400 dark:text-gray-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {user && isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>{t('nav_admin')}</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
