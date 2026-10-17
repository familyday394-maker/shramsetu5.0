import {
  WorkerProfile,
  WorkRecord,
  DisputeRecord,
  SkillItem,
  Contractor,
  ApprovalRequest,
} from '../../types';
import {
  INITIAL_WORKERS,
  INITIAL_WORK_RECORDS,
  INITIAL_DISPUTES,
  INITIAL_SKILLS,
  INITIAL_CONTRACTOR,
  INITIAL_APPROVAL_REQUESTS,
} from '../../data/mockData';
import { IDataRepository, StorageStatus } from './types';

const DB_NAME = 'shram_setu_v2_db';
const DB_VERSION = 1;

const STORES = {
  WORKERS: 'workers',
  WORK_RECORDS: 'work_records',
  DISPUTES: 'disputes',
  SKILLS: 'skills',
  CONTRACTORS: 'contractors',
  APPROVAL_REQUESTS: 'approval_requests',
} as const;

export class IndexedDBRepository implements IDataRepository {
  private db: IDBDatabase | null = null;
  private isBrowser: boolean;
  // In-memory fallback for non-browser/test runtimes
  private memoryStores = {
    workers: new Map<string, WorkerProfile>(),
    work_records: new Map<string, WorkRecord>(),
    disputes: new Map<string, DisputeRecord>(),
    skills: new Map<string, SkillItem>(),
    contractors: new Map<string, Contractor>(),
    approval_requests: new Map<string, ApprovalRequest>(),
  };

  constructor() {
    this.isBrowser = typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
  }

