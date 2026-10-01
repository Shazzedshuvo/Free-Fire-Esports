'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, FileText, Clock, User } from 'lucide-react';

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl text-white tracking-wide flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          <span>SECURITY & ADMIN AUDIT TRAIL</span>
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Immutable logs documenting every admin wallet adjustment, deposit approval, result declaration, and moderation action.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">No audit logs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-charcoal-950 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Admin</th>
                  <th className="py-3 px-3">Action Type</th>
                  <th className="py-3 px-3">Details & Parameters</th>
                  <th className="py-3 px-3">Target Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-charcoal-800/40 transition-colors">
                    <td className="py-3 px-3 text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-white block">
                        {log.adminName || 'System'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-xs font-bold text-ff-amber bg-charcoal-950 px-2 py-0.5 rounded border border-charcoal-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-300">
                      {log.details}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-400">
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
