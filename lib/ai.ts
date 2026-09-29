import { GoogleGenAI } from '@google/genai';
import { AIAnalysis, LeadIntakeInput, Lead } from './types';

// Obtain API Key from environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

// System prompt enforcing strict grounding & explainable scoring in lead data
const LEAD_ANALYSIS_SYSTEM_PROMPT = `
You are DealDisha's Lead Intelligence Engine — an elite AI assistant for real estate sales teams.
Your objective is to analyze inbound property buyer leads and return structured JSON sales intelligence.

RULES FOR SCORING & PRIORITIZATION:
1. Base your analysis STRICTLY on the provided customer name, location, requirement, budget, timeline, and customer message.
2. DO NOT invent facts, amenities, or budget figures that are not stated.
3. Compute an OBJECTIVE, EXPLAINABLE Lead Score (0 to 100) and Priority (HOT, WARM, COLD) by evaluating these 6 specific factors:
   - BUYING TIMELINE (Max 35 pts): <1 month / immediate = +35; 1-3 months = +25; 3-6 months = +15; >6 months = +5
   - BUDGET CLARITY (Max 20 pts): Specific numeric budget (e.g. ₹80L, ₹2.2Cr) = +20; flexible/range = +10; missing = +5
   - REQUIREMENT CLARITY (Max 20 pts): Specific configuration & location (e.g. 2BHK in Whitefield near metro) = +20; general = +10
   - PURCHASE INTENT & URGENCY (Max 15 pts): Explicit mention of relocation, site visit request, family purchase, or ready possession = +15; casual browsing = +5
   - OBJECTIONS & CONCERNS (-5 to -15 pts): Serious structural constraints or tight budget limits reduce score slightly.

PRIORITY MATRIX:
- HOT (Score 80–100): Timeline <1 month, explicit budget & requirement, high purchase intent.
- WARM (Score 50–79): Timeline 1–3 months, good fit requiring option comparison.
- COLD (Score <50): Timeline 3–6+ months or casual exploratory inquiry.

4. Formulate an actionable, high-impact "Next Move" for the real estate agent with:
   - "what": Direct action to execute (e.g. "Call the customer today to schedule a site visit.")
   - "why": Fact-grounded rationale citing budget, timeline, location facts.
   - "when": Urgency timeframe ("Today", "Within 24 Hours", "This Week", or "Next Week").
   - "callStrategy": 3-4 bullet points outlining key talking points for the call.
5. Provide a professional, warm, non-pushy Suggested Response that the agent can copy and send directly.

OUTPUT FORMAT: Return ONLY valid, minified or formatted JSON without markdown code fences or backticks.
`;

// Deterministic 6-Factor Lead Scoring Algorithm for fallback execution
export function generateFallbackAnalysis(input: LeadIntakeInput): AIAnalysis {
  const timelineLower = (input.buyingTimeline || '').toLowerCase();
  const msgLower = (input.customerMessage || '').toLowerCase();
  const reqLower = (input.propertyRequirement || '').toLowerCase();
  const locLower = (input.location || '').toLowerCase();
  const budgetLower = (input.budget || '').toLowerCase();

  let score = 0;

  // 1. BUYING TIMELINE SCORE (Max 35 pts)
  if (timelineLower.includes('1 month') || timelineLower.includes('immediate') || msgLower.includes('relocat') || msgLower.includes('urgent')) {
    score += 35;
  } else if (timelineLower.includes('1-3') || timelineLower.includes('1 to 3') || timelineLower.includes('2 months')) {
    score += 25;
  } else if (timelineLower.includes('3-6') || timelineLower.includes('3 to 6')) {
    score += 15;
  } else {
    score += 5;
  }

  // 2. BUDGET CLARITY (Max 20 pts)
  if (budgetLower.includes('lakh') || budgetLower.includes('crore') || budgetLower.includes('cr') || budgetLower.includes('l') || /\d+/.test(budgetLower)) {
    score += 20;
  } else if (budgetLower.includes('flexible') || budgetLower.includes('open')) {
    score += 12;
  } else {
    score += 5;
  }

  // 3. PROPERTY REQUIREMENT CLARITY (Max 20 pts)
  if ((reqLower.includes('bhk') || reqLower.includes('villa') || reqLower.includes('plot') || reqLower.includes('shop')) && locLower.length > 3) {
    score += 20;
  } else {
    score += 10;
  }

  // 4. PURCHASE INTENT & URGENCY (Max 15 pts)
  if (msgLower.includes('buy') || msgLower.includes('site visit') || msgLower.includes('call') || msgLower.includes('family') || msgLower.includes('possession')) {
    score += 15;
  } else {
    score += 7;
  }

  // 5. OBJECTIONS & CONCERNS ADJUSTMENT (-5 pts for high constraints)
  if (msgLower.includes('max') || msgLower.includes('strict') || msgLower.includes('only')) {
    score = Math.max(10, score - 3);
  }

  // Cap score range 0 to 100
  score = Math.min(100, Math.max(10, score));

  // Determine Priority
  let priority: 'HOT' | 'WARM' | 'COLD' = 'WARM';
  let when = 'Within 24 Hours';
  let what = `Call ${input.customerName} to present curated options in ${input.location}.`;

  if (score >= 80) {
    priority = 'HOT';
    when = 'Today';
    what = `Call ${input.customerName} today to schedule a site visit for ${input.propertyRequirement}.`;
  } else if (score < 50) {
    priority = 'COLD';
    when = 'Next Week';
    what = `Send property guide for ${input.location} and add to long-term follow-up list.`;
  }

  const reqs: string[] = [];
  if (input.propertyRequirement) reqs.push(`Property Config: ${input.propertyRequirement}`);
  if (input.location) reqs.push(`Target Submarket: ${input.location}`);
  if (input.budget) reqs.push(`Stated Budget: ${input.budget}`);
  if (input.buyingTimeline) reqs.push(`Decision Timeline: ${input.buyingTimeline}`);

  return {
    summary: `${input.customerName} is looking for ${input.propertyRequirement} in ${input.location} with a ${input.budget} budget and ${input.buyingTimeline} timeline.`,
    intent: priority === 'HOT'
      ? 'Immediate Purchase Intent — High readiness to close.'
      : priority === 'WARM'
      ? 'Active Market Comparison — Solid purchase potential.'
      : 'Exploratory Interest — Long-term nurturing required.',
    keyRequirements: reqs,
    objections: [
      `Requires confirmation of inventory matching ${input.budget} budget ceiling`,
      `Needs verification of location proximity & possession timeline`
    ],
    recommendedNextAction: what,
    suggestedResponse: `Hi ${input.customerName}, thank you for reaching out to DealDisha! I have verified options for ${input.propertyRequirement} in ${input.location} matching your ${input.budget} budget. When is a good time for a brief call today to review floor plans?`,
    priority,
    score,
    nextMove: {
      what,
      why: `${input.customerName} has specified a budget of ${input.budget} with a buying timeline of ${input.buyingTimeline} in ${input.location}.`,
      when,
      callStrategy: [
        `Confirm preferred sub-locality within ${input.location}`,
        `Present properties fitting ${input.budget} budget limit`,
        `Address timeline expectations (${input.buyingTimeline})`,
        `Lock in a concrete date for an in-person site visit`
      ]
    }
  };
}

