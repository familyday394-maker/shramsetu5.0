import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

export const WorkerSlipModal: React.FC = () => {
  const {
    isSlipModalOpen,
    setSlipModalOpen,
    selectedSlipRecord,
    worker,
    language,
  } = useApp();

  if (!isSlipModalOpen || !selectedSlipRecord) return null;

  const rec = selectedSlipRecord;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `
========================================
SHRAM SETU 2.0 - DIGITAL WORK SLIP
डिजिटल श्रमिक कार्य पर्ची (Senior Bal Vigyan)
========================================
Voucher ID: ${rec.id}
Date: ${rec.date}
Verification Hash: ${rec.hash}

WORKER DETAILS:
Name: ${worker.name} (${worker.hindiName})
Worker ID: ${worker.id}
Trade: ${rec.tradeRole}
Hub Chowk: ${worker.hubChowk}

SITE & CONTRACTOR:
Site: ${rec.siteName}
Location: ${rec.siteLocation}
Contractor / Munshi: ${rec.contractorName}
Contact: ${rec.contractorPhone}

SHIFT BREAKDOWN:
Standard Shift: ${rec.shiftHours} Hours
Agreed Daily Rate: ₹${rec.agreedDailyRate}
Overtime Hours: ${rec.overtimeHours} Hours (₹${rec.overtimeRate}/hr)
----------------------------------------
TOTAL EARNED WAGE: ₹${rec.earnedWage}
CASH PAID TODAY:   ₹${rec.paidAmount}
BALANCE REMAINING: ₹${rec.balanceDue}
----------------------------------------
Status: ${rec.status.toUpperCase()}
Timestamp: ${new Date().toLocaleString('en-IN')}

* Organised digital record under Senior Bal Vigyan Innovation (Indore MP).
========================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ShramSetu_Slip_${rec.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FAF9F5] rounded-2xl max-w-lg w-full border border-[#D5D2C8] shadow-2xl overflow-hidden my-8">
        {/* Header toolbar */}
        <div className="bg-[#123524] text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#88D49E]" />
            <h3 className="font-bold text-sm">
              {language === 'hi' ? 'सत्यापित डिजिटल श्रमिक पर्ची' : 'Verified Digital Worker Slip'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadText}
              className="p-1.5 rounded-lg text-[#A3B899] hover:text-white hover:bg-[#1B4332] transition-colors"
              title="Download text slip"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-[#A3B899] hover:text-white hover:bg-[#1B4332] transition-colors"
              title="Print voucher"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSlipModalOpen(false)}
              className="p-1.5 rounded-lg text-[#A3B899] hover:text-white hover:bg-[#1B4332] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Slip Card itself (styled cleanly for print and screen) */}
        <div className="p-6 space-y-5 bg-[#FCFCF9]">
          {/* Slip Top Header */}
          <div className="border-b-2 border-dashed border-[#CCD8D0] pb-4 text-center">
            <div className="text-xs uppercase tracking-widest font-bold text-[#1B4332]">
              Shram Setu 2.0 · श्रम सेतु २.०
            </div>
            <h2 className="text-lg font-extrabold text-[#123524] mt-0.5">
              {language === 'hi' ? 'दैनिक उपस्थिति एवं मजदूरी पर्ची' : 'Daily Attendance & Wage Slip'}
            </h2>
            <p className="text-[11px] text-[#52796F] mt-0.5">
              {language === 'hi' ? 'कच्ची पर्ची का डिजिटल व सुरक्षित विकल्प' : 'Digital replacement for informal paper slips'}
            </p>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#F4F3EE] p-3.5 rounded-xl border border-[#E3E0D8]">
            <div>
              <span className="text-[10px] text-[#556960] uppercase block">
                {language === 'hi' ? 'श्रमिक का नाम' : 'Worker Name'}
              </span>
              <span className="font-bold text-[#123524] text-sm">
                {worker.name}
              </span>
              <span className="block text-[11px] text-[#354F52]">{worker.hindiName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#556960] uppercase block">
                {language === 'hi' ? 'श्रमिक आईडी' : 'Worker ID'}
              </span>
              <span className="font-mono font-semibold text-[#1B4332]">
                {worker.id}
              </span>
              <span className="block text-[10px] text-[#6B8177]">{worker.hubChowk}</span>
            </div>
          </div>

          {/* Site details */}
          <div className="space-y-1.5 text-xs text-[#1A2421]">
            <div className="flex justify-between py-1 border-b border-[#EAE8E0]">
              <span className="text-[#556960]">{language === 'hi' ? 'कार्य दिनांक' : 'Shift Date'}:</span>
              <span className="font-semibold">{rec.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE8E0]">
              <span className="text-[#556960]">{language === 'hi' ? 'कार्य स्थल' : 'Site Name'}:</span>
              <span className="font-semibold text-right max-w-[240px] truncate">{rec.siteName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE8E0]">
              <span className="text-[#556960]">{language === 'hi' ? 'ठेकेदार / मुंशी' : 'Contractor / Munshi'}:</span>
              <span className="font-semibold">{rec.contractorName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE8E0]">
              <span className="text-[#556960]">{language === 'hi' ? 'कार्य दायित्व' : 'Trade Role'}:</span>
              <span className="font-semibold">{rec.tradeRole}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE8E0]">
              <span className="text-[#556960]">{language === 'hi' ? 'समय एवं घंटे' : 'Hours'}:</span>
              <span className="font-mono font-semibold">{rec.shiftHours} hrs {rec.overtimeHours > 0 && `(+${rec.overtimeHours}h OT)`}</span>
            </div>
          </div>

          {/* Wage calculations block */}
          <div className="p-3.5 rounded-xl bg-[#E8EFEA] border border-[#CCD8D0] space-y-2 text-xs">
            <div className="flex justify-between text-[#354F52]">
              <span>{language === 'hi' ? 'तय दैनिक दिहाड़ी दर' : 'Agreed Daily Rate'}:</span>
              <span className="font-mono font-semibold">₹{rec.agreedDailyRate}</span>
            </div>
            {rec.overtimeHours > 0 && (
              <div className="flex justify-between text-[#354F52]">
                <span>{language === 'hi' ? 'ओवर-टाइम भुगतान' : 'Overtime Earnings'}:</span>
                <span className="font-mono font-semibold">+₹{rec.overtimeHours * rec.overtimeRate}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[#123524] pt-1 border-t border-[#B8CCC0] text-sm">
              <span>{language === 'hi' ? 'कुल अर्जित पारिश्रमिक' : 'Total Earned Wages'}:</span>
              <span className="font-mono">₹{rec.earnedWage}</span>
            </div>
            <div className="flex justify-between text-[#2D6A4F] pt-1">
              <span>{language === 'hi' ? 'प्राप्त नकद / भुगतान' : 'Paid Today'}:</span>
              <span className="font-mono font-bold">₹{rec.paidAmount}</span>
            </div>
            <div className="flex justify-between font-bold pt-1 border-t border-[#B8CCC0] text-sm">
              <span className={`${rec.balanceDue > 0 ? 'text-[#E06D53]' : 'text-[#2D6A4F]'}`}>
                {language === 'hi' ? 'शेष बकाया राशि' : 'Balance Due'}:
              </span>
              <span className={`font-mono ${rec.balanceDue > 0 ? 'text-[#E06D53]' : 'text-[#2D6A4F]'}`}>
                ₹{rec.balanceDue}
              </span>
            </div>
          </div>

          {/* Tamper-evident cryptographic barcode & hash block */}
          <div className="flex items-center gap-3 pt-2 text-[10px] text-[#556960] border-t border-[#EAE8E0]">
            <div className="w-12 h-12 bg-white p-1 rounded border border-[#CCD8D0] flex items-center justify-center shrink-0">
              <QrCode className="w-10 h-10 text-[#123524]" />
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <div className="font-mono font-semibold text-[#123524] truncate">
                Hash: {rec.hash}
              </div>
              <div className="text-[10px] text-[#6B8177]">
                Senior Bal Vigyan Cryptographic Ledger Node · Indore MP
              </div>
              <div className="text-[9px] text-[#8EA89D]">
                Verified Digital Receipt · Mutual Consent Record
              </div>
            </div>
          </div>

          {/* Print button at bottom */}
          <div className="no-print pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => setSlipModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#405D53] hover:text-[#123524] hover:bg-[#EAE8E0] rounded-lg transition-colors"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पर्ची प्रिंट करें' : 'Print Slip (Ctrl+P)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
