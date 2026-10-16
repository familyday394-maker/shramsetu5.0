import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  ShieldCheck,
  AlertCircle,
  Database,
  Radio,
  Share2,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { BAL_VIGYAN_RESEARCH_METRICS } from '../data/mockData';

export const ProjectReportPage: React.FC = () => {
  const { language, setCurrentView, setActiveJudgeTourStep } = useApp();

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Top Paper Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E3E0D8] shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332]">
          <span className="w-2 h-2 rounded-full bg-[#E06D53]"></span>
          <span>{BAL_VIGYAN_RESEARCH_METRICS.division}</span>
          <span aria-hidden="true" className="text-[#8EA89D]">·</span>
          <span>{BAL_VIGYAN_RESEARCH_METRICS.region}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#123524] tracking-tight leading-tight">
          {BAL_VIGYAN_RESEARCH_METRICS.projectTitle}
        </h1>

        <p className="text-sm sm:text-base text-[#354F52] leading-relaxed">
          {language === 'hi'
            ? 'असंगठित निर्माण क्षेत्र में दैनिक मजदूरी की अनिश्चितता, मौखिक समझौतों के उल्लंघन और खोई हुई कच्ची पर्चियों की समस्या के समाधान हेतु एक व्यावहारिक विद्यार्थी नवाचार।'
            : 'A research-backed student innovation designed to safeguard daily wages, prevent arbitrary deductions, and build verifiable career equity for informal construction laborers in central India.'}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setActiveJudgeTourStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg shadow-sm transition-colors"
          >
            Launch Judges' Evaluation Walkthrough →
          </button>
          <button
            onClick={() => setCurrentView('audit')}
            className="px-4 py-2 text-xs font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-lg transition-colors"
          >
            Inspect Tamper Test Bench
          </button>
        </div>
      </div>

      {/* Field Study & Survey Statistics from Indore */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#E06D53] uppercase tracking-wider">PRIMARY FIELD RESEARCH</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#123524]">
            Survey Findings: Indore Morning Labor Mandis (N=124)
          </h2>
          <p className="text-xs sm:text-sm text-[#52796F]">
            Conducted across Geeta Bhawan, Malwa Mill, and Rajwada Labor Chowks between August and October 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BAL_VIGYAN_RESEARCH_METRICS.surveyFindings.map((finding, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-[#E3E0D8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#123524]">Finding {idx + 1}</span>
                <span className="font-mono text-2xl font-black text-[#E06D53]">
                  {finding.percentage}%
                </span>
              </div>
              <p className="text-xs text-[#354F52] leading-relaxed">
                {finding.label}
              </p>
              <div className="w-full bg-[#EAE8E0] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#E06D53] h-full rounded-full"
                  style={{ width: `${finding.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Architecture & Cryptographic Integrity */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D8] shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">SYSTEM ARCHITECTURE</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#123524]">
            Cryptographic Integrity Without Complex Enterprise Bloat
          </h2>
          <p className="text-xs sm:text-sm text-[#52796F]">
            How Shram Setu 2.0 achieves immutability and offline operation in a standard web browser:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#123524]">
              <Lock className="w-4 h-4 text-[#1B4332]" />
              <span>1. Chronological SHA-256 Hash Chaining</span>
            </div>
            <p className="text-xs text-[#354F52] leading-relaxed">
              Every shift entry computes a cryptographic block hash:
              <br />
              <code className="text-[11px] font-mono text-[#1B4332] bg-white px-2 py-1 rounded block my-2 border border-[#CCD8D0]">
                H(i) = SHA256( H(i-1) || Date || DailyRate || Hours || EarnedWage )
              </code>
              If a contractor attempts to retroactively alter yesterday's agreed rate from ₹650 to ₹400, the hash chain breaks, immediately displaying a <strong>Tamper Mismatch Warning</strong> in both worker and audit portals.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#123524]">
              <Radio className="w-4 h-4 text-[#1B4332]" />
              <span>2. Contactless 13.56 MHz NFC Emulation</span>
            </div>
            <p className="text-xs text-[#354F52] leading-relaxed">
              Worker credentials can be carried on a physical ₹15 NTAG213 contactless smart card or NFC sticker. On sites with zero cellular reception (e.g. underground metro basements), shift check-ins are cached locally in the browser’s IndexedDB buffer and synchronised automatically when connectivity resumes.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#123524]">
              <Layers className="w-4 h-4 text-[#1B4332]" />
              <span>3. Three-Tier Wage Separation</span>
            </div>
            <p className="text-xs text-[#354F52] leading-relaxed">
              Eliminates verbal confusion by strictly separating three financial values:
              <strong> Agreed Daily Rate</strong> (negotiated at morning chowk),
              <strong> Calculated Earned Wage</strong> (accounting for verified shift and overtime), and
              <strong> Cash Disbursed</strong> (advances or daily settlements).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#123524]">
              <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
              <span>4. Privacy-First Identity Standard</span>
            </div>
            <p className="text-xs text-[#354F52] leading-relaxed">
              In accordance with data privacy ethics, national ID numbers (Aadhaar) and personal banking details are never stored. The system operates on pseudonymized token IDs (`MP-IND-2026-WM842`), protecting vulnerable laborers from identity exploitation.
            </p>
          </div>
        </div>
      </section>

      {/* Sustainable Development Goals Alignment */}
      <section className="bg-[#123524] text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg">
        <span className="text-xs font-bold text-[#88D49E] uppercase tracking-wider">GLOBAL IMPACT ALIGNMENT</span>
        <h2 className="text-xl sm:text-2xl font-bold">
          United Nations Sustainable Development Goals (SDGs)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-[#1B4332] p-5 rounded-xl border border-[#2D6A4F] space-y-2">
            <div className="text-xs font-mono font-bold text-[#88D49E]">SDG 8: TARGET 8.8</div>
            <h3 className="font-bold text-base text-white">
              Decent Work &amp; Economic Growth
            </h3>
            <p className="text-xs text-[#C5D6BF] leading-relaxed">
              "Protect labor rights and promote safe and secure working environments for all workers, including migrant workers, in particular women migrants, and those in precarious employment."
            </p>
          </div>

          <div className="bg-[#1B4332] p-5 rounded-xl border border-[#2D6A4F] space-y-2">
            <div className="text-xs font-mono font-bold text-[#88D49E]">SDG 10: TARGET 10.2 &amp; 10.3</div>
            <h3 className="font-bold text-base text-white">
              Reduced Inequalities
            </h3>
            <p className="text-xs text-[#C5D6BF] leading-relaxed">
              "Empower and promote the social, economic and political inclusion of all... ensuring equal opportunity and reducing inequalities of outcome through verifiable evidence."
            </p>
          </div>
        </div>
      </section>

      {/* Prototype Limitations & Future Roadmap (Honesty Section) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D8] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-[#123524]">
            Scientific Transparency: Current Limitations &amp; Phase 2 Roadmap
          </h2>
        </div>

        <p className="text-xs text-[#52796F] leading-relaxed">
          As part of the Bal Vigyan evaluation, we transparently demarcate between the functioning features of the current software prototype and future hardware requirements:
        </p>

        <div className="space-y-3 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-[#805B10] space-y-1">
            <span className="font-bold block">1. Contactless Hardware Constraints</span>
            <p className="leading-relaxed">
              Desktop browsers cannot interact directly with physical high-frequency radio cards without an external USB reader; thus, desktop mode features an authenticated Web-NFC simulator. On Android Chrome, the native Web NFC API can be invoked.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-[#805B10] space-y-1">
            <span className="font-bold block">2. Feature Phones (Non-Smartphones)</span>
            <p className="leading-relaxed">
              Workers without smartphones currently rely on physical printed QR passes or chowk kiosk assistance. Phase 2 plans an SMS shortcode bridge (e.g. *99# USSD or SMS check-in) connected to the local server.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-[#805B10] space-y-1">
            <span className="font-bold block">3. Legal Standing</span>
            <p className="leading-relaxed">
              Shram Setu 2.0 generates structured, timestamped evidence dossiers for informal chowk mediation and labor commissioner conferences. It does not replace formal judiciary adjudication or guarantee direct bank deductions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