export async function analyzeLeadWithAI(input: LeadIntakeInput): Promise<AIAnalysis> {
  if (!GEMINI_API_KEY) {
    console.warn('[DealDisha AI] No GEMINI_API_KEY found. Utilizing deterministic analysis engine.');
    return generateFallbackAnalysis(input);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // Truncate extremely long customer messages (>3000 chars) to prevent token overflow
    const sanitizedMsg = (input.customerMessage || '').length > 3000
      ? input.customerMessage.substring(0, 3000) + '... (message truncated for analysis)'
      : input.customerMessage;

    const prompt = `
Lead Data:
- Customer Name: ${input.customerName}
- Location: ${input.location}
- Requirement: ${input.propertyRequirement}
- Budget: ${input.budget}
- Timeline: ${input.buyingTimeline}
- Customer Message: "${sanitizedMsg}"

Please analyze this lead and provide output according to the JSON format below:
{
  "summary": "1-2 sentence executive summary",
  "intent": "Customer purchase readiness & key driver",
  "keyRequirements": ["list of explicit requirements"],
  "objections": ["list of hesitations or potential friction points"],
  "recommendedNextAction": "Single immediate next step",
  "suggestedResponse": "Professional customer reply text ready to copy",
  "priority": "HOT" | "WARM" | "COLD",
  "score": number (0-100),
  "nextMove": {
    "what": "Specific action to execute",
    "why": "Ground-truth rationale based strictly on budget, timeline, location",
    "when": "Today" | "Within 24 Hours" | "This Week" | "Next Week",
    "callStrategy": ["3-4 bullet points for call preparation"]
  }
}
`;

    // 10-second timeout safety race
    const aiCall = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: LEAD_ANALYSIS_SYSTEM_PROMPT + '\n\n' + prompt }] }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI Service Timeout')), 10000)
    );

    const response = await Promise.race([aiCall, timeoutPromise]);

    const responseText = response.text || '';
    // Clean up code blocks if present
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedText) as AIAnalysis;

    // Strict validation of all 8 required AI fields + nextMove object
    const hasValidSummary = typeof parsedData.summary === 'string' && parsedData.summary.length > 0;
    const hasValidIntent = typeof parsedData.intent === 'string' && parsedData.intent.length > 0;
    const hasValidRequirements = Array.isArray(parsedData.keyRequirements) && parsedData.keyRequirements.length > 0;
    const hasValidObjections = Array.isArray(parsedData.objections);
    const hasValidNextAction = typeof parsedData.recommendedNextAction === 'string' && parsedData.recommendedNextAction.length > 0;
    const hasValidResponse = typeof parsedData.suggestedResponse === 'string' && parsedData.suggestedResponse.length > 0;
    const hasValidPriority = ['HOT', 'WARM', 'COLD'].includes(parsedData.priority);
    const hasValidScore = typeof parsedData.score === 'number' && parsedData.score >= 0 && parsedData.score <= 100;
    const hasValidNextMove = parsedData.nextMove && typeof parsedData.nextMove.what === 'string' && typeof parsedData.nextMove.why === 'string';

    if (
      hasValidSummary &&
      hasValidIntent &&
      hasValidRequirements &&
      hasValidObjections &&
      hasValidNextAction &&
      hasValidResponse &&
      hasValidPriority &&
      hasValidScore &&
      hasValidNextMove
    ) {
      return parsedData;
    }

    console.warn('[DealDisha AI] Output failed strict validation. Utilizing grounded fallback engine.');
    return generateFallbackAnalysis(input);
  } catch (err) {
    console.error('[DealDisha AI Analysis Error]:', err);
    return generateFallbackAnalysis(input);
  }
}

