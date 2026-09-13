import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { INDIAN_STATES } from '../../data/stateData';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { ErrorRetryBanner } from '../../components/common/ErrorRetryBanner';
import { SyncIndicator } from '../../components/gov/SyncIndicator';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
  Filter,
  Layers,
} from 'lucide-react';
import { Application } from '../../types';

export const AdminApplicationsList: React.FC = () => {
  const { fetchApplicationsPaged } = useApplication();

  const [applications, setApplications] = useState<Application[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'submittedAt' | 'aiScore'>('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchApplicationsPaged({
        page,
        pageSize,
        search: debouncedSearch,
        scheme: selectedScheme,
        status: selectedStatus,
        state: selectedState,
        sortBy,
        sortOrder,
      });
      setApplications(resp.data);
      setTotalRecords(resp.total);
      setTotalPages(resp.totalPages);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve application records from Ministry Gateway.');
    } finally {
      setLoading(false);
    }
  }, [fetchApplicationsPaged, page, pageSize, debouncedSearch, selectedScheme, selectedStatus, selectedState, sortBy, sortOrder]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalRecords);

  const toggleSort = (field: 'submittedAt' | 'aiScore') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            Registry Master
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Application Management (आवेदन प्रबंधन पंजी)
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            अखिल भारतीय अनुसूचित जनजाति छात्रवृत्ति एवं अध्येतावृत्ति आवेदन
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <SyncIndicator showLiveStream={false} onManualSync={loadData} />
          <div className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            Total Ingested: <strong className="text-emerald-800 font-mono">{totalRecords}</strong> Records
          </div>
        </div>
      </div>

      {/* Error state if simulated error or network error occurs */}
      {error && <ErrorRetryBanner error={error} onRetry={loadData} />}

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, name, community, state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
            />
          </div>

          {/* Scheme Filter */}
          <select
            value={selectedScheme}
            onChange={(e) => {
              setSelectedScheme(e.target.value);
              setPage(1);
            }}
            className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-xs"
          >
            <option value="all">All Schemes</option>
            <option value="NFST">NFST (National Fellowship)</option>
            <option value="NOS">NOS (National Overseas)</option>
            <option value="TCE-ST">TCE-ST (Top Class Education)</option>
            <option value="PMS-ST">PMS-ST (Post-Matric)</option>
          </select>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setPage(1);
            }}
            className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-xs"
          >
            <option value="all">All States & UTs</option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-xs"
          >
            <option value="all">All Workflow States</option>
            <option value="Submitted">Submitted (Ingested)</option>
            <option value="Deficient">Deficient</option>
            <option value="Resubmitted">Resubmitted</option>
            <option value="Scrutiny">Scrutiny</option>
            <option value="Screening">Screening</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected / Awarded</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Fetching application registry page {page} from Ministry Gateway...</span>
            </div>
            <TableSkeleton rows={pageSize} columns={9} />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No matching applications found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No applications match the current query filter. Try changing your filters or searching another keyword.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#072319] text-white uppercase text-[10px] tracking-wider border-b border-emerald-950 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Application ID</th>
                  <th className="py-3.5 px-4">Applicant Name</th>
                  <th className="py-3.5 px-4">Scheme</th>
                  <th className="py-3.5 px-4">State</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:bg-emerald-900/50 transition-colors"
                    onClick={() => toggleSort('submittedAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Submitted</span>
                      <ArrowUpDown className="w-3 h-3 text-emerald-300" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Eligibility</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:bg-emerald-900/50 transition-colors"
                    onClick={() => toggleSort('aiScore')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>AI Score</span>
                      <ArrowUpDown className="w-3 h-3 text-emerald-300" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                      {app.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={app.applicantPhoto || '/aarav.jpg'}
                          alt={app.applicantName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{app.applicantName}</div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {app.formData?.tribeCommunity || 'ST'} Community
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-800">
                      {app.schemeCode}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {app.state}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(app.submittedAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                        {app.eligibilityStatus || 'Eligible'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1">
                        <span className="font-mono font-black text-emerald-800">
                          {app.aiScore}%
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          ({app.aiConfidence}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/scrutiny/${app.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Scrutinize</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Server-Side Pagination Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3 text-slate-600">
            <span>
              Showing <strong className="text-slate-900 font-bold">{totalRecords > 0 ? startRecord : 0}</strong>–<strong className="text-slate-900 font-bold">{endRecord}</strong> of <strong className="text-slate-900 font-bold">{totalRecords}</strong> applications
            </span>

            <div className="flex items-center space-x-1.5 border-l border-slate-300 pl-3">
              <span className="text-slate-500">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-slate-300 rounded-md px-2 py-0.5 text-xs text-slate-800 font-medium"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              let pageNumber: number;
              if (totalPages <= 5) {
                pageNumber = idx + 1;
              } else if (page <= 3) {
                pageNumber = idx + 1;
              } else if (page >= totalPages - 2) {
                pageNumber = totalPages - 4 + idx;
              } else {
                pageNumber = page - 2 + idx;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  disabled={loading}
                  className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                    page === pageNumber
                      ? 'bg-[#0D3829] text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
