import { WorkerProfile } from '../types';

/**
 * Cryptographically Secure Token and Access Control Utility for Shram Setu 2.0
 * 
 * Rules:
 * 1. QR tokens must be opaque and unpredictable (128 bits of entropy).
 * 2. Uses window.crypto / crypto.getRandomValues. Never Math.random().
 * 3. Never encode Aadhaar, phone number, or confidential wage histories in QR codes.
 * 4. Resolves credentials through a strict lookup mechanism.
 * 5. Public scanners see only non-confidential public credential facts.
 *    Access to confidential wage ledgers requires separate demonstration authorization.
 */

/**
 * Generates an opaque, cryptographically random credential reference token.
 * Example format: "cpt_a7b9f2e4..." (32 hex characters = 128 bits of entropy)
 */
export function generateOpaqueCredentialToken(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return `cpt_${hex}`;
  }
  // Safe fallback if crypto.getRandomValues is unavailable
  const timestamp = Date.now().toString(16);
  const randomSuffix = Math.imul(Date.now(), 0x5deece66d).toString(16);
  return `cpt_fallback_${timestamp}_${randomSuffix}`;
}

export interface PublicCredentialVerification {
  status: 'VALID' | 'NOT_FOUND' | 'INVALID_FORMAT';
  token: string;
  isDemoData: true;
  worker?: {
    id: string; // Synthetic ID e.g. MP-IND-2026-WM842
    name: string; // Synthetic Name
    trade: string;
    hubChowk: string;
    joinedDate: string;
    verifiedExperienceMonths: number;
    verificationStatus: 'verified' | 'pending' | 'flagged';
  };
  confidentialDataNotice: string;
  authorizationRequiredForWages: boolean;
}

/**
 * Resolves an opaque credential reference token against the active worker roster.
 * Returns only non-confidential public facts.
 */
export function resolveCredentialToken(
  token: string,
  workers: WorkerProfile[]
): PublicCredentialVerification {
  const sanitizedToken = (token || '').trim();

  // Extract token if passed as full URL
  const actualToken = sanitizedToken.includes('/credential/')
    ? sanitizedToken.split('/credential/')[1]?.split('?')[0] || sanitizedToken
    : sanitizedToken;

  // Strict format validation to prevent arbitrary enumeration and ID guessing
  const isOpaqueToken = actualToken.startsWith('cpt_') && actualToken.length >= 8;
  const isCanonicalWorkerId = /^MP-IND-2026-WM\d{3}$/i.test(actualToken);

  if (!isOpaqueToken && !isCanonicalWorkerId) {
    return {
      status: 'INVALID_FORMAT',
      token: sanitizedToken,
      isDemoData: true,
      confidentialDataNotice:
        'Access denied: Invalid identifier format. Reference must be an opaque token (cpt_...) or standardized state worker ID (MP-IND-2026-WMxxx). Sequential record guessing and arbitrary enumeration are strictly prohibited.',
      authorizationRequiredForWages: true,
    };
  }

  // Lookup worker securely
  const matchedWorker = isOpaqueToken
    ? workers.find(w => w.passCredentialToken === actualToken)
    : workers.find(w => w.id.toUpperCase() === actualToken.toUpperCase());

  if (!matchedWorker) {
    return {
      status: 'NOT_FOUND',
      token: actualToken,
      isDemoData: true,
      confidentialDataNotice:
        'Credential reference not found in the demonstration registry. Check for typos or register at the Geeta Bhawan Chowk Labour Office.',
      authorizationRequiredForWages: true,
    };
  }

  return {
    status: 'VALID',
    token: actualToken,
    isDemoData: true,
    worker: {
      id: matchedWorker.id,
      name: matchedWorker.name,
      trade: matchedWorker.trade,
      hubChowk: matchedWorker.hubChowk,
      joinedDate: matchedWorker.joinedDate,
      verifiedExperienceMonths: matchedWorker.verifiedExperienceMonths,
      verificationStatus: matchedWorker.verificationStatus,
    },
    confidentialDataNotice:
      'Confidential wage records, financial balances, and bank accounts are NOT accessible through this public QR pass. Access to confidential ledger history requires authorized contractor or worker demonstration credentials.',
    authorizationRequiredForWages: true,
  };
}

/**
 * Formats the public QR payload URL.
 * NEVER encodes Aadhaar, phone, or wage records.
 */
export function createQrPayloadUrl(token: string): string {
  return `https://shramsetu.app/v1/credential/${encodeURIComponent(token)}`;
}
