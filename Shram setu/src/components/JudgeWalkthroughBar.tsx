import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

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
    title: "1. The Daily-Wage Problem & Local Study",
    hindiTitle: "१. दैनिक मजदूरी समस्या एवं क्षेत्रीय अध्ययन",
    view: 'home',
    instruction: "Understand the core issue: informal workers in Indore face verbal contracts, wage cuts, unrecorded overtime, and lack proof of past work.",
    hindiInstruction: "इंदौर के गीता भवन व मालवा मिल चौराहों का जमीनी सर्वेक्षण: ८४% श्रमिकों को मजदूरी कटौती व बिना रसीद काम का सामना करना पड़ता है।",
    keyFeature: "Bal Vigyan Problem Statement & Indore Chowk Field Survey"
  },
  {
    step: 2,
    title: "2. Worker Profile & Digital Work Pass",
    hindiTitle: "२. श्रमिक प्रोफाइल एवं डिजिटल वर्क पास",
    view: 'pass',
    instruction: "Inspect Ramesh Verma's Digital Work Pass with simulated contactless NFC chip identifier, QR profile, and tamper-evident SHA checksum.",
    hindiInstruction: "रमेश वर्मा का डिजिटल पास: बिना आधार गोपनीयता जोखिम के कार्य सत्यापन, NFC कार्ड टैप सिमुलेशन एवं क्यूआर कोड।",
    keyFeature: "Privacy-Preserving Digital Work Pass (NFC & QR Prototype)"
  },
  {
    step: 3,
    title: "3. Attendance & Wage Ledger",
    hindiTitle: "३. उपस्थिति एवं पारदर्शी मजदूरी खाता",
    view: 'worker',
    instruction: "Observe the strict separation between Agreed Daily Rate (₹650), Earned Wage (₹750 with OT), Paid Amount, and Balance Due.",
    hindiInstruction: "तय दिहाड़ी (₹650), ओवर-टाइम, कुल अर्जित व प्राप्त भुगतान का स्पष्ट पृथक्करण ताकि मौखिक विवाद न हों।",
    keyFeature: "Three-Tier Wage Ledger & Digital Worker Slip Generation"
  },
  {
    step: 4,
    title: "4. Tamper-Evidence Demonstrator",
    hindiTitle: "४. क्रिप्टोग्राफिक छेड़छाड़ पहचान डेमो",
    view: 'audit',
    instruction: "Demonstrate hash-chain integrity: click 'Simulate Tamper' to reduce a past wage. Notice how the system flags a Hash Mismatch immediately!",
    hindiInstruction: "हैश-चेन सुरक्षा: किसी पुरानी एंट्री की दर बदलने पर सिस्टम तुरंत 'TAMPER ALERT' व हैश विसंगति प्रदर्शित करता है।",
    keyFeature: "Cryptographic Tamper-Evident Hash Chaining Demo"
  },
  {
    step: 5,
    title: "5. Raising & Tracking a Wage Dispute",
    hindiTitle: "५. मजदूरी विवाद दर्ज व साक्ष्य संकलन",
    view: 'disputes',
    instruction: "See how Ramesh lodged a dispute for Scheme No. 78 site where ₹400 was paid instead of ₹750. Notice timeline, witnesses, and legal mediation disclaimer.",
    hindiInstruction: "योजना क्रमांक ७८ साइट पर ₹३५० कटौती का विवाद: शिफ्ट टाइमस्टैम्प, गवाहों के बयान व मध्यस्थता की समय-सारणी।",
    keyFeature: "Evidence-Organizing Wage Dispute Support Desk"
  },
  {
    step: 6,
    title: "6. Contractor Muster Roll & Verification",
    hindiTitle: "६. ठेकेदार मस्टर रोल एवं मजदूरी भुगतान",
    view: 'contractor',
    instruction: "Examine the contractor's perspective: M/s Sharma Infra verifies worker presence, disburses pending balance, and downloads CSV reports.",
    hindiInstruction: "ठेकेदार पोर्टल: उपस्थिति अनुमोदन, पारदर्शी भुगतान रसीद एवं डाउनलोड योग्य मस्टर रोल रिपोर्ट।",
    keyFeature: "Dual-Party Contractor Verification & Muster CSV Export"
  },
  {
    step: 7,
    title: "7. Senior Bal Vigyan Findings & Roadmap",
    hindiTitle: "७. बाल विज्ञान निष्कर्ष एवं भविष्य का रोडमैप",
    view: 'project',
    instruction: "Review student research paper: real survey statistics, SDG 8 & 10 alignment, honest prototype scope vs future hardware token roadmap.",
    hindiInstruction: "ईमानदार वैज्ञानिक दृष्टिकोण: वर्तमान में क्या काम करता है और पायलट फेज-२ में हार्डवेयर टोकन हेतु क्या योजना है।",
    keyFeature: "Bal Vigyan Scientific Paper & Prototype Honesty Statement"
  }
];

export const JudgeWalkthroughBar: React.FC = () => {
  const {
    activeJudgeTourStep,
    setActiveJudgeTourStep,
    setCurrentView,
    language,
    resetDemoData,
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
    <div className="bg-[#123524] text-white border-b-2 border-[#E06D53] shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Step Indicator and info */}
          <div className="flex items-start gap-3 flex-1">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E06D53] text-white font-bold text-xs shrink-0 mt-0.5">
              {currentStep.step}/{TOUR_STEPS.length}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm tracking-wide text-white">
                  {language === 'hi' ? currentStep.hindiTitle : currentStep.title}
                </span>
                <span className="text-[11px] text-[#A3B899] font-mono">
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
                >
                  {s.step}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrev}
              disabled={activeJudgeTourStep === 1}
              className="px-2.5 py-1 text-xs font-medium rounded bg-[#1B4332] text-white hover:bg-[#2D6A4F] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-3 py-1 text-xs font-semibold rounded bg-[#E06D53] text-white hover:bg-[#C95B42] flex items-center gap-1 shadow-sm"
            >
              <span>{activeJudgeTourStep === TOUR_STEPS.length ? 'Finish Tour' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveJudgeTourStep(null)}
              className="p-1 text-[#A3B899] hover:text-white rounded hover:bg-[#1B4332]"
              title="Close Walkthrough"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
