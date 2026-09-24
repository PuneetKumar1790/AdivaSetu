import { AuditEvent } from '../../types';
import { browserDb } from '../db/browserDb';
import { apiConfig, getApiUrl } from './apiConfig';
import { PaginatedResponse } from './applicationService';

export interface AuditQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  actorRole?: string;
  applicationId?: string;
}

export const auditService = {
  async getAuditLogs(params: AuditQueryParams = {}): Promise<PaginatedResponse<AuditEvent>> {
    const { page = 1, pageSize = 15, search = '', actorRole = 'all', applicationId } = params;

    try {
      const q = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
        actorRole,
      });
      if (applicationId) q.append('applicationId', applicationId);

      const res = await fetch(getApiUrl(`/api/audit-logs?${q.toString()}`));
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          return json;
        }
      }
    } catch {}

    await apiConfig.simulateLatency('analytics', 'Loading immutable audit security ledger...');

    let list = browserDb.getAuditEvents();

    if (applicationId) {
      list = list.filter((e) => e.applicationId?.toLowerCase() === applicationId.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.applicationId?.toLowerCase().includes(q) ||
          e.action?.toLowerCase().includes(q) ||
          e.actor?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
    }

    if (actorRole && actorRole !== 'all') {
      list = list.filter((e) => e.actorRole === actorRole);
    }

    const total = list.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const startIdx = (currentPage - 1) * pageSize;
    const data = list.slice(startIdx, startIdx + pageSize);

    return {
      data,
      total,
      page: currentPage,
      pageSize,
      totalPages,
    };
  },

  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
    return browserDb.addAuditEvent(event);
  },
};
