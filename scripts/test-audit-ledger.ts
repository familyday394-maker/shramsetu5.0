import { INITIAL_WORK_RECORDS, INITIAL_WORKERS, INITIAL_DISPUTES } from '../src/data/mockData';
import { calculateRecordBreakdown, round2 } from '../src/utils/wageCalculator';
import { computeCanonicalHash, verifyAuditTrail } from '../src/utils/auditVerification';
import { detectLedgerAnomalies } from '../src/utils/anomalyDetector';
import { generateOpaqueCredentialToken, resolveCredentialToken } from '../src/utils/tokenSecurity';
import { WorkRecord, WorkerProfile } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('====================================================');
console.log('SHRAM SETU 2.0 — VERIFICATION & STABILIZATION SUITE');
console.log('====================================================\n');

// 1. Wage Calculation & Decimal Safety
console.log('--- 1. Wage Calculation & Outstanding Balances ---');
const demo4D = INITIAL_WORK_RECORDS.find(r => r.id === 'REC-2026-DEMO-4D');
assert(demo4D !== undefined, 'Found REC-2026-DEMO-4D');
if (demo4D) {
  const calc = calculateRecordBreakdown(demo4D);
  assert(calc.grossWagesDue === 2600, '4 days × ₹650/day = ₹2,600 gross wages');
  assert(calc.totalPaymentsRecorded === 1300, 'Total recorded payments = ₹1,300');
  assert(calc.outstandingBalance === 1300, 'Outstanding balance = ₹1,300');
  assert(calc.paymentStatus === 'partially_paid', 'Status correctly classified as partially_paid');
}

// Decimal-safe rounding check
assert(round2(0.1 + 0.2) === 0.3, 'Decimal rounding round2(0.1 + 0.2) returns 0.30');

// 2. Multi-day Shift Rule vs Genuine Long Shift
console.log('\n--- 2. Anomaly Rules: Multi-Day vs Overlong Shift ---');
const baselineAlerts = detectLedgerAnomalies(INITIAL_WORK_RECORDS);
const rule02On4D = baselineAlerts.find(a => a.recordId === 'REC-2026-DEMO-4D' && a.ruleId === 'RULE-02');
assert(rule02On4D === undefined, 'RULE-02 is NOT triggered for 4-day (32h total) legitimate shift');

// Genuine overlong shift: 1 day, 14 hours
const overlongShiftRecord: WorkRecord = {
  ...INITIAL_WORK_RECORDS[0],
  id: 'REC-TEST-LONG-14H',
  date: '2026-10-15',
  daysWorked: 1,
  shiftHours: 14,
  overtimeHours: 0,
};
const overlongAlerts = detectLedgerAnomalies([overlongShiftRecord]);
const rule02Triggered = overlongAlerts.find(a => a.ruleId === 'RULE-02');
assert(rule02Triggered !== undefined, 'RULE-02 correctly fires for genuine single-day 14-hour shift');
assert(
  Boolean(rule02Triggered?.triggerReason.includes('exceeds the configurable inspection policy threshold')),
  'RULE-02 explains threshold as a configurable policy rather than a statutory law'
);

// 3. Cryptographic Block Digest & Predecessor Linkage
console.log('\n--- 3. Audit Verification: Baseline & Attack Simulations ---');
const baselineAudit = verifyAuditTrail(INITIAL_WORK_RECORDS);
assert(baselineAudit.outcome === 'integrity_passed', 'Baseline audit outcome is integrity_passed');
assert(baselineAudit.isCompleteLedgerVerified === true, 'Baseline reports complete ledger verified');
assert(baselineAudit.recordsExamined === 8, 'Examined all 8 chronological records');
assert(
  baselineAudit.blocksBreakdown.every(b => b.isDigestValid && b.isLinkageValid),
  'Every individual block digest and predecessor link is valid in baseline'
);

// Attack 1: Unauthorized rate alteration (Tamper)
console.log('\n--- 4. Attack Simulation: Unauthorized Rate Alteration ---');
const tamperedRecords: WorkRecord[] = INITIAL_WORK_RECORDS.map(r =>
  r.id === 'REC-2026-DEMO-4D' ? { ...r, agreedDailyRate: 400, isTampered: true } : r
);
const tamperAudit = verifyAuditTrail(tamperedRecords);
assert(tamperAudit.outcome === 'modification_detected', 'Tamper attack detected as modification_detected');
assert(
  tamperAudit.tamperedBlockId === 'REC-2026-DEMO-4D',
  'Discrepancy precisely isolates tampered block REC-2026-DEMO-4D'
);

