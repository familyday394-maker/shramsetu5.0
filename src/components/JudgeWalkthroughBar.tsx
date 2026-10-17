import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface StepInfo {
  step: number;
  title: string;
  hindiTitle: string;
  view: 'home' | 'worker' | 'pass' | 'contractor' | 'disputes' | 'skills' | 'project' | 'audit';
  instruction: string;
  hindiInstruction: string;
  keyFeature: string;
}

const TOUR_STEPS: StepInfo[] = [
  {
    step: 1,
    title: "1. The Daily-Wage Problem & Core Concept",
    hindiTitle: "१. दैनिक मजदूरी समस्या एवं पारदर्शिता सिद्धांत",
    view: 'home',
    instruction: "Understand the core issue: informal workers face verbal contracts, arbitrary wage cuts, unrecorded overtime, and lost paper slips. Review the transparent wage model.",
    hindiInstruction: "मौखिक समझौतों, मनमानी कटौती और बिना रसीद काम की समस्या: तय दर, कार्य और भुगतान का अलग-अलग पारदर्शी हिसाब।",
    keyFeature: "Transparency Principles & Illustrative Wage Record"
  },
  {
    step: 2,
    title: "2. Worker Profile & Digital Work Pass",
    hindiTitle: "२. श्रमिक प्रोफाइल एवं डिजिटल वर्क पास",
    view: 'pass',
    instruction: "Inspect the worker's Digital Work Pass with printable QR code, privacy-safe worker ID, and tamper-evident audit checksum (Demo Data).",
    hindiInstruction: "श्रमिक का डिजिटल वर्क पास: प्रिंट करने योग्य क्यूआर कोड, सुरक्षित श्रमिक आईडी एवं ऑडिट चेकसम (डेमो डेटा)।",
    keyFeature: "Printable QR & Privacy-Preserving Worker ID"
  },
  {
    step: 3,
    title: "3. Attendance & Wage Ledger",
    hindiTitle: "३. उपस्थिति एवं पारदर्शी मजदूरी खाता",
    view: 'worker',
    instruction: "Observe the strict separation between Agreed Daily Rate (₹650), Earned Wage (₹750 with OT), Paid Amount, and Balance Due.",
    hindiInstruction: "तय दिहाड़ी (₹650), ओवर-टाइम, कुल अर्जित व प्राप्त भुगतान का स्पष्ट पृथक्करण ताकि मौखिक विवाद न हों।",
    keyFeature: "Separation of Recorded Payment vs Worker Acknowledgment"
  },
  {
    step: 4,
    title: "4. Tamper-Evidence Demonstrator",
    hindiTitle: "४. क्रिप्टोग्राफिक छेड़छाड़ पहचान डेमो",
    view: 'audit',
    instruction: "Demonstrate hash-chain detection: click 'Simulate Tamper' to alter a past wage. Notice how the system flags a hash mismatch immediately.",
    hindiInstruction: "हैश-चेन विसंगति पहचान: किसी पुरानी प्रविष्टि की दर बदलने पर सिस्टम तुरंत विसंगति व ऑडिट ट्रेल प्रदर्शित करता है।",
    keyFeature: "SHA-256 Tamper-Evident Hash Audit Ledger"
  },
  {
    step: 5,
    title: "5. Raising & Tracking a Wage Dispute",
    hindiTitle: "५. मजदूरी विवाद दर्ज व साक्ष्य संकलन",
    view: 'disputes',
    instruction: "Inspect how disagreements remain visible with timestamped logs, dispute claims, and an organized timeline for informal mediation.",
    hindiInstruction: "विवादों का खुला रिकॉर्ड: शिफ्ट टाइमस्टैम्प, कटौती का विवरण व मध्यस्थता हेतु संगठित साक्ष्य फ़ाइल।",
    keyFeature: "Evidence-Organizing Wage Dispute Desk"
  },
  {
    step: 6,
    title: "6. Contractor Muster Roll & Verification",
    hindiTitle: "६. ठेकेदार मस्टर रोल एवं मजदूरी भुगतान",
    view: 'contractor',
    instruction: "Examine the contractor's perspective: approve muster entries, record partial disbursements, and export CSV audit reports.",
    hindiInstruction: "ठेकेदार पोर्टल: उपस्थिति अनुमोदन, पारदर्शी भुगतान प्रविष्टि एवं डाउनलोड योग्य मस्टर रोल।",
    keyFeature: "Dual-Party Accountability & Muster Export"
  },
  {
    step: 7,
    title: "7. Senior Bal Vigyan Findings & Roadmap",
    hindiTitle: "७. बाल विज्ञान निष्कर्ष एवं भविष्य का रोडमैप",
    view: 'project',
    instruction: "Review student research paper: prototype boundaries, offline-first browser architecture, and clear scientific limitations.",
    hindiInstruction: "ईमानदार वैज्ञानिक दृष्टिकोण: वर्तमान प्रोटोटाइप में क्या काम करता है और भविष्य के पायलट हेतु क्या सीमाएं हैं।",
    keyFeature: "Bal Vigyan Scientific Paper & Prototype Honesty Statement"
  }
];

