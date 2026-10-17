import {
  WorkerProfile,
  WorkRecord,
  DisputeRecord,
  SkillItem,
  Contractor,
  ApprovalRequest,
} from '../../types';
import { IDataRepository, StorageStatus } from './types';
import { indexedDBRepo } from './indexedDBRepo';

/**
 * Supabase Tables Configuration
 * Mappings for PostgreSQL schema defined in supabase/migrations/20261024000000_shram_setu_initial_schema.sql
 */
export const SUPABASE_TABLES = {
  WORKERS: 'workers',
  WORK_RECORDS: 'work_records',
  DISPUTES: 'disputes',
  SKILLS: 'skills',
  CONTRACTORS: 'contractors',
  APPROVAL_REQUESTS: 'approval_requests',
} as const;

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

/**
 * SupabaseAdapter
 * 
 * TIMING CONSTRAINT NOTICE:
 * Supabase backend provisioning is scheduled for next week.
 * This adapter provides the typed client contract, table definitions,
 * query mappings, and graceful fallback to the IndexedDB repository.
 * It strictly discloses that the real Supabase backend is NOT yet connected.
 */
export class SupabaseAdapter implements IDataRepository {
  private config: SupabaseConfig | null = null;
  private isConfigured: boolean = false;

  constructor() {
    const url = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '';
    const key = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';

    if (url && key && url.trim() !== '' && key.trim() !== '') {
      this.config = { supabaseUrl: url, supabaseAnonKey: key };
      // Real backend connection will be validated when Supabase is provisioned next week
      this.isConfigured = true;
    }
  }

  public async init(): Promise<void> {
    // When Supabase is connected next week, initialize Supabase client and check session.
    // For now in Local Demo Mode, delegate to indexedDBRepo to ensure offline persistence.
    await indexedDBRepo.init();
  }

  public async getStatus(): Promise<StorageStatus> {
    const localStatus = await indexedDBRepo.getStatus();
    return {
      engine: 'supabase',
      isLocalDemoMode: true,
      isSupabaseConnected: false, // Explicitly false per timing constraint
      notice:
        'Supabase cloud backend scheduled for next week. Local Demo Mode active using IndexedDB repository.',
      details: {
        dbName: 'supabase_scheduled (fallback: ' + localStatus.details.dbName + ')',
        version: 1,
        recordsCount: localStatus.details.recordsCount,
        workersCount: localStatus.details.workersCount,
        disputesCount: localStatus.details.disputesCount,
        approvalRequestsCount: localStatus.details.approvalRequestsCount,
      },
    };
  }

  // Row Mapping helpers (camelCase <-> snake_case)
  public mapWorkerToRow(worker: WorkerProfile): Record<string, any> {
    return {
      id: worker.id,
      name: worker.name,
      hindi_name: worker.hindiName,
      trade: worker.trade,
      trade_hindi: worker.tradeHindi,
      location: worker.location,
      hub_chowk: worker.hubChowk,
      phone_masked: worker.phoneMasked,
      joined_date: worker.joinedDate,
      avatar_url: worker.avatarUrl,
      daily_rate_agreed: worker.dailyRateAgreed,
      verified_experience_months: worker.verifiedExperienceMonths,
      completed_sites: worker.completedSites,
      attendance_rate: worker.attendanceRate,
      verification_status: worker.verificationStatus,
      nfc_tag_id: worker.nfcTagId,
      crypto_checksum: worker.cryptoChecksum,
      pass_credential_token: worker.passCredentialToken,
      is_demo_data: worker.isDemoData ?? true,
      emergency_contact: worker.emergencyContact,
    };
  }

  public mapRowToWorker(row: Record<string, any>): WorkerProfile {
    return {
      id: row.id,
      name: row.name,
      hindiName: row.hindi_name,
      trade: row.trade,
      tradeHindi: row.trade_hindi,
      location: row.location,
      hubChowk: row.hub_chowk,
      phoneMasked: row.phone_masked,
      joinedDate: row.joined_date,
      avatarUrl: row.avatar_url || '',
      dailyRateAgreed: Number(row.daily_rate_agreed),
      verifiedExperienceMonths: Number(row.verified_experience_months),
      completedSites: Number(row.completed_sites),
      attendanceRate: Number(row.attendance_rate),
      verificationStatus: row.verification_status,
      nfcTagId: row.nfc_tag_id,
      cryptoChecksum: row.crypto_checksum,
      passCredentialToken: row.pass_credential_token,
      isDemoData: row.is_demo_data ?? true,
      emergencyContact: row.emergency_contact,
    };
  }

  // Workers
  public async getWorkers(): Promise<WorkerProfile[]> {
    return indexedDBRepo.getWorkers();
  }

  public async getWorkerById(id: string): Promise<WorkerProfile | null> {
    return indexedDBRepo.getWorkerById(id);
  }

  public async saveWorker(worker: WorkerProfile): Promise<void> {
    await indexedDBRepo.saveWorker(worker);
  }

  // Work Records
  public async getRecords(): Promise<WorkRecord[]> {
    return indexedDBRepo.getRecords();
  }

  public async getRecordById(id: string): Promise<WorkRecord | null> {
    return indexedDBRepo.getRecordById(id);
  }

  public async saveRecord(record: WorkRecord): Promise<void> {
    await indexedDBRepo.saveRecord(record);
  }

  public async updateRecord(record: WorkRecord): Promise<void> {
    await indexedDBRepo.updateRecord(record);
  }

  public async deleteRecord(id: string): Promise<void> {
    await indexedDBRepo.deleteRecord(id);
  }

  // Disputes
  public async getDisputes(): Promise<DisputeRecord[]> {
    return indexedDBRepo.getDisputes();
  }

  public async getDisputeById(id: string): Promise<DisputeRecord | null> {
    return indexedDBRepo.getDisputeById(id);
  }

  public async saveDispute(dispute: DisputeRecord): Promise<void> {
    await indexedDBRepo.saveDispute(dispute);
  }

  public async updateDispute(dispute: DisputeRecord): Promise<void> {
    await indexedDBRepo.updateDispute(dispute);
  }

  // Skills
  public async getSkills(): Promise<SkillItem[]> {
    return indexedDBRepo.getSkills();
  }

  public async saveSkill(skill: SkillItem): Promise<void> {
    await indexedDBRepo.saveSkill(skill);
  }

  // Contractor
  public async getContractor(): Promise<Contractor> {
    return indexedDBRepo.getContractor();
  }

  public async updateContractor(contractor: Contractor): Promise<void> {
    await indexedDBRepo.updateContractor(contractor);
  }

  // Approval Requests
  public async getApprovalRequests(): Promise<ApprovalRequest[]> {
    return indexedDBRepo.getApprovalRequests();
  }

  public async saveApprovalRequest(request: ApprovalRequest): Promise<void> {
    await indexedDBRepo.saveApprovalRequest(request);
  }

  public async updateApprovalRequest(request: ApprovalRequest): Promise<void> {
    await indexedDBRepo.updateApprovalRequest(request);
  }

  // Baseline restoration
  public async resetToBaseline(): Promise<void> {
    await indexedDBRepo.resetToBaseline();
  }
}

export const supabaseAdapter = new SupabaseAdapter();