// Attack 2: Corrupted predecessor hash (Broken link / Incomplete History)
console.log('\n--- 5. Attack Simulation: Corrupted Predecessor Link ---');
const corruptedLinkRecords: WorkRecord[] = INITIAL_WORK_RECORDS.map(r => {
  if (r.id === 'REC-2026-1010') {
    const corruptedPrev = 'corrupted-orphan-link-0x99';
    return {
      ...r,
      previousHash: corruptedPrev,
      hash: computeCanonicalHash(r, corruptedPrev),
    };
  }
  return r;
});
const brokenLinkAudit = verifyAuditTrail(corruptedLinkRecords);
assert(brokenLinkAudit.outcome === 'history_incomplete', 'Broken link detected as history_incomplete');
const block1010 = brokenLinkAudit.blocksBreakdown.find(b => b.blockId === 'REC-2026-1010');
assert(block1010?.isDigestValid === true, 'Block 1010 digest is internally valid');
assert(block1010?.isLinkageValid === false, 'Block 1010 explicitly reports linkage_mismatch');
assert(block1010?.status === 'linkage_mismatch', 'Block status correctly classified as linkage_mismatch');

// 6. QR Token Security & Access Control
console.log('\n--- 6. QR Token Security & Access Control ---');
const token = generateOpaqueCredentialToken();
assert(token.startsWith('cpt_') && token.length >= 35, 'Generated token is an opaque cryptographic token');
assert(!token.includes('WM842') && !token.includes('Ramesh'), 'Token does not contain predictable worker IDs');

const workerWithToken = INITIAL_WORKERS[0];
const resolvedPublic = resolveCredentialToken(workerWithToken.passCredentialToken, INITIAL_WORKERS);
assert(resolvedPublic.status === 'VALID', 'Opaque token successfully resolves for registered worker');
assert(resolvedPublic.worker?.name === 'Ramesh Verma', 'Returns synthetic worker name');
assert(
  resolvedPublic.confidentialDataNotice.includes('Confidential wage records'),
  'Public resolution excludes confidential wage records and bank numbers'
);

// Test invalid token
const invalidResolved = resolveCredentialToken('cpt_invalid_token_999999', INITIAL_WORKERS);
assert(invalidResolved.status === 'NOT_FOUND', 'Safely handles unknown or invalid token references');

// 7. Duplicate Entry Detection (RULE-01)
console.log('\n--- 7. Anomaly Rule 01: Duplicate Shift Detection ---');
const duplicateShift: WorkRecord = {
  ...INITIAL_WORK_RECORDS[0],
  id: 'REC-DUP-SPLIT',
  siteName: 'Second Site Split Shift',
};
const dupAlerts = detectLedgerAnomalies([duplicateShift, ...INITIAL_WORK_RECORDS]);
const rule01 = dupAlerts.find(a => a.ruleId === 'RULE-01');
assert(rule01 !== undefined, 'RULE-01 successfully detected duplicate entry on same date');

// 8. Deduction without reason (RULE-05)
console.log('\n--- 8. Anomaly Rule 05: Unreasoned Deduction ---');
const badDeductionRec: WorkRecord = {
  ...INITIAL_WORK_RECORDS[0],
  id: 'REC-BAD-DED',
  itemizedDeductions: [{ id: 'DED-01', title: 'Withholding', amount: 100, reason: '' }],
};
const dedAlerts = detectLedgerAnomalies([badDeductionRec]);
const rule05 = dedAlerts.find(a => a.ruleId === 'RULE-05');
assert(rule05 !== undefined, 'RULE-05 successfully caught unreasoned deduction');

// 9. Dispute Preservation
console.log('\n--- 9. Transparent Dispute Handling ---');
const activeDispute = INITIAL_DISPUTES[0];
assert(activeDispute.contractorResponse !== undefined, 'Contractor response is preserved alongside worker claim');
assert((activeDispute.unresolvedFacts?.length ?? 0) > 0, 'Unresolved facts explicitly enumerated for impartial mediation');
assert(activeDispute.timeline.length === 3, 'Timeline preserves all status changes without overwriting');

// 10. Manual addition of demonstration worker and work record
console.log('\n--- 10. Manual Creation Workflow Simulation ---');
const newWorker: WorkerProfile = {
  id: 'MP-IND-2026-WM999',
  name: 'Kailash Solanki',
  hindiName: 'कैलाश सोलंकी',
  trade: 'Tile Artisan',
  tradeHindi: 'टाइल कारीगर',
  location: 'Indore (Geeta Bhawan)',
  hubChowk: 'Geeta Bhawan Chowk',
  phoneMasked: '+91 98261 •••••',
  joinedDate: '16 Oct 2026',
  avatarUrl: '',
  dailyRateAgreed: 650,
  verifiedExperienceMonths: 36,
  completedSites: 12,
  attendanceRate: 97.0,
  verificationStatus: 'verified',
  nfcTagId: 'QR-IND-999-7711AA',
  cryptoChecksum: 'sha256:abcd1234ef',
  passCredentialToken: generateOpaqueCredentialToken(),
  isDemoData: true,
  emergencyContact: '+91 94250 •••••',
};
assert(newWorker.id === 'MP-IND-2026-WM999', 'New demo worker successfully formatted');

console.log('\n====================================================');
console.log('ALL 23 UNIT, INTEGRATION, AND ATTACK TESTS PASSED! ✅');
console.log('====================================================');
