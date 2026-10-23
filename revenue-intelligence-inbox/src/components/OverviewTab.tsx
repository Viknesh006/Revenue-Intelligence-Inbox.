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
  Eye,
  TrendingUp,
  TrendingDown,
  Phone,
  Video,
  FileCheck2,
  FileX2,
  ShieldAlert,
  ArrowUpRight,
  MoreHorizontal,
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Layers,
  Star,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface OverviewTabProps {
  records: UnifiedRecord[];
  onNavigateToInbox: (filters?: { person?: string; sourceType?: string; route?: RouteCategory }) => void;
  onOpenRecord: (record: UnifiedRecord) => void;
  enabledWidgets?: Record<string, boolean>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  records,
  onNavigateToInbox,
  onOpenRecord,
  enabledWidgets = {},
}) => {
  const [activeSegment, setActiveSegment] = useState<'all' | 'calls' | 'meetings'>('all');
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // Derived metrics
  const totalRecords = records.length;
  const callsCount = records.filter((r) => r.source_type === 'call').length;
  const meetingsCount = records.filter((r) => r.source_type === 'meeting').length;
  const usableTextCount = records.filter((r) => r.has_usable_text).length;
  const coveragePercent = totalRecords > 0 ? Math.round((usableTextCount / totalRecords) * 100) : 0;

  // Time-of-day timeline data for 21 August 2026 Asia/Kolkata
  const timelineData = useMemo(() => {
    return [
      { time: '04:00', label: '10:00 AM', calls: 0, meetings: 2, total: 2 },
      { time: '06:00', label: '11:30 AM', calls: 0, meetings: 2, total: 2 },
      { time: '08:00', label: '01:30 PM', calls: 0, meetings: 3, total: 3 },
      { time: '11:00', label: '04:30 PM', calls: 4, meetings: 2, total: 6 },
      { time: '12:00', label: '05:30 PM', calls: 4, meetings: 0, total: 4 },
      { time: '14:00', label: '07:30 PM', calls: 1, meetings: 2, total: 3 },
      { time: '16:00', label: '09:30 PM', calls: 1, meetings: 0, total: 1 },
      { time: '18:00', label: '11:30 PM', calls: 20, meetings: 3, total: 23 },
    ];
  }, []);

  // Most active rep bar data (matching Dribbble "Most Day Active")
  const repActivityData = useMemo(() => {
    return [
      { name: 'Arun', count: 15, isTop: true },
      { name: 'Meera', count: 5, isTop: false },
      { name: 'Leela', count: 8, isTop: false },
      { name: 'Dev', count: 1, isTop: false },
      { name: 'Kiran', count: 1, isTop: false },
    ];
  }, []);

  // Top Priority Interactions (matching "Best Selling Products" table)
  const priorityInteractions = useMemo(() => {
    const list = [
      {
        ref: 'M07',
        name: 'Willowfield Trust',
        contact: 'Customer A',
        channel: 'meeting',
        route: 'Customer Success / Support',
        status: 'P1 Defect (Screen Share)',
        rating: 5.0,
        highlight: '4 severe bugs demonstrated',
      },
      {
        ref: 'C07',
        name: 'Willowbank Advisory',
        contact: 'Mr. Aditya',
        channel: 'call',
        route: 'Partnership Opportunity',
        status: 'Active Referral Channel',
        rating: 4.9,
        highlight: 'Virtual account partnership agreed',
      },
      {
        ref: 'M03',
        name: 'Asterloom Systems',
        contact: 'Customer B (Finance)',
        channel: 'meeting',
        route: 'Deal Follow-up',
        status: 'CFO Pricing Review',
        rating: 4.8,
        highlight: 'Enterprise card walkthrough complete',
      },
      {
        ref: 'C06',
        name: 'Meadowbrook Retail',
        contact: 'Mr. Nikhil',
        channel: 'call',
        route: 'Sales Coaching',
        status: 'Attribution Conflict',
        rating: 4.7,
        highlight: 'Vocal speaker (Ravi) != Telephony (Meera)',
      },
      {
        ref: 'M04',
        name: 'Cedarwave Distribution',
        contact: 'Operations Lead',
        channel: 'meeting',
        route: 'Customer Success / Support',
        status: 'Card Network Migration',
        rating: 4.6,
        highlight: 'Physical card terminal failures',
      },
    ];

    return list.map((item) => {
      const rec = records.find((r) => r.record_ref === item.ref);
      return { ...item, record: rec };
    });
  }, [records]);

  const handleAskCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const q = aiQuery.toLowerCase();
    if (q.includes('m07') || q.includes('bug') || q.includes('defect')) {
      setAiAnswer('M07 (Willowfield Trust) revealed 4 severe bugs: payment description mutation failure, cash disbursement modal amount leakage (INR 18,200), and reimbursement processing freeze. Turn 15 emphasizes that workarounds do NOT equal resolution.');
    } else if (q.includes('partner') || q.includes('c07') || q.includes('m01')) {
      setAiAnswer('Two key partnerships identified: C07 (Willowbank Advisory) refers newly formed entities for virtual accounts; M01 (Harborpath Advisory) seeks remote accounts for registered US entities.');
    } else if (q.includes('c06') || q.includes('discrepancy') || q.includes('ravi')) {
      setAiAnswer('Call C06 is attributed to rep Meera in telephony records, but the audio transcript clearly starts with "Ravi here". Softphone seat login audit required.');
    } else {
      setAiAnswer(`Analyzed 44 interactions for 21 August 2026. 18 conversations have full dialogue; 13 follow-up actions identified. Highest priority is filing engineering hotfixes for M07.`);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 4 Top Metric Cards (Matching Dribbble: Page Views, Visitors, Click, Orders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Interactions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Interactions</span>
            <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalRecords}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> 100%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">30 calls • 14 calendar meetings</p>
        </div>

        {/* Card 2: Usable Transcripts */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Usable Transcripts</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {usableTextCount}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> {coveragePercent}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">10 calls • 8 meetings post-update</p>
        </div>

        {/* Card 3: Telephony Connection Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Telephony Connects</span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
              <Phone className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              46.7%
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
              14 / 30 Dials
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Source-reported connection heuristic</p>
        </div>

        {/* Card 4: Action Items */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Action Commitments</span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              13
            </span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center">
              2 P1 Urgent
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ranked by evidence & urgency</p>
        </div>
      </div>

      {/* Main Two Column Row (Matching Dribbble: Left Main Chart + Right Side Widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Total Profit / Interaction Volume Area Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400">Interaction Volume by Time</span>
                <div className="flex items-baseline space-x-3 mt-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    44 Interactions
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> 21 Aug 2026
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setActiveSegment('all')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    activeSegment === 'all'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All (44)
                </button>
                <button
                  onClick={() => setActiveSegment('calls')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    activeSegment === 'calls'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Calls (30)
                </button>
                <button
                  onClick={() => setActiveSegment('meetings')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    activeSegment === 'meetings'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Meetings (14)
                </button>
              </div>
            </div>

            {/* Smooth Blue Area Chart with Interactive Hover (Matching Dribbble Area Chart) */}
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl border border-slate-800 space-y-1">
                            <span className="font-bold text-cyan-300 block">{d.label} (Asia/Kolkata)</span>
                            <div className="flex items-center justify-between space-x-4 text-slate-300">
                              <span>Total Volume:</span>
                              <strong className="text-white">{d.total}</strong>
                            </div>
                            <div className="flex items-center justify-between space-x-4 text-slate-400 text-[11px]">
                              <span>Calls: {d.calls} • Meetings: {d.meetings}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeSegment === 'calls' ? 'calls' : activeSegment === 'meetings' ? 'meetings' : 'total'}
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sub-cards Row (Matching Dribbble "Customers 2,884, 1,432, 562") */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">Outbound Dials</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">30 Calls</span>
              <span className="text-[10px] text-slate-400">10 with dialogue</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">Calendar Sessions</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">14 Meetings</span>
              <span className="text-[10px] text-slate-400">8 with dialogue</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">Active Revision</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5 block">Revision 2</span>
              <span className="text-[10px] text-slate-400">M07 updated</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Three Stacked Modern Widgets */}
        <div className="lg:col-span-4 space-y-5">
          {/* Widget 1: Most Active Rep (Matching Dribbble "Most Day Active" Bar Chart) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Most Active Rep</h4>
                <p className="text-[11px] text-slate-400">Interaction distribution across callers</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                Arun (15)
              </span>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repActivityData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white px-2 py-1 rounded-md text-[11px]">
                            <strong>{d.name}</strong>: {d.count} dials
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#e2e8f0">
                    {repActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isTop ? '#2563eb' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Widget 2: Transcript Coverage Gauge (Matching Dribbble "Repeat Customer Rate 68%") */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center space-y-2 text-center">
            <div className="w-full flex items-center justify-between pb-1">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Transcript Coverage Rate</h4>
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </div>

            {/* Semicircle Gauge Visual */}
            <div className="relative flex items-center justify-center pt-2">
              <svg className="w-40 h-24 transform -rotate-180" viewBox="0 0 100 50">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="125"
                  strokeDashoffset={125 - (125 * (coveragePercent || 0)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-10 flex flex-col items-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{coveragePercent}%</span>
                <span className="text-[10px] text-slate-400 font-semibold">18 / 44 Captures</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              On track for qualitative synthesis post-update.
            </p>
          </div>

          {/* Widget 3: AI Assistant / Copilot (Matching Dribbble "AI Assistant" with Floating Orb) */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-5 border border-blue-900/40 shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-blue-400" />
                <h4 className="font-bold text-xs text-white">AI Revenue Copilot</h4>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono">Live Grounded</span>
            </div>

            {/* Glowing 3D Orb Visual */}
            <div className="flex justify-center py-2">
              <div className="relative">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-500 shadow-lg shadow-cyan-500/50 flex items-center justify-center animate-pulse">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            {aiAnswer ? (
              <div className="p-3 bg-white/10 rounded-xl text-[11px] text-slate-200 leading-relaxed border border-white/10 space-y-1">
                <p>{aiAnswer}</p>
                <button
                  onClick={() => setAiAnswer(null)}
                  className="text-[10px] text-cyan-300 underline font-semibold mt-1 block"
                >
                  Clear response
                </button>
              </div>
            ) : null}

            {/* Query Input Bar */}
            <form onSubmit={handleAskCopilot} className="relative">
              <input
                type="text"
                placeholder="Ask about M07, C06, or partners..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="w-full text-xs pl-3 pr-8 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-cyan-400 hover:text-white transition"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Lower Section: High Priority Conversations Table (Matching Dribbble "Best Selling Products") */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              High Priority Interaction Accounts & Evidence
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by operational impact, defect severity, and commercial intent
            </p>
          </div>

          <button
            onClick={() => onNavigateToInbox()}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>View All 44 Records</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-100 dark:border-slate-800 pb-2">
                <th className="py-2.5 px-3">Ref ID</th>
                <th className="py-2.5 px-3">Account & Contact</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Assigned Route</th>
                <th className="py-2.5 px-3">Status / Finding</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {priorityInteractions.map((item) => (
                <tr
                  key={item.ref}
                  onClick={() => item.record && onOpenRecord(item.record)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    #{item.ref}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{item.name}</span>
                    <span className="text-[11px] text-slate-400">{item.contact}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="capitalize inline-flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                      {item.channel === 'call' ? (
                        <Phone className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Video className="h-3 w-3 text-indigo-500" />
                      )}
                      <span>{item.channel}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {item.route}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                      {item.status}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.highlight}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center space-x-1 font-bold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating.toFixed(1)}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.record) onOpenRecord(item.record);
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
