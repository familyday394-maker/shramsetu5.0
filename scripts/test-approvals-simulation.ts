import { IndexedDBRepository } from '../src/services/repository/indexedDBRepo';
import { INITIAL_APPROVAL_REQUESTS } from '../src/data/mockData';
import { ApprovalRequest } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

async function runGroup3Tests() {
  console.log('====================================================');
  console.log('GROUP 3 TEST SUITE: SIMULATED CROSS-DEVICE APPROVALS');
  console.log('====================================================');

  const repo = new IndexedDBRepository();
  await repo.init();

  // Test 1: Mandatory Simulation Disclaimers on Initial Records
  console.log('\n--- 1. Mandatory Simulation Disclaimers ---');
  const initial = await repo.getApprovalRequests();
  assert(initial.length >= 2, `Loaded ${initial.length} initial approval requests`);

  initial.forEach(req => {
    assert(
      req.simulationDisclaimer.includes('Simulated Cross-Device Request') &&
        req.simulationDisclaimer.includes('Local Demo Mode') &&
        req.simulationDisclaimer.includes('IndexedDB') &&
        req.simulationDisclaimer.includes('Supabase deployment next week'),
      `Request ${req.id} contains full mandatory simulation disclosure`
    );
    assert(
      req.status.startsWith('simulated_'),
      `Request ${req.id} status strictly uses simulated_ prefix (got ${req.status})`
    );
  });

  // Test 2: Contractor Creates New Simulated Approval Request
  console.log('\n--- 2. Contractor Initiates Simulated Request ---');
  const newReq: ApprovalRequest = {
    id: `REQ-${Date.now().toString().slice(-6)}`,
    type: 'wage_payment_disbursement',
    workRecordId: 'REC-2026-SUNITA-02',
    requesterRole: 'contractor',
    requesterName: 'Er. Alok Sharma (M/s Sharma Infra)',
    targetWorkerId: 'MP-IND-2026-WM715',
    targetWorkerName: 'Sunita Bai',
    title: 'Disbursement Confirmation for Metro Pier Curing',
    summary: 'Cash disbursement of ₹450 for full-day helper masonry shift.',
    amount: 450,
    createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
    status: 'simulated_pending',
    simulationDisclaimer:
      'Simulated Cross-Device Request: In Local Demo Mode, this approval request is simulated locally via IndexedDB. Multi-device sync will be enabled with Supabase deployment next week.',
  };

  await repo.saveApprovalRequest(newReq);
  let requests = await repo.getApprovalRequests();
  const savedReq = requests.find(r => r.id === newReq.id);
  assert(savedReq !== undefined, 'New simulated request successfully saved in repository');
  assert(savedReq?.status === 'simulated_pending', 'New request starts with status simulated_pending');
  assert(savedReq?.targetWorkerName === 'Sunita Bai', 'Target worker is Sunita Bai');

  // Test 3: Worker Simulates Approval
  console.log('\n--- 3. Worker Simulates Approval ---');
  const approvalTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
  const approvedReq: ApprovalRequest = {
    ...savedReq!,
    status: 'simulated_approved',
    respondedAt: approvalTimestamp,
    responseNote: 'Worker verified cash payout in hand at chowk desk',
  };

  await repo.updateApprovalRequest(approvedReq);
  requests = await repo.getApprovalRequests();
  const verifiedApproved = requests.find(r => r.id === newReq.id);
  assert(verifiedApproved?.status === 'simulated_approved', 'Request status transitioned to simulated_approved');
  assert(verifiedApproved?.respondedAt === approvalTimestamp, 'Response timestamp recorded accurately');
  assert(
    verifiedApproved?.responseNote === 'Worker verified cash payout in hand at chowk desk',
    'Response note preserved'
  );

  // Test 4: Worker Simulates Rejection / Dispute
  console.log('\n--- 4. Worker Simulates Rejection / Dispute ---');
  const rejectReq: ApprovalRequest = {
    id: 'REQ-TEST-REJECT-01',
    type: 'rate_correction',
    requesterRole: 'contractor',
    requesterName: 'Munshi Radhe',
    targetWorkerId: 'MP-IND-2026-WM842',
    targetWorkerName: 'Ramesh Verma',
    title: 'Reduced Rate Proposal',
    summary: 'Proposal to reduce rate to ₹400/day for brickwork',
    amount: 400,
    createdAt: approvalTimestamp,
    status: 'simulated_pending',
    simulationDisclaimer:
      'Simulated Cross-Device Request: In Local Demo Mode, this approval request is simulated locally via IndexedDB. Multi-device sync will be enabled with Supabase deployment next week.',
  };
  await repo.saveApprovalRequest(rejectReq);

  const rejectionTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
  const rejectedReq: ApprovalRequest = {
    ...rejectReq,
    status: 'simulated_rejected',
    respondedAt: rejectionTimestamp,
    responseNote: 'Rejected by worker: Master mason brickwork cannot be demoted to helper rate',
  };
  await repo.updateApprovalRequest(rejectedReq);

  requests = await repo.getApprovalRequests();
  const verifiedRejected = requests.find(r => r.id === 'REQ-TEST-REJECT-01');
  assert(verifiedRejected?.status === 'simulated_rejected', 'Request status transitioned to simulated_rejected');
  assert(
    Boolean(verifiedRejected?.responseNote?.includes('Rejected by worker')),
    'Rejection justification recorded in response note'
  );

  // Test 5: Authoritative Baseline Reset Integrity
  console.log('\n--- 5. Baseline Reset Restores Authoritative Demonstrations ---');
  await repo.resetToBaseline();
  const baselineRequests = await repo.getApprovalRequests();
  assert(
    baselineRequests.length === INITIAL_APPROVAL_REQUESTS.length,
    `Reset restored exactly ${INITIAL_APPROVAL_REQUESTS.length} baseline simulated approval requests`
  );
  assert(
    baselineRequests.every(r => r.id === 'REQ-2026-APP-001' || r.id === 'REQ-2026-APP-002'),
    'Only the authoritative baseline requests remain after reset'
  );

  console.log('\n====================================================');
  console.log('ALL GROUP 3 SIMULATED APPROVALS TESTS PASSED! ✅');
  console.log('====================================================\n');
}

runGroup3Tests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
