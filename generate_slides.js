const pptxgen = require('./revenue-intelligence-inbox/node_modules/pptxgenjs');
const path = require('path');

async function createDeck() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

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
      speakerNotes: 'Slide 1 sets the operational problem. Rather than building a passive CRM clone, we designed an active revenue intelligence inbox for a manager who needs to separate sales pipe from vendor procurement, audit softphone seat sharing, and catch critical software defects before churn occurs.'
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
      speakerNotes: 'Slide 2 highlights our 3 core findings. Each finding is traced directly to an exact spoken sentence or turn reference, and we show exactly which screen, rule, and output path it influenced.'
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
      speakerNotes: 'Slide 3 demonstrates our nuanced routing philosophy. In sales operations, not every interaction is a qualified deal. When a prospect explicitly forbids follow-up calls, routing it into an aggressive SDR follow-up queue is a critical mistake.'
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
      speakerNotes: 'Slide 4 explains the data contract implementation. We demonstrate that our composite key and revision comparison prevent duplicate counting and preserve human overrides even when upstream systems replay older batches.'
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
      speakerNotes: 'Slide 5 reflects on our architectural trade-offs. Rejecting phantom deal sizing was an intentional choice to preserve data integrity and executive trust.'
    }
  ];

  slides.forEach((s) => {
    const slide = pptx.addSlide();
    slide.background = { color: '0F172A' };

    slide.addText('SPENDNEST REVENUE INTELLIGENCE INBOX', {
      x: 0.8,
      y: 0.5,
      fontSize: 10,
      fontFace: 'Segoe UI',
      color: '38BDF8',
      bold: true
    });

    slide.addText(s.title, {
      x: 0.8,
      y: 0.8,
      w: 11.5,
      fontSize: 22,
      fontFace: 'Segoe UI',
      color: 'FFFFFF',
      bold: true
    });

    slide.addText(s.subtitle, {
      x: 0.8,
      y: 1.35,
      w: 11.5,
      fontSize: 13,
      fontFace: 'Segoe UI',
      color: '94A3B8'
    });

    let yOffset = 2.1;
    s.points.forEach((p) => {
      const parts = p.split(': ');
      const boldTitle = parts[0] + ': ';
      const bodyText = parts.slice(1).join(': ');

      slide.addText(
        [
          { text: `• ${boldTitle}`, options: { bold: true, color: '38BDF8' } },
          { text: bodyText, options: { bold: false, color: 'E2E8F0' } }
        ],
        {
          x: 0.8,
          y: yOffset,
          w: 11.5,
          fontSize: 11,
          fontFace: 'Segoe UI',
          lineSpacingMultiple: 1.2
        }
      );
      yOffset += 0.95;
    });

    slide.addNotes(s.speakerNotes);

    slide.addText(`Slide ${s.slideNumber} of 5 | 21 August 2026 (Asia/Kolkata)`, {
      x: 0.8,
      y: 6.8,
      fontSize: 9,
      color: '64748B'
    });
  });

  const outPath = path.join(__dirname, 'SpendNest_Revenue_Intelligence_5_Slides.pptx');
  await pptx.writeFile({ fileName: outPath });
  console.log('Successfully created PPTX slides file at:', outPath);
}

createDeck();
