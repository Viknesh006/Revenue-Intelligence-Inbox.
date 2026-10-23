export type SourceType = 'call' | 'meeting';

export type RouteCategory =
  | 'Sales Coaching'
  | 'Deal Follow-up'
  | 'Partnership Opportunity'
  | 'Customer Success / Support'
  | 'Internal or Vendor Coordination'
  | 'Human Review Required';

export type ReviewState =
  | 'intake_completed'
  | 'pending_manual_review'
  | 'reviewed'
  | 'escalated'
  | 'no_speech_detected'
  | 'bot_cancelled'
  | 'bot_not_scheduled'
  | 'no_text_logged';

export type FreshnessState = 'up_to_date' | 'stale' | 'pending_review';

export interface Turn {
  speaker: string;
  starts_at_seconds: number;
  timecode: string;
  text: string;
}

export interface CallPayload {
  id: string;
  external_call_id?: string;
  workspace_slug?: string;
  rep_email?: string | null;
  rep_name?: string | null;
  rep_user_id?: string | null;
  direction?: string;
  direction_raw?: string;
  from_number?: string | null;
  to_number?: string | null;
  started_at: string;
  duration_seconds: number;
  talk_time_seconds?: number | null;
  speaker_count?: number | null;
  segment_count?: number | null;
  is_connected?: boolean | null;
  is_conversation?: boolean | null;
  observed_outcome?: string | null;
  classification_reason?: string | null;
  classification_status?: string | null;
  is_campaign_call?: boolean | null;
  first_dial_ever?: boolean | null;
  first_connect_ever?: boolean | null;
  prior_dials_ever?: number | null;
  prior_connects_ever?: number | null;
  summary?: string | null;
  summary_status?: string | null;
  transcript?: string | null;
}

export interface MeetingPayload {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  duration_seconds: number;
  provider: string;
  join_url?: string;
  organizer_email?: string | null;
  attendee_count?: number | null;
  recording_status: string;
  recording_detail?: string | null;
  recording_id?: string | null;
  has_transcript: boolean;
  has_video: boolean;
  summary?: string | null;
  summary_status?: string | null;
  redacted?: boolean;
}

export interface MeetingTranscriptPayload {
  meeting_id: string;
  turns: Turn[];
  unavailable_reason: string | null;
}

export interface RawRecord {
  record_ref: string;
  source_type: SourceType;
  source_id: string;
  payload: CallPayload | MeetingPayload;
  transcript_payload: MeetingTranscriptPayload | null;
}

export interface ImportBatchFile {
  batch_id: string;
  revision: number;
  exported_at: string;
  records: RawRecord[];
}

export interface ConversationAnalysis {
  record_ref: string;
  source_type: SourceType;
  source_id: string;
  summary: string;
  what_happened: string;
  why_it_matters: string;
  key_evidence: string;
  evidence_citation: string;
  uncertainties: string;
  recommended_next_action: string;
  action_owner: string;
  suggested_routes: RouteCategory[];
  route_rationale: string;
  analysis_freshness: FreshnessState;
  analyzed_source_revision: number;
  discrepancy_note?: string;
}

export interface ManualDecision {
  manual_route?: RouteCategory[];
  manual_rationale?: string;
  is_overridden: boolean;
  review_state: ReviewState;
  updated_at?: string;
  history?: Array<{
    timestamp: string;
    action: string;
    previous_routes?: RouteCategory[];
    new_routes?: RouteCategory[];
    rationale?: string;
  }>;
}

export interface UnifiedRecord {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  applied_source_revision: number;
  payload: CallPayload | MeetingPayload;
  transcript_payload: MeetingTranscriptPayload | null;
  analysis?: ConversationAnalysis;
  manual_decision: ManualDecision;
  has_usable_text: boolean;
  local_date: string;
  person_name: string;
  person_role_type: 'call_rep' | 'meeting_organizer' | 'unassigned';
  title_or_outcome: string;
  effective_routes: RouteCategory[];
  effective_review_state: ReviewState;
  discrepancy_flag?: string;
}

export interface BatchImportResult {
  batch_id: string;
  revision: number;
  exported_at: string;
  total_records_in_batch: number;
  inserted_count: number;
  updated_count: number;
  skipped_count: number;
  timestamp: string;
  summary: string;
}

export interface ManifestEntry {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  applied_source_revision: number;
  assigned_routes: RouteCategory[];
  output_paths: string[];
  processing_state: string;
  review_state: ReviewState;
  manual_override: boolean;
  analysis_freshness: FreshnessState;
  analyzed_source_revision: number;
  transcript_available: boolean;
}
