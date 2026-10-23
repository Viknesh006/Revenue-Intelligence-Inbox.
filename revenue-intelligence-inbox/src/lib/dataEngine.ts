import {
  UnifiedRecord,
  RawRecord,
  ImportBatchFile,
  BatchImportResult,
  RouteCategory,
  ReviewState,
  CallPayload,
  MeetingPayload,
  MeetingTranscriptPayload,
} from '@/types/intelligence';
import { CONVERSATION_ANALYSES, INTAKE_RULES_BY_REF } from './intelligenceData';

import initialBatchData from '@/data/01_initial.json';
import updateBatchData from '@/data/02_update.json';

const STORAGE_KEY_RECORDS = 'spendnest_revenue_inbox_records_v1';
const STORAGE_KEY_HISTORY = 'spendnest_revenue_inbox_history_v1';

export function makeCompositeKey(source_type: string, source_id: string): string {
  return `${source_type}:::${source_id}`;
}

export function parseKolkataDate(isoTimestamp: string): string {
  try {
    const d = new Date(isoTimestamp);
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  } catch {
    return '2026-08-21';
  }
}

export function parseKolkataTime(isoTimestamp: string): string {
  try {
    const d = new Date(isoTimestamp);
    return d.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'N/A';
  }
}

export function buildUnifiedRecord(
  raw: RawRecord,
  appliedRevision: number,
  existingRecord?: UnifiedRecord
): UnifiedRecord {
  const isCall = raw.source_type === 'call';
  const callPayload = isCall ? (raw.payload as CallPayload) : null;
  const meetingPayload = !isCall ? (raw.payload as MeetingPayload) : null;

  const timestamp = isCall ? callPayload!.started_at : meetingPayload!.starts_at;
  const local_date = parseKolkataDate(timestamp);

  let has_usable_text = false;
  if (isCall) {
    has_usable_text = Boolean(callPayload?.transcript && callPayload.transcript.trim().length > 0);
  } else {
    has_usable_text = Boolean(raw.transcript_payload?.turns && raw.transcript_payload.turns.length > 0);
  }

  let person_name = 'Unassigned';
  let person_role_type: 'call_rep' | 'meeting_organizer' | 'unassigned' = 'unassigned';

  if (isCall) {
    person_name = callPayload?.rep_name || callPayload?.rep_email || 'Unknown Rep';
    person_role_type = 'call_rep';
  } else {
    person_name = meetingPayload?.organizer_email || 'Unknown Organizer';
    person_role_type = 'meeting_organizer';
  }

  const title_or_outcome = isCall
    ? (callPayload?.observed_outcome || (callPayload?.is_connected ? 'Connected' : 'Not Connected'))
    : (meetingPayload?.title || meetingPayload?.recording_status || 'Meeting');

  // Analysis lookup
  const analysis = CONVERSATION_ANALYSES[raw.source_id] || undefined;

  // Intake / Review State defaults
  const ref = raw.record_ref || '';
  const intakeRule = INTAKE_RULES_BY_REF[ref];

  let defaultReviewState: ReviewState = 'intake_completed';
  let defaultSuggestedRoutes: RouteCategory[] = ['Human Review Required'];

  if (analysis) {
    defaultReviewState = 'reviewed';
    defaultSuggestedRoutes = [...analysis.suggested_routes];
  } else if (intakeRule) {
    defaultReviewState = intakeRule.review_state;
    defaultSuggestedRoutes = [...intakeRule.suggested_routes];
  }

  // Preserve existing manual decision if present!
  const manual_decision = existingRecord?.manual_decision || {
    is_overridden: false,
    review_state: defaultReviewState,
    history: [],
  };

  const effective_routes = manual_decision.is_overridden && manual_decision.manual_route
    ? manual_decision.manual_route
    : defaultSuggestedRoutes;

  const effective_review_state = manual_decision.is_overridden
    ? manual_decision.review_state
    : defaultReviewState;

  const discrepancy_flag = analysis?.discrepancy_note || (ref === 'C06' ? 'Speaker identity differs from telephony rep' : undefined);

  return {
    source_type: raw.source_type,
    source_id: raw.source_id,
    record_ref: raw.record_ref,
    applied_source_revision: appliedRevision,
    payload: raw.payload,
    transcript_payload: raw.transcript_payload,
    analysis,
    manual_decision,
    has_usable_text,
    local_date,
    person_name,
    person_role_type,
    title_or_outcome,
    effective_routes,
    effective_review_state,
    discrepancy_flag,
  };
}

export class RevenueDataEngine {
  private records: Map<string, UnifiedRecord> = new Map();
  private history: BatchImportResult[] = [];

