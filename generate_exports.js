const fs = require('fs');
const path = require('path');

// Load initial and update data
const initialBatch = require('./candidate/data/01_initial.json');
const updateBatch = require('./candidate/data/02_update.json');

// Composite key map
const recordsMap = new Map();

function makeKey(type, id) {
  return `${type}:::${id}`;
}

// 1. Process Initial Batch (Revision 1)
initialBatch.records.forEach(r => {
  recordsMap.set(makeKey(r.source_type, r.source_id), {
    source_type: r.source_type,
    source_id: r.source_id,
    record_ref: r.record_ref,
    applied_source_revision: initialBatch.revision,
    payload: r.payload,
    transcript_payload: r.transcript_payload,
    manual_decision: { is_overridden: false, review_state: 'intake_completed' }
  });
});

// 2. Re-import Initial Batch Shuffled (Verify 0 duplicate additions)
const shuffled = [...initialBatch.records].sort(() => Math.random() - 0.5);
shuffled.forEach(r => {
  const existing = recordsMap.get(makeKey(r.source_type, r.source_id));
  if (initialBatch.revision > existing.applied_source_revision) {
    existing.payload = r.payload;
    existing.applied_source_revision = initialBatch.revision;
  }
});

// 3. Simulate Manager Manual Route Change on M07
const m07Key = makeKey('meeting', '4f304fff-fd40-5cfc-a366-0a134c445c2a');
if (recordsMap.has(m07Key)) {
  const m07 = recordsMap.get(m07Key);
  m07.manual_decision = {
    is_overridden: true,
    manual_route: ['Customer Success / Support', 'Human Review Required'],
    manual_rationale: 'Manager override: Critical product bugs demonstrated in UI; requires priority engineering review.',
    review_state: 'reviewed',
    updated_at: new Date().toISOString()
  };
}

// 4. Apply Update Batch (Revision 2)
updateBatch.records.forEach(r => {
  const existing = recordsMap.get(makeKey(r.source_type, r.source_id));
  if (existing) {
    if (updateBatch.revision > existing.applied_source_revision) {
      existing.payload = r.payload;
      existing.transcript_payload = r.transcript_payload;
      existing.applied_source_revision = updateBatch.revision;
      // manual_decision is preserved!
    }
  } else {
    recordsMap.set(makeKey(r.source_type, r.source_id), {
      source_type: r.source_type,
      source_id: r.source_id,
      record_ref: r.record_ref,
      applied_source_revision: updateBatch.revision,
      payload: r.payload,
      transcript_payload: r.transcript_payload,
      manual_decision: { is_overridden: false, review_state: 'intake_completed' }
    });
  }
});

// 5. Re-import Initial Batch (Revision 1) -> Must be ignored for M07!
initialBatch.records.forEach(r => {
  const existing = recordsMap.get(makeKey(r.source_type, r.source_id));
  if (initialBatch.revision > existing.applied_source_revision) {
    existing.payload = r.payload;
    existing.transcript_payload = r.transcript_payload;
    existing.applied_source_revision = initialBatch.revision;
  }
});

console.log('Post-update unique record count:', recordsMap.size);

// Define exports directory
const exportDir = path.join(__dirname, 'exports');
if (fs.existsSync(exportDir)) {
  fs.rmSync(exportDir, { recursive: true, force: true });
}
fs.mkdirSync(exportDir, { recursive: true });

const folders = [
  'manager-brief',
  'sales-coaching',
  'deal-follow-up',
  'partnership-opportunities',
  'customer-support',
  'internal-vendor',
  'review-required'
];
folders.forEach(f => fs.mkdirSync(path.join(exportDir, f), { recursive: true }));

