import React, { useState } from 'react';
import { useApp, DemoRole } from '../context/AppContext';
import {
  X,
  User,
  Building,
  ShieldCheck,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const DemoEntryModal: React.FC = () => {
  const {
    isDemoEntryModalOpen,
    setDemoEntryModalOpen,
    activeDemoRole,
    setActiveDemoRole,
    workers,
    worker,
    selectDemoWorker,
    addDemoWorker,
    setCurrentView,
    language,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'roles' | 'add_worker'>('roles');

  // Manual worker form state
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerHindiName, setNewWorkerHindiName] = useState('');
  const [newWorkerTrade, setNewWorkerTrade] = useState('Senior Mason / Bricklayer');
  const [newWorkerDailyRate, setNewWorkerDailyRate] = useState<number>(650);
  const [newWorkerChowk, setNewWorkerChowk] = useState('Geeta Bhawan Labor Chowk');
  const [newWorkerPhone, setNewWorkerPhone] = useState('+91 98260 •••••');
  const [formSuccess, setFormSuccess] = useState(false);

  if (!isDemoEntryModalOpen) return null;

  const handleSelectRole = (role: DemoRole) => {
    setActiveDemoRole(role);
    if (role === 'worker') setCurrentView('worker');
    if (role === 'contractor') setCurrentView('contractor');
    if (role === 'auditor') setCurrentView('audit');
    setDemoEntryModalOpen(false);
  };

  const handleSelectWorker = (workerId: string) => {
    selectDemoWorker(workerId);
    setActiveDemoRole('worker');
    setCurrentView('worker');
    setDemoEntryModalOpen(false);
  };

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName.trim()) return;

    addDemoWorker({
      name: newWorkerName.trim(),
      hindiName: newWorkerHindiName.trim() || newWorkerName.trim(),
      trade: newWorkerTrade,
      dailyRateAgreed: newWorkerDailyRate,
      hubChowk: newWorkerChowk,
      phoneMasked: newWorkerPhone,
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('roles');
      setCurrentView('worker');
      setDemoEntryModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#E3E0D8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-[#123524] text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1B4332] text-emerald-300 border border-[#2D6A4F]">
                Demonstration Access Control
              </span>
              <span className="text-xs text-[#C5D6BF]">• Academic Prototype</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'hi' ? 'डेमो भूमिका एवं श्रमिक चयन' : 'Demonstration Role & Worker Selection'}
            </h2>
            <p className="text-xs text-[#C5D6BF] max-w-lg">
              {language === 'hi'
                ? 'यह प्रणाली केवल स्थानीय प्रदर्शन हेतु है। कोई वास्तविक बैकएंड या प्रमाणीकरण सर्वर सक्रिय नहीं है।'
                : 'Select an authorized simulation role or preloaded synthetic worker profile to test portal workflows.'}
            </p>
          </div>

          <button
            onClick={() => setDemoEntryModalOpen(false)}
            className="p-1.5 text-[#C5D6BF] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Honesty Notice */}
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-xs text-[#805B10] flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="text-[11px] leading-relaxed">
            <strong>Architecture Notice:</strong> Real user registration, OAuth login, and server-side authentication have not yet been implemented in this competition prototype. Data persists locally in your browser.
          </span>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-[#E3E0D8] px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'roles'
                ? 'border-[#1B4332] text-[#1B4332]'
                : 'border-transparent text-[#52796F] hover:text-[#123524]'
            }`}
          >
            {language === 'hi' ? 'डेमो भूमिकाएं एवं श्रमिक' : 'Demonstration Roles & Synthetic Workers'}
          </button>
          <button
            onClick={() => setActiveTab('add_worker')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'add_worker'
                ? 'border-[#1B4332] text-[#1B4332]'
                : 'border-transparent text-[#52796F] hover:text-[#123524]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'नया डेमो श्रमिक जोड़ें' : 'Create New Demo Worker'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'roles' ? (
            <div className="space-y-6">
              {/* 3 Core Demonstration Paths */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#123524] mb-3">
                  Choose Demonstration Path:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Path 1: Worker */}
                  <div
                    onClick={() => handleSelectRole('worker')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      activeDemoRole === 'worker'
                        ? 'bg-[#E8EFEA] border-[#1B4332] ring-1 ring-[#1B4332]'
                        : 'bg-white border-[#E3E0D8] hover:border-[#1B4332]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#1B4332] text-white flex items-center justify-center mb-2">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-sm text-[#123524]">Enter as Worker</div>
                    <p className="text-[11px] text-[#52796F] mt-1 leading-relaxed">
                      Inspect personal wage slips, unconfirmed advances, and raise mediation claims.
                    </p>
                    <div className="mt-3 text-[10px] text-[#1B4332] font-semibold flex items-center gap-1">
                      <span>Open Worker Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Path 2: Contractor */}
                  <div
                    onClick={() => handleSelectRole('contractor')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      activeDemoRole === 'contractor'
                        ? 'bg-[#E8EFEA] border-[#1B4332] ring-1 ring-[#1B4332]'
                        : 'bg-white border-[#E3E0D8] hover:border-[#1B4332]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#123524] text-white flex items-center justify-center mb-2">
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-sm text-[#123524]">Enter as Contractor</div>
                    <p className="text-[11px] text-[#52796F] mt-1 leading-relaxed">
                      Manage site muster, record cash disbursements, and export signed muster rolls.
                    </p>
                    <div className="mt-3 text-[10px] text-[#1B4332] font-semibold flex items-center gap-1">
                      <span>Open Contractor Desk</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Path 3: Auditor / Judge */}
                  <div
                    onClick={() => handleSelectRole('auditor')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      activeDemoRole === 'auditor'
                        ? 'bg-[#E8EFEA] border-[#1B4332] ring-1 ring-[#1B4332]'
                        : 'bg-white border-[#E3E0D8] hover:border-[#1B4332]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#C94A29] text-white flex items-center justify-center mb-2">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-sm text-[#123524]">Enter as Auditor / Judge</div>
                    <p className="text-[11px] text-[#52796F] mt-1 leading-relaxed">
                      Inspect cryptographic SHA-256 blocks, test tamper detection, and verify rules.
                    </p>
                    <div className="mt-3 text-[10px] text-[#C94A29] font-semibold flex items-center gap-1">
                      <span>Open Audit Test Bench</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preloaded Synthetic Workers Roster */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#123524]">
                    Select Synthetic Worker Profile ({workers.length}):
                  </h3>
                  <span className="text-[10px] text-[#52796F]">Active: <strong>{worker.name}</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {workers.map(w => (
                    <div
                      key={w.id}
                      onClick={() => handleSelectWorker(w.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        worker.id === w.id
                          ? 'bg-[#FAF9F5] border-[#1B4332] shadow-xs ring-1 ring-[#1B4332]'
                          : 'bg-white border-[#E3E0D8] hover:border-[#CCD8D0]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-sm text-[#123524]">{w.name}</div>
                          <div className="text-[11px] text-[#52796F]">{w.hindiName}</div>
                        </div>
                        {worker.id === w.id && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-[11px] text-[#354F52] space-y-0.5">
                        <div className="font-medium text-[#1A2421]">{w.trade}</div>
                        <div className="flex justify-between text-[#52796F]">
                          <span>Rate: <strong>₹{w.dailyRateAgreed}/day</strong></span>
                          <span>Chowk: {w.hubChowk.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Manual Worker Creation Form */
            <form onSubmit={handleCreateWorker} className="space-y-4">
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E3E0D8] text-[11px] text-[#52796F]">
                Enter profile details to register a synthetic worker in your local demonstration roster.
                An opaque cryptographic credential token will be generated automatically.
              </div>

              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold">Demo worker successfully created and activated!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#123524] mb-1">
                    Worker Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kailash Solanki"
                    value={newWorkerName}
                    onChange={e => setNewWorkerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CCD8D0] bg-white focus:outline-none focus:border-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#123524] mb-1">
                    Worker Name (Hindi)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. कैलाश सोलंकी"
                    value={newWorkerHindiName}
                    onChange={e => setNewWorkerHindiName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CCD8D0] bg-white focus:outline-none focus:border-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#123524] mb-1">
                    Trade / Craft Role *
                  </label>
                  <select
                    value={newWorkerTrade}
                    onChange={e => setNewWorkerTrade(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CCD8D0] bg-white focus:outline-none focus:border-[#1B4332]"
                  >
                    <option value="Senior Mason / Bricklayer">Senior Mason / Bricklayer (वरिष्ठ राजमिस्त्री)</option>
                    <option value="Construction Helper / Beldar">Construction Helper / Beldar (सहायक / बेलदार)</option>
                    <option value="Bar Bender / Steel Fixer">Bar Bender / Steel Fixer (सरिया कारीगर)</option>
                    <option value="Shuttering Carpenter">Shuttering Carpenter (शटरिंग कारीगर)</option>
                    <option value="Tile & Marble Artisan">Tile & Marble Artisan (टाइल कारीगर)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#123524] mb-1">
                    Agreed Daily Wage Rate (₹/day) *
                  </label>
                  <input
                    type="number"
                    min="300"
                    max="1500"
                    required
                    value={newWorkerDailyRate}
                    onChange={e => setNewWorkerDailyRate(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold p-2.5 rounded-lg border border-[#CCD8D0] bg-white focus:outline-none focus:border-[#1B4332]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-[#123524] mb-1">
                    Primary Labor Chowk (Indore)
                  </label>
                  <select
                    value={newWorkerChowk}
                    onChange={e => setNewWorkerChowk(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CCD8D0] bg-white focus:outline-none focus:border-[#1B4332]"
                  >
                    <option value="Geeta Bhawan Labor Chowk">Geeta Bhawan Labor Chowk (गीता भवन चौराहा)</option>
                    <option value="Malwa Mill Labor Chowk">Malwa Mill Labor Chowk (मालवा मिल चौराहा)</option>
                    <option value="Rajwada Labor Chowk">Rajwada Labor Chowk (राजवाड़ा चौराहा)</option>
                    <option value="Bhawarkua Labor Chowk">Bhawarkua Labor Chowk (भंवरकुआ चौराहा)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE8E0]">
                <button
                  type="button"
                  onClick={() => setActiveTab('roles')}
                  className="px-4 py-2 text-xs font-semibold text-[#52796F] hover:bg-[#FAF9F5] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-xl shadow-sm transition-colors"
                >
                  Register Demo Worker
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
