'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
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
        <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-semibold">ভেরিফাই করা হচ্ছে (Checking Super Admin Access)...</p>
      </div>
    );
  }

  const menuItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/deposits', label: 'bKash Deposits', icon: CreditCard },
    { href: '/admin/tournaments', label: 'Tournaments & Rooms', icon: Gamepad2 },
    { href: '/admin/financials', label: 'Profit & Loss', icon: Trophy },
    { href: '/admin/chat', label: 'Live Chat Helpdesk', icon: FileText },
    { href: '/admin/settings', label: 'Site & Live Stream', icon: Settings },
    { href: '/admin/users', label: 'User Control', icon: Users },
    { href: '/admin/results', label: 'Results & Prizes', icon: Trophy },
    { href: '/admin/notices', label: 'Notice Board', icon: Bell },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 py-4">
      {/* Mobile Top Bar with Hamburger for Admin */}
      <div className="md:hidden flex items-center justify-between p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-ff-orange to-ff-red flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="font-display font-black text-xs text-white uppercase tracking-wider">SUPER ADMIN PANEL</h2>
            <span className="text-[10px] text-ff-amber">Control Center</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-charcoal-800 text-gray-200 hover:text-white"
        >
          <span className="text-xs font-bold">{mobileMenuOpen ? '✕ বন্ধ করুন' : '☰ মেনু'}</span>
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`w-full md:w-64 flex-shrink-0 bg-charcoal-900 border border-charcoal-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between ${
        mobileMenuOpen ? 'block' : 'hidden md:flex'
      }`}>
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-charcoal-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ff-orange to-ff-red flex items-center justify-center shadow-glow-orange">
              <ShieldAlert className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="font-display font-black text-sm text-white uppercase tracking-wider">
                ADMIN CONSOLE
              </h2>
              <span className="text-[10px] font-bold text-ff-amber">
                SUPER_ADMIN ONLY
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-ff-orange text-black shadow-glow-orange/30'
                      : 'text-gray-300 hover:text-white hover:bg-charcoal-800'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 mt-6 border-t border-charcoal-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors text-left"
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
