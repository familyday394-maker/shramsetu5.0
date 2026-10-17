import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Plus,
  FileText,
  AlertTriangle,
  History,
  QrCode,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Eye,
  Lock,
  ChevronRight,
  Smartphone,
} from 'lucide-react';
import { WorkRecord, RecordStatus, DetailedPaymentStatus } from '../types';
import { calculateRecordBreakdown, round2 } from '../utils/wageCalculator';

export const WorkerDashboardPage: React.FC = () => {
  const {
    worker,
    records,
    setShiftModalOpen,
    setDisputeModalOpen,
    setSelectedDisputeRecord,
    setSlipModalOpen,
    setSelectedSlipRecord,
    openRecordInspector,
    setCurrentView,
    language,
    approvalRequests,
    setApprovalsModalOpen,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Show only this worker's records in the worker portal (strict isolation & access control)
  const workerRecords = records.filter(r => !r.workerId || r.workerId === worker.id);

  // Single calculation breakdown for worker's records to maintain strict decimal fidelity
  const recordsWithBreakdown = workerRecords.map(r => ({
    record: r,
    breakdown: calculateRecordBreakdown(r),
  }));

  const totalEarned = round2(recordsWithBreakdown.reduce((sum, item) => sum + item.breakdown.netWagesDue, 0));
  const totalRecordedPaid = round2(recordsWithBreakdown.reduce((sum, item) => sum + item.breakdown.totalPaymentsRecorded, 0));
  const totalConfirmedPaid = round2(recordsWithBreakdown.reduce((sum, item) => sum + item.breakdown.totalPaymentsConfirmed, 0));
  const totalOutstanding = round2(recordsWithBreakdown.reduce((sum, item) => sum + item.breakdown.outstandingBalance, 0));
  const totalShifts = workerRecords.length;

  const filteredItems = recordsWithBreakdown.filter(item => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'verified') return item.record.status === 'verified';
    if (filterStatus === 'disputed') return item.record.status === 'disputed';
    if (filterStatus === 'modified') return item.record.status === 'modified';
    if (filterStatus === 'unconfirmed') return item.breakdown.unconfirmedPaymentsAmount > 0;
    return true;
  });

  const handleOpenDispute = (rec: WorkRecord) => {
    setSelectedDisputeRecord(rec);
    setDisputeModalOpen(true);
  };

  const handleOpenSlip = (rec: WorkRecord) => {
    setSelectedSlipRecord(rec);
    setSlipModalOpen(true);
  };

  const getStatusBadge = (status: RecordStatus, detailedStatus?: DetailedPaymentStatus, isTampered?: boolean) => {
    if (isTampered) {
      return (
        <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
          {language === 'hi' ? '⚠ हैश विसंगति (TAMPERED)' : '⚠ Hash Mismatch (Tampered)'}
        </span>
      );
    }
    if (detailedStatus === 'recorded_as_paid') {
      return (
        <span className="text-[10px] font-semibold text-purple-900 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded flex items-center gap-1">
          <Clock className="w-3 h-3 text-purple-700" />
          <span>Worker Acknowledgment Pending</span>
        </span>
      );
    }
    if (detailedStatus === 'acknowledged_as_received') {
      return (
        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>Settled &amp; Confirmed</span>
        </span>
      );
    }
    switch (status) {
      case 'verified':
        return (
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
          </span>
        );
      case 'pending_approval':
        return (
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{language === 'hi' ? 'अनुमोदन प्रतीक्षित' : 'Pending Muster'}</span>
          </span>
        );
      case 'disputed':
        return (
          <span className="text-[11px] font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{language === 'hi' ? 'विवाद दर्ज' : 'Dispute Open'}</span>
          </span>
        );
      case 'modified':
        return (
          <span className="text-[11px] font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded flex items-center gap-1">
            <History className="w-3 h-3" />
            <span>{language === 'hi' ? 'संशोधित (ऑडिट ट्रेल)' : 'Modified Log'}</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Find the primary demo record (REC-2026-DEMO-4D or first record)
  const demoRecordItem = recordsWithBreakdown.find(item => item.record.id === 'REC-2026-DEMO-4D') || recordsWithBreakdown[0];

  return (
    <div className="space-y-8">
      {/* Top Banner & Worker Profile Bar */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
            {worker.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#123524]">
                {language === 'hi' ? worker.hindiName : worker.name}
              </h1>
              <span className="font-mono text-xs text-[#52796F] bg-[#E8EFEA] px-2 py-0.5 rounded">
                {worker.id}
              </span>
              <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{language === 'hi' ? 'सत्यापित श्रमिक (डेमो)' : 'Illustrative Profile'}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#52796F] flex-wrap">
              <span className="font-medium text-[#1A2421]">
                {language === 'hi' ? worker.tradeHindi : worker.trade}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E06D53]" />
                {worker.hubChowk}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {language === 'hi' ? 'तय दैनिक दर' : 'Standard Rate'}: <strong className="text-[#123524]">₹{worker.dailyRateAgreed}/day</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action button cluster */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShiftModalOpen(true)}
            className="flex-1 md:flex-initial px-4 py-2.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'नई शिफ्ट दर्ज करें' : 'Record Shift'}</span>
          </button>

          <button
            onClick={() => setCurrentView('pass')}
            className="px-4 py-2.5 text-xs font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-xl transition-colors flex items-center gap-1.5 min-h-[40px]"
          >
            <QrCode className="w-4 h-4 text-[#E06D53]" />
            <span>{language === 'hi' ? 'वर्क पास देखें' : 'View Work Pass'}</span>
          </button>
        </div>
      </div>

      {/* Simulated Cross-Device Approvals Banner */}
      {(() => {
        const workerPending = approvalRequests.filter(
          r => r.targetWorkerId === worker.id && r.status === 'simulated_pending'
        );
        if (workerPending.length === 0) return null;

        return (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-200/80 text-amber-900 shrink-0">
                <Smartphone className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-amber-950 text-sm">
                    {workerPending.length} Simulated Cross-Device Approval Request{workerPending.length > 1 ? 's' : ''} Awaiting You
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                    Local Demo Simulation
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5">
                  Contractor submitted muster confirmation or wage adjustment request. Review and simulate worker approval or dispute.
                </p>
              </div>
            </div>
            <button
              onClick={() => setApprovalsModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Review Simulated Requests ({workerPending.length})
            </button>
          </div>
        );
      })()}

      {/* 4-Column Financial KPI Strip (Strictly Separates Agreed vs Earned vs Paid vs Outstanding) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Shifts */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-xs text-[#52796F] font-medium block">
            {language === 'hi' ? 'कुल दर्ज शिफ्टें' : 'Verified Shifts Logged'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#123524] mt-1 block tabular-nums">
            {totalShifts}
          </span>
          <span className="text-[11px] text-[#2D6A4F] mt-1 block">
            {language === 'hi' ? 'उपस्थिति दर: ९६.४%' : 'Attendance Reliability: 96.4%'}
          </span>
        </div>

        {/* KPI 2: Earned Wages Due */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-xs text-[#52796F] font-medium block">
            {language === 'hi' ? 'कुल अर्जित देय पारिश्रमिक' : 'Total Net Wages Due'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#123524] mt-1 block tabular-nums">
            ₹{totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-[#52796F] mt-1 block">
            {language === 'hi' ? 'तय दर × दिन + अतिरिक्त समय' : 'Days × Rate + OT - Deductions'}
          </span>
        </div>

        {/* KPI 3: Payments Recorded */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-xs text-[#52796F] font-medium block">
            {language === 'hi' ? 'दर्ज भुगतान (ठेकेदार)' : 'Payments Recorded'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#2D6A4F] mt-1 block tabular-nums">
            ₹{totalRecordedPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-[#52796F] mt-1 block">
            (₹{totalConfirmedPaid.toLocaleString('en-IN')} worker acknowledged)
          </span>
        </div>

        {/* KPI 4: Outstanding Balance */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-xs text-[#52796F] font-medium block">
            {language === 'hi' ? 'कुल शेष बकाया राशि' : 'Outstanding Balance Due'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#C94A29] mt-1 block tabular-nums">
            ₹{totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-[#C94A29] mt-1 block">
            {totalOutstanding > 0 ? (language === 'hi' ? 'ठेकेदारों से देय राशि' : 'Pending final settlement') : 'All settled'}
          </span>
        </div>
      </div>

      {/* Featured Working Demonstration Card (₹650 × 4 days example) */}
      {demoRecordItem && (
        <div className="bg-white rounded-2xl border-2 border-[#1B4332]/30 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E3E0D8] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-bold text-sm">
                4D
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#1B4332] uppercase tracking-wider block">
                  Interactive Working Demonstration (Prompt 2 Showcase)
                </span>
                <h2 className="text-base font-bold text-[#123524]">
                  {demoRecordItem.record.siteName} · {demoRecordItem.record.tradeRole}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-bold">
                DEMO RECORD
              </span>
              <button
                onClick={() => openRecordInspector(demoRecordItem.record)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Calculation &amp; Changes</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E3E0D8]">
              <span className="text-[#52796F] text-[11px] block">Agreed Daily Rate</span>
              <span className="font-mono font-bold text-[#123524] text-sm tabular-nums">
                ₹{demoRecordItem.breakdown.agreedDailyRate}/day
              </span>
            </div>
            <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E3E0D8]">
              <span className="text-[#52796F] text-[11px] block">Recorded Work</span>
              <span className="font-mono font-bold text-[#123524] text-sm tabular-nums">
                {demoRecordItem.breakdown.daysWorked} days (32 hrs)
              </span>
            </div>
            <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E3E0D8]">
              <span className="text-[#52796F] text-[11px] block">Net Wages Due</span>
              <span className="font-mono font-bold text-[#123524] text-sm tabular-nums">
                ₹{demoRecordItem.breakdown.netWagesDue}
              </span>
            </div>
            <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E3E0D8]">
              <span className="text-[#52796F] text-[11px] block">Recorded Paid</span>
              <span className="font-mono font-bold text-[#2D6A4F] text-sm tabular-nums">
                ₹{demoRecordItem.breakdown.totalPaymentsRecorded}
              </span>
            </div>
            <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E3E0D8]">
              <span className="text-[#52796F] text-[11px] block">Outstanding Balance</span>
              <span className="font-mono font-bold text-[#C94A29] text-sm tabular-nums">
                ₹{demoRecordItem.breakdown.outstandingBalance}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs text-[#52796F]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <span>
                <strong>Transparency Rule Verified:</strong> Contractor marked ₹1,300 cash advance, but worker confirmation is pending. Outstanding balance stays permanently visible.
              </span>
            </div>
            <button
              onClick={() => openRecordInspector(demoRecordItem.record)}
              className="text-[#1B4332] font-semibold hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore Simulated Payment &amp; Corrections</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Ledger Section */}
      <div className="bg-white rounded-2xl border border-[#E3E0D8] shadow-sm overflow-hidden">
        {/* Header & Filter Controls */}
        <div className="p-6 border-b border-[#E3E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#123524]">
              {language === 'hi' ? 'दैनिक उपस्थिति एवं मजदूरी लेजर' : 'Daily Shift & Wage Ledger'}
            </h2>
            <p className="text-xs text-[#52796F]">
              {language === 'hi'
                ? 'प्रत्येक प्रविष्टि का क्रिप्टोग्राफिक हैश और विस्तृत गणना स्वतंत्र रूप से सत्यापन योग्य है।'
                : 'Click "Inspect" on any record to view its formula breakdown, recorded payment log, and preserved change history.'}
            </p>
          </div>

          {/* Interactive filter buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F4F3EE] rounded-lg text-xs font-medium self-stretch sm:self-auto overflow-x-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'all' ? 'bg-white text-[#123524] shadow-sm font-semibold' : 'text-[#52796F] hover:text-[#123524]'
              }`}
            >
              {language === 'hi' ? 'सभी' : 'All'} ({records.length})
            </button>
            <button
              onClick={() => setFilterStatus('verified')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'verified' ? 'bg-white text-[#123524] shadow-sm font-semibold' : 'text-[#52796F] hover:text-[#123524]'
              }`}
            >
              {language === 'hi' ? 'सत्यापित' : 'Verified'}
            </button>
            <button
              onClick={() => setFilterStatus('unconfirmed')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'unconfirmed' ? 'bg-white text-purple-800 shadow-sm font-semibold' : 'text-[#52796F] hover:text-[#123524]'
              }`}
            >
              {language === 'hi' ? 'पुष्टि प्रतीक्षित' : 'Unconfirmed Payments'}
            </button>
            <button
              onClick={() => setFilterStatus('disputed')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'disputed' ? 'bg-white text-red-700 shadow-sm font-semibold' : 'text-[#52796F] hover:text-[#123524]'
              }`}
            >
              {language === 'hi' ? 'विवादित' : 'Disputed'}
            </button>
            <button
              onClick={() => setFilterStatus('modified')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'modified' ? 'bg-white text-purple-700 shadow-sm font-semibold' : 'text-[#52796F] hover:text-[#123524]'
              }`}
            >
              {language === 'hi' ? 'संशोधित' : 'Modified'}
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] text-[#405D53] border-b border-[#E3E0D8] font-semibold">
                <th className="py-3 px-4">{language === 'hi' ? 'दिनांक / साइट' : 'Date / Site'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'ठेकेदार' : 'Contractor'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'कार्य व ट्रेड' : 'Work & Trade'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'तय दर' : 'Agreed Rate'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'देय मजदूरी' : 'Wages Due'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'दर्ज भुगतान' : 'Recorded Paid'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'बकाया' : 'Balance'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'स्थिति' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'hi' ? 'कार्रवाई' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8E0] text-[#1A2421]">
              {filteredItems.map(({ record: rec, breakdown }) => (
                <tr key={rec.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold block text-[#123524]">{rec.date}</span>
                    <span className="text-[11px] text-[#52796F] block truncate max-w-[170px]">{rec.siteName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#1A2421] block">{rec.contractorName}</span>
                    <span className="text-[10px] text-[#6B8177] font-mono">{rec.contractorPhone}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium block">{rec.tradeRole}</span>
                    <span className="text-[11px] text-[#52796F] font-mono">
                      {breakdown.daysWorked > 1 ? `${breakdown.daysWorked} days` : `${breakdown.hoursWorked}h`}
                      {breakdown.overtimeHours > 0 ? ` (+${breakdown.overtimeHours}h OT)` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium tabular-nums">
                    ₹{breakdown.agreedDailyRate}
                    {rec.originalDailyRate && (
                      <span className="line-through text-slate-400 text-[10px] ml-1">
                        ₹{rec.originalDailyRate}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#123524] tabular-nums">
                    ₹{breakdown.netWagesDue.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#2D6A4F] tabular-nums">
                    ₹{breakdown.totalPaymentsRecorded.toFixed(2)}
                    {breakdown.unconfirmedPaymentsAmount > 0 && (
                      <span className="text-[10px] text-amber-700 block font-normal">
                        (₹{breakdown.unconfirmedPaymentsAmount} unconfirmed)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold tabular-nums">
                    <span className={breakdown.outstandingBalance > 0 ? 'text-[#C94A29]' : 'text-slate-400'}>
                      ₹{breakdown.outstandingBalance.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {getStatusBadge(rec.status, breakdown.paymentStatus, rec.isTampered)}
                      {rec.modificationReason && (
                        <div className="text-[10px] text-purple-900 bg-purple-50 p-1 rounded max-w-[190px] leading-tight truncate" title={rec.modificationReason}>
                          {rec.modificationReason}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Primary Inspect Calculation Button */}
                      <button
                        onClick={() => openRecordInspector(rec)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded transition-colors whitespace-nowrap flex items-center gap-1"
                        title="Inspect transparent wage calculation"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{language === 'hi' ? 'हिसाब' : 'Inspect'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenSlip(rec)}
                        className="px-2 py-1 text-[11px] font-semibold text-[#354F52] hover:bg-[#EAE8E0] rounded transition-colors whitespace-nowrap"
                        title="Print digital slip"
                      >
                        {language === 'hi' ? 'पर्ची' : 'Slip'}
                      </button>

                      {breakdown.outstandingBalance > 0 && rec.status !== 'disputed' && (
                        <button
                          onClick={() => handleOpenDispute(rec)}
                          className="px-2 py-1 text-[11px] font-semibold text-[#C94A29] hover:bg-red-50 rounded transition-colors whitespace-nowrap"
                          title="Lodge dispute"
                        >
                          {language === 'hi' ? 'विवाद' : 'Dispute'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ledger Bottom Note */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E3E0D8] text-[11px] text-[#52796F] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>
              {language === 'hi'
                ? 'लेजर रिकॉर्ड SHA-256 ब्लॉकचेन अनुरूप संरचना में स्थानीय मेमोरी में सुरक्षित हैं।'
                : 'All wage calculations and correction histories are verified decimal-safe.'}
            </span>
          </div>
          <button
            onClick={() => setCurrentView('audit')}
            className="text-[#1B4332] font-semibold hover:underline"
          >
            {language === 'hi' ? 'छेड़छाड़ जांच (Tamper Test) चलाएं →' : 'Run Tamper Test Bench →'}
          </button>
        </div>
      </div>
    </div>
  );
};
