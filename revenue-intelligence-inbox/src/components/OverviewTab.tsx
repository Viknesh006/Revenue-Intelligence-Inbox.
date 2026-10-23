'use client';

import React, { useState, useMemo } from 'react';
import {
  UnifiedRecord,
  RouteCategory,
} from '@/types/intelligence';
import {
  ROUTE_CATEGORIES,
  ROUTE_COLORS,
  METRIC_DEFINITIONS,
  THREE_KEY_FINDINGS,
} from '@/lib/intelligenceData';
import {
  Phone,
  Video,
  FileCheck2,
  FileX2,
  AlertTriangle,
  UserCheck,
  RefreshCw,
  Info,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface OverviewTabProps {
  records: UnifiedRecord[];
  onNavigateToInbox: (filters?: { person?: string; sourceType?: string; route?: RouteCategory }) => void;
  onOpenRecord: (record: UnifiedRecord) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  records,
  onNavigateToInbox,
  onOpenRecord,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<string>('ALL');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('ALL');
  const [showMetricDefinitions, setShowMetricDefinitions] = useState<boolean>(false);

  // Filtered records based on controls
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedSourceType !== 'ALL' && r.source_type !== selectedSourceType) {
        return false;
      }
      if (selectedPerson !== 'ALL' && r.person_name !== selectedPerson) {
        return false;
      }
      return true;
    });
  }, [records, selectedSourceType, selectedPerson]);

  // Derived KPI metrics
  const totalUniqueRecords = records.length;
  const callsCount = records.filter((r) => r.source_type === 'call').length;
  const meetingsCount = records.filter((r) => r.source_type === 'meeting').length;
  const usableTextCount = records.filter((r) => r.has_usable_text).length;
  const missingTextCount = totalUniqueRecords - usableTextCount;
  const awaitingReviewCount = records.filter(
    (r) => r.effective_review_state === 'pending_manual_review' || r.effective_routes.includes('Human Review Required')
  ).length;
  const manualOverridesCount = records.filter((r) => r.manual_decision.is_overridden).length;
  const staleOrPendingCount = records.filter(
    (r) => r.analysis?.analysis_freshness === 'stale' || r.analysis?.analysis_freshness === 'pending_review'
  ).length;

  // Person lists (distinguishing call reps from meeting organizers)
  const callReps = useMemo(() => {
    const set = new Set<string>();
    records.filter((r) => r.source_type === 'call').forEach((r) => set.add(r.person_name));
    return Array.from(set).sort();
  }, [records]);

  const meetingOrganizers = useMemo(() => {
    const set = new Set<string>();
    records.filter((r) => r.source_type === 'meeting').forEach((r) => set.add(r.person_name));
    return Array.from(set).sort();
  }, [records]);

  // Activity by person chart data (filtered)
  const activityByPersonData = useMemo(() => {
    const map = new Map<string, { name: string; role: string; count: number; withText: number }>();

    filteredRecords.forEach((r) => {
      const existing = map.get(r.person_name) || {
        name: r.person_name,
        role: r.person_role_type === 'call_rep' ? 'Call Rep' : 'Organizer',
        count: 0,
        withText: 0,
      };
      existing.count++;
      if (r.has_usable_text) existing.withText++;
      map.set(r.person_name, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [filteredRecords]);

  // Routing counts
  const routeCounts = useMemo(() => {
    const counts: Record<RouteCategory, number> = {
      'Sales Coaching': 0,
      'Deal Follow-up': 0,
      'Partnership Opportunity': 0,
      'Customer Success / Support': 0,
      'Internal or Vendor Coordination': 0,
      'Human Review Required': 0,
    };

    filteredRecords.forEach((r) => {
      r.effective_routes.forEach((route) => {
        if (counts[route] !== undefined) {
          counts[route]++;
        }
      });
    });

    return ROUTE_CATEGORIES.map((cat) => ({
      name: cat,
      count: counts[cat],
      color: cat === 'Sales Coaching' ? '#f59e0b'
        : cat === 'Deal Follow-up' ? '#3b82f6'
        : cat === 'Partnership Opportunity' ? '#10b981'
        : cat === 'Customer Success / Support' ? '#8b5cf6'
        : cat === 'Internal or Vendor Coordination' ? '#64748b'
        : '#f43f5e',
    }));
  }, [filteredRecords]);

  // M07 update check
  const m07Record = records.find((r) => r.record_ref === 'M07');
  const isM07Updated = m07Record && m07Record.applied_source_revision === 2;

  // C06 discrepancy check
  const c06Record = records.find((r) => r.record_ref === 'C06');

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Hero Banner with Visual Graphic */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 sm:p-8 relative z-10">
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center space-x-1">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>SpendNest Revenue Operations</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">21 August 2026 (Asia/Kolkata)</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Intelligent Sales Ingestion & Operational Governance
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Transforming unstructured calls, calendar meetings, and late transcripts into auditable pipeline discoveries, sales coaching observations, and customer retention insights.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-slate-300">44 Logical Interactions</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300">18 Usable Transcripts</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-slate-300">Deterministic Replay Protected</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative group overflow-hidden rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 max-h-52 max-w-md w-full">
              <img
                src="/images/spendnest-hero.jpg"
                alt="SpendNest Revenue Intelligence Analytics Nexus"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] text-cyan-300 font-mono font-medium">
                  Interaction Data Stream & Analytics Mesh
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Scope & Dataset Limitation Notice */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Selected Interaction Dataset — 21 August 2026 (Asia/Kolkata)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curated assessment extract of SpendNest interactions. Counts represent selected records, not full-team performance or CRM totals.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowMetricDefinitions(true)}
          className="text-xs font-medium text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 px-3 py-1.5 rounded-lg border border-cyan-200 dark:border-cyan-800 flex items-center space-x-1 self-start sm:self-auto transition"
        >
          <span>Metric Definitions</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Critical Operational Notifications Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* M07 Status */}
        <div className={`p-4 rounded-xl border transition ${
          isM07Updated
            ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${isM07Updated ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                <RefreshCw className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">M07: Willowfield Trust</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isM07Updated ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                  }`}>
                    {isM07Updated ? 'Revision 2 (27 Turns Applied)' : 'Revision 1 (Awaiting Late Transcript)'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {isM07Updated
                    ? 'Late transcript successfully integrated. 4 severe defects demonstrated. Workaround does NOT equal bug resolution.'
                    : 'Initial batch loaded with transcript withheld. Late transcript arrives in batch update-002.'}
                </p>
                {m07Record && (
                  <button
                    onClick={() => onOpenRecord(m07Record)}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline mt-2 inline-flex items-center space-x-1"
                  >
                    <span>Inspect M07 Evidence</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* C06 Attribution Alert */}
        <div className="p-4 rounded-xl bg-purple-50/80 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">C06: Telephony Attribution Discrepancy</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-800">
                  Audit Flag
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Telephony metadata attributes call to rep <code className="bg-purple-100 dark:bg-purple-900/60 px-1 py-0.5 rounded text-[11px]">Meera</code>, but vocal speaker clearly introduces himself as <code className="bg-purple-100 dark:bg-purple-900/60 px-1 py-0.5 rounded text-[11px]">Ravi</code>. Softphone seat reconciliation required.
              </p>
              {c06Record && (
                <button
                  onClick={() => onOpenRecord(c06Record)}
                  className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline mt-2 inline-flex items-center space-x-1"
                >
                  <span>Inspect C06 Discrepancy</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Unique Records */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Records</span>
            <TrendingUp className="h-3.5 w-3.5 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalUniqueRecords}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">30 calls • 14 meetings</div>
        </div>

        {/* Usable Transcripts */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Usable Text</span>
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{usableTextCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{((usableTextCount / totalUniqueRecords) * 100).toFixed(1)}% coverage</div>
        </div>

        {/* Missing / Unsupplied Text */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">No Text</span>
            <FileX2 className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{missingTextCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">20 calls • 6 meetings</div>
        </div>

        {/* Calls */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Calls</span>
            <Phone className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{callsCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">10 with transcript</div>
        </div>

        {/* Meetings */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Meetings</span>
            <Video className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{meetingsCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{isM07Updated ? '8' : '7'} with transcript</div>
        </div>

        {/* Awaiting Review */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Review Queue</span>
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{awaitingReviewCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Exceptions & intake</div>
        </div>

        {/* Manual Overrides */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Overrides</span>
            <UserCheck className="h-3.5 w-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{manualOverridesCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Preserved decisions</div>
        </div>
      </div>

      {/* Filter Toolbar for Activity Visualizations */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200">
          <SlidersHorizontal className="h-4 w-4 text-cyan-600" />
          <span className="text-xs font-semibold uppercase tracking-wider">Interactive Analytics Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Source Type Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-medium text-slate-500">Source Type:</label>
            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="ALL">All Source Types ({records.length})</option>
              <option value="call">Phone Calls ({callsCount})</option>
              <option value="meeting">Meetings ({meetingsCount})</option>
            </select>
          </div>

          {/* Person Filter (Categorized) */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-medium text-slate-500">Person / Role:</label>
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="ALL">All Representatives & Organizers</option>
              <optgroup label="Call Representatives">
                {callReps.map((rep) => (
                  <option key={rep} value={rep}>
                    Rep: {rep} ({records.filter((r) => r.person_name === rep).length})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Meeting Organizers (Not confirmed reps)">
                {meetingOrganizers.map((org) => (
                  <option key={org} value={org}>
                    Org: {org} ({records.filter((r) => r.person_name === org).length})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {(selectedPerson !== 'ALL' || selectedSourceType !== 'ALL') && (
            <button
              onClick={() => {
                setSelectedPerson('ALL');
                setSelectedSourceType('ALL');
              }}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Two Column Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Activity by Person Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Activity by Individual & Channel
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total interactions vs usable transcripts on 21 August 2026 (Asia/Kolkata)
                </p>
              </div>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {filteredRecords.length} Selected Interactions
              </span>
            </div>

            {/* Crucial Note on Meeting Organizers */}
            <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
              <strong className="text-slate-700 dark:text-slate-300">Methodology boundary:</strong> Meeting organizers are calendar coordinators and are not automatically the salesperson or attendees. Call reps represent telephony dialer identities.
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityByPersonData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-800">
                            <p className="font-semibold text-cyan-300">{d.name}</p>
                            <p className="text-slate-400 text-[11px]">Role: {d.role}</p>
                            <p className="mt-1">Total Interactions: <strong className="text-white">{d.count}</strong></p>
                            <p>With Usable Text: <strong className="text-emerald-400">{d.withText}</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Interactions" />
                  <Bar dataKey="withText" fill="#10b981" radius={[4, 4, 0, 0]} name="With Usable Text" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <div className="h-3 w-3 rounded bg-blue-500" />
                <span className="text-slate-600 dark:text-slate-400">Total Interactions</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="h-3 w-3 rounded bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">With Usable Text</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateToInbox({ person: selectedPerson !== 'ALL' ? selectedPerson : undefined })}
              className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline inline-flex items-center space-x-1"
            >
              <span>View in Inbox</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Routing Distribution & Exceptions */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Routing Taxonomy Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target destination volume across active records
                </p>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Multi-route enabled
              </span>
            </div>

            <div className="space-y-2.5">
              {routeCounts.map((r) => {
                const colors = ROUTE_COLORS[r.name as RouteCategory];
                return (
                  <div
                    key={r.name}
                    onClick={() => onNavigateToInbox({ route: r.name as RouteCategory })}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-cyan-400 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-cyan-600">
                        {r.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {r.count}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            Note: Sum of routes exceeds 44 because a single conversation can be routed to multiple destinations when justified by evidence.
          </div>
        </div>
      </div>

      {/* Three Crucial Analytical Findings Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Three Core Analytical Discoveries (With Source Passages)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Ground-truth evidence citations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {THREE_KEY_FINDINGS.map((finding) => (
            <div
              key={finding.findingNumber}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Finding #{finding.findingNumber}
                  </span>
                  <span className="text-[11px] text-slate-400">Evidence Citation</span>
                </div>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">
                  {finding.title}
                </h4>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 italic mb-2">
                  {finding.citation}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-300">Operational Significance:</strong> {finding.significance}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-[10px] text-cyan-700 dark:text-cyan-400 font-medium">
                Applied to: {finding.productImpact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metric Definitions Modal / Drawer */}
      {showMetricDefinitions && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-cyan-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Metric Definitions & Statistical Boundaries
                </h3>
              </div>
              <button
                onClick={() => setShowMetricDefinitions(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                To guarantee auditability and eliminate phantom pipeline reporting, every headline metric adheres to strict definitions and established denominators.
              </p>

              {METRIC_DEFINITIONS.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{m.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400">{m.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Numerator:</span> {m.numerator}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Denominator:</span> {m.denominator}
                    </div>
                  </div>
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
                    <strong>Limitation:</strong> {m.limitations}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowMetricDefinitions(false)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:opacity-90 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
