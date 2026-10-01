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

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (!['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'TOURNAMENT_MANAGER', 'MODERATOR'].includes(user.role)) {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/tournaments', label: 'Tournaments', icon: Gamepad2 },
    { href: '/admin/tournaments/create', label: 'Create Tournament', icon: PlusCircle },
    { href: '/admin/deposits', label: 'bKash Deposits', icon: CreditCard },
    { href: '/admin/users', label: 'User Control', icon: Users },
    { href: '/admin/results', label: 'Results & Prizes', icon: Trophy },
    { href: '/admin/notices', label: 'Notice Board', icon: Bell },
    { href: '/admin/settings', label: 'System Settings', icon: Settings },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 py-4">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 bg-charcoal-900 border border-charcoal-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
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
                {user.role}
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
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
        <div className="pt-4 border-t border-charcoal-800 space-y-2">
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
