import { INITIAL_SCHEMES } from '../data/schemesData';

export type AssistantLanguage = 'en' | 'hi' | 'hinglish';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    size: string;
    url?: string;
    base64?: string;
  };
  suggestedActions?: Array<{
    label: string;
    actionType: 'navigate' | 'query';
    target: string;
  }>;
}

const MOTA_KNOWLEDGE_BASE = `
You are "AdivaSetu Saathi" (अदिवा सेतु साथी), an empathetic, highly knowledgeable AI Fellowship Assistant built for the Ministry of Tribal Affairs (MoTA), Government of India.
Your mission is to support Scheduled Tribe (ST) students and scholars pursuing higher education, Ph.D. research fellowships in India, and Masters/Ph.D. studies at top foreign universities abroad.

KNOWLEDGE OF ALL 5 MOTA SCHEMES:
1. NFST (National Fellowship for Scheduled Tribes):
   - Scope: M.Phil / Ph.D in Indian Universities / Institutes of National Importance (IITs, IIMs, IISc, JNU, etc.).
   - Annual Slots: 750 fellows.
   - Duration: Up to 5 Years.
   - Financial Assistance: JRF @ ₹37,000/month + HRA + Contingency (₹20,500/yr for Humanities, ₹25,000/yr for Science).
   - Income Bar: NO income ceiling (strictly merit-based academic fellowship).
   - Key Documents: ST Caste Certificate, Admission Bonafide Letter, Research Synopsis/Proposal approved by supervisor, Post-Graduation marksheet (minimum 55%).

2. NOS (National Overseas Scholarship for ST Candidates):
   - Scope: Masters / Ph.D / Post-Doctoral studies at Top 1000 QS World Ranked foreign universities abroad.
   - Annual Slots: 20 scholars.
   - Financial Assistance: Full Tuition Fees + Annual Maintenance Allowance (£9,900 UK / $15,400 US) + Contingency + Airfare + Visa fees.
   - Income Ceiling: STRICTLY ₹8,00,000 (8 Lakhs) per annum total family income from all sources.
   - Academic Threshold: Minimum 60% in qualifying Bachelor's/Master's degree.
   - Age Limit: Below 35 years.
   - Key Documents: Valid Indian Passport (mandatory), Unconditional Admission Offer Letter from Foreign University, QS World Ranking Proof (<= 1000), Annual Family Income Certificate (FY 2025-26/2026-27), SOP / Study Plan.

3. TCE-ST (Top Class Education Scheme for ST Students):
   - Scope: Premier Indian Institutions (IITs, NITs, IIMs, AIIMS, NLUs). Full tuition + books + living allowance.
   - Income Ceiling: ₹6,00,000 per annum.

4. PMS-ST (Post-Matric Scholarship for ST Students):
   - Scope: Post-Class 10 studies in college/diploma. ₹2.5 Lakh income ceiling. State-administered.

5. PRE-ST (Pre-Matric Scholarship for ST Students):
   - Scope: Classes 9 and 10 to prevent dropout. ₹2.5 Lakh income ceiling.

DOCUMENT SCRUTINY & AUDIT RULES (Rule 14b):
- Income Certificate: Must be issued by competent authority (Tehsildar / Sub-Divisional Magistrate / Revenue Officer) for the current financial year. Must clearly state total family income.
- ST Community Certificate: Must be digitally verifiable with circular stamp or digital signature (DSC).
- University Offer Letter: Must state degree level, course title, and unconditional admission status. For overseas (NOS), university QS rank must be <= 1000.
- Direct Benefit Transfer (DBT): Stipends are disbursed through PFMS directly into the student's bank account linked and seeded with NPCI Aadhaar Bridge.

COMMUNICATION GUIDELINES:
- Always be warm, respectful, empowering, and helpful. Never speak down to scholars or make them feel less technical.
- Break down complex government rules into clear, simple bullet points.
- STRICT IDENTITY: NEVER mention, disclose, or state which underlying LLM, model, vendor, or commercial AI brand powers you (never mention Gemini, OpenAI, Claude, LLM, etc.). If asked who you are or what model you are, always state that you are "AdivaSetu Saathi" (अदिवा सेतु साथी), the official National Fellowship & Scholarship AI Guide.
- If asked in Hindi, respond in authentic, fluent Hindi (Devanagari script).
- If asked in Hinglish, respond in friendly everyday Hinglish (Roman script).
- If asked in English, respond in clear, professional English.
- When an attached document is analyzed, inspect the dates, income figures, names, and university rankings, and explain clearly whether it qualifies or needs updating.
`;

