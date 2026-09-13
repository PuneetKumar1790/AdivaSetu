import React, { useState, useEffect, useCallback } from 'react';
import { auditService } from '../../services/api/auditService';
import { formatDateTime } from '../../utils/formatters';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { ErrorRetryBanner } from '../../components/common/ErrorRetryBanner';
import { SyncIndicator } from '../../components/gov/SyncIndicator';
import { Shield, Search, ChevronLeft, ChevronRight, Filter, Bot, User, Server } from 'lucide-react';
import { AuditEvent } from '../../types';

export const AdminAuditTrail: React.FC = () => {
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [actorRole, setActorRole] = useState('all');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await auditService.getAuditLogs({
        page,
        pageSize,
        search: debouncedSearch,
        actorRole,
      });
      setLogs(resp.data);
      setTotalRecords(resp.total);
      setTotalPages(resp.totalPages);
    } catch (err: any) {
      setError(err?.message || 'Failed to load audit trail events.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, actorRole]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalRecords);

  const getActorIcon = (role?: string) => {
    if (role === 'ai') return <Bot className="w-4 h-4" />;
    if (role === 'officer') return <Shield className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

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

        <div className="flex items-center space-x-3">
          <SyncIndicator showLiveStream={false} onManualSync={loadLogs} />
          <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Total Logs: {totalRecords} Recorded Events
          </div>
        </div>
      </div>

      {error && <ErrorRetryBanner error={error} onRetry={loadLogs} />}

      {/* Search & Role Filter toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by application ID, actor, or action code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <select
          value={actorRole}
          onChange={(e) => {
            setActorRole(e.target.value);
            setPage(1);
          }}
          className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-xs sm:w-48"
        >
          <option value="all">All Actors</option>
          <option value="ai">AI Scrutiny Engine</option>
          <option value="officer">Ministry Officer</option>
          <option value="applicant">Applicant</option>
        </select>
      </div>

      {/* Audit Log Entries */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
        {loading ? (
          <div className="p-6">
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Querying central cryptographic audit ledger...</span>
            </div>
            <TableSkeleton rows={pageSize} columns={4} />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No audit records match your search criteria.
          </div>
        ) : (
          logs.map((ev) => (
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
                {getActorIcon(ev.actorRole)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-900">{ev.action}</span>
                    {ev.applicationId && (
                      <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-300">
                        {ev.applicationId}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatDateTime(ev.timestamp)}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed">{ev.description}</p>

                <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                  <span>Actor: <strong className="text-slate-700">{ev.actor}</strong></span>
                  <span>•</span>
                  <span className="uppercase font-semibold text-slate-500">Role: {ev.actorRole}</span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-600">
            Showing <strong className="text-slate-900 font-bold">{totalRecords > 0 ? startRecord : 0}</strong>–<strong className="text-slate-900 font-bold">{endRecord}</strong> of <strong className="text-slate-900 font-bold">{totalRecords}</strong> events
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 bg-white border border-slate-300 rounded-lg font-bold text-slate-700">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