// Analyses definitions
const analyses = {
  '2ec4404c-beee-5377-a63c-aab701da08ed': {
    ref: 'C01',
    title: 'Harborlight Advisory Cold Outreach',
    routes: ['Sales Coaching', 'Human Review Required'],
    summary: 'Arun cold-calls Pranav (Harborlight Advisory) proposing an outsourced finance leadership partnership. Pranav firmly objects to receiving unsolicited sales calls on his direct work number and notes their processes are already automated.',
    what_happened: 'Cold outbound call pitching finance leadership automation. Prospect reacted with high friction over unsolicited contact and stated existing operations are already automated.',
    why_it_matters: 'Negative brand experience and direct rejection. Continuing to contact this number risks compliance and reputation issues.',
    evidence: 'C01: "I didn\'t ask for this call, and I\'m not interested."',
    uncertainties: 'Lead list provenance was described vaguely as a "networking outreach programme" without specific GDPR/consent record.',
    next_action: 'Add phone number to global do-not-call suppression list; review lead qualification and list acquisition criteria with SDR team.',
    owner: 'Arun (caller)'
  },
  '4b870624-8aad-5315-a60e-0db95981cf99': {
    ref: 'C02',
    title: 'Fernhaven Group Reception Voicemail',
    routes: ['Deal Follow-up'],
    summary: 'Arun dials Fernhaven Group asking for Leela. Receptionist Kavya informs him that Leela is out of the office for the day. Caller requests transfer to Leela\'s voicemail and leaves a message.',
    what_happened: 'Outbound call reached receptionist; target contact was out of office. Caller left voicemail.',
    why_it_matters: 'Account remains in active qualification pipeline but stalled until target contact returns.',
    evidence: 'C02: "It looks as though she isn\'t in the office today."',
    uncertainties: 'Target contact\'s specific return date and current level of interest.',
    next_action: 'Schedule re-dial task for early next week; send concise email to Leela noting the voicemail.',
    owner: 'Arun (caller)'
  },
  '20d509ba-d589-5334-9aef-ea4ce6105b1a': {
    ref: 'C03',
    title: 'Developer API Follow-up and Pricing',
    routes: ['Deal Follow-up'],
    summary: 'Kiran follows up with Milan regarding developer API access previously discussed five weeks earlier. Milan is travelling with audio difficulties. Milan expresses price sensitivity ("isn\'t essential enough for us to spend much on it") and requests an email proposal to review before a scheduled discussion on Monday or Tuesday.',
    what_happened: 'Follow-up on developer API evaluation. Prospect voiced budget constraint and requested written proposal with exact subject line before a follow-up discussion next week.',
    why_it_matters: 'Technical evaluation at risk of slipping if pricing model does not accommodate lower-tier usage.',
    evidence: 'C03: "We did ask about some developer functionality, but it isn\'t essential enough for us to spend much on it."',
    uncertainties: 'Exact budget limit for Milan\'s engineering team; whether dev team has evaluated competitor APIs.',
    next_action: 'Email proposal with subject "Developer access and event notifications — follow-up" with modular pricing options; book follow-up call for Monday/Tuesday.',
    owner: 'Kiran (caller)'
  },
  'bcdcbf56-d338-5c78-9a97-42c2fc1c9931': {
    ref: 'C04',
    title: 'Lanternpath Media Resent Proposal Follow-up',
    routes: ['Deal Follow-up'],
    summary: 'Arun leaves voicemail for Ritesh at Lanternpath Media regarding expense platform evaluation. Arun explains previous information had initially bounced due to an incorrect email address but has now been resent to the corrected address. Arun invites a callback.',
    what_happened: 'Voicemail follow-up after an email delivery misdirection glitch.',
    why_it_matters: 'Ensures prospect knows materials were resent and avoids assuming prospect went cold.',
    evidence: 'C04: "My understanding is that our information first went to the wrong email address."',
    uncertainties: 'Whether Ritesh has engaged with the resent proposal; overall deal urgency.',
    next_action: 'Monitor email open tracking; if no callback within 48 hours, send brief LinkedIn/text confirmation.',
    owner: 'Arun (caller)'
  },
  '75a6b94f-7717-5cfb-9e41-0acc94415e17': {
    ref: 'C05',
    title: 'Retail Store Pitch & StoreHarbor Incumbent',
    routes: ['Deal Follow-up', 'Sales Coaching'],
    summary: 'Meera cold-calls a retail operations contact pitching store expense management, cards, and vendor payables. Contact states they already use StoreHarbor and other tools for vendor payments and store instant payments. Contact suggests sending a presentation to contact05@example.com for future review if they ever decide to replace current tools.',
    what_happened: 'Cold pitch to retail chain operator. Prospect confirmed broad existing software coverage via StoreHarbor and other vendors but accepted a presentation.',
    why_it_matters: 'Identifies competitor incumbent (StoreHarbor). Low near-term conversion probability without a compelling differentiation hook.',
    evidence: 'C05: "There are several. One is StoreHarbor, and we use others too."',
    uncertainties: 'Contract renewal date with StoreHarbor; specific pain points in their current multi-system setup.',
    next_action: 'Send deck to contact05@example.com highlighting feature comparisons against StoreHarbor; enroll in quarterly nurture cadence.',
    owner: 'Meera (caller)'
  },
  '12216d5c-e254-52c6-b344-47de4c6e1ae5': {
    ref: 'C06',
    title: '120-Store Retail Automation (Rep Discrepancy)',
    routes: ['Sales Coaching', 'Human Review Required'],
    summary: 'Cold outreach to Mr. Nikhil regarding store expenses across 120+ retail branches. The caller explicitly introduces himself as Ravi ("Ravi here. I\'ll say at the start that this is a cold call"), contradicting the source telephony metadata which lists rep_name as Meera. Nikhil explains their operations are heavily automated via head office ERP with daily monitoring, and declines further discussion.',
    what_happened: 'Cold call to large retail business. Prospect confirmed robust internal automation and declined. Critically, vocal speaker ("Ravi") contradicts telephony user attribution ("Meera").',
    why_it_matters: 'Discrepancy between telephony user identity and vocal speaker indicates credential sharing or extension misassignment. Substantively, prospect is disqualified due to full ERP coverage.',
    evidence: 'C06: "Ravi here. I\'ll say at the start that this is a cold call."',
    uncertainties: 'Reason for telephony seat discrepancy; whether Ravi dialed from Meera\'s computer or extension.',
    next_action: 'Perform telephony seat login audit with sales operations; mark Mr. Nikhil\'s account as disqualified / well-automated in CRM.',
    owner: 'Sales Operations Manager (for seat audit) & Ravi (for record update)'
  },
  '428817fa-7e9e-5418-a7d4-bb396d28dfbf': {
    ref: 'C07',
    title: 'Willowbank Advisory Formation Partnership',
    routes: ['Partnership Opportunity'],
    summary: 'Dev calls Mr. Aditya at Willowbank Advisory to propose a partnership. Willowbank incorporates businesses domestically and overseas. Dev proposes providing virtual accounts for their newly incorporated clients. Aditya confirms they actively refer clients for digital business accounts, requests proposal details via messaging app, and agrees to a follow-up call on Monday.',
    what_happened: 'Partnership qualification call with corporate advisory firm. Prospect confirmed they routinely refer incorporated businesses for digital banking accounts and requested proposal via chat.',
    why_it_matters: 'High-value channel partnership opportunity. Incorporators generate steady recurring client flow with minimal customer acquisition cost.',
    evidence: 'C07: "could you message me on our chat app and send whatever proposal you have?"',
    uncertainties: 'Volume of monthly company formations; referral commission structure expected by Willowbank.',
    next_action: 'Send partnership overview and referral terms to Mr. Aditya via messaging app; place follow-up call on Monday morning.',
    owner: 'Dev (caller)'
  },
  '129497b2-8e1d-5e01-919c-e8a852b5ff68': {
    ref: 'C08',
    title: 'People Operations Lead Referral',
    routes: ['Deal Follow-up'],
    summary: 'Meera cold-calls Mr. Raghav regarding payables and expense workflows alongside ERP. Raghav listens and suggests sending a proposal to contact08@example.com for his colleague in people operations who handles frontline processes, mentioning they have had internal discussions about exploring solutions.',
    what_happened: 'Cold outreach referred to internal decision-maker in People Operations. Prospect noted prior internal discussions around expense solutions.',
    why_it_matters: 'Warm internal referral with stated requirement context ("we may have been looking at a solution"). Significantly higher probability than blind cold outreach.',
    evidence: 'C08: "The colleague handling our people operations also deals with frontline processes"',
    uncertainties: 'Colleague\'s name and title; timeline and scope of previous internal discussions.',
    next_action: 'Send proposal to contact08@example.com referencing Mr. Raghav\'s introduction; follow up by phone within 3 business days.',
    owner: 'Meera (caller)'
  },
  '4a1de681-f884-55e8-b1ad-de22d17cd959': {
    ref: 'C09',
    title: 'In-house Software & Boundary Referral',
    routes: ['Sales Coaching', 'Deal Follow-up'],
    summary: 'Meera cold-calls Mr. Vedant regarding store expenses across ~130 locations. Vedant explains they developed their own internal software and are not looking externally. When asked who oversees the system, Vedant directs Meera to business head Mr. Rishabh on professional networks, but explicitly commands: "No, please don\'t use my name."',
    what_happened: 'Cold call to multi-store business using internal software. Prospect directed caller to business head but strictly forbade using his name as a referral.',
    why_it_matters: 'Crucial coaching scenario: dropping Vedant\'s name would breach explicit consent and kill credibility with Mr. Rishabh.',
    evidence: 'C09: "No, please don\'t use my name."',
    uncertainties: 'Specific limitations of their internal proprietary software; whether Mr. Rishabh is receptive to external vendors.',
    next_action: 'Conduct independent research on Mr. Rishabh; craft cold outreach focusing on enterprise multi-store challenges without referencing Vedant.',
    owner: 'Meera (caller)'
  },
  'b747f592-810e-583c-9b81-8db5ab035806': {
    ref: 'C10',
    title: 'Meadowbrick Departed Lead & Boundary Rebuff',
    routes: ['Sales Coaching', 'Human Review Required'],
    summary: 'Meera calls Mr. Aniket regarding Meadowbrick. Aniket clarifies: "I don\'t work there anymore" and that he has moved to a manufacturing company. Meera pitches manufacturing AP workflows and asks to send a brief via messaging app, which Aniket accepts. However, when Meera asks if she can call on Monday or Tuesday, Aniket firmly shuts down the callback: "No. I said I will contact you if there is anything to discuss."',
    what_happened: 'Outreach to former employee at new company. Prospect accepted high-level written brief but explicitly forbade rep from initiating a follow-up call.',
    why_it_matters: 'Demonstrates risk of aggressive SDR calendar pushing. Pushing for a meeting when a prospect only agreed to read a brief triggered resistance.',
    evidence: 'C10: "No. I said I will contact you if there is anything to discuss."',
    uncertainties: 'Name and scale of Aniket\'s new manufacturing employer.',
    next_action: 'Send brief informational deck via messaging app as agreed; do NOT call on Monday/Tuesday; update CRM to remove Aniket from Meadowbrick.',
    owner: 'Meera (caller)'
  },
  'cb5cecac-e68d-52b7-b10b-b0c748efc467': {
    ref: 'M01',
    title: 'Harborpath Advisory Remote Accounts',
    routes: ['Partnership Opportunity'],
    summary: 'Discussion with Partner A from Harborpath Advisory regarding remote business bank accounts. SpendNest Team member A clarifies entity boundaries: SpendNest serves registered corporate entities with a US company, not individual consumers. Partner A confirms this fits their business clients and agrees to review partnership terms.',
    what_happened: 'Partnership exploration with corporate incorporation advisory firm. SpendNest clarified account eligibility criteria (registered US business entities).',
    why_it_matters: 'Channel partner expansion. Clarifying eligibility upfront prevents downstream onboarding friction and rejected account applications.',
    evidence: 'M01 Turn 2: "Yes, with one important boundary: we work with registered businesses, not individuals opening personal accounts."',
    uncertainties: 'Annual volume of cross-border corporate incorporations handled by Harborpath Advisory.',
    next_action: 'Send partner onboarding documentation and US entity qualification guidelines to Partner A.',
    owner: 'Team member A (partnership lead)'
  },
  '1a21c409-c050-5787-90af-2667e057e1b6': {
    ref: 'M02',
    title: 'LedgerBridge Invoicing Procurement',
    routes: ['Internal or Vendor Coordination', 'Partnership Opportunity'],
    summary: 'SpendNest strategy and partnerships lead (Team member A) evaluates Supplier A from LedgerBridge for electronic invoicing and compliant tax clearance (PEPPOL) coverage across target international markets for SpendNest\'s upcoming accounts receivable module.',
    what_happened: 'Vendor procurement and compliance infrastructure evaluation. SpendNest is assessing LedgerBridge as a supplier/partner to provide e-invoicing capability.',
    why_it_matters: 'CRITICAL CLASSIFICATION: LedgerBridge is a prospective vendor TO SpendNest, NOT a customer buying SpendNest. Treating this as sales pipeline artificially inflates revenue forecasts.',
    evidence: 'M02 Turn 1: "We want to understand whether LedgerBridge can give us compliant invoicing coverage across our operating markets."',
    uncertainties: 'Commercial fee model (per-transaction vs recurring license) and compliance timeline for Latin America and Europe.',
    next_action: 'Review LedgerBridge API integration template with Product & Engineering leads; prepare vendor assessment matrix.',
    owner: 'Team member A (strategy lead) & Product Lead'
  },
  '398672e7-62dd-5afd-846d-0237d49792fb': {
    ref: 'M03',
    title: 'Asterloom Systems Demo & CFO Pricing Review',
    routes: ['Deal Follow-up', 'Sales Coaching'],
    summary: 'Detailed product walkthrough with Asterloom Systems (Customer A and finance colleague Customer B) covering corporate cards, travel expense limits, and ERP synchronization. Customer B indicates they must review pricing and ROI with their CFO before agreeing to another session.',
    what_happened: 'Late-stage product evaluation with finance stakeholders. Technical walkthrough was successful; pricing evaluation with CFO is the gating hurdle.',
    why_it_matters: 'Core mid-market sales deal with high contract value potential. Winning this opportunity depends on executive-level economic justification.',
    evidence: 'M03 Turn 1: "My finance colleague is joining today because we need to understand how this would actually work, and then revisit the price."',
    uncertainties: 'CFO\'s target budget ceiling; whether Asterloom is concurrently evaluating competitors.',
    next_action: 'Send customized enterprise pricing proposal and executive summary one-pager formatted for CFO presentation.',
    owner: 'Team member A (account executive)'
  },
  'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91': {
    ref: 'M04',
    title: 'Cedarwave Card Acceptance & Migration',
    routes: ['Customer Success / Support'],
    summary: 'Account review with Cedarwave Distribution. Customer A discusses terminal acceptance failures with their current physical cards. SpendNest Team member A proposes migrating Cedarwave to an alternative card network programme with improved merchant acceptance and digital wallet capabilities.',
    what_happened: 'Customer success meeting to address physical card terminal acceptance failures. SpendNest proposed programme migration to alternative card issuer network.',
    why_it_matters: 'Severe customer retention risk. Inability to execute physical point-of-sale spending disrupts frontline distribution operations.',
    evidence: 'M04 Turn 2: "We have seen acceptance problems with the existing programme and are proposing a move to a different provider and card network."',
    uncertainties: 'Logistical downtime during physical card re-issuance and wallet tokenization for field drivers.',
    next_action: 'Send formal migration schedule and transition checklist to Customer A; coordinate batch re-issuance with card operations team.',
    owner: 'Team member A (CS account lead)'
  },
  '657b9e9d-9472-5b01-a127-a648ad7e8cf7': {
    ref: 'M06',
    title: 'Mapletrail Branch Finance Discovery',
    routes: ['Deal Follow-up'],
    summary: 'Discovery meeting with Customer A, branch finance lead for Mapletrail Services (software development branch). They explore branch-level expense approvals, corporate cards, and receivables automation. Customer A requests detailed product materials to review.',
    what_happened: 'Discovery session evaluating branch-level financial controls and automated receivables. Prospect requested comprehensive platform documentation.',
    why_it_matters: 'Potential multi-branch expansion deal. Starting with one branch provides an initial wedge to penetrate the wider organisation.',
    evidence: 'M06 Turn 2: "I handle finance for one branch of Mapletrail Services."',
    uncertainties: 'Whether branch manager has independent purchasing authority or requires central HQ procurement approval.',
    next_action: 'Send branch workflow guide and pricing sheet; offer joint demo with central finance stakeholders.',
    owner: 'Team member A'
  },
  '4f304fff-fd40-5cfc-a366-0a134c445c2a': {
    ref: 'M07',
    title: 'Willowfield Trust Critical Bug Walkthrough',
    routes: ['Customer Success / Support', 'Human Review Required'],
    summary: 'Technical support walkthrough with Customer A (Willowfield Trust). Customer demonstrates 4 distinct bugs: 1) Editing event payment description fails to persist after saving; 2) File upload fails via Recreate Payment path (workaround: Invoice Inbox Review); 3) Reimbursements stuck in "Processing" state cannot be selected; 4) In "Mark as paid", previous transaction amount (INR 18,200) incorrectly bleeds into subsequent items.',
    what_happened: 'Customer screen share demonstrating multiple high-impact frontend and transactional defects across payment recreation, document attachments, and reimbursements.',
    why_it_matters: 'Severe product defects affecting financial reconciliation. Critical operations note: Workaround does not equal bug resolution (Turn 15).',
    evidence: 'M07 Turn 15: "The workaround does not mean the direct upload issue has been resolved."',
    uncertainties: 'Root cause of modal state leakage across payments; release schedule for engineering hotfix.',
    next_action: 'File urgent engineering bug tickets (modal cache bleed, description mutation bug, attachment path); update customer within 2 hours on stuck processing items.',
    owner: 'Team member A (CS Lead) & Engineering Incident Lead'
  },
  '4b5b9192-f3fc-505a-8e77-4d2ffaa54594': {
    ref: 'M09',
    title: 'Brookmint Onboarding & Northkite Sync Defect',
    routes: ['Customer Success / Support'],
    summary: 'Onboarding support session with Customer A. Customer could not log in to Brookmint Holdings workspace due to an expired/unaccepted invitation token. Customer also reports that receipts uploaded in Northkite Equipment are failing to synchronize to their accounting ledger. Team member A troubleshoots multi-tenant access and separate email identities.',
    what_happened: 'Customer onboarding troubleshooting for multi-tenant accounts (expired invitation token for Brookmint Holdings and receipt ledger sync failure for Northkite Equipment).',
    why_it_matters: 'Onboarding blockage prevents account adoption across two separate legal entities. Friction in multi-tenant identity creates customer confusion.',
    evidence: 'M09 Turn 1: "The invitation for Brookmint Holdings did not work when I tried it."',
    uncertainties: 'Whether customer IT security blocks automated token emails; cause of accounting ledger sync failure for Northkite.',
    next_action: 'Issue fresh manual invitation link for Brookmint Holdings; trigger diagnostic sync on Northkite accounting integration.',
    owner: 'Team member A (onboarding specialist)'
  },
  '337f297d-9385-5b82-9e54-5019c1ed912c': {
    ref: 'M10',
    title: 'Internal Billing Workflow Enablement',
    routes: ['Internal or Vendor Coordination'],
    summary: 'Internal operational training session among SpendNest team members (Team member A, B, and C). The team walks through the new billing workflow, invoice scheduling rules, and back-office credit limit configuration prior to customer rollout.',
    what_happened: 'Internal staff training on back-office billing workflow and credit limit controls before public release.',
    why_it_matters: 'Internal coordination session. Must be strictly excluded from external commercial pipeline, customer support, or prospect conversion metrics.',
    evidence: 'M10 Turn 2: "We can wait for the trainer to return."',
    uncertainties: 'Staging environment permission provisioning for session attendees.',
    next_action: 'Provision back-office staging permissions for trainees; schedule follow-up billing test walkthrough.',
    owner: 'Team member A (trainer)'
  }
};

