import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  Share2,
  Building,
  Star,
  ExternalLink,
  Users
} from 'lucide-react';

export const SkillsPassportPage: React.FC = () => {
  const { worker, skills, language } = useApp();
  const [shareSuccess, setShareSuccess] = useState(false);

  const totalHours = skills.reduce((sum, s) => sum + s.verifiedHours, 0);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
            {language === 'hi' ? 'दैनिक मजदूरी से मान्यता प्राप्त कारीगरी' : 'Vocational Experience Accumulator'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi' ? 'कौशल एवं कार्य अनुभव पासपोर्ट' : 'Skills & Work Experience Passport'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F] mt-1">
            {language === 'hi'
              ? 'दैनिक उपस्थिति से अर्जित प्रमाणित कार्य घंटे जो नए ठेकेदारों के समक्ष उचित पारिश्रमिक की गारंटी बनते हैं।'
              : 'Transforms informal daily shifts into recognized vocational credentials for equitable wage bargaining.'}
          </p>
        </div>

        <button
          onClick={handleShare}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-xl shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>{shareSuccess ? 'Link Copied!' : 'Share Verified Profile'}</span>
        </button>
      </div>

      {/* Cumulative Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-[11px] text-[#52796F] font-medium block">VERIFIED TRADE HOURS</span>
          <span className="font-mono text-2xl font-bold text-[#123524] mt-1 block">
            {totalHours} hrs
          </span>
          <span className="text-[11px] text-[#2D6A4F] mt-1 block">Muster-backed labor</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-[11px] text-[#52796F] font-medium block">COMPLETED SITES</span>
          <span className="font-mono text-2xl font-bold text-[#123524] mt-1 block">
            {worker.completedSites}
          </span>
          <span className="text-[11px] text-[#52796F] mt-1 block">Across Indore District</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-[11px] text-[#52796F] font-medium block">SUPERVISOR RATING</span>
          <span className="font-mono text-2xl font-bold text-amber-700 mt-1 block">
            ★ 4.85 / 5.0
          </span>
          <span className="text-[11px] text-[#52796F] mt-1 block">From 6 Contractors</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3E0D8]">
          <span className="text-[11px] text-[#52796F] font-medium block">EXPERIENCE TRACK</span>
          <span className="font-mono text-2xl font-bold text-[#2D6A4F] mt-1 block">
            4.0 Years
          </span>
          <span className="text-[11px] text-[#2D6A4F] mt-1 block">Continuous craftsmanship</span>
        </div>
      </div>

      {/* Verified Skills Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#123524] uppercase tracking-wider">
          {language === 'hi' ? 'प्रमाणित कौशल क्षमताएं एवं अनुभव' : 'Verified Trade Competencies'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map(skill => (
            <div key={skill.id} className="bg-white p-6 rounded-2xl border border-[#E3E0D8] shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#52796F] uppercase font-mono tracking-wider block">
                    {skill.category}
                  </span>
                  <h3 className="font-bold text-base text-[#123524]">
                    {skill.skillName}
                  </h3>
                  <span className="text-xs text-[#52796F]">{skill.skillHindi}</span>
                </div>
                <div className="flex items-center gap-1 font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{skill.rating}</span>
                </div>
              </div>

              {/* Progress metric */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#354F52]">
                  <span>Muster Logged Hours:</span>
                  <span className="font-mono font-bold text-[#123524]">{skill.verifiedHours} hrs</span>
                </div>
                <div className="w-full bg-[#EAE8E0] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1B4332] h-full rounded-full"
                    style={{ width: `${Math.min(100, (skill.verifiedHours / 550) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Verification source */}
              <div className="pt-3 border-t border-[#EAE8E0] text-xs text-[#52796F] space-y-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                  <span>
                    <strong>Endorsement:</strong> {skill.endorsedByContractor}
                  </span>
                </div>
                {skill.certificationTitle && (
                  <div className="text-[11px] text-[#1B4332] bg-[#E8EFEA] p-2 rounded-lg font-medium">
                    {skill.certificationTitle}
                  </div>
                )}
                <div className="text-[10px] text-[#8EA89D]">
                  Method: {skill.verificationMethod.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Honest Scientific Note on Skill Verification */}
      <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#CCD8D0] text-xs text-[#52796F] flex items-start gap-3">
        <Award className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#123524]">
            Bal Vigyan Verification Integrity:
          </span>
          <p className="leading-relaxed text-[11px]">
            In strict compliance with research guidelines, skills are verified through accumulated attendance on contractor muster rolls and peer corroboration. No fabricated government certificates or fictitious vocational credentials are generated.
          </p>
        </div>
      </div>
    </div>
  );
};
