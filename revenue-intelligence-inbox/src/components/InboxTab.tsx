'use client';

import React, { useState, useMemo } from 'react';
import {
  UnifiedRecord,
  RouteCategory,
  SourceType,
} from '@/types/intelligence';
import { ROUTE_CATEGORIES, ROUTE_COLORS } from '@/lib/intelligenceData';
import {
  Search,
  SlidersHorizontal,
  Phone,
  Video,
  FileCheck2,
  FileX2,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Filter,
  Eye,
  ArrowUpDown,
} from 'lucide-react';

interface InboxTabProps {
  records: UnifiedRecord[];
  onOpenRecord: (record: UnifiedRecord) => void;
  initialFilters?: {
    person?: string;
    sourceType?: string;
    route?: RouteCategory;
  };
}

export const InboxTab: React.FC<InboxTabProps> = ({
  records,
  onOpenRecord,
  initialFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>(
    initialFilters?.sourceType || 'ALL'
  );
  const [personFilter, setPersonFilter] = useState<string>(
    initialFilters?.person || 'ALL'
  );
  const [routeFilter, setRouteFilter] = useState<string>(
    initialFilters?.route || 'ALL'
  );
  const [transcriptFilter, setTranscriptFilter] = useState<string>('ALL');
  const [reviewFilter, setReviewFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'ref' | 'time' | 'person' | 'type'>('ref');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Available person list
  const personList = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.person_name));
    return Array.from(set).sort();
  }, [records]);

  // Filtered and sorted records
  const filteredRecords = useMemo(() => {
    let result = records.filter((r) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = r.record_ref.toLowerCase().includes(q);
        const matchesTitle = r.title_or_outcome.toLowerCase().includes(q);
        const matchesPerson = r.person_name.toLowerCase().includes(q);
        const matchesId = r.source_id.toLowerCase().includes(q);
        const matchesSummary = r.analysis?.summary.toLowerCase().includes(q) || false;
        if (!matchesRef && !matchesTitle && !matchesPerson && !matchesId && !matchesSummary) {
          return false;
        }
      }

      // Source Type
      if (sourceTypeFilter !== 'ALL' && r.source_type !== sourceTypeFilter) {
        return false;
      }

      // Person
      if (personFilter !== 'ALL' && r.person_name !== personFilter) {
        return false;
      }

      // Route
      if (routeFilter !== 'ALL' && !r.effective_routes.includes(routeFilter as RouteCategory)) {
        return false;
      }

      // Transcript Availability
      if (transcriptFilter === 'YES' && !r.has_usable_text) return false;
      if (transcriptFilter === 'NO' && r.has_usable_text) return false;

      // Review state
      if (reviewFilter === 'REVIEWED' && r.effective_review_state !== 'reviewed') return false;
      if (reviewFilter === 'PENDING' && r.effective_review_state === 'reviewed') return false;
      if (reviewFilter === 'DISCREPANCY' && !r.discrepancy_flag) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      let comp = 0;
      if (sortBy === 'ref') {
        comp = a.record_ref.localeCompare(b.record_ref, undefined, { numeric: true });
      } else if (sortBy === 'person') {
        comp = a.person_name.localeCompare(b.person_name);
      } else if (sortBy === 'type') {
        comp = a.source_type.localeCompare(b.source_type);
      } else if (sortBy === 'time') {
        const timeA = (a.payload as any).started_at || (a.payload as any).starts_at;
        const timeB = (b.payload as any).started_at || (b.payload as any).starts_at;
        comp = timeA.localeCompare(timeB);
      }
      return sortOrder === 'asc' ? comp : -comp;
    });

    return result;
  }, [
    records,
    searchQuery,
    sourceTypeFilter,
    personFilter,
    routeFilter,
    transcriptFilter,
    reviewFilter,
    sortBy,
    sortOrder,
  ]);

  const toggleSort = (field: 'ref' | 'time' | 'person' | 'type') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSourceTypeFilter('ALL');
    setPersonFilter('ALL');
    setRouteFilter('ALL');
    setTranscriptFilter('ALL');
    setReviewFilter('ALL');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Search and Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ref (C01, M07), title, person, summary, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Quick Counter */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Showing:</span>
            <strong className="text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {filteredRecords.length} / {records.length}
            </strong>
          </div>
        </div>

        {/* Filter Selectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {/* Source Type */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Channel
            </label>
            <select
              value={sourceTypeFilter}
              onChange={(e) => setSourceTypeFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Channels</option>
              <option value="call">Calls (30)</option>
              <option value="meeting">Meetings (14)</option>
            </select>
          </div>

          {/* Person */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Person
            </label>
            <select
              value={personFilter}
              onChange={(e) => setPersonFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Representatives & Organizers</option>
              {personList.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Route Category */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Assigned Route
            </label>
            <select
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Routes</option>
              {ROUTE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Transcript Coverage */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Transcript Text
            </label>
            <select
              value={transcriptFilter}
              onChange={(e) => setTranscriptFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Text States</option>
              <option value="YES">Usable Text Supplied ({records.filter((r) => r.has_usable_text).length})</option>
              <option value="NO">No Text / Silent ({records.filter((r) => !r.has_usable_text).length})</option>
            </select>
          </div>

          {/* Review Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Review Status
            </label>
            <select
              value={reviewFilter}
              onChange={(e) => setReviewFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Review States</option>
              <option value="REVIEWED">Analysis Completed (18)</option>
              <option value="PENDING">Pending Review / Intake (26)</option>
              <option value="DISCREPANCY">Flagged Discrepancies (C06)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button if any active */}
        {(searchQuery || sourceTypeFilter !== 'ALL' || personFilter !== 'ALL' || routeFilter !== 'ALL' || transcriptFilter !== 'ALL' || reviewFilter !== 'ALL') && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={clearAllFilters}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>Reset all search & filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Conversation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th
                  onClick={() => toggleSort('ref')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Ref</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('type')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Channel</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('person')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Person / Rep</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Title / Outcome</th>
                <th className="py-3 px-3">Assigned Route(s)</th>
                <th className="py-3 px-3">Text Quality</th>
                <th className="py-3 px-3">Review State</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isCall = r.source_type === 'call';
                  return (
                    <tr
                      key={`${r.source_type}:::${r.source_id}`}
                      onClick={() => onOpenRecord(r)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition"
                    >
                      {/* Ref & Revision */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                            {r.record_ref}
                          </span>
                          {r.applied_source_revision > 1 && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              v{r.applied_source_revision}
                            </span>
                          )}
                          {r.discrepancy_flag && (
                            <span title={r.discrepancy_flag}>
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Source Type Channel */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          {isCall ? (
                            <Phone className="h-3.5 w-3.5 text-blue-500" />
                          ) : (
                            <Video className="h-3.5 w-3.5 text-indigo-500" />
                          )}
                          <span className="capitalize">{r.source_type}</span>
                        </div>
                      </td>

                      {/* Person */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {r.person_name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {r.person_role_type === 'call_rep' ? 'Telephony Rep' : 'Calendar Organizer'}
                        </div>
                      </td>

                      {/* Title / Outcome */}
                      <td className="py-3 px-4 max-w-xs truncate">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {r.title_or_outcome}
                        </span>
                        {r.analysis?.summary && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {r.analysis.summary}
                          </p>
                        )}
                      </td>

                      {/* Effective Routes */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {r.effective_routes.map((route) => {
                            const colors = ROUTE_COLORS[route];
                            return (
                              <span
                                key={route}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium border ${colors.badge} ${colors.border}`}
                              >
                                {route}
                              </span>
                            );
                          })}
                          {r.manual_decision.is_overridden && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center space-x-0.5">
                              <UserCheck className="h-2.5 w-2.5" />
                              <span>Override</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Text Quality */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {r.has_usable_text ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                            <FileCheck2 className="h-3.5 w-3.5" />
                            <span>Available</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-slate-400 text-[11px]">
                            <FileX2 className="h-3.5 w-3.5" />
                            <span>Unsupplied</span>
                          </span>
                        )}
                      </td>

                      {/* Review State */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          r.effective_review_state === 'reviewed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : r.effective_review_state.includes('bot') || r.effective_review_state.includes('speech')
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {r.effective_review_state}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenRecord(r);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 hover:text-cyan-600 text-slate-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center space-x-1 transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
