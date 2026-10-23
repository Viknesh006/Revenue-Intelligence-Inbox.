import JSZip from 'jszip';
import saveAs from 'file-saver';
import { UnifiedRecord, ManifestEntry, RouteCategory } from '@/types/intelligence';

export function routeToFolder(route: RouteCategory): string {
  switch (route) {
    case 'Sales Coaching':
      return 'sales-coaching';
    case 'Deal Follow-up':
      return 'deal-follow-up';
    case 'Partnership Opportunity':
      return 'partnership-opportunities';
    case 'Customer Success / Support':
      return 'customer-support';
    case 'Internal or Vendor Coordination':
      return 'internal-vendor';
    case 'Human Review Required':
      return 'review-required';
  }
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
}

export interface GeneratedExportFile {
  path: string;
  content: string;
  description: string;
}

export function generateExportPackage(records: UnifiedRecord[]): {
  files: GeneratedExportFile[];
  manifest: ManifestEntry[];
  manifestCsv: string;
} {
  const files: GeneratedExportFile[] = [];
  const manifest: ManifestEntry[] = [];

  // 1. Manager Brief
  const briefContent = `# Manager Daily Brief — 21 August 2026 (Asia/Kolkata)
**SpendNest Revenue Operations & Sales Intelligence**

## 1. Executive Summary & Daily Activity
On 21 August 2026, SpendNest recorded **44 unique customer and market interactions** (30 phone calls and 14 meetings) across sales, customer success, and partnerships. 
- Usable conversation transcripts were captured for **18 interactions** (10 calls, 8 meetings), representing a **40.9% qualitative coverage rate**.
- Outbound telephony showed 14 connected calls out of 30 dials (46.7% connection rate), though only 10 yielded substantive adapted conversations.
- All 44 records have completed intake classification and review routing.

## 2. Activity Breakdown by Team & Channel
- **Arun (Call Rep)**: 12 calls (B01, B03, B04, B07, B09, B10, B12, B13, B15, B17, B18, B19) + 4 analyzed interactions (C01, C02, C04, M12). Focused on outbound prospecting and cold partnership outreach.
- **Leela (Call Rep)**: 8 calls (B02, B05, B06, B08, B11, B14, B16, B20). Characterized by high voicemail/unresponsive rate.
- **Meera (Call Rep)**: 5 calls (C05, C06, C08, C09, C10). High-touch multi-store retail prospecting. *Note: C06 vocal speaker was Ravi despite Meera's telephony attribution.*
- **Dev (Call Rep)**: 1 call (C07). Qualified advisory referral partnership with Willowbank Advisory.
- **Kiran (Call Rep)**: 1 call (C03). Follow-up on technical API developer pricing.
- **Meeting Organizers**: team06 through team14 covering strategic vendor coordination (LedgerBridge - M02), enterprise customer demos (Asterloom - M03), critical retention reviews (Cedarwave - M04), and defect support (Willowfield Trust - M07).

## 3. High-Priority Commercial & Partnership Opportunities
1. **Willowbank Advisory (C07 - Dev)**: High-potential corporate formation channel. Mr. Aditya confirmed active referrals for digital business accounts. Agreed to review terms via chat and speak Monday morning.
2. **Harborpath Advisory (M01 - Strategic Partnerships)**: Inbound advisory interest for remote account opening. Firmly qualified registered US business scope. Partner A requested formal referral terms.
3. **Asterloom Systems (M03 - AE Demo)**: Mid-market card & travel expense evaluation. Demo completed; gating factor is pricing justification with the CFO. Immediate ROI deck required.
4. **Raghav / People Operations Referral (C08 - Meera)**: Internal referral to frontline people operations lead exploring expense management.

## 4. Critical Customer Success & Product Quality Defects
1. **Willowfield Trust (M07 - Revision 2 Late Transcript)**:
   - **Severity: High (P1)**. Customer demonstrated 4 severe bugs:
     - Payment description edits do not persist after clicking "Save changes".
     - Direct invoice attachment fails in "Recreate payment" path (temporary workaround available via Invoice Inbox Review).
     - Reimbursements stuck in "Processing" state cannot be marked or selected.
     - Cash disbursement modal retains previous payment amount (INR 18,200) instead of refreshing.
   - *Operational Principle*: As noted in Turn 15, **workarounds do NOT equal bug fixes**. Engineering escalation required.
2. **Cedarwave Distribution (M04)**: Physical card terminal rejections causing operational friction. Programme migration to alternative issuer network must be executed cleanly to mitigate churn.
3. **Brookmint Holdings / Northkite Equipment (M09)**: Onboarding failure due to expired invitation token, coupled with accounting sync failure for receipts.

## 5. Sales Coaching Observations
1. **Respecting Contact Consent & Boundaries (C10 & C09)**:
   - In C10, Meera pushed for a Monday/Tuesday callback after the prospect agreed to read a brief, provoking a blunt refusal: *"No. I said I will contact you if there is anything to discuss."*
   - In C09, prospect Vedant gave a business head referral but insisted: *"No, please don't use my name."* Reps must be coached to honor consent boundaries rigorously.
2. **Telephony Attribution & Seat Audit (C06)**:
   - Call C06 was recorded under Meera's telephony account, but the caller clearly introduced himself as Ravi. Sales Ops must audit softphone logins.
3. **Overcoming Incumbent Objections (C05 - StoreHarbor)**:
   - Reps require stronger competitive battlecards to displace entrenched multi-store software like StoreHarbor.

## 6. Vendor & Internal Operations Coordination
- **LedgerBridge Evaluation (M02)**: SpendNest Strategy lead evaluated LedgerBridge for PEPOL and compliant e-invoicing. This is **vendor procurement**, strictly isolated from customer sales pipeline.
- **Internal Billing Rehearsal (M10)**: Internal billing engine walkthrough; verified credit limits and invoice scheduling prior to production release.

## 7. Items Requiring Human Review
- **20 Background Phone Calls (B01-B20)**: Logged as voicemails or unresponsive; intake completed; archived without fabricated analysis.
- **6 Non-Text Meetings (M05, M08, M11, M12, M13, M14)**: Three zero-speech meetings (M05, M08, M11), two cancelled notetaker bots (M12, M14), and one unscheduled bot (M13). Review states clearly assigned.

## 8. Action Items Summary
| Priority | Owner | Action | Context |
|---|---|---|---|
| P1 | Engineering / CS | Deploy hotfix for modal amount leakage & description mutation | Willowfield Trust (M07) |
| P1 | CS Team | Provide Customer A (M07) status on stuck reimbursements within 2h | Willowfield Trust (M07) |
| P2 | Dev | Message partnership terms to Mr. Aditya; calendar Monday follow-up | Willowbank Advisory (C07) |
| P2 | AE (M03) | Deliver customized CFO pricing proposal with ERP ROI model | Asterloom Systems (M03) |
| P2 | Kiran | Email API pricing tiers with subject line agreed; call Mon/Tue | Milan (C03) |
| P2 | CS Team | Finalize physical card network migration schedule | Cedarwave (M04) |
| P3 | Sales Ops | Softphone login audit (Meera / Ravi credential reconciliation) | Call C06 attribution |
| P3 | SDR Lead | Deliver coaching session on prospect boundary management | Calls C09 & C10 |
`;

  files.push({
    path: 'manager-brief/2026-08-21.md',
    content: briefContent,
    description: 'Executive Manager Daily Brief for 21 August 2026 (Asia/Kolkata)',
  });

  // 2. Process each of the 44 records and generate individual markdown files for assigned routes
  for (const record of records) {
    const isCall = record.source_type === 'call';
    const ref = record.record_ref || record.source_id.slice(0, 8);
    const title = record.title_or_outcome;
    const cleanTitle = sanitizeFileName(`${ref}_${title}`);
    const outputPathsForRecord: string[] = [];

    // Markdown content generation
    const mdLines: string[] = [
      `# ${ref}: ${record.title_or_outcome}`,
      `**Source Type**: ${record.source_type.toUpperCase()} | **Source ID**: \`${record.source_id}\``,
      `**Local Date (Asia/Kolkata)**: ${record.local_date} | **Applied Revision**: ${record.applied_source_revision}`,
      `**Person**: ${record.person_name} (${record.person_role_type})`,
      `**Assigned Route(s)**: ${record.effective_routes.join(', ')}`,
      `**Manual Override**: ${record.manual_decision.is_overridden ? 'YES (Manager Modified)' : 'NO (System Suggested)'}`,
      record.manual_decision.manual_rationale ? `**Manual Override Rationale**: ${record.manual_decision.manual_rationale}` : '',
      `**Review State**: \`${record.effective_review_state}\``,
      `**Transcript Available**: ${record.has_usable_text ? 'YES' : 'NO (Unsupplied / Silent)'}`,
      '',
      '---',
      '',
    ];

    if (record.analysis) {
      const a = record.analysis;
      mdLines.push(
        '## Executive Analysis',
        `**Summary**: ${a.summary}`,
        '',
        '### What Happened',
        a.what_happened,
        '',
        '### Why It Matters',
        a.why_it_matters,
        '',
        '### Supporting Evidence',
        `> ${a.key_evidence}`,
        '',
        `**Exact Citation**: \`${a.evidence_citation}\``,
        '',
        '### Uncertainties & Limitations',
        a.uncertainties,
        '',
        '### Recommended Next Action',
        `**Action**: ${a.recommended_next_action}`,
        `**Supported Owner**: ${a.action_owner}`,
        '',
        '### Routing Rationale',
        a.route_rationale,
        '',
        `**Analysis Freshness**: \`${a.analysis_freshness}\` (Analyzed Revision: ${a.analyzed_source_revision})`
      );

      if (a.discrepancy_note) {
        mdLines.push('', '### ⚠️ Metadata Discrepancy Note', a.discrepancy_note);
      }
    } else {
      mdLines.push(
        '## Intake Record (No Usable Transcript Supplied)',
        `**Intake State**: \`${record.effective_review_state}\``,
        '**Note**: In accordance with DATA_CONTRACT.md, this record has no usable supplied conversation text. No substantive summary was fabricated.',
        isCall
          ? `**Call Metadata**: Duration ${record.payload.duration_seconds}s, Observed Outcome: \`${(record.payload as any).observed_outcome || 'N/A'}\``
          : `**Meeting Metadata**: Provider ${(record.payload as any).provider}, Recording Status: \`${(record.payload as any).recording_status}\``
      );
    }

    // Add transcript excerpt if available
    if (isCall && (record.payload as any).transcript) {
      mdLines.push('', '---', '', '## Supplied Adapted Call Transcript', (record.payload as any).transcript);
    } else if (!isCall && record.transcript_payload?.turns && record.transcript_payload.turns.length > 0) {
      mdLines.push('', '---', '', '## Supplied Meeting Turns');
      for (let i = 0; i < record.transcript_payload.turns.length; i++) {
        const turn = record.transcript_payload.turns[i];
        mdLines.push(
          `**Turn ${i + 1} | ${turn.timecode} | ${turn.speaker}**`,
          turn.text,
          ''
        );
      }
    }

    const fullDocContent = mdLines.join('\n');

    // Write file to each assigned route folder!
    for (const route of record.effective_routes) {
      const folder = routeToFolder(route);
      const filePath = `${folder}/${cleanTitle}.md`;
      outputPathsForRecord.push(filePath);

      files.push({
        path: filePath,
        content: fullDocContent,
        description: `${route} analysis document for ${ref}`,
      });
    }

    // Also link to Manager Brief if this record is cited in the brief
    const citedInBrief = ['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10', 'M01', 'M02', 'M03', 'M04', 'M06', 'M07', 'M09', 'M10'].includes(ref);
    if (citedInBrief) {
      outputPathsForRecord.push('manager-brief/2026-08-21.md');
    }

    // Build Manifest Entry
    manifest.push({
      source_type: record.source_type,
      source_id: record.source_id,
      record_ref: record.record_ref,
      applied_source_revision: record.applied_source_revision,
      assigned_routes: record.effective_routes,
      output_paths: outputPathsForRecord,
      processing_state: record.has_usable_text ? 'analysis_completed' : 'intake_completed',
      review_state: record.effective_review_state,
      manual_override: record.manual_decision.is_overridden,
      analysis_freshness: record.analysis?.analysis_freshness || 'up_to_date',
      analyzed_source_revision: record.analysis?.analyzed_source_revision || record.applied_source_revision,
      transcript_available: record.has_usable_text,
    });
  }

  // 3. Manifest JSON file
  const manifestJsonContent = JSON.stringify(
    {
      batch_delivery_date: '2026-08-22',
      activity_reporting_date: '2026-08-21',
      reporting_timezone: 'Asia/Kolkata',
      total_unique_records: records.length,
      usable_text_count: records.filter((r) => r.has_usable_text).length,
      records: manifest,
    },
    null,
    2
  );

  files.push({
    path: 'manifest.json',
    content: manifestJsonContent,
    description: 'Machine-readable JSON export manifest',
  });

  // 4. Manifest CSV file
  const csvHeaders = [
    'source_type',
    'source_id',
    'record_ref',
    'applied_source_revision',
    'assigned_routes',
    'output_paths',
    'processing_state',
    'review_state',
    'manual_override',
    'analysis_freshness',
    'analyzed_source_revision',
    'transcript_available',
  ];

  const csvRows = manifest.map((m) => [
    m.source_type,
    m.source_id,
    m.record_ref,
    m.applied_source_revision,
    `"${m.assigned_routes.join('; ')}"`,
    `"${m.output_paths.join('; ')}"`,
    m.processing_state,
    m.review_state,
    m.manual_override,
    m.analysis_freshness,
    m.analyzed_source_revision,
    m.transcript_available,
  ]);

  const manifestCsvContent = [csvHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');

  files.push({
    path: 'manifest.csv',
    content: manifestCsvContent,
    description: 'Machine-readable CSV export manifest',
  });

  // 5. Root README.md for Export package
  const readmeContent = `# SpendNest Revenue Intelligence Inbox Export Package
**Export Date**: 2026-08-22 | **Activity Date**: 2026-08-21 (Asia/Kolkata)

## Package Overview
This export archive contains organized, evidence-backed intelligence documents generated from the SpendNest interaction dataset, covering 44 unique records (30 phone calls, 14 calendar meetings).

## Directory Structure
- \`manifest.json\`: Authoritative machine-readable JSON manifest with relative file links.
- \`manifest.csv\`: Tabular manifest of all 44 records and their assigned output paths.
- \`manager-brief/\`: Contains \`2026-08-21.md\` daily executive briefing for sales leadership.
- \`sales-coaching/\`: Outreach methodology, objection handling, and rep coaching observations.
- \`deal-follow-up/\`: Active sales pipeline evaluations, commercial proposals, and scheduled callbacks.
- \`partnership-opportunities/\`: Channel and corporate advisory referral partnerships (Harborpath, Willowbank).
- \`customer-support/\`: Customer health, card programme migrations, and critical software defects (Willowfield Trust).
- \`internal-vendor/\`: Inbound vendor compliance procurement (LedgerBridge) and staff training (Billing walkthrough).
- \`review-required/\`: Triage queue for unrecorded interactions, bot cancellations, zero-speech audio, and metadata discrepancies.

## Replay Verification
1. Composite Identity Key: \`(source_type, source_id)\`. Logical record count remains strictly 44.
2. Revision Hierarchy: Revision 2 (Update) supersedes Revision 1. Older re-imports cannot overwrite newer source data.
3. Manual Override Preservation: Manager modifications are strictly preserved across updates and stale batch imports.
`;

  files.push({
    path: 'README.md',
    content: readmeContent,
    description: 'Export package overview and directory guide',
  });

  return {
    files,
    manifest,
    manifestCsv: manifestCsvContent,
  };
}

export async function downloadZipPackage(records: UnifiedRecord[]): Promise<void> {
  const { files } = generateExportPackage(records);
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'revenue_intelligence_inbox_exports_2026-08-21.zip');
}