export async function askLeadCopilot(lead: Lead, userQuestion: string): Promise<string> {
  const leadContext = `
[SELECTED LEAD CONTEXT]
Customer Name: ${lead.customerName}
Location: ${lead.location}
Requirement: ${lead.propertyRequirement}
Budget: ${lead.budget}
Buying Timeline: ${lead.buyingTimeline}
Customer Message: "${lead.customerMessage}"

[AI ANALYSIS & NEXT MOVE]
Priority: ${lead.analysis?.priority || 'WARM'} | Score: ${lead.analysis?.score || 70}
Summary: ${lead.analysis?.summary || ''}
Next Move WHAT: ${lead.analysis?.nextMove?.what || ''}
Next Move WHY: ${lead.analysis?.nextMove?.why || ''}
Next Move WHEN: ${lead.analysis?.nextMove?.when || ''}
Key Requirements: ${lead.analysis?.keyRequirements?.join(', ') || ''}
Objections/Concerns: ${lead.analysis?.objections?.join(', ') || ''}
`;

  const copilotSystemPrompt = `
You are DealDisha Co-pilot — a top-tier B2B real estate sales coach and AI strategist.
You are assisting a real estate agent with the specific lead described below.

RULES:
1. Base your answer STRICTLY on this specific lead's budget, timeline, location, and concerns.
2. DO NOT give generic boilerplate advice. Be direct, tactical, and immediate.
3. Keep responses concise (2-4 bullet points or short paragraphs).
4. If asked for a revised reply, write the exact text the agent can copy.
`;

  if (!GEMINI_API_KEY) {
    // Smart contextual fallback responses based on question intent
    const qLower = userQuestion.toLowerCase();
    if (qLower.includes('emphasize') || qLower.includes('talking point')) {
      return `Key points to emphasize for ${lead.customerName}:\n` +
        `• Highlight available ${lead.propertyRequirement} options in ${lead.location} strictly matching their ${lead.budget} budget.\n` +
        `• Directly address their ${lead.buyingTimeline} decision timeline.\n` +
        `• Focus on key decision drivers: location convenience, ready possession, and amenities.`;
    }
    if (qLower.includes('assertive') || qLower.includes('reply') || qLower.includes('response')) {
      return `Here is a more assertive response for ${lead.customerName}:\n\n` +
        `"Hi ${lead.customerName}, properties matching ${lead.propertyRequirement} in ${lead.location} around ${lead.budget} are in high demand right now. I have 2 verified options available this week. Can we schedule a brief 5-minute call today at 4 PM to confirm your availability for a site visit?"`;
    }
    if (qLower.includes('concern') || qLower.includes('objection')) {
      return `${lead.customerName}'s primary concerns to watch out for:\n` +
        `1. Budget adherence (${lead.budget}): Ensure no hidden costs or maintenance fee surprises.\n` +
        `2. Location fit (${lead.location}): Verify transit, school, or workplace proximity.\n` +
        `3. Timeline readiness (${lead.buyingTimeline}): Confirm possession dates match their expectations.`;
    }
    if (qLower.includes('call now') || qLower.includes('call this lead')) {
      return lead.analysis?.priority === 'HOT'
        ? `YES, call ${lead.customerName} immediately! This is a HOT lead with a timeline of ${lead.buyingTimeline} and an explicit budget of ${lead.budget}. Delaying will increase the risk of them contacting competitor agents.`
        : `Yes, place a call today. Establish rapport, confirm their budget of ${lead.budget}, and understand if their timeline of ${lead.buyingTimeline} can be accelerated.`;
    }
    return `For ${lead.customerName} (${lead.propertyRequirement} in ${lead.location}, ${lead.budget}): Focus on establishing trust, presenting 2-3 verified options, and securing a site visit commitment for their ${lead.buyingTimeline} timeline.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: copilotSystemPrompt + '\n' + leadContext + '\n\nUSER QUESTION: ' + userQuestion }] }
      ]
    });

    return response.text || 'No response generated.';
  } catch (err) {
    console.error('[DealDisha Co-pilot Error]:', err);
    return `Strategy tip for ${lead.customerName}: Connect on their ${lead.budget} budget and ${lead.location} preference, and steer the call toward scheduling an in-person site visit.`;
  }
}
