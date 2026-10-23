'use client';

import React, { useState } from 'react';
import {
  UnifiedRecord,
  RouteCategory,
  ReviewState,
} from '@/types/intelligence';
import { ROUTE_CATEGORIES, ROUTE_COLORS } from '@/lib/intelligenceData';
import {
  GitPullRequest,
  AlertTriangle,
  FileX2,
  CheckCircle2,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Sliders,
} from 'lucide-react';

interface RoutingReviewTabProps {
  records: UnifiedRecord[];
  onOpenRecord: (record: UnifiedRecord) => void;
  onUpdateRoute: (
    source_type: string,
    source_id: string,
    routes: RouteCategory[],
    rationale: string,
    reviewState: ReviewState
  ) => void;
}

export const RoutingReviewTab: React.FC<RoutingReviewTabProps> = ({
  records,
  onOpenRecord,
  onUpdateRoute,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'discrepancies' | 'missing_text' | 'all_exceptions'>('discrepancies');

  // Categorize exception groups
  const discrepancyRecords = records.filter((r) => r.discrepancy_flag || r.record_ref === 'C06');
  const missingTextRecords = records.filter((r) => !r.has_usable_text);
  const manualOverrideRecords = records.filter((r) => r.manual_decision.is_overridden);
  const allReviewRequired = records.filter(
    (r) => r.effective_routes.includes('Human Review Required') || r.effective_review_state !== 'reviewed'
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitPullRequest className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Routing Governance & Human Review Queue
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Resolve unrecorded calls, notetaker bot cancellations, telemetry attribution discrepancies, and manual route assignments.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-500">Queue Volume:</span>
          <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            {allReviewRequired.length} Items in Governance Queue
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 text-xs font-medium pb-2">
        <button
          onClick={() => setSelectedSubTab('discrepancies')}
          className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
            selectedSubTab === 'discrepancies'
              ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-purple-600" />
          <span>Attribution Discrepancies ({discrepancyRecords.length})</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('missing_text')}
          className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
            selectedSubTab === 'missing_text'
              ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileX2 className="h-3.5 w-3.5 text-slate-500" />
          <span>Unsupplied Text / Silent Records ({missingTextRecords.length})</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('all_exceptions')}
          className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
            selectedSubTab === 'all_exceptions'
              ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <GitPullRequest className="h-3.5 w-3.5 text-blue-600" />
          <span>All Human Review Routes ({allReviewRequired.length})</span>
        </button>
      </div>

      {/* Sub Tab: Discrepancies */}
      {selectedSubTab === 'discrepancies' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl text-xs space-y-2">
            <h3 className="font-bold text-purple-900 dark:text-purple-200 flex items-center space-x-1.5">
              <AlertTriangle className="h-4 w-4 text-purple-600" />
              <span>Telephony vs Spoken Evidence Conflicts</span>
            </h3>
            <p className="text-purple-800/80 dark:text-purple-300/80 leading-relaxed">
              When stored telephony metadata conflicts with spoken transcript statements, the system flags the interaction for administrative review rather than silently accepting incorrect upstream attribution.
            </p>
          </div>

          <div className="space-y-3">
            {discrepancyRecords.map((r) => (
              <div
                key={r.source_id}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-purple-200 dark:border-purple-800/60 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                      {r.record_ref}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {r.title_or_outcome}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenRecord(r)}
                    className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Inspect Record</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200">
                  <strong className="block mb-1">Audit Finding:</strong>
                  {r.discrepancy_flag || 'Vocal speaker contradicts telephony user.'}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div><strong>Stored Rep:</strong> {r.person_name} (meera@example.com)</div>
                  <div><strong>Spoken Statement:</strong> &quot;Good evening, Mr Nikhil. Good evening. Ravi here. I&apos;ll say at the start that this is a cold call.&quot;</div>
                  <div><strong>Recommended Resolution:</strong> Reconcile softphone seat provisioning with Sales Operations.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: Missing / Silent Text */}
      {selectedSubTab === 'missing_text' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1 text-slate-600 dark:text-slate-400">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Intake Protocol for Records Without Usable Supplied Text (26 Records)
            </h3>
            <p className="leading-relaxed">
              In strict accordance with <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">DATA_CONTRACT.md</code>, missing source text does not imply that no conversation occurred, but no substantive analysis may be fabricated. All records retain their intake states.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-4">Ref</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Rep / Organizer</th>
                  <th className="py-2.5 px-3">Observed Outcome / Status</th>
                  <th className="py-2.5 px-3">Intake Review State</th>
                  <th className="py-2.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {missingTextRecords.map((r) => (
                  <tr
                    key={r.source_id}
                    onClick={() => onOpenRecord(r)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    <td className="py-2.5 px-4 font-mono font-bold">{r.record_ref}</td>
                    <td className="py-2.5 px-3 capitalize">{r.source_type}</td>
                    <td className="py-2.5 px-3">{r.person_name}</td>
                    <td className="py-2.5 px-3 capitalize">{r.title_or_outcome}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {r.effective_review_state}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right text-blue-600 font-semibold hover:underline">
                      View
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub Tab: All Exceptions */}
      {selectedSubTab === 'all_exceptions' && (
        <div className="space-y-3">
          {allReviewRequired.map((r) => (
            <div
              key={r.source_id}
              onClick={() => onOpenRecord(r)}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 cursor-pointer shadow-sm transition flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs font-mono text-slate-900 dark:text-white">{r.record_ref}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{r.title_or_outcome}</span>
                  <span className="text-[10px] text-slate-400">({r.person_name})</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                  <span>Review State: <code className="text-slate-700 dark:text-slate-300 font-semibold">{r.effective_review_state}</code></span>
                  <span>•</span>
                  <span>Routes: {r.effective_routes.join(', ')}</span>
                  {r.manual_decision.is_overridden && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      Override
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
