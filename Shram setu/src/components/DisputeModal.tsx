import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, AlertTriangle, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { WorkRecord } from '../types';

export const DisputeModal: React.FC = () => {
  const {
    isDisputeModalOpen,
    setDisputeModalOpen,
    selectedDisputeRecord,
    fileDispute,
    records,
    language,
    setCurrentView,
  } = useApp();

  const [recordId, setRecordId] = useState<string>('');
  const [issueType, setIssueType] = useState<'rate_cut' | 'unpaid_wages' | 'unrecorded_overtime' | 'wrong_hours'>('rate_cut');
  const [claimedAmount, setClaimedAmount] = useState<number>(650);
  const [paidAmount, setPaidAmount] = useState<number>(400);
  const [description, setDescription] = useState<string>('');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (selectedDisputeRecord) {
      setRecordId(selectedDisputeRecord.id);
      setClaimedAmount(selectedDisputeRecord.earnedWage);
      setPaidAmount(selectedDisputeRecord.paidAmount);
      setDescription(
        `Discrepancy at ${selectedDisputeRecord.siteName}: Agreed rate was ₹${selectedDisputeRecord.agreedDailyRate}, but contractor disbursed only ₹${selectedDisputeRecord.paidAmount}.`
      );
    } else if (records.length > 0) {
      const defaultRec = records[0];
      setRecordId(defaultRec.id);
      setClaimedAmount(defaultRec.earnedWage);
      setPaidAmount(defaultRec.paidAmount);
    }
  }, [selectedDisputeRecord, records]);

  if (!isDisputeModalOpen) return null;

  const currentRec = records.find(r => r.id === recordId) || records[0];
  const discrepancy = Math.max(0, claimedAmount - paidAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordId) return;

    fileDispute({
      workRecordId: recordId,
      issueType,
      claimedAmount: Number(claimedAmount),
      paidAmount: Number(paidAmount),
      description: description.trim(),
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setDisputeModalOpen(false);
      setCurrentView('disputes');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FAF9F5] rounded-2xl max-w-xl w-full border border-[#D5D2C8] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#E06D53] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === 'hi' ? 'मजदूरी विवाद दर्ज करें' : 'File Wage Dispute & Evidence'}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'hi' ? 'आपसी मध्यस्थता हेतु डिजिटल साक्ष्य संकलन' : 'Organize evidence for mediation & chowk committee'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDisputeModalOpen(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-[#2D6A4F] rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-[#123524]">
              {language === 'hi' ? 'विवाद सफलतापूर्वक दर्ज हुआ' : 'Dispute Dossier Created'}
            </h4>
            <p className="text-xs text-[#52796F] max-w-sm mx-auto">
              {language === 'hi'
                ? 'डिजिटल साक्ष्य फ़ाइल तैयार हो गई है। आपको विवाद निवारण पृष्ठ पर ले जाया जा रहा है।'
                : 'Digital evidence record has been logged. Redirecting to Wage Disputes tracker...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Record Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#1A2421] mb-1">
                {language === 'hi' ? 'संबंधित कार्य रिकॉर्ड चुनें' : 'Select Associated Work Record'}
              </label>
              <select
                value={recordId}
                onChange={e => {
                  const id = e.target.value;
                  setRecordId(id);
                  const selected = records.find(r => r.id === id);
                  if (selected) {
                    setClaimedAmount(selected.earnedWage);
                    setPaidAmount(selected.paidAmount);
                  }
                }}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#D5D2C8] bg-white text-[#1A2421] focus:outline-none focus:ring-2 focus:ring-[#E06D53]"
              >
                {records.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.date} — {r.siteName} (Earned: ₹{r.earnedWage}, Paid: ₹{r.paidAmount})
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Type */}
            <div>
              <label className="block text-xs font-semibold text-[#1A2421] mb-1">
                {language === 'hi' ? 'विवाद का प्रकार' : 'Type of Discrepancy'}
              </label>
              <select
                value={issueType}
                onChange={e => setIssueType(e.target.value as any)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#D5D2C8] bg-white text-[#1A2421] focus:outline-none focus:ring-2 focus:ring-[#E06D53]"
              >
                <option value="rate_cut">
                  {language === 'hi' ? 'तय दिहाड़ी दर में मनमानी कटौती (Rate Cut)' : 'Arbitrary Wage Rate Deduction'}
                </option>
                <option value="unpaid_wages">
                  {language === 'hi' ? 'बकाया मजदूरी का भुगतान न होना (Unpaid Balance)' : 'Unpaid Withheld Wages'}
                </option>
                <option value="unrecorded_overtime">
                  {language === 'hi' ? 'किए गए ओवर-टाइम को न मानना (Unrecorded Overtime)' : 'Unrecorded Overtime Shift'}
                </option>
                <option value="wrong_hours">
                  {language === 'hi' ? 'गलत कार्य घंटे दर्ज करना (Wrong Hours)' : 'Disputed Shift Hours'}
                </option>
              </select>
            </div>

            {/* Financial Discrepancy Breakdown */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#F4F1EA] border border-[#DDD8CC]">
              <div>
                <label className="block text-[11px] text-[#556960] font-medium mb-1">
                  {language === 'hi' ? 'दावा राशि (₹)' : 'Agreed Claim (₹)'}
                </label>
                <input
                  type="number"
                  required
                  value={claimedAmount}
                  onChange={e => setClaimedAmount(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-[#CBC5B4] bg-white text-[#1A2421]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#556960] font-medium mb-1">
                  {language === 'hi' ? 'मिला भुगतान (₹)' : 'Paid Amount (₹)'}
                </label>
                <input
                  type="number"
                  required
                  value={paidAmount}
                  onChange={e => setPaidAmount(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-[#CBC5B4] bg-white text-[#1A2421]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#556960] font-medium mb-1">
                  {language === 'hi' ? 'विवाद अंतर (₹)' : 'Dispute Gap (₹)'}
                </label>
                <div className="w-full text-xs font-bold px-2 py-1.5 rounded-lg bg-red-50 text-[#C94A29] border border-red-200">
                  ₹{discrepancy}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#1A2421] mb-1">
                {language === 'hi' ? 'विस्तृत विवरण एवं गवाह' : 'Explanation & Supporting Witnesses'}
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain what happened at the chowk or site. Mention co-workers who saw you working..."
                className="w-full text-xs font-medium p-3 rounded-lg border border-[#D5D2C8] bg-white text-[#1A2421] focus:outline-none focus:ring-2 focus:ring-[#E06D53]"
              />
            </div>

            {/* Honest Disclaimer */}
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-[#805B10] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#805B10] shrink-0 mt-0.5" />
              <p>
                {language === 'hi'
                  ? 'श्रम सेतु २.० साक्ष्य संकलन व पारदर्शी मध्यस्थता सहायता प्रदान करता है। यह स्वतः कानूनी निर्णय नहीं है और न ही बैंक से जबरन वसूली करता है।'
                  : 'Notice: Shram Setu 2.0 compiles verifiable digital attendance & wage logs to assist in informal chowk/panchayat mediation. It does not automatically guarantee financial recovery.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDisputeModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#405D53] hover:text-[#123524] hover:bg-[#EAE8E0] rounded-lg transition-colors"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#E06D53] hover:bg-[#C95B42] rounded-lg shadow-sm transition-colors"
              >
                {language === 'hi' ? 'विवाद साक्ष्य दर्ज करें' : 'Submit Evidence Dossier'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
