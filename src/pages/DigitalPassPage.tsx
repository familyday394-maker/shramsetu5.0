import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  Printer,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
  Award,
  Search,
  UserCheck,
  Lock,
  HelpCircle,
  Clock,
  ArrowRight,
  QrCode,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { WorkerProfile } from '../types';
import { createQrPayloadUrl, resolveCredentialToken } from '../utils/tokenSecurity';

export const DigitalPassPage: React.FC = () => {
  const { worker, workers, skills, language, setCurrentView, setActiveDemoRole, selectDemoWorker } = useApp();

  // QR preview modal
  const [isQrPreviewOpen, setQrPreviewOpen] = useState(false);

  // Manual ID lookup fallback state
  const [manualLookupId, setManualLookupId] = useState<string>('');
  const [searchedWorker, setSearchedWorker] = useState<WorkerProfile | null>(null);
  const [searchErrorMessage, setSearchErrorMessage] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  // Public scan verification preview state
  const [isAuthUnlocked, setIsAuthUnlocked] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  // Opaque URL for QR code (Zero sensitive Aadhaar, phone, or wage records encoded)
  const opaqueQrPayload = createQrPayloadUrl(worker.passCredentialToken || 'cpt_fallback_842');

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = manualLookupId.trim();
    if (!query) return;

    setHasSearched(true);
    const verification = resolveCredentialToken(query, workers);
    if (verification.status === 'VALID' && verification.worker) {
      const match = workers.find(w => w.id === verification.worker?.id);
      setSearchedWorker(match || null);
      setSearchErrorMessage('');
    } else {
      setSearchedWorker(null);
      setSearchErrorMessage(verification.confidentialDataNotice);
    }
  };

  const handleQuickLookup = (workerObj: WorkerProfile) => {
    setManualLookupId(workerObj.id);
    setSearchedWorker(workerObj);
    setSearchErrorMessage('');
    setHasSearched(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Title & Explanation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#1B4332] uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>{language === 'hi' ? 'गोपनीयता-अनुकूल डिजिटल पहचान' : 'Privacy-Preserving Worker Credential'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight mt-0.5">
            {language === 'hi' ? 'डिजिटल वर्क पास एवं क्यूआर पहचान' : 'Digital Work Pass & Printable QR'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F] mt-1 max-w-3xl leading-relaxed">
            {language === 'hi'
              ? 'बिना आधार अथवा संवेदनशील निजी बैंक विवरण उजागर किए कार्य साख व दर का सुरक्षित सत्यापन।'
              : 'Enables daily-wage artisans to prove craft trade reliability using opaque, cryptographically random tokens without exposing Aadhaar numbers or personal wage history.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-xl transition-colors flex items-center gap-1.5 shadow-sm min-h-[40px]"
            title="Print laminated card layout"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? 'प्रिंट पास कार्ड' : 'Print Pass Card'}</span>
          </button>
        </div>
      </div>

      {/* The Physical / Digital Pass Smart Card (Dignified Design) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pass Graphic Card */}
        <div className="lg:col-span-7">
          <div className="bg-gradient-to-br from-[#123524] via-[#1B4332] to-[#2D6A4F] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#3D8B68] relative overflow-hidden print:border-black print:text-black print:bg-none">
            {/* Top Bar of Card */}
            <div className="flex justify-between items-start pb-5 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#123524] flex items-center justify-center font-black text-xl shadow-sm">
                  श
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-wide block">
                    SHRAM SETU 2.0
                  </span>
                  <span className="text-[10px] text-[#A3B899] uppercase tracking-wider block font-mono">
                    Senior Bal Vigyan Prototype · Indore MP
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VERIFIED PASS</span>
                </span>
                <span className="text-[10px] text-[#C5D6BF] block mt-1 font-mono">
                  OPAQUE-TOKEN REF
                </span>
              </div>
            </div>

            {/* Middle Section: Worker details & SVG QR */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-2 space-y-3">
                <div>
                  <span className="text-[10px] text-[#A3B899] uppercase tracking-wider block font-mono">
                    WORKER NAME / श्रमिक नाम
                  </span>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    {worker.name}
                  </h2>
                  <span className="text-xs text-[#C5D6BF] font-medium">{worker.hindiName}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#A3B899] block uppercase font-mono">TRADE</span>
                    <span className="font-bold text-[#E8EFEA]">{worker.trade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A3B899] block uppercase font-mono">AGREED DAILY RATE</span>
                    <span className="font-mono font-bold text-emerald-300">₹{worker.dailyRateAgreed}/day</span>
                  </div>
                </div>

                <div className="text-xs space-y-0.5">
                  <span className="text-[10px] text-[#A3B899] block uppercase font-mono">PRIMARY CHOWK</span>
                  <span className="text-[#C5D6BF] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E06D53]" />
                    {worker.hubChowk}
                  </span>
                </div>
              </div>

              {/* Crisp Printable SVG QR Code Container */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-[#123524] shadow-md space-y-2">
                <div className="p-1 bg-white rounded-lg">
                  <QRCodeSVG
                    value={opaqueQrPayload}
                    size={96}
                    level="M"
                    includeMargin={false}
                    aria-label={`Printable QR Code for Worker ${worker.id}`}
                  />
                </div>
                <button
                  onClick={() => {
                    setIsAuthUnlocked(false);
                    setQrPreviewOpen(true);
                  }}
                  className="text-[10px] font-bold text-[#1B4332] hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                >
                  <span>Scan Preview</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Bottom Bar: Unique ID & Opaque Token Reference */}
            <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-[#A3B899]">
              <div>
                <span>WORKER ID: </span>
                <strong className="text-white text-xs">{worker.id}</strong>
              </div>
              <div className="text-[9px] text-[#C5D6BF] truncate max-w-[220px]" title={worker.passCredentialToken}>
                Token: {worker.passCredentialToken ? `${worker.passCredentialToken.slice(0, 16)}...` : 'cpt_842'}
              </div>
            </div>
          </div>

          {/* Explicit QR & Credential Limitation Notice (Prompt 3 requirement) */}
          <div className="mt-4 p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-[#805B10] space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Plain-Language Identification Disclosures</span>
            </div>
            <ul className="space-y-1.5 text-[11px] leading-relaxed list-disc pl-4 text-[#805B10]">
              <li><strong>Physical Presence:</strong> QR identification is not proof of physical presence at a job site.</li>
              <li><strong>Government Identity:</strong> QR identification is not government-issued or legally binding identity verification (does not replace Aadhaar, e-Shram, or statutory KYC).</li>
              <li><strong>External Trust Anchor:</strong> The demonstration system does not guarantee identity without an authoritative external trust anchor.</li>
              <li><strong>Confidentiality Protection:</strong> Zero Aadhaar numbers, personal phone numbers, or private wage logs are encoded in the printable QR payload.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Manual Worker ID Lookup Fallback & Statistics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Manual ID Lookup Fallback Tool */}
          <div className="bg-white rounded-2xl p-6 border border-[#E3E0D8] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#1B4332]" />
              <h3 className="font-bold text-sm text-[#123524] uppercase tracking-wider">
                {language === 'hi' ? 'मैनुअल आईडी खोज (स्कैन न होने पर)' : 'Manual Worker ID Lookup Fallback'}
              </h3>
            </div>
            <p className="text-xs text-[#52796F]">
              If a camera or QR scanner is unavailable, enter any worker ID directly to verify public credentials:
            </p>

            <form onSubmit={handleManualSearch} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. MP-IND-2026-WM842"
                  value={manualLookupId}
                  onChange={e => setManualLookupId(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#D5D2C8] bg-white font-mono uppercase focus:border-[#1B4332] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
              </div>

              {/* Quick Select Buttons */}
              <div className="text-[11px] text-[#52796F] space-y-1">
                <span className="block font-medium">Quick Test Synthetic IDs:</span>
                <div className="flex flex-wrap gap-1.5">
                  {workers.slice(0, 4).map(w => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleQuickLookup(w)}
                      className="px-2 py-0.5 rounded bg-[#FAF9F5] hover:bg-[#E8EFEA] border border-[#E3E0D8] text-[10px] font-mono cursor-pointer"
                    >
                      {w.name.split(' ')[0]} ({w.id.slice(-5)})
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Search Result Display (Non-confidential public view) */}
            {hasSearched && (
              <div className="mt-3 p-3.5 rounded-xl border text-xs animate-fadeIn">
                {searchedWorker ? (
                  <div className="space-y-2 bg-[#FAF9F5] p-3 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#123524] text-sm">{searchedWorker.name}</span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Public Credential Valid</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#354F52]">
                      <div>
                        <span className="text-[#52796F] block text-[10px]">Trade:</span>
                        <strong>{searchedWorker.trade}</strong>
                      </div>
                      <div>
                        <span className="text-[#52796F] block text-[10px]">Agreed Rate:</span>
                        <strong className="text-emerald-700">₹{searchedWorker.dailyRateAgreed}/day</strong>
                      </div>
                      <div>
                        <span className="text-[#52796F] block text-[10px]">Primary Chowk:</span>
                        <span>{searchedWorker.hubChowk}</span>
                      </div>
                      <div>
                        <span className="text-[#52796F] block text-[10px]">Sites Completed:</span>
                        <span>{searchedWorker.completedSites} sites</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E3E0D8] flex flex-col gap-2">
                      <div className="text-[10px] text-[#52796F] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#52796F]" />
                        <span>Confidential wage records locked. Separate role authorization required.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          selectDemoWorker(searchedWorker.id);
                          setCurrentView('worker');
                        }}
                        className="w-full py-1.5 px-3 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Inspect {searchedWorker.name.split(' ')[0]}'s Wage Ledger (Role Authorization)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 text-red-800 rounded-lg border border-red-200 text-left space-y-1">
                    <div className="font-semibold text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-700" />
                      <span>Lookup Rejected</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {searchErrorMessage || `No registered credential found for reference "${manualLookupId}". Check for typos or register at chowk office.`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Verified Skills Stack */}
          <div className="bg-white rounded-2xl p-6 border border-[#E3E0D8] shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#123524] uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'hi' ? 'सत्यापित कौशल दक्षताएं' : 'Certified Craft Competencies'}</span>
              <Award className="w-4 h-4 text-[#E06D53]" />
            </h3>

            <div className="space-y-2.5">
              {skills.slice(0, 3).map(skill => (
                <div key={skill.id} className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EAE8E0] text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-[#123524] block">{skill.skillName}</span>
                      <span className="text-[11px] text-[#52796F] block">{skill.skillHindi}</span>
                    </div>
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
                      ★ {skill.rating}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#6B8177]">
                    <span>{skill.verifiedHours} hrs logged</span>
                    <span>·</span>
                    <span className="truncate max-w-[150px]">Endorsed by {skill.endorsedByContractor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Scan Simulator Modal */}
      {isQrPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#E3E0D8] shadow-2xl text-center">
            <div className="w-12 h-12 bg-[#E8EFEA] text-[#1B4332] rounded-full mx-auto flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#123524]">
                {language === 'hi' ? 'सार्वजनिक क्यूआर सत्यापन परिणाम' : 'Public QR Credential Verification'}
              </h3>
              <p className="text-xs text-[#52796F] mt-0.5">
                What any site supervisor, labor contractor, or public evaluator sees upon scanning:
              </p>
            </div>

            {/* Resolved Public View */}
            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E3E0D8] text-left text-xs space-y-2.5 font-mono">
              <div className="text-emerald-700 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PASS AUTHENTICATED</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">DEMO PASS</span>
              </div>

              <div className="space-y-1 text-xs">
                <div><span className="text-[#52796F]">Worker:</span> {worker.name}</div>
                <div><span className="text-[#52796F]">Trade:</span> {worker.trade}</div>
                <div><span className="text-[#52796F]">Primary Chowk:</span> {worker.hubChowk}</div>
                <div><span className="text-[#52796F]">Registration:</span> {worker.joinedDate}</div>
              </div>

              {/* Explicit Privacy Lock Notice */}
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-[#805B10] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Confidential Records Protected</span>
                </div>
                <p className="leading-relaxed">
                  Confidential wage histories, itemized deductions, and bank numbers are NOT accessible in this public scan view. Access requires authorized contractor or worker demonstration login.
                </p>
              </div>

              <div className="text-[10px] text-[#52796F] pt-1.5 border-t border-[#E3E0D8]">
                <div className="truncate">Payload: {opaqueQrPayload}</div>
                <div className="text-emerald-700 mt-0.5 font-semibold">
                  ✓ Verified: Zero Aadhaar or confidential wage logs exposed.
                </div>
              </div>
            </div>

            {/* Authorized View Simulation Gate */}
            {!isAuthUnlocked ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="text-[11px] text-slate-700 font-medium">
                  Test Authorization Gate: Are you the assigned contractor or the worker?
                </div>
                <button
                  onClick={() => setIsAuthUnlocked(true)}
                  className="w-full py-2 text-xs font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>[Simulate Authorized Contractor Unlock]</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 text-left animate-fadeIn">
                <div className="text-emerald-900 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Authorized Session Active</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Worker agreed daily rate: ₹{worker.dailyRateAgreed}/day. You may now inspect full wage breakdown in the Worker Portal or Contractor Muster.
                </p>
                <button
                  onClick={() => {
                    setQrPreviewOpen(false);
                    setCurrentView('worker');
                  }}
                  className="w-full py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span>Open Full Wage Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => setQrPreviewOpen(false)}
              className="w-full py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg transition-colors min-h-[38px] cursor-pointer"
            >
              {language === 'hi' ? 'वापस जाएं' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
