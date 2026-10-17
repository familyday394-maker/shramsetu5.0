export type RecordStatus = 'verified' | 'pending_approval' | 'disputed' | 'modified';

export type DisputeStatus = 'open' | 'awaiting_response' | 'under_review' | 'resolved' | 'in_mediation';

export type Language = 'en' | 'hi';

export type DetailedPaymentStatus =
  | 'unpaid'
  | 'partially_paid'
  | 'recorded_as_paid'
  | 'acknowledged_as_received'
  | 'disputed';

export type WorkerAcknowledgmentStatus = 'pending' | 'acknowledged' | 'disputed';

export interface PaymentEntry {
  id: string;
  amount: number;
  date: string;
  recordingParty: 'contractor' | 'supervisor' | 'worker';
  recordedRoleLabel: string;
  acknowledgmentStatus: 'unconfirmed_by_worker' | 'acknowledged_by_worker' | 'disputed_by_worker';
  acknowledgedAt?: string;
  notes?: string;
  paymentMethod?: string;
}

export interface CorrectionEntry {
  id: string;
  timestamp: string;
  actorRole: string;
  fieldName: string;
  fieldLabel: string;
  previousValue: number | string;
  correctedValue: number | string;
  reason: string;
  workerAcknowledgment: 'pending' | 'accepted' | 'disputed';
  workerResponseAt?: string;
}

export interface DeductionItem {
  id: string;
  title: string;
  amount: number;
  reason: string;
}

export interface AllowanceItem {
  id: string;
  title: string;
  amount: number;
}

export interface MinimumWageBenchmark {
  rate: number;
  unit: 'day' | 'month';
  tradeCategory: string;
  benchmarkName: string;
  effectiveDate: string;
  source: string;
  notes: string;
  isVerified: boolean;
  status: 'VERIFIED_OFFICIAL' | 'UNVERIFIED_PENDING_GAZETTE';
  verificationNote?: string;
}

export interface WageCalculationBreakdown {
  daysWorked: number;
  hoursWorked: number;
  agreedDailyRate: number;
  baseWage: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimeWage: number;
  additionalAllowancesTotal: number;
  grossWagesDue: number;
  itemizedDeductionsTotal: number;
  netWagesDue: number;
  totalPaymentsRecorded: number;
  totalPaymentsConfirmed: number;
  unconfirmedPaymentsAmount: number;
  outstandingBalance: number;
  paymentStatus: DetailedPaymentStatus;
}

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
  passCredentialToken: string;
  isDemoData?: boolean;
  emergencyContact: string;
}

export interface WorkRecord {
  id: string;
  workerId?: string;
  date: string;
  siteName: string;
  siteLocation: string;
  contractorName: string;
  contractorPhone: string;
  tradeRole: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
  daysWorked?: number;
  shiftHours: number;
  overtimeHours: number;
  agreedDailyRate: number;
  overtimeRate: number;
  additionalAllowances?: AllowanceItem[];
  itemizedDeductions?: DeductionItem[];
  earnedWage: number;
  paidAmount: number;
  balanceDue: number;
  status: RecordStatus;
  detailedPaymentStatus?: DetailedPaymentStatus;
  workerAcknowledgmentStatus?: WorkerAcknowledgmentStatus;
  payments?: PaymentEntry[];
  correctionHistory?: CorrectionEntry[];
  minimumWageBenchmark?: MinimumWageBenchmark;
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
  disputedField?: string;
  issueType: 'unpaid_wages' | 'unrecorded_overtime' | 'rate_cut' | 'wrong_hours';
  description: string;
  contractorResponse?: {
    text: string;
    respondent: string;
    date: string;
  };
  unresolvedFacts?: string[];
  supportingEvidence: string[];
  status: DisputeStatus;
  timeline: {
    date: string;
    note: string;
    actor: string;
  }[];
}

export interface AnomalyAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  recordId: string;
  severity: 'warning' | 'info';
  triggerReason: string;
  neutralNotice: string;
  valuesExamined: { label: string; value: string | number }[];
}

export type AuditVerificationOutcome =
  | 'integrity_passed'
  | 'modification_detected'
  | 'history_incomplete'
  | 'verification_failed';

export interface BlockDigestVerification {
  blockId: string;
  recordDate: string;
  storedHash: string;
  calculatedHash: string;
  isDigestValid: boolean;
  previousHash: string;
  isLinkageValid: boolean;
  status: 'valid' | 'digest_invalid' | 'linkage_mismatch';
}

export interface AuditVerificationResult {
  outcome: AuditVerificationOutcome;
  headline: string;
  details: string[];
  recordsExamined: number;
  blocksBreakdown: BlockDigestVerification[];
  isCompleteLedgerVerified: boolean;
  tamperedBlockId?: string;
  timestamp: string;
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

export type ApprovalRequestType =
  | 'work_record_confirmation'
  | 'wage_payment_disbursement'
  | 'rate_correction'
  | 'dispute_resolution';

export type ApprovalRequestStatus =
  | 'simulated_pending'
  | 'simulated_approved'
  | 'simulated_rejected';

export interface ApprovalRequest {
  id: string;
  type: ApprovalRequestType;
  workRecordId?: string;
  disputeId?: string;
  requesterRole: 'contractor' | 'worker';
  requesterName: string;
  targetWorkerId: string;
  targetWorkerName: string;
  title: string;
  summary: string;
  amount?: number;
  createdAt: string;
  status: ApprovalRequestStatus;
  respondedAt?: string;
  responseNote?: string;
  simulationDisclaimer: string;
}
