import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  History,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  ArrowRight,
  Search,
  Eye,
  AlertCircle,
  FileCheck2,
  Scale,
  Sparkles,
  Info,
  Bug,
  HelpCircle,
} from 'lucide-react';
import { verifyAuditTrail } from '../utils/auditVerification';
import { detectLedgerAnomalies } from '../utils/anomalyDetector';
import { AuditVerificationResult, AnomalyAlert } from '../types';

export const AdminVerificationPage: React.FC = () => {
  const {
    records,
    worker,
    disputes,
    tamperRecord,
    restoreRecord,
    breakChainLink,
    injectUnreasonedDeduction,
    injectDuplicateShift,
    injectOverlongShift,
    corruptHashFormat,
    injectOverpayment,
    resetDemoData,
    openRecordInspector,
    language,
    setCurrentView,
  } = useApp();

  // Test bench state
  const [testRecordId, setTestRecordId] = useState<string>(
    records.length > 0 ? records[0].id : ''
  );
  const [tamperRate, setTamperRate] = useState<number>(400);

  // Verification state (auto-evaluates or re-evaluates on demand)
  const [verificationResult, setVerificationResult] = useState<AuditVerificationResult>(() =>
    verifyAuditTrail(records)
  );
  const [lastVerifiedTime, setLastVerifiedTime] = useState<string>(() =>
    new Date().toLocaleTimeString('en-IN', { hour12: false })
  );
  const [isVerifying, setIsVerifying] = useState(false);

  // Anomaly filter state
  const [anomalyFilter, setAnomalyFilter] = useState<'all' | 'warning' | 'info'>('all');

  const targetRec = records.find(r => r.id === testRecordId) || records[0];
  const tamperedRecordsCount = records.filter(r => r.isTampered).length;

  // Run audit verification on demand
  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const result = verifyAuditTrail(records);
      setVerificationResult(result);
      setLastVerifiedTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
      setIsVerifying(false);
    }, 250);
  };

  // Run tamper injection (Outcome 2: modification_detected)
  const handleRunTamper = () => {
    if (!targetRec) return;
    tamperRecord(targetRec.id, tamperRate);
    setTimeout(handleRunVerification, 50);
  };

  // Restore record
  const handleRestore = () => {
    if (!targetRec) return;
    restoreRecord(targetRec.id);
    setTimeout(handleRunVerification, 50);
  };

  // Break chain link (Outcome 3: history_incomplete)
  const handleBreakChain = () => {
    if (!targetRec) return;
    breakChainLink(targetRec.id);
    setTimeout(handleRunVerification, 50);
  };

  // Corrupt hash format (Outcome 4: verification_failed)
  const handleCorruptHash = () => {
    if (!targetRec) return;
    corruptHashFormat(targetRec.id);
    setTimeout(handleRunVerification, 50);
  };

  // Inject deduction without reason (RULE-05)
  const handleInjectBadDeduction = () => {
    if (!targetRec) return;
    injectUnreasonedDeduction(targetRec.id);
  };

  // Inject duplicate shift on same date (RULE-01)
  const handleInjectDuplicate = () => {
    injectDuplicateShift();
  };

  // Inject 14h continuous shift (RULE-02)
  const handleInjectOverlong = () => {
    injectOverlongShift();
  };

  // Inject payment exceeding net wages due (RULE-04)
  const handleInjectExcessivePayment = () => {
    if (!targetRec) return;
    injectOverpayment(targetRec.id);
  };

  // Reset all to clean baseline (Outcome 1: integrity_passed)
  const handleReset = () => {
    resetDemoData();
    setTimeout(handleRunVerification, 50);
  };

  // Detect ledger anomalies
  const anomalyAlerts: AnomalyAlert[] = detectLedgerAnomalies(records);
  const filteredAnomalies = anomalyAlerts.filter(a => {
    if (anomalyFilter === 'all') return true;
    return a.severity === anomalyFilter;
  });

  // Get outcome banner styles
  const getOutcomeStyle = (outcome: AuditVerificationResult['outcome']) => {
    switch (outcome) {
      case 'integrity_passed':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />,
          title: 'Integrity check passed for the records examined.',
          hindiTitle: 'जांचे गए सभी अभिलेखों की अखंडता प्रमाणित है।',
        };
      case 'modification_detected':
        return {
          bg: 'bg-red-50 border-red-300 text-red-950',
          badgeBg: 'bg-red-100 text-red-800 border-red-300',
          icon: <AlertTriangle className="w-6 h-6 text-red-700 shrink-0" />,
          title: 'Record modification detected.',
          hindiTitle: 'लेजर अभिलेख में अनधिकृत बदलाव पकड़ा गया।',
        };
      case 'history_incomplete':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />,
          title: 'Previous history is incomplete.',
          hindiTitle: 'पूर्व इतिहास अपूर्ण है या श्रृंखला खंडित है।',
        };
      case 'verification_failed':
      default:
        return {
          bg: 'bg-slate-50 border-slate-300 text-slate-900',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <Info className="w-6 h-6 text-slate-700 shrink-0" />,
          title: 'Verification could not be completed.',
          hindiTitle: 'सत्यापन प्रक्रिया पूर्ण नहीं हो सकी।',
        };
    }
  };

  const currentOutcomeStyle = getOutcomeStyle(verificationResult.outcome);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-[#1B4332] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
            <span>Senior Bal Vigyan Computer Science Test Bench · Indore MP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight mt-1">
            {language === 'hi'
              ? 'लेजर ऑडिट एवं नियम-आधारित विसंगति जांच'
              : 'Audit Check & Explainable Anomaly Detection'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F] mt-1 max-w-3xl leading-relaxed">
            {language === 'hi'
              ? 'मजदूरी लेजर की अखंडता जांचें, अनधिकृत बदलाव पकड़ें और निष्पक्ष, नियम-आधारित विसंगति चेतावनियों का विश्लेषण करें।'
              : 'Cryptographically verifies record linkage, catches retroactive tampering, and surfaces deterministic, explainable anomaly notices without artificial intelligence.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-xl transition-all flex items-center gap-2 shadow-sm min-h-[40px]"
          >
            <ShieldCheck className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying...' : 'Run Audit Check'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 text-xs font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-xl transition-colors flex items-center gap-1.5 min-h-[40px]"
            title="Reset to clean baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C94A29]" />
            <span>{language === 'hi' ? 'रीसेट' : 'Reset Baseline'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: AUDIT VERIFICATION OUTCOME & CANONICAL FIELD SPECIFICATION */}
      <div className={`p-6 sm:p-8 rounded-2xl border-2 shadow-sm space-y-5 transition-all ${currentOutcomeStyle.bg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            {currentOutcomeStyle.icon}
            <div>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${currentOutcomeStyle.badgeBg}`}>
                AUDIT OUTCOME: {verificationResult.outcome.toUpperCase().replace('_', ' ')}
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                {currentOutcomeStyle.title}
              </h2>
              <span className="text-xs opacity-80 block">
                {currentOutcomeStyle.hindiTitle}
              </span>
            </div>
          </div>

          <div className="text-right text-xs opacity-75 font-mono">
            <div>Records Examined: <strong>{verificationResult.recordsExamined}</strong> blocks</div>
            <div className="text-[11px]">Checked at: {lastVerifiedTime} IST</div>
          </div>
        </div>

        {/* Detailed Findings & Explanations */}
        <div className="bg-white/90 backdrop-blur-xs p-4 sm:p-5 rounded-xl border border-current/20 space-y-3 text-xs">
          <div className="font-bold uppercase tracking-wider text-[11px] opacity-90 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-[#1B4332]" />
            <span>Verification Findings &amp; Canonical State Checks:</span>
          </div>

          <ul className="space-y-1.5 leading-relaxed">
            {verificationResult.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-[#1B4332] shrink-0">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-current/15 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="font-semibold block opacity-85">Canonical String Fields Hashed:</span>
              <code className="text-[10px] font-mono bg-black/5 px-2 py-1 rounded block mt-1 truncate">
                previousHash | date | agreedDailyRate | daysWorked | shiftHours | overtimeHours | earnedWage
              </code>
            </div>
            <div>
              <span className="font-semibold block opacity-85">Linkage Verification Rule:</span>
              <span className="text-[11px] block mt-1 text-[#354F52]">
                Every non-genesis block must reference the exact canonical hash of its adjacent predecessor.
              </span>
            </div>
          </div>
        </div>

        {/* STRICT HONESTY & ARCHITECTURAL LIMITATIONS NOTICE (Prompt 5 requirement) */}
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-[#805B10] space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#805B10]">
            <Scale className="w-4 h-4 text-[#805B10] shrink-0" />
            <span>Honest Security Claims &amp; Local Hash Chain Limitations</span>
          </div>
          <p className="text-[11px] font-medium leading-relaxed">
            The demonstration audit verification interface operates under strict scientific honesty standards:
          </p>
          <ul className="text-[11px] space-y-1 list-disc pl-4 leading-relaxed">
            <li><strong>Demonstrates tamper-evident logging principles:</strong> Catches uncoordinated edits, client rate tampering, and history sequence breaks.</li>
            <li><strong>Does NOT prevent root overwrite:</strong> A party with local storage access can rewrite both the records and the hashes simultaneously.</li>
            <li><strong>Not a distributed consensus network:</strong> This is a browser demonstration, not a decentralized blockchain or legally binding audit trail.</li>
            <li><strong>Requires trusted external checkpoints:</strong> True cryptographic immutability requires multi-party signatures or external witness anchors (e.g. Chowk Committee mediation keys).</li>
          </ul>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE TEST BENCH FOR JUDGES & EVALUATORS */}
      <div className="bg-[#123524] text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2D6A4F]">
          <div>
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-[#E06D53]" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Interactive Test Bench for Evaluators &amp; Judges
              </h2>
            </div>
            <p className="text-xs text-[#C5D6BF] mt-0.5">
              Inject intentional discrepancies to observe how the cryptographic audit trail and anomaly engine react:
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#1B4332] text-emerald-300 border border-[#2D6A4F] self-start sm:self-auto">
            Live Test Mode
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Record Selector & Rate Tamper */}
          <div className="lg:col-span-7 bg-[#1B4332] p-5 rounded-xl border border-[#2D6A4F] space-y-4 text-xs">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              1. Test Retroactive Rate Tampering (Hash Mismatch)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-[#A3B899] font-medium mb-1">
                  Target Record:
                </label>
                <select
                  value={testRecordId}
                  onChange={e => setTestRecordId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-[#123524] text-white border border-[#2D6A4F] focus:outline-none"
                >
                  {records.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.date} — {r.siteName} (Rate: ₹{r.agreedDailyRate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#A3B899] font-medium mb-1">
                  Altered Wage Rate to Inject:
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="100"
                    max="1200"
                    value={tamperRate}
                    onChange={e => setTamperRate(Number(e.target.value))}
                    className="flex-1 text-xs font-mono font-bold px-3 py-2 rounded-lg bg-[#123524] text-[#E06D53] border border-[#2D6A4F] focus:outline-none"
                  />
                  <span className="text-xs text-[#A3B899] self-center">/day</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2D6A4F]">
              <span className="text-[11px] text-[#C5D6BF]">
                Current status: {targetRec?.isTampered ? (
                  <strong className="text-red-400">Tampered (Mismatch Flagged)</strong>
                ) : (
                  <strong className="text-emerald-300">Pristine Validated</strong>
                )}
              </span>

              <div className="flex items-center gap-2">
                {targetRec?.isTampered ? (
                  <button
                    onClick={handleRestore}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#123524] bg-white hover:bg-[#E8EFEA] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Baseline Rate</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRunTamper}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#C94A29] hover:bg-[#B33C1D] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Inject Rate Cut (₹{tamperRate})</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Other Edge Case Injections */}
          <div className="lg:col-span-5 bg-[#1B4332] p-5 rounded-xl border border-[#2D6A4F] space-y-4 text-xs">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              2. Test Linkage &amp; Anomaly Rules
            </span>

            <div className="space-y-2">
              <button
                onClick={handleBreakChain}
                className="w-full p-2 rounded-lg bg-[#123524] hover:bg-[#163f2b] border border-[#2D6A4F] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-[#E06D53] group-hover:underline text-xs">
                    Simulate Incomplete History (Corrupt Link)
                  </div>
                  <div className="text-[10px] text-[#A3B899]">
                    Tests "Previous history is incomplete" outcome (#3)
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#A3B899] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleCorruptHash}
                className="w-full p-2 rounded-lg bg-[#123524] hover:bg-[#163f2b] border border-[#2D6A4F] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-purple-300 group-hover:underline text-xs">
                    Simulate Corrupted Hash Format
                  </div>
                  <div className="text-[10px] text-[#A3B899]">
                    Tests "Verification could not be completed" outcome (#4)
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#A3B899] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleInjectBadDeduction}
                className="w-full p-2 rounded-lg bg-[#123524] hover:bg-[#163f2b] border border-[#2D6A4F] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-amber-300 group-hover:underline text-xs">
                    Inject Deduction Without Reason
                  </div>
                  <div className="text-[10px] text-[#A3B899]">
                    Triggers RULE-05 explainable anomaly alert
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#A3B899] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleInjectDuplicate}
                className="w-full p-2 rounded-lg bg-[#123524] hover:bg-[#163f2b] border border-[#2D6A4F] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-blue-300 group-hover:underline text-xs">
                    Inject Duplicate Shift on Same Date
                  </div>
                  <div className="text-[10px] text-[#A3B899]">
                    Triggers RULE-01 duplicate calendar entry
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#A3B899] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleInjectOverlong}
                className="w-full p-2 rounded-lg bg-[#123524] hover:bg-[#163f2b] border border-[#2D6A4F] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-rose-300 group-hover:underline text-xs">
                    Inject 14h Continuous Shift
                  </div>
                  <div className="text-[10px] text-[#A3B899]">
                    Triggers RULE-02 continuous shift policy threshold
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#A3B899] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleInjectExcessivePayment}
                className="w-full p-2 rounded-lg bg-[#123524] hover:bg-[#163f2b] border border-[#2D6A4F] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-emerald-300 group-hover:underline text-xs">
                    Inject Overpayment (&gt; Net Wages Due)
                  </div>
                  <div className="text-[10px] text-[#A3B899]">
                    Triggers RULE-04 mathematical reconciliation check
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#A3B899] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: EXPLAINABLE ANOMALY DETECTION ENGINE */}
      <div className="bg-white rounded-2xl border border-[#E3E0D8] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE8E0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
                Deterministic Rule-Based Anomaly Detection
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                100% Explainable · 0% AI
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#123524] tracking-tight mt-1">
              Active Ledger Anomaly Alerts ({anomalyAlerts.length})
            </h2>
            <p className="text-xs text-[#52796F] mt-0.5">
              Every alert explicitly states the rule name, values examined, trigger condition, and neutral non-accusatory advice.
            </p>
          </div>

          {/* Anomaly filter buttons */}
          <div className="flex items-center gap-1.5 text-xs self-start sm:self-auto">
            <button
              onClick={() => setAnomalyFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                anomalyFilter === 'all'
                  ? 'bg-[#1B4332] text-white'
                  : 'bg-[#FAF9F5] text-[#52796F] hover:bg-[#E8EFEA]'
              }`}
            >
              All Alerts ({anomalyAlerts.length})
            </button>
            <button
              onClick={() => setAnomalyFilter('warning')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                anomalyFilter === 'warning'
                  ? 'bg-[#C94A29] text-white'
                  : 'bg-[#FAF9F5] text-[#52796F] hover:bg-[#E8EFEA]'
              }`}
            >
              Warnings ({anomalyAlerts.filter(a => a.severity === 'warning').length})
            </button>
            <button
              onClick={() => setAnomalyFilter('info')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                anomalyFilter === 'info'
                  ? 'bg-blue-700 text-white'
                  : 'bg-[#FAF9F5] text-[#52796F] hover:bg-[#E8EFEA]'
              }`}
            >
              Informational ({anomalyAlerts.filter(a => a.severity === 'info').length})
            </button>
          </div>
        </div>

        {/* Anomaly List */}
        {filteredAnomalies.length > 0 ? (
          <div className="space-y-4">
            {filteredAnomalies.map(alert => {
              const rec = records.find(r => r.id === alert.recordId);
              return (
                <div
                  key={alert.id}
                  className={`p-5 rounded-xl border text-xs space-y-3 transition-all ${
                    alert.severity === 'warning'
                      ? 'bg-amber-50/50 border-amber-300'
                      : 'bg-blue-50/50 border-blue-200'
                  }`}
                >
                  {/* Alert Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-current text-[#123524]">
                        {alert.ruleId}
                      </span>
                      <h3 className="font-bold text-sm text-[#123524]">
                        {alert.ruleName}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          alert.severity === 'warning'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    {rec && (
                      <button
                        onClick={() => openRecordInspector(rec)}
                        className="text-xs font-semibold text-[#1B4332] hover:underline flex items-center gap-1 self-start sm:self-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Record #{rec.id}</span>
                      </button>
                    )}
                  </div>

                  {/* Trigger Reason */}
                  <div className="p-3 bg-white rounded-lg border border-[#E3E0D8] space-y-1">
                    <div className="text-[10px] font-bold text-[#52796F] uppercase tracking-wider">
                      Trigger Reason (Why This Rule Fired)
                    </div>
                    <p className="text-xs text-[#1A2421] font-medium leading-relaxed">
                      {alert.triggerReason}
                    </p>
                  </div>

                  {/* Values Examined Key-Value List */}
                  <div>
                    <div className="text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-1.5">
                      Specific Values Examined:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {alert.valuesExamined.map((item, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-[#EAE8E0] text-[11px]">
                          <span className="text-[#52796F] block truncate text-[10px]">{item.label}</span>
                          <span className="font-mono font-bold text-[#123524] block truncate mt-0.5">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Neutral Non-Accusatory Worker/Contractor Notice */}
                  <div className="flex items-start gap-2 pt-1 text-[11px] text-[#354F52] italic">
                    <Info className="w-4 h-4 text-[#52796F] shrink-0 mt-0.5" />
                    <span><strong>Neutral Mediation Guidance:</strong> {alert.neutralNotice}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#52796F] bg-[#FAF9F5] rounded-xl border border-[#E3E0D8]">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="font-bold text-[#123524] text-sm">No Discrepancies Flagged</div>
            <p className="mt-1">
              All records conform to configured minimum-wage floors, deduplication checks, and payment reconciliations.
            </p>
          </div>
        )}

        {/* Explainability Notice */}
        <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#CCD8D0] text-xs text-[#52796F] space-y-1.5">
          <div className="font-bold text-[#123524] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#1B4332]" />
            <span>Deterministic Rule Foundation (No Black-Box AI)</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Shram Setu 2.0 does NOT use artificial intelligence or machine learning for anomaly detection. All checks operate through deterministic, rule-based comparisons against configured statutory benchmarks, shift math, and muster continuity. It does not judge intent, presume dishonesty, or declare who is right; it presents facts transparently for joint resolution.
          </p>
        </div>
      </div>

      {/* SECTION 4: CHRONOLOGICAL CRYPTOGRAPHIC BLOCK EXPLORER */}
      <div className="bg-white rounded-2xl border border-[#E3E0D8] shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-[#123524]">
              {language === 'hi' ? 'क्रिप्टोग्राफिक लेजर ब्लॉक निरीक्षक' : 'Cryptographic Ledger Block Chain Explorer'}
            </h3>
            <p className="text-xs text-[#52796F]">
              Inspect canonical SHA-256 block hash references and predecessor linkages across the entire work record history:
            </p>
          </div>

          <div className="text-xs text-[#52796F] font-mono">
            Chain Head: <strong>Block #{records.length}</strong>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {records.map((r, idx) => (
            <div
              key={r.id}
              className={`p-4 rounded-xl border text-xs space-y-2.5 transition-all ${
                r.isTampered
                  ? 'bg-red-50/80 border-red-300 ring-1 ring-red-300'
                  : 'bg-[#FAF9F5] border-[#E3E0D8]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#123524] px-2 py-0.5 rounded bg-white border border-[#D5D2C8]">
                    BLOCK #{records.length - idx}
                  </span>
                  <span className="text-[#52796F] font-mono text-[11px]">[{r.id}]</span>
                  <span className="font-bold text-xs text-[#1A2421]">{r.date}</span>
                  <span className="text-[#52796F] hidden sm:inline">· {r.siteName}</span>
                </div>

                <div className="flex items-center gap-2">
                  {r.isTampered ? (
                    <span className="text-[10px] font-bold text-red-800 bg-red-100 border border-red-300 px-2 py-0.5 rounded">
                      TAMPERED — HASH MISMATCH
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                      VALID SHA-256
                    </span>
                  )}

                  <button
                    onClick={() => openRecordInspector(r)}
                    className="text-[11px] font-semibold text-[#1B4332] hover:underline flex items-center gap-0.5 ml-2"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Block Financial Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-[#E3E0D8]">
                <div>
                  <span className="text-[#52796F] block text-[10px]">Agreed Daily Rate</span>
                  <span className={`font-mono font-bold ${r.isTampered ? 'text-red-700' : 'text-[#123524]'}`}>
                    ₹{r.agreedDailyRate}/day {r.originalDailyRate && r.originalDailyRate !== r.agreedDailyRate && `(Orig: ₹${r.originalDailyRate})`}
                  </span>
                </div>
                <div>
                  <span className="text-[#52796F] block text-[10px]">Net Wages Due</span>
                  <span className="font-mono font-bold text-[#123524]">₹{r.earnedWage}</span>
                </div>
                <div>
                  <span className="text-[#52796F] block text-[10px]">Recorded Paid</span>
                  <span className="font-mono font-bold text-emerald-700">₹{r.paidAmount}</span>
                </div>
                <div>
                  <span className="text-[#52796F] block text-[10px]">Outstanding Balance</span>
                  <span className="font-mono font-bold text-[#C94A29]">₹{r.balanceDue}</span>
                </div>
              </div>

              {/* Hashes Container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-white p-2 rounded border border-[#CCD8D0] truncate">
                  <span className="text-[#8EA89D]">Predecessor Link (prevHash): </span>
                  <span className={r.previousHash.startsWith('corrupted') ? 'text-red-700 font-bold' : 'text-[#52796F]'}>
                    {r.previousHash}
                  </span>
                </div>
                <div className={`p-2 rounded border truncate ${r.isTampered ? 'bg-red-100 border-red-300 text-red-900 font-bold' : 'bg-white border-[#CCD8D0] text-[#1B4332]'}`}>
                  <span className="text-[#8EA89D]">Block Hash: </span>
                  <span>{r.hash}</span>
                </div>
              </div>

              {r.modificationReason && (
                <div className="p-2.5 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 text-[11px] space-y-0.5">
                  <span className="font-bold block">Audit Trail Note:</span>
                  <p className="italic">{r.modificationReason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
