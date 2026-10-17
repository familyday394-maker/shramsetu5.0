import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
  User,
  QrCode,
  Building2,
  AlertTriangle,
  FileCheck2,
  Award,
  GraduationCap,
  Database,
  Smartphone,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    language,
    toggleLanguage,
    resetDemoData,
    activeJudgeTourStep,
    setActiveJudgeTourStep,
    activeDemoRole,
    worker,
    setDemoEntryModalOpen,
    setStorageModalOpen,
    setApprovalsModalOpen,
    approvalRequests,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [showResetFeedback, setShowResetFeedback] = useState(false);

  const pendingApprovalsCount = approvalRequests.filter(r => r.status === 'simulated_pending').length;

  const handleReset = () => {
    resetDemoData();
    setShowResetFeedback(true);
    setTimeout(() => setShowResetFeedback(false), 2000);
  };

  const handleNavClick = (view: 'home' | 'worker' | 'pass' | 'contractor' | 'disputes' | 'skills' | 'project' | 'audit') => {
    setCurrentView(view);
    setActiveJudgeTourStep(null);
    setIsMobileMenuOpen(false);
    setIsMoreDropdownOpen(false);
  };

  const isMoreActive = currentView === 'skills' || currentView === 'project';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E3E0D8]">
      {/* Top Architecture & Deployment Transparency Strip */}
      <div className="bg-[#123524] text-white px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] border-b border-[#1B4332]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setStorageModalOpen(true)}
            className="flex items-center gap-2 hover:text-emerald-300 transition-colors text-left group"
            title="Inspect client-side IndexedDB storage & upcoming Supabase migration details"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-200 group-hover:underline">
              Local Demo Mode (IndexedDB Active)
            </span>
            <span className="hidden md:inline text-gray-300">
              · Supabase Cloud Sync Scheduled Next Week (SQL Migrations Prepared)
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setApprovalsModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1B4332] hover:bg-[#255740] text-emerald-300 hover:text-white transition-colors border border-emerald-800"
              title="Open Simulated Cross-Device Approvals Panel"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">Simulated Approvals</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white leading-none">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single clean brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left cursor-pointer flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-lg p-1 transition-colors"
              aria-label="Shram Setu 2.0 - Go to Homepage"
            >
              <div className="w-9 h-9 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-bold text-base shadow-sm">
                श
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#123524] whitespace-nowrap">
                  Shram Setu 2.0
                </span>
                <span className="text-[11px] text-[#52796F] font-medium leading-none">
                  {language === 'hi' ? 'श्रम सेतु २.० · कार्य एवं मजदूरी लेजर' : 'Transparent Work & Wage Records'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Primary navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-[#354F52]" aria-label="Main navigation">
            <button
              onClick={() => handleNavClick('worker')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentView === 'worker'
                  ? 'bg-[#E8EFEA] text-[#123524] font-semibold'
                  : 'hover:text-[#123524] hover:bg-[#F0EEE6]'
              }`}
            >
              {language === 'hi' ? 'श्रमिक पोर्टल' : 'Worker Portal'}
            </button>

            <button
              onClick={() => handleNavClick('pass')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentView === 'pass'
                  ? 'bg-[#E8EFEA] text-[#123524] font-semibold'
                  : 'hover:text-[#123524] hover:bg-[#F0EEE6]'
              }`}
            >
              {language === 'hi' ? 'डिजिटल पास' : 'Digital Pass'}
            </button>

            <button
              onClick={() => handleNavClick('contractor')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentView === 'contractor'
                  ? 'bg-[#E8EFEA] text-[#123524] font-semibold'
                  : 'hover:text-[#123524] hover:bg-[#F0EEE6]'
              }`}
            >
              {language === 'hi' ? 'ठेकेदार' : 'Contractor'}
            </button>

            <button
              onClick={() => handleNavClick('disputes')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentView === 'disputes'
                  ? 'bg-[#E8EFEA] text-[#123524] font-semibold'
                  : 'hover:text-[#123524] hover:bg-[#F0EEE6]'
              }`}
            >
              {language === 'hi' ? 'विवाद' : 'Disputes'}
            </button>

            <button
              onClick={() => handleNavClick('audit')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentView === 'audit'
                  ? 'bg-[#E8EFEA] text-[#123524] font-semibold'
                  : 'hover:text-[#123524] hover:bg-[#F0EEE6]'
              }`}
            >
              {language === 'hi' ? 'ऑडिट जांच' : 'Audit Check'}
            </button>

            {/* Secondary navigation dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  isMoreActive
                    ? 'bg-[#E8EFEA] text-[#123524] font-semibold'
                    : 'hover:text-[#123524] hover:bg-[#F0EEE6]'
                }`}
                aria-expanded={isMoreDropdownOpen}
              >
                <span>{language === 'hi' ? 'अन्य' : 'More'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isMoreDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E3E0D8] py-1.5 z-50 text-xs font-medium"
                  onMouseLeave={() => setIsMoreDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleNavClick('skills')}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#FAF9F5] ${
                      currentView === 'skills' ? 'text-[#1B4332] font-semibold bg-[#E8EFEA]' : 'text-[#354F52]'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-[#52796F]" />
                    <span>{language === 'hi' ? 'कौशल पासपोर्ट' : 'Skills Passport'}</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('project')}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#FAF9F5] ${
                      currentView === 'project' ? 'text-[#1B4332] font-semibold bg-[#E8EFEA]' : 'text-[#354F52]'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#52796F]" />
                    <span>{language === 'hi' ? 'बाल विज्ञान शोध' : 'Bal Vigyan Research'}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Actions (Demo Role Switcher, Language, Tour, Reset, Mobile Menu Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Demo Role / Switcher button */}
            <button
              onClick={() => setDemoEntryModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#123524] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-md transition-colors border border-[#CCD8D0] min-h-[36px]"
              title="Select demonstration role or switch synthetic worker profile"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="hidden sm:inline">
                {activeDemoRole === 'worker' ? `Worker: ${worker.name.split(' ')[0]}` : activeDemoRole === 'contractor' ? 'Contractor Desk' : 'Auditor Bench'}
              </span>
              <span className="sm:hidden font-mono text-[11px]">
                {activeDemoRole === 'worker' ? worker.name.split(' ')[0] : activeDemoRole}
              </span>
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 text-xs font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-md transition-colors whitespace-nowrap min-h-[36px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
              title="Toggle Hindi / English"
            >
              {language === 'hi' ? 'EN / हिंदी' : 'हिंदी / EN'}
            </button>

            {/* Judges' Tour button */}
            <button
              onClick={() => {
                if (activeJudgeTourStep !== null) {
                  setActiveJudgeTourStep(null);
                } else {
                  setActiveJudgeTourStep(1);
                  setCurrentView('home');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
                activeJudgeTourStep !== null
                  ? 'bg-[#C94A29] text-white shadow-sm'
                  : 'bg-[#1B4332] text-white hover:bg-[#123524]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{activeJudgeTourStep !== null ? (language === 'hi' ? 'टूर समाप्त' : 'Exit Tour') : (language === 'hi' ? 'जज टूर' : 'Judges\' Tour')}</span>
            </button>

            {/* Reset Demo Data (Single Authoritative Baseline Reset) */}
            <div className="relative">
              <button
                onClick={handleReset}
                className={`p-2 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                  showResetFeedback
                    ? 'text-emerald-700 bg-emerald-100 ring-1 ring-emerald-600'
                    : 'text-[#52796F] hover:text-[#1B4332] hover:bg-[#F0EEE6]'
                }`}
                title="Reset Demo Data back to pristine authoritative baseline"
                aria-label="Reset Demo Data back to pristine authoritative baseline"
              >
                <RotateCcw className={`w-4 h-4 ${showResetFeedback ? 'animate-spin' : ''}`} />
              </button>
              {showResetFeedback && (
                <div className="absolute right-0 top-full mt-1.5 px-2.5 py-1 bg-[#123524] text-white text-[10px] font-semibold rounded shadow-md whitespace-nowrap z-50 animate-fadeIn">
                  ✓ Reset to Baseline
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#123524] hover:bg-[#F0EEE6] rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E3E0D8] bg-[#FAF9F5] px-4 pt-3 pb-5 space-y-1 shadow-md">
          <div className="text-[11px] font-semibold text-[#52796F] uppercase tracking-wider px-3 py-1">
            {language === 'hi' ? 'नेविगेशन' : 'Navigation'}
          </div>

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 min-h-[44px] ${
              currentView === 'home' ? 'bg-[#1B4332] text-white' : 'text-[#354F52] hover:bg-[#F0EEE6]'
            }`}
          >
            <span>{language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
          </button>

          <button
            onClick={() => handleNavClick('worker')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 min-h-[44px] ${
              currentView === 'worker' ? 'bg-[#1B4332] text-white' : 'text-[#354F52] hover:bg-[#F0EEE6]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{language === 'hi' ? 'श्रमिक पोर्टल (Worker Portal)' : 'Worker Portal'}</span>
          </button>

          <button
            onClick={() => handleNavClick('pass')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 min-h-[44px] ${
              currentView === 'pass' ? 'bg-[#1B4332] text-white' : 'text-[#354F52] hover:bg-[#F0EEE6]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>{language === 'hi' ? 'डिजिटल वर्क पास (Digital Pass)' : 'Digital Work Pass'}</span>
          </button>

          <button
            onClick={() => handleNavClick('contractor')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 min-h-[44px] ${
              currentView === 'contractor' ? 'bg-[#1B4332] text-white' : 'text-[#354F52] hover:bg-[#F0EEE6]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{language === 'hi' ? 'ठेकेदार मस्टर (Contractor)' : 'Contractor Portal'}</span>
          </button>

          <button
            onClick={() => handleNavClick('disputes')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 min-h-[44px] ${
              currentView === 'disputes' ? 'bg-[#1B4332] text-white' : 'text-[#354F52] hover:bg-[#F0EEE6]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{language === 'hi' ? 'मजदूरी विवाद (Disputes)' : 'Wage Disputes'}</span>
          </button>

          <button
            onClick={() => handleNavClick('audit')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 min-h-[44px] ${
              currentView === 'audit' ? 'bg-[#1B4332] text-white' : 'text-[#354F52] hover:bg-[#F0EEE6]'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{language === 'hi' ? 'ऑडिट जांच (Audit Check)' : 'Audit Check'}</span>
          </button>

          <div className="border-t border-[#E3E0D8] my-2 pt-2">
            <button
              onClick={() => handleNavClick('skills')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 min-h-[44px] ${
                currentView === 'skills' ? 'bg-[#1B4332] text-white' : 'text-[#354F52] hover:bg-[#F0EEE6]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{language === 'hi' ? 'कौशल पासपोर्ट (Skills Passport)' : 'Skills Passport'}</span>
            </button>

            <button
              onClick={() => handleNavClick('project')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 min-h-[44px] ${
                currentView === 'project' ? 'bg-[#1B4332] text-white' : 'text-[#354F52] hover:bg-[#F0EEE6]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{language === 'hi' ? 'बाल विज्ञान शोध (Bal Vigyan)' : 'Bal Vigyan Research'}</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setApprovalsModalOpen(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between text-[#1B4332] hover:bg-[#E8EFEA] min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>{language === 'hi' ? 'सिम्युलेटेड अनुमोदन' : 'Simulated Approvals'}</span>
              </div>
              {pendingApprovalsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                  {pendingApprovalsCount} pending
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setStorageModalOpen(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 text-[#1B4332] hover:bg-[#E8EFEA] min-h-[44px]"
            >
              <Database className="w-4 h-4 text-emerald-700" />
              <span>{language === 'hi' ? 'स्टोरेज डायग्नोस्टिक्स (IndexedDB)' : 'Storage Diagnostics (IndexedDB)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
