import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Compass, RotateCcw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    language,
    toggleLanguage,
    resetDemoData,
    activeJudgeTourStep,
    setActiveJudgeTourStep,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E3E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          {/* Zone 1: Single clean brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentView('home');
                setActiveJudgeTourStep(null);
              }}
              className="text-left group cursor-pointer flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                श
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-[#123524] group-hover:text-[#2D6A4F] transition-colors whitespace-nowrap">
                  Shram Setu 2.0
                </span>
                <span className="hidden sm:inline-block text-[11px] text-[#52796F] font-medium ml-2">
                  श्रम सेतु
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#354F52]">
            <button
              onClick={() => { setCurrentView('worker'); setActiveJudgeTourStep(null); }}
              className={`hover:text-[#123524] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentView === 'worker' ? 'border-[#1B4332] text-[#123524] font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'श्रमिक डैशबोर्ड' : 'Worker Portal'}
            </button>
            <button
              onClick={() => { setCurrentView('pass'); setActiveJudgeTourStep(null); }}
              className={`hover:text-[#123524] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentView === 'pass' ? 'border-[#1B4332] text-[#123524] font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'डिजिटल वर्क पास' : 'Digital Pass'}
            </button>
            <button
              onClick={() => { setCurrentView('contractor'); setActiveJudgeTourStep(null); }}
              className={`hover:text-[#123524] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentView === 'contractor' ? 'border-[#1B4332] text-[#123524] font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'ठेकेदार मस्टर' : 'Contractor'}
            </button>
            <button
              onClick={() => { setCurrentView('disputes'); setActiveJudgeTourStep(null); }}
              className={`hover:text-[#123524] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentView === 'disputes' ? 'border-[#1B4332] text-[#123524] font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'मजदूरी विवाद' : 'Disputes'}
            </button>
            <button
              onClick={() => { setCurrentView('skills'); setActiveJudgeTourStep(null); }}
              className={`hover:text-[#123524] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentView === 'skills' ? 'border-[#1B4332] text-[#123524] font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'कौशल पासपोर्ट' : 'Skills'}
            </button>
            <button
              onClick={() => { setCurrentView('project'); setActiveJudgeTourStep(null); }}
              className={`hover:text-[#123524] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentView === 'project' ? 'border-[#1B4332] text-[#123524] font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'बाल विज्ञान शोध' : 'Bal Vigyan'}
            </button>
            <button
              onClick={() => { setCurrentView('audit'); setActiveJudgeTourStep(null); }}
              className={`hover:text-[#123524] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentView === 'audit' ? 'border-[#1B4332] text-[#123524] font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'ऑडिट जांच' : 'Audit Check'}
            </button>
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 text-xs font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-md transition-colors whitespace-nowrap shrink-0"
              title="Toggle Hindi / English"
            >
              {language === 'hi' ? 'EN / हिंदी' : 'हिंदी / EN'}
            </button>

            {/* Judges' Walkthrough Guide */}
            <button
              onClick={() => {
                if (activeJudgeTourStep !== null) {
                  setActiveJudgeTourStep(null);
                } else {
                  setActiveJudgeTourStep(1);
                  setCurrentView('home');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeJudgeTourStep !== null
                  ? 'bg-[#E06D53] text-white shadow-sm'
                  : 'bg-[#1B4332] text-white hover:bg-[#123524]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{activeJudgeTourStep !== null ? 'Exit Tour' : 'Judges\' Tour'}</span>
            </button>

            {/* Reset Demo Data */}
            <button
              onClick={() => {
                if (confirm('Reset all demo data back to clean initial state?')) {
                  resetDemoData();
                }
              }}
              className="p-1.5 text-[#52796F] hover:text-[#1B4332] hover:bg-[#EAE8E0] rounded-md transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar below header */}
      <div className="lg:hidden border-t border-[#E3E0D8] bg-[#F4F3EE] px-4 py-2 overflow-x-auto flex gap-3 text-xs font-medium text-[#354F52] no-scrollbar">
        <button
          onClick={() => setCurrentView('worker')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${currentView === 'worker' ? 'bg-[#1B4332] text-white' : ''}`}
        >
          {language === 'hi' ? 'श्रमिक' : 'Worker'}
        </button>
        <button
          onClick={() => setCurrentView('pass')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${currentView === 'pass' ? 'bg-[#1B4332] text-white' : ''}`}
        >
          {language === 'hi' ? 'वर्क पास' : 'Work Pass'}
        </button>
        <button
          onClick={() => setCurrentView('contractor')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${currentView === 'contractor' ? 'bg-[#1B4332] text-white' : ''}`}
        >
          {language === 'hi' ? 'ठेकेदार' : 'Contractor'}
        </button>
        <button
          onClick={() => setCurrentView('disputes')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${currentView === 'disputes' ? 'bg-[#1B4332] text-white' : ''}`}
        >
          {language === 'hi' ? 'विवाद' : 'Disputes'}
        </button>
        <button
          onClick={() => setCurrentView('skills')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${currentView === 'skills' ? 'bg-[#1B4332] text-white' : ''}`}
        >
          {language === 'hi' ? 'कौशल' : 'Skills'}
        </button>
        <button
          onClick={() => setCurrentView('project')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${currentView === 'project' ? 'bg-[#1B4332] text-white' : ''}`}
        >
          {language === 'hi' ? 'बाल विज्ञान' : 'Bal Vigyan'}
        </button>
        <button
          onClick={() => setCurrentView('audit')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${currentView === 'audit' ? 'bg-[#1B4332] text-white' : ''}`}
        >
          {language === 'hi' ? 'ऑडिट' : 'Audit'}
        </button>
      </div>
    </header>
  );
};
