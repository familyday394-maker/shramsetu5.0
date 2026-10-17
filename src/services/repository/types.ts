import {
  WorkerProfile,
  WorkRecord,
  DisputeRecord,
  SkillItem,
  Contractor,
  ApprovalRequest,
} from '../../types';

export type StorageEngineType = 'indexeddb' | 'memory' | 'supabase';

export interface StorageStatus {
  engine: StorageEngineType;
  isLocalDemoMode: boolean;
  isSupabaseConnected: boolean;
  notice: string;
  details: {
    dbName: string;
    version: number;
    recordsCount: number;
    workersCount: number;
    disputesCount: number;
    approvalRequestsCount: number;
  };
}

export interface IDataRepository {
  init(): Promise<void>;
  getStatus(): Promise<StorageStatus>;

  // Workers
  getWorkers(): Promise<WorkerProfile[]>;
  getWorkerById(id: string): Promise<WorkerProfile | null>;
  saveWorker(worker: WorkerProfile): Promise<void>;

  // Work Records (Ledger)
  getRecords(): Promise<WorkRecord[]>;
  getRecordById(id: string): Promise<WorkRecord | null>;
  saveRecord(record: WorkRecord): Promise<void>;
  updateRecord(record: WorkRecord): Promise<void>;
  deleteRecord(id: string): Promise<void>;

  // Wage Disputes
  getDisputes(): Promise<DisputeRecord[]>;
  getDisputeById(id: string): Promise<DisputeRecord | null>;
  saveDispute(dispute: DisputeRecord): Promise<void>;
  updateDispute(dispute: DisputeRecord): Promise<void>;

  // Skills
  getSkills(): Promise<SkillItem[]>;
  saveSkill(skill: SkillItem): Promise<void>;

  // Contractor profile
  getContractor(): Promise<Contractor>;
  updateContractor(contractor: Contractor): Promise<void>;

  // Cross-Device Approval Requests (Simulated in Local Demo Mode)
  getApprovalRequests(): Promise<ApprovalRequest[]>;
  saveApprovalRequest(request: ApprovalRequest): Promise<void>;
  updateApprovalRequest(request: ApprovalRequest): Promise<void>;

  // Baseline restoration
  resetToBaseline(): Promise<void>;
}
