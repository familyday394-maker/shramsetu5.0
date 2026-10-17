import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setCurrentView } = useApp();

  return (
    <footer className="bg-[#123524] text-[#E8EFEA] border-t border-[#1B4332] mt-20" aria-label="Site Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#244A39]">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-bold text-base border border-white/20">
                श
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Shram Setu 2.0
              </span>
            </div>
            <p className="text-xs text-[#A3B899] max-w-md leading-relaxed">
              {language === 'hi'
                ? 'असंगठित एवं दैनिक मजदूरी करने वाले श्रमिकों के लिए पारदर्शी कार्य, उपस्थिति एवं पारिश्रमिक रिकॉर्ड प्रणाली। सीनियर बाल विज्ञान (कंप्यूटर साइंस सहोदय नवाचार, इंदौर) के अंतर्गत विकसित।'
                : 'A civic technology student innovation designed for Senior Bal Vigyan to provide daily-wage workers and contractors with verified work records, explainable wage math, and traceable audit logs.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C5D6BF] pt-2">
              <MapPin className="w-3.5 h-3.5 text-[#E06D53] shrink-0" />
              <span>Indore District, Madhya Pradesh · Senior Bal Vigyan 2026 Innovation</span>
            </div>
          </div>

          {/* All Destination Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              {language === 'hi' ? 'मुख्य पृष्ठ' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-[#C5D6BF]">
              <li>
                <button
                  onClick={() => setCurrentView('worker')}
                  className="hover:text-white transition-colors text-left"
                >
                  {language === 'hi' ? 'श्रमिक पोर्टल (Worker)' : 'Worker Portal'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('pass')}
                  className="hover:text-white transition-colors text-left"
                >
                  {language === 'hi' ? 'डिजिटल वर्क पास (Pass)' : 'Digital Work Pass'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contractor')}
                  className="hover:text-white transition-colors text-left"
                >
                  {language === 'hi' ? 'ठेकेदार मस्टर (Contractor)' : 'Contractor Portal'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('disputes')}
                  className="hover:text-white transition-colors text-left"
                >
                  {language === 'hi' ? 'मजदूरी विवाद (Disputes)' : 'Wage Disputes'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('audit')}
                  className="hover:text-white transition-colors text-left"
                >
                  {language === 'hi' ? 'ऑडिट जांच (Audit Check)' : 'Audit Check'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('skills')}
                  className="hover:text-white transition-colors text-left"
                >
                  {language === 'hi' ? 'कौशल पासपोर्ट (Skills)' : 'Skills Passport'}
                </button>
              </li>
            </ul>
          </div>

          {/* Bal Vigyan Research & Framework */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              {language === 'hi' ? 'शोध व नवाचार' : 'Bal Vigyan Research'}
            </h4>
            <div className="space-y-2 text-xs text-[#C5D6BF]">
              <div>
                <span className="text-white font-medium">Category:</span> Computer Science
              </div>
              <div>
                <span className="text-white font-medium">Focus:</span> Civic Technology &amp; Transparency
              </div>
              <div>
                <span className="text-white font-medium">UN SDG:</span> Goal 8 (Decent Work) &amp; Goal 10
              </div>
              <div className="pt-1">
                <button
                  onClick={() => setCurrentView('project')}
                  className="text-[#E06D53] hover:underline font-medium text-left"
                >
                  {language === 'hi' ? 'परियोजना शोध पत्र पढ़ें →' : 'Read Bal Vigyan Paper →'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Honest Prototype Boundaries */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-[#8EA89D]">
          <p className="max-w-2xl leading-relaxed">
            <span className="font-semibold text-[#C5D6BF]">Honesty &amp; Prototype Notice:</span> Shram Setu 2.0 is an academic student prototype for the Senior Bal Vigyan competition. It demonstrates deterministic SHA-256 hash-chaining and dual-party dispute logging within the browser. It does not prove a worker’s physical bodily presence, prove that physical cash changed hands, or replace formal labor court adjudication. All records shown are demonstration data.
          </p>
          <div className="shrink-0 text-left md:text-right">
            <div>Senior Bal Vigyan 2026 Entry</div>
            <div className="text-[#6C8578]">Indore Sahodaya Computer Science</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
