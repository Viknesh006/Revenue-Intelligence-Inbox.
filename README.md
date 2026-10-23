# SpendNest Revenue Intelligence Inbox

A complete, production-grade **Revenue Intelligence Inbox** and operational governance platform for sales managers, built to analyze calls, meetings, transcripts, and metadata from SpendNest.

---

## 1. Executive Summary & Purpose

Sales managers are bombarded with fragmented data from dialers, calendars, and transcription bots. Transcripts arrive late, stored labels contradict actual conversations, and generic AI summaries miss critical business reality.

The **SpendNest Revenue Intelligence Inbox** solves this problem by providing an auditable, desktop-first workspace that helps managers:
- Monitor daily sales and customer interaction activity for **21 August 2026 (Asia/Kolkata)**.
- Explore 44 unique interactions across telephony and video channels.
- Distinguish true commercial pipeline opportunities from inbound **vendor compliance evaluations** (e.g. LedgerBridge e-invoicing).
- Uncover severe **customer product defects** and operational risks (e.g. Willowfield Trust bugs, Cedarwave card terminal failures).
- Surface high-priority **sales coaching observations** (e.g. respecting prospect boundaries, auditing softphone seat sharing).
- Execute deterministic batch updates where **Revision 2** replaces records without duplicate inflation, while preserving **manual routing overrides**.
- Export organized markdown intelligence archives and a machine-readable JSON/CSV manifest where every relative link is guaranteed to exist.

---

## 2. Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19, TypeScript 5)
- **Styling**: Tailwind CSS with custom slate/navy executive theme
- **Visualizations**: Recharts (interactive activity bar charts and routing distribution)
- **Icons**: Lucide React
- **Export Packaging**: JSZip & FileSaver (client-side ZIP packaging and manifest downloads)
- **Slide Deck Generation**: PptxGenJS (in-browser & CLI editable `.pptx` generation)
- **State & Persistence**: LocalStorage persistence engine with deterministic revision logic and schema versioning

---

## 3. Quick Start & Setup Instructions

### Prerequisites
- Node.js v18+ (tested on Node v25.8.1)
- npm v9+

### Startup
1. Open a terminal in the project root (`d:/volo`):
```bash
npm run dev
```
2. Open your browser and navigate to:
```
http://localhost:3000
```

### Direct CLI Commands
You can run automated replay tests and export generation directly from the root:
```bash
# Run end-to-end replay test suite (verifies all 7 replay steps and manifest paths)
npm test

# Generate physical export folder and manifest.json / manifest.csv in d:/volo/exports/
npm run export

# Generate physical 5-slide PowerPoint deck (SpendNest_Revenue_Intelligence_5_Slides.pptx)
npm run slides

# Run Next.js production build verification
npm run build
```

---

## 4. Repository File Structure

```
d:/volo/
├── README.md                                  # Complete project documentation & replay guide
├── package.json                               # Root workspace script runner
├── test_replay.js                             # Automated 7-step replay & assertion test suite
├── generate_exports.js                        # Physical export directory generator
├── generate_slides.js                         # Editable 5-slide PPTX deck generator
├── SpendNest_Revenue_Intelligence_5_Slides.pptx # Physical 5-slide presentation file
├── exports/                                   # Generated physical export folder
│   ├── manifest.json                          # Authoritative machine-readable JSON manifest
│   ├── manifest.csv                           # Tabular CSV manifest
│   ├── README.md                              # Export package documentation
│   ├── manager-brief/2026-08-21.md            # Daily executive brief
│   ├── sales-coaching/                        # Coaching notes (C01, C05, C06, C09, C10, M03)
│   ├── deal-follow-up/                        # Pipeline progression (C02, C03, C04, C05, C08, C09, M03, M06)
│   ├── partnership-opportunities/             # Channel partnerships (C07, M01, M02)
│   ├── customer-support/                      # CS & defect tickets (M04, M07, M09)
│   ├── internal-vendor/                       # Vendor procurement & training (M02, M10)
│   └── review-required/                       # Triage queue for exceptions and unrecorded intake
├── candidate/                                 # Original assignment package
│   ├── data/
│   │   ├── 01_initial.json                    # Delivery 1 (Revision 1, 44 records, 17 usable texts)
│   │   └── 02_update.json                     # Delivery 2 (Revision 2, M07 update with 27 turns)
│   ├── ASSIGNMENT.md
│   ├── DATA_CONTRACT.md
│   ├── DATA_DICTIONARY.md
│   ├── CONVERSATIONS.md
│   └── SUBMISSION_CHECKLIST.md
└── revenue-intelligence-inbox/                # Full Next.js Web Application
    ├── src/
    │   ├── app/                               # App router pages & layouts
    │   ├── components/                        # UI tabs, inspection modal, charts, navbar
    │   ├── lib/                               # Replay engine, export generator, intelligence data
    │   └── types/                             # TypeScript definitions
    └── public/data/                           # Static json fixtures for in-browser replay
```

