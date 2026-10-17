import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  QrCode,
  Building,
  Scale,
  Clock,
  History,
  Lock,
  WifiOff,
  Compass,
  ChevronRight,
  Users,
  FileCheck2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setCurrentView, setActiveJudgeTourStep, openRecordInspector, records, language } = useApp();
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const scrollToWorkflow = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-8" aria-labelledby="hero-heading">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Vision & Primary Calls to Action */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Metadata Kicker (Clean unboxed text, no pills) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] flex-wrap">
              <span>{language === 'hi' ? 'सीनियर बाल विज्ञान २०२६' : 'Senior Bal Vigyan 2026'}</span>
              <span aria-hidden="true" className="text-[#8EA89D]">·</span>
              <span>{language === 'hi' ? 'कंप्यूटर साइंस सहोदय नवाचार' : 'Computer Science Civic Innovation'}</span>
              <span aria-hidden="true" className="text-[#8EA89D]">·</span>
              <span className="text-[#52796F]">Indore (M.P.)</span>
            </div>

            {/* Dominant Headline */}
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#123524] tracking-tight leading-[1.18]"
              style={{ textWrap: 'balance' }}
            >
              {language === 'hi'
                ? 'प्रत्येक शिफ्ट दर्ज। हर मजदूरी का स्पष्ट हिसाब। हर बदलाव का प्रमाण।'
                : 'Every shift recorded. Every wage explained. Every change traceable.'}
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#354F52] leading-relaxed max-w-2xl">
              {language === 'hi'
                ? 'तय दिहाड़ी, कार्य दिवस, दर्ज भुगतान और विवादों की पारदर्शी समीक्षा — सीमित इंटरनेट व ऑफलाइन परिस्थितियों के लिए विशेष रूप से तैयार।'
                : 'Review agreed wages, work records, payment status and disputes in one transparent system, designed for situations where internet access may be unreliable.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('worker')}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-xl shadow-sm transition-colors flex items-center gap-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] focus-visible:ring-offset-2"
              >
                <span>{language === 'hi' ? 'श्रमिक पोर्टल देखें' : 'Explore Worker Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToWorkflow}
                className="px-5 py-3 text-sm font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-xl transition-colors flex items-center gap-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
              >
                <span>{language === 'hi' ? 'कार्यप्रणाली देखें' : 'See How It Works'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveJudgeTourStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-3 text-xs font-medium text-[#52796F] hover:text-[#123524] transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                <Compass className="w-3.5 h-3.5 text-[#C94A29]" />
                <span>{language === 'hi' ? 'मूल्यांकनकर्ता टूर (७ चरण)' : 'Judges\' 7-Step Tour'}</span>
              </button>
            </div>

            {/* Core Tenets Strip */}
            <div className="pt-4 border-t border-[#E3E0D8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-[#123524] block">
                  {language === 'hi' ? 'स्पष्ट मजदूरी गणना' : 'Explainable Calculation'}
                </span>
                <span className="text-[#52796F] text-[11px] leading-snug block">
                  {language === 'hi' ? 'दिन व दर का सीधा गणित, कोई छिपी कटौती नहीं' : 'Direct math from agreed daily rate and overtime hours'}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-[#123524] block">
                  {language === 'hi' ? 'अपरिवर्तनीय संशोधन इतिहास' : 'Preserved Change History'}
                </span>
                <span className="text-[#52796F] text-[11px] leading-snug block">
                  {language === 'hi' ? 'कोई भी पुराना रिकॉर्ड चुपचाप नहीं बदला जाता' : 'Edits append to audit trail without overwriting history'}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-[#123524] block">
                  {language === 'hi' ? 'पृथक भुगतान अभिस्वीकृति' : 'Payment Acknowledgment'}
                </span>
                <span className="text-[#52796F] text-[11px] leading-snug block">
                  {language === 'hi' ? 'ठेकेदार का दर्ज भुगतान स्वतः नकद प्राप्ति नहीं' : 'Contractor entries distinct from worker confirmation'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Demonstrative Sample Wage-Record Interface */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-2xl border border-[#E3E0D8] shadow-sm overflow-hidden">
              {/* Header Label: Explicit Demonstration Notice */}
              <div className="bg-[#1B4332] text-white px-5 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#88D49E]" />
                  <span className="font-semibold tracking-wide">
                    {language === 'hi' ? 'पारदर्शी मजदूरी रिकॉर्ड (नमूना)' : 'Illustrative Wage Record'}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-white/10 px-2 py-0.5 rounded text-[#E8EFEA]">
                  DEMO DATA
                </span>
              </div>

              {/* Sample Record Details */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Worker & Role Context */}
                <div className="flex items-start justify-between border-b border-[#E3E0D8] pb-3.5">
                  <div>
                    <span className="text-[11px] font-semibold text-[#52796F] uppercase tracking-wider block">
                      {language === 'hi' ? 'व्यापार श्रेणी एवं कार्य' : 'Trade Classification & Role'}
                    </span>
                    <span className="font-bold text-[#123524] text-base">
                      {language === 'hi' ? 'वरिष्ठ राजमिस्त्री (चिनाई कार्य)' : 'Senior Mason (Brickwork)'}
                    </span>
                    <span className="text-xs text-[#52796F] block">
                      {language === 'hi' ? 'नमूना साइट: विजय नगर मेट्रो पिलर ४बी' : 'Sample Site: Vijay Nagar Metro Line'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-[#52796F] uppercase tracking-wider block">
                      {language === 'hi' ? 'तय दिहाड़ी' : 'Agreed Rate'}
                    </span>
                    <span className="font-mono font-bold text-[#123524] text-base tabular-nums">
                      ₹650
                    </span>
                    <span className="text-[11px] text-[#52796F] block">
                      {language === 'hi' ? 'प्रति कार्य दिवस' : 'per day (8 hrs)'}
                    </span>
                  </div>
                </div>

                {/* Mathematical Wage Calculation Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#354F52]">
                      {language === 'hi' ? 'दर्ज कार्य दिवस (Recorded Work):' : 'Recorded Work:'}
                    </span>
                    <span className="font-mono font-semibold text-[#123524] tabular-nums">
                      4 {language === 'hi' ? 'दिन' : 'days'} (32 hrs)
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 bg-[#FAF9F5] px-2.5 rounded-lg border border-[#E3E0D8]">
                    <span className="text-[#123524] font-medium">
                      {language === 'hi' ? 'कुल अर्जित देय मजदूरी (Wages Due):' : 'Wages Due (4 days × ₹650):'}
                    </span>
                    <span className="font-mono font-bold text-[#123524] text-sm tabular-nums">
                      ₹2,600
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 px-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#354F52]">
                        {language === 'hi' ? 'ठेकेदार द्वारा दर्ज भुगतान:' : 'Payment Recorded (Contractor):'}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-[#2D6A4F] tabular-nums">
                      ₹1,300
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 px-2.5 rounded-lg bg-[#FAF9F5] border border-[#E3E0D8]">
                    <span className="font-semibold text-[#123524]">
                      {language === 'hi' ? 'कुल शेष बकाया राशि:' : 'Outstanding Balance:'}
                    </span>
                    <span className="font-mono font-bold text-[#C94A29] text-base tabular-nums">
                      ₹1,300
                    </span>
                  </div>
                </div>

                {/* Critical Principle Separation Notice */}
                <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E3E0D8] space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[#123524] font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                    <span>
                      {language === 'hi' ? 'पारदर्शिता नियम: दर्ज भुगतान ≠ नकद प्राप्ति' : 'Core Principle: Recorded Payment ≠ Cash Received'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#52796F] leading-snug">
                    {language === 'hi'
                      ? 'ठेकेदार द्वारा दर्ज भुगतान प्रविष्टि को मजदूर की अभिस्वीकृति के बिना स्वतः प्राप्त नहीं माना जाता। दोनों पक्ष स्वतंत्र रूप से सत्यापन करते हैं।'
                      : 'A payment marked as recorded by a contractor is tracked separately from worker confirmation. It is not treated as money received until the worker acknowledges receipt.'}
                  </p>
                </div>

                {/* Change Traceability & Actions */}
                <div className="pt-2 flex items-center justify-between gap-3 text-xs border-t border-[#E3E0D8]">
                  <div className="text-[11px] text-[#52796F]">
                    <span className="font-mono font-semibold text-[#123524]">Audit Block #004</span> · Hash SHA-256
                  </div>
                  <button
                    onClick={() => {
                      const demoRec = records.find(r => r.id === 'REC-2026-DEMO-4D') || records[0];
                      if (demoRec) {
                        openRecordInspector(demoRec);
                      }
                    }}
                    className="text-xs font-semibold text-[#1B4332] hover:text-[#123524] flex items-center gap-1 transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Inspect Full Calculation</span>
                  </button>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="bg-[#FAF9F5] px-5 py-2.5 border-t border-[#E3E0D8] flex items-center justify-between text-[11px] text-[#52796F]">
                <span>Senior Bal Vigyan Prototype Demonstration</span>
                <button
                  onClick={() => setCurrentView('worker')}
                  className="font-semibold text-[#1B4332] hover:underline"
                >
                  {language === 'hi' ? 'श्रमिक खाता खोलें →' : 'Open Worker View →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four-Step Transparent Workflow Section */}
      <section id="how-it-works" className="space-y-8 scroll-mt-20" aria-labelledby="workflow-heading">
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
            {language === 'hi' ? 'पारदर्शी कार्यप्रणाली' : 'Four-Step Transparent Process'}
          </div>
          <h2 id="workflow-heading" className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi'
              ? 'मजदूरी तय करने से लेकर समाधान तक — हर चरण पारदर्शी'
              : 'How Shram Setu 2.0 Works: From Agreement to Reconciliation'}
          </h2>
          <p className="text-sm text-[#354F52] leading-relaxed">
            {language === 'hi'
              ? 'पारंपरिक मौखिक व्यवस्था की अनिश्चितताओं को समाप्त करने हेतु प्रत्येक चरण को स्वतंत्र और स्पष्ट रखा गया है।'
              : 'Each stage of the daily work lifecycle is recorded independently so neither party can unilaterally alter past agreements.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E3E0D8] space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#52796F] block">01 / STAGE</span>
              <h3 className="font-bold text-base text-[#123524]">
                {language === 'hi' ? '१. मजदूरी दर पर सहमति' : '1. Agree on Wages'}
              </h3>
              <p className="text-xs text-[#354F52] leading-relaxed">
                {language === 'hi'
                  ? 'शिफ्ट शुरू होने से पहले तय दैनिक मजदूरी दर, व्यापार श्रेणी (जैसे राजमिस्त्री, कारपेंटर) और ओवर-टाइम की दर स्पष्ट रूप से तय की जाती है।'
                  : 'Daily wage rate, trade classification, and overtime rate are mutually established before physical work begins, eliminating morning chowk ambiguity.'}
              </p>
            </div>
            <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-[#E3E0D8] text-[11px] font-mono text-[#1B4332]">
              Agreed: ₹650/day · Mason
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E3E0D8] space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#52796F] block">02 / STAGE</span>
              <h3 className="font-bold text-base text-[#123524]">
                {language === 'hi' ? '२. पूरा हुआ कार्य दर्ज करें' : '2. Record Work Completed'}
              </h3>
              <p className="text-xs text-[#354F52] leading-relaxed">
                {language === 'hi'
                  ? 'दिन का कार्य समाप्त होने पर मानक घंटे और अतिरिक्त समय (ओवर-टाइम) दर्ज होते हैं। देय पारिश्रमिक की गणना स्वतः स्पष्ट गणित से की जाती है।'
                  : 'Daily shift hours and overtime are logged into the ledger; total wages due are calculated automatically with full formula transparency.'}
              </p>
            </div>
            <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-[#E3E0D8] text-[11px] font-mono text-[#1B4332]">
              Shift: 8h + 1h OT = ₹750 Due
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E3E0D8] space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#52796F] block">03 / STAGE</span>
              <h3 className="font-bold text-base text-[#123524]">
                {language === 'hi' ? '३. भुगतान का मिलान' : '3. Reconcile Payment'}
              </h3>
              <p className="text-xs text-[#354F52] leading-relaxed">
                {language === 'hi'
                  ? 'ठेकेदार द्वारा दर्ज आंशिक या पूर्ण भुगतान को अलग रखा जाता है। मजदूर द्वारा प्राप्ति की पुष्टि तक बकाया राशि स्पष्ट रूप से दिखती रहती है।'
                  : 'Contractor payment entries remain strictly separate from worker confirmation. Unsettled balances remain visible until acknowledged.'}
              </p>
            </div>
            <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-[#E3E0D8] text-[11px] font-mono text-[#2D6A4F]">
              Paid: ₹500 · Balance Due: ₹250
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E3E0D8] space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#52796F] block">04 / STAGE</span>
              <h3 className="font-bold text-base text-[#123524]">
                {language === 'hi' ? '४. बदलाव जांच व समाधान' : '4. Inspect Changes & Disputes'}
              </h3>
              <p className="text-xs text-[#354F52] leading-relaxed">
                {language === 'hi'
                  ? 'यदि किसी दर या घंटे में संशोधन किया जाए, तो पुराना रिकॉर्ड सुरक्षित रहता है। असहमति होने पर साक्ष्य युक्त विवाद फाइल मध्यस्थता हेतु तैयार होती है।'
                  : 'Any retroactive edit preserves the prior record in an audit trail; disagreements generate structured evidence for community mediation.'}
              </p>
            </div>
            <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-[#E3E0D8] text-[11px] font-mono text-[#C94A29]">
              Audit Trail · Dispute Dossier
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Principles Comparison Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E3E0D8] shadow-sm space-y-8" aria-labelledby="comparison-heading">
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-bold text-[#C94A29] uppercase tracking-wider">
            {language === 'hi' ? 'पारदर्शिता का तुलनात्मक विश्लेषण' : 'The Transparency Paradigm'}
          </div>
          <h2 id="comparison-heading" className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi'
              ? 'पारंपरिक मौखिक व्यवस्था बनाम श्रम सेतु २.०'
              : 'Informal Vulnerabilities vs. Shram Setu 2.0 Transparency'}
          </h2>
          <p className="text-sm text-[#354F52] leading-relaxed">
            {language === 'hi'
              ? 'दैनिक मजदूरी में अधिकांश विवाद कागजी प्रमाण या पारदर्शी रिकॉर्ड के अभाव से उत्पन्न होते हैं।'
              : 'Most wage disagreements among daily-wage workers stem from verbal promises that leave no traceable, explainable record.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informal Status Quo */}
          <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#C94A29]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{language === 'hi' ? 'पारंपरिक मौखिक व्यवस्था (Current Practice)' : 'Current Informal Practice'}</span>
            </div>
            <ul className="space-y-3 text-xs text-[#354F52]">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#C94A29] shrink-0">✕</span>
                <span>
                  <strong>{language === 'hi' ? 'मौखिक वादे:' : 'Verbal Agreements:'}</strong> {language === 'hi' ? 'सुबह चौराहे पर तय की गई दर शाम को बिना किसी प्रमाण के काट ली जाती है।' : 'Morning agreed rates are often renegotiated downward at shift end with zero written accountability.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#C94A29] shrink-0">✕</span>
                <span>
                  <strong>{language === 'hi' ? 'खोई हुई कच्ची पर्ची:' : 'Lost Paper Slips:'}</strong> {language === 'hi' ? 'हाथ से लिखी कच्ची पर्चियां फट जाती हैं, खो जाती हैं या मुंशी द्वारा खारिज कर दी जाती हैं।' : 'Informal paper scraps tear, fade, or are dismissed during weekend settlement.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#C94A29] shrink-0">✕</span>
                <span>
                  <strong>{language === 'hi' ? 'चुपचाप रिकॉर्ड बदलना:' : 'Silent Alterations:'}</strong> {language === 'hi' ? 'ठेकेदार के मस्टर रजिस्टर में की गई कटौतियों का कोई ऑडिट इतिहास नहीं रहता।' : 'Contractor muster sheets can be modified unilaterally without recording original figures.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#C94A29] shrink-0">✕</span>
                <span>
                  <strong>{language === 'hi' ? 'छुपा हुआ विवाद:' : 'Invisible Disagreements:'}</strong> {language === 'hi' ? 'असंगठित मजदूर के पास विवाद के समय प्रस्तुत करने योग्य कोई ठोस साक्ष्य नहीं होता।' : 'Workers have no structured log to present before informal labor panchayats or mediators.'}
                </span>
              </li>
            </ul>
          </div>

          {/* Shram Setu Transparency Principles */}
          <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#2D6A4F]/30 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1B4332]">
              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <span>{language === 'hi' ? 'श्रम सेतु २.० के पारदर्शिता सिद्धांत' : 'Shram Setu 2.0 Transparency Principles'}</span>
            </div>
            <ul className="space-y-3 text-xs text-[#354F52]">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#2D6A4F] shrink-0">✓</span>
                <span>
                  <strong>{language === 'hi' ? 'स्पष्ट गणित:' : 'Explainable Wage Math:'}</strong> {language === 'hi' ? 'प्रत्येक शिफ्ट का कुल पारिश्रमिक तय दर और घंटों से पारदर्शी सूत्र द्वारा निकाला जाता है।' : 'Every wage figure displays its underlying formula (daily rate × days + overtime) for immediate clarity.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#2D6A4F] shrink-0">✓</span>
                <span>
                  <strong>{language === 'hi' ? 'संशोधन का इतिहास:' : 'Immutable Change History:'}</strong> {language === 'hi' ? 'किसी भी प्रविष्टि में बदलाव होने पर मूल मान और संशोधन का कारण हमेशा सुरक्षित रहता है।' : 'Edits do not overwrite prior entries; original values and timestamps remain visible in an audit log.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#2D6A4F] shrink-0">✓</span>
                <span>
                  <strong>{language === 'hi' ? 'स्वतंत्र अभिस्वीकृति:' : 'Separated Confirmation:'}</strong> {language === 'hi' ? 'ठेकेदार द्वारा दर्ज भुगतान तब तक लंबित रहता है जब तक श्रमिक नकद प्राप्ति स्वीकार न करे।' : 'Marking payment on the contractor side does not register as confirmed receipt until worker acknowledgment.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#2D6A4F] shrink-0">✓</span>
                <span>
                  <strong>{language === 'hi' ? 'दृश्यमान विवाद फाइल:' : 'Visible Dispute Dossiers:'}</strong> {language === 'hi' ? 'मतभेद होने पर विवाद को दबाने के बजाय टाइमस्टैम्प युक्त साक्ष्य फाइल में दर्ज किया जाता है।' : 'Disagreements remain visible on both sides with timestamped logs ready for fair community mediation.'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Role-Based Portals Navigator */}
      <section className="space-y-6" aria-labelledby="portals-heading">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
            {language === 'hi' ? 'विशिष्ट पोर्टल एवं कार्य' : 'Dedicated Portals by Role'}
          </div>
          <h2 id="portals-heading" className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi'
              ? 'श्रमिक, ठेकेदार एवं मूल्यांकनकर्ता हेतु सीधे लिंक'
              : 'Direct Access to Worker, Contractor and Verification Views'}
          </h2>
          <p className="text-sm text-[#354F52]">
            {language === 'hi'
              ? 'प्रत्येक हितधारक के लिए निष्पक्ष और उपयोग में सरल इंटरफ़ेस।'
              : 'Explore each role-specific view to test how mutual accountability is maintained in practice.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Worker Portal */}
          <div className="bg-white p-6 rounded-2xl border border-[#E3E0D8] space-y-4 flex flex-col justify-between shadow-xs hover:border-[#1B4332] transition-colors">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] text-[#1B4332] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#123524]">
                {language === 'hi' ? 'श्रमिक पोर्टल (Worker)' : 'Worker Portal'}
              </h3>
              <p className="text-xs text-[#354F52] leading-relaxed">
                {language === 'hi'
                  ? 'अपनी दैनिक उपस्थिति देखें, नई शिफ्ट दर्ज करें, देय व प्राप्त मजदूरी का हिसाब जांचें और प्रिंट करने योग्य पर्ची बनाएं।'
                  : 'Track attendance history, record new shifts, review outstanding balances, generate printable slips, and lodge dispute claims.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('worker')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <span>{language === 'hi' ? 'श्रमिक खाता खोलें' : 'Open Worker Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Contractor Portal */}
          <div className="bg-white p-6 rounded-2xl border border-[#E3E0D8] space-y-4 flex flex-col justify-between shadow-xs hover:border-[#1B4332] transition-colors">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] text-[#1B4332] flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#123524]">
                {language === 'hi' ? 'ठेकेदार मस्टर (Contractor)' : 'Contractor Portal'}
              </h3>
              <p className="text-xs text-[#354F52] leading-relaxed">
                {language === 'hi'
                  ? 'कार्यस्थल पर श्रमिकों की उपस्थिति स्वीकृत करें, नकद भुगतान प्रविष्टियां दर्ज करें और डाउनलोड योग्य मस्टर रोल प्राप्त करें।'
                  : 'Review site rosters, record cash advance disbursements, approve daily muster entries, and export audit-ready CSV reports.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('contractor')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#123524] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <span>{language === 'hi' ? 'ठेकेदार पोर्टल खोलें' : 'Open Contractor Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Audit Verification */}
          <div className="bg-white p-6 rounded-2xl border border-[#E3E0D8] space-y-4 flex flex-col justify-between shadow-xs hover:border-[#C94A29] transition-colors">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FBECE8] text-[#C94A29] flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#123524]">
                {language === 'hi' ? 'ऑडिट व छेड़छाड़ जांच (Audit)' : 'Audit & Tamper Test'}
              </h3>
              <p className="text-xs text-[#354F52] leading-relaxed">
                {language === 'hi'
                  ? 'क्रिप्टोग्राफिक SHA-256 हैश-चेन का परीक्षण करें। पुरानी प्रविष्टि में बदलाव करके देखें कि सिस्टम कैसे तुरंत विसंगति पहचानता है।'
                  : 'Test cryptographic SHA-256 hash chaining on demo data. Alter a past record to see how the system immediately highlights discrepancies.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('audit')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#C94A29] hover:bg-[#B33C1D] rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <span>{language === 'hi' ? 'छेड़छाड़ जांच का परीक्षण' : 'Launch Audit Test'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Offline-First Architecture & Honest Technical Limitations */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E3E0D8] shadow-sm space-y-6" aria-labelledby="tech-heading">
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
            {language === 'hi' ? 'तकनीकी वास्तुकला एवं सीमाएं' : 'Offline-First Design & Prototype Boundaries'}
          </div>
          <h2 id="tech-heading" className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi'
              ? 'ऑफलाइन उपयोग एवं प्रामाणिक वैज्ञानिक सीमाएं'
              : 'Designed for Low-Connectivity Construction Environments'}
          </h2>
          <p className="text-sm text-[#354F52] leading-relaxed">
            {language === 'hi'
              ? 'श्रम सेतु २.० को निर्माण स्थलों के बेसमेंट और दूरदराज के क्षेत्रों के लिए ब्राउज़र-आधारित स्थानीय स्टोरेज के साथ तैयार किया गया है।'
              : 'Engineered with browser-local storage buffers to allow shift recording even when cellular data is unavailable at construction basements.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8EFEA] text-[#1B4332] flex items-center justify-center">
              <WifiOff className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#123524]">
              {language === 'hi' ? 'ब्राउज़र में स्थानीय संग्रहण' : 'Local Browser Storage'}
            </h3>
            <p className="text-xs text-[#52796F] leading-relaxed">
              {language === 'hi'
                ? 'नेटवर्क न होने पर भी शिफ्ट प्रविष्टियां स्थानीय मेमोरी (localStorage/IndexedDB) में सुरक्षित रहती हैं और कनेक्टिविटी लौटने पर सिंक की जा सकती हैं।'
                : 'Shift records are captured in local browser storage so work is never lost due to dropped network connections.'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8EFEA] text-[#1B4332] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#123524]">
              {language === 'hi' ? 'SHA-256 हैश लिंकेज' : 'SHA-256 Audit Trail'}
            </h3>
            <p className="text-xs text-[#52796F] leading-relaxed">
              {language === 'hi'
                ? 'प्रत्येक नया दिन पिछले रिकॉर्ड के हैश से जुड़ता है। यदि किसी पुरानी प्रविष्टि को बदला जाए, तो हैश बेमेल होने से विसंगति तुरंत पहचानी जाती है।'
                : 'Each recorded shift links cryptographically to the prior entry’s hash, making retroactive modifications detectable in the browser audit bench.'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FBECE8] text-[#C94A29] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#123524]">
              {language === 'hi' ? 'स्पष्ट प्रोटोटाइप सीमाएं' : 'Stated System Limitations'}
            </h3>
            <p className="text-xs text-[#52796F] leading-relaxed">
              {language === 'hi'
                ? 'यह प्रणाली भौतिक उपस्थिति या वास्तविक नकद हस्तांतरण की पूर्ण गारंटी नहीं देती, न ही यह कानूनी अदालत का विकल्प है। यह केवल मध्यस्थता हेतु प्रामाणिक साक्ष्य रिकॉर्ड तैयार करती है।'
                : 'The system does not claim to prove physical bodily presence or guarantee cash recovery; it provides structured, traceable evidence for informal mediation.'}
            </p>
          </div>
        </div>
      </section>

      {/* Senior Bal Vigyan Student Innovation & Research Section */}
      <section className="bg-[#FAF9F5] rounded-2xl p-6 sm:p-10 border border-[#E3E0D8] space-y-6" aria-labelledby="research-heading">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332]">
            <span>{language === 'hi' ? 'सीनियर बाल विज्ञान शोध परियोजना' : 'Senior Bal Vigyan Research Project'}</span>
            <span aria-hidden="true" className="text-[#8EA89D]">·</span>
            <span>Indore Sahodaya Computer Science</span>
          </div>

          <h2 id="research-heading" className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi'
              ? 'वैज्ञानिक ईमानदारी एवं अकादमिक नवाचार'
              : 'Scientific Integrity: Practical Innovation for Civic Good'}
          </h2>

          <p className="text-xs sm:text-sm text-[#354F52] leading-relaxed">
            {language === 'hi'
              ? 'श्रम सेतु २.० को इंदौर के दैनिक मजदूरी चौराहों (जैसे गीता भवन, मालवा मिल) पर श्रमिकों के सामने आने वाली मौखिक अनिश्चितताओं को समझने के पश्चात एक विद्यार्थी नवाचार के रूप में तैयार किया गया है। यह प्रोजेक्ट संयुक्त राष्ट्र सतत विकास लक्ष्य ८ (सभ्य कार्य) एवं १० (असमानता में कमी) से संरेखित है।'
              : 'Developed for the Senior Bal Vigyan Computer Science competition, Shram Setu 2.0 addresses informal labor precarity through deterministic software design. All worker profiles and logs in this demonstration are simulated demo data to demonstrate system architecture without compromising worker privacy.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setCurrentView('project')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-lg transition-colors flex items-center gap-2 min-h-[40px]"
            >
              <span>{language === 'hi' ? 'सम्पूर्ण शोध प्रपत्र व कार्यप्रणाली पढ़ें' : 'Read Full Research Methodology & Paper'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setCurrentView('pass')}
              className="px-4 py-2.5 text-xs font-semibold text-[#123524] bg-white hover:bg-[#E8EFEA] border border-[#E3E0D8] rounded-lg transition-colors flex items-center gap-1.5 min-h-[40px]"
            >
              <QrCode className="w-3.5 h-3.5 text-[#52796F]" />
              <span>{language === 'hi' ? 'प्रिंट करने योग्य वर्क पास देखें' : 'View Printable Work Pass'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
