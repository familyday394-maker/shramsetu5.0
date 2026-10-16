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
  ArrowRight
} from 'lucide-react';

export const AdminVerificationPage: React.FC = () => {
  const {
    records,
    worker,
    disputes,
    tamperRecord,
    restoreRecord,
    resetDemoData,
    language,
    setCurrentView,
  } = useApp();

  const [testRecordId, setTestRecordId] = useState<string>(
    records.length > 0 ? records[0].id : ''
  );
  const [tamperRate, setTamperRate] = useState<number>(400);

  const targetRec = records.find(r => r.id === testRecordId) || records[0];
  const tamperedRecordsCount = records.filter(r => r.isTampered).length;

  const handleRunTamper = () => {
    if (!targetRec) return;
    tamperRecord(targetRec.id, tamperRate);
  };

  const handleRestore = () => {
    if (!targetRec) return;
    restoreRecord(targetRec.id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
            {language === 'hi' ? 'सीनियर बाल विज्ञान परीक्षण पीठ' : 'Senior Bal Vigyan Test Bench'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi' ? 'लेजर ऑडिट एवं छेड़छाड़ जांच' : 'Ledger Audit & Tamper Test Bench'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F] mt-1">
            {language === 'hi'
              ? 'प्रमाणित करें कि कैसे एकतरफा मजदूरी कटौती को क्रिप्टोग्राफिक हैश-चेन द्वारा तुरंत पकड़ लिया जाता है।'
              : 'Demonstrates how unauthorized wage alterations instantly break the cryptographic hash chain.'}
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset demo ledger and records to clean baseline?')) {
              resetDemoData();
            }
          }}
          className="px-4 py-2 text-xs font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-[#E06D53]" />
          <span>{language === 'hi' ? 'डेमो डेटा रीसेट करें' : 'Reset Demo Data'}</span>
        </button>
      </div>

      {/* Ledger Health Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-[11px] text-[#52796F] font-medium block">TOTAL LEDGER BLOCKS</span>
          <span className="font-mono text-2xl font-bold text-[#123524] mt-1 block">
            {records.length} Blocks
          </span>
          <span className="text-[11px] text-[#2D6A4F] mt-1 block">Chronologically Chained</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-[11px] text-[#52796F] font-medium block">TAMPER STATUS</span>
          <span className={`font-mono text-2xl font-bold mt-1 block ${tamperedRecordsCount > 0 ? 'text-[#E06D53]' : 'text-[#2D6A4F]'}`}>
            {tamperedRecordsCount > 0 ? `${tamperedRecordsCount} MISMATCH` : 'VERIFIED'}
          </span>
          <span className="text-[11px] text-[#52796F] mt-1 block">
            {tamperedRecordsCount > 0 ? 'Discrepancy Detected' : 'All hashes valid'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-[11px] text-[#52796F] font-medium block">ACTIVE DISPUTES</span>
          <span className="font-mono text-2xl font-bold text-amber-700 mt-1 block">
            {disputes.length}
          </span>
          <span className="text-[11px] text-[#52796F] mt-1 block">Under Chowk Review</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-[11px] text-[#52796F] font-medium block">ACTIVE PASSES</span>
          <span className="font-mono text-2xl font-bold text-[#123524] mt-1 block">
            4 Workers
          </span>
          <span className="text-[11px] text-[#2D6A4F] mt-1 block">Indore District Pool</span>
        </div>
      </div>

      {/* Interactive Tamper Simulator for Judges */}
      <div className="bg-[#123524] text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#E06D53]" />
            <h2 className="text-xl font-bold">
              {language === 'hi' ? 'निर्णायकों हेतु छेड़छाड़ परीक्षण सिमुलेटर' : 'Live Tamper Demonstration for Judges'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#C5D6BF]">
            Simulate what happens when an unscrupulous supervisor tries to retroactively cut a recorded wage:
          </p>
        </div>

        <div className="bg-[#1B4332] p-5 rounded-xl border border-[#2D6A4F] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] text-[#A3B899] font-medium mb-1">
                Select Record to Test:
              </label>
              <select
                value={testRecordId}
                onChange={e => setTestRecordId(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-[#123524] text-white border border-[#2D6A4F] focus:outline-none"
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
                Current Recorded Daily Rate:
              </label>
              <div className="font-mono text-lg font-bold text-white px-3 py-1.5 bg-[#123524] rounded-lg border border-[#2D6A4F]">
                ₹{targetRec ? targetRec.agreedDailyRate : 650}
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[#A3B899] font-medium mb-1">
                Altered Rate to Inject:
              </label>
              <input
                type="number"
                min="200"
                max="1000"
                value={tamperRate}
                onChange={e => setTamperRate(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold px-3 py-2 rounded-lg bg-[#123524] text-[#E06D53] border border-[#2D6A4F] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2D6A4F]">
            <div className="text-xs text-[#C5D6BF]">
              {targetRec?.isTampered ? (
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#E06D53]" />
                  <span>Tamper Alert Active: Hash Mismatch Flagged!</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ledger in pristine validated state.</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {targetRec?.isTampered ? (
                <button
                  onClick={handleRestore}
                  className="px-4 py-2 text-xs font-semibold text-[#123524] bg-white hover:bg-[#E8EFEA] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Original Hash</span>
                </button>
              ) : (
                <button
                  onClick={handleRunTamper}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#E06D53] hover:bg-[#C95B42] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Inject Unauthorized Rate Cut (₹{tamperRate})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Chain Inspector */}
      <div className="bg-white rounded-2xl border border-[#E3E0D8] shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#123524]">
              {language === 'hi' ? 'क्रिप्टोग्राफिक ब्लॉकचेन निरीक्षक' : 'Cryptographic Block Ledger Chain'}
            </h3>
            <p className="text-xs text-[#52796F]">
              Inspecting chronological SHA-256 state sequence:
            </p>
          </div>
          <button
            onClick={() => setCurrentView('worker')}
            className="text-xs font-semibold text-[#1B4332] hover:underline flex items-center gap-1"
          >
            <span>View Worker Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3 pt-2">
          {records.map((r, idx) => (
            <div
              key={r.id}
              className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                r.isTampered
                  ? 'bg-red-50/70 border-red-300'
                  : 'bg-[#FAF9F5] border-[#E3E0D8]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#123524]">
                    BLOCK #{records.length - idx}
                  </span>
                  <span className="text-[#52796F] font-mono">[{r.id}]</span>
                  <span className="font-semibold text-[#1A2421]">{r.date}</span>
                </div>
                <div>
                  {r.isTampered ? (
                    <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                      TAMPERED — HASH MISMATCH
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      VALID SHA-256
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-white p-2 rounded border border-[#CCD8D0] truncate">
                  <span className="text-[#8EA89D]">Prev Hash: </span>
                  <span className="text-[#52796F]">{r.previousHash}</span>
                </div>
                <div className={`p-2 rounded border truncate ${r.isTampered ? 'bg-red-100/50 border-red-300 text-red-900 font-bold' : 'bg-white border-[#CCD8D0] text-[#1B4332]'}`}>
                  <span className="text-[#8EA89D]">Block Hash: </span>
                  <span>{r.hash}</span>
                </div>
              </div>

              {r.modificationReason && (
                <div className="p-2 bg-purple-50 text-purple-900 rounded border border-purple-200 text-[11px]">
                  <strong>Audit Log Note:</strong> {r.modificationReason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
