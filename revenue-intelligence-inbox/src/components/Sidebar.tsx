'use client';

import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  GitPullRequest,
  FileText,
  Download,
  RotateCcw,
  Presentation,
  BookOpen,
  Layers,
  Settings,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { TabId } from './Navbar';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  totalRecords: number;
  reviewCount: number;
  onOpenReplay: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  totalRecords,
  reviewCount,
  onOpenReplay,
}) => {
  const mainNavItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Conversations', icon: Inbox, badge: totalRecords },
    { id: 'followups', label: 'Follow-ups', icon: CheckSquare },
    { id: 'routing', label: 'Routing & Review', icon: GitPullRequest, alertBadge: reviewCount },
  ];

  const operationsNavItems = [
    { id: 'brief', label: 'Manager Brief', icon: FileText },
    { id: 'exports', label: 'Exports & Manifest', icon: Download },
    { id: 'replay', label: 'Replay Studio', icon: RotateCcw },
    { id: 'slides', label: '5-Slide Deck', icon: Presentation },
    { id: 'methodology', label: 'Methodology & Data', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 select-none z-30 shadow-sm">
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2 mb-6">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">SpendNest</span>
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            </div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Revenue Intelligence</p>
          </div>
        </div>

        {/* Main Menu Section */}
        <div className="space-y-1 mb-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
            Core Workspace
          </span>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as TabId)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/60 dark:border-blue-800/80'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.alertBadge !== undefined && item.alertBadge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                    {item.alertBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Governance & Reporting Section */}
        <div className="space-y-1 mb-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
            Intelligence & Reports
          </span>
          {operationsNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as TabId)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/60 dark:border-blue-800/80'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Promo / Compliance Badge Card (Matching Dribbble Dark Promo Card) */}
        <div className="mt-auto pt-2">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-lg border border-blue-900/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-xs text-white">Replay Engine Verified</h4>
              <p className="text-[11px] text-slate-300 leading-tight">
                44 records, 18 transcripts, revision 2. Manual route preserved.
              </p>
              <button
                onClick={onOpenReplay}
                className="w-full mt-2 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 shadow-sm"
              >
                <span>Run Replay Test</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User / Settings Footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
            SM
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 dark:text-white block">Sales Manager</span>
            <span className="text-[10px] text-slate-400 block">manager@spendnest.io</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