export const JudgeWalkthroughBar: React.FC = () => {
  const {
    activeJudgeTourStep,
    setActiveJudgeTourStep,
    setCurrentView,
    language,
  } = useApp();

  if (activeJudgeTourStep === null) return null;

  const currentStep = TOUR_STEPS.find(s => s.step === activeJudgeTourStep) || TOUR_STEPS[0];

  const handleNext = () => {
    if (activeJudgeTourStep < TOUR_STEPS.length) {
      const nextStepNum = activeJudgeTourStep + 1;
      const nextStep = TOUR_STEPS.find(s => s.step === nextStepNum);
      if (nextStep) {
        setActiveJudgeTourStep(nextStepNum);
        setCurrentView(nextStep.view);
      }
    } else {
      setActiveJudgeTourStep(null);
    }
  };

  const handlePrev = () => {
    if (activeJudgeTourStep > 1) {
      const prevStepNum = activeJudgeTourStep - 1;
      const prevStep = TOUR_STEPS.find(s => s.step === prevStepNum);
      if (prevStep) {
        setActiveJudgeTourStep(prevStepNum);
        setCurrentView(prevStep.view);
      }
    }
  };

  const jumpToStep = (stepNum: number) => {
    const target = TOUR_STEPS.find(s => s.step === stepNum);
    if (target) {
      setActiveJudgeTourStep(stepNum);
      setCurrentView(target.view);
    }
  };

  return (
    <aside aria-label="Judges Walkthrough" className="bg-[#123524] text-white border-b-2 border-[#C94A29] shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Step Indicator and info */}
          <div className="flex items-start gap-3 flex-1">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#C94A29] text-white font-bold text-xs shrink-0 mt-0.5">
              {currentStep.step}/{TOUR_STEPS.length}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-sm tracking-wide text-white">
                  {language === 'hi' ? currentStep.hindiTitle : currentStep.title}
                </span>
                <span className="text-[#A3B899] font-mono">
                  [{currentStep.keyFeature}]
                </span>
              </div>
              <p className="text-xs text-[#E8EFEA] mt-0.5 leading-relaxed">
                {language === 'hi' ? currentStep.hindiInstruction : currentStep.instruction}
              </p>
            </div>
          </div>

          {/* Quick step bubbles & Next / Prev controls */}
          <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
            <div className="hidden sm:flex items-center gap-1 mr-2">
              {TOUR_STEPS.map(s => (
                <button
                  key={s.step}
                  onClick={() => jumpToStep(s.step)}
                  className={`w-6 h-6 rounded text-[11px] font-semibold transition-all ${
                    s.step === currentStep.step
                      ? 'bg-white text-[#123524] font-bold'
                      : s.step < currentStep.step
                      ? 'bg-[#2D6A4F] text-white hover:bg-[#3D8B68]'
                      : 'bg-[#1B4332] text-[#8EA89D] hover:bg-[#2D6A4F]'
                  }`}
                  title={s.title}
                  aria-label={`Jump to Tour Step ${s.step}`}
                >
                  {s.step}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrev}
              disabled={activeJudgeTourStep === 1}
              className="px-2.5 py-1 text-xs font-medium rounded bg-[#1B4332] text-white hover:bg-[#2D6A4F] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 min-h-[32px]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-3 py-1 text-xs font-semibold rounded bg-[#C94A29] text-white hover:bg-[#B33C1D] flex items-center gap-1 shadow-sm min-h-[32px]"
            >
              <span>{activeJudgeTourStep === TOUR_STEPS.length ? (language === 'hi' ? 'टूर समाप्त' : 'Finish Tour') : (language === 'hi' ? 'अगला चरण' : 'Next Step')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveJudgeTourStep(null)}
              className="p-1.5 text-[#A3B899] hover:text-white rounded hover:bg-[#1B4332] min-h-[32px] min-w-[32px] flex items-center justify-center"
              title="Close Walkthrough"
              aria-label="Close Walkthrough"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
