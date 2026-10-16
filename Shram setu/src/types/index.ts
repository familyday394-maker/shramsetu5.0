export type RecordStatus = 'verified' | 'pending_approval' | 'disputed' | 'modified';

export type DisputeStatus = 'open' | 'in_mediation' | 'resolved';

export type Language = 'en' | 'hi';

export interface WorkerProfile {
  id: string;
  name: string;
  hindiName: string;
  trade: string;
  tradeHindi: string;
  location: string;
  hubChowk: string;
  phoneMasked: string;
  joinedDate: string;
  avatarUrl: string;
  dailyRateAgreed: number;
  verifiedExperienceMonths: number;
  completedSites: number;
  attendanceRate: number;
  verificationStatus: 'verified' | 'pending' | 'flagged';
  nfcTagId: string;
  cryptoChecksum: string;
  emergencyContact: string;
}

export interface WorkRecord {
  id: string;
  date: string;
  siteName: string;
  siteLocation: string;
  contractorName: string;
  contractorPhone: string;
  tradeRole: string;
  shiftHours: number;
  overtimeHours: number;
  agreedDailyRate: number;
  overtimeRate: number;
  earnedWage: number;
  paidAmount: number;
  balanceDue: number;
  status: RecordStatus;
  modificationReason?: string;
  modifiedAt?: string;
  originalDailyRate?: number;
  hash: string;
  previousHash: string;
  notes?: string;
  isTampered?: boolean;
}

export interface DisputeRecord {
  id: string;
  workRecordId: string;
  dateLodged: string;
  siteName: string;
  contractorName: string;
  workerName: string;
  claimedAmount: number;
  paidAmount: number;
  discrepancyAmount: number;
  issueType: 'unpaid_wages' | 'unrecorded_overtime' | 'rate_cut' | 'wrong_hours';
  description: string;
  supportingEvidence: string[];
  status: DisputeStatus;
  timeline: {
    date: string;
    note: string;
    actor: string;
  }[];
}

export interface SkillItem {
  id: string;
  skillName: string;
  skillHindi: string;
  category: string;
  verifiedHours: number;
  endorsedByContractor: string;
  rating: number;
  certificationTitle?: string;
  issuer?: string;
  verificationMethod: 'contractor_muster' | 'peer_corroborated' | 'assessment';
}

export interface Contractor {
  id: string;
  firmName: string;
  representative: string;
  location: string;
  regNumber: string;
  contact: string;
  activeProjects: string[];
}
