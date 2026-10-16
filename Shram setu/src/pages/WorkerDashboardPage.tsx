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
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { WorkRecord, RecordStatus } from '../types';

export const WorkerDashboardPage: React.FC = () => {
  const {
    worker,
    records,
    setShiftModalOpen,
    setDisputeModalOpen,
    setSelectedDisputeRecord,
    setSlipModalOpen,
    setSelectedSlipRecord,
    setCurrentView,
    language,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Calculations
  const totalEarned = records.reduce((sum, r) => sum + r.earnedWage, 0);
  const totalPaid = records.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalOutstanding = records.reduce((sum, r) => sum + r.balanceDue, 0);
  const totalShifts = records.length;

  const filteredRecords = records.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleOpenDispute = (rec: WorkRecord) => {
    setSelectedDisputeRecord(rec);
    setDisputeModalOpen(true);
  };

  const handleOpenSlip = (rec: WorkRecord) => {
    setSelectedSlipRecord(rec);
    setSlipModalOpen(true);
  };

  const getStatusBadge = (status: RecordStatus, isTampered?: boolean) => {
    if (isTampered) {
      return (
        <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
          {language === 'hi' ? '⚠ हैश विसंगति (TAMPERED)' : '⚠ Hash Mismatch (Tampered)'}
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
                <span>{language === 'hi' ? 'सत्यापित श्रमिक' : 'Verified Worker'}</span>
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
              <span>{language === 'hi' ? 'तय दैनिक दर' : 'Standard Rate'}: <strong className="text-[#123524]">₹{worker.dailyRateAgreed}/day</strong></span>
            </div>
          </div>
        </div>

        {/* Action button cluster */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShiftModalOpen(true)}
            className="flex-1 md:flex-initial px-4 py-2.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'नई शिफ्ट दर्ज करें' : 'Record Shift'}</span>
          </button>

          <button
            onClick={() => setCurrentView('pass')}
            className="px-4 py-2.5 text-xs font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-xl transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-[#E06D53]" />
            <span>{language === 'hi' ? 'वर्क पास देखें' : 'View Work Pass'}</span>
          </button>
        </div>
      </div>

      {/* 4-Column Financial KPI Strip (Strictly Separates Agreed vs Earned vs Paid vs Outstanding) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Shifts */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-xs text-[#52796F] font-medium block">
            {language === 'hi' ? 'कुल दर्ज शिफ्टें' : 'Verified Shifts Logged'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#123524] mt-1 block">
            {totalShifts}
          </span>
          <span className="text-[11px] text-[#2D6A4F] mt-1 block">
            {language === 'hi' ? 'उपस्थिति दर: ९६.४%' : 'Attendance: 96.4%'}
          </span>
        </div>

        {/* KPI 2: Earned Wages */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-xs text-[#52796F] font-medium block">
            {language === 'hi' ? 'कुल अर्जित पारिश्रमिक' : 'Total Wages Earned'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#123524] mt-1 block">
            ₹{totalEarned.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#52796F] mt-1 block">
            {language === 'hi' ? 'तय दर + ओवर-टाइम' : 'Daily rate + OT calculation'}
          </span>
        </div>

        {/* KPI 3: Paid Wages */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-xs text-[#52796F] font-medium block">
            {language === 'hi' ? 'प्राप्त नकद / बैंक' : 'Actual Payments Received'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#2D6A4F] mt-1 block">
            ₹{totalPaid.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#2D6A4F] mt-1 block">
            {language === 'hi' ? 'हस्ताक्षरित भुगतान' : 'Settled with supervisor'}
          </span>
        </div>

        {/* KPI 4: Outstanding Balance */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-xs text-[#52796F] font-medium block">
            {language === 'hi' ? 'शेष बकाया राशि' : 'Outstanding Balance Due'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#E06D53] mt-1 block">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#C94A29] mt-1 block">
            {totalOutstanding > 0 ? (language === 'hi' ? 'ठेकेदारों से देय राशि' : 'Pending disbursement') : 'All settled'}
          </span>
        </div>
      </div>

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
                ? 'प्रत्येक प्रविष्टि का क्रिप्टोग्राफिक हैश पिछले दिन के रिकॉर्ड से जुड़ा है।'
                : 'Each recorded shift is cryptographically chained to prevent retroactive silent alteration.'}
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
                <th className="py-3 px-4">{language === 'hi' ? 'घंटे व ट्रेड' : 'Hours & Trade'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'तय दर' : 'Agreed Rate'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'अर्जित' : 'Earned'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'प्राप्त' : 'Paid'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'बकाया' : 'Balance'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'सत्यापन स्थिति' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'hi' ? 'कार्रवाई' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8E0] text-[#1A2421]">
              {filteredRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold block text-[#123524]">{rec.date}</span>
                    <span className="text-[11px] text-[#52796F] block truncate max-w-[180px]">{rec.siteName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#1A2421] block">{rec.contractorName}</span>
                    <span className="text-[10px] text-[#6B8177] font-mono">{rec.contractorPhone}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium block">{rec.tradeRole}</span>
                    <span className="text-[11px] text-[#52796F] font-mono">
                      {rec.shiftHours}h {rec.overtimeHours > 0 ? `(+${rec.overtimeHours}h OT)` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    ₹{rec.agreedDailyRate}
                    {rec.originalDailyRate && (
                      <span className="line-through text-slate-400 text-[10px] ml-1">
                        ₹{rec.originalDailyRate}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#123524]">
                    ₹{rec.earnedWage}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#2D6A4F]">
                    ₹{rec.paidAmount}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <span className={rec.balanceDue > 0 ? 'text-[#E06D53]' : 'text-slate-400'}>
                      ₹{rec.balanceDue}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {getStatusBadge(rec.status, rec.isTampered)}
                      {rec.modificationReason && (
                        <div className="text-[10px] text-purple-900 bg-purple-50 p-1 rounded max-w-[200px] leading-tight">
                          {rec.modificationReason}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenSlip(rec)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded transition-colors whitespace-nowrap"
                        title="Print digital slip"
                      >
                        {language === 'hi' ? 'पर्ची' : 'Slip'}
                      </button>
                      {rec.balanceDue > 0 && rec.status !== 'disputed' && (
                        <button
                          onClick={() => handleOpenDispute(rec)}
                          className="px-2 py-1 text-[11px] font-semibold text-[#E06D53] hover:bg-red-50 rounded transition-colors whitespace-nowrap"
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>
              {language === 'hi'
                ? 'लेजर रिकॉर्ड SHA-256 ब्लॉकचेन अनुरूप संरचना में स्थानीय मेमोरी में सुरक्षित हैं।'
                : 'All shift logs are hashed with local chronological integrity safeguards.'}
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
