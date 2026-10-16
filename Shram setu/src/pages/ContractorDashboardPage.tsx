import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building,
  Users,
  Download,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
  Send,
  ArrowUpRight
} from 'lucide-react';
import { OTHER_DEMO_WORKERS } from '../data/mockData';

export const ContractorDashboardPage: React.FC = () => {
  const {
    contractor,
    records,
    worker,
    contractorDisbursePayment,
    language,
    setCurrentView,
  } = useApp();

  const [activeSiteTab, setActiveSiteTab] = useState<string>('all');
  const [paymentInputRecordId, setPaymentInputRecordId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(150);

  // Filter records
  const displayRecords = records.filter(r => {
    if (activeSiteTab === 'all') return true;
    return r.siteName.toLowerCase().includes(activeSiteTab.toLowerCase());
  });

  const totalOutstandingContractor = records.reduce((sum, r) => sum + r.balanceDue, 0);

  const handleDisbursePayment = (recordId: string) => {
    if (paymentAmount <= 0) return;
    contractorDisbursePayment(recordId, paymentAmount);
    setPaymentInputRecordId(null);
  };

  const handleExportCSV = () => {
    const headers = "Record_ID,Date,Worker_Name,Worker_ID,Site_Name,Trade,Hours,Agreed_Rate,Earned_Wage,Paid_Amount,Balance_Due,Status\n";
    const rows = records.map(r =>
      `"${r.id}","${r.date}","${worker.name}","${worker.id}","${r.siteName}","${r.tradeRole}",${r.shiftHours},${r.agreedDailyRate},${r.earnedWage},${r.paidAmount},${r.balanceDue},"${r.status}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShramSetu_MusterRoll_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Contractor Top Profile Bar */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#123524] text-white flex items-center justify-center font-bold text-xl shadow-sm">
            <Building className="w-7 h-7 text-[#88D49E]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#123524]">
                {contractor.firmName}
              </h1>
              <span className="font-mono text-xs text-[#52796F] bg-[#E8EFEA] px-2 py-0.5 rounded">
                Reg: {contractor.regNumber}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#52796F] flex-wrap">
              <span>{contractor.representative}</span>
              <span aria-hidden="true">·</span>
              <span>{contractor.location}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#1B4332]">{contractor.contact}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-initial px-4 py-2.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'hi' ? 'मस्टर रोल CSV डाउनलोड' : 'Export Muster CSV'}</span>
          </button>
        </div>
      </div>

      {/* Contractor Active Workers Roster Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#123524] uppercase tracking-wider">
          {language === 'hi' ? 'साइट पर पंजीकृत सक्रिय कारीगर' : 'Active Registered Workers on Roster'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OTHER_DEMO_WORKERS.map(w => (
            <div key={w.id} className="bg-white p-4 rounded-xl border border-[#E3E0D8] space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-[#123524] block">{w.name}</span>
                  <span className="text-[11px] text-[#52796F] block">{w.hindiName}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {w.attendanceRate}% Att.
                </span>
              </div>
              <div className="text-xs space-y-0.5 text-[#354F52]">
                <div className="font-medium text-[#1A2421]">{w.trade}</div>
                <div className="text-[11px] font-mono">Agreed: ₹{w.dailyRateAgreed}/day</div>
                <div className="text-[10px] text-[#8EA89D] truncate">Hub: {w.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Muster Roll & Payment Disbursements */}
      <div className="bg-white rounded-2xl border border-[#E3E0D8] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E3E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#123524]">
              {language === 'hi' ? 'ठेकेदार मस्टर रोल एवं मजदूरी भुगतान खाता' : 'Project Muster Roll & Wage Disbursements'}
            </h2>
            <p className="text-xs text-[#52796F]">
              {language === 'hi'
                ? 'श्रमिकों द्वारा दर्ज कार्य की पुष्टि करें एवं बकाया राशि का भुगतान दर्ज करें।'
                : 'Confirm shift logs, disburse cash advances, and record formal payment receipts.'}
            </p>
          </div>

          {/* Site tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F4F3EE] rounded-lg text-xs font-medium self-stretch sm:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveSiteTab('all')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeSiteTab === 'all' ? 'bg-white text-[#123524] shadow-sm font-semibold' : 'text-[#52796F] hover:text-[#123524]'
              }`}
            >
              All Sites
            </button>
            <button
              onClick={() => setActiveSiteTab('Vijay Nagar')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeSiteTab === 'Vijay Nagar' ? 'bg-white text-[#123524] shadow-sm font-semibold' : 'text-[#52796F] hover:text-[#123524]'
              }`}
            >
              Vijay Nagar
            </button>
            <button
              onClick={() => setActiveSiteTab('Palasia')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeSiteTab === 'Palasia' ? 'bg-white text-[#123524] shadow-sm font-semibold' : 'text-[#52796F] hover:text-[#123524]'
              }`}
            >
              Palasia
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] text-[#405D53] border-b border-[#E3E0D8] font-semibold">
                <th className="py-3 px-4">Shift Date &amp; Site</th>
                <th className="py-3 px-4">Worker &amp; Trade</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Agreed Rate</th>
                <th className="py-3 px-4">Earned</th>
                <th className="py-3 px-4">Paid Cash</th>
                <th className="py-3 px-4">Pending Due</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Disburse Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8E0] text-[#1A2421]">
              {displayRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold block text-[#123524]">{rec.date}</span>
                    <span className="text-[11px] text-[#52796F] truncate max-w-[180px] block">{rec.siteName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold block">{worker.name}</span>
                    <span className="text-[11px] text-[#52796F]">{rec.tradeRole}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {rec.shiftHours} hrs {rec.overtimeHours > 0 ? `(+${rec.overtimeHours}h OT)` : ''}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    ₹{rec.agreedDailyRate}
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
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Approved</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {rec.balanceDue > 0 ? (
                      paymentInputRecordId === rec.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            min="10"
                            max={rec.balanceDue}
                            value={paymentAmount}
                            onChange={e => setPaymentAmount(Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-xs border border-[#CCD8D0] rounded font-mono"
                          />
                          <button
                            onClick={() => handleDisbursePayment(rec.id)}
                            className="px-2 py-1 text-[11px] font-bold text-white bg-[#1B4332] rounded hover:bg-[#123524]"
                          >
                            Pay
                          </button>
                          <button
                            onClick={() => setPaymentInputRecordId(null)}
                            className="px-1 text-slate-400 hover:text-slate-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setPaymentInputRecordId(rec.id);
                            setPaymentAmount(rec.balanceDue);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded transition-colors whitespace-nowrap"
                        >
                          Disburse ₹{rec.balanceDue}
                        </button>
                      )
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-semibold">Settled ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit policy disclaimer for contractors */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E3E0D8] text-[11px] text-[#52796F] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
            <span>
              <strong>Zero Silent Edits Policy:</strong> Any changes made to past shift hours or wage rates require written reasons and are permanently visible in the worker’s change log.
            </span>
          </div>
          <button
            onClick={() => setCurrentView('audit')}
            className="text-[#1B4332] font-semibold hover:underline"
          >
            Inspect Audit Log →
          </button>
        </div>
      </div>
    </div>
  );
};
