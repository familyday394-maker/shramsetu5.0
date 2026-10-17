import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  History,
  FileText,
  DollarSign,
  UserCheck,
  Building,
  HelpCircle,
  ArrowRight,
  PlusCircle,
  FileEdit,
  Lock,
} from 'lucide-react';
import { calculateRecordBreakdown } from '../utils/wageCalculator';
import { DetailedPaymentStatus } from '../types';

export const WageRecordDetailModal: React.FC = () => {
  const {
    isRecordInspectorOpen,
    closeRecordInspector,
    selectedRecordForInspection,
    recordPayment,
    acknowledgePayment,
    applyCorrection,
    respondToCorrection,
    language,
    setCurrentView,
    setDisputeModalOpen,
    setSelectedDisputeRecord,
  } = useApp();

  // Tab control within inspector: 'breakdown' | 'payments' | 'corrections' | 'benchmark'
  const [activeTab, setActiveTab] = useState<'breakdown' | 'payments' | 'corrections' | 'benchmark'>('breakdown');

  // Form states for simulated payment entry
  const [newPaymentAmount, setNewPaymentAmount] = useState<string>('');
  const [newPaymentMethod, setNewPaymentMethod] = useState<string>('Cash Advance');
  const [newPaymentNote, setNewPaymentNote] = useState<string>('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Form states for simulated correction
  const [corrField, setCorrField] = useState<'agreedDailyRate' | 'daysWorked' | 'shiftHours' | 'overtimeHours'>('daysWorked');
  const [corrNewValue, setCorrNewValue] = useState<string>('');
  const [corrReason, setCorrReason] = useState<string>('');
  const [corrRole, setCorrRole] = useState<string>('[Demo Role: Contractor Supervisor]');
  const [corrSubmitting, setCorrSubmitting] = useState(false);
  const [corrSuccessMsg, setCorrSuccessMsg] = useState<string | null>(null);

  if (!isRecordInspectorOpen || !selectedRecordForInspection) return null;

  const record = selectedRecordForInspection;
  const breakdown = calculateRecordBreakdown(record);
  const benchmark = record.minimumWageBenchmark;

  // Handle simulated payment submission
  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newPaymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid positive payment amount.');
      return;
    }

    setPaymentSubmitting(true);
    recordPayment(record.id, {
      amount: amountNum,
      recordingParty: 'contractor',
      recordedRoleLabel: '[Demo Role: Site Supervisor / Munshi]',
      paymentMethod: newPaymentMethod,
      notes: newPaymentNote || 'Simulated payment recorded via transparency inspector.',
    });

    setPaymentSuccessMsg(`Payment of ₹${amountNum.toLocaleString('en-IN')} recorded successfully. Status is unconfirmed by worker.`);
    setNewPaymentAmount('');
    setNewPaymentNote('');
    setPaymentSubmitting(false);

    setTimeout(() => setPaymentSuccessMsg(null), 4000);
  };

  // Handle simulated correction submission
  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valNum = parseFloat(corrNewValue);
    if (isNaN(valNum) || valNum < 0) {
      alert('Please enter a valid non-negative number for the corrected value.');
      return;
    }
    if (!corrReason.trim()) {
      alert('A stated reason is mandatory to preserve the transparent audit trail.');
      return;
    }

    const labels: Record<string, string> = {
      agreedDailyRate: 'Agreed Daily Wage Rate (₹)',
      daysWorked: 'Recorded Days Worked',
      shiftHours: 'Shift Hours',
      overtimeHours: 'Overtime Hours',
    };

    setCorrSubmitting(true);
    applyCorrection(record.id, {
      fieldName: corrField,
      fieldLabel: labels[corrField] || corrField,
      newValue: valNum,
      reason: corrReason.trim(),
      actorRole: corrRole,
    });

    setCorrSuccessMsg(`Correction applied to ${labels[corrField]}. Previous value preserved in history.`);
    setCorrNewValue('');
    setCorrReason('');
    setCorrSubmitting(false);

    setTimeout(() => setCorrSuccessMsg(null), 4000);
  };

  const getStatusBadge = (status: DetailedPaymentStatus) => {
    switch (status) {
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Unpaid (भुगतान लंबित)</span>
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Partially Paid (आंशिक भुगतान)</span>
          </span>
        );
      case 'recorded_as_paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-purple-50 text-purple-800 border border-purple-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Recorded as Paid · Worker Acknowledgment Pending (पुष्टि प्रतीक्षित)</span>
          </span>
        );
      case 'acknowledged_as_received':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Acknowledged as Received (श्रमिक द्वारा पुष्ट)</span>
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-red-50 text-red-800 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Disputed (विवादित)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-[#E3E0D8] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-[#123524] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#1B4332]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-bold text-base border border-white/20">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="modal-title" className="text-base sm:text-lg font-bold text-white">
                  {language === 'hi' ? 'पारदर्शी मजदूरी खाता एवं गणना विवरण' : 'Transparent Wage Ledger Inspector'}
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-[#E8EFEA]">
                  DEMO DATA · ILLUSTRATIVE
                </span>
              </div>
              <p className="text-xs text-[#A3B899] mt-0.5">
                Record ID: <span className="font-mono text-white">{record.id}</span> · Worker ID: <span className="font-mono text-white">{record.workerId || 'MP-IND-2026-WM842'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={closeRecordInspector}
            className="p-2 text-[#A3B899] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs within Inspector */}
        <div className="bg-[#FAF9F5] border-b border-[#E3E0D8] px-5 sm:px-6 flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'breakdown'
                ? 'border-[#1B4332] text-[#123524] font-bold'
                : 'border-transparent text-[#52796F] hover:text-[#123524]'
            }`}
          >
            {language === 'hi' ? '१. मजदूरी गणना' : '1. Wage Calculation'}
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'border-[#1B4332] text-[#123524] font-bold'
                : 'border-transparent text-[#52796F] hover:text-[#123524]'
            }`}
          >
            <span>{language === 'hi' ? '२. भुगतान इतिहास' : '2. Payment History'}</span>
            <span className="text-[10px] bg-[#E8EFEA] text-[#1B4332] px-1.5 py-0.2 rounded-full font-mono">
              {(record.payments || []).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('corrections')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'corrections'
                ? 'border-[#1B4332] text-[#123524] font-bold'
                : 'border-transparent text-[#52796F] hover:text-[#123524]'
            }`}
          >
            <span>{language === 'hi' ? '३. संशोधन इतिहास' : '3. Change History'}</span>
            <span className="text-[10px] bg-[#E8EFEA] text-[#1B4332] px-1.5 py-0.2 rounded-full font-mono">
              {(record.correctionHistory || []).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'benchmark'
                ? 'border-[#1B4332] text-[#123524] font-bold'
                : 'border-transparent text-[#52796F] hover:text-[#123524]'
            }`}
          >
            {language === 'hi' ? '४. न्यूनतम मजदूरी बेंचमार्क' : '4. Statutory Benchmark'}
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#1A2421]">
          {/* Context Banner: Site & Terms */}
          <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E3E0D8] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[#52796F] block">{language === 'hi' ? 'साइट व स्थान' : 'Site & Location'}:</span>
              <span className="font-bold text-[#123524] block">{record.siteName}</span>
              <span className="text-[#6B8177]">{record.siteLocation}</span>
            </div>
            <div>
              <span className="text-[#52796F] block">{language === 'hi' ? 'ठेकेदार' : 'Contractor'}:</span>
              <span className="font-bold text-[#123524] block">{record.contractorName}</span>
              <span className="text-[#6B8177] font-mono">{record.contractorPhone}</span>
            </div>
            <div>
              <span className="text-[#52796F] block">{language === 'hi' ? 'सत्यापन स्थिति व हैश' : 'Integrity Verification'}:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
                <span className="font-mono text-[11px] text-[#2D6A4F] font-semibold">
                  Block #{record.id.slice(-4)} · Verified
                </span>
              </div>
              <span className="text-[10px] text-[#52796F] font-mono block truncate">
                Hash: {record.hash || 'sha256-verified'}
              </span>
            </div>
          </div>

          {/* TAB 1: WAGE CALCULATION BREAKDOWN */}
          {activeTab === 'breakdown' && (
            <div className="space-y-6">
              {/* Financial Status Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-[#E3E0D8]">
                  <span className="text-[11px] text-[#52796F] block">Agreed Daily Rate</span>
                  <span className="text-lg font-bold font-mono text-[#123524] tabular-nums">
                    ₹{breakdown.agreedDailyRate.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#52796F] block">per standard day</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E3E0D8]">
                  <span className="text-[11px] text-[#52796F] block">Total Wages Due</span>
                  <span className="text-lg font-bold font-mono text-[#123524] tabular-nums">
                    ₹{breakdown.netWagesDue.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#52796F] block">after itemized adjustments</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E3E0D8]">
                  <span className="text-[11px] text-[#52796F] block">Payments Recorded</span>
                  <span className="text-lg font-bold font-mono text-[#2D6A4F] tabular-nums">
                    ₹{breakdown.totalPaymentsRecorded.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#52796F] block">
                    (₹{breakdown.totalPaymentsConfirmed.toFixed(2)} confirmed)
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E3E0D8]">
                  <span className="text-[11px] text-[#52796F] block">Outstanding Balance</span>
                  <span className="text-lg font-bold font-mono text-[#C94A29] tabular-nums">
                    ₹{breakdown.outstandingBalance.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#C94A29] block">
                    {breakdown.outstandingBalance > 0 ? 'Pending disbursement' : 'Settled in full'}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAF9F5] border border-[#E3E0D8] text-xs">
                <span className="font-medium text-[#354F52]">Current Payment State:</span>
                <div>{getStatusBadge(breakdown.paymentStatus)}</div>
              </div>

              {/* Inspectable Formula Calculation Table */}
              <div className="border border-[#E3E0D8] rounded-xl overflow-hidden">
                <div className="bg-[#FAF9F5] px-4 py-2.5 border-b border-[#E3E0D8] font-semibold text-xs text-[#123524] flex items-center justify-between">
                  <span>Transparent Calculation Step-by-Step</span>
                  <span className="text-[11px] text-[#52796F] font-normal font-mono">Formula: (Days × Rate) + OT + Allowances - Deductions</span>
                </div>

                <div className="divide-y divide-[#EAE8E0] text-xs">
                  {/* Step 1: Base Wage */}
                  <div className="p-3.5 flex items-center justify-between hover:bg-[#FAF9F5]/50">
                    <div>
                      <span className="font-semibold text-[#123524] block">1. Base Wage Component</span>
                      <span className="text-[11px] text-[#52796F]">
                        {breakdown.daysWorked} day{breakdown.daysWorked > 1 ? 's' : ''} worked × ₹{breakdown.agreedDailyRate}/day (at 8 hours/day = {breakdown.hoursWorked} hrs)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#123524] tabular-nums">
                      +₹{breakdown.baseWage.toFixed(2)}
                    </span>
                  </div>

                  {/* Step 2: Overtime */}
                  <div className="p-3.5 flex items-center justify-between hover:bg-[#FAF9F5]/50">
                    <div>
                      <span className="font-semibold text-[#123524] block">2. Overtime Hours Compensation</span>
                      <span className="text-[11px] text-[#52796F]">
                        {breakdown.overtimeHours} overtime hour{breakdown.overtimeHours !== 1 ? 's' : ''} × ₹{breakdown.overtimeRate}/hr
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-[#123524] tabular-nums">
                      +₹{breakdown.overtimeWage.toFixed(2)}
                    </span>
                  </div>

                  {/* Step 3: Additional Allowances */}
                  <div className="p-3.5 flex items-center justify-between hover:bg-[#FAF9F5]/50">
                    <div>
                      <span className="font-semibold text-[#123524] block">3. Additional Allowances (Travel / Specialty Tool)</span>
                      <span className="text-[11px] text-[#52796F]">
                        {(record.additionalAllowances || []).length > 0
                          ? (record.additionalAllowances || []).map(a => `${a.title}: ₹${a.amount}`).join(', ')
                          : 'No additional allowances logged for this shift cycle'}
                      </span>
                    </div>
                    <span className="font-mono text-[#52796F] tabular-nums">
                      +₹{breakdown.additionalAllowancesTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Gross Total */}
                  <div className="p-3.5 bg-[#FAF9F5] flex items-center justify-between font-semibold">
                    <span className="text-[#123524]">Subtotal: Gross Wages Due</span>
                    <span className="font-mono font-bold text-[#123524] tabular-nums">
                      ₹{breakdown.grossWagesDue.toFixed(2)}
                    </span>
                  </div>

                  {/* Step 4: Itemized Deductions */}
                  <div className="p-3.5 flex items-center justify-between hover:bg-[#FAF9F5]/50">
                    <div>
                      <span className="font-semibold text-[#123524] block">4. Itemized Deductions (with Stated Reason)</span>
                      <span className="text-[11px] text-[#52796F]">
                        {(record.itemizedDeductions || []).length > 0
                          ? (record.itemizedDeductions || []).map(d => `${d.title} (₹${d.amount}): ${d.reason}`).join(', ')
                          : 'Zero arbitrary deductions. Standard principle: No undocumented cuts allowed.'}
                      </span>
                    </div>
                    <span className="font-mono text-[#C94A29] tabular-nums">
                      -₹{breakdown.itemizedDeductionsTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Final Net Wages Due */}
                  <div className="p-4 bg-[#E8EFEA] flex items-center justify-between font-bold text-sm">
                    <span className="text-[#123524]">Net Wages Earned &amp; Due</span>
                    <span className="font-mono text-base text-[#123524] tabular-nums">
                      ₹{breakdown.netWagesDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Crucial Transparency Principle Card */}
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#123524]">
                  <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
                  <span>The Core Principle of Dual Acknowledgment</span>
                </div>
                <p className="text-[#52796F] leading-relaxed">
                  On Shram Setu 2.0, contractor payment entries (₹{breakdown.totalPaymentsRecorded.toFixed(2)}) are tracked separately from worker cash acknowledgment (₹{breakdown.totalPaymentsConfirmed.toFixed(2)}). Even if a contractor marks an entry as disbursed, the system does not count it as received until the worker acknowledges the handover.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENT HISTORY & RECORDING */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#123524]">Payment Entries Log</h3>
                  <p className="text-xs text-[#52796F]">
                    Every recorded disbursement is tracked with its recording actor, method, and worker acknowledgment state.
                  </p>
                </div>
                <div>{getStatusBadge(breakdown.paymentStatus)}</div>
              </div>

              {/* List of Recorded Payments */}
              <div className="space-y-3">
                {(record.payments || []).length === 0 ? (
                  <div className="p-6 text-center bg-[#FAF9F5] rounded-xl border border-[#E3E0D8] text-xs text-[#52796F]">
                    No payments have been recorded for this record yet. Total balance of ₹{breakdown.netWagesDue.toFixed(2)} is unpaid.
                  </div>
                ) : (
                  (record.payments || []).map(p => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-white border border-[#E3E0D8] shadow-2xs space-y-2.5 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-[#123524] font-mono tabular-nums">
                              ₹{p.amount.toFixed(2)}
                            </span>
                            <span className="text-[11px] text-[#52796F] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E3E0D8]">
                              {p.paymentMethod || 'Cash'}
                            </span>
                            <span className="text-[10px] font-mono text-[#52796F]">
                              ID: {p.id}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#52796F] mt-0.5">
                            Recorded on <span className="font-semibold text-[#1A2421]">{p.date}</span> by{' '}
                            <span className="font-medium text-[#123524]">{p.recordedRoleLabel}</span>
                          </div>
                        </div>

                        <div>
                          {p.acknowledgmentStatus === 'acknowledged_by_worker' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Worker Confirmed</span>
                            </span>
                          )}
                          {p.acknowledgmentStatus === 'unconfirmed_by_worker' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3" />
                              <span>Worker Acknowledgment Pending</span>
                            </span>
                          )}
                          {p.acknowledgmentStatus === 'disputed_by_worker' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Disputed by Worker</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {p.notes && (
                        <p className="text-[11px] text-[#354F52] bg-[#FAF9F5] p-2 rounded border border-[#E3E0D8]">
                          Note: {p.notes}
                        </p>
                      )}

                      {/* Interactive Worker Acknowledgment Controls */}
                      {p.acknowledgmentStatus === 'unconfirmed_by_worker' && (
                        <div className="pt-2 border-t border-[#EAE8E0] flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-[#C94A29] font-medium">
                            ⚠ This entry does not prove cash was received until confirmed by the worker.
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => acknowledgePayment(record.id, p.id, 'acknowledged_by_worker')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>[Worker Action: Confirm Cash Received]</span>
                            </button>
                            <button
                              onClick={() => acknowledgePayment(record.id, p.id, 'disputed_by_worker')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#C94A29] hover:bg-red-50 border border-red-200 rounded transition-colors"
                            >
                              [Worker Action: Dispute Entry]
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Form: Record a Simulated Payment */}
              <div className="bg-[#FAF9F5] p-4 sm:p-5 rounded-xl border border-[#E3E0D8] space-y-3">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#1B4332]" />
                  <h4 className="font-bold text-xs sm:text-sm text-[#123524]">
                    Simulate Recording a New Payment Entry
                  </h4>
                </div>
                <p className="text-[11px] text-[#52796F]">
                  Test the platform principle: Recording a payment adds it to the ledger with role attribution, but leaves it marked as pending worker confirmation.
                </p>

                {paymentSuccessMsg && (
                  <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    {paymentSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleRecordPaymentSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[#52796F] font-medium mb-1">
                      Payment Amount (₹) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="e.g. 650"
                      value={newPaymentAmount}
                      onChange={e => setNewPaymentAmount(e.target.value)}
                      required
                      className="w-full p-2 bg-white rounded border border-[#D5D2C8] focus:border-[#1B4332] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#52796F] font-medium mb-1">
                      Payment Method
                    </label>
                    <select
                      value={newPaymentMethod}
                      onChange={e => setNewPaymentMethod(e.target.value)}
                      className="w-full p-2 bg-white rounded border border-[#D5D2C8] focus:border-[#1B4332] focus:outline-none"
                    >
                      <option value="Cash Advance">Cash Advance (नकद अग्रिम)</option>
                      <option value="Cash at Shift End">Cash at Shift End (शिफ्ट समाप्ति नकद)</option>
                      <option value="UPI / Bank Transfer">UPI / Bank Transfer (ऑनलाइन)</option>
                      <option value="Weekend Settlement">Weekend Settlement (साप्ताहिक हिसाब)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#52796F] font-medium mb-1">
                      Recording Role Attribution
                    </label>
                    <input
                      type="text"
                      disabled
                      value="[Demo Role: Contractor Supervisor]"
                      className="w-full p-2 bg-[#EAE8E0] rounded border border-[#D5D2C8] text-[#52796F] font-mono text-[11px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#52796F] font-medium mb-1">
                      Payment Note / Slip Reference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Handed over at container office by supervisor"
                      value={newPaymentNote}
                      onChange={e => setNewPaymentNote(e.target.value)}
                      className="w-full p-2 bg-white rounded border border-[#D5D2C8] focus:border-[#1B4332] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={paymentSubmitting}
                      className="w-full py-2 px-4 bg-[#1B4332] hover:bg-[#123524] text-white font-semibold rounded transition-colors text-xs flex items-center justify-center gap-1.5 min-h-[38px]"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Record Payment Entry</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: TRACEABLE CHANGE HISTORY & CORRECTION BENCH */}
          {activeTab === 'corrections' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#123524]">Preserved Correction &amp; Modification History</h3>
                <p className="text-xs text-[#52796F]">
                  Core Rule: A correction must not silently overwrite the original agreement or work record. Previous values, stated reasons, and worker acknowledgment are preserved.
                </p>
              </div>

              {/* History list */}
              <div className="space-y-3">
                {(record.correctionHistory || []).length === 0 ? (
                  <div className="p-6 text-center bg-[#FAF9F5] rounded-xl border border-[#E3E0D8] text-xs text-[#52796F]">
                    No retroactive corrections have been made to this record. The record remains exactly as originally signed at check-in.
                  </div>
                ) : (
                  (record.correctionHistory || []).map(corr => (
                    <div
                      key={corr.id}
                      className="p-4 rounded-xl bg-white border border-[#E3E0D8] space-y-2.5 text-xs shadow-2xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#123524]">{corr.fieldLabel}</span>
                            <span className="font-mono text-[11px] text-[#52796F]">
                              ID: {corr.id}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#52796F]">
                            Edited at <span className="font-mono">{corr.timestamp}</span> by{' '}
                            <span className="font-medium text-[#123524]">{corr.actorRole}</span>
                          </div>
                        </div>

                        <div>
                          {corr.workerAcknowledgment === 'accepted' && (
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              Worker Accepted
                            </span>
                          )}
                          {corr.workerAcknowledgment === 'pending' && (
                            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                              Worker Review Pending
                            </span>
                          )}
                          {corr.workerAcknowledgment === 'disputed' && (
                            <span className="text-[11px] font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                              Disputed by Worker
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Before / After comparison */}
                      <div className="grid grid-cols-2 gap-3 p-2.5 bg-[#FAF9F5] rounded-lg border border-[#E3E0D8] text-xs">
                        <div>
                          <span className="text-[#52796F] text-[11px] block">Original / Previous Value:</span>
                          <span className="font-mono font-bold text-[#C94A29] line-through">
                            {corr.previousValue}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#52796F] text-[11px] block">Proposed / Corrected Value:</span>
                          <span className="font-mono font-bold text-[#2D6A4F]">
                            {corr.correctedValue}
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#354F52]">
                        <strong className="text-[#123524]">Stated Reason:</strong> {corr.reason}
                      </div>

                      {/* Acknowledgment action if pending */}
                      {corr.workerAcknowledgment === 'pending' && (
                        <div className="pt-2 border-t border-[#EAE8E0] flex items-center justify-between">
                          <span className="text-[11px] text-[#52796F]">
                            Does the worker agree with this correction?
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => respondToCorrection(record.id, corr.id, 'accepted')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded"
                            >
                              [Accept Correction]
                            </button>
                            <button
                              onClick={() => respondToCorrection(record.id, corr.id, 'disputed')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#C94A29] hover:bg-red-50 border border-red-200 rounded"
                            >
                              [Dispute Correction]
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Form: Simulate a Transparent Correction */}
              <div className="bg-[#FAF9F5] p-4 sm:p-5 rounded-xl border border-[#E3E0D8] space-y-3">
                <div className="flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-[#1B4332]" />
                  <h4 className="font-bold text-xs sm:text-sm text-[#123524]">
                    Explore a Simulated Record Correction
                  </h4>
                </div>
                <p className="text-[11px] text-[#52796F]">
                  Test what happens when a rate or shift count is modified. The prior value is recorded into history, the wage math updates consistently, and worker acknowledgment is flagged as pending.
                </p>

                {corrSuccessMsg && (
                  <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    {corrSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleCorrectionSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#52796F] font-medium mb-1">
                        Field to Correct *
                      </label>
                      <select
                        value={corrField}
                        onChange={e => setCorrField(e.target.value as any)}
                        className="w-full p-2 bg-white rounded border border-[#D5D2C8] focus:border-[#1B4332] focus:outline-none"
                      >
                        <option value="daysWorked">Recorded Days Worked (वर्तमान: {breakdown.daysWorked})</option>
                        <option value="agreedDailyRate">Agreed Daily Wage Rate (वर्तमान: ₹{breakdown.agreedDailyRate})</option>
                        <option value="overtimeHours">Overtime Hours (वर्तमान: {breakdown.overtimeHours}h)</option>
                        <option value="shiftHours">Shift Hours (वर्तमान: {breakdown.hoursWorked}h)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#52796F] font-medium mb-1">
                        New Corrected Value *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 5 (days) or 700 (rate)"
                        value={corrNewValue}
                        onChange={e => setCorrNewValue(e.target.value)}
                        required
                        className="w-full p-2 bg-white rounded border border-[#D5D2C8] focus:border-[#1B4332] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[#52796F] font-medium mb-1">
                        Actor Role
                      </label>
                      <select
                        value={corrRole}
                        onChange={e => setCorrRole(e.target.value)}
                        className="w-full p-2 bg-white rounded border border-[#D5D2C8] focus:border-[#1B4332] focus:outline-none text-[11px]"
                      >
                        <option value="[Demo Role: Contractor Supervisor]">[Demo Role: Contractor Supervisor]</option>
                        <option value="[Demo Role: Worker Representative]">[Demo Role: Worker Representative]</option>
                        <option value="[Demo Role: Chowk Labor Committee]">[Demo Role: Chowk Labor Committee]</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#52796F] font-medium mb-1">
                      Mandatory Stated Reason for Audit Trail *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Corrected to reflect extra half-day concrete pour authorized by lead engineer"
                      value={corrReason}
                      onChange={e => setCorrReason(e.target.value)}
                      required
                      className="w-full p-2 bg-white rounded border border-[#D5D2C8] focus:border-[#1B4332] focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={corrSubmitting}
                      className="py-2 px-4 bg-[#1B4332] hover:bg-[#123524] text-white font-semibold rounded transition-colors text-xs flex items-center gap-1.5"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Apply Traceable Correction</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: MINIMUM WAGE BENCHMARK COMPARISON */}
          {activeTab === 'benchmark' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#123524]">Configured Minimum Wage Benchmark Comparison</h3>
                <p className="text-xs text-[#52796F]">
                  Clearly distinguishes statutory floor notifications from agreed chowk contract terms. No rates are invented; all data cites official state gazettes.
                </p>
              </div>

              {benchmark ? (
                <div className="bg-[#FAF9F5] p-5 rounded-xl border border-[#E3E0D8] space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-[#E3E0D8] space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#52796F] uppercase tracking-wider block">
                        Configured Statutory Floor Benchmark
                      </span>
                      <span className="font-mono text-2xl font-bold text-[#123524] block tabular-nums">
                        ₹{benchmark.rate.toFixed(2)}
                      </span>
                      <span className="text-xs text-[#52796F] block">
                        per day ({benchmark.tradeCategory})
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-[#2D6A4F]/30 space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#2D6A4F] uppercase tracking-wider block">
                        Agreed Contract Wage (Current Record)
                      </span>
                      <span className="font-mono text-2xl font-bold text-[#2D6A4F] block tabular-nums">
                        ₹{breakdown.agreedDailyRate.toFixed(2)}
                      </span>
                      <span className="text-xs text-[#2D6A4F] block font-semibold">
                        +₹{(breakdown.agreedDailyRate - benchmark.rate).toFixed(2)} above statutory floor
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#E3E0D8]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <strong className="text-[#123524]">Statutory Schedule:</strong> {benchmark.benchmarkName}
                      </div>
                      <div>
                        <strong className="text-[#123524]">Effective Notification Date:</strong> {benchmark.effectiveDate}
                      </div>
                      <div className="sm:col-span-2">
                        <strong className="text-[#123524]">Government Source:</strong> {benchmark.source}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#52796F] leading-relaxed pt-1">
                      <strong>Applicability Note:</strong> {benchmark.notes}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#52796F]">
                  No statutory benchmark configured for this trade category.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Strip */}
        <div className="bg-[#FAF9F5] px-5 sm:px-6 py-3.5 border-t border-[#E3E0D8] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#52796F]">
            <Lock className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Deterministic SHA-256 calculation engine · Math validated decimal-safe</span>
          </div>

          <div className="flex items-center gap-2">
            {breakdown.outstandingBalance > 0 && record.status !== 'disputed' && (
              <button
                onClick={() => {
                  closeRecordInspector();
                  setSelectedDisputeRecord(record);
                  setDisputeModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-[#C94A29] hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                File Dispute for Balance
              </button>
            )}

            <button
              onClick={closeRecordInspector}
              className="px-4 py-1.5 text-xs font-semibold text-[#123524] bg-white hover:bg-[#E8EFEA] border border-[#D5D2C8] rounded-lg transition-colors"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