  constructor() {
    this.loadFromStorage();
    if (this.records.size === 0) {
      // Default to loading initial batch first
      this.importBatchObject(initialBatchData as unknown as ImportBatchFile);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      const recordsArray = Array.from(this.records.values());
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(recordsArray));
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.history));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const storedRecords = localStorage.getItem(STORAGE_KEY_RECORDS);
      const storedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);

      if (storedRecords) {
        const parsed: UnifiedRecord[] = JSON.parse(storedRecords);
        this.records.clear();
        for (const r of parsed) {
          this.records.set(makeCompositeKey(r.source_type, r.source_id), r);
        }
      }

      if (storedHistory) {
        this.history = JSON.parse(storedHistory);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  }

  public resetAll(andLoadInitial = true) {
    this.records.clear();
    this.history = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_RECORDS);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    }
    if (andLoadInitial) {
      this.importBatchObject(initialBatchData as unknown as ImportBatchFile);
    }
  }

  public getRecords(): UnifiedRecord[] {
    return Array.from(this.records.values());
  }

  public getRecord(source_type: string, source_id: string): UnifiedRecord | undefined {
    return this.records.get(makeCompositeKey(source_type, source_id));
  }

  public getRecordByRef(record_ref: string): UnifiedRecord | undefined {
    return Array.from(this.records.values()).find((r) => r.record_ref === record_ref);
  }

  public getHistory(): BatchImportResult[] {
    return [...this.history];
  }

  public importBatchObject(batch: ImportBatchFile, options?: { shuffle?: boolean }): BatchImportResult {
    let inserted_count = 0;
    let updated_count = 0;
    let skipped_count = 0;

    let recordsToProcess = [...batch.records];
    if (options?.shuffle) {
      recordsToProcess = recordsToProcess.sort(() => Math.random() - 0.5);
    }

    for (const raw of recordsToProcess) {
      const key = makeCompositeKey(raw.source_type, raw.source_id);
      const existing = this.records.get(key);

      if (!existing) {
        // Insert new record
        const newRecord = buildUnifiedRecord(raw, batch.revision);
        this.records.set(key, newRecord);
        inserted_count++;
      } else {
        // Revision check: Only apply if newer revision
        if (batch.revision > existing.applied_source_revision) {
          // Full replacement of payload and transcript_payload!
          // Explicit manual decisions PRESERVED!
          const updatedRecord = buildUnifiedRecord(raw, batch.revision, existing);
          
          // Mark analysis as fresh for the new revision
          if (updatedRecord.analysis) {
            updatedRecord.analysis.analysis_freshness = 'up_to_date';
            updatedRecord.analysis.analyzed_source_revision = batch.revision;
          }

          this.records.set(key, updatedRecord);
          updated_count++;
        } else {
          // Same or older revision -> Ignore
          skipped_count++;
        }
      }
    }

    const result: BatchImportResult = {
      batch_id: batch.batch_id,
      revision: batch.revision,
      exported_at: batch.exported_at,
      total_records_in_batch: batch.records.length,
      inserted_count,
      updated_count,
      skipped_count,
      timestamp: new Date().toISOString(),
      summary: `Batch ${batch.batch_id} (rev ${batch.revision}): ${inserted_count} inserted, ${updated_count} updated, ${skipped_count} skipped. Total unique records: ${this.records.size}`,
    };

    this.history.unshift(result);
    this.saveToStorage();
    return result;
  }

  public updateManualRoute(
    source_type: string,
    source_id: string,
    newRoutes: RouteCategory[],
    rationale: string,
    reviewState: ReviewState = 'reviewed'
  ): UnifiedRecord {
    const key = makeCompositeKey(source_type, source_id);
    const record = this.records.get(key);
    if (!record) throw new Error(`Record not found: ${key}`);

    const prevRoutes = record.effective_routes;

    record.manual_decision = {
      is_overridden: true,
      manual_route: newRoutes,
      manual_rationale: rationale,
      review_state: reviewState,
      updated_at: new Date().toISOString(),
      history: [
        ...(record.manual_decision.history || []),
        {
          timestamp: new Date().toISOString(),
          action: 'MANUAL_OVERRIDE',
          previous_routes: prevRoutes,
          new_routes: newRoutes,
          rationale,
        },
      ],
    };

    record.effective_routes = newRoutes;
    record.effective_review_state = reviewState;

    this.records.set(key, record);
    this.saveToStorage();
    return record;
  }

  public resetManualRouteToSystem(source_type: string, source_id: string): UnifiedRecord {
    const key = makeCompositeKey(source_type, source_id);
    const record = this.records.get(key);
    if (!record) throw new Error(`Record not found: ${key}`);

    const defaultSuggested = record.analysis?.suggested_routes ||
      INTAKE_RULES_BY_REF[record.record_ref]?.suggested_routes || ['Human Review Required'];

    const defaultReview = record.analysis ? 'reviewed' :
      INTAKE_RULES_BY_REF[record.record_ref]?.review_state || 'intake_completed';

    record.manual_decision = {
      is_overridden: false,
      manual_route: undefined,
      manual_rationale: undefined,
      review_state: defaultReview,
      updated_at: new Date().toISOString(),
      history: [
        ...(record.manual_decision.history || []),
        {
          timestamp: new Date().toISOString(),
          action: 'RESET_TO_SUGGESTION',
          previous_routes: record.effective_routes,
          new_routes: defaultSuggested,
          rationale: 'Manager reset override back to system suggestion',
        },
      ],
    };

    record.effective_routes = defaultSuggested;
    record.effective_review_state = defaultReview;

    this.records.set(key, record);
    this.saveToStorage();
    return record;
  }

  // Pre-configured batch actions
  public importInitialBatch(shuffle = false): BatchImportResult {
    return this.importBatchObject(initialBatchData as unknown as ImportBatchFile, { shuffle });
  }

  public importUpdateBatch(): BatchImportResult {
    return this.importBatchObject(updateBatchData as unknown as ImportBatchFile);
  }
}

// Singleton instance for client-side state
let engineInstance: RevenueDataEngine | null = null;

export function getDataEngine(): RevenueDataEngine {
  if (!engineInstance) {
    engineInstance = new RevenueDataEngine();
  }
  return engineInstance;
}
