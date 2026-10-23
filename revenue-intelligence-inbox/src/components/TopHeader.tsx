'use client';

import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Bell,
  Sun,
  Moon,
  Plus,
  Download,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { TabId } from './Navbar';

interface TopHeaderProps {
  onSearchFocus: () => void;
  onOpenWidgetModal: () => void;
  onQuickExport: () => void;
  onOpenReplay: () => void;
  onSelectTab: (tab: TabId) => void;
  activeTab: TabId;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onSearchFocus,
  onOpenWidgetModal,
  onQuickExport,
  onOpenReplay,
  onSelectTab,
  activeTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Input Bar (Matching Dribbble Search with keyboard pill) */}
      <div className="flex items-center space-x-3 w-80 lg:w-96">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations, accounts, reps..."
            onClick={onSearchFocus}
            readOnly
            className="w-full pl-9 pr-12 py-2 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200/70 focus:outline-none hover:bg-slate-100 cursor-pointer transition"
          />
          <div className="absolute right-2.5 top-2 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-400 font-semibold shadow-xs">
            ⌘K
          </div>
        </div>
      </div>

      {/* Center Date Range Selector (Matching Dribbble Jan 1 - Feb 1 pill) */}
      <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl text-xs">
        <Calendar className="h-3.5 w-3.5 text-blue-600" />
        <span className="font-semibold text-slate-800">21 August 2026</span>
        <span className="text-[11px] text-slate-400">(Asia/Kolkata)</span>
        <div className="h-3 w-px bg-slate-300 mx-1" />
        <span className="text-[11px] font-semibold text-blue-600">Fixed Assessment Day</span>
      </div>

      {/* Right Controls (Add widget, Export, Bell, Avatar) */}
      <div className="flex items-center space-x-2.5">
        {/* Replay Test Button */}
        <button
          onClick={onOpenReplay}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
        >
          <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
          <span>Replay Test</span>
        </button>

        {/* Add Widget Button (Matching Dribbble) */}
        <button
          onClick={onOpenWidgetModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
        >
          <Plus className="h-3.5 w-3.5 text-slate-600" />
          <span className="hidden sm:inline">Add Widget</span>
        </button>

        {/* Export ZIP Primary Button (Matching Dribbble Blue Primary Export Button) */}
        <button
          onClick={onQuickExport}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition"
        >
          <Download className="h-3.5 w-3.5 text-white" />
          <span>Export ZIP</span>
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">Active Operational Alerts</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">2 New</span>
              </div>

              <div className="space-y-2">
                <div
                  onClick={() => {
                    setShowNotifications(false);
                    onSelectTab('routing');
                  }}
                  className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 cursor-pointer hover:bg-purple-100 transition space-y-1"
                >
                  <div className="flex items-center space-x-1 text-purple-900 dark:text-purple-200 font-bold">
                    <AlertTriangle className="h-3.5 w-3.5 text-purple-600" />
                    <span>C06 Attribution Conflict</span>
                  </div>
                  <p className="text-[11px] text-purple-800/80 dark:text-purple-300">
                    Telephony rep is Meera, but caller introduced himself as Ravi.
                  </p>
                </div>

                <div
                  onClick={() => {
                    setShowNotifications(false);
                    onSelectTab('routing');
                  }}
                  className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 cursor-pointer hover:bg-emerald-100 transition space-y-1"
                >
                  <div className="flex items-center space-x-1 text-emerald-900 dark:text-emerald-200 font-bold">
                    <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                    <span>M07 Revision 2 Applied</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300">
                    27 turns loaded for Willowfield Trust. Manual override preserved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
          SM
        </div>
      </div>
    </header>
  );
};
