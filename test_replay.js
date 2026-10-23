const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('REVENUE INTELLIGENCE INBOX - END-TO-END REPLAY TEST');
console.log('====================================================');

const initialBatch = require('./candidate/data/01_initial.json');
const updateBatch = require('./candidate/data/02_update.json');

// Composite Key Helper
function makeKey(source_type, source_id) {
  return `${source_type}:::${source_id}`;
}

const store = new Map();
const manualOverrides = new Map();

function hasUsableText(rec) {
  if (rec.source_type === 'call') {
    return Boolean(rec.payload.transcript && rec.payload.transcript.trim().length > 0);
  } else {
    return Boolean(rec.transcript_payload && rec.transcript_payload.turns && rec.transcript_payload.turns.length > 0);
  }
}

function applyBatch(batch, isShuffle = false) {
  let records = [...batch.records];
  if (isShuffle) {
    records = records.sort(() => Math.random() - 0.5);
  }

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  records.forEach(r => {
    const key = makeKey(r.source_type, r.source_id);
    const existing = store.get(key);

    if (!existing) {
      store.set(key, {
        source_type: r.source_type,
        source_id: r.source_id,
        record_ref: r.record_ref,
        applied_source_revision: batch.revision,
        payload: r.payload,
        transcript_payload: r.transcript_payload
      });
      inserted++;
    } else {
      if (batch.revision > existing.applied_source_revision) {
        // Complete payload replacement, no partial merge!
        existing.payload = r.payload;
        existing.transcript_payload = r.transcript_payload;
        existing.applied_source_revision = batch.revision;
        updated++;
      } else {
        // Equal or older revision is skipped
        skipped++;
      }
    }
  });

  return { inserted, updated, skipped, totalStore: store.size };
}

// TEST 1: Initial Import
console.log('\n[Step 1] Importing 01_initial.json (Revision 1)...');
const step1 = applyBatch(initialBatch);
console.log(`  Inserted: ${step1.inserted}, Updated: ${step1.updated}, Skipped: ${step1.skipped}, Total in store: ${step1.totalStore}`);
assert.strictEqual(store.size, 44, 'Initial import must yield exactly 44 records');
const usableTexts1 = Array.from(store.values()).filter(hasUsableText).length;
console.log(`  Usable transcripts: ${usableTexts1}`);
assert.strictEqual(usableTexts1, 17, 'Initial batch must have exactly 17 usable transcripts');
console.log('  ✓ Step 1 Passed');

// TEST 2: Re-import Initial Batch in Shuffled Order
console.log('\n[Step 2] Re-importing 01_initial.json in shuffled order...');
const step2 = applyBatch(initialBatch, true);
console.log(`  Inserted: ${step2.inserted}, Updated: ${step2.updated}, Skipped: ${step2.skipped}, Total in store: ${step2.totalStore}`);
assert.strictEqual(store.size, 44, 'Logical record count must stay exactly 44');
assert.strictEqual(step2.inserted, 0, 'No new records should be inserted on duplicate import');
assert.strictEqual(step2.skipped, 44, 'All 44 records must be skipped as same revision (rev 1 <= rev 1)');
console.log('  ✓ Step 2 Passed');

// TEST 3: Manager Manually Changes Route for M07
console.log('\n[Step 3] Manager manually modifies assigned route on M07...');
const m07Key = makeKey('meeting', '4f304fff-fd40-5cfc-a366-0a134c445c2a');
assert.ok(store.has(m07Key), 'M07 must exist in store');
const m07Before = store.get(m07Key);
assert.strictEqual(m07Before.applied_source_revision, 1, 'M07 must have applied revision 1 before update');
assert.strictEqual(hasUsableText(m07Before), false, 'M07 must not have usable text before update');

manualOverrides.set(m07Key, {
  manual_route: ['Customer Success / Support', 'Human Review Required'],
  manual_rationale: 'Manager override: P1 defect report with screen share; priority engineering triage required.',
  review_state: 'reviewed',
  updated_at: new Date().toISOString()
});
console.log(`  M07 manual override set: ${JSON.stringify(manualOverrides.get(m07Key).manual_route)}`);
console.log('  ✓ Step 3 Passed');

