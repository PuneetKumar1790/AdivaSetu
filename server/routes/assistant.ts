import { Router, Request, Response } from 'express';

const router = Router();

const MOTA_KNOWLEDGE_BASE = `
You are "AdivaSetu Saathi" (अदिवा सेतु साथी), an empathetic, highly knowledgeable AI Fellowship Assistant built for the Ministry of Tribal Affairs (MoTA), Government of India.
Your mission is to support Scheduled Tribe (ST) students and scholars pursuing higher education, Ph.D. research fellowships in India, and Masters/Ph.D. studies at top foreign universities abroad.

KNOWLEDGE OF ALL 5 MOTA SCHEMES:
1. NFST (National Fellowship for Scheduled Tribes):
   - Scope: M.Phil / Ph.D in Indian Universities / Institutes of National Importance (IITs, IIMs, IISc, JNU, etc.).
   - Annual Slots: 750 fellows.
   - Duration: Up to 5 Years.
   - Financial Assistance: JRF @ ₹37,00,000/month + HRA + Contingency (₹20,500/yr for Humanities, ₹25,000/yr for Science).
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

router.post('/chat', async (req: Request, res: Response) => {
  const { userText, history = [], language = 'en', attachment } = req.body;

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    '';

  let langInstruction = 'Respond in English.';
  if (language === 'hi') {
    langInstruction =
      'Respond in clear, natural Hindi (हिंदी भाषा, देवनागरी लिपि). Use polite and motivating tone.';
  } else if (language === 'hinglish') {
    langInstruction =
      'Respond in conversational Hinglish (Hindi written in English alphabets, like WhatsApp chat). Be very clear and helpful.';
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const parts: any[] = [
      {
        text: `${MOTA_KNOWLEDGE_BASE}\n\nCURRENT LANGUAGE INSTRUCTION: ${langInstruction}\n\nUSER QUESTION: ${userText}`,
      },
    ];

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

    const previousTurns = history.slice(-4).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const contents = [...previousTurns, { role: 'user', parts }];

    const requestBody = JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
        topP: 0.9,
      },
    });

    let geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });

    if (geminiRes.status === 503 || geminiRes.status === 429) {
      await new Promise((r) => setTimeout(r, 1000));
      geminiRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });
    }

    if (geminiRes.ok) {
      const data = await geminiRes.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return res.json({ text: text.trim() });
      }
    }
  } catch (err: any) {
    console.error('Backend assistant proxy error:', err.message);
  }

  return res.status(502).json({ error: 'LLM service unavailable' });
});

export default router;