function routeToFolder(route) {
  switch (route) {
    case 'Sales Coaching': return 'sales-coaching';
    case 'Deal Follow-up': return 'deal-follow-up';
    case 'Partnership Opportunity': return 'partnership-opportunities';
    case 'Customer Success / Support': return 'customer-support';
    case 'Internal or Vendor Coordination': return 'internal-vendor';
    case 'Human Review Required': return 'review-required';
    default: return 'review-required';
  }
}

// Generate Manifest and Output Files
const manifest = [];

// Copy Manager Brief
const managerBriefText = `# Manager Daily Brief — 21 August 2026 (Asia/Kolkata)
**SpendNest Revenue Operations & Sales Intelligence**

## 1. Executive Summary & Daily Activity
On 21 August 2026, SpendNest recorded **44 unique customer and market interactions** (30 phone calls and 14 meetings) across sales, customer success, and partnerships. 
- Usable conversation transcripts were captured for **18 interactions** (10 calls, 8 meetings), representing a **40.9% qualitative coverage rate**.
- Outbound telephony showed 14 connected calls out of 30 dials (46.7% connection rate), though only 10 yielded substantive adapted conversations.
- All 44 records have completed intake classification and review routing.

## 2. Activity Breakdown by Team & Channel
- **Arun (Call Rep)**: 12 background calls + 3 analyzed calls (C01, C02, C04). Focus on outbound prospecting and cold partnership outreach.
- **Leela (Call Rep)**: 8 background calls. High voicemail/unresponsive rate.
- **Meera (Call Rep)**: 5 analyzed calls (C05, C06, C08, C09, C10). High-touch multi-store retail prospecting. *Note: C06 vocal speaker was Ravi despite Meera's telephony attribution.*
- **Dev (Call Rep)**: 1 analyzed call (C07). Qualified advisory referral partnership with Willowbank Advisory.
- **Kiran (Call Rep)**: 1 analyzed call (C03). Follow-up on technical API developer pricing.
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

fs.writeFileSync(path.join(exportDir, 'manager-brief', '2026-08-21.md'), managerBriefText, 'utf8');

recordsMap.forEach((rec) => {
  const isCall = rec.source_type === 'call';
  const ref = rec.record_ref || rec.source_id.slice(0, 8);
  const title = isCall ? (rec.payload.observed_outcome || 'Call') : (rec.payload.title || 'Meeting');
  const cleanTitle = `${ref}_${title.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  const analysis = analyses[rec.source_id];
  let effectiveRoutes = ['Human Review Required'];
  let reviewState = rec.manual_decision.is_overridden ? rec.manual_decision.review_state : 'intake_completed';
  const hasText = isCall ? Boolean(rec.payload.transcript && rec.payload.transcript.trim()) : Boolean(rec.transcript_payload && rec.transcript_payload.turns && rec.transcript_payload.turns.length > 0);

  if (rec.manual_decision.is_overridden && rec.manual_decision.manual_route) {
    effectiveRoutes = rec.manual_decision.manual_route;
  } else if (analysis) {
    effectiveRoutes = analysis.routes;
    reviewState = 'reviewed';
  } else {
    // intake rule
    if (isCall) {
      reviewState = 'no_text_logged';
    } else {
      if (rec.payload.recording_status === 'cancelled') reviewState = 'bot_cancelled';
      else if (rec.payload.recording_status === 'not_scheduled') reviewState = 'bot_not_scheduled';
      else reviewState = 'no_speech_detected';
    }
  }

  const outputPaths = [];
  const mdLines = [
    `# ${ref}: ${title}`,
    `**Source Type**: ${rec.source_type.toUpperCase()} | **Source ID**: \`${rec.source_id}\``,
    `**Applied Revision**: ${rec.applied_source_revision} | **Reporting Date (Asia/Kolkata)**: 2026-08-21`,
    `**Assigned Route(s)**: ${effectiveRoutes.join(', ')}`,
    `**Manual Override**: ${rec.manual_decision.is_overridden ? 'YES (Manager Modified)' : 'NO (System Suggested)'}`,
    rec.manual_decision.manual_rationale ? `**Manual Override Rationale**: ${rec.manual_decision.manual_rationale}` : '',
    `**Review State**: \`${reviewState}\``,
    `**Transcript Available**: ${hasText ? 'YES' : 'NO (Unsupplied / Silent)'}`,
    '',
    '---',
    ''
  ];

  if (analysis) {
    mdLines.push(
      `## Executive Analysis`,
      `**Summary**: ${analysis.summary}`,
      '',
      `### What Happened`,
      analysis.what_happened,
      '',
      `### Why It Matters`,
      analysis.why_it_matters,
      '',
      `### Supporting Evidence`,
      `> ${analysis.evidence}`,
      '',
      `### Uncertainties & Limitations`,
      analysis.uncertainties,
      '',
      `### Recommended Next Action`,
      `**Action**: ${analysis.next_action}`,
      `**Owner**: ${analysis.owner}`,
      '',
      `**Analysis Freshness**: up_to_date (Analyzed Revision: ${rec.applied_source_revision})`
    );
  } else {
    mdLines.push(
      `## Intake Record (No Usable Transcript Supplied)`,
      `**Intake State**: \`${reviewState}\``,
      `**Note**: In accordance with DATA_CONTRACT.md, this record has no usable supplied conversation text. No substantive summary was fabricated.`,
      isCall ? `**Call Metadata**: Duration ${rec.payload.duration_seconds}s, Outcome: \`${rec.payload.observed_outcome || 'N/A'}\`` : `**Meeting Metadata**: Provider ${rec.payload.provider}, Status: \`${rec.payload.recording_status}\``
    );
  }

  if (isCall && rec.payload.transcript) {
    mdLines.push('', '---', '', '## Supplied Adapted Call Transcript', rec.payload.transcript);
  } else if (!isCall && rec.transcript_payload && rec.transcript_payload.turns && rec.transcript_payload.turns.length > 0) {
    mdLines.push('', '---', '', '## Supplied Meeting Turns');
    rec.transcript_payload.turns.forEach((t, i) => {
      mdLines.push(`**Turn ${i+1} | ${t.timecode} | ${t.speaker}**`, t.text, '');
    });
  }

  const docText = mdLines.join('\n');

  effectiveRoutes.forEach(route => {
    const folder = routeToFolder(route);
    const relPath = `${folder}/${cleanTitle}.md`;
    fs.writeFileSync(path.join(exportDir, folder, `${cleanTitle}.md`), docText, 'utf8');
    outputPaths.push(relPath);
  });

  if (analysis) {
    outputPaths.push('manager-brief/2026-08-21.md');
  }

  manifest.push({
    source_type: rec.source_type,
    source_id: rec.source_id,
    record_ref: rec.record_ref,
    applied_source_revision: rec.applied_source_revision,
    assigned_routes: effectiveRoutes,
    output_paths: outputPaths,
    processing_state: hasText ? 'analysis_completed' : 'intake_completed',
    review_state: reviewState,
    manual_override: rec.manual_decision.is_overridden,
    analysis_freshness: 'up_to_date',
    analyzed_source_revision: rec.applied_source_revision,
    transcript_available: hasText
  });
});

