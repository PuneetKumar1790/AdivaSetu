import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  aiAssistantService,
  AssistantLanguage,
  ChatMessage,
  SUPPORTED_LANGUAGES,
  getLanguageMeta,
} from '../../services/aiAssistantService';
import { useLanguage } from '../../context/LanguageContext';
import { AppLanguage } from '../../i18n/translations';
import {
  Sparkles,
  X,
  Send,
  Paperclip,
  FileText,
  FileCheck2,
  Trash2,
  Maximize2,
  Minimize2,
  ArrowRight,
  Globe2,
  Bot,
  User,
  ShieldCheck,
} from 'lucide-react';

const INITIAL_MESSAGES: Record<AssistantLanguage, ChatMessage[]> = {
  auto: [
    {
      id: 'welcome-auto',
      sender: 'assistant',
      text:
        `Namaste! I am **AdivaSetu Saathi (अदिवा सेतु साथी)**, your official AI Fellowship Guide for the Ministry of Tribal Affairs (MoTA).\n\n` +
        `🌍 **All Indian Languages Supported:** You can type in **any language or script** (Odia, Bengali, Hindi, Marathi, Telugu, Tamil, Gujarati, Assamese, Santhali, Kannada, Malayalam, Punjabi, Urdu, Hinglish, or English) — I will understand and reply in your language!\n\n` +
        `How can I assist you with NFST Ph.D. fellowships, NOS foreign studies, or document checks today?`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Check NOS Eligibility', actionType: 'query', target: 'Can I apply for the National Overseas Scholarship (NOS)?' },
        { label: 'Audit Income Certificate', actionType: 'query', target: 'Is my income certificate valid for FY 2026-27?' },
        { label: 'NFST Ph.D Guidelines', actionType: 'query', target: 'What are the rules and stipend for NFST Ph.D fellowship?' },
      ],
    },
  ],
  en: [
    {
      id: 'welcome-en',
      sender: 'assistant',
      text:
        `Hello! I am **AdivaSetu Saathi (अदिवा सेतु साथी)**, your official AI Fellowship and Scholarship Assistant.\n\n` +
        `I can help you check **NFST (Ph.D.) & NOS (Overseas)** rules, audit uploaded certificates, or check your DBT stipend schedules. How can I help you today?`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Check NOS Eligibility', actionType: 'query', target: 'Can I apply for the National Overseas Scholarship (NOS)?' },
        { label: 'Audit Income Certificate', actionType: 'query', target: 'Is my income certificate valid for FY 2026-27?' },
        { label: 'NFST Ph.D Guidelines', actionType: 'query', target: 'What are the rules and stipend for NFST Ph.D fellowship?' },
      ],
    },
  ],
  hi: [
    {
      id: 'welcome-hi',
      sender: 'assistant',
      text:
        `नमस्ते! मैं **अदिवा सेतु साथी (AdivaSetu Saathi)** हूँ, आपका डिजिटल छात्रवृत्ति और शोध अध्येतावृत्ति सहायक।\n\n` +
        `मैं आपकी **NFST (Ph.D.) और NOS (विदेशी छात्रवृत्ति)** के नियम समझने, अपने प्रमाण पत्रों की वैधता परखने, और DBT छात्रवृत्ति की स्थिति जानने में सहायता कर सकता हूँ।`,
      timestamp: 'अभी',
      suggestedActions: [
        { label: 'NOS विदेशी छात्रवृत्ति नियम', actionType: 'query', target: 'NOS विदेशी छात्रवृत्ति के लिए क्या योग्यता चाहिए?' },
        { label: 'आय प्रमाण पत्र वैधता जांचें', actionType: 'query', target: 'क्या मेरा आय प्रमाण पत्र 2026-27 के लिए मान्य है?' },
        { label: 'NFST शोध अध्येतावृत्ति', actionType: 'query', target: 'NFST Ph.D के लिए कितनी छात्रवृत्ति और कौन से दस्तावेज चाहिए?' },
      ],
    },
  ],
  hinglish: [
    {
      id: 'welcome-hinglish',
      sender: 'assistant',
      text:
        `Namaste! Main hoon **AdivaSetu Saathi**, aapka official AI fellowship guide.\n\n` +
        `Aap mujhse **NFST (Ph.D) & NOS (Abroad)** ke eligibility rules pooch sakte hain, ya apna income/caste certificate upload karke verify karwa sakte hain.`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'NOS Overseas Eligibility', actionType: 'query', target: 'Kya main NOS overseas scholarship ke liye eligible hoon?' },
        { label: 'Income Certificate Check', actionType: 'query', target: 'Mera income certificate financial year 2026-27 ke liye valid hai?' },
        { label: 'NFST Ph.D Stipend', actionType: 'query', target: 'NFST Ph.D me monthly kitna stipend milta hai?' },
      ],
    },
  ],
  or: [
    {
      id: 'welcome-or',
      sender: 'assistant',
      text:
        `ନମସ୍କାର! ମୁଁ **ଅଦିବା ସେତୁ ସାଥୀ (AdivaSetu Saathi)**, ଜନଜାତି ବ୍ୟାପାର ମନ୍ତ୍ରଣାଳୟ (MoTA) ର ଅଫିସିଆଲ୍ AI ଫେଲୋସିପ୍ ଏବଂ ଛାତ୍ରବୃତ୍ତି ସହାୟକ।\n\n` +
        `ମୁଁ ଆପଣଙ୍କୁ **NFST (Ph.D.) ଏବଂ NOS (ବିଦେଶୀ ଛାତ୍ରବୃତ୍ତି)** ର ନିୟମ ବୁଝିବାରେ, ଆପଣଙ୍କ ଆୟ ଓ ଜାତି ପ୍ରମାଣପତ୍ର ଯାଞ୍ଚ କରିବାରେ, ଏବଂ DBT ଛାତ୍ରବୃତ୍ତି ସ୍ଥିତି ଜାଣିବାରେ ସାହାଯ୍ୟ କରିପାରିବି।`,
      timestamp: 'ଏବେ',
      suggestedActions: [
        { label: 'NOS ବିଦେଶୀ ଛାତ୍ରବୃତ୍ତି ଯୋଗ୍ୟତା', actionType: 'query', target: 'ମୁଁ କଣ NOS ବିଦେଶୀ ଛାତ୍ରବୃତ୍ତି ପାଇଁ ଆବେଦନ କରିପାରିବି?' },
        { label: 'ଆୟ ପ୍ରମାଣପତ୍ର ଯାଞ୍ଚ', actionType: 'query', target: 'ମୋର ଆୟ ପ୍ରମାଣପତ୍ର କଣ FY 2026-27 ପାଇଁ ବୈଧ ଅଟେ?' },
        { label: 'NFST Ph.D ଫେଲୋସିପ୍ ନିୟମ', actionType: 'query', target: 'NFST Ph.D ଫେଲୋସିପ୍ ନିୟମ ଏବଂ ଷ୍ଟାଇପେଣ୍ଡ କେତେ?' },
      ],
    },
  ],
  bn: [
    {
      id: 'welcome-bn',
      sender: 'assistant',
      text:
        `নমস্কার! আমি **আদিবাসেতু সাথী (AdivaSetu Saathi)**, উপজাতি বিষয়ক মন্ত্রক (MoTA)-এর অফিসিয়াল AI ফেলোশিপ ও স্কলারশিপ সহকারী।\n\n` +
        `আমি আপনাকে **NFST (Ph.D.) ও NOS (বিদেশী স্কলারশিপ)**-এর নিয়মাবলী, জাতি ও আয় শংসাপত্র নিরীক্ষা এবং DBT ফেলোশিপের তথ্য পেতে সাহায্য করতে পারি।`,
      timestamp: 'এখন',
      suggestedActions: [
        { label: 'NOS স্কলারশিপের যোগ্যতা', actionType: 'query', target: 'আমি কি ন্যাশনাল ওভারসিজ স্কলারশিপ (NOS)-এর জন্য যোগ্য?' },
        { label: 'আয় শংসাপত্র যাচাই', actionType: 'query', target: 'আমার পারিবারিক আয় শংসাপত্র কি বৈধ?' },
        { label: 'NFST Ph.D ফেলোশিপ নিয়ম', actionType: 'query', target: 'NFST Ph.D ফেলোশিপের নিয়ম ও মাসিক ভাতা কত?' },
      ],
    },
  ],
  mr: [
    {
      id: 'welcome-mr',
      sender: 'assistant',
      text:
        `नमस्कार! मी **अदिवासेतू साथी (AdivaSetu Saathi)**, आदिवासी कार्य मंत्रालय (MoTA) चा अधिकृत AI फेलोशिप आणि शिष्यवृत्ती मार्गदर्शक आहे.\n\n` +
        `मी तुम्हाला **NFST (Ph.D.) आणि NOS (परदेशी शिष्यवृत्ती)** चे नियम समजून घेण्यात, प्रमाणपत्रांची पूर्व-पडताळणी करण्यात आणि DBT शिष्यवृत्ती स्थिती तपासण्यात मदत करू शकतो.`,
      timestamp: 'आत्ताच',
      suggestedActions: [
        { label: 'NOS परदेशी शिष्यवृत्ती पात्रता', actionType: 'query', target: 'मी NOS परदेशी शिष्यवृत्तीसाठी अर्ज करू शकतो का?' },
        { label: 'उत्पन्न प्रमाणपत्र तपासणी', actionType: 'query', target: 'माझे उत्पन्न प्रमाणपत्र चालू वर्षासाठी वैध आहे का?' },
        { label: 'NFST Ph.D नियम व विद्यावेतन', actionType: 'query', target: 'NFST Ph.D फेलोशिपचे नियम आणि विद्यावेतन किती आहे?' },
      ],
    },
  ],
  te: [
    {
      id: 'welcome-te',
      sender: 'assistant',
      text:
        `నమస్కారం! నేను **అదివా సేతు సాథి (AdivaSetu Saathi)**, గిరిజన వ్యవహారాల మంత్రిత్వ శాఖ (MoTA) అధికారిక AI ఫెలోషిప్ & స్కాలర్‌షిప్ సహాయకుడిని.\n\n` +
        `నేను మీకు **NFST (Ph.D.) మరియు NOS (విదేశీ విద్య)** నియమాలు, ధ్రువపత్రాల పరిశీలన మరియు DBT స్టైపెండ్ వివరాలలో సహాయం చేయగలను.`,
      timestamp: 'ఇప్పుడే',
      suggestedActions: [
        { label: 'NOS విదేశీ స్కాలర్‌షిప్ అర్హత', actionType: 'query', target: 'నేను NOS విదేశీ స్కాలర్‌షిప్‌కు దరఖాస్తు చేసుకోవచ్చా?' },
        { label: 'ఆదాయ ధ్రువీకరణ పత్రం పరిశీలన', actionType: 'query', target: 'నా ఆదాయ ధ్రువీకరణ పత్రం చెల్లుబాటు అవుతుందా?' },
        { label: 'NFST Ph.D నిబంధనలు & స్టైపెండ్', actionType: 'query', target: 'NFST Ph.D ఫెలోషిప్ నియమాలు మరియు నెలకు స్టైపెండ్ ఎంత?' },
      ],
    },
  ],
  ta: [
    {
      id: 'welcome-ta',
      sender: 'assistant',
      text:
        `வணக்கம்! நான் **அதிவாசேது சாதி (AdivaSetu Saathi)**, பழங்குடியினர் விவகார அமைச்சகத்தின் (MoTA) அதிகாரப்பூர்வ AI கல்வி உதவித்தொகை வழிகாட்டி.\n\n` +
        `**NFST (Ph.D.) மற்றும் NOS (வெளிநாட்டு படிப்பு)** விதிகள், சான்றிதழ் சரிபார்ப்பு மற்றும் DBT உதவித்தொகை தகவல்களில் உங்களுக்கு உதவ முடியும்.`,
      timestamp: 'இப்போது',
      suggestedActions: [
        { label: 'NOS வெளிநாட்டு கல்வி தகுதி', actionType: 'query', target: 'நான் NOS வெளிநாட்டு உதவித்தொகைக்கு விண்ணப்பிக்கலாமா?' },
        { label: 'வருமானச் சான்றிதழ் சரிபார்ப்பு', actionType: 'query', target: 'எனது வருமானச் சான்றிதழ் சரியானதா?' },
        { label: 'NFST Ph.D உதவித்தொகை விவரம்', actionType: 'query', target: 'NFST Ph.D உதவித்தொகை விதிகள் மற்றும் மாதாந்திர தொகை என்ன?' },
      ],
    },
  ],
  gu: [
    {
      id: 'welcome-gu',
      sender: 'assistant',
      text:
        `નમસ્તે! હું **અદિવાસેતુ સાથી (AdivaSetu Saathi)** છું, આદિજાતિ બાબતોના મંત્રાલય (MoTA) નો સત્તાવાર AI ફેલોશિપ સહાયક.\n\n` +
        `હું તમને **NFST (Ph.D.) અને NOS (વિદેશ અભ્યાસ)** ના નિયમો સમજવામાં અને દસ્તાવેજોની ચકાસણીમાં સહાય કરી શકું છું.`,
      timestamp: 'હમણાં',
      suggestedActions: [
        { label: 'NOS વિદેશ સ્કોલરશિપ યોગ્યતા', actionType: 'query', target: 'શું હું NOS વિદેશ અભ્યાસ માટે અરજી કરી શકું?' },
        { label: 'આવક પ્રમાણપત્ર ચકાસો', actionType: 'query', target: 'શું મારું આવક પ્રમાણપત્ર માન્ય છે?' },
        { label: 'NFST Ph.D નિયમો અને સહાય', actionType: 'query', target: 'NFST Ph.D ફેલોશિપના નિયમો અને સ્ટાઈપેન્ડ શું છે?' },
      ],
    },
  ],
  as: [
    {
      id: 'welcome-as',
      sender: 'assistant',
      text:
        `নমস্কাৰ! মই **আদিবাসেতু সাথী (AdivaSetu Saathi)**, জনজাতীয় পৰিক্ৰমা মন্ত্ৰালয়ৰ (MoTA) আনুষ্ঠানিক AI ফেল’শ্বিপ সহায়ক।\n\n` +
        `মই আপোনাক **NFST (Ph.D.) আৰু NOS (বিদেশী বৃত্তি)** সম্পৰ্কীয় নিয়ম বুজাত আৰু প্ৰমাণপত্ৰ পৰীক্ষা কৰাত সহায় কৰিব পাৰোঁ।`,
      timestamp: 'এতিয়া',
      suggestedActions: [
        { label: 'NOS বিদেশী বৃত্তি অৰ্হতা', actionType: 'query', target: 'মই NOS বিদেশী বৃত্তিৰ বাবে আবেদন কৰিব পাৰিমনে?' },
        { label: 'আয়ৰ প্ৰমাণপত্ৰ পৰীক্ষা', actionType: 'query', target: 'মোৰ আয়ৰ প্ৰমাণপত্ৰ বৈধনে?' },
        { label: 'NFST Ph.D ফেল’শ্বিপ নিয়ম', actionType: 'query', target: 'NFST Ph.D ফেল’শ্বিপৰ নিয়ম আৰু মাহেকীয়া অনুদান কিমান?' },
      ],
    },
  ],
  kn: [
    {
      id: 'welcome-kn',
      sender: 'assistant',
      text:
        `ನಮಸ್ಕಾರ! ನಾನು **ಅದಿವಾಸೇತು ಸಾಥಿ (AdivaSetu Saathi)**, ಬುಡಕಟ್ಟು ವ್ಯವಹಾರಗಳ ಸಚಿವಾಲಯದ (MoTA) ಅಧಿಕೃತ AI ಫೆಲೋಶಿಪ್ ಮಾರ್ಗದರ್ಶಿ.\n\n` +
        `ನಾನು ನಿಮಗೆ **NFST (Ph.D.) ಮತ್ತು NOS (ವಿದೇಶಿ ವಿದ್ಯಾರ್ಥಿವೇತನ)** ನಿಯಮಗಳು ಮತ್ತು ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆಯಲ್ಲಿ ನೆರವಾಗಬಲ್ಲೆ.`,
      timestamp: 'ಈಗಷ್ಟೇ',
      suggestedActions: [
        { label: 'NOS ವಿದೇಶಿ ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಹತೆ', actionType: 'query', target: 'ನಾನು NOS ವಿದೇಶಿ ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದೇ?' },
        { label: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಪರಿಶೀಲನೆ', actionType: 'query', target: 'ನನ್ನ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಮಾನ್ಯವಾಗಿದೆಯೇ?' },
        { label: 'NFST Ph.D ನಿಯಮಗಳು & ಸ್ಟೈಪೆಂಡ್', actionType: 'query', target: 'NFST Ph.D ಫೆಲೋಶಿಪ್ ನಿಯಮಗಳು ಮತ್ತು ಸ್ಟೈಪೆಂಡ್ ಎಷ್ಟು?' },
      ],
    },
  ],
  ml: [
    {
      id: 'welcome-ml',
      sender: 'assistant',
      text:
        `നമസ്കാരം! ഞാൻ **അദിവാസേതു സാഥി (AdivaSetu Saathi)**, പട്ടികവർഗ്ഗ മന്ത്രാലയത്തിന്റെ (MoTA) ഔദ്യോഗിക AI ഫെലോഷിപ്പ് ഗൈഡ്.\n\n` +
        `**NFST (Ph.D.), NOS (വിദേശ സ്കോളർഷിപ്പ്)** എന്നിവയുടെ നിബന്ധനകൾ മനസ്സിലാക്കാനും സർട്ടിഫിക്കറ്റ് പരിശോധിക്കാനും ഞാൻ സഹായിക്കാം.`,
      timestamp: 'ഇപ്പോൾ',
      suggestedActions: [
        { label: 'NOS സ്കോളർഷിപ്പ് യോഗ്യത', actionType: 'query', target: 'NOS വിദേശ സ്കോളർഷിപ്പിന് ഞാൻ യോഗ്യനാണോ?' },
        { label: 'വരുമാന സർട്ടിഫിക്കറ്റ് പരിശോധന', actionType: 'query', target: 'എന്റെ വരുമാന സർട്ടിഫിക്കറ്റ് സാധുവാണോ?' },
        { label: 'NFST Ph.D വിവരങ്ങൾ & സ്റ്റൈപൻഡ്', actionType: 'query', target: 'NFST Ph.D ഫെലോഷിപ്പ് നിയമങ്ങളും സ്റ്റൈപൻഡും എത്രയാണ്?' },
      ],
    },
  ],
  sat: [
    {
      id: 'welcome-sat',
      sender: 'assistant',
      text:
        `ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ **AdivaSetu Saathi (ᱚᱫᱤᱵᱟ ᱥᱮᱛᱩ ᱥᱟᱛᱷᱤ)**, ᱡᱚᱱᱚᱡᱟᱛᱤ ᱢᱚᱱᱛᱨᱟᱞᱚᱭ (MoTA) AI ᱜᱚᱲᱚᱣᱟᱱᱤᱡ᱾\n\n` +
        `**NFST (Ph.D.) ᱟᱨ NOS (ᱵᱤᱫᱮᱥ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ)** ᱨᱮᱭᱟᱜ ᱱᱤᱭᱟᱹᱢ ᱠᱚ, ᱥᱟᱠᱟᱢ ᱡᱟᱸᱪ ᱟᱨ ᱥᱴᱟᱭᱯᱮᱱᱰ ᱵᱟᱵᱚᱛ ᱤᱧ ᱜᱚᱲᱚ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾`,
      timestamp: 'ᱱᱤᱛ',
      suggestedActions: [
        { label: 'NOS ᱵᱤᱫᱮᱥ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱡᱚᱜᱽᱭᱚᱛᱟ', actionType: 'query', target: 'ᱪᱮᱫ ᱤᱧ NOS ᱵᱤᱫᱮᱥ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱞᱟᱹᱜᱤᱫ ᱮᱯᱞᱟᱭ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ?' },
        { label: 'ᱟᱨᱡᱟᱣ ᱥᱟᱠᱟᱢ ᱡᱟᱸᱪ', actionType: 'query', target: 'ᱤᱧᱟᱜ ᱤᱱᱠᱟᱢ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱴᱷᱤᱠ ᱜᱮᱭᱟ ᱥᱮ?' },
        { label: 'NFST Ph.D ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱴᱟᱠᱟ', actionType: 'query', target: 'NFST Ph.D ᱨᱮ ᱪᱟᱸᱫᱚ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱴᱟᱠᱟ ᱧᱟᱢᱚᱜ-ᱟ?' },
      ],
    },
  ],
  pa: [
    {
      id: 'welcome-pa',
      sender: 'assistant',
      text:
        `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ **ਅਦੀਵਾਸੇਤੂ ਸਾਥੀ (AdivaSetu Saathi)** ਹਾਂ, ਕਬਾਇਲੀ ਮਾਮਲਿਆਂ ਦੇ ਮੰਤਰਾਲੇ (MoTA) ਦਾ ਅਧਿਕਾਰਤ AI ਫੈਲੋਸ਼ਿਪ ਗਾਈਡ।\n\n` +
        `ਮੈਂ **NFST (Ph.D.) ਅਤੇ NOS (ਵਿਦੇਸ਼ੀ ਸਕਾਲਰਸ਼ਿਪ)** ਨਿਯਮਾਂ ਅਤੇ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਜਾਂਚ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।`,
      timestamp: 'ਹੁਣੇ',
      suggestedActions: [
        { label: 'NOS ਸਕਾਲਰਸ਼ਿਪ ਯੋਗਤਾ', actionType: 'query', target: 'ਕੀ ਮੈਂ NOS ਵਿਦੇਸ਼ੀ ਸਕਾਲਰਸ਼ਿਪ ਲਈ ਯੋਗ ਹਾਂ?' },
        { label: 'ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ ਜਾਂਚ', actionType: 'query', target: 'ਕੀ ਮੇਰਾ ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ ਜਾਇਜ਼ ਹੈ?' },
        { label: 'NFST Ph.D ਨਿਯਮ ਅਤੇ ਵਜ਼ੀਫ਼ਾ', actionType: 'query', target: 'NFST Ph.D ਫੈਲੋਸ਼ਿਪ ਨਿਯਮ ਅਤੇ ਵਜ਼ੀਫ਼ਾ ਕਿੰਨਾ ਹੈ?' },
      ],
    },
  ],
  ur: [
    {
      id: 'welcome-ur',
      sender: 'assistant',
      text:
        `آداب! میں **ادیوا سیتو ساتھی (AdivaSetu Saathi)** ہوں، وزارت قبائلی امور (MoTA) کا باضابطہ AI فیلوشپ گائیڈ۔\n\n` +
        `میں آپ کی **NFST (Ph.D.) اور NOS (غیر ملکی اسکالرشپ)** کے قواعد سمجھنے اور دستاویزات کی جانچ میں مدد کر سکتا ہوں۔`,
      timestamp: 'ابھی',
      suggestedActions: [
        { label: 'NOS غیر ملکی اسکالرشپ کی اہلیت', actionType: 'query', target: 'کیا میں NOS غیر ملکی اسکالرشپ کے لیے اہل ہوں؟' },
        { label: 'آمدنی سرٹیفکیٹ کی جانچ', actionType: 'query', target: 'کیا میرا آمدنی سرٹیفکیٹ درست ہے؟' },
        { label: 'NFST Ph.D قواعد اور وظیفہ', actionType: 'query', target: 'NFST Ph.D فیلوشپ کے قواعد اور ماہانہ وظیفہ کتنا ہے؟' },
      ],
    },
  ],
};