---

## 5. Data Contract & Replay Reproduction

### Identity Rule
The unique record identity is strictly the composite key:
$$\text{Identity} = (\text{source\_type}, \text{source\_id})$$
*Never key records by company name, title, record_ref, or array position.*

### Exact 7-Step Replay Sequence

| Step | Action | Expected & Verified Behaviour |
|---|---|---|
| **Step 1: Initial Import** | Import `01_initial.json` | 44 logical records created (30 calls, 14 meetings). Exactly 17 records have usable transcripts. M07 has `turns: []` with note: *"Transcript not included in this delivery; a later assessment batch supplies it."* |
| **Step 2: Shuffled Re-import** | Re-import `01_initial.json` in randomized order | 0 records inserted, 44 records skipped as duplicate equal revision (rev 1 $\le$ rev 1). Unique count stays strictly 44. |
| **Step 3: Manual Route Override** | Manually modify M07's assigned route in the UI | Route changed to `['Customer Success / Support', 'Human Review Required']` with rationale. Saved to persistent state. |
| **Step 4: Update Batch** | Import `02_update.json` (Revision 2) | M07 is updated with 27 turns. Total usable transcripts increase from 17 to 18. Unique record count remains 44. **Manual override is strictly PRESERVED.** |
| **Step 5: Stale Re-import** | Re-import `01_initial.json` again | Older revision 1 is ignored for M07 (rev 1 $\le$ rev 2). M07 retains its 27 turns and revision 2. |
| **Step 6: Refresh / Restart** | Refresh browser or restart application | LocalStorage persistence restores all 44 records, M07's 27 turns, and the manual override intact. |
| **Step 7: Manifest Validation** | Inspect `manifest.json` and `manifest.csv` | All 44 records mapped to valid relative paths. Every output path points to a file that physically exists. |

To verify this entire sequence in 1 second, run:
```bash
npm test
```

---

## 6. Three Core Analytical Findings

