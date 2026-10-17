import fs from 'fs';
import path from 'path';
import { supabaseAdapter } from '../src/services/repository/supabaseAdapter';
import { WorkerProfile } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

async function runGroup2Tests() {
  console.log('====================================================');
  console.log('GROUP 2 TEST SUITE: SUPABASE ADAPTER & SQL MIGRATIONS');
  console.log('====================================================');

  // Test 1: Adapter Status & Timing Disclosures
  console.log('\n--- 1. Supabase Adapter Status & Contract Disclosures ---');
  await supabaseAdapter.init();
  const status = await supabaseAdapter.getStatus();
  assert(status.engine === 'supabase', 'Adapter identifies engine as supabase');
  assert(status.isSupabaseConnected === false, 'Adapter strictly reports isSupabaseConnected: false');
  assert(status.isLocalDemoMode === true, 'Adapter strictly reports isLocalDemoMode: true');
  assert(
    status.notice.includes('next week') && status.notice.includes('Local Demo Mode'),
    'Notice transparently announces scheduled deployment for next week'
  );

  // Test 2: Relational Column Mapping Fidelity (camelCase <-> snake_case)
  console.log('\n--- 2. Worker Column Mapping Fidelity ---');
  const sampleWorker: WorkerProfile = {
    id: 'MP-IND-2026-WM842',
    name: 'Ramesh Verma',
    hindiName: 'रमेश वर्मा',
    trade: 'Senior Mason / Bricklayer',
    tradeHindi: 'वरिष्ठ राजमिस्त्री',
    location: 'Indore, Madhya Pradesh',
    hubChowk: 'Geeta Bhawan Labor Chowk',
    phoneMasked: '+91 98260 •••••',
    joinedDate: '14 Feb 2024',
    avatarUrl: '',
    dailyRateAgreed: 650,
    verifiedExperienceMonths: 48,
    completedSites: 19,
    attendanceRate: 96.4,
    verificationStatus: 'verified',
    nfcTagId: 'QR-IND-842-7F89B2',
    cryptoChecksum: 'sha256:7b91f034e4a905d6cb44e8bc1a39f61b0c952',
    passCredentialToken: 'cpt_e8f192b47c014fa29d338be51049ea21',
    isDemoData: true,
    emergencyContact: '+91 94250 •••••',
  };

  const row = supabaseAdapter.mapWorkerToRow(sampleWorker);
  assert(row.daily_rate_agreed === 650, 'Mapped daily_rate_agreed accurately');
  assert(row.phone_masked === '+91 98260 •••••', 'Mapped phone_masked accurately');
  assert(row.nfc_tag_id === 'QR-IND-842-7F89B2', 'Mapped nfc_tag_id accurately');

  const roundTrip = supabaseAdapter.mapRowToWorker(row);
  assert(roundTrip.dailyRateAgreed === 650, 'Roundtrip dailyRateAgreed preserved as number');
  assert(roundTrip.name === sampleWorker.name, 'Roundtrip name preserved');
  assert(roundTrip.passCredentialToken === sampleWorker.passCredentialToken, 'Roundtrip passCredentialToken preserved');

  // Test 3: SQL Migration Verification
  console.log('\n--- 3. SQL Migration File Verification ---');
  const migrationPath = path.resolve(
    process.cwd(),
    'supabase/migrations/20261024000000_shram_setu_initial_schema.sql'
  );
  assert(fs.existsSync(migrationPath), 'Migration file exists at supabase/migrations/20261024000000_shram_setu_initial_schema.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  const requiredTables = [
    'public.workers',
    'public.contractors',
    'public.work_records',
    'public.disputes',
    'public.skills',
    'public.approval_requests',
  ];
  for (const table of requiredTables) {
    assert(migrationSql.includes(`CREATE TABLE IF NOT EXISTS ${table}`), `Migration contains table: ${table}`);
  }

  assert(migrationSql.includes('ROW LEVEL SECURITY'), 'Migration enables Row Level Security (RLS)');
  assert(migrationSql.includes('handle_updated_at'), 'Migration defines updated_at timestamp trigger');

  // Test 4: Seed Data Verification
  console.log('\n--- 4. Seed Data Verification ---');
  const seedPath = path.resolve(process.cwd(), 'supabase/seed.sql');
  assert(fs.existsSync(seedPath), 'Seed file exists at supabase/seed.sql');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  assert(seedSql.includes('MP-IND-2026-WM842'), 'Seed contains worker Ramesh Verma');
  assert(seedSql.includes('MP-IND-2026-WM715'), 'Seed contains worker Sunita Bai');
  assert(seedSql.includes('REC-2026-DEMO-4D'), 'Seed contains 4-day block REC-2026-DEMO-4D');
  assert(seedSql.includes('REQ-2026-APP-001'), 'Seed contains simulated approval request REQ-2026-APP-001');

  // Test 5: Documentation Verification
  console.log('\n--- 5. Setup Documentation Verification ---');
  const docPath = path.resolve(process.cwd(), 'docs/SUPABASE_SETUP.md');
  assert(fs.existsSync(docPath), 'Documentation exists at docs/SUPABASE_SETUP.md');
  const docContent = fs.readFileSync(docPath, 'utf8');
  assert(docContent.includes('IndexedDB'), 'Docs explain current IndexedDB Local Demo Mode');
  assert(docContent.includes('VITE_SUPABASE_URL'), 'Docs describe Supabase environment variables');

  console.log('\n====================================================');
  console.log('ALL GROUP 2 SUPABASE ADAPTER & SQL TESTS PASSED! ✅');
  console.log('====================================================\n');
}

runGroup2Tests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