export const AdivaSetuSaathi: React.FC = () => {
  const navigate = useNavigate();
  const { language: appLanguage, setLanguage: setAppLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState<AssistantLanguage>('auto');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES.auto);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    type: string;
    size: string;
    base64?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Synchronize chatbot when global app language changes
  useEffect(() => {
    if (appLanguage && appLanguage in INITIAL_MESSAGES) {
      setLanguage(appLanguage as AssistantLanguage);
      if (messages.length <= 1) {
        setMessages(INITIAL_MESSAGES[appLanguage as AssistantLanguage]);
      }
    }
  }, [appLanguage]);

  // Handle language switch
  const handleLanguageChange = (newLang: AssistantLanguage) => {
    setLanguage(newLang);
    // If only welcome message, replace with new language welcome
    if (messages.length <= 1) {
      setMessages(INITIAL_MESSAGES[newLang]);
    }
    // Also update global application language if supported
    if (newLang !== 'auto' && newLang !== 'hinglish') {
      setAppLanguage(newLang as AppLanguage);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        type: file.type || 'application/pdf',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        base64: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend && !selectedFile) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend || `Please audit my uploaded document: "${selectedFile?.name}"`,
      timestamp: 'Just now',
      attachment: selectedFile || undefined,
    };

    const currentAttachment = selectedFile;
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const response = await aiAssistantService.askAssistant(
        userMsg.text,
        messages,
        language,
        currentAttachment || undefined
      );

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: 'Just now',
        suggestedActions: response.suggestedActions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'hi'
            ? 'संजाल त्रुटि। कृपया पुनः प्रयास करें अथवा अपने दस्तावेज़ जांचें।'
            : 'Apologies, I encountered a brief connection error. Please try again.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING CHAT TRIGGER BUTTON */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-emerald-200 text-xs font-bold text-emerald-950 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>AdivaSetu Saathi AI</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#0D3829] to-emerald-700 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-emerald-300"
            title="Chat with AdivaSetu Saathi AI"
          >
            <Bot className="w-7 h-7 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </button>
        </div>
      )}

      {/* 2. CHAT DRAWER / WINDOW */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            isExpanded
              ? 'w-[95vw] sm:w-[600px] h-[85vh] max-h-[800px]'
              : 'w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0D3829] to-[#16533D] text-white flex items-center justify-between border-b border-emerald-800/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl border border-white/20">
                <Bot className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-black tracking-wide">AdivaSetu Saathi</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Official MoTA AI
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 font-medium">
                  अदिवा सेतु साथी • AI Fellowship Guide
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-300">
              {/* Quick Pills (Desktop/Tablet) */}
              <div className="hidden sm:flex items-center bg-black/30 rounded-xl p-0.5 border border-white/15 text-[11px] font-bold">
                <button
                  onClick={() => handleLanguageChange('auto')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    language === 'auto' ? 'bg-amber-400 text-slate-950' : 'hover:text-white'
                  }`}
                  title="Auto-detect any language"
                >
                  🌍 Auto
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-1.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    language === 'en' ? 'bg-amber-400 text-slate-950' : 'hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange('hi')}
                  className={`px-1.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    language === 'hi' ? 'bg-amber-400 text-slate-950' : 'hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Full 16+ Language Selector Dropdown */}
              <div className="relative flex items-center bg-black/40 hover:bg-black/60 rounded-xl px-2 py-1 border border-white/20 hover:border-amber-400/80 transition-all cursor-pointer">
                <Globe2 className="w-3.5 h-3.5 text-amber-300 mr-1.5 shrink-0" />
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as AssistantLanguage)}
                  aria-label="Select Assistant Language"
                  className="bg-transparent text-white text-[11px] font-semibold focus:outline-none cursor-pointer pr-1"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-slate-900 text-white py-1">
                      {l.name} {l.code !== 'auto' ? `(${l.englishName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-header Context Bar */}
          <div className="bg-emerald-50/70 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-[11px] text-emerald-950">
            <span className="flex items-center gap-1.5 font-medium truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">Grounded on Official MoTA Statutory Guidelines (Rule 14b)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full font-bold shrink-0 ml-2">
              16+ Languages
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`flex items-start gap-2.5 max-w-[88%] ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Sender Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === 'user'
                        ? 'bg-[#0D3829] text-white border border-emerald-600'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-800" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0D3829] text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs space-y-2'
                    }`}
                  >
                    {/* Attached file chip if present */}
                    {msg.attachment && (
                      <div className="mb-2 p-2 rounded-xl bg-black/10 border border-black/10 flex items-center space-x-2">
                        <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold truncate text-[11px]">{msg.attachment.name}</p>
                          <span className="text-[10px] opacity-75">{msg.attachment.size}</span>
                        </div>
                      </div>
                    )}

                    {/* Formatted Text */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text.split('\n').map((line, idx) => {
                        // Bold markdown parser
                        const parts = line.split(/(\*\*[^*]+\*\*)/g);
                        return (
                          <div key={idx} className={line.startsWith('•') ? 'ml-2 my-0.5' : 'my-0.5'}>
                            {parts.map((p, pIdx) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                return (
                                  <strong key={pIdx} className="font-bold">
                                    {p.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return p;
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Suggested Action Chips (if assistant) */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
                    {msg.suggestedActions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => {
                          if (act.actionType === 'navigate') {
                            navigate(act.target);
                          } else {
                            handleSendMessage(act.target);
                          }
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <span>{act.label}</span>
                        {act.actionType === 'navigate' ? (
                          <ArrowRight className="w-3 h-3 text-emerald-700" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-amber-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 pl-9">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[11px] font-medium text-emerald-800 font-sans">
                  {getLanguageMeta(language).thinkingText}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Attached file preview before sending */}
          {selectedFile && (
            <div className="px-4 py-2 bg-emerald-50/80 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold truncate">{selectedFile.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">({selectedFile.size})</span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Remove attachment"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-[#0D3829] transition-colors cursor-pointer"
              title="Upload Certificate / Document for AI Audit"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={getLanguageMeta(language).placeholder}
              className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!inputText.trim() && !selectedFile)}
              className="p-2.5 rounded-xl bg-[#0D3829] hover:bg-[#16533D] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
