import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  ShieldAlert,
  ArrowRight,
  Plus,
  Scale,
  Users,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { DisputeRecord } from '../types';

export const WageDisputesPage: React.FC = () => {
  const {
    disputes,
    updateDisputeStatus,
    setDisputeModalOpen,
    language,
    setCurrentView,
  } = useApp();

  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(
    disputes.length > 0 ? disputes[0].id : ''
  );
  const [mediationNote, setMediationNote] = useState<string>('');

  const activeDispute = disputes.find(d => d.id === selectedDisputeId) || disputes[0];

  const handleUpdateStatus = (newStatus: 'open' | 'in_mediation' | 'resolved') => {
    if (!activeDispute) return;
    const note = mediationNote.trim() || (
      newStatus === 'in_mediation'
        ? 'Contractor agreed to review attendance logs at chowk committee meeting.'
        : 'Full discrepancy settled in cash. Mutual receipt signed.'
    );
    updateDisputeStatus(activeDispute.id, newStatus, note);
    setMediationNote('');
  };

  const getStatusBadge = (status: DisputeRecord['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="text-xs font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded-md flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'विवाद खुला' : 'Open Dispute'}</span>
          </span>
        );
      case 'in_mediation':
        return (
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'मध्यस्थता प्रक्रियाधीन' : 'In Mediation'}</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सुलझाया गया (Resolved)' : 'Resolved & Settled'}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-[#E06D53] uppercase tracking-wider">
            {language === 'hi' ? 'निष्पक्ष मध्यस्थता एवं साक्ष्य संकलन' : 'Evidence-Backed Dispute Resolution'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi' ? 'मजदूरी विवाद निवारण डेस्क' : 'Wage Dispute Support Desk'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F] mt-1">
            {language === 'hi'
              ? 'कटौती, बिना भुगतान अथवा ओवर-टाइम विवादों में डिजिटल साक्ष्य व समय-सारणी संकलन।'
              : 'Empowering workers with tamper-evident attendance records, rate confirmations, and peer witnesses.'}
          </p>
        </div>

        <button
          onClick={() => setDisputeModalOpen(true)}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-[#E06D53] hover:bg-[#C95B42] rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'hi' ? 'नया विवाद दर्ज करें' : 'Lodge New Dispute'}</span>
        </button>
      </div>

      {/* Main Dispute Interface (2 Columns: List on left, details & timeline on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dispute Dossiers List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold text-[#52796F] uppercase tracking-wider">
            {language === 'hi' ? 'दर्ज विवाद मामले' : 'Active Discrepancy Claims'} ({disputes.length})
          </h2>

          <div className="space-y-3">
            {disputes.map(d => (
              <div
                key={d.id}
                onClick={() => setSelectedDisputeId(d.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeDispute && activeDispute.id === d.id
                    ? 'bg-white border-[#1B4332] shadow-md ring-1 ring-[#1B4332]'
                    : 'bg-[#FAF9F5] border-[#E3E0D8] hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-semibold text-[#1B4332]">
                    {d.id}
                  </span>
                  {getStatusBadge(d.status)}
                </div>

                <h3 className="font-bold text-sm text-[#123524] line-clamp-1">
                  {d.siteName}
                </h3>

                <div className="mt-2 text-xs text-[#52796F] space-y-0.5">
                  <div className="flex justify-between">
                    <span>Contractor:</span>
                    <span className="font-medium text-[#1A2421] truncate max-w-[160px]">{d.contractorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discrepancy:</span>
                    <span className="font-mono font-bold text-[#E06D53]">₹{d.discrepancyAmount}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#8EA89D]">
                    <span>Lodged:</span>
                    <span>{d.dateLodged}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legal / Mediation disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-[#805B10] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Scale className="w-4 h-4 text-[#805B10]" />
              <span>Important Transparency Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Shram Setu 2.0 organizes timestamped evidence for chowk pradhans, labor unions, and mutual contractor meetings. It does not promise guaranteed debt recovery or act as a legal court.
            </p>
          </div>
        </div>

        {/* Right Column: Dispute Details & Timeline */}
        <div className="lg:col-span-7">
          {activeDispute ? (
            <div className="bg-white rounded-2xl border border-[#E3E0D8] shadow-sm p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE8E0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#52796F]">
                      CASE #{activeDispute.id}
                    </span>
                    {getStatusBadge(activeDispute.status)}
                  </div>
                  <h2 className="text-lg font-bold text-[#123524] mt-1">
                    {activeDispute.siteName}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#52796F] uppercase block font-semibold">DISPUTED GAP</span>
                  <span className="font-mono text-2xl font-bold text-[#E06D53]">
                    ₹{activeDispute.discrepancyAmount}
                  </span>
                </div>
              </div>

              {/* Financial comparison cards */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#FAF9F5] rounded-xl border border-[#EAE8E0] text-center text-xs">
                <div>
                  <span className="text-[11px] text-[#52796F] block">Claimed Wage</span>
                  <span className="font-mono text-base font-bold text-[#123524]">₹{activeDispute.claimedAmount}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#52796F] block">Actual Paid</span>
                  <span className="font-mono text-base font-bold text-[#2D6A4F]">₹{activeDispute.paidAmount}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#E06D53] block">Withheld Balance</span>
                  <span className="font-mono text-base font-bold text-[#E06D53]">₹{activeDispute.discrepancyAmount}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#123524] uppercase tracking-wider">
                  {language === 'hi' ? 'श्रमिक का कथन' : 'Worker Statement'}
                </h4>
                <p className="text-xs text-[#354F52] bg-[#FAF9F5] p-3 rounded-xl border border-[#EAE8E0] leading-relaxed">
                  "{activeDispute.description}"
                </p>
              </div>

              {/* Supporting Evidence List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#123524] uppercase tracking-wider">
                  {language === 'hi' ? 'संलग्न डिजिटल साक्ष्य' : 'Verified Supporting Evidence'}
                </h4>
                <div className="space-y-1.5">
                  {activeDispute.supportingEvidence.map((ev, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-[#1B4332]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3 pt-2 border-t border-[#EAE8E0]">
                <h4 className="text-xs font-bold text-[#123524] uppercase tracking-wider">
                  {language === 'hi' ? 'मध्यस्थता समय-सारणी' : 'Mediation Audit Timeline'}
                </h4>
                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E3E0D8]">
                  {activeDispute.timeline.map((item, idx) => (
                    <div key={idx} className="pl-6 relative text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1B4332] absolute left-[3px] top-1"></div>
                      <div className="flex items-center justify-between text-[11px] text-[#52796F]">
                        <span className="font-semibold text-[#123524]">{item.actor}</span>
                        <span className="font-mono">{item.date}</span>
                      </div>
                      <p className="text-xs text-[#354F52] mt-0.5 leading-relaxed">
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Mediation Simulation for Evaluators */}
              {activeDispute.status !== 'resolved' && (
                <div className="p-4 rounded-xl bg-[#E8EFEA] border border-[#CCD8D0] space-y-3">
                  <h4 className="text-xs font-bold text-[#123524] uppercase tracking-wider">
                    {language === 'hi' ? 'मध्यस्थता प्रगति सिमुलेशन (डेमो)' : 'Mediation Progression (Demonstration)'}
                  </h4>
                  <input
                    type="text"
                    value={mediationNote}
                    onChange={e => setMediationNote(e.target.value)}
                    placeholder="Enter resolution notes from contractor or chowk meeting..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#CCD8D0] bg-white text-[#1A2421]"
                  />
                  <div className="flex items-center justify-end gap-2">
                    {activeDispute.status === 'open' && (
                      <button
                        onClick={() => handleUpdateStatus('in_mediation')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors"
                      >
                        Advance to "In Mediation"
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus('resolved')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg transition-colors"
                    >
                      Resolve &amp; Disburse Balance (₹{activeDispute.discrepancyAmount})
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E3E0D8] p-12 text-center text-xs text-[#52796F]">
              No dispute selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
