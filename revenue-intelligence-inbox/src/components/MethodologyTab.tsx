'use client';

import React from 'react';
import {
  METRIC_DEFINITIONS,
  THREE_KEY_FINDINGS,
  REJECTED_DECISION,
} from '@/lib/intelligenceData';
import {
  BookOpen,
  Sparkles,
  AlertTriangle,
  Scale,
  Clock,
  ShieldCheck,
  Code2,
  FileText,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const MethodologyTab: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 text-cyan-600 mb-1">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Architecture, Methodology & Governance Documentation
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Complete disclosure of analytical decisions, metric denominators, data replay contract, hours spent, and limitations.
        </p>
      </div>

      {/* Three Key Findings Section */}
      <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Three Core Analytical Discoveries
          </h3>
        </div>

        <div className="space-y-4">
          {THREE_KEY_FINDINGS.map((finding) => (
            <div
              key={finding.findingNumber}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Finding #{finding.findingNumber}
                  </span>
                  <span>{finding.title}</span>
                </span>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-cyan-800 dark:text-cyan-300 italic">
                Citation: {finding.citation}
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                <strong className="text-slate-800 dark:text-slate-200">Contrast with Stored Metadata:</strong> {finding.contrast}
              </p>

              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                <strong className="text-slate-800 dark:text-slate-200">Analytical Significance:</strong> {finding.significance}
              </p>

              <div className="pt-1.5 text-[11px] text-cyan-700 dark:text-cyan-400 font-medium">
                <strong>Product Influence:</strong> {finding.productImpact}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deliberately Rejected Decision */}
      <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Scale className="h-4 w-4 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Deliberately Rejected Decision & Trade-off
          </h3>
        </div>

        <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800/80 space-y-2">
          <h4 className="font-bold text-purple-950 dark:text-purple-200 text-xs">
            Rejected: {REJECTED_DECISION.decision}
          </h4>
          <p>
            <strong>Alternative Considered:</strong> {REJECTED_DECISION.alternativeConsidered}
          </p>
          <p>
            <strong>Why Rejected:</strong> {REJECTED_DECISION.whyRejected}
          </p>
          <p>
            <strong>Accepted Trade-off:</strong> {REJECTED_DECISION.acceptedTradeOff}
          </p>
          <div className="pt-1 font-semibold text-purple-900 dark:text-purple-300">
            <strong>Resulting Product Choice:</strong> {REJECTED_DECISION.resultingProductChoice}
          </div>
        </div>
      </section>

      {/* Pre-Generated vs Dynamic Runtime Operations */}
      <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Code2 className="h-4 w-4 text-cyan-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Pre-Generated vs Dynamic Runtime Operations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">Pre-Generated Assets</h4>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
              <li>Detailed qualitative analyses of all 18 adapted conversations (summaries, turn/quote citations, action owners, uncertainties).</li>
              <li>Baseline intake rules for 20 background voicemails and 6 non-text meetings.</li>
              <li>Daily Manager Brief text for 21 August 2026.</li>
              <li>Pre-configured 5-slide presentation narrative and speaker notes.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">Dynamic Runtime Operations</h4>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
              <li>Composite key deduplication <code>(source_type, source_id)</code> ensuring 44 logical records.</li>
              <li>Deterministic revision ordering (Revision 2 replacing M07; Revision 1 ignored on re-import).</li>
              <li>Manual routing override preservation and effective route computation.</li>
              <li>Live interactive search, multi-column filtering, sorting, and Recharts graph aggregation.</li>
              <li>On-the-fly ZIP generation and physical export manifest validation.</li>
              <li>Editable PPTX PowerPoint generation via <code>pptxgenjs</code>.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hours Spent & Known Limitations */}
      <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Clock className="h-4 w-4 text-cyan-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Hours Spent & Methodological Limitations
          </h3>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs space-y-1">
            <strong className="text-slate-900 dark:text-white">Approximate Hours Spent:</strong>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              <strong>~7.5 hours</strong> total (Phase 1 Analysis: 1.5h, Phase 2 Data Contract & Replay Engine: 1.5h, Phase 3 Interface & Detail View: 2.0h, Phase 4 Qualitative Synthesis: 1.0h, Phase 5 Export & Slides: 1.5h).
            </p>
          </div>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/60 text-xs space-y-1 text-amber-950 dark:text-amber-200">
            <strong className="block">Known Limitations & Boundaries:</strong>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li><strong>No Verified CRM Opportunities:</strong> No historical pipeline table is provided; deal value sums cannot be computed without guessing.</li>
              <li><strong>Single Local Day:</strong> All activity belongs to 21 August 2026 Asia/Kolkata; time-series trends over weeks cannot be established from this extract.</li>
              <li><strong>Organizer Attributions:</strong> Meeting organizers are calendar coordinators and not confirmed sales reps or attendees.</li>
              <li><strong>26 Non-Text Records:</strong> The 20 background calls and 6 unrecorded meetings are preserved with intake states; no artificial summaries were manufactured.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
