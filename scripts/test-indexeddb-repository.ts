import { IndexedDBRepository } from '../src/services/repository/indexedDBRepo';
import { WorkRecord, ApprovalRequest } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

async function runGroup1Tests() {
  console.log('====================================================');
  console.log('GROUP 1 TEST SUITE: INDEXEDDB & REPOSITORY CONTRACTS');
  console.log('====================================================');

  const repo = new IndexedDBRepository();
  await repo.init();

  // Test 1: Status & Local Demo Mode disclosure
  console.log('\n--- 1. Storage Status & Local Demo Mode Disclosure ---');
  const status = await repo.getStatus();
  assert(status.isLocalDemoMode === true, 'isLocalDemoMode flag is explicitly TRUE');
  assert(status.isSupabaseConnected === false, 'isSupabaseConnected flag is explicitly FALSE');
  assert(
    status.notice.includes('Local Demo Mode') && status.notice.includes('next week'),
    'Notice transparently states Local Demo Mode active and Supabase scheduled for next week'
  );
  assert(status.details.recordsCount === 8, `Initial records count is 8 (got ${status.details.recordsCount})`);
  assert(status.details.workersCount === 4, `Initial workers count is 4 (got ${status.details.workersCount})`);
  assert(status.details.disputesCount === 2, `Initial disputes count is 2 (got ${status.details.disputesCount})`);
  assert(status.details.approvalRequestsCount === 2, `Initial approval requests count is 2 (got ${status.details.approvalRequestsCount})`);

  // Test 2: Workers query and lookup
  console.log('\n--- 2. Workers Lookup & Access ---');
  const workers = await repo.getWorkers();
  assert(workers.length === 4, 'Fetched 4 workers from repository');
  const ramesh = await repo.getWorkerById('MP-IND-2026-WM842');
  assert(ramesh !== null && ramesh.name === 'Ramesh Verma', 'Successfully looked up Ramesh Verma by ID');
  const sunita = await repo.getWorkerById('MP-IND-2026-WM715');
  assert(sunita !== null && sunita.name === 'Sunita Bai', 'Successfully looked up Sunita Bai by ID');

  // Test 3: Work Records Retrieval & Sorting
  console.log('\n--- 3. Work Records Verification ---');
  const records = await repo.getRecords();
  assert(records.length === 8, 'Retrieved all 8 ledger records');
  assert(records[0].date >= records[records.length - 1].date, 'Records returned in sorted chronological sequence');

  // Test 4: Record Insertion, Update & Deletion
  console.log('\n--- 4. Record CRUD Operations ---');
  const testRecord: WorkRecord = {
    id: 'REC-TEST-GRP1-01',
    workerId: 'MP-IND-2026-WM842',
    date: '2026-10-16',
    siteName: 'Test Metro Site',
    siteLocation: 'Indore',
    contractorName: 'Test Contractor',
    contractorPhone: '+91 99999 88888',
    tradeRole: 'Mason',
    shiftHours: 8,
    overtimeHours: 0,
    agreedDailyRate: 650,
    overtimeRate: 120,
    earnedWage: 650,
    paidAmount: 0,
    balanceDue: 650,
    status: 'verified',
    hash: 'test_hash_val_001',
    previousHash: 'test_prev_hash_000',
  };

  await repo.saveRecord(testRecord);
  let fetched = await repo.getRecordById('REC-TEST-GRP1-01');
  assert(fetched !== null && fetched.siteName === 'Test Metro Site', 'Record saved and fetched by ID');

  testRecord.paidAmount = 650;
  testRecord.balanceDue = 0;
  await repo.updateRecord(testRecord);
  fetched = await repo.getRecordById('REC-TEST-GRP1-01');
  assert(fetched !== null && fetched.paidAmount === 650 && fetched.balanceDue === 0, 'Record updated successfully');

  await repo.deleteRecord('REC-TEST-GRP1-01');
  fetched = await repo.getRecordById('REC-TEST-GRP1-01');
  assert(fetched === null, 'Record deleted successfully');

  // Test 5: Simulated Cross-Device Approval Requests
  console.log('\n--- 5. Simulated Cross-Device Approval Requests ---');
  const approvalRequests = await repo.getApprovalRequests();
  assert(approvalRequests.length === 2, 'Loaded initial simulated approval requests');
  approvalRequests.forEach(req => {
    assert(
      req.status.startsWith('simulated_'),
      `Approval request ${req.id} status is strictly prefixed with simulated_ (got ${req.status})`
    );
    assert(
      req.simulationDisclaimer.includes('Simulated Cross-Device Request') &&
        req.simulationDisclaimer.includes('Supabase deployment next week'),
      `Approval request ${req.id} carries explicit simulation disclaimer`
    );
  });

  // Create new simulated approval request
  const newSimReq: ApprovalRequest = {
    id: 'REQ-TEST-NEW',
    type: 'wage_payment_disbursement',
    workRecordId: 'REC-2026-1008',
    requesterRole: 'contractor',
    requesterName: 'Alok Sharma',
    targetWorkerId: 'MP-IND-2026-WM842',
    targetWorkerName: 'Ramesh Verma',
    title: 'Disbursement Confirmation',
    summary: 'Direct bank transfer of ₹750 for 2026-10-08 shift',
    amount: 750,
    createdAt: '2026-10-16 10:00 IST',
    status: 'simulated_pending',
    simulationDisclaimer:
      'Simulated Cross-Device Request: In Local Demo Mode, this approval request is simulated locally via IndexedDB. Multi-device sync will be enabled with Supabase deployment next week.',
  };
  await repo.saveApprovalRequest(newSimReq);
  let allApprovals = await repo.getApprovalRequests();
  assert(allApprovals.length === 3, 'Saved new simulated cross-device approval request');

  newSimReq.status = 'simulated_approved';
  newSimReq.respondedAt = '2026-10-16 10:05 IST';
  newSimReq.responseNote = 'Worker confirmed receipt via local pass simulation';
  await repo.updateApprovalRequest(newSimReq);

  allApprovals = await repo.getApprovalRequests();
  const updatedReq = allApprovals.find(a => a.id === 'REQ-TEST-NEW');
  assert(updatedReq?.status === 'simulated_approved', 'Successfully approved simulated request in IndexedDB repo');

  // Test 6: Reset to baseline
  console.log('\n--- 6. Reset to Authoritative Demonstration Baseline ---');
  await repo.resetToBaseline();
  const resetStatus = await repo.getStatus();
  assert(resetStatus.details.recordsCount === 8, 'Records reset to exactly 8 baseline blocks');
  assert(resetStatus.details.approvalRequestsCount === 2, 'Approval requests reset to initial 2 baseline requests');

  console.log('\n====================================================');
  console.log('ALL GROUP 1 REPOSITORY & INDEXEDDB TESTS PASSED! ✅');
  console.log('====================================================\n');
}

runGroup1Tests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
