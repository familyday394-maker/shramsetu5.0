import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setCurrentView } = useApp();

  return (
    <footer className="bg-[#123524] text-[#E8EFEA] border-t border-[#1B4332] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#244A39]">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E06D53] text-white flex items-center justify-center font-bold text-base">
                श
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Shram Setu 2.0
              </span>
            </div>
            <p className="text-xs text-[#A3B899] max-w-md leading-relaxed">
              {language === 'hi'
                ? 'असंगठित एवं दैनिक मजदूरी करने वाले श्रमिकों के लिए पारदर्शी कार्य, उपस्थिति एवं पारिश्रमिक रिकॉर्ड प्रणाली। सीनियर बाल विज्ञान (विज्ञान व सामाजिक नवाचार) के अंतर्गत विकसित।'
                : 'A student innovation designed for Senior Bal Vigyan to provide daily-wage and informal workers with verified work passes, transparent wage ledgers, and evidence-supported dispute mediation.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C5D6BF] pt-2">
              <MapPin className="w-3.5 h-3.5 text-[#E06D53]" />
              <span>Indore District, Madhya Pradesh · Field Survey Focus: Geeta Bhawan, Malwa Mill, Rajwada Chowks</span>
            </div>
          </div>

          {/* Quick Portal Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              {language === 'hi' ? 'मुख्य पृष्ठ' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-[#C5D6BF]">
              <li>
                <button onClick={() => setCurrentView('worker')} className="hover:text-white transition-colors">
                  {language === 'hi' ? 'श्रमिक डैशबोर्ड' : 'Worker Dashboard'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('pass')} className="hover:text-white transition-colors">
                  {language === 'hi' ? 'डिजिटल वर्क पास' : 'Digital Work Pass'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contractor')} className="hover:text-white transition-colors">
                  {language === 'hi' ? 'ठेकेदार मस्टर रोल' : 'Contractor Portal'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('disputes')} className="hover:text-white transition-colors">
                  {language === 'hi' ? 'मजदूरी विवाद निवारण' : 'Wage Disputes'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('skills')} className="hover:text-white transition-colors">
                  {language === 'hi' ? 'कौशल कार्य पासपोर्ट' : 'Skills Passport'}
                </button>
              </li>
            </ul>
          </div>

          {/* Senior Bal Vigyan Evaluation & SDGs */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              {language === 'hi' ? 'शोध व नवाचार' : 'Bal Vigyan Research'}
            </h4>
            <div className="space-y-2.5 text-xs text-[#C5D6BF]">
              <div>
                <span className="text-white font-medium">Category:</span> Societal Innovation
              </div>
              <div>
                <span className="text-white font-medium">SDG 8:</span> Decent Work & Economic Growth
              </div>
              <div>
                <span className="text-white font-medium">SDG 10:</span> Reduced Inequalities
              </div>
              <button
                onClick={() => setCurrentView('project')}
                className="inline-block mt-1 text-[#E06D53] hover:underline font-medium"
              >
                {language === 'hi' ? 'परियोजना शोध पत्र पढ़ें →' : 'Read Bal Vigyan Paper →'}
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Honest Prototype Notice */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-[#8EA89D]">
          <p className="max-w-2xl leading-relaxed">
            <span className="font-semibold text-[#C5D6BF]">Honesty &amp; Limitations Notice:</span> Shram Setu 2.0 is an academic student prototype for Senior Bal Vigyan. It organizes digital evidence and generates structured logs to assist in informal dispute resolution. It does not provide legal arbitration, guarantee recovery of withheld cash, or claim official government certification. All demo worker identities are fictional and privacy-safe.
          </p>
          <div className="shrink-0 text-right">
            <div>Senior Bal Vigyan 2026 Project Entry</div>
            <div className="text-[#6C8578]">Crafted for Indore Labor Chowk Impact</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
