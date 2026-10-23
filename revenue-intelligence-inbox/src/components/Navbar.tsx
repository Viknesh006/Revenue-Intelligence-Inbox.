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
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export type TabId =
  | 'overview'
  | 'inbox'
  | 'followups'
  | 'routing'
  | 'brief'
  | 'exports'
  | 'replay'
  | 'slides'
  | 'methodology';

interface NavbarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  totalRecords: number;
  usableTexts: number;
  reviewCount: number;
  onQuickExport: () => void;
  onOpenReplay: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  totalRecords,
  usableTexts,
  reviewCount,
  onQuickExport,
  onOpenReplay,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inbox', label: 'Conversations', icon: Inbox, badge: totalRecords },
    { id: 'followups', label: 'Follow-ups', icon: CheckSquare },
    { id: 'routing', label: 'Routing & Review', icon: GitPullRequest, alertBadge: reviewCount },
    { id: 'brief', label: 'Manager Brief', icon: FileText },
    { id: 'exports', label: 'Exports', icon: Download },
    { id: 'replay', label: 'Replay Studio', icon: RotateCcw },
    { id: 'slides', label: '5-Slide Deck', icon: Presentation },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top Banner / Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">SpendNest</span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  Revenue Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400">Interaction Inbox & Operational Sales Governance</p>
            </div>
          </div>

          {/* Center Info / Local Reporting Date Context */}
          <div className="hidden lg:flex items-center space-x-4 bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs">
            <div className="flex items-center text-slate-300 space-x-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-semibold text-slate-100">21 August 2026</span>
              <span className="text-slate-400">(Asia/Kolkata)</span>
            </div>
            <div className="h-3 w-px bg-slate-600" />
            <div className="flex items-center space-x-3 text-slate-300">
              <span>Records: <strong className="text-white">{totalRecords}</strong></span>
              <span>Transcripts: <strong className="text-emerald-400">{usableTexts}</strong></span>
              <span>Review Queue: <strong className="text-amber-400">{reviewCount}</strong></span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenReplay}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Open Replay & Revision Test Studio"
            >
              <RotateCcw className="h-3.5 w-3.5 text-blue-400" />
              <span>Replay Test</span>
            </button>

            <button
              onClick={onQuickExport}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm transition"
              title="Download Complete Export Archive (ZIP)"
            >
              <Download className="h-3.5 w-3.5 text-white" />
              <span>Download ZIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as TabId)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-blue-300 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                    isActive ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.alertBadge !== undefined && item.alertBadge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800/80">
                    {item.alertBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