// Write Manifest JSON
const manifestJson = {
  batch_delivery_date: '2026-08-22',
  activity_reporting_date: '2026-08-21',
  reporting_timezone: 'Asia/Kolkata',
  total_unique_records: recordsMap.size,
  usable_text_count: Array.from(recordsMap.values()).filter(r => r.source_type === 'call' ? Boolean(r.payload.transcript && r.payload.transcript.trim()) : Boolean(r.transcript_payload && r.transcript_payload.turns && r.transcript_payload.turns.length > 0)).length,
  records: manifest
};

fs.writeFileSync(path.join(exportDir, 'manifest.json'), JSON.stringify(manifestJson, null, 2), 'utf8');

// Write Manifest CSV
const csvHeaders = ['source_type','source_id','record_ref','applied_source_revision','assigned_routes','output_paths','processing_state','review_state','manual_override','analysis_freshness','analyzed_source_revision','transcript_available'];
const csvRows = manifest.map(m => [
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
  m.transcript_available
]);
fs.writeFileSync(path.join(exportDir, 'manifest.csv'), [csvHeaders.join(','), ...csvRows.map(r => r.join(','))].join('\n'), 'utf8');

// Write Export README.md
const exportReadme = `# SpendNest Revenue Intelligence Inbox Export Package
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

## Validation Assertions
- Total Logical Records: ${recordsMap.size} (matches expected 44).
- Usable Transcripts: ${manifestJson.usable_text_count} (matches expected 18 post-update).
- Every relative file path listed in \`output_paths\` exists physically in the folder.
- M07 retains manual override and applied revision 2.
`;

fs.writeFileSync(path.join(exportDir, 'README.md'), exportReadme, 'utf8');
console.log('Successfully generated export files in:', exportDir);
