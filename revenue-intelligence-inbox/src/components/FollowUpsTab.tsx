'use client';

import React, { useState } from 'react';
import { UnifiedRecord } from '@/types/intelligence';
import {
  CheckSquare,
  AlertCircle,
  Clock,
  User,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface FollowUpsTabProps {
  records: UnifiedRecord[];
  onOpenRecord: (record: UnifiedRecord) => void;
}

interface ActionItem {
  id: string;
  recordRef: string;
  priority: 'P1 - Urgent' | 'P2 - High' | 'P3 - Standard';
  action: string;
  owner: string;
  context: string;
  citation: string;
  dueDate: string;
}

export const FollowUpsTab: React.FC<FollowUpsTabProps> = ({
  records,
  onOpenRecord,
}) => {
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Static action items list derived directly from conversation analysis
  const actionItems: ActionItem[] = [
    {
      id: 'act-m07-1',
      recordRef: 'M07',
      priority: 'P1 - Urgent',
      action: 'File P1 engineering defect tickets for payment modal amount leakage (INR 18,200) and description persistence failure.',
      owner: 'Engineering / CS Lead',
      context: 'Willowfield Trust: Customer screen share exposed 4 severe software bugs.',
      citation: 'M07 Turn 15: "The workaround does not mean the direct upload issue has been resolved."',
      dueDate: 'Today (Within 2h)',
    },
    {
      id: 'act-m07-2',
      recordRef: 'M07',
      priority: 'P1 - Urgent',
      action: 'Provide Customer A status update on stuck reimbursements locked in "Processing" state.',
      owner: 'CS Lead (Team member A)',
      context: 'Willowfield Trust: Transactions locked in processing, blocking disbursement.',
      citation: 'M07 Turn 19: "The payments appear to have been released but are stuck showing Processing."',
      dueDate: 'Today (Within 2h)',
    },
    {
      id: 'act-c07-1',
      recordRef: 'C07',
      priority: 'P2 - High',
      action: 'Message digital business account proposal on chat to Mr. Aditya; calendar follow-up call for Monday morning.',
      owner: 'Dev (caller)',
      context: 'Willowbank Advisory: Confirmed active referral of newly incorporated entities for digital accounts.',
      citation: 'C07: "could you message me on our chat app and send whatever proposal you have?"',
      dueDate: 'Monday Morning',
    },
    {
      id: 'act-m01-1',
      recordRef: 'M01',
      priority: 'P2 - High',
      action: 'Send partner onboarding documentation and US corporate entity eligibility criteria to Partner A.',
      owner: 'Team member A (Partnerships)',
      context: 'Harborpath Advisory: Remote account opening for cross-border registered entities.',
      citation: 'M01 Turn 2: "Yes, with one important boundary: we work with registered businesses, not individuals opening personal accounts."',
      dueDate: '24 Hours',
    },
    {
      id: 'act-m03-1',
      recordRef: 'M03',
      priority: 'P2 - High',
      action: 'Deliver customized enterprise pricing proposal and executive ROI one-pager formatted for CFO presentation.',
      owner: 'Team member A (AE)',
      context: 'Asterloom Systems: Walkthrough complete; gating step is CFO pricing justification.',
      citation: 'M03 Turn 36: "Send the details first. We need time with the CFO and will tell you if another call is needed."',
      dueDate: 'Monday',
    },
    {
      id: 'act-c03-1',
      recordRef: 'C03',
      priority: 'P2 - High',
      action: 'Send email proposal with subject "Developer access and event notifications — follow-up" and follow up Monday/Tuesday.',
      owner: 'Kiran (caller)',
      context: 'Milan API Access: Prospect travelling; requested budget-friendly developer tier options.',
      citation: 'C03: "Send the email and we can speak Monday or Tuesday."',
      dueDate: 'Monday',
    },
    {
      id: 'act-m04-1',
      recordRef: 'M04',
      priority: 'P2 - High',
      action: 'Finalize physical card network migration schedule and send transition checklist to Customer A.',
      owner: 'CS Team (Team member A)',
      context: 'Cedarwave Distribution: Physical card terminal failures require network migration.',
      citation: 'M04 Turn 2: "We have seen acceptance problems with the existing programme and are proposing a move to a different provider and card network."',
      dueDate: 'Tuesday',
    },
    {
      id: 'act-m09-1',
      recordRef: 'M09',
      priority: 'P2 - High',
      action: 'Issue fresh manual invitation link for Brookmint Holdings; trigger diagnostic sync on Northkite accounting integration.',
      owner: 'CS Team (Team member A)',
      context: 'Brookmint / Northkite: Expired workspace invitation token and accounting receipt sync glitch.',
      citation: 'M09 Turn 1: "The invitation for Brookmint Holdings did not work when I tried it."',
      dueDate: 'Today',
    },
    {
      id: 'act-c08-1',
      recordRef: 'C08',
      priority: 'P2 - High',
      action: 'Send expense management proposal to contact08@example.com referencing Mr. Raghav\'s introduction.',
      owner: 'Meera (caller)',
      context: 'Raghav Referral: People operations lead exploring store expense solutions.',
      citation: 'C08: "The colleague handling our people operations also deals with frontline processes"',
      dueDate: '2 Business Days',
    },
    {
      id: 'act-c06-1',
      recordRef: 'C06',
      priority: 'P3 - Standard',
      action: 'Conduct softphone seat audit to reconcile telephony attribution between Meera and Ravi.',
      owner: 'Sales Operations Manager',
      context: 'C06 Telephony Discrepancy: Rep attribution contradicts speaker introduction.',
      citation: 'C06: "Good evening, Mr Nikhil. Good evening. Ravi here. I\'ll say at the start that this is a cold call."',
      dueDate: 'Next Cadence',
    },
    {
      id: 'act-c10-1',
      recordRef: 'C10',
      priority: 'P3 - Standard',
      action: 'Deliver sales coaching on boundary adherence: do NOT dial Mr. Aniket on Monday/Tuesday after explicit refusal.',
      owner: 'SDR Team Lead',
      context: 'Mr. Aniket (former Meadowbrick): Accepted written brief but forbade callbacks.',
      citation: 'C10: "No. I said I will contact you if there is anything to discuss."',
      dueDate: 'Team 1:1',
    },
    {
      id: 'act-c09-1',
      recordRef: 'C09',
      priority: 'P3 - Standard',
      action: 'Ensure outbound outreach to business head Mr. Rishabh DOES NOT reference contact Vedant.',
      owner: 'Meera (caller)',
      context: 'Multi-store Chain: Prospect Vedant specifically stated "No, please don\'t use my name."',
      citation: 'C09: "No, please don\'t use my name."',
      dueDate: 'Pre-outreach',
    },
    {
      id: 'act-m02-1',
      recordRef: 'M02',
      priority: 'P3 - Standard',
      action: 'Review LedgerBridge e-invoicing API integration template with Product & Engineering compliance leads.',
      owner: 'Strategy Lead / Product',
      context: 'LedgerBridge Procurement: Compliant e-invoicing vendor evaluation for accounts receivable.',
      citation: 'M02 Turn 1: "We want to understand whether LedgerBridge can give us compliant invoicing coverage across our operating markets."',
      dueDate: 'End of Week',
    },
  ];

  const toggleComplete = (id: string) => {
    const next = new Set(completedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompletedIds(next);
  };

  const filteredItems = actionItems.filter((item) => {
    if (ownerFilter !== 'ALL' && !item.owner.includes(ownerFilter)) return false;
    if (priorityFilter !== 'ALL' && !item.priority.includes(priorityFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Actionable Follow-ups & Operational Commitments
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritized operational, commercial, and technical follow-ups grounded in conversation evidence.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-500">Progress:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {completedIds.size} / {actionItems.length} Resolved
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium">
          <Filter className="h-3.5 w-3.5 text-cyan-600" />
          <span>Filter Action Queue:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Priorities</option>
            <option value="P1">P1 - Urgent (Defects)</option>
            <option value="P2">P2 - High (Commercial)</option>
            <option value="P3">P3 - Standard (Governance)</option>
          </select>

          {/* Owner */}
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Action Owners</option>
            <option value="Engineering">Engineering / Product</option>
            <option value="CS">Customer Success Lead</option>
            <option value="Dev">Dev (Partnerships)</option>
            <option value="Kiran">Kiran (API Deals)</option>
            <option value="Meera">Meera (Retail Outbound)</option>
            <option value="Sales Operations">Sales Operations</option>
            <option value="SDR Team Lead">SDR Team Lead</option>
          </select>

          {(priorityFilter !== 'ALL' || ownerFilter !== 'ALL') && (
            <button
              onClick={() => {
                setPriorityFilter('ALL');
                setOwnerFilter('ALL');
              }}
              className="text-cyan-600 hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isDone = completedIds.has(item.id);
          const isP1 = item.priority.startsWith('P1');
          const isP2 = item.priority.startsWith('P2');
          const rec = records.find((r) => r.record_ref === item.recordRef);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition ${
                isDone
                  ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : isP1
                  ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/80'
                  : isP2
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : 'bg-slate-50/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className="mt-0.5 text-slate-400 hover:text-cyan-600 transition"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <div className="h-5 w-5 rounded border-2 border-slate-300 dark:border-slate-600 hover:border-cyan-500" />
                    )}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isP1
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : isP2
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {item.priority}
                      </span>

                      <span className="font-bold text-xs font-mono text-slate-800 dark:text-slate-200">
                        {item.recordRef}
                      </span>

                      <span className="text-[11px] text-slate-400">•</span>

                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {item.context}
                      </span>
                    </div>

                    <p className={`text-xs font-semibold leading-relaxed ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {item.action}
                    </p>

                    <div className="bg-slate-100 dark:bg-slate-800/80 p-2 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 italic border-l-2 border-cyan-500">
                      Citation: {item.citation}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-slate-400" />
                        <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{item.owner}</strong></span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>Timeline: <strong className="text-slate-700 dark:text-slate-300">{item.dueDate}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {rec && (
                  <button
                    onClick={() => onOpenRecord(rec)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center space-x-1 transition self-start"
                    title="Inspect Source Record"
                  >
                    <span className="hidden sm:inline">Inspect Record</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
