'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard,
  Gamepad2,
  PlusCircle,
  Users,
  CreditCard,
  Trophy,
  Bell,
  Settings,
  ShieldAlert,
  LogOut,
  Flame,
  ArrowLeft,
  FileText,
  Sun,
  Moon,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'SUPER_ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-ff-orange border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-700 dark:text-gray-300 text-base font-bold">ভেরিফাই করা হচ্ছে (Checking Super Admin Access)...</p>
      </div>
    );
  }

  const menuItems = [
    { href: '/admin', label: 'Overview (ড্যাশবোর্ড)', icon: LayoutDashboard },
    { href: '/admin/deposits', label: 'bKash Deposits (ডিপোজিট)', icon: CreditCard },
    { href: '/admin/tournaments', label: 'Tournaments & Rooms (রুম)', icon: Gamepad2 },
    { href: '/admin/financials', label: 'Profit & Loss (লাভ-লস)', icon: Trophy },
    { href: '/admin/chat', label: 'Live Chat Helpdesk (চ্যাট)', icon: FileText },
    { href: '/admin/settings', label: 'Site & Live Stream (সেটিংস)', icon: Settings },
    { href: '/admin/users', label: 'User Control (ইউজার)', icon: Users },
    { href: '/admin/results', label: 'Results & Prizes (পুরস্কার)', icon: Trophy },
    { href: '/admin/notices', label: 'Notice Board (নোটিশ)', icon: Bell },
    { href: '/admin/audit-logs', label: 'Audit Logs (লগ)', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 py-4">
      {/* Mobile Top Bar with Hamburger for Admin */}
      <div className="md:hidden flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ff-orange to-ff-red flex items-center justify-center shadow-glow-orange">
            <ShieldAlert className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="font-display font-black text-sm text-white uppercase tracking-wider">SUPER ADMIN PANEL</h2>
            <span className="text-[11px] text-ff-amber font-bold">Dedicated Control Center</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:text-white"
            title="Toggle Day/Night"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="px-3 py-2 rounded-xl bg-slate-800 text-gray-200 hover:text-white text-xs font-black"
          >
            {mobileMenuOpen ? '✕ বন্ধ' : '☰ মেনু'}
          </button>
        </div>
      </div>

      {/* Admin Sidebar */}
      <aside className={`w-full md:w-72 flex-shrink-0 bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 shadow-2xl flex flex-col justify-between ${
        mobileMenuOpen ? 'block' : 'hidden md:flex'
      }`}>
        <div className="space-y-6">
          {/* Admin Header with Theme Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-ff-orange to-ff-red flex items-center justify-center shadow-glow-orange">
                <ShieldAlert className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="font-display font-black text-base text-white uppercase tracking-wider">
                  ADMIN CONSOLE
                </h2>
                <span className="text-xs font-black text-amber-400 tracking-wide">
                  SUPER_ADMIN
                </span>
              </div>
            </div>

            {/* Day / Night Toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all shadow-sm"
              title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-sky-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </div>

          {/* Navigation Links - Larger Font & High Contrast */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-black shadow-glow-orange/30 scale-[1.02]'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 mt-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