  public async init(): Promise<void> {
    if (!this.isBrowser) {
      // Initialize in-memory fallback if empty
      if (this.memoryStores.work_records.size === 0) {
        this.seedMemoryStores();
      }
      return;
    }

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.WORKERS)) {
          db.createObjectStore(STORES.WORKERS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.WORK_RECORDS)) {
          db.createObjectStore(STORES.WORK_RECORDS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.DISPUTES)) {
          db.createObjectStore(STORES.DISPUTES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SKILLS)) {
          db.createObjectStore(STORES.SKILLS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.CONTRACTORS)) {
          db.createObjectStore(STORES.CONTRACTORS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.APPROVAL_REQUESTS)) {
          db.createObjectStore(STORES.APPROVAL_REQUESTS, { keyPath: 'id' });
        }
      };

      request.onsuccess = async (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        await this.seedIndexedDBIfEmpty();
        resolve();
      };

      request.onerror = (event: Event) => {
        console.error('Failed to open IndexedDB:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  private seedMemoryStores(): void {
    INITIAL_WORKERS.forEach(w => this.memoryStores.workers.set(w.id, { ...w }));
    INITIAL_WORK_RECORDS.forEach(r => this.memoryStores.work_records.set(r.id, { ...r }));
    INITIAL_DISPUTES.forEach(d => this.memoryStores.disputes.set(d.id, { ...d }));
    INITIAL_SKILLS.forEach(s => this.memoryStores.skills.set(s.id, { ...s }));
    this.memoryStores.contractors.set(INITIAL_CONTRACTOR.id, { ...INITIAL_CONTRACTOR });
    INITIAL_APPROVAL_REQUESTS.forEach(req => this.memoryStores.approval_requests.set(req.id, { ...req }));
  }

  private async seedIndexedDBIfEmpty(): Promise<void> {
    if (!this.db) return;
    const records = await this.getAllFromStore<WorkRecord>(STORES.WORK_RECORDS);
    if (records.length === 0) {
      // Seed authoritative demo data
      const tx = this.db.transaction(
        [
          STORES.WORKERS,
          STORES.WORK_RECORDS,
          STORES.DISPUTES,
          STORES.SKILLS,
          STORES.CONTRACTORS,
          STORES.APPROVAL_REQUESTS,
        ],
        'readwrite'
      );

      const workerStore = tx.objectStore(STORES.WORKERS);
      INITIAL_WORKERS.forEach(w => workerStore.put(w));

      const recordStore = tx.objectStore(STORES.WORK_RECORDS);
      INITIAL_WORK_RECORDS.forEach(r => recordStore.put(r));

      const disputeStore = tx.objectStore(STORES.DISPUTES);
      INITIAL_DISPUTES.forEach(d => disputeStore.put(d));

      const skillStore = tx.objectStore(STORES.SKILLS);
      INITIAL_SKILLS.forEach(s => skillStore.put(s));

      const contractorStore = tx.objectStore(STORES.CONTRACTORS);
      contractorStore.put(INITIAL_CONTRACTOR);

      const approvalStore = tx.objectStore(STORES.APPROVAL_REQUESTS);
      INITIAL_APPROVAL_REQUESTS.forEach(req => approvalStore.put(req));

      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }
  }

  private async getAllFromStore<T>(storeName: string): Promise<T[]> {
    if (!this.isBrowser || !this.db) {
      const map = (this.memoryStores as Record<string, Map<string, any>>)[storeName];
      return map ? Array.from(map.values()) : [];
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  private async getByIdFromStore<T>(storeName: string, id: string): Promise<T | null> {
    if (!this.isBrowser || !this.db) {
      const map = (this.memoryStores as Record<string, Map<string, any>>)[storeName];
      return map && map.has(id) ? (map.get(id) as T) : null;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);

      req.onsuccess = () => resolve((req.result as T) || null);
      req.onerror = () => reject(req.error);
    });
  }

  private async putToStore<T extends { id: string }>(storeName: string, item: T): Promise<void> {
    if (!this.isBrowser || !this.db) {
      const map = (this.memoryStores as Record<string, Map<string, any>>)[storeName];
      if (map) map.set(item.id, item);
      return;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private async deleteFromStore(storeName: string, id: string): Promise<void> {
    if (!this.isBrowser || !this.db) {
      const map = (this.memoryStores as Record<string, Map<string, any>>)[storeName];
      if (map) map.delete(id);
      return;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private async clearStore(storeName: string): Promise<void> {
    if (!this.isBrowser || !this.db) {
      const map = (this.memoryStores as Record<string, Map<string, any>>)[storeName];
      if (map) map.clear();
      return;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getStatus(): Promise<StorageStatus> {
    const records = await this.getRecords();
    const workers = await this.getWorkers();
    const disputes = await this.getDisputes();
    const approvals = await this.getApprovalRequests();

    return {
      engine: this.isBrowser ? 'indexeddb' : 'memory',
      isLocalDemoMode: true,
      isSupabaseConnected: false,
      notice:
        'Local Demo Mode active using client-side IndexedDB. Supabase cloud sync & PostgreSQL backend scheduled for next week.',
      details: {
        dbName: DB_NAME,
        version: DB_VERSION,
        recordsCount: records.length,
        workersCount: workers.length,
        disputesCount: disputes.length,
        approvalRequestsCount: approvals.length,
      },
    };
  }

  // Workers
  public async getWorkers(): Promise<WorkerProfile[]> {
    return this.getAllFromStore<WorkerProfile>(STORES.WORKERS);
  }

  public async getWorkerById(id: string): Promise<WorkerProfile | null> {
    return this.getByIdFromStore<WorkerProfile>(STORES.WORKERS, id);
  }

  public async saveWorker(worker: WorkerProfile): Promise<void> {
    await this.putToStore<WorkerProfile>(STORES.WORKERS, worker);
  }

  // Work Records
  public async getRecords(): Promise<WorkRecord[]> {
    const list = await this.getAllFromStore<WorkRecord>(STORES.WORK_RECORDS);
    // Return sorted newest first by date/id
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }

  public async getRecordById(id: string): Promise<WorkRecord | null> {
    return this.getByIdFromStore<WorkRecord>(STORES.WORK_RECORDS, id);
  }

  public async saveRecord(record: WorkRecord): Promise<void> {
    await this.putToStore<WorkRecord>(STORES.WORK_RECORDS, record);
  }

  public async updateRecord(record: WorkRecord): Promise<void> {
    await this.putToStore<WorkRecord>(STORES.WORK_RECORDS, record);
  }

  public async deleteRecord(id: string): Promise<void> {
    await this.deleteFromStore(STORES.WORK_RECORDS, id);
  }

  // Disputes
  public async getDisputes(): Promise<DisputeRecord[]> {
    return this.getAllFromStore<DisputeRecord>(STORES.DISPUTES);
  }

  public async getDisputeById(id: string): Promise<DisputeRecord | null> {
    return this.getByIdFromStore<DisputeRecord>(STORES.DISPUTES, id);
  }

  public async saveDispute(dispute: DisputeRecord): Promise<void> {
    await this.putToStore<DisputeRecord>(STORES.DISPUTES, dispute);
  }

  public async updateDispute(dispute: DisputeRecord): Promise<void> {
    await this.putToStore<DisputeRecord>(STORES.DISPUTES, dispute);
  }

  // Skills
  public async getSkills(): Promise<SkillItem[]> {
    return this.getAllFromStore<SkillItem>(STORES.SKILLS);
  }

  public async saveSkill(skill: SkillItem): Promise<void> {
    await this.putToStore<SkillItem>(STORES.SKILLS, skill);
  }

  // Contractor
  public async getContractor(): Promise<Contractor> {
    const list = await this.getAllFromStore<Contractor>(STORES.CONTRACTORS);
    return list[0] || INITIAL_CONTRACTOR;
  }

  public async updateContractor(contractor: Contractor): Promise<void> {
    await this.putToStore<Contractor>(STORES.CONTRACTORS, contractor);
  }

  // Approval Requests
  public async getApprovalRequests(): Promise<ApprovalRequest[]> {
    return this.getAllFromStore<ApprovalRequest>(STORES.APPROVAL_REQUESTS);
  }

  public async saveApprovalRequest(request: ApprovalRequest): Promise<void> {
    await this.putToStore<ApprovalRequest>(STORES.APPROVAL_REQUESTS, request);
  }

  public async updateApprovalRequest(request: ApprovalRequest): Promise<void> {
    await this.putToStore<ApprovalRequest>(STORES.APPROVAL_REQUESTS, request);
  }

  // Reset to Baseline Authoritative Demonstration Records
  public async resetToBaseline(): Promise<void> {
    if (!this.isBrowser || !this.db) {
      this.memoryStores.workers.clear();
      this.memoryStores.work_records.clear();
      this.memoryStores.disputes.clear();
      this.memoryStores.skills.clear();
      this.memoryStores.contractors.clear();
      this.memoryStores.approval_requests.clear();
      this.seedMemoryStores();
      return;
    }

    await this.clearStore(STORES.WORKERS);
    await this.clearStore(STORES.WORK_RECORDS);
    await this.clearStore(STORES.DISPUTES);
    await this.clearStore(STORES.SKILLS);
    await this.clearStore(STORES.CONTRACTORS);
    await this.clearStore(STORES.APPROVAL_REQUESTS);

    await this.seedIndexedDBIfEmpty();
  }
}

// Singleton instance export
export const indexedDBRepo = new IndexedDBRepository();
