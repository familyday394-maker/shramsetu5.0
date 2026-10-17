import { execSync } from 'child_process';

const testSuites = [
  { name: 'Audit & Ledger Integrity Suite', script: 'scripts/test-audit-ledger.ts' },
  { name: 'Group 1: IndexedDB & Repository Suite', script: 'scripts/test-indexeddb-repository.ts' },
  { name: 'Group 2: Supabase Adapter & Migrations Suite', script: 'scripts/test-supabase-adapter.ts' },
  { name: 'Group 3: Simulated Cross-Device Approvals Suite', script: 'scripts/test-approvals-simulation.ts' },
];

console.log('================================================================');
console.log('SHRAM SETU 2.0 — COMPREHENSIVE VERIFICATION & TEST HARNESS');
console.log('================================================================\n');

let totalPassed = 0;
for (const suite of testSuites) {
  console.log(`\n▶ RUNNING: ${suite.name} (${suite.script})`);
  try {
    const output = execSync(`npx tsx ${suite.script}`, { stdio: 'inherit' });
    totalPassed++;
  } catch (err) {
    console.error(`\n❌ SUITE FAILED: ${suite.name}`);
    process.exit(1);
  }
}

console.log('\n================================================================');
console.log(`ALL ${totalPassed}/${testSuites.length} TEST SUITES PASSED SUCCESSFULLY! ✅`);
console.log('================================================================\n');
