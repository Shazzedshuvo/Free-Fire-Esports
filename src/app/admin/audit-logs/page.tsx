'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, FileText, Clock, User, ShieldCheck } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.recentAuditLogs) setLogs(data.recentAuditLogs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-3">
          <FileText className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          <span>SECURITY & ADMIN AUDIT TRAIL</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-gray-300 font-semibold mt-1">
          সিস্টেমের প্রতিটি এডমিন অ্যাকশন, ডিপোজিট অনুমোদন, রেজাল্ট প্রকাশ ও সেটিং পরিবর্তনের অপরিবর্তনীয় লগ।
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-slate-600 dark:text-gray-300 mt-3">অডিট লগ লোড হচ্ছে...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-gray-400 text-sm font-bold">
            কোনো অডিট লগ রেকর্ড পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 dark:bg-charcoal-950 text-slate-800 dark:text-gray-200 uppercase text-xs font-black">
                <tr>
                  <th className="py-3.5 px-4">Timestamp (সময়)</th>
                  <th className="py-3.5 px-4">Admin (অ্যাডমিন)</th>
                  <th className="py-3.5 px-4">Action Type (কাজের ধরন)</th>
                  <th className="py-3.5 px-4">Details & Parameters (বিবরণ)</th>
                  <th className="py-3.5 px-4">Target Reference (আইডি)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-charcoal-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-slate-600 dark:text-gray-300 font-mono text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block text-sm">
                        {log.adminName || 'Super Administrator'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-black text-amber-700 dark:text-ff-amber bg-amber-50 dark:bg-charcoal-950 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-charcoal-800 inline-block">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 dark:text-gray-200 font-medium">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 dark:text-gray-400">
                      {log.target || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
