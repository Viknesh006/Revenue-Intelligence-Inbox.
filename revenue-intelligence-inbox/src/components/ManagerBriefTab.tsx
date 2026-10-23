'use client';

import React from 'react';
import { UnifiedRecord } from '@/types/intelligence';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import saveAs from 'file-saver';

interface ManagerBriefTabProps {
  records: UnifiedRecord[];
  onOpenRecord: (record: UnifiedRecord) => void;
}

export const ManagerBriefTab: React.FC<ManagerBriefTabProps> = ({
  records,
  onOpenRecord,
}) => {
  const openByRef = (ref: string) => {
    const rec = records.find((r) => r.record_ref === ref);
    if (rec) onOpenRecord(rec);
  };

  const downloadBriefMarkdown = () => {
    const briefText = `# SpendNest Manager Daily Brief — 21 August 2026 (Asia/Kolkata)
**Reporting Date**: 2026-08-21 | **Export Date**: 2026-08-22
**Context**: SpendNest Revenue Operations & Interaction Intelligence

## 1. Daily Activity Overview
Across 21 August 2026, SpendNest logged 44 unique interactions comprising 30 telephone calls and 14 calendar meetings. All records belong strictly to 21 August 2026 in Asia/Kolkata.

## 2. Interaction Counts & Channel Volume
- Total Unique Records: 44
- Phone Calls: 30 (10 with adapted dialogue, 20 background voicemails/unresponsive)
- Calendar Meetings: 14 (8 with usable transcript turns, 3 zero-speech recordings, 2 bot cancellations, 1 unscheduled)

## 3. Transcript Coverage & Operational Boundaries
- Usable Transcript Coverage: 18 / 44 (40.9%)
- Denominator Notice: Derived over the selected assessment batch. Not an exhaustive measure of company-wide performance.

## 4. Key Commercial Conversations
- C07 (Dev): High-potential channel partnership with Willowbank Advisory.
- M01 (Team member A): Inbound advisory referral model with Harborpath Advisory.
- M03 (AE): Late-stage mid-market demo with Asterloom Systems; gating step is CFO pricing justification.
- C03 (Kiran): Developer API access evaluation; prospect requested budget tier options.
- C08 (Meera): Warm internal referral to frontline People Operations lead.

## 5. Critical Product & Customer Health Defects
- M07 (Willowfield Trust - Revision 2): 4 severe bugs demonstrated (description persistence failure, modal amount bleed, attachment path defect, reimbursement lockup). Turn 15 affirms that workarounds do NOT equal defect resolution.
- M04 (Cedarwave Distribution): Physical card point-of-sale terminal acceptance failures requiring issuer migration.
- M09 (Brookmint / Northkite): Expired workspace invite token and receipt sync failure.

## 6. Practical Sales Coaching Points
- C10 & C09 (Meera): Respecting explicit prospect boundaries. In C10, rep pushed for callback after prospect agreed to brief, prompting refusal. In C09, prospect Vedant forbade using his name.
- C06: Telephony user attribution discrepancy (Meera credited, Ravi spoke).
- C05: Competitive positioning against StoreHarbor incumbent.

## 7. Priority Follow-up Actions
1. P1: File P1 engineering defect tickets for payment modal amount leakage and description failure (M07).
2. P1: Update Customer A on stuck reimbursements within 2 hours (M07).
3. P2: Message partnership proposal to Mr. Aditya; calendar Monday follow-up (C07).
4. P2: Deliver CFO pricing proposal with ERP integration ROI model (M03).
5. P2: Email developer API pricing tiers with subject line agreed (C03).

## 8. Governance & Review Protocol
All 26 unsupplied interactions retain intact review states without fabricated summaries.
`;
    const blob = new Blob([briefText], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, 'SpendNest_Manager_Brief_2026-08-21.md');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="h-4 w-4" />
            <span>21 August 2026 • Asia/Kolkata</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Executive Daily Manager Brief
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded synthesis of 44 customer interactions, commercial signals, defects, and coaching observations.
          </p>
        </div>

        <button
          onClick={downloadBriefMarkdown}
          className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Download Markdown</span>
        </button>
      </div>

      {/* Main Brief Document Body */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 text-xs text-slate-700 leading-relaxed">
        {/* Section 1: Daily Activity Overview */}
        <section className="space-y-2">
          <div className="flex items-center space-x-2 pb-1 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              1. Daily Sales & Customer Interaction Overview
            </span>
          </div>
          <p>
            Across <strong>21 August 2026 (Asia/Kolkata)</strong>, SpendNest logged <strong>44 distinct customer, market, and internal interactions</strong>, consisting of 30 telephone calls and 14 calendar meetings. Outbound SDR calling focused on mid-market accounts and accounting firms, while scheduled meetings handled enterprise walkthroughs, vendor compliance procurement, and critical retention reviews.
          </p>
        </section>

        {/* Section 2: Call and Meeting Counts */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 pb-1 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              2. Interaction Volumes & Team Activity Breakdown
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Total Selected</span>
              <span className="text-xl font-bold text-slate-900">44 Records</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Phone Calls</span>
              <span className="text-xl font-bold text-blue-600">30 Dials</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Meetings</span>
              <span className="text-xl font-bold text-indigo-600">14 Sessions</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Coverage</span>
              <span className="text-xl font-bold text-emerald-600">18 Transcripts</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            <em>Representative Distribution</em>: Rep <strong>Arun</strong> handled 12 calls + 3 analyzed calls (C01, C02, C04); <strong>Leela</strong> logged 8 background calls; <strong>Meera</strong> conducted 5 calls (C05, C06, C08, C09, C10); <strong>Dev</strong> handled 1 partnership call (C07); <strong>Kiran</strong> executed 1 technical API follow-up (C03). Meeting organizers spanned strategy (M02), sales demos (M03), support (M04, M07), and operations (M10).
          </p>
        </section>

        {/* Section 3: Transcript Coverage & Data Limitations */}
        <section className="space-y-2">
          <div className="flex items-center space-x-2 pb-1 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              3. Transcript Coverage & Methodological Boundaries
            </span>
          </div>
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] space-y-1 text-blue-900">
            <p>
              <strong>Data Boundary:</strong> This dataset represents a selected assessment sample. Missing transcripts do NOT imply no interaction occurred, but in accordance with governance guidelines, no analytical summaries were fabricated for unsupplied records.
            </p>
            <p>
              <strong>Late Transcript M07:</strong> Meeting M07 initially arrived without dialogue (Revision 1) and was updated in Revision 2 with 27 turns, increasing qualitative coverage from 17 to 18 conversations.
            </p>
          </div>
        </section>

        {/* Section 4: Most Important Conversations */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 pb-1 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              4. Key Conversations & Commercial Significance
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold font-mono text-blue-600">C07</span>
                  <span className="font-semibold text-slate-900">Willowbank Advisory Referral Channel</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Mr. Aditya confirmed active referrals for digital business accounts after company incorporation. Agreed to review proposal on messaging app with Monday follow-up.
                </p>
              </div>
              <button
                onClick={() => openByRef('C07')}
                className="text-xs text-blue-600 hover:underline flex items-center space-x-0.5 flex-shrink-0 ml-2"
              >
                <span>Inspect C07</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold font-mono text-blue-600">M03</span>
                  <span className="font-semibold text-slate-900">Asterloom Systems Enterprise Demo</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Walkthrough of corporate cards, ERP sync, and approvals with Customer A and Finance lead Customer B. Gating factor is economic justification with their CFO.
                </p>
              </div>
              <button
                onClick={() => openByRef('M03')}
                className="text-xs text-blue-600 hover:underline flex items-center space-x-0.5 flex-shrink-0 ml-2"
              >
                <span>Inspect M03</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold font-mono text-blue-600">C03</span>
                  <span className="font-semibold text-slate-900">Milan Developer API Access Pricing</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Prospect stated API functionality is not essential enough for high spend. Agreed to receive tailored proposal with agreed subject line for Monday/Tuesday discussion.
                </p>
              </div>
              <button
                onClick={() => openByRef('C03')}
                className="text-xs text-blue-600 hover:underline flex items-center space-x-0.5 flex-shrink-0 ml-2"
              >
                <span>Inspect C03</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </section>

        {/* Section 5: Significant Customer or Product Issues */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 pb-1 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wider text-rose-600">
              5. Significant Product & Customer Quality Defects
            </span>
          </div>

          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-900 flex items-center space-x-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>M07 (Willowfield Trust): 4 Severe Application Defects</span>
              </span>
              <button
                onClick={() => openByRef('M07')}
                className="text-xs font-semibold text-rose-700 hover:underline flex items-center space-x-0.5"
              >
                <span>Inspect M07</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <ul className="list-disc pl-5 text-[11px] text-rose-950 space-y-1">
              <li><strong>Description Persistence Bug:</strong> Edits to event payment descriptions do not save upon clicking Save changes.</li>
              <li><strong>Attachment Failure in Recreate Payment:</strong> Document upload fails via direct recreation (workaround: Invoice Inbox Review).</li>
              <li><strong>Reimbursement Lockup:</strong> Batched payments stuck in &quot;Processing&quot; cannot be selected.</li>
              <li><strong>Modal State Amount Leakage:</strong> Cash disbursement modal retains previous amount (INR 18,200) instead of fetching next item value.</li>
            </ul>
            <div className="text-[11px] text-rose-800 pt-1 font-semibold">
              Crucial Principle (Turn 15): <em>&quot;The workaround does not mean the direct upload issue has been resolved.&quot;</em>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-blue-600">M04: Cedarwave</span>
                <button onClick={() => openByRef('M04')} className="text-blue-600 hover:underline text-[11px]">Inspect</button>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Physical card merchant terminal rejections disrupting distribution operations. Programme migration to alternate network required.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-blue-600">M09: Brookmint / Northkite</span>
                <button onClick={() => openByRef('M09')} className="text-blue-600 hover:underline text-[11px]">Inspect</button>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Customer onboarding blocked by expired workspace invite token, plus receipt ledger sync failure in multi-entity setup.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Sales Coaching Observations */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 pb-1 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              6. Sales Coaching Observations
            </span>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 text-[11px] space-y-1">
              <strong className="text-amber-900 block">
                1. Respecting Prospect Boundaries & Refusals (C10 & C09)
              </strong>
              <p className="text-slate-700">
                In <strong>C10</strong>, contact Aniket agreed to read a messaging brief, but when rep Meera pushed for a callback, he rebuffed: <em>&quot;No. I said I will contact you if there is anything to discuss.&quot;</em> In <strong>C09</strong>, contact Vedant gave an executive referral but explicitly warned: <em>&quot;No, please don&apos;t use my name.&quot;</em> Reps must honor boundaries.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/50 text-[11px] space-y-1">
              <strong className="text-purple-900 block">
                2. Telephony Credential Attribution (C06)
              </strong>
              <p className="text-slate-700">
                In <strong>C06</strong>, telephony records credited Meera, but the audio starts: <em>&quot;Good evening, Mr Nikhil. Good evening. Ravi here.&quot;</em> Sales Ops must audit dialer logins.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Vendor & Internal Operations */}
        <section className="space-y-2">
          <div className="flex items-center space-x-2 pb-1 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              7. Vendor Procurement & Operational Coordination
            </span>
          </div>
          <p className="text-[11px]">
            <strong>M02 (LedgerBridge)</strong> is an inbound compliance vendor evaluation (PEPPOL e-invoicing). Strictly separate this from sales pipeline to prevent false revenue inflation. <strong>M10</strong> was an internal staff enablement session on back-office credit limits.
          </p>
        </section>

        {/* Section 8: Priority Follow-up Actions Table */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 pb-1 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              8. Priority Follow-up Action Items
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border border-slate-200 rounded-lg">
              <thead className="bg-slate-50 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2 px-3">Priority</th>
                  <th className="py-2 px-3">Owner</th>
                  <th className="py-2 px-4">Action Item</th>
                  <th className="py-2 px-3">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3 font-bold text-rose-600">P1 - Urgent</td>
                  <td className="py-2 px-3">Engineering / CS</td>
                  <td className="py-2 px-4">Deploy hotfix for modal amount leakage & description mutation</td>
                  <td className="py-2 px-3">Willowfield Trust (M07)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-rose-600">P1 - Urgent</td>
                  <td className="py-2 px-3">CS Lead</td>
                  <td className="py-2 px-4">Update Customer A on stuck reimbursements within 2 hours</td>
                  <td className="py-2 px-3">Willowfield Trust (M07)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-blue-600">P2 - High</td>
                  <td className="py-2 px-3">Dev (Caller)</td>
                  <td className="py-2 px-4">Send digital account proposal via chat; follow up Monday</td>
                  <td className="py-2 px-3">Willowbank Advisory (C07)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-blue-600">P2 - High</td>
                  <td className="py-2 px-3">AE (Team member A)</td>
                  <td className="py-2 px-4">Send tailored CFO pricing proposal with ERP ROI model</td>
                  <td className="py-2 px-3">Asterloom Systems (M03)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-blue-600">P2 - High</td>
                  <td className="py-2 px-3">Kiran (Caller)</td>
                  <td className="py-2 px-4">Email developer API pricing with agreed subject line</td>
                  <td className="py-2 px-3">Milan (C03)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 9: Items Requiring Human Review */}
        <section className="space-y-2">
          <div className="flex items-center space-x-2 pb-1 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              9. Governance & Review Protocol
            </span>
          </div>
          <p className="text-[11px]">
            All 26 non-text records (20 background voicemails, 3 zero-speech meetings, 2 bot cancellations, 1 unscheduled) have completed intake review. The C06 caller attribution discrepancy has been queued for administrative softphone audit.
          </p>
        </section>

        {/* Section 10: Methodology Explanation */}
        <section className="space-y-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
          <p>
            <strong>Analytical Methodology:</strong> All findings are strictly grounded in exact quotations or 1-based meeting turn references from the adapted SpendNest corpus. Speculative deal valuations, automated revenue extrapolations, and unsubstantiated account links were deliberately rejected to preserve governance integrity.
          </p>
        </section>
      </div>
    </div>
  );
};
