import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WorkerProfile,
  WorkRecord,
  DisputeRecord,
  DisputeStatus,
  SkillItem,
  Contractor,
  Language,
  PaymentEntry,
  CorrectionEntry,
  ApprovalRequest,
  ApprovalRequestType,
  ApprovalRequestStatus,
} from '../types';
import {
  INITIAL_WORKERS,
  INITIAL_WORKER,
  INITIAL_WORK_RECORDS,
  INITIAL_DISPUTES,
  INITIAL_SKILLS,
  INITIAL_CONTRACTOR,
  INITIAL_APPROVAL_REQUESTS,
} from '../data/mockData';
import { getRepository, StorageStatus } from '../services/repository';
import {
  calculateRecordBreakdown,
  round2,
  safeNumber,
  INDORE_SKILLED_CONSTRUCTION_BENCHMARK,
} from '../utils/wageCalculator';
import { computeCanonicalHash } from '../utils/auditVerification';
import { generateOpaqueCredentialToken } from '../utils/tokenSecurity';

export type ViewMode = 'home' | 'worker' | 'pass' | 'contractor' | 'disputes' | 'skills' | 'project' | 'audit';
export type DemoRole = 'worker' | 'contractor' | 'auditor';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  // Demonstration Role & Multi-Worker State
  activeDemoRole: DemoRole;
  setActiveDemoRole: (role: DemoRole) => void;
  isDemoEntryModalOpen: boolean;
  setDemoEntryModalOpen: (open: boolean) => void;
  workers: WorkerProfile[];
  worker: WorkerProfile;
  selectDemoWorker: (workerId: string) => void;
  addDemoWorker: (data: {
    name: string;
    hindiName?: string;
    trade: string;
    tradeHindi?: string;
    dailyRateAgreed: number;
    hubChowk: string;
    phoneMasked?: string;
  }) => void;
  records: WorkRecord[];
  disputes: DisputeRecord[];
  skills: SkillItem[];
  contractor: Contractor;
  addWorkRecord: (newRecord: Omit<WorkRecord, 'id' | 'hash' | 'previousHash' | 'balanceDue' | 'earnedWage'>) => void;
  fileDispute: (data: {
    workRecordId: string;
    issueType: 'unpaid_wages' | 'unrecorded_overtime' | 'rate_cut' | 'wrong_hours';
    description: string;
    claimedAmount: number;
    paidAmount: number;
  }) => void;
  updateDisputeStatus: (disputeId: string, newStatus: DisputeStatus, note: string) => void;
  contractorRespondToDispute: (disputeId: string, responseData: { text: string; respondent: string }) => void;
  contractorDisbursePayment: (recordId: string, amount: number) => void;
  recordPayment: (recordId: string, paymentData: {
    amount: number;
    notes?: string;
    recordingParty: 'contractor' | 'supervisor' | 'worker';
    recordedRoleLabel: string;
    paymentMethod?: string;
  }) => void;
  acknowledgePayment: (recordId: string, paymentId: string, status: 'acknowledged_by_worker' | 'disputed_by_worker') => void;
  applyCorrection: (recordId: string, correctionData: {
    fieldName: 'agreedDailyRate' | 'daysWorked' | 'shiftHours' | 'overtimeHours' | 'overtimeRate';
    fieldLabel: string;
    newValue: number;
    reason: string;
    actorRole: string;
  }) => void;
  respondToCorrection: (recordId: string, correctionId: string, response: 'accepted' | 'disputed') => void;
  tamperRecord: (recordId: string, newRate: number) => void;
  restoreRecord: (recordId: string) => void;
  breakChainLink: (recordId: string) => void;
  injectUnreasonedDeduction: (recordId: string) => void;
  injectDuplicateShift: () => void;
  injectOverlongShift: () => void;
  corruptHashFormat: (recordId: string) => void;
  injectOverpayment: (recordId: string) => void;
  resetDemoData: () => void;
  // Modals & walkthrough
  activeJudgeTourStep: number | null;
  setActiveJudgeTourStep: (step: number | null) => void;
  isShiftModalOpen: boolean;
  setShiftModalOpen: (open: boolean) => void;
  isDisputeModalOpen: boolean;
  setDisputeModalOpen: (open: boolean) => void;
  selectedDisputeRecord: WorkRecord | null;
  setSelectedDisputeRecord: (r: WorkRecord | null) => void;
  isSlipModalOpen: boolean;
  setSlipModalOpen: (open: boolean) => void;
  selectedSlipRecord: WorkRecord | null;
  setSelectedSlipRecord: (r: WorkRecord | null) => void;
  // Wage Record Detail Transparency Inspector
  isRecordInspectorOpen: boolean;
  selectedRecordForInspection: WorkRecord | null;
  openRecordInspector: (record: WorkRecord) => void;
  closeRecordInspector: () => void;
  // Simulated Cross-Device Approvals (IndexedDB Local Demo Mode)
  approvalRequests: ApprovalRequest[];
  addApprovalRequest: (data: {
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
  }) => void;
  respondToApprovalRequest: (
    requestId: string,
    decision: 'simulated_approved' | 'simulated_rejected',
    note?: string
  ) => void;
  // Storage & Architecture Diagnostics
  storageStatus: StorageStatus | null;
  refreshStorageStatus: () => Promise<void>;
  isStorageModalOpen: boolean;
  setStorageModalOpen: (open: boolean) => void;
  isApprovalsModalOpen: boolean;
  setApprovalsModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RECORDS: 'shram_setu_records_v2_p2',
  DISPUTES: 'shram_setu_disputes_v2_p2',
  WORKERS: 'shram_setu_workers_v2_p2',
  SELECTED_WORKER: 'shram_setu_selected_worker_v2_p2',
  DEMO_ROLE: 'shram_setu_demo_role_v2_p2',
  LANGUAGE: 'shram_setu_lang_v2_p2',
  APPROVAL_REQUESTS: 'shram_setu_approval_requests_v2_p2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return saved === 'hi' ? 'hi' : 'en';
  });

  const [currentView, setCurrentView] = useState<ViewMode>('home');

  const [activeDemoRole, setActiveDemoRoleState] = useState<DemoRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEMO_ROLE);
    return (saved as DemoRole) || 'worker';
  });

  const [isDemoEntryModalOpen, setDemoEntryModalOpen] = useState(false);

  // Consolidated Workers state
  const [workers, setWorkers] = useState<WorkerProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WORKERS;
      }
    }
    return INITIAL_WORKERS;
  });

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_WORKER);
    return saved || INITIAL_WORKERS[0].id;
  });

  // Active worker derived from single authoritative list
  const worker = workers.find(w => w.id === selectedWorkerId) || workers[0] || INITIAL_WORKER;

  const [records, setRecords] = useState<WorkRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (saved) {
      try {
        const parsed: WorkRecord[] = JSON.parse(saved);
        return parsed.map(r => {
          const calc = calculateRecordBreakdown(r);
          return {
            ...r,
            earnedWage: calc.netWagesDue,
            paidAmount: calc.totalPaymentsRecorded,
            balanceDue: calc.outstandingBalance,
            detailedPaymentStatus: calc.paymentStatus,
          };
        });
      } catch {
        return INITIAL_WORK_RECORDS;
      }
    }
    return INITIAL_WORK_RECORDS;
  });

  const [disputes, setDisputes] = useState<DisputeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DISPUTES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DISPUTES;
      }
    }
    return INITIAL_DISPUTES;
  });

  const [skills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [contractor] = useState<Contractor>(INITIAL_CONTRACTOR);

  // Modal states
  const [activeJudgeTourStep, setActiveJudgeTourStep] = useState<number | null>(null);
  const [isShiftModalOpen, setShiftModalOpen] = useState(false);
  const [isDisputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedDisputeRecord, setSelectedDisputeRecord] = useState<WorkRecord | null>(null);
  const [isSlipModalOpen, setSlipModalOpen] = useState(false);
  const [selectedSlipRecord, setSelectedSlipRecord] = useState<WorkRecord | null>(null);

  // Record Detail Transparency Inspector
  const [isRecordInspectorOpen, setIsRecordInspectorOpen] = useState(false);
  const [selectedRecordForInspection, setSelectedRecordForInspection] = useState<WorkRecord | null>(null);

  // Simulated Cross-Device Approval Requests State
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPROVAL_REQUESTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_APPROVAL_REQUESTS;
      }
    }
    return INITIAL_APPROVAL_REQUESTS;
  });

  // Storage Diagnostics Modal and Status State
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);
  const [isStorageModalOpen, setStorageModalOpen] = useState(false);
  const [isApprovalsModalOpen, setApprovalsModalOpen] = useState(false);

  const refreshStorageStatus = async () => {
    try {
      const status = await getRepository().getStatus();
      setStorageStatus(status);
    } catch (e) {
      console.error('Failed to get storage diagnostics:', e);
    }
  };

  // Initialize repository on mount
  useEffect(() => {
    const repo = getRepository();
    repo.init().then(() => {
      refreshStorageStatus();
    }).catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPROVAL_REQUESTS, JSON.stringify(approvalRequests));
  }, [approvalRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_WORKER, selectedWorkerId);
  }, [selectedWorkerId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEMO_ROLE, activeDemoRole);
  }, [activeDemoRole]);

  // Keep inspected record in sync with record list updates
  useEffect(() => {
    if (selectedRecordForInspection) {
      const updated = records.find(r => r.id === selectedRecordForInspection.id);
      if (updated) {
        setSelectedRecordForInspection(updated);
      }
    }
  }, [records]);

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const setActiveDemoRole = (role: DemoRole) => {
    setActiveDemoRoleState(role);
  };

  const selectDemoWorker = (workerId: string) => {
    const found = workers.find(w => w.id === workerId);
    if (found) {
      setSelectedWorkerId(found.id);
    }
  };

  const addDemoWorker = (data: {
    name: string;
    hindiName?: string;
    trade: string;
    tradeHindi?: string;
    dailyRateAgreed: number;
    hubChowk: string;
    phoneMasked?: string;
  }) => {
    const numId = Math.floor(100 + Math.random() * 900);
    const newWorkerId = `MP-IND-2026-WM${numId}`;
    const newOpaqueToken = generateOpaqueCredentialToken();

    const createdWorker: WorkerProfile = {
      id: newWorkerId,
      name: data.name.trim(),
      hindiName: data.hindiName?.trim() || data.name.trim(),
      trade: data.trade.trim(),
      tradeHindi: data.tradeHindi?.trim() || data.trade.trim(),
      location: `Indore (${data.hubChowk.trim()})`,
      hubChowk: data.hubChowk.trim(),
      phoneMasked: data.phoneMasked || '+91 98260 •••••',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      avatarUrl: '',
      dailyRateAgreed: round2(safeNumber(data.dailyRateAgreed, 650)),
      verifiedExperienceMonths: 12,
      completedSites: 1,
      attendanceRate: 100,
      verificationStatus: 'verified',
      nfcTagId: `QR-IND-${numId}-A1B2C3`,
      cryptoChecksum: `sha256:${newOpaqueToken.slice(4, 20)}`,
      passCredentialToken: newOpaqueToken,
      isDemoData: true,
      emergencyContact: '+91 94250 •••••',
    };

    setWorkers(prev => [...prev, createdWorker]);
    setSelectedWorkerId(createdWorker.id);
  };

  const openRecordInspector = (record: WorkRecord) => {
    setSelectedRecordForInspection(record);
    setIsRecordInspectorOpen(true);
  };

  const closeRecordInspector = () => {
    setIsRecordInspectorOpen(false);
    setSelectedRecordForInspection(null);
  };

  const addWorkRecord = (data: Omit<WorkRecord, 'id' | 'hash' | 'previousHash' | 'balanceDue' | 'earnedWage'>) => {
    const newId = `REC-2026-${Date.now().toString().slice(-4)}`;
    // The previous hash is the hash of the current latest record (records[0]) or genesis
    const previousHash = records.length > 0 ? records[0].hash : 'genesis-00000000';

    const initialRecord: WorkRecord = {
      ...data,
      id: newId,
      workerId: worker.id,
      earnedWage: 0,
      paidAmount: 0,
      balanceDue: 0,
      payments: data.paidAmount > 0 ? [
        {
          id: `PAY-${Date.now()}`,
          amount: data.paidAmount,
          date: data.date,
          recordingParty: 'contractor',
          recordedRoleLabel: '[Demo Role: Site Supervisor / Munshi]',
          acknowledgmentStatus: 'unconfirmed_by_worker',
          notes: 'Initial cash recording at shift creation.',
        }
      ] : [],
      correctionHistory: [],
      minimumWageBenchmark: INDORE_SKILLED_CONSTRUCTION_BENCHMARK,
      previousHash,
      hash: '',
    };

    const calc = calculateRecordBreakdown(initialRecord);
    const finalRecord: WorkRecord = {
      ...initialRecord,
      earnedWage: calc.netWagesDue,
      paidAmount: calc.totalPaymentsRecorded,
      balanceDue: calc.outstandingBalance,
      detailedPaymentStatus: calc.paymentStatus,
      hash: computeCanonicalHash({ ...initialRecord, earnedWage: calc.netWagesDue, paidAmount: calc.totalPaymentsRecorded, balanceDue: calc.outstandingBalance }, previousHash),
    };

    setRecords(prev => [finalRecord, ...prev]);

    // Update worker stats
    setWorkers(prev =>
      prev.map(w =>
        w.id === worker.id ? { ...w, completedSites: w.completedSites + 1 } : w
      )
    );
  };

  const recordPayment = (recordId: string, paymentData: {
    amount: number;
    notes?: string;
    recordingParty: 'contractor' | 'supervisor' | 'worker';
    recordedRoleLabel: string;
    paymentMethod?: string;
  }) => {
    const validAmount = round2(safeNumber(paymentData.amount, 0));
    if (validAmount <= 0) return;

    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const newPayment: PaymentEntry = {
            id: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            amount: validAmount,
            date: new Date().toISOString().split('T')[0],
            recordingParty: paymentData.recordingParty,
            recordedRoleLabel: paymentData.recordedRoleLabel,
            acknowledgmentStatus: 'unconfirmed_by_worker',
            notes: paymentData.notes || 'Recorded via portal payment entry.',
            paymentMethod: paymentData.paymentMethod || 'Cash Advance',
          };

          const updatedPayments = [...(r.payments || []), newPayment];
          const calc = calculateRecordBreakdown({ ...r, payments: updatedPayments });

          const updatedRecord = {
            ...r,
            payments: updatedPayments,
            paidAmount: calc.totalPaymentsRecorded,
            balanceDue: calc.outstandingBalance,
            detailedPaymentStatus: calc.paymentStatus,
            workerAcknowledgmentStatus: calc.totalPaymentsConfirmed >= calc.netWagesDue ? ('acknowledged' as const) : ('pending' as const),
          };

          return {
            ...updatedRecord,
            hash: computeCanonicalHash(updatedRecord, r.previousHash),
          };
        }
        return r;
      })
    );
  };

  const acknowledgePayment = (recordId: string, paymentId: string, status: 'acknowledged_by_worker' | 'disputed_by_worker') => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const updatedPayments = (r.payments || []).map(p => {
            if (p.id === paymentId) {
              return {
                ...p,
                acknowledgmentStatus: status,
                acknowledgedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }),
              };
            }
            return p;
          });

          const calc = calculateRecordBreakdown({ ...r, payments: updatedPayments });

          const updatedRecord = {
            ...r,
            payments: updatedPayments,
            paidAmount: calc.totalPaymentsRecorded,
            balanceDue: calc.outstandingBalance,
            detailedPaymentStatus: calc.paymentStatus,
            workerAcknowledgmentStatus: calc.totalPaymentsConfirmed >= calc.netWagesDue ? ('acknowledged' as const) : (status === 'disputed_by_worker' ? ('disputed' as const) : ('pending' as const)),
          };

          return {
            ...updatedRecord,
            hash: computeCanonicalHash(updatedRecord, r.previousHash),
          };
        }
        return r;
      })
    );
  };

  const applyCorrection = (recordId: string, correctionData: {
    fieldName: 'agreedDailyRate' | 'daysWorked' | 'shiftHours' | 'overtimeHours' | 'overtimeRate';
    fieldLabel: string;
    newValue: number;
    reason: string;
    actorRole: string;
  }) => {
    const sanitizedNewValue = round2(safeNumber(correctionData.newValue, 0));

    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const previousValue = r[correctionData.fieldName] ?? 0;

          const newCorrection: CorrectionEntry = {
            id: `CORR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }),
            actorRole: correctionData.actorRole,
            fieldName: correctionData.fieldName,
            fieldLabel: correctionData.fieldLabel,
            previousValue,
            correctedValue: sanitizedNewValue,
            reason: correctionData.reason.trim() || 'Correction submitted with supervisor approval',
            workerAcknowledgment: 'pending',
          };

          const updatedRecordPartial = {
            ...r,
            [correctionData.fieldName]: sanitizedNewValue,
          };

          const calc = calculateRecordBreakdown(updatedRecordPartial);

          const updatedFinal = {
            ...updatedRecordPartial,
            earnedWage: calc.netWagesDue,
            paidAmount: calc.totalPaymentsRecorded,
            balanceDue: calc.outstandingBalance,
            detailedPaymentStatus: calc.paymentStatus,
            status: 'modified' as const,
            modificationReason: correctionData.reason,
            modifiedAt: newCorrection.timestamp,
            correctionHistory: [newCorrection, ...(r.correctionHistory || [])],
          };

          return {
            ...updatedFinal,
            hash: computeCanonicalHash(updatedFinal, r.previousHash),
          };
        }
        return r;
      })
    );
  };

  const respondToCorrection = (recordId: string, correctionId: string, response: 'accepted' | 'disputed') => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const updatedHistory = (r.correctionHistory || []).map(c => {
            if (c.id === correctionId) {
              return {
                ...c,
                workerAcknowledgment: response,
                workerResponseAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }),
              };
            }
            return c;
          });
          const updated = {
            ...r,
            correctionHistory: updatedHistory,
          };
          return {
            ...updated,
            hash: computeCanonicalHash(updated, r.previousHash),
          };
        }
        return r;
      })
    );
  };

  const fileDispute = (data: {
    workRecordId: string;
    issueType: 'unpaid_wages' | 'unrecorded_overtime' | 'rate_cut' | 'wrong_hours';
    description: string;
    claimedAmount: number;
    paidAmount: number;
  }) => {
    const targetRecord = records.find(r => r.id === data.workRecordId);
    if (!targetRecord) return;

    const discrepancyAmount = Math.max(0, data.claimedAmount - data.paidAmount);
    const newDispute: DisputeRecord = {
      id: `DISP-2026-IND-${Date.now().toString().slice(-3)}`,
      workRecordId: targetRecord.id,
      dateLodged: new Date().toISOString().split('T')[0],
      siteName: targetRecord.siteName,
      contractorName: targetRecord.contractorName,
      workerName: worker.name,
      claimedAmount: data.claimedAmount,
      paidAmount: data.paidAmount,
      discrepancyAmount,
      issueType: data.issueType,
      description: data.description,
      supportingEvidence: [
        `Shift Attendance Log ${targetRecord.date} (${targetRecord.shiftHours}h shift)`,
        `Agreed Rate Register: ₹${targetRecord.agreedDailyRate}/day`,
        `Digital Hash: ${targetRecord.hash ? targetRecord.hash.slice(0, 10) : 'verified'}...`
      ],
      status: 'open',
      timeline: [
        {
          date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }),
          note: `Dispute filed by ${worker.name}. Formal mediation notice queued for ${targetRecord.contractorName}.`,
          actor: 'Worker Portal'
        }
      ]
    };

    setDisputes(prev => [newDispute, ...prev]);

    // Flag the record status
    setRecords(prev =>
      prev.map(r => (r.id === targetRecord.id ? { ...r, status: 'disputed', detailedPaymentStatus: 'disputed' } : r))
    );
  };

  const updateDisputeStatus = (disputeId: string, newStatus: DisputeStatus, note: string) => {
    setDisputes(prev =>
      prev.map(d => {
        if (d.id === disputeId) {
          const updatedTimeline = [
            ...d.timeline,
            {
              date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }),
              note,
              actor: 'Mediation Desk / Chowk Committee'
            }
          ];
          return { ...d, status: newStatus, timeline: updatedTimeline };
        }
        return d;
      })
    );

    // If resolved, update record balance
    if (newStatus === 'resolved') {
      const targetDispute = disputes.find(d => d.id === disputeId);
      if (targetDispute) {
        setRecords(prev =>
          prev.map(r => {
            if (r.id === targetDispute.workRecordId) {
              const updated = {
                ...r,
                paidAmount: targetDispute.claimedAmount,
                balanceDue: 0,
                status: 'verified' as const,
                detailedPaymentStatus: 'acknowledged_as_received' as const,
                notes: `${r.notes || ''} [Resolved via chowk mediation on ${new Date().toLocaleDateString('en-IN')}]`
              };
              return {
                ...updated,
                hash: computeCanonicalHash(updated, r.previousHash),
              };
            }
            return r;
          })
        );
      }
    }
  };

  const contractorRespondToDispute = (disputeId: string, responseData: { text: string; respondent: string }) => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
    setDisputes(prev =>
      prev.map(d => {
        if (d.id === disputeId) {
          const updatedTimeline = [
            ...d.timeline,
            {
              date: timestamp,
              note: `Contractor response submitted by ${responseData.respondent}: "${responseData.text}"`,
              actor: 'Contractor Representative'
            }
          ];
          return {
            ...d,
            status: 'under_review',
            contractorResponse: {
              text: responseData.text,
              respondent: responseData.respondent,
              date: timestamp,
            },
            timeline: updatedTimeline,
          };
        }
        return d;
      })
    );
  };

  const contractorDisbursePayment = (recordId: string, amount: number) => {
    recordPayment(recordId, {
      amount,
      notes: `Disbursed by contractor on ${new Date().toLocaleDateString('en-IN')}`,
      recordingParty: 'contractor',
      recordedRoleLabel: '[Demo Role: Contractor Supervisor]',
      paymentMethod: 'Cash',
    });
  };

  // Test bench attack 1: Unauthorized rate alteration
  const tamperRecord = (recordId: string, newRate: number) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const originalDailyRate = r.originalDailyRate || r.agreedDailyRate;
          const updatedRecord = {
            ...r,
            originalDailyRate,
            agreedDailyRate: newRate,
          };
          const calc = calculateRecordBreakdown(updatedRecord);
          return {
            ...updatedRecord,
            earnedWage: calc.netWagesDue,
            balanceDue: calc.outstandingBalance,
            status: 'modified',
            isTampered: true,
            modificationReason: `TAMPER ALERT: Rate modified retroactively from ₹${originalDailyRate} to ₹${newRate} without authorized re-hashing. Hash mismatch detected!`,
            modifiedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }),
            // Intentionally preserve original r.hash so the block digest fails!
          };
        }
        return r;
      })
    );
  };

  // Test bench attack 2: Corrupted predecessor hash
  const breakChainLink = (recordId: string) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const corruptedPrev = 'corrupted-orphan-link-0x99';
          return {
            ...r,
            previousHash: corruptedPrev,
            // Recompute block digest with corrupted link so block digest is valid, but linkage fails!
            hash: computeCanonicalHash(r, corruptedPrev),
            modificationReason: 'CORRUPTED LINK: Predecessor hash corrupted to orphan pointer. Internal block digest valid, but chain sequence broken.',
          };
        }
        return r;
      })
    );
  };

  const restoreRecord = (recordId: string) => {
    const baselineRec = INITIAL_WORK_RECORDS.find(b => b.id === recordId);
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          if (baselineRec) {
            return { ...baselineRec };
          }
          const originalRate = r.originalDailyRate || 650;
          const restoredRecord = {
            ...r,
            agreedDailyRate: originalRate,
            isTampered: false,
            modificationReason: undefined,
            modifiedAt: undefined,
          };
          const calc = calculateRecordBreakdown(restoredRecord);
          const finalRestored = {
            ...restoredRecord,
            earnedWage: calc.netWagesDue,
            balanceDue: calc.outstandingBalance,
            status: 'verified' as const,
          };
          return {
            ...finalRestored,
            hash: computeCanonicalHash(finalRestored, r.previousHash),
          };
        }
        return r;
      })
    );
  };

  const injectUnreasonedDeduction = (recordId: string) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const badDeduction = {
            id: `DED-ANOM-${Date.now()}`,
            title: 'Unexplained Penal Cut',
            amount: 150,
            reason: '', // Intentionally blank to test RULE-05
          };
          const updatedDeductions = [...(r.itemizedDeductions || []), badDeduction];
          const calc = calculateRecordBreakdown({ ...r, itemizedDeductions: updatedDeductions });
          return {
            ...r,
            itemizedDeductions: updatedDeductions,
            earnedWage: calc.netWagesDue,
            balanceDue: calc.outstandingBalance,
          };
        }
        return r;
      })
    );
  };

  const injectDuplicateShift = () => {
    if (records.length === 0) return;
    const base = records[0];
    const duplicate: WorkRecord = {
      ...base,
      id: `REC-DUP-${Date.now().toString().slice(-4)}`,
      siteName: `${base.siteName} (Duplicate Split Shift)`,
      notes: '[DEMO DATA] Simulated overlapping shift on same calendar date to test RULE-01',
    };
    setRecords(prev => [duplicate, ...prev]);
  };

  const injectOverlongShift = () => {
    if (records.length === 0) return;
    const base = records[0];
    const overlong: WorkRecord = {
      ...base,
      id: `REC-LONG-${Date.now().toString().slice(-4)}`,
      siteName: `${base.siteName} (Simulated 14h Extended Shift)`,
      date: '2026-10-15',
      daysWorked: 1,
      shiftHours: 14,
      overtimeHours: 0,
      shiftStartTime: '06:00 AM',
      shiftEndTime: '20:00 PM',
      notes: '[DEMO DATA] Simulated single-day continuous 14h shift to test RULE-02 configurable policy',
    };
    setRecords(prev => [overlong, ...prev]);
  };

  const corruptHashFormat = (recordId: string) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          return {
            ...r,
            hash: 'corrupt_format_invalid_non_hex_digest!@#$999',
          };
        }
        return r;
      })
    );
  };

  const injectOverpayment = (recordId: string) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const calc = calculateRecordBreakdown(r);
          const excessivePayment: PaymentEntry = {
            id: `PAY-EXCESS-${Date.now().toString().slice(-4)}`,
            amount: round2(calc.netWagesDue + 1500),
            date: '2026-10-16',
            recordingParty: 'contractor',
            recordedRoleLabel: '[Demo Role: Overpayment Simulation]',
            acknowledgmentStatus: 'unconfirmed_by_worker',
            notes: 'Simulated excess payment exceeding net wages due to test overpayment handling.',
            paymentMethod: 'Bank Transfer',
          };
          const updatedPayments = [...(r.payments || []), excessivePayment];
          const newCalc = calculateRecordBreakdown({ ...r, payments: updatedPayments });
          return {
            ...r,
            payments: updatedPayments,
            paidAmount: newCalc.totalPaymentsRecorded,
            balanceDue: newCalc.outstandingBalance,
            detailedPaymentStatus: newCalc.paymentStatus,
          };
        }
        return r;
      })
    );
  };

  const addApprovalRequest = (data: {
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
  }) => {
    const newReq: ApprovalRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      type: data.type,
      workRecordId: data.workRecordId,
      disputeId: data.disputeId,
      requesterRole: data.requesterRole,
      requesterName: data.requesterName,
      targetWorkerId: data.targetWorkerId,
      targetWorkerName: data.targetWorkerName,
      title: data.title,
      summary: data.summary,
      amount: data.amount,
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      status: 'simulated_pending',
      simulationDisclaimer:
        'Simulated Cross-Device Request: In Local Demo Mode, this approval request is simulated locally via IndexedDB. Multi-device sync will be enabled with Supabase deployment next week.',
    };

    setApprovalRequests(prev => [newReq, ...prev]);
    getRepository().saveApprovalRequest(newReq).catch(console.error);
    refreshStorageStatus().catch(console.error);
  };

  const respondToApprovalRequest = (
    requestId: string,
    decision: 'simulated_approved' | 'simulated_rejected',
    note?: string
  ) => {
    setApprovalRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          const updated: ApprovalRequest = {
            ...req,
            status: decision,
            respondedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
            responseNote:
              note || (decision === 'simulated_approved' ? 'Worker approved via simulated digital pass' : 'Rejected in simulation'),
          };
          getRepository().updateApprovalRequest(updated).catch(console.error);
          return updated;
        }
        return req;
      })
    );
    refreshStorageStatus().catch(console.error);
  };

  const resetDemoData = () => {
    getRepository().resetToBaseline().catch(console.error);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.DISPUTES);
    localStorage.removeItem(STORAGE_KEYS.WORKERS);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_WORKER);
    localStorage.removeItem(STORAGE_KEYS.DEMO_ROLE);
    localStorage.removeItem(STORAGE_KEYS.APPROVAL_REQUESTS);
    setRecords(INITIAL_WORK_RECORDS);
    setDisputes(INITIAL_DISPUTES);
    setWorkers(INITIAL_WORKERS);
    setSelectedWorkerId(INITIAL_WORKERS[0].id);
    setApprovalRequests(INITIAL_APPROVAL_REQUESTS);
    setActiveDemoRoleState('worker');
    setActiveJudgeTourStep(null);
    setIsRecordInspectorOpen(false);
    setSelectedRecordForInspection(null);
    refreshStorageStatus().catch(console.error);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: setLanguageState,
        toggleLanguage,
        currentView,
        setCurrentView,
        activeDemoRole,
        setActiveDemoRole,
        isDemoEntryModalOpen,
        setDemoEntryModalOpen,
        workers,
        worker,
        selectDemoWorker,
        addDemoWorker,
        records,
        disputes,
        skills,
        contractor,
        addWorkRecord,
        fileDispute,
        updateDisputeStatus,
        contractorRespondToDispute,
        contractorDisbursePayment,
        recordPayment,
        acknowledgePayment,
        applyCorrection,
        respondToCorrection,
        tamperRecord,
        restoreRecord,
        breakChainLink,
        injectUnreasonedDeduction,
        injectDuplicateShift,
        injectOverlongShift,
        corruptHashFormat,
        injectOverpayment,
        resetDemoData,
        activeJudgeTourStep,
        setActiveJudgeTourStep,
        isShiftModalOpen,
        setShiftModalOpen,
        isDisputeModalOpen,
        setDisputeModalOpen,
        selectedDisputeRecord,
        setSelectedDisputeRecord,
        isSlipModalOpen,
        setSlipModalOpen,
        selectedSlipRecord,
        setSelectedSlipRecord,
        isRecordInspectorOpen,
        selectedRecordForInspection,
        openRecordInspector,
        closeRecordInspector,
        approvalRequests,
        addApprovalRequest,
        respondToApprovalRequest,
        storageStatus,
        refreshStorageStatus,
        isStorageModalOpen,
        setStorageModalOpen,
        isApprovalsModalOpen,
        setApprovalsModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
