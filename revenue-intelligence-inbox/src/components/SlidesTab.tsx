'use client';

import React, { useState } from 'react';
import {
  Presentation,
  Download,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  FileText,
} from 'lucide-react';
import pptxgen from 'pptxgenjs';

export const SlidesTab: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const slides = [
    {
      slideNumber: 1,
      title: 'SpendNest Revenue Intelligence Inbox',
      subtitle: 'Executive Operations Workspace & Decision Governance',
      keyTheme: 'Problem Definition & Core Architecture',
      points: [
        'The Sales Manager Dilemma: Managers drown in fragmented records from telephony (OXO dialers), calendars, and audio notetakers. Transcripts arrive late, stored labels disagree with spoken dialogue, and generic summaries miss operational reality.',
        'Core Product Mission: Build a high-trust, desktop-first workspace that answers: What happened? Why does it matter? What is unproven? Who owns the next action?',
        'Authoritative Composite Identity: Rigidly keys interactions by (source_type, source_id). Rejects brittle approximations like company names, array indices, or convenience references.',
        'Independent State Architecture: Cleanly separates pristine raw source payloads from system intelligence, manual manager overrides, and processing states.',
      ],
      speakerNotes:
        'Slide 1 sets the operational problem. Rather than building a passive CRM clone, we designed an active revenue intelligence inbox for a manager who needs to separate sales pipe from vendor procurement, audit softphone seat sharing, and catch critical software defects before churn occurs.',
    },
    {
      slideNumber: 2,
      title: 'Operational Dashboard & Three Core Discoveries',
      subtitle: 'Evidence-Grounded Reporting on 21 August 2026 (Asia/Kolkata)',
      keyTheme: 'Metrics Governance & Analytical Findings',
      points: [
        'Selected Interaction Scope: Evaluates 44 unique logical interactions (30 calls, 14 meetings). Total usable text coverage is 40.9% (18 conversations post-update). All denominators are explicitly defined.',
        'Finding #1 (Speaker Attribution Conflict - C06): Telephony metadata credits rep "Meera", but caller introduces himself as "Ravi". Ground truth audio supersedes dialer tags; triggered softphone seat audit.',
        'Finding #2 (Workaround != Defect Resolution - M07): Customer A demonstrated 4 severe bugs (description mutation, modal amount bleed, attachment failure). Turn 15 affirms: "The workaround does not mean the direct upload issue has been resolved." Flagged P1.',
        'Finding #3 (Vendor Procurement Misclassified as Sales - M02): Stored title "LedgerBridge" appears to be sales pipeline. In reality, SpendNest is procuring LedgerBridge for PEPOL compliance. Routed to Vendor Coordination to protect pipeline metrics.',
      ],
      speakerNotes:
        'Slide 2 highlights our 3 core findings. Each finding is traced directly to an exact spoken sentence or turn reference, and we show exactly which screen, rule, and output path it influenced.',
    },
    {
      slideNumber: 3,
      title: 'Routing Taxonomy & The Difficult Decision',
      subtitle: 'Multi-Destination Governance & Boundary Management',
      keyTheme: 'Taxonomy Design & Strategic Triage',
      points: [
        'Six Purpose-Built Destinations: Sales Coaching, Deal Follow-up, Partnership Opportunity, Customer Success / Support, Internal / Vendor Coordination, and Human Review Required.',
        'Multi-Route Support: A single interaction can legitimately trigger multiple actions (e.g. C09 triggers Deal Follow-up with Mr. Rishabh and Sales Coaching on boundary consent).',
        'The Difficult Decision (Call C10 - Mr. Aniket): Prospect accepted an informational brief on messaging, but when rep Meera pushed for a Monday/Tuesday callback, he firmly replied: "No. I said I will contact you if there is anything to discuss."',
        'Routing Verdict: We deliberately routed C10 to Sales Coaching & Human Review rather than active Deal Follow-up. Calling him back would violate explicit consent and burn brand equity.',
      ],
      speakerNotes:
        'Slide 3 demonstrates our nuanced routing philosophy. In sales operations, not every interaction is a qualified deal. When a prospect explicitly forbids follow-up calls, routing it into an aggressive SDR follow-up queue is a critical mistake.',
    },
    {
      slideNumber: 4,
      title: 'Deterministic Replay & Override Preservation',
      subtitle: 'Data Contract Integrity Across Shuffles, Late Batches, & Restarts',
      keyTheme: 'Data Contract & Replay Verification',
      points: [
        'Replay Verification Checklist: Executed the strict 7-step test sequence from DATA_CONTRACT.md with 100% automated pass assertions.',
        'Idempotent Shuffled Imports: Importing batch 01_initial in randomized order resulted in 0 inserted records and 44 skipped records. Logical count remained strictly 44.',
        'Late Transcript Integration: Batch 02_update (Revision 2) supplied 27 turns for M07. Usable texts increased from 17 to 18 without creating duplicate records.',
        'Full Payload Replacement: A newer revision completely replaces payload and transcript_payload (including nulls), eliminating accidental partial field merges.',
        'Preserved Human Judgment: Explicit manual route overrides on M07 survived update batch arrival, older batch re-import, and browser restart.',
      ],
      speakerNotes:
        'Slide 4 explains the data contract implementation. We demonstrate that our composite key and revision comparison prevent duplicate counting and preserve human overrides even when upstream systems replay older batches.',
    },
    {
      slideNumber: 5,
      title: 'Trade-offs, Rejected Decision, & Roadmap',
      subtitle: 'Methodological Rigor, Honest Limitations, and Future Milestones',
      keyTheme: 'Trade-offs & Technical Reflection',
      points: [
        'Deliberately Rejected Decision: Automated Deal Sizing & ARR Extrapolation. We rejected using AI heuristics to invent deal values or win probabilities from mentions of "120 stores". Missing CRM inputs must not be replaced by guesses.',
        'Accepted Trade-off: Dashboard presents verified interaction volume and concrete commitments rather than speculative dollar pipeline widgets.',
        'Honest Limitations: Absence of authoritative CRM opportunity table, lack of verified staff directory, single-day evaluation window (21 August 2026), and manual review requirement for the 26 non-text records.',
        'Production Roadmap: Live WebRTC softphone stream interception, automated ERP integration health checks, and cross-channel identity graph stitching.',
      ],
      speakerNotes:
        'Slide 5 reflects on our architectural trade-offs. Rejecting phantom deal sizing was an intentional choice to preserve data integrity and executive trust.',
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  // Generate downloadable PPTX using pptxgenjs
  const handleDownloadPptx = async () => {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    slides.forEach((s) => {
      const slide = pptx.addSlide();
      slide.background = { color: '0F172A' }; // Dark navy

      // Header Brand
      slide.addText('SPENDNEST REVENUE INTELLIGENCE INBOX', {
        x: 0.8,
        y: 0.5,
        fontSize: 10,
        fontFace: 'Segoe UI',
        color: '38BDF8',
        bold: true,
      });

      // Title & Subtitle
      slide.addText(s.title, {
        x: 0.8,
        y: 0.8,
        w: 11.5,
        fontSize: 22,
        fontFace: 'Segoe UI',
        color: 'FFFFFF',
        bold: true,
      });

      slide.addText(s.subtitle, {
        x: 0.8,
        y: 1.35,
        w: 11.5,
        fontSize: 13,
        fontFace: 'Segoe UI',
        color: '94A3B8',
      });

      // Content Box
      let yOffset = 2.1;
      s.points.forEach((p, idx) => {
        const parts = p.split(': ');
        const boldTitle = parts[0] + ': ';
        const bodyText = parts.slice(1).join(': ');

        slide.addText(
          [
            { text: `• ${boldTitle}`, options: { bold: true, color: '38BDF8' } },
            { text: bodyText, options: { bold: false, color: 'E2E8F0' } },
          ],
          {
            x: 0.8,
            y: yOffset,
            w: 11.5,
            fontSize: 11,
            fontFace: 'Segoe UI',
            lineSpacingMultiple: 1.2,
          }
        );
        yOffset += 0.95;
      });

      // Speaker Notes
      slide.addNotes(s.speakerNotes);

      // Slide Footer
      slide.addText(`Slide ${s.slideNumber} of 5 | 21 August 2026 (Asia/Kolkata)`, {
        x: 0.8,
        y: 6.8,
        fontSize: 9,
        color: '64748B',
      });
    });

    await pptx.writeFile({ fileName: 'SpendNest_Revenue_Intelligence_5_Slides.pptx' });
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Presentation className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Executive Five-Slide Presentation Deck
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exact five slides addressing product overview, findings with citations, routing decisions, replay integrity, and trade-offs.
          </p>
        </div>

        <button
          onClick={handleDownloadPptx}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Download PPTX File</span>
        </button>
      </div>

      {/* Slide Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {slides.map((s, idx) => (
            <button
              key={s.slideNumber}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentSlideIndex === idx
                  ? 'bg-slate-900 text-white dark:bg-blue-500 dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Slide {s.slideNumber}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
            disabled={currentSlideIndex === 0}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          <button
            onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Slide Preview Canvas (16:9 Presentation Aspect Ratio) */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative min-h-[460px] flex flex-col justify-between overflow-hidden">
        {/* Subtle Decorative Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Slide Top Label */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">
              SpendNest Revenue Intelligence • Slide {currentSlide.slideNumber} of 5
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {currentSlide.keyTheme}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {currentSlide.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{currentSlide.subtitle}</p>
          </div>

          {/* Slide Points Grid */}
          <div className="space-y-3 pt-2">
            {currentSlide.points.map((pt, i) => {
              const parts = pt.split(': ');
              const heading = parts[0];
              const desc = parts.slice(1).join(': ');
              return (
                <div
                  key={i}
                  className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300 leading-relaxed space-y-0.5"
                >
                  <strong className="text-blue-300 block font-semibold">{heading}:</strong>
                  <span>{desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slide Bottom Bar */}
        <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Reporting Window: 21 August 2026 (Asia/Kolkata)</span>
          <span>44 Logical Interactions • Ground Truth Synthesis</span>
        </div>
      </div>

      {/* Speaker Notes Box */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          <FileText className="h-4 w-4 text-blue-600" />
          <span>Slide {currentSlide.slideNumber} Executive Narration & Speaker Notes</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          &quot;{currentSlide.speakerNotes}&quot;
        </p>
      </div>
    </div>
  );
};
