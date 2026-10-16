import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Clock, IndianRupee, MapPin, Building, ShieldAlert, Check } from 'lucide-react';

export const ShiftRecorderModal: React.FC = () => {
  const { isShiftModalOpen, setShiftModalOpen, addWorkRecord, worker, language } = useApp();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [siteName, setSiteName] = useState('Super Corridor IT Park Phase-2');
  const [siteLocation, setSiteLocation] = useState('Super Corridor Road, Indore');
  const [contractorName, setContractorName] = useState('M/s Sharma Infra Pvt Ltd');
  const [contractorPhone, setContractorPhone] = useState('+91 98930 11223');
  const [tradeRole, setTradeRole] = useState(worker.trade);
  const [shiftHours, setShiftHours] = useState(8);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [agreedDailyRate, setAgreedDailyRate] = useState(worker.dailyRateAgreed);
  const [overtimeRate, setOvertimeRate] = useState(100);
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState('');

  if (!isShiftModalOpen) return null;

  const earnedWage = Number(agreedDailyRate) + (Number(overtimeHours) * Number(overtimeRate));
  const remainingBalance = Math.max(0, earnedWage - Number(paidAmount));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkRecord({
      date,
      siteName,
      siteLocation,
      contractorName,
      contractorPhone,
      tradeRole,
      shiftHours: Number(shiftHours),
      overtimeHours: Number(overtimeHours),
      agreedDailyRate: Number(agreedDailyRate),
      overtimeRate: Number(overtimeRate),
      paidAmount: Number(paidAmount),
      status: Number(paidAmount) >= earnedWage ? 'verified' : 'pending_approval',
      notes: notes.trim() || 'Shift recorded via Shram Setu 2.0 digital check-in terminal.',
    });
    setShiftModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FAF9F5] rounded-2xl max-w-xl w-full border border-[#D5D2C8] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#123524] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center font-bold text-sm">
              +
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === 'hi' ? 'नई शिफ्ट व मजदूरी दर्ज करें' : 'Record Shift & Agreed Wage'}
              </h3>
              <p className="text-xs text-[#A3B899]">
                {language === 'hi' ? 'श्रमिक: ' + worker.hindiName : 'Worker: ' + worker.name} ({worker.id})
              </p>
            </div>
          </div>
          <button
            onClick={() => setShiftModalOpen(false)}
            className="p-1 rounded-lg text-[#A3B899] hover:text-white hover:bg-[#1B4332] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A2421] mb-1">
                {language === 'hi' ? 'कार्य दिनांक' : 'Shift Date'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#D5D2C8] bg-white text-[#1A2421] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A2421] mb-1">
                {language === 'hi' ? 'कार्य श्रेणी (ट्रेड)' : 'Trade Role'}
              </label>
              <input
                type="text"
                required
                value={tradeRole}
                onChange={e => setTradeRole(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#D5D2C8] bg-white text-[#1A2421] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A2421] mb-1">
                {language === 'hi' ? 'साइट का नाम' : 'Construction Site'}
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                placeholder="e.g. Vijay Nagar Metro Station"
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#D5D2C8] bg-white text-[#1A2421] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A2421] mb-1">
                {language === 'hi' ? 'साइट स्थान (इंदौर)' : 'Site Location (Indore)'}
              </label>
              <input
                type="text"
                required
                value={siteLocation}
                onChange={e => setSiteLocation(e.target.value)}
                placeholder="e.g. Super Corridor, Indore"
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#D5D2C8] bg-white text-[#1A2421] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A2421] mb-1">
                {language === 'hi' ? 'ठेकेदार / मुंशी का नाम' : 'Contractor / Supervisor'}
              </label>
              <input
                type="text"
                required
                value={contractorName}
                onChange={e => setContractorName(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#D5D2C8] bg-white text-[#1A2421] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A2421] mb-1">
                {language === 'hi' ? 'ठेकेदार फोन नंबर' : 'Contractor Phone'}
              </label>
              <input
                type="text"
                required
                value={contractorPhone}
                onChange={e => setContractorPhone(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#D5D2C8] bg-white text-[#1A2421] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
          </div>

          {/* Wage & Hours Breakdown */}
          <div className="p-4 rounded-xl bg-[#E8EFEA] border border-[#CCD8D0] space-y-3">
            <h4 className="text-xs font-bold text-[#123524] uppercase tracking-wider">
              {language === 'hi' ? 'पारदर्शी पारिश्रमिक गणना' : 'Transparent Wage Calculation'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-[#405D53] font-medium mb-1">
                  {language === 'hi' ? 'तय दिहाड़ी (₹)' : 'Agreed Daily Rate (₹)'}
                </label>
                <input
                  type="number"
                  required
                  min="200"
                  max="5000"
                  value={agreedDailyRate}
                  onChange={e => setAgreedDailyRate(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#B3C5B8] bg-white text-[#1A2421]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#405D53] font-medium mb-1">
                  {language === 'hi' ? 'शिफ्ट घंटे' : 'Shift Hours'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="16"
                  value={shiftHours}
                  onChange={e => setShiftHours(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#B3C5B8] bg-white text-[#1A2421]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#405D53] font-medium mb-1">
                  {language === 'hi' ? 'ओवर-टाइम घंटे' : 'Overtime Hours'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={overtimeHours}
                  onChange={e => setOvertimeHours(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#B3C5B8] bg-white text-[#1A2421]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#405D53] font-medium mb-1">
                  {language === 'hi' ? 'आज प्राप्त नकद (₹)' : 'Paid Today (₹)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max={earnedWage}
                  value={paidAmount}
                  onChange={e => setPaidAmount(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#B3C5B8] bg-white text-[#1A2421]"
                />
              </div>
            </div>

            {/* Live calculation banner */}
            <div className="flex items-center justify-between pt-2 border-t border-[#CCD8D0] text-xs font-semibold">
              <span className="text-[#354F52]">
                {language === 'hi' ? 'कुल अर्जित मजदूरी:' : 'Total Earned Wage:'} <span className="text-[#123524] font-bold">₹{earnedWage}</span>
              </span>
              <span className={`${remainingBalance > 0 ? 'text-[#E06D53]' : 'text-[#2D6A4F]'}`}>
                {language === 'hi' ? 'बकाया राशि:' : 'Balance Due:'} ₹{remainingBalance}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A2421] mb-1">
              {language === 'hi' ? 'कार्य विवरण / टिप्पणी' : 'Work Details / Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Wall masonry completed on 2nd floor, cement bags checked"
              className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#D5D2C8] bg-white text-[#1A2421] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShiftModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#405D53] hover:text-[#123524] hover:bg-[#EAE8E0] rounded-lg transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'hi' ? 'डिजिटल लेजर में दर्ज करें' : 'Record in Digital Ledger'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
