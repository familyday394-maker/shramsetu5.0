import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  QrCode,
  Radio,
  Printer,
  Share2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
  Award
} from 'lucide-react';
import { NfcTapSimulatorModal } from '../components/NfcTapSimulatorModal';

export const DigitalPassPage: React.FC = () => {
  const { worker, skills, language } = useApp();
  const [isNfcModalOpen, setNfcModalOpen] = useState(false);
  const [isQrPreviewOpen, setQrPreviewOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Title & Explanation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#E06D53] uppercase tracking-wider">
            {language === 'hi' ? 'गोपनीयता-अनुकूल डिजिटल पहचान' : 'Privacy-Preserving Worker Credential'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi' ? 'डिजिटल वर्क पास एवं कार्य साख' : 'Digital Work Pass (Shram Pass)'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F] mt-1">
            {language === 'hi'
              ? 'बिना आधार अथवा संवेदनशील निजी विवरण उजागर किए कार्य अनुभव एवं दर का सुरक्षित सत्यापन।'
              : 'Enables daily-wage workers to prove craft reliability without exposing Aadhaar or personal bank data.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNfcModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Radio className="w-4 h-4 text-[#88D49E]" />
            <span>{language === 'hi' ? 'NFC टैप सिमुलेशन' : 'Simulate NFC Tap'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-xl transition-colors flex items-center gap-1.5"
            title="Print card layout"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* The Physical / Digital Pass Smart Card (Dignified Indian Design) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pass Graphic Card */}
        <div className="lg:col-span-7">
          <div className="bg-gradient-to-br from-[#123524] via-[#1B4332] to-[#2D6A4F] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#3D8B68] relative overflow-hidden">
            {/* Top Bar of Card */}
            <div className="flex justify-between items-start pb-6 border-b border-white/20">
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
                  <span>VERIFIED</span>
                </span>
                <span className="text-[10px] text-[#C5D6BF] block mt-1 font-mono">
                  13.56 MHz NFC
                </span>
              </div>
            </div>

            {/* Middle Section: Worker details & QR */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-2 space-y-3">
                <div>
                  <span className="text-[10px] text-[#A3B899] uppercase tracking-wider block font-mono">
                    WORKER NAME / श्रमिक नाम
                  </span>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    {worker.name}
                  </h3>
                  <span className="text-xs text-[#C5D6BF] font-medium">{worker.hindiName}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#A3B899] block uppercase font-mono">TRADE</span>
                    <span className="font-bold text-[#E8EFEA]">{worker.trade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A3B899] block uppercase font-mono">STANDARD RATE</span>
                    <span className="font-mono font-bold text-emerald-300">₹{worker.dailyRateAgreed}/day</span>
                  </div>
                </div>

                <div className="text-xs space-y-0.5">
                  <span className="text-[10px] text-[#A3B899] block uppercase font-mono">PRIMARY HUB CHOWK</span>
                  <span className="text-[#C5D6BF] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E06D53]" />
                    {worker.hubChowk}
                  </span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-[#123524] shadow-md space-y-2">
                <QrCode className="w-24 h-24 text-[#123524]" />
                <button
                  onClick={() => setQrPreviewOpen(true)}
                  className="text-[10px] font-bold text-[#1B4332] hover:underline flex items-center gap-1 uppercase"
                >
                  <span>Scan Preview</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Bottom Bar: Unique ID & Cryptographic checksum */}
            <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-[#A3B899]">
              <div>
                <span>ID: </span>
                <strong className="text-white">{worker.id}</strong>
                <span className="mx-2">·</span>
                <span>NFC: </span>
                <strong className="text-[#E8EFEA]">{worker.nfcTagId}</strong>
              </div>
              <div className="text-[9px] text-[#C5D6BF] truncate max-w-[200px]">
                {worker.cryptoChecksum}
              </div>
            </div>
          </div>

          {/* Prototype Honesty Notice */}
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-[#805B10] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#805B10] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold">Bal Vigyan Evaluation Notice:</span> This digital pass strictly prohibits the storage of Indian national identity numbers (Aadhaar). All credentials use pseudonymized worker IDs (`MP-IND-2026-WM842`) and cryptographic hashes. NFC scanning in desktop browsers is emulated to demonstrate field feasibility.
            </p>
          </div>
        </div>

        {/* Right Column: Pass Statistics & Verified Endorsements */}
        <div className="lg:col-span-5 space-y-6">
          {/* Key Metrics */}
          <div className="bg-white rounded-2xl p-6 border border-[#E3E0D8] shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#123524] uppercase tracking-wider">
              {language === 'hi' ? 'सत्यापित कार्य इतिहास सारांश' : 'Verified Work Experience'}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EAE8E0]">
                <span className="text-[10px] text-[#52796F] uppercase block font-medium">TOTAL COMPLETED SITES</span>
                <span className="font-mono text-xl font-bold text-[#123524] block mt-0.5">
                  {worker.completedSites} Projects
                </span>
                <span className="text-[10px] text-[#2D6A4F] block">Across Indore District</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EAE8E0]">
                <span className="text-[10px] text-[#52796F] uppercase block font-medium">ATTENDANCE RELIABILITY</span>
                <span className="font-mono text-xl font-bold text-[#2D6A4F] block mt-0.5">
                  {worker.attendanceRate}%
                </span>
                <span className="text-[10px] text-[#52796F] block">Zero unexcused dropouts</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EAE8E0]">
                <span className="text-[10px] text-[#52796F] uppercase block font-medium">DOCUMENTED EXPERIENCE</span>
                <span className="font-mono text-xl font-bold text-[#123524] block mt-0.5">
                  48 Months
                </span>
                <span className="text-[10px] text-[#52796F] block">Since Feb 2024</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EAE8E0]">
                <span className="text-[10px] text-[#52796F] uppercase block font-medium">DISPUTE RESOLUTION RATE</span>
                <span className="font-mono text-xl font-bold text-[#123524] block mt-0.5">
                  100%
                </span>
                <span className="text-[10px] text-[#2D6A4F] block">Via digital evidence logs</span>
              </div>
            </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FAF9F5] rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#D5D2C8] shadow-2xl text-center">
            <div className="w-12 h-12 bg-emerald-100 text-[#1B4332] rounded-full mx-auto flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#123524]">
              {language === 'hi' ? 'क्यूआर स्कैन परिणाम (ठेकेदार दृश्य)' : 'Public QR Scan Verification'}
            </h3>
            <p className="text-xs text-[#52796F]">
              What a new contractor sees when scanning Ramesh Verma’s QR card on site:
            </p>
            <div className="bg-white p-4 rounded-xl border border-[#E3E0D8] text-left text-xs space-y-1.5 font-mono">
              <div className="text-emerald-700 font-bold">✓ PASS AUTHENTICATED</div>
              <div>Name: {worker.name}</div>
              <div>ID: {worker.id}</div>
              <div>Trade: {worker.trade}</div>
              <div>Standard Rate: ₹{worker.dailyRateAgreed}/day</div>
              <div>Attendance Reliability: 96.4%</div>
              <div className="text-[10px] text-slate-500 pt-1">
                Zero sensitive Aadhaar or personal bank numbers stored.
              </div>
            </div>
            <button
              onClick={() => setQrPreviewOpen(false)}
              className="w-full py-2 text-xs font-semibold text-white bg-[#1B4332] rounded-lg"
            >
              {language === 'hi' ? 'वापस जाएं' : 'Done'}
            </button>
          </div>
        </div>
      )}

      {/* NFC Simulator Modal */}
      <NfcTapSimulatorModal
        isOpen={isNfcModalOpen}
        onClose={() => setNfcModalOpen(false)}
      />
    </div>
  );
};