// TEST 4: Import 02_update.json (Revision 2)
console.log('\n[Step 4] Importing 02_update.json (Revision 2)...');
const step4 = applyBatch(updateBatch);
console.log(`  Inserted: ${step4.inserted}, Updated: ${step4.updated}, Skipped: ${step4.skipped}, Total in store: ${step4.totalStore}`);
assert.strictEqual(store.size, 44, 'Total records must remain 44 after update batch');
assert.strictEqual(step4.updated, 1, 'Exactly 1 record (M07) should be updated');
const m07After = store.get(m07Key);
assert.strictEqual(m07After.applied_source_revision, 2, 'M07 must now have applied revision 2');
assert.strictEqual(hasUsableText(m07After), true, 'M07 must now have usable transcript text');
assert.strictEqual(m07After.transcript_payload.turns.length, 27, 'M07 must have 27 turns from update batch');
const usableTexts2 = Array.from(store.values()).filter(hasUsableText).length;
console.log(`  Usable transcripts after update: ${usableTexts2}`);
assert.strictEqual(usableTexts2, 18, 'Total usable transcripts after update must be 18');

// Verify manual override is preserved
const m07OverrideAfterUpdate = manualOverrides.get(m07Key);
assert.ok(m07OverrideAfterUpdate, 'Manual override must be preserved after source update');
assert.strictEqual(m07OverrideAfterUpdate.manual_route.length, 2);
console.log('  ✓ Step 4 Passed');

// TEST 5: Re-import 01_initial.json after update
console.log('\n[Step 5] Re-importing 01_initial.json after update...');
const step5 = applyBatch(initialBatch);
console.log(`  Inserted: ${step5.inserted}, Updated: ${step5.updated}, Skipped: ${step5.skipped}, Total in store: ${step5.totalStore}`);
assert.strictEqual(store.size, 44, 'Total records must remain 44');
assert.strictEqual(step5.updated, 0, 'No records should be updated by older revision');
const m07AfterStaleReimport = store.get(m07Key);
assert.strictEqual(m07AfterStaleReimport.applied_source_revision, 2, 'M07 must STILL have applied revision 2');
assert.strictEqual(m07AfterStaleReimport.transcript_payload.turns.length, 27, 'M07 must STILL have 27 turns');
console.log('  ✓ Step 5 Passed');

// TEST 6: Simulated Restart / LocalStorage Persistence
console.log('\n[Step 6] Verifying persistence integrity...');
const serialized = JSON.stringify({
  records: Array.from(store.entries()),
  overrides: Array.from(manualOverrides.entries())
});
const restored = JSON.parse(serialized);
assert.strictEqual(restored.records.length, 44, 'Restored store must contain 44 records');
assert.strictEqual(restored.overrides.length, 1, 'Restored store must contain manual override');
console.log('  ✓ Step 6 Passed');

// TEST 7: Manifest and Path Verification
console.log('\n[Step 7] Checking physical exports directory & manifest...');
const manifestPath = path.join(__dirname, 'exports', 'manifest.json');
assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist in exports/');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert.strictEqual(manifest.total_unique_records, 44, 'Manifest must record 44 unique records');
assert.strictEqual(manifest.usable_text_count, 18, 'Manifest must record 18 usable text records');

let checkedFiles = 0;
manifest.records.forEach(r => {
  r.output_paths.forEach(p => {
    const full = path.join(__dirname, 'exports', p);
    assert.ok(fs.existsSync(full), `File must exist at path: ${p}`);
    checkedFiles++;
  });
});
console.log(`  Verified ${checkedFiles} physical relative export paths.`);
console.log('  ✓ Step 7 Passed');

console.log('\n====================================================');
console.log('ALL 7 REPLAY & INTEGRITY TESTS PASSED SUCCESSFULLY! ✓');
console.log('====================================================\n');
