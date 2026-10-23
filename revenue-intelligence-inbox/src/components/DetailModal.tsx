'use client';

import React, { useState } from 'react';
import {
  UnifiedRecord,
  RouteCategory,
  ReviewState,
} from '@/types/intelligence';
import { ROUTE_CATEGORIES, ROUTE_COLORS } from '@/lib/intelligenceData';
import {
  X,
  Phone,
  Video,
  FileCheck2,
  FileX2,
  Clock,
  User,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Save,
  CheckCircle2,
  FileCode,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface DetailModalProps {
  record: UnifiedRecord | null;
  onClose: () => void;
  onSaveManualRoute: (
    source_type: string,
    source_id: string,
    routes: RouteCategory[],
    rationale: string,
    reviewState: ReviewState
  ) => void;
  onResetManualRoute: (source_type: string, source_id: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  record,
  onClose,
  onSaveManualRoute,
  onResetManualRoute,
}) => {
  if (!record) return null;

  const isCall = record.source_type === 'call';
  const callPayload = isCall ? (record.payload as any) : null;
  const meetingPayload = !isCall ? (record.payload as any) : null;

  // Editing state for manual route override
  const [isEditingRoute, setIsEditingRoute] = useState<boolean>(false);
  const [selectedRoutes, setSelectedRoutes] = useState<RouteCategory[]>([
    ...record.effective_routes,
  ]);
  const [overrideRationale, setOverrideRationale] = useState<string>(
    record.manual_decision.manual_rationale || ''
  );
  const [selectedReviewState, setSelectedReviewState] = useState<ReviewState>(
    record.effective_review_state
  );
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [searchTranscript, setSearchTranscript] = useState<string>('');

  const toggleRouteSelection = (route: RouteCategory) => {
    if (selectedRoutes.includes(route)) {
      if (selectedRoutes.length > 1) {
        setSelectedRoutes(selectedRoutes.filter((r) => r !== route));
      }
    } else {
      setSelectedRoutes([...selectedRoutes, route]);
    }
  };

  const handleSave = () => {
    onSaveManualRoute(
      record.source_type,
      record.source_id,
      selectedRoutes,
      overrideRationale,
      selectedReviewState
    );
    setIsEditingRoute(false);
  };

  const handleReset = () => {
    onResetManualRoute(record.source_type, record.source_id);
    setIsEditingRoute(false);
  };

  // Filter transcript turns if meeting
  const turns = record.transcript_payload?.turns || [];
  const filteredTurns = turns.filter((t) =>
    searchTranscript
      ? t.text.toLowerCase().includes(searchTranscript.toLowerCase()) ||
        t.speaker.toLowerCase().includes(searchTranscript.toLowerCase())
      : true
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-5xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${isCall ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40' : 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'}`}>
              {isCall ? <Phone className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-white">{record.record_ref}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-200 text-sm font-semibold truncate max-w-md">
                  {record.title_or_outcome}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  record.applied_source_revision > 1
                    ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  Revision {record.applied_source_revision}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Composite Key: <code className="text-blue-300">({record.source_type}, {record.source_id})</code>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center space-x-1"
              title="Toggle Raw JSON View"
            >
              <FileCode className="h-4 w-4" />
              <span className="hidden sm:inline">Raw JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          {/* Left Column: Metadata & Transcript */}
          <div className="lg:col-span-6 p-5 space-y-5 overflow-y-auto">
            {/* Metadata Badges Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Interaction Details</span>
                <span className="text-[11px] text-slate-500">{record.local_date} (Asia/Kolkata)</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Channel & ID</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {record.source_type.toUpperCase()} ({record.record_ref})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">
                    {isCall ? 'Telephony Rep' : 'Calendar Organizer'}
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {record.person_name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Duration</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {record.payload.duration_seconds} seconds
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Transcript Quality</span>
                  <span className={`inline-flex items-center space-x-1 font-semibold ${record.has_usable_text ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                    {record.has_usable_text ? (
                      <>
                        <FileCheck2 className="h-3.5 w-3.5" />
                        <span>Usable Text Supplied</span>
                      </>
                    ) : (
                      <>
                        <FileX2 className="h-3.5 w-3.5" />
                        <span>No Usable Text</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Call Specific Telephony Metrics */}
              {isCall && callPayload && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Connected</span>
                    <span className="font-medium">{callPayload.is_connected ? 'Yes (Stored)' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Direction</span>
                    <span className="font-medium capitalize">{callPayload.direction || 'Outbound'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Reported Outcome</span>
                    <span className="font-medium capitalize">{callPayload.observed_outcome || 'N/A'}</span>
                  </div>
                </div>
              )}

              {/* Meeting Specific Recording Details */}
              {!isCall && meetingPayload && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Recording Status</span>
                    <span className="font-medium capitalize">{meetingPayload.recording_status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Platform Provider</span>
                    <span className="font-medium capitalize">{meetingPayload.provider}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Discrepancy Alert Banner */}
            {record.discrepancy_flag && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="font-bold">Attribution Discrepancy:</strong>
                  <p className="mt-0.5 text-[11px] leading-relaxed">{record.discrepancy_flag}</p>
                </div>
              </div>
            )}

            {/* Raw JSON View Toggle */}
            {showRawJson ? (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Raw Stored Payloads</span>
                <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl text-[10px] overflow-x-auto max-h-96">
                  {JSON.stringify(
                    {
                      record_ref: record.record_ref,
                      source_type: record.source_type,
                      source_id: record.source_id,
                      applied_source_revision: record.applied_source_revision,
                      payload: record.payload,
                      transcript_payload: record.transcript_payload,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            ) : (
              /* Conversation Transcript Viewer */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {record.has_usable_text ? 'Conversation Transcript' : 'Source Transcript Status'}
                  </span>
                  {record.has_usable_text && !isCall && (
                    <input
                      type="text"
                      placeholder="Search dialogue..."
                      value={searchTranscript}
                      onChange={(e) => setSearchTranscript(e.target.value)}
                      className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-36"
                    />
                  )}
                </div>

                {/* Call Transcript */}
                {isCall && (
                  record.has_usable_text ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed max-h-96 overflow-y-auto">
                      {callPayload?.transcript}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 space-y-1">
                      <FileX2 className="h-6 w-6 mx-auto text-slate-400" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">No Transcript Supplied in Package</p>
                      <p className="text-[11px]">This is a background call logged with outcome: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">{callPayload?.observed_outcome || 'voicemail'}</code>. No conversation summary was fabricated.</p>
                    </div>
                  )
                )}

                {/* Meeting Transcript Turns */}
                {!isCall && (
                  record.has_usable_text ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {filteredTurns.map((turn, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 text-xs space-y-1 shadow-sm"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-blue-700 dark:text-blue-400">
                              Turn {idx + 1} • {turn.speaker}
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">{turn.timecode}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{turn.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 space-y-1">
                      <FileX2 className="h-6 w-6 mx-auto text-slate-400" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">No Speech or Notetaker Cancelled</p>
                      <p className="text-[11px]">
                        {record.transcript_payload?.unavailable_reason ||
                          meetingPayload?.recording_detail ||
                          'Notetaker capture unrecorded or zero human speech captured.'}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right Column: Routing & Intelligence Analysis */}
          <div className="lg:col-span-6 p-5 space-y-5 overflow-y-auto">
            {/* Routing & Review Section */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Routing Governance
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {record.manual_decision.is_overridden ? 'Manager Manual Override Active' : 'System Suggested Route'}
                  </span>
                </div>

                {!isEditingRoute ? (
                  <button
                    onClick={() => setIsEditingRoute(true)}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 hover:bg-blue-100 transition"
                  >
                    Edit Route
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingRoute(false)}
                    className="text-xs font-semibold px-2 py-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Read Mode */}
              {!isEditingRoute ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {record.effective_routes.map((route) => {
                      const colors = ROUTE_COLORS[route];
                      return (
                        <span
                          key={route}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors.badge} ${colors.border}`}
                        >
                          {route}
                        </span>
                      );
                    })}
                  </div>

                  {record.manual_decision.is_overridden && (
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-lg text-xs text-purple-900 dark:text-purple-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="font-semibold text-[11px]">Manual Override Reason:</strong>
                        <button
                          onClick={handleReset}
                          className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 hover:underline flex items-center space-x-1"
                          title="Reset back to system suggestion"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Reset to Suggestion</span>
                        </button>
                      </div>
                      <p className="text-[11px]">{record.manual_decision.manual_rationale || 'No rationale provided'}</p>
                    </div>
                  )}

                  {record.analysis && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong>System Suggestion:</strong> {record.analysis.suggested_routes.join(', ')} ({record.analysis.route_rationale})
                    </div>
                  )}
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Select Effective Route(s):
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {ROUTE_CATEGORIES.map((category) => {
                        const isSelected = selectedRoutes.includes(category);
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => toggleRouteSelection(category)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition ${
                              isSelected
                                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 border-blue-500 font-bold'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                            }`}
                          >
                            {isSelected ? '✓ ' : ''} {category}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Override Rationale (Required for Audit Trail):
                    </label>
                    <textarea
                      rows={2}
                      value={overrideRationale}
                      onChange={(e) => setOverrideRationale(e.target.value)}
                      placeholder="Explain why this route is being modified..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center space-x-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset to System Suggestion</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Route Override</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Evidence-Based Analysis View */}
            {record.analysis ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Executive Intelligence Analysis
                  </h4>
                </div>

                {/* Summary */}
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-200/80 dark:border-blue-800/60 text-xs">
                  <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">Summary</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{record.analysis.summary}</p>
                </div>

                {/* What Happened & Why It Matters */}
                <div className="space-y-3 text-xs">
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100 block mb-1">What Happened:</strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{record.analysis.what_happened}</p>
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100 block mb-1">Why It Matters:</strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{record.analysis.why_it_matters}</p>
                  </div>
                </div>

                {/* Ground Truth Supporting Evidence */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Ground-Truth Evidence Citation:</span>
                  <blockquote className="p-2 bg-white dark:bg-slate-900 border-l-2 border-blue-500 rounded text-slate-700 dark:text-slate-300 italic text-[11px] leading-relaxed">
                    {record.analysis.key_evidence}
                  </blockquote>
                  <span className="text-[10px] text-blue-700 dark:text-blue-400 font-mono font-medium block">
                    Source Citation: {record.analysis.evidence_citation}
                  </span>
                </div>

                {/* Recommended Next Action & Owner */}
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1 text-xs">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block">Recommended Next Action</span>
                  <p className="text-slate-700 dark:text-slate-300">{record.analysis.recommended_next_action}</p>
                  <div className="pt-1 text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold">
                    Supported Action Owner: <span className="underline">{record.analysis.action_owner}</span>
                  </div>
                </div>

                {/* Uncertainty & Limitations */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200 block text-[11px]">Uncertainties & Boundary Limitations:</strong>
                  <p className="text-[11px] leading-relaxed">{record.analysis.uncertainties}</p>
                </div>
              </div>
            ) : (
              /* Missing Transcript Intake View */
              <div className="p-5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <h5 className="font-bold text-slate-900 dark:text-slate-100">Intake Classification (No Usable Text)</h5>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  In accordance with <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">DATA_CONTRACT.md</code>, no substantive conversation summary was fabricated for records without usable text.
                </p>
                <div className="pt-2 text-[11px] text-slate-500">
                  Intake review state: <code className="font-semibold text-slate-700 dark:text-slate-300">{record.effective_review_state}</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Record Ref: <strong className="text-slate-700 dark:text-slate-300">{record.record_ref}</strong> • Source ID: <span className="font-mono">{record.source_id.slice(0, 8)}...</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