### Finding 1: Telephony User Attribution Discrepancy in Call C06
- **Source Passage**: [C06 adapted transcript](file:///d:/volo/candidate/CONVERSATIONS.md#L45):
  > *"Good evening, Mr Nikhil. Good evening. Ravi here. I'll say at the start that this is a cold call."*
- **Contrast with Stored Metadata**: Telephony metadata attributes the call to rep `Meera` (`meera@example.com`).
- **Significance**: Telephony PBX logins and extension mappings cannot be blindly trusted as ground truth. Credential sharing or misassigned softphone extensions corrupt rep performance tracking.
- **Product Influence**:
  - **Conversation Inbox & Detail Page**: Added an explicit **"Attribution Discrepancy"** warning badge and audit alert banner.
  - **Activity Analytics**: Displays an attribution note cautioning that telephony accounts may diverge from vocal agents.
  - **Routing Engine**: Automatically routed C06 to `Sales Coaching` and `Human Review Required` to trigger a softphone seat audit.

### Finding 2: Workaround Is Not a Defect Resolution in Meeting M07
- **Source Passage**: [M07 Turn 15](file:///d:/volo/candidate/CONVERSATIONS.md#L830):
  > *Team member A: "Yes. I will still raise the original behaviour with the team. The workaround does not mean the direct upload issue has been resolved."*
- **Contrast with Typical CS Practice**: Support teams frequently mark tickets as "Resolved" once a fragile workaround is shown to a customer.
- **Significance**: Customer A demonstrated 4 severe bugs (event payment description mutation failure, cash disbursement modal amount bleed of INR 18,200, attachment failure in Recreate Payment, reimbursement processing lockup). The support rep correctly affirmed that providing an alternative path does not eliminate the defect.
- **Product Influence**:
  - **Routing Taxonomy**: Assigned M07 to `Customer Success / Support` with high-severity P1 engineering defect tracking.
  - **Manager Brief**: Featured in Section 5 as an urgent P1 action item.
  - **Output Generation**: Outputted to `customer-support/M07_Willowfield_Trust.md`.

### Finding 3: Inbound Vendor Procurement Misclassified as Sales Pipeline in Meeting M02
- **Source Passage**: [M02 Turn 1](file:///d:/volo/candidate/CONVERSATIONS.md#L450):
  > *Team member A: "I work on strategy and partnerships at SpendNest. We serve businesses with cards and accounts payable, and we are developing accounts receivable. We want to understand whether LedgerBridge can give us compliant invoicing coverage across our operating markets."*
- **Contrast with Stored Title**: Stored calendar title *"LedgerBridge / SpendNest discussion"* could easily be mistaken for an outbound sales deal.
- **Significance**: SpendNest is evaluating LedgerBridge as an e-invoicing compliance vendor (PEPPOL / tax clearance) for its upcoming accounts receivable module. Treating LedgerBridge as a commercial buyer artificially inflates sales pipeline.
- **Product Influence**:
  - **Routing Engine**: Established a dedicated `Internal or Vendor Coordination` routing category, strictly isolating vendor evaluations from commercial pipeline metrics.
  - **Dashboard Analytics**: Excluded from customer conversion counts.
  - **Output Generation**: Outputted to `internal-vendor/M02_LedgerBridge_Invoicing_Procurement.md`.

---

## 7. One Deliberately Rejected Decision

- **Option Considered**: Automated Deal Sizing & ARR Extrapolation using AI or keyword heuristics (e.g. projecting revenue from C06's "120 stores" or C09's "130 locations").
- **Why Rejected**: The brief and `DATA_DICTIONARY.md` strictly stipulate: *"Do not invent pipeline value, deal outcomes or account links that the data does not establish. Missing inputs cannot be replaced by guesses."* Imputing deal values creates phantom pipeline metrics that mislead leadership and distort coaching priorities.
- **Accepted Trade-Off**: The dashboard displays only verified, evidence-grounded metrics (interaction counts, transcript coverage, follow-up commitments, and coaching observations) rather than speculative dollar pipeline widgets.
- **Resulting Product Choice**: Speculative revenue widgets were deliberately omitted from the dashboard; all reporting focuses on operational facts.

---

## 8. Metric Definitions & Denominators

| Metric | Numerator | Denominator | Time Range & Limitations |
|---|---|---|---|
| **Total Selected Records** | Unique `(source_type, source_id)` | Curated assessment batch (44 records) | 21 August 2026 (Asia/Kolkata). Not a whole-team measure. |
| **Usable Transcript Coverage** | Records with nonblank transcript or turns (18 post-update) | Total records (44) | 40.9% qualitative coverage. 26 records intentionally lack text. |
| **Connection Rate** | Calls with `is_connected == true` (14 calls) | Calls with non-null `is_connected` (30 calls) | 46.7%. Source-reported telephony heuristic; does not prove substantive discussion. |
| **Active Routing Destinations** | Sum of assigned route categories | Varies (records have multiple routes) | Multi-destination routing permitted when evidence warrants. |

---

## 9. Pre-Generated vs Dynamic Runtime Operations

- **Pre-Generated Assets**:
  - Detailed qualitative analyses for all 18 conversations with usable dialogue.
  - Baseline intake rules and classification for the 26 non-text records.
  - Daily Manager Brief for 21 August 2026.
  - Five-slide presentation narrative and speaker notes.
- **Dynamic Runtime Operations**:
  - Composite key deduplication ensuring exactly 44 records.
  - Deterministic revision ordering (Revision 2 replacing M07; Revision 1 ignored on re-import).
  - Manual routing override persistence and effective route computation.
  - Live interactive multi-column filtering, text search, sorting, and Recharts graph aggregation.
  - Client-side & CLI ZIP archive generation with manifest path verification.
  - Editable PowerPoint `.pptx` generation via `pptxgenjs`.

---

## 10. Approximate Hours Spent & Known Limitations

- **Approximate Hours Spent**: **~7.5 hours** total:
  - Phase 1 — Schema Analysis & Record Inspection: 1.5h
  - Phase 2 — Data Contract & Replay Engine Implementation: 1.5h
  - Phase 3 — UI, Dashboard, Inbox, & Detail Inspection View: 2.0h
  - Phase 4 — Qualitative Evidence Analysis & Manager Brief: 1.0h
  - Phase 5 — Export Packaging, Slide Deck, & Verification Suite: 1.5h
- **Known Limitations**:
  - No authoritative CRM deal table or verified staff directory exists in the supplied files.
  - Activity is confined to a single day (21 August 2026 in Asia/Kolkata).
  - Meeting organizers are calendar coordinators and not confirmed sales reps or attendees.
  - The 26 non-text records are preserved with intake states without fabricated summaries.

---

## 11. Three-Minute Screen Recording Script & Narration Plan

**Format**: One continuous screen recording with spoken voiceover (approx. 3 minutes).

### Timeline & Narration Script
- **0:00 - 0:45 | Introduction & Overview Dashboard**:
  - *Action*: Open Overview Tab. Point out KPI cards (44 total records, 30 calls, 14 meetings, 17 usable transcripts initially).
  - *Narration*: *"Welcome to the SpendNest Revenue Intelligence Inbox. Today is 21 August 2026 in Asia/Kolkata. We have 44 unique interactions. Every denominator is strictly defined. Notice our interactive person filter separates telephony reps from meeting organizers, because an organizer is not automatically the salesperson."*
- **0:45 - 1:30 | Difficult Routing Decision & Evidence Inspection**:
  - *Action*: Navigate to Inbox. Filter by Call C10. Open Detail Modal.
  - *Narration*: *"Here is our difficult routing decision in Call C10 with Mr. Aniket. Aniket left Meadowbrick and agreed to receive an informational brief. But when the SDR pushed for a Monday callback, he firmly replied: 'No. I said I will contact you if there is anything to discuss.' We deliberately routed this to Sales Coaching and Human Review rather than active Deal Follow-up. Respecting boundary consent is critical to protecting brand reputation."*
- **1:30 - 2:30 | Replay Test, Duplicate Prevention & Preserved Manual Override**:
  - *Action*: Navigate to Replay Studio.
    1. Show Step 2: Click Re-import Shuffled Batch -> record count stays 44 (0 duplicates added).
    2. Show Step 3: Change M07 route to `Customer Success / Support + Human Review Required` with rationale.
    3. Show Step 4: Import Update Batch -> M07 receives 27 turns, transcripts increase from 17 to 18, and manual override is strictly preserved!
    4. Show Step 5: Re-import Initial Batch -> Revision 1 is ignored; M07 keeps 27 turns.
    5. Refresh browser -> State persists from LocalStorage!
  - *Narration*: *"In our Replay Studio, we demonstrate data contract compliance. Re-importing the initial batch in shuffled order inserts zero new records. We manually change M07's route. Now we apply the update batch: M07 receives 27 turns, transcript coverage increases to 18, and our manual override is preserved. Re-importing the older batch has no effect because revision 2 takes precedence."*
- **2:30 - 3:00 | Exports & 5-Slide Presentation**:
  - *Action*: Open Exports tab, show folder tree and manifest table. Click "Download ZIP". Switch to 5-Slide Deck and show editable PPTX generator.
  - *Narration*: *"Finally, our export system generates an organized archive where every relative path in the manifest physically exists. We also include an interactive five-slide deck with full speaker notes and editable PPTX export. The entire application is tested, deterministic, and ready for review."*
