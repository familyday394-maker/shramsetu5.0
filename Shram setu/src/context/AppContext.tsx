import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WorkerProfile,
  WorkRecord,
  DisputeRecord,
  SkillItem,
  Contractor,
  Language,
} from '../types';
import {
  INITIAL_WORKER,
  INITIAL_WORK_RECORDS,
  INITIAL_DISPUTES,
  INITIAL_SKILLS,
  INITIAL_CONTRACTOR,
} from '../data/mockData';

type ViewMode = 'home' | 'worker' | 'pass' | 'contractor' | 'disputes' | 'skills' | 'project' | 'audit';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  worker: WorkerProfile;
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
  updateDisputeStatus: (disputeId: string, newStatus: 'open' | 'in_mediation' | 'resolved', note: string) => void;
  contractorDisbursePayment: (recordId: string, amount: number) => void;
  tamperRecord: (recordId: string, newRate: number) => void;
  restoreRecord: (recordId: string) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RECORDS: 'shram_setu_records_v2',
  DISPUTES: 'shram_setu_disputes_v2',
  WORKER: 'shram_setu_worker_v2',
  LANGUAGE: 'shram_setu_lang_v2',
};

// Simple deterministic hash simulation for the demonstration
function generateRecordHash(rec: Partial<WorkRecord>, prevHash: string): string {
  const payload = `${prevHash}-${rec.date}-${rec.agreedDailyRate}-${rec.shiftHours}-${rec.overtimeHours}-${rec.earnedWage}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) - hash) + payload.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return saved === 'hi' ? 'hi' : 'en';
  });

  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [worker, setWorker] = useState<WorkerProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKER);
    return saved ? JSON.parse(saved) : INITIAL_WORKER;
  });

  const [records, setRecords] = useState<WorkRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return saved ? JSON.parse(saved) : INITIAL_WORK_RECORDS;
  });

  const [disputes, setDisputes] = useState<DisputeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DISPUTES);
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
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
    localStorage.setItem(STORAGE_KEYS.WORKER, JSON.stringify(worker));
  }, [worker]);

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const addWorkRecord = (data: Omit<WorkRecord, 'id' | 'hash' | 'previousHash' | 'balanceDue' | 'earnedWage'>) => {
    const earnedWage = Number(data.agreedDailyRate) + (Number(data.overtimeHours) * Number(data.overtimeRate));
    const paidAmount = Number(data.paidAmount) || 0;
    const balanceDue = Math.max(0, earnedWage - paidAmount);
    const newId = `REC-2026-${Date.now().toString().slice(-4)}`;
    const previousHash = records.length > 0 ? records[0].hash : 'genesis-00000000';

    const newRecord: WorkRecord = {
      ...data,
      id: newId,
      earnedWage,
      paidAmount,
      balanceDue,
      previousHash,
      hash: generateRecordHash({ ...data, earnedWage }, previousHash),
    };

    setRecords(prev => [newRecord, ...prev]);

    // Update worker stats
    setWorker(prev => ({
      ...prev,
      completedSites: prev.completedSites + 1,
    }));
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
        `Digital Hash: ${targetRecord.hash.slice(0, 10)}...`
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
      prev.map(r => (r.id === targetRecord.id ? { ...r, status: 'disputed' } : r))
    );
  };

  const updateDisputeStatus = (disputeId: string, newStatus: 'open' | 'in_mediation' | 'resolved', note: string) => {
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
              return {
                ...r,
                paidAmount: targetDispute.claimedAmount,
                balanceDue: 0,
                status: 'verified',
                notes: `${r.notes || ''} [Resolved via chowk mediation on ${new Date().toLocaleDateString('en-IN')}]`
              };
            }
            return r;
          })
        );
      }
    }
  };

  const contractorDisbursePayment = (recordId: string, amount: number) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const newPaid = Math.min(r.earnedWage, r.paidAmount + amount);
          const newBalance = Math.max(0, r.earnedWage - newPaid);
          return {
            ...r,
            paidAmount: newPaid,
            balanceDue: newBalance,
            status: newBalance === 0 ? 'verified' : r.status,
            notes: `${r.notes || ''} [₹${amount} paid on ${new Date().toLocaleDateString('en-IN')}]`
          };
        }
        return r;
      })
    );
  };

  // Bal Vigyan Tamper Demonstrator: simulates an unauthorized modification to show the tamper-detection flag
  const tamperRecord = (recordId: string, newRate: number) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const originalDailyRate = r.originalDailyRate || r.agreedDailyRate;
          return {
            ...r,
            originalDailyRate,
            agreedDailyRate: newRate,
            earnedWage: newRate + (r.overtimeHours * r.overtimeRate),
            balanceDue: Math.max(0, (newRate + (r.overtimeHours * r.overtimeRate)) - r.paidAmount),
            status: 'modified',
            isTampered: true,
            modificationReason: `TAMPER ALERT: Rate modified retroactively from ₹${originalDailyRate} to ₹${newRate} without cryptographic multisig approval. Hash mismatch detected!`,
            modifiedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }),
          };
        }
        return r;
      })
    );
  };

  const restoreRecord = (recordId: string) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const originalRate = r.originalDailyRate || 650;
          return {
            ...r,
            agreedDailyRate: originalRate,
            earnedWage: originalRate + (r.overtimeHours * r.overtimeRate),
            balanceDue: Math.max(0, (originalRate + (r.overtimeHours * r.overtimeRate)) - r.paidAmount),
            status: 'verified',
            isTampered: false,
            modificationReason: undefined,
            modifiedAt: undefined,
          };
        }
        return r;
      })
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.DISPUTES);
    localStorage.removeItem(STORAGE_KEYS.WORKER);
    setRecords(INITIAL_WORK_RECORDS);
    setDisputes(INITIAL_DISPUTES);
    setWorker(INITIAL_WORKER);
    setActiveJudgeTourStep(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: setLanguageState,
        toggleLanguage,
        currentView,
        setCurrentView,
        worker,
        records,
        disputes,
        skills,
        contractor,
        addWorkRecord,
        fileDispute,
        updateDisputeStatus,
        contractorDisbursePayment,
        tamperRecord,
        restoreRecord,
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
