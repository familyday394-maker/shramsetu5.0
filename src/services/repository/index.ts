import { IDataRepository, StorageStatus } from './types';
import { indexedDBRepo } from './indexedDBRepo';
import { supabaseAdapter } from './supabaseAdapter';

/**
 * Storage Service Factory
 * 
 * In Local Demo Mode, this always resolves to the IndexedDB repository.
 * Supabase adapter is prepared and tested for deployment next week.
 */
let activeRepository: IDataRepository = indexedDBRepo;

export function getRepository(): IDataRepository {
  return activeRepository;
}

export function setRepository(repo: IDataRepository): void {
  activeRepository = repo;
}

export async function getStorageDiagnostics(): Promise<StorageStatus> {
  return activeRepository.getStatus();
}

export * from './types';
export * from './indexedDBRepo';
export * from './supabaseAdapter';
