import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  QrCode,
  ArrowRight,
  TrendingUp,
  MapPin,
  Compass,
  Users,
  Smartphone,
  Building
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setCurrentView, setActiveJudgeTourStep, language } = useApp();

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332]">
              <span className="w-2 h-2 rounded-full bg-[#E06D53]"></span>
              <span>{language === 'hi' ? 'सीनियर बाल विज्ञान २०२६ नवाचार · इंदौर (म.प्र.)' : 'Senior Bal Vigyan Innovation · Indore (M.P.)'}</span>
              <span aria-hidden="true" className="text-[#8EA89D]">·</span>
              <span className="text-[#52796F]">SDG 8 &amp; 10</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123524] tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              {language === 'hi'
                ? 'असंगठित श्रमिकों के लिए प्रामाणिक डिजिटल कार्य एवं मजदूरी सुरक्षा'
                : 'Protecting Daily Wages Through Verifiable Digital Work Records'}
            </h1>

            <p className="text-base sm:text-lg text-[#354F52] leading-relaxed max-w-2xl">
              {language === 'hi'
                ? 'इंदौर के निर्माण एवं दैनिक मजदूरी चौराहों के लिए तैयार किया गया नवाचार। मौखिक समझौतों, मनमानी कटौती और खोई हुई कच्ची पर्चियों की जगह पारदर्शी डिजिटल लेजर व वर्क पास।'
                : 'A student innovation engineered to eliminate verbal wage disputes, unrecorded overtime, and informal slip losses through tamper-evident digital attendance ledgers and verified work passports.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('worker')}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <span>{language === 'hi' ? 'श्रमिक पोर्टल देखें' : 'Explore Worker Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveJudgeTourStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 text-sm font-semibold text-[#1B4332] bg-[#E8EFEA] hover:bg-[#D5E4D9] rounded-xl transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#E06D53]" />
                <span>{language === 'hi' ? 'निर्णायक मंडल टूर (7 चरण)' : 'Judges\' 7-Step Tour'}</span>
              </button>
            </div>

            {/* Key Value Proof Bar */}
            <div className="pt-4 border-t border-[#E3E0D8] grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#123524] block">
                  124
                </span>
                <span className="text-[#52796F] text-[11px] leading-tight block">
                  {language === 'hi' ? 'इंदौर में सर्वेक्षित श्रमिक' : 'Indore Workers Surveyed'}
                </span>
              </div>
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#E06D53] block">
                  84%
                </span>
                <span className="text-[#52796F] text-[11px] leading-tight block">
                  {language === 'hi' ? 'मजदूरी कटौती का सामना' : 'Face Arbitrary Wage Cuts'}
                </span>
              </div>
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#2D6A4F] block">
                  100%
                </span>
                <span className="text-[#52796F] text-[11px] leading-tight block">
                  {language === 'hi' ? 'छेड़छाड़-पहचान हैश लेजर' : 'Tamper-Evident Hash Trail'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 flex items-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#D5D2C8] shadow-lg bg-[#EAE8E0]">
              <img
                src="/src/assets/images/hero_shram_setu_1791907769539.jpg"
                alt="Construction worker in Indore reviewing digital work records on site"
                className="w-full h-80 sm:h-96 lg:h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 text-white">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Field Validation: Vijay Nagar &amp; Geeta Bhawan Sites</span>
                </div>
                <p className="text-xs text-white/90 leading-snug">
                  Senior Mason Ramesh Verma with authentic digital shift logs and agreed wage rate register.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Problem Breakdown */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E3E0D8] shadow-sm">
        <div className="max-w-3xl space-y-3 mb-8">
          <div className="text-xs font-bold text-[#E06D53] uppercase tracking-wider">
            {language === 'hi' ? 'समस्या विश्लेषण एवं जमीनी हकीकत' : 'The Informal Labor Vulnerability'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi'
              ? 'दैनिक मजदूरों के सामने आने वाली मुख्य समस्याएं'
              : 'Why 450+ Million Informal Workers Face Wage Insecurity'}
          </h2>
          <p className="text-sm text-[#405D53] leading-relaxed">
            {language === 'hi'
              ? 'इंदौर के प्रमुख लेबर चौराहों (गीता भवन, मालवा मिल, राजवाड़ा) पर किए गए प्राथमिक शोध में पाया गया कि श्रमिकों और ठेकेदारों के बीच विवाद व्यवस्था की कमी के कारण होते हैं:'
              : 'Our field study across Indore’s morning labor mandis identified systemic vulnerabilities that arise from the lack of simple, accessible record-keeping:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-[#C94A29] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-[#123524]">
              {language === 'hi' ? 'मौखिक समझौते व कच्ची पर्ची' : 'Verbal Contracts & Fragile Slips'}
            </h3>
            <p className="text-xs text-[#52796F] leading-relaxed">
              {language === 'hi'
                ? 'सुबह चौराहे पर तय की गई मजदूरी शाम को मुंशी द्वारा ₹100-₹200 कम कर दी जाती है। मजदूर के पास तय दर का कोई लिखित प्रमाण नहीं होता।'
                : 'Agreed daily rates (₹650) negotiated at the morning chowk are often cut at shift end to ₹400-₹500. Informal paper scraps (kachhi parchi) tear, fade, or get misplaced.'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#B87A14] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-[#123524]">
              {language === 'hi' ? 'अनअकाउंटेड ओवर-टाइम' : 'Unrecorded Overtime Hours'}
            </h3>
            <p className="text-xs text-[#52796F] leading-relaxed">
              {language === 'hi'
                ? '8 घंटे की शिफ्ट के बाद 2 घंटे अतिरिक्त काम करने पर भी रजिस्टर में केवल सामान्य 1 हाजिरी दर्ज होती है, जिससे श्रमिक का वैध हक छूट जाता है।'
                : 'Extra hours worked after the standard 8-hour shift are rarely documented on contractor muster rolls, resulting in uncompensated labor.'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D8] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#2D6A4F] flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-[#123524]">
              {language === 'hi' ? 'अनुभव का शून्य प्रमाण' : 'No Recognized Experience Proof'}
            </h3>
            <p className="text-xs text-[#52796F] leading-relaxed">
              {language === 'hi'
                ? '10 वर्षों से कुशल कारीगरी करने वाले राजमिस्त्री भी नई साइट पर जाने पर अकुशल मजदूर जैसी दर पर काम करने को मजबूर होते हैं।'
                : 'A skilled mason with a decade of expertise cannot prove past projects to new builders, preventing fair wage bargaining and wage progression.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
            {language === 'hi' ? 'सरल एवं व्यावहारिक कार्यप्रणाली' : 'How Shram Setu 2.0 Works'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#123524] tracking-tight">
            {language === 'hi'
              ? 'तीन सरल चरणों में विवाद-मुक्त दैनिक मजदूरी'
              : 'A Simple Three-Step Record for Every Worker'}
          </h2>
          <p className="text-sm text-[#405D53]">
            {language === 'hi'
              ? 'किसी जटिल ऑपरेटिंग सिस्टम की आवश्यकता नहीं — साधारण मोबाइल ब्राउज़र या कार्ड टैप पर संचालित।'
              : 'No complicated operating systems required — works seamlessly on ordinary mobile browsers and contactless cards.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#D5D2C8] relative">
            <span className="text-xs font-mono font-bold text-[#52796F] block mb-2">STEP 01</span>
            <h3 className="text-lg font-bold text-[#123524] mb-2">
              {language === 'hi' ? 'शिफ्ट चेक-इन व दर निर्धारण' : 'Morning Check-In & Rate Lock'}
            </h3>
            <p className="text-xs text-[#354F52] leading-relaxed mb-4">
              {language === 'hi'
                ? 'सुबह साइट पर आते ही डिजिटल वर्क पास से हाजिरी दर्ज होती है और दिन की तय दिहाड़ी (जैसे ₹650) दोनों पक्षों की सहमति से लॉक हो जाती है।'
                : 'Worker and contractor confirm the start time, trade category, and agreed daily rate (e.g., ₹650) at shift commencement.'}
            </p>
            <div className="p-3 bg-white rounded-lg border border-[#E3E0D8] text-[11px] font-mono text-[#1B4332]">
              Check-in: 08:00 AM · Agreed Rate: ₹650/day
            </div>
          </div>

          <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#D5D2C8] relative">
            <span className="text-xs font-mono font-bold text-[#52796F] block mb-2">STEP 02</span>
            <h3 className="text-lg font-bold text-[#123524] mb-2">
              {language === 'hi' ? 'छेड़छाड़-मुक्त पारदर्शी लेजर' : 'Tamper-Evident Daily Ledger'}
            </h3>
            <p className="text-xs text-[#354F52] leading-relaxed mb-4">
              {language === 'hi'
                ? 'शाम को अर्जित मजदूरी, दिया गया नकद और शेष बकाया तुरंत डिजिटल पर्ची में दर्ज होता है। पिछले रिकॉर्ड से हैश जुड़ जाता है।'
                : 'Earned wages, overtime, partial cash advances, and balance due are updated instantly with cryptographic SHA-256 block linking.'}
            </p>
            <div className="p-3 bg-white rounded-lg border border-[#E3E0D8] text-[11px] font-mono text-[#2D6A4F]">
              Earned: ₹750 · Paid: ₹500 · Balance: ₹250
            </div>
          </div>

          <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#D5D2C8] relative">
            <span className="text-xs font-mono font-bold text-[#52796F] block mb-2">STEP 03</span>
            <h3 className="text-lg font-bold text-[#123524] mb-2">
              {language === 'hi' ? 'डिजिटल पर्ची व विवाद सहायता' : 'Evidence Dossier & Skills'}
            </h3>
            <p className="text-xs text-[#354F52] leading-relaxed mb-4">
              {language === 'hi'
                ? 'यदि ठेकेदार बाद में कटौती करे, तो एक क्लिक में टाइमस्टैम्प युक्त साक्ष्य फाइल बन जाती है। साथ ही कौशल पासपोर्ट में अनुभव जुड़ता है।'
                : 'If a discrepancy occurs, structured evidence is organized for mediation. All verified days accumulate into a portable skills passport.'}
            </p>
            <div className="p-3 bg-white rounded-lg border border-[#E3E0D8] text-[11px] font-mono text-[#E06D53]">
              Dispute Dossier: Evidence Verified &amp; Signed
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Portal Selector for 3 Audiences */}
      <section className="bg-[#123524] text-white rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-2xl space-y-2 mb-8">
          <div className="text-xs font-semibold text-[#88D49E] uppercase tracking-wider">
            {language === 'hi' ? 'तीन प्रमुख हितधारक पोर्टल' : 'Explore Portals by Role'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {language === 'hi'
              ? 'श्रमिक, ठेकेदार एवं मूल्यांकनकर्ता के लिए अलग दृश्य'
              : 'Tailored Portals for Workers, Contractors & Judges'}
          </h2>
          <p className="text-xs sm:text-sm text-[#C5D6BF]">
            {language === 'hi'
              ? 'प्रणाली की निष्पक्षता दोनों पक्षों के रिकॉर्ड संरेखण पर आधारित है।'
              : 'Dual-party transparency ensures mutual accountability without single-sided alteration.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Worker Card */}
          <div className="bg-[#1B4332] p-6 rounded-xl border border-[#2D6A4F] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">
                {language === 'hi' ? 'श्रमिक पोर्टल (Worker)' : 'Worker Portal'}
              </h3>
              <p className="text-xs text-[#C5D6BF] leading-relaxed">
                {language === 'hi'
                  ? 'अपनी दैनिक उपस्थिति, तय दर, अर्जित मजदूरी, प्राप्त भुगतान, बकाया राशि और डिजिटल कार्य पर्ची देखें।'
                  : 'View attendance history, track outstanding balances, record new shifts, generate printable slips, and lodge dispute claims.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('worker')}
              className="w-full py-2.5 text-xs font-semibold text-[#123524] bg-white hover:bg-[#E8EFEA] rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{language === 'hi' ? 'श्रमिक खाता खोलें' : 'Open Worker View'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Contractor Card */}
          <div className="bg-[#1B4332] p-6 rounded-xl border border-[#2D6A4F] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">
                {language === 'hi' ? 'ठेकेदार मस्टर (Contractor)' : 'Contractor Portal'}
              </h3>
              <p className="text-xs text-[#C5D6BF] leading-relaxed">
                {language === 'hi'
                  ? 'सक्रिय श्रमिकों की सूची, साइट उपस्थिति अनुमोदन, पारदर्शी भुगतान प्रविष्टियां और डाउनलोड योग्य मस्टर रिपोर्ट।'
                  : 'Supervise site rosters, disburse cash advances with recorded receipts, approve muster entries, and export CSV reports.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('contractor')}
              className="w-full py-2.5 text-xs font-semibold text-[#123524] bg-white hover:bg-[#E8EFEA] rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{language === 'hi' ? 'ठेकेदार खाता खोलें' : 'Open Contractor View'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Evaluator Card */}
          <div className="bg-[#1B4332] p-6 rounded-xl border border-[#2D6A4F] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#E06D53] flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">
                {language === 'hi' ? 'बाल विज्ञान निर्णायक (Judges)' : 'Judges & Evaluators'}
              </h3>
              <p className="text-xs text-[#C5D6BF] leading-relaxed">
                {language === 'hi'
                  ? 'क्रिप्टोग्राफिक हैश-चेन छेड़छाड़ जांच का परीक्षण करें, शोध पत्र पढ़ें और प्रोटोटाइप की सीमाओं को समझें।'
                  : 'Test the cryptographic hash tamper-detection bench, inspect Indore field survey metrics, and review the student research paper.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('audit')}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#E06D53] hover:bg-[#C95B42] rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{language === 'hi' ? 'ऑडिट जांच का परीक्षण' : 'Launch Tamper Test'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Bal Vigyan Field Study & Honest Science Focus */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E3E0D8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-xl overflow-hidden border border-[#D5D2C8] shadow-sm">
              <img
                src="/src/assets/images/bal_vigyan_field_work_1791907815679.jpg"
                alt="Bal Vigyan student field research in Madhya Pradesh with site mason"
                className="w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
            <div className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
              {language === 'hi' ? 'विद्यार्थी शोध प्रपत्र · सीनियर बाल विज्ञान' : 'Senior Bal Vigyan Field Research'}
            </div>
            <h2 className="text-2xl font-bold text-[#123524] tracking-tight">
              {language === 'hi'
                ? 'नवाचार की प्रामाणिकता एवं वैज्ञानिक ईमानदारी'
                : 'Scientific Integrity & Prototype Transparency'}
            </h2>
            <p className="text-xs sm:text-sm text-[#405D53] leading-relaxed">
              {language === 'hi'
                ? 'श्रम सेतु २.० किसी काल्पनिक तकनीक या अतिशयोक्ति पर आधारित नहीं है। हमने स्पष्ट किया है कि वर्तमान प्रोटोटाइप में क्या कार्य करता है (लोकल इंडेक्स्ड लेजर, हैश-चेन, डिजिटल पर्ची) और भविष्य के पायलट में किन हार्डवेयर घटकों की आवश्यकता होगी।'
                : 'In keeping with the scientific ethos of Senior Bal Vigyan, we maintain strict honesty: the platform operates on deterministic SHA-256 hash chaining, dual-party dispute logging, and offline-resilient browser storage. We do not make false claims of government pre-approval or automated legal recovery.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('project')}
                className="text-xs font-semibold text-[#1B4332] hover:text-[#2D6A4F] flex items-center gap-1.5"
              >
                <span>{language === 'hi' ? 'सम्पूर्ण शोध पत्र एवं सीमाएं पढ़ें' : 'Read Full Research Methodology & Survey'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
