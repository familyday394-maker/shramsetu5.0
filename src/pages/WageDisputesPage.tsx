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
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Eye,
  Send,
  Building,
} from 'lucide-react';
import { DisputeRecord, DisputeStatus } from '../types';

export const WageDisputesPage: React.FC = () => {
  const {
    disputes,
    records,
    updateDisputeStatus,
    contractorRespondToDispute,
    setDisputeModalOpen,
    openRecordInspector,
    language,
    setCurrentView,
  } = useApp();

  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(
    disputes.length > 0 ? disputes[0].id : ''
  );
  const [filterState, setFilterState] = useState<string>('all');

  // Contractor response form states
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [contractorResponseText, setContractorResponseText] = useState('');
  const [contractorRespondentName, setContractorRespondentName] = useState('Munshi Radhe (Contractor Representative)');

  // Mediation progression note
  const [mediationNote, setMediationNote] = useState<string>('');

  const activeDispute = disputes.find(d => d.id === selectedDisputeId) || disputes[0];
  const linkedRecord = activeDispute ? records.find(r => r.id === activeDispute.workRecordId) : null;

  const filteredDisputes = disputes.filter(d => {
    if (filterState === 'all') return true;
    if (filterState === 'open') return d.status === 'open';
    if (filterState === 'awaiting_response') return d.status === 'awaiting_response';
    if (filterState === 'under_review') return d.status === 'under_review' || (d.status as string) === 'in_mediation';
    if (filterState === 'resolved') return d.status === 'resolved';
    return true;
  });

  const handleUpdateStatus = (newStatus: DisputeStatus) => {
    if (!activeDispute) return;
    const note = mediationNote.trim() || (
      newStatus === 'under_review'
        ? 'Case advanced to joint mediation session with chowk committee representatives.'
        : newStatus === 'awaiting_response'
        ? 'Notice served to contractor; awaiting official muster roll response.'
        : 'Discrepancy settled amicably by both parties. Mutual cash receipt signed.'
    );
    updateDisputeStatus(activeDispute.id, newStatus, note);
    setMediationNote('');
  };

  const handleContractorResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractorResponseText.trim() || !activeDispute) return;

    contractorRespondToDispute(activeDispute.id, {
      text: contractorResponseText.trim(),
      respondent: contractorRespondentName.trim() || 'Contractor Supervisor',
    });

    setContractorResponseText('');
    setShowResponseForm(false);
  };

  const getStatusBadge = (status: DisputeStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="text-xs font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded-md flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Open (खुला मामला)</span>
          </span>
        );
      case 'awaiting_response':
        return (
          <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting Response (जवाब प्रतीक्षित)</span>
          </span>
        );
      case 'under_review':
      case 'in_mediation':
        return (
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Under Review (मध्यस्थता में)</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved &amp; Settled (सुलझाया गया)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-[#C94A29] uppercase tracking-wider">
            {language === 'hi' ? 'निष्पक्ष मध्यस्थता एवं साक्ष्य संकलन' : 'Dual-Party Dispute Ledger'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi' ? 'मजदूरी विवाद निवारण डेस्क' : 'Transparent Wage Disputes Desk'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F] mt-1">
            {language === 'hi'
              ? 'कटौती, बिना भुगतान अथवा ओवर-टाइम विवादों में श्रमिक व ठेकेदार दोनों के कथन सुरक्षित रखे जाते हैं।'
              : 'Preserves both worker statements and contractor responses without automatic resolution or silent overwriting.'}
          </p>
        </div>

        <button
          onClick={() => setDisputeModalOpen(true)}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-[#C94A29] hover:bg-[#B33C1D] rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0 min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'hi' ? 'नया विवाद दर्ज करें' : 'Lodge New Dispute'}</span>
        </button>
      </div>

      {/* Main Dispute Interface (2 Columns: List on left, details & dual-account timeline on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dispute Dossiers List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#52796F] uppercase tracking-wider">
              {language === 'hi' ? 'दर्ज विवाद मामले' : 'Active Discrepancy Claims'} ({filteredDisputes.length})
            </h2>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 text-[11px]">
              <button
                onClick={() => setFilterState('all')}
                className={`px-2 py-0.5 rounded ${filterState === 'all' ? 'bg-[#1B4332] text-white font-semibold' : 'text-[#52796F] hover:bg-[#FAF9F5]'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterState('under_review')}
                className={`px-2 py-0.5 rounded ${filterState === 'under_review' ? 'bg-[#1B4332] text-white font-semibold' : 'text-[#52796F] hover:bg-[#FAF9F5]'}`}
              >
                Review
              </button>
              <button
                onClick={() => setFilterState('resolved')}
                className={`px-2 py-0.5 rounded ${filterState === 'resolved' ? 'bg-[#1B4332] text-white font-semibold' : 'text-[#52796F] hover:bg-[#FAF9F5]'}`}
              >
                Resolved
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredDisputes.map(d => (
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
                    <span>Disputed Field:</span>
                    <span className="font-medium text-[#1A2421] truncate max-w-[170px]">
                      {d.disputedField || d.issueType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discrepancy:</span>
                    <span className="font-mono font-bold text-[#C94A29]">₹{d.discrepancyAmount}</span>
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
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-[#805B10] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Scale className="w-4 h-4 text-[#805B10]" />
              <span>Mediation Assistance Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Shram Setu 2.0 does not decide truthful parties automatically or guarantee cash retrieval. It organizes timestamped statements, muster receipts, and peer evidence so chowk committees and mediators can review facts impartially.
            </p>
          </div>
        </div>

        {/* Right Column: Dispute Details, Both Accounts & Unresolved Facts */}
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
                  <span className="text-xs text-[#52796F] block">
                    Disputed: <strong className="text-[#1A2421]">{activeDispute.disputedField || 'Rate Cut'}</strong> · Lodged on {activeDispute.dateLodged}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#52796F] uppercase block font-semibold">DISPUTED GAP</span>
                  <span className="font-mono text-2xl font-bold text-[#C94A29] tabular-nums">
                    ₹{activeDispute.discrepancyAmount}
                  </span>
                </div>
              </div>

              {/* Link to inspect underlying work record */}
              {linkedRecord && (
                <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E3E0D8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1B4332]" />
                    <span>Underlying Record: <strong className="font-mono">{linkedRecord.id}</strong> ({linkedRecord.date})</span>
                  </div>
                  <button
                    onClick={() => openRecordInspector(linkedRecord)}
                    className="text-[#1B4332] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Calculations &amp; Receipts →</span>
                  </button>
                </div>
              )}

              {/* Financial comparison cards */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#FAF9F5] rounded-xl border border-[#EAE8E0] text-center text-xs">
                <div>
                  <span className="text-[11px] text-[#52796F] block">Claimed Wage</span>
                  <span className="font-mono text-base font-bold text-[#123524] tabular-nums">
                    ₹{activeDispute.claimedAmount}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#52796F] block">Disbursed Paid</span>
                  <span className="font-mono text-base font-bold text-[#2D6A4F] tabular-nums">
                    ₹{activeDispute.paidAmount}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#C94A29] block">Unsettled Balance</span>
                  <span className="font-mono text-base font-bold text-[#C94A29] tabular-nums">
                    ₹{activeDispute.discrepancyAmount}
                  </span>
                </div>
              </div>

              {/* DUAL ACCOUNTS: Worker Statement vs Contractor Response */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#123524] uppercase tracking-wider">
                  Preserved Statements of Both Parties
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Worker Statement Card */}
                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#1B4332] font-semibold text-[11px]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Worker Statement ({activeDispute.workerName})</span>
                      </span>
                      <span className="text-[#52796F] font-mono text-[10px]">{activeDispute.dateLodged}</span>
                    </div>
                    <p className="text-[#354F52] leading-relaxed italic">
                      "{activeDispute.description}"
                    </p>
                  </div>

                  {/* Contractor Response Card */}
                  <div className="p-4 rounded-xl bg-white border border-[#E3E0D8] space-y-2 text-xs shadow-2xs">
                    <div className="flex items-center justify-between text-[#123524] font-semibold text-[11px]">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        <span>Contractor Response</span>
                      </span>
                      {activeDispute.contractorResponse && (
                        <span className="text-[#52796F] font-mono text-[10px]">
                          {activeDispute.contractorResponse.date}
                        </span>
                      )}
                    </div>

                    {activeDispute.contractorResponse ? (
                      <div className="space-y-1">
                        <p className="text-[#354F52] leading-relaxed italic">
                          "{activeDispute.contractorResponse.text}"
                        </p>
                        <span className="text-[10px] text-[#52796F] block text-right">
                          — {activeDispute.contractorResponse.respondent}
                        </span>
                      </div>
                    ) : (
                      <div className="py-2 space-y-2">
                        <p className="text-[#52796F] text-[11px]">
                          No formal contractor response has been recorded yet. The case is currently awaiting response.
                        </p>
                        <button
                          onClick={() => setShowResponseForm(true)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded transition-colors"
                        >
                          [Simulate Contractor Response]
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form to Submit Contractor Response */}
                {showResponseForm && (
                  <form onSubmit={handleContractorResponseSubmit} className="p-4 rounded-xl bg-[#FAF9F5] border border-[#1B4332] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#123524]">Record Official Contractor Statement</span>
                      <button
                        type="button"
                        onClick={() => setShowResponseForm(false)}
                        className="text-[#52796F] hover:text-[#123524]"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={contractorResponseText}
                      onChange={e => setContractorResponseText(e.target.value)}
                      placeholder="Explain contractor's position or muster records..."
                      required
                      className="w-full p-2 bg-white rounded border border-[#CCD8D0] text-xs"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={contractorRespondentName}
                        onChange={e => setContractorRespondentName(e.target.value)}
                        placeholder="Respondent Name & Role"
                        className="flex-1 p-2 bg-white rounded border border-[#CCD8D0] text-xs"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1B4332] hover:bg-[#123524] text-white font-semibold rounded text-xs"
                      >
                        Submit Response
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Unresolved Facts Section */}
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#123524]">
                  <HelpCircle className="w-4 h-4 text-[#C94A29]" />
                  <span>Unresolved Facts for Mediation (तथ्य जिनकी पुष्टि लंबित है)</span>
                </div>
                <p className="text-[11px] text-[#52796F]">
                  Shram Setu does not declare either party truthful. The following points remain unresolved pending mediation evidence:
                </p>
                <ul className="space-y-1.5 text-[11px] text-[#354F52]">
                  {(activeDispute.unresolvedFacts || [
                    "Exact trade category agreed upon verbally at the morning chowk",
                    "Overtime authorization records vs timekeeper muster notes",
                  ]).map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#C94A29] font-bold">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supporting Evidence List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#123524] uppercase tracking-wider">
                  {language === 'hi' ? 'संलग्न डिजिटल साक्ष्य' : 'Verified Supporting Evidence References'}
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

              {/* Timeline (Preserves All Updates) */}
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

              {/* Interactive Mediation Progression Simulation */}
              {activeDispute.status !== 'resolved' && (
                <div className="p-4 rounded-xl bg-[#E8EFEA] border border-[#CCD8D0] space-y-3">
                  <h4 className="text-xs font-bold text-[#123524] uppercase tracking-wider">
                    {language === 'hi' ? 'मध्यस्थता प्रगति सिमुलेटर (डेमो)' : 'Advance Mediation State (Demonstration)'}
                  </h4>
                  <input
                    type="text"
                    value={mediationNote}
                    onChange={e => setMediationNote(e.target.value)}
                    placeholder="Enter resolution notes from chowk committee session..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#CCD8D0] bg-white text-[#1A2421]"
                  />
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {activeDispute.status === 'open' && (
                      <button
                        onClick={() => handleUpdateStatus('awaiting_response')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                      >
                        Advance to "Awaiting Response"
                      </button>
                    )}
                    {activeDispute.status !== 'under_review' && (
                      <button
                        onClick={() => handleUpdateStatus('under_review')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors"
                      >
                        Advance to "Under Review"
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus('resolved')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg transition-colors shadow-sm"
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