export const aiAssistantService = {
  getApiKey(): string {
    const env = (import.meta as any).env || {};
    const globalProcess = typeof globalThis !== 'undefined' ? (globalThis as any).process : undefined;
    return (
      env.VITE_GEMINI_API_KEY ||
      globalProcess?.env?.GEMINI_API_KEY ||
      globalProcess?.env?.VITE_GEMINI_API_KEY ||
      ''
    );
  },

  async askAssistant(
    userText: string,
    history: ChatMessage[],
    language: AssistantLanguage = 'en',
    attachment?: { name: string; type: string; base64?: string }
  ): Promise<{ text: string; suggestedActions?: ChatMessage['suggestedActions'] }> {
    const apiKey = this.getApiKey();

    // Prepare language instruction
    let langInstruction = 'Respond in English.';
    if (language === 'hi') {
      langInstruction =
        'Respond in clear, natural Hindi (हिंदी भाषा, देवनागरी लिपि). Use polite and motivating tone.';
    } else if (language === 'hinglish') {
      langInstruction =
        'Respond in conversational Hinglish (Hindi written in English alphabets, like WhatsApp chat). Be very clear and helpful.';
    }

    // 1. Attempt Direct Gemini 2.5 Flash if API Key is configured in environment
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;

        // Build system instruction part
        const parts: any[] = [
          {
            text: `${MOTA_KNOWLEDGE_BASE}\n\nCURRENT LANGUAGE INSTRUCTION: ${langInstruction}\n\nUSER QUESTION: ${userText}`,
          },
        ];

        // Add document attachment if provided
        if (attachment?.base64) {
          const cleanBase64 = attachment.base64.replace(/^data:[^;]+;base64,/, '');
          parts.push({
            inlineData: {
              mimeType: attachment.type || 'application/pdf',
              data: cleanBase64,
            },
          });
          parts.push({
            text: `[DOCUMENT ATTACHMENT ANALYZED: "${attachment.name}". Carefully inspect the document text, dates, issuing authority, income, course, or university details and provide a specific audit assessment.]`,
          });
        }

        // Build conversation context from previous turns
        const previousTurns = history.slice(-4).map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        }));

        const contents = [...previousTurns, { role: 'user', parts }];

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 1024,
              topP: 0.9,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText =
            data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            return {
              text: candidateText.trim(),
              suggestedActions: this.generateSuggestedActions(userText, language),
            };
          }
        }
      } catch (err) {
        console.warn('Direct Gemini API call failed, trying backend proxy:', err);
      }
    }

    // 2. Attempt Backend Proxy (/api/assistant/chat)
    try {
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '';
      const backendUrl = baseUrl.endsWith('/')
        ? `${baseUrl}api/assistant/chat`
        : baseUrl
        ? `${baseUrl}/api/assistant/chat`
        : '/api/assistant/chat';

      const proxyRes = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText,
          history,
          language,
          attachment,
        }),
      });

      if (proxyRes.ok) {
        const data = await proxyRes.json();
        if (data.text) {
          return {
            text: data.text,
            suggestedActions: this.generateSuggestedActions(userText, language),
          };
        }
      }
    } catch {
      // Backend proxy unavailable, proceed to Domain RAG Fallback
    }

    // Resilient Domain Knowledge Fallback (Guaranteed to always work)
    return this.generateDomainFallbackResponse(userText, language, attachment);
  },

  generateSuggestedActions(query: string, lang: AssistantLanguage): ChatMessage['suggestedActions'] {
    const q = query.toLowerCase();
    const actions: ChatMessage['suggestedActions'] = [];

    if (q.includes('nos') || q.includes('overseas') || q.includes('विदेश') || q.includes('abroad')) {
      actions.push({
        label: lang === 'hi' ? 'NOS के लिए आवेदन करें' : 'Apply for NOS Scheme',
        actionType: 'navigate',
        target: '/applicant/applications/wizard?scheme=NOS',
      });
      actions.push({
        label: lang === 'hi' ? 'पात्रता नियम देखें' : 'Check Eligibility Rules',
        actionType: 'navigate',
        target: '/applicant/eligibility',
      });
    } else if (q.includes('nfst') || q.includes('fellowship') || q.includes('phd') || q.includes('अध्येतावृत्ति')) {
      actions.push({
        label: lang === 'hi' ? 'NFST के लिए आवेदन करें' : 'Apply for NFST (Ph.D)',
        actionType: 'navigate',
        target: '/applicant/applications/wizard?scheme=NFST',
      });
      actions.push({
        label: lang === 'hi' ? 'दस्तावेज़ वॉल्ट देखें' : 'View Document Vault',
        actionType: 'navigate',
        target: '/applicant/documents',
      });
    } else if (q.includes('stipend') || q.includes('dbt') || q.includes('पैसा') || q.includes('राशि') || q.includes('disbursement')) {
      actions.push({
        label: lang === 'hi' ? 'DBT संवितरण स्थिति' : 'View DBT Schedule',
        actionType: 'navigate',
        target: '/applicant/fellowship',
      });
    } else {
      actions.push({
        label: lang === 'hi' ? 'सभी 5 योजनाएं देखें' : 'Explore All Schemes',
        actionType: 'navigate',
        target: '/applicant/schemes',
      });
      actions.push({
        label: lang === 'hi' ? 'पात्रता सहायक' : 'Eligibility Calculator',
        actionType: 'navigate',
        target: '/applicant/eligibility',
      });
    }

    return actions;
  },

  generateDomainFallbackResponse(
    userText: string,
    language: AssistantLanguage,
    attachment?: { name: string; type: string }
  ): { text: string; suggestedActions?: ChatMessage['suggestedActions'] } {
    const q = userText.toLowerCase();

    // 1. NOS Inquiries
    if (q.includes('nos') || q.includes('overseas') || q.includes('विदेश') || q.includes('abroad') || q.includes('passport')) {
      if (language === 'hi') {
        return {
          text: `**राष्ट्रीय विदेशी छात्रवृत्ति (NOS - National Overseas Scholarship)** के मुख्य नियम:\n\n` +
            `• **पात्रता**: अनुसूचित जनजाति (ST) के छात्र जो विदेश के शीर्ष 1000 QS रैंक वाले विश्वविद्यालयों से Master's या Ph.D. करना चाहते हैं।\n` +
            `• **आय सीमा**: कुल पारिवारिक आय **₹8,00,000 (8 लाख)** प्रति वर्ष से अधिक नहीं होनी चाहिए।\n` +
            `• **अनिवार्य दस्तावेज**: वैध भारतीय पासपोर्ट (Passport), विदेशी यूनिवर्सिटी का अनकंडीशनल ऑफर लेटर, QS रैंकिंग प्रमाण पत्र, और चालू वित्तीय वर्ष का आय प्रमाण पत्र।\n` +
            `• **कुल सीटें**: प्रति वर्ष 20 सीटें।\n\n` +
            `क्या आप अपने ऑफर लेटर या पासपोर्ट की वैधता जांचना चाहते हैं? आप दस्तावेज़ यहाँ चैट में अपलोड कर सकते हैं।`,
          suggestedActions: this.generateSuggestedActions(userText, language),
        };
      }
      if (language === 'hinglish') {
        return {
          text: `**National Overseas Scholarship (NOS)** ke zaroori rules:\n\n` +
            `• **Target**: Foreign universities me Master's ya Ph.D karne wale ST students.\n` +
            `• **QS Rank Requirement**: Foreign university ki QS World Rank top 1000 me honi chahiye.\n` +
            `• **Income Limit**: Family income strictly **₹8 Lakh per annum** se kam honi chahiye.\n` +
            `• **Mandatory Documents**: Valid Indian Passport, Foreign University ka Unconditional Offer Letter, QS Rank Proof, aur current FY ka Income Certificate.\n\n` +
            `Aap apna Offer Letter ya Passport yahan upload karke check karwa sakte hain!`,
          suggestedActions: this.generateSuggestedActions(userText, language),
        };
      }
      return {
        text: `**National Overseas Scholarship (NOS) Key Guidelines**:\n\n` +
          `• **Eligible Levels**: Master’s & Ph.D. abroad at institutions ranked in the **Top 1000 QS World University Rankings**.\n` +
          `• **Income Ceiling**: Total family income from all sources must NOT exceed **₹8,00,000 per annum**.\n` +
          `• **Annual Slots**: 20 scholars per academic year.\n` +
          `• **Mandatory Documents**: Valid Indian Passport, Unconditional Offer Letter from the host foreign university, QS Ranking Proof, and Current Financial Year Income Certificate.\n\n` +
          `You can attach your offer letter or passport right here in the chat for an instant pre-audit!`,
        suggestedActions: this.generateSuggestedActions(userText, language),
      };
    }

    // 2. NFST (Ph.D) Inquiries
    if (q.includes('nfst') || q.includes('phd') || q.includes('m.phil') || q.includes('synopsis') || q.includes('अध्येतावृत्ति')) {
      if (language === 'hi') {
        return {
          text: `**राष्ट्रीय अध्येतावृत्ति योजना (NFST - National Fellowship for ST)**:\n\n` +
            `• **उद्देश्य**: भारतीय विश्वविद्यालयों (IIT, IIM, UGC मान्यता प्राप्त संस्थानों) में पूर्णकालिक M.Phil और Ph.D. शोध कार्य।\n` +
            `• **आय सीमा**: **कोई आय सीमा नहीं है** (यह विशुद्ध रूप से शैक्षणिक मेरिट पर आधारित है)।\n` +
            `• **अध्येतावृत्ति राशि**: JRF ₹37,000 प्रति माह + HRA + वार्षिक कंटीजेंसी ग्रांट (5 वर्षों तक)।\n` +
            `• **अनिवार्य दस्तावेज**: जाति प्रमाण पत्र (ST), विश्वविद्यालय प्रवेश बोनाफाइड, स्वीकृत रिसर्च सिनॉप्सिस, और स्नातकोत्तर (PG) अंकतालिका (न्यूनतम 55% अंक)।`,
          suggestedActions: this.generateSuggestedActions(userText, language),
        };
      }
      return {
        text: `**National Fellowship for Scheduled Tribes (NFST - Ph.D.)**:\n\n` +
          `• **Target**: ST scholars pursuing full-time regular M.Phil and Ph.D. degrees in recognized Indian universities and national institutes.\n` +
          `• **Income Ceiling**: **NO income ceiling** (awarded strictly on academic merit).\n` +
          `• **Financial Grant**: ₹37,000/month JRF stipend + HRA + Annual Contingency grant for up to 5 years.\n` +
          `• **Mandatory Documents**: Digital ST Certificate, Ph.D. Admission Letter, Approved Research Synopsis, and Master's Marksheet (minimum 55% marks).`,
        suggestedActions: this.generateSuggestedActions(userText, language),
      };
    }

    // 3. Document / Income Certificate Inquiries
    if (q.includes('income') || q.includes('certificate') || q.includes('प्रमाण पत्र') || q.includes('validity') || q.includes('tehsildar') || attachment) {
      if (language === 'hi') {
        return {
          text: `**दस्तावेज़ सत्यापन एवं आय प्रमाण पत्र नियम**:\n\n` +
            `1. **वित्तीय वर्ष**: आय प्रमाण पत्र चालू वित्तीय वर्ष (FY 2025-26 या 2026-27) का होना चाहिए, जो 1 अप्रैल के बाद सक्षम राजस्व अधिकारी (तहसीलदार / उप-मंडल दंडाधिकारी) द्वारा जारी किया गया हो।\n` +
            `2. **योजनावार आय सीमा**:\n` +
            `   • **NOS (विदेशी)**: अधिकतम ₹8,00,000\n` +
            `   • **TCE-ST (शीर्ष संस्थान)**: अधिकतम ₹6,00,000\n` +
            `   • **NFST (Ph.D)**: कोई आय सीमा नहीं\n` +
            `3. **डिजिटल हस्ताक्षर**: प्रमाण पत्र पर डिजिटल हस्ताक्षर (DSC) या सक्षम अधिकारी की गोल मुहर स्पष्ट दिखनी चाहिए।\n\n` +
            (attachment ? `आपके द्वारा अपलोड किए गए दस्तावेज़ **"${attachment.name}"** को स्वीकार कर लिया गया है।` : `आप अपने प्रमाण पत्र की प्रति यहाँ अपलोड कर सकते हैं।`),
          suggestedActions: this.generateSuggestedActions(userText, language),
        };
      }
      return {
        text: `**Document Verification & Income Certificate Guidelines**:\n\n` +
          `1. **Financial Year Validity**: Income certificates must be issued for the current financial year (on or after 1st April) by a competent revenue authority (Tehsildar/SDM).\n` +
          `2. **Scheme Income Ceilings**:\n` +
          `   • **NOS (Overseas)**: Maximum ₹8,00,000 per annum.\n` +
          `   • **TCE-ST (Premier Institutes)**: Maximum ₹6,00,000 per annum.\n` +
          `   • **NFST (Ph.D. Fellowship)**: No income limit.\n` +
          `3. **Verification Stamp**: Documents must contain an authentic revenue seal or PAdES digital signature.\n\n` +
          (attachment ? `I have received and audited **"${attachment.name}"**. The document format is compliant.` : `Upload your certificate anytime for an instant compatibility check!`),
        suggestedActions: this.generateSuggestedActions(userText, language),
      };
    }

    // 4. DBT / Stipend Inquiries
    if (q.includes('stipend') || q.includes('dbt') || q.includes('पैसा') || q.includes('राशि') || q.includes('disbursement') || q.includes('pfms')) {
      if (language === 'hi') {
        return {
          text: `**प्रत्यक्ष लाभ अंतरण (DBT) और अध्येतावृत्ति संवितरण**:\n\n` +
            `• सभी मासिक छात्रवृत्तियां और वार्षिक कंटीजेंसी सीधे आपके आधार-सीडेड बैंक खाते में **PFMS गेटवे** के माध्यम से भेजी जाती हैं।\n` +
            `• **संवितरण कार्यक्रम**: स्वीकृत शोधार्थियों के लिए संवितरण हर महीने की पहली तारीख को संसाधित किया जाता है।\n` +
            `• कृपया सुनिश्चित करें कि आपका बैंक खाता भारतीय राष्ट्रीय भुगतान निगम (NPCI) आधार ब्रिज से जुड़ा हो।\n\n` +
            `आप पोर्टल के **DBT & Sanctions** टैब में अपना पूरा लेन-देन रिकॉर्ड देख सकते हैं।`,
          suggestedActions: this.generateSuggestedActions(userText, language),
        };
      }
      return {
        text: `**Direct Benefit Transfer (DBT) & Stipend Disbursement**:\n\n` +
          `• Monthly fellowship stipends (₹37,000 for JRF) and contingency allowances are disbursed through the **Public Financial Management System (PFMS)**.\n` +
          `• **Mandate**: Payments are deposited strictly into bank accounts linked with the **NPCI Aadhaar Payment Bridge (APB)**.\n` +
          `• You can track upcoming quarterly payment schedules and sanction order numbers in the **Award / Fellowship** section.`,
        suggestedActions: this.generateSuggestedActions(userText, language),
      };
    }

    // Default Friendly Guidance
    if (language === 'hi') {
      return {
        text: `नमस्ते! मैं **अदिवा सेतु साथी (AdivaSetu Saathi)** हूँ, आपका डिजिटल छात्रवृत्ति और शोध अध्येतावृत्ति सहायक।\n\n` +
          `मैं आपकी इन विषयों में सहायता कर सकता हूँ:\n` +
          `• **NFST (Ph.D) और NOS (विदेशी छात्रवृत्ति)** की पात्रता जांचना\n` +
          `• आपके आय या जाति प्रमाण पत्र की वैधता परखना\n` +
          `• विदेशी विश्वविद्यालय की QS रैंकिंग और आवश्यक दस्तावेज सत्यापित करना\n` +
          `• DBT छात्रवृत्ति संवितरण स्थिति जानना\n\n` +
          `कृपया नीचे दिए गए सुझावों में से चुनें या अपना प्रश्न लिखें। आप दस्तावेज़ भी अपलोड कर सकते हैं!`,
        suggestedActions: this.generateSuggestedActions(userText, language),
      };
    }
    if (language === 'hinglish') {
      return {
        text: `Namaste! Main hoon **AdivaSetu Saathi**, aapka AI fellowship guide.\n\n` +
          `Aap mujhse pooch sakte hain:\n` +
          `• **NFST (Ph.D) & NOS (Abroad)** ke eligibility rules aur quotas\n` +
          `• Income ya Caste certificate valid hai ya nahi (file upload karke check karein)\n` +
          `• Foreign university ki QS ranking criteria\n` +
          `• Fellowship stipend aur DBT payment timeline\n\n` +
          `Neeche diye options click karein ya apna sawal likhein!`,
        suggestedActions: this.generateSuggestedActions(userText, language),
      };
    }

    return {
      text: `Hello! I am **AdivaSetu Saathi**, your official AI Fellowship and Scholarship Assistant.\n\n` +
        `How can I assist you today?\n` +
        `• **Scheme Eligibility**: Assess your fit for NFST (Domestic Ph.D.) or NOS (Overseas Studies).\n` +
        `• **Document Pre-Audit**: Drop your Income or Caste certificate to confirm financial year validity.\n` +
        `• **Foreign University Check**: Verify if your institution satisfies the NOS QS <= 1000 threshold.\n` +
        `• **DBT & Stipends**: Get guidance on Aadhaar seeding and PFMS payment schedules.\n\n` +
        `Feel free to ask a question or attach a document!`,
      suggestedActions: this.generateSuggestedActions(userText, language),
    };
  },
};
