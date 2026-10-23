'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UnifiedRecord, RouteCategory, ReviewState, BatchImportResult } from '@/types/intelligence';
import { getDataEngine } from '@/lib/dataEngine';
import { downloadZipPackage } from '@/lib/exportEngine';
import { TabId } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { AddWidgetModal } from '@/components/AddWidgetModal';
import { OverviewTab } from '@/components/OverviewTab';
import { InboxTab } from '@/components/InboxTab';
import { FollowUpsTab } from '@/components/FollowUpsTab';
import { RoutingReviewTab } from '@/components/RoutingReviewTab';
import { ManagerBriefTab } from '@/components/ManagerBriefTab';
import { ExportsTab } from '@/components/ExportsTab';
import { ReplayStudioTab } from '@/components/ReplayStudioTab';
import { SlidesTab } from '@/components/SlidesTab';
import { MethodologyTab } from '@/components/MethodologyTab';
import { DetailModal } from '@/components/DetailModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [records, setRecords] = useState<UnifiedRecord[]>([]);
  const [history, setHistory] = useState<BatchImportResult[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<UnifiedRecord | null>(null);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [enabledWidgets, setEnabledWidgets] = useState<Record<string, boolean>>({
    timeline: true,
    repActivity: true,
    coverageGauge: true,
    aiAssistant: true,
    priorityAccounts: true,
  });
  const [inboxInitialFilters, setInboxInitialFilters] = useState<{
    person?: string;
    sourceType?: string;
    route?: RouteCategory;
  } | undefined>(undefined);

  // Sync state from engine
  const refreshFromEngine = useCallback(() => {
    const engine = getDataEngine();
    setRecords(engine.getRecords());
    setHistory(engine.getHistory());
  }, []);

  useEffect(() => {
    refreshFromEngine();
  }, [refreshFromEngine]);

  // Keep selected record updated if engine modifies it
  useEffect(() => {
    if (selectedRecord) {
      const engine = getDataEngine();
      const updated = engine.getRecord(selectedRecord.source_type, selectedRecord.source_id);
      if (updated) setSelectedRecord(updated);
    }
  }, [records, selectedRecord]);

  // Handlers
  const handleNavigateToInboxWithFilter = (filters?: {
    person?: string;
    sourceType?: string;
    route?: RouteCategory;
  }) => {
    setInboxInitialFilters(filters);
    setActiveTab('inbox');
  };

  const handleSaveManualRoute = (
    source_type: string,
    source_id: string,
    routes: RouteCategory[],
    rationale: string,
    reviewState: ReviewState
  ) => {
    const engine = getDataEngine();
    const updated = engine.updateManualRoute(source_type, source_id, routes, rationale, reviewState);
    refreshFromEngine();
    setSelectedRecord(updated);
  };

  const handleResetManualRoute = (source_type: string, source_id: string) => {
    const engine = getDataEngine();
    const updated = engine.resetManualRouteToSystem(source_type, source_id);
    refreshFromEngine();
    setSelectedRecord(updated);
  };

  const handleQuickExportZip = async () => {
    try {
      await downloadZipPackage(records);
    } catch (e) {
      console.error('Quick export error:', e);
    }
  };

  const handleToggleWidget = (widgetId: string) => {
    setEnabledWidgets((prev) => ({
      ...prev,
      [widgetId]: prev[widgetId] !== undefined ? !prev[widgetId] : false,
    }));
  };

  // Derive counts
  const totalRecords = records.length;
  const reviewCount = records.filter(
    (r) => r.effective_routes.includes('Human Review Required') || r.effective_review_state !== 'reviewed'
  ).length;

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Shopeers-style Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'inbox') setInboxInitialFilters(undefined);
        }}
        totalRecords={totalRecords}
        reviewCount={reviewCount}
        onOpenReplay={() => setActiveTab('replay')}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header with Search, Date, Notifications, Add Widget & Export */}
        <TopHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onSearchFocus={() => {
            setActiveTab('inbox');
          }}
          onOpenWidgetModal={() => setIsAddWidgetOpen(true)}
          onQuickExport={handleQuickExportZip}
          onOpenReplay={() => setActiveTab('replay')}
        />

        {/* Scrollable Main Content Canvas */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'overview' && (
              <OverviewTab
                records={records}
                onNavigateToInbox={handleNavigateToInboxWithFilter}
                onOpenRecord={(r) => setSelectedRecord(r)}
                enabledWidgets={enabledWidgets}
              />
            )}

            {activeTab === 'inbox' && (
              <InboxTab
                records={records}
                onOpenRecord={(r) => setSelectedRecord(r)}
                initialFilters={inboxInitialFilters}
              />
            )}

            {activeTab === 'followups' && (
              <FollowUpsTab
                records={records}
                onOpenRecord={(r) => setSelectedRecord(r)}
              />
            )}

            {activeTab === 'routing' && (
              <RoutingReviewTab
                records={records}
                onOpenRecord={(r) => setSelectedRecord(r)}
                onUpdateRoute={handleSaveManualRoute}
              />
            )}

            {activeTab === 'brief' && (
              <ManagerBriefTab
                records={records}
                onOpenRecord={(r) => setSelectedRecord(r)}
              />
            )}

            {activeTab === 'exports' && <ExportsTab records={records} />}

            {activeTab === 'replay' && (
              <ReplayStudioTab
                records={records}
                history={history}
                onRefreshRecords={refreshFromEngine}
                onOpenRecord={(r) => setSelectedRecord(r)}
              />
            )}

            {activeTab === 'slides' && <SlidesTab />}

            {activeTab === 'methodology' && <MethodologyTab />}
          </div>
        </main>
      </div>

      {/* Add Widget Slideover Drawer */}
      <AddWidgetModal
        isOpen={isAddWidgetOpen}
        onClose={() => setIsAddWidgetOpen(false)}
        enabledWidgets={enabledWidgets}
        onToggleWidget={handleToggleWidget}
      />

      {/* Detail Inspection Modal / Drawer */}
      <DetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onSaveManualRoute={handleSaveManualRoute}
        onResetManualRoute={handleResetManualRoute}
      />
    </div>
  );
}
