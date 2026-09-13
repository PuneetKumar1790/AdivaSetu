import React, { useState } from 'react';
import { useApplication } from '../../context/ApplicationContext';
import { formatDateTime } from '../../utils/formatters';
import { Shield, Search, History, Filter } from 'lucide-react';

export const AdminAuditTrail: React.FC = () => {
  const { applications } = useApplication();
  const [search, setSearch] = useState('');

  // Flatten all audit events from all applications
  const allEvents = applications
    .flatMap((app) =>
      app.auditTrail.map((ev) => ({
        ...ev,
        schemeCode: app.schemeCode,
        applicantName: app.applicantName,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filtered = allEvents.filter(
    (e) =>
      e.applicationId.toLowerCase().includes(search.toLowerCase()) ||
      e.actor.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            System Observability
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Central Digital Audit Trail & Security Ledger
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            अपरिवर्तनीय अंकेक्षण पंजी, एआई एवं शासकीय निर्णयों का डिजिटल विवरण
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          Total Logs: {allEvents.length} Recorded Events
        </div>
      </div>

      {/* Search toolbar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by application ID, actor, or action code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />
      </div>

      {/* Audit Log Entries */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
        {filtered.map((ev) => (
          <div key={ev.id} className="p-4 sm:p-5 flex items-start space-x-3.5 hover:bg-slate-50 transition-colors">
            <div
              className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                ev.statusType === 'success'
                  ? 'bg-emerald-100 text-emerald-800'
                  : ev.statusType === 'alert'
                  ? 'bg-rose-100 text-rose-800'
                  : ev.statusType === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Shield className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900">{ev.action}</span>
                  <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-300">
                    {ev.applicationId}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatDateTime(ev.timestamp)}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed">{ev.description}</p>

              <div className="text-[10px] text-slate-400">
                Actor: <strong className="text-slate-700">{ev.actor}</strong> ({ev.actorRole})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
