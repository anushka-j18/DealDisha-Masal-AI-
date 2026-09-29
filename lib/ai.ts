import { GoogleGenAI } from '@google/genai';
import { AIAnalysis, LeadIntakeInput, Lead } from './types';

// Obtain API Key from environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

// System prompt enforcing strict grounding in lead data
const LEAD_ANALYSIS_SYSTEM_PROMPT = `
You are DealDisha's Lead Intelligence Engine — an elite AI assistant for real estate sales teams.
Your objective is to analyze inbound property buyer leads and return structured JSON sales intelligence.

RULES FOR ANALYSIS:
1. Ground your analysis strictly in the provided customer name, location, requirement, budget, timeline, and customer message.
2. DO NOT invent facts, amenities, or budget figures that are not stated.
3. Compute an objective Lead Score (0 to 100) and Priority (HOT, WARM, COLD) based on:
   - Timeline Urgency: < 1 month (HOT), 1-3 months (HOT/WARM), 3-6 months (WARM), > 6 months (COLD)
   - Specificity of location, configuration, and budget match.
4. Formulate an actionable, high-impact "Next Move" for the real estate agent with:
   - "what": Direct action to execute (e.g. "Call the customer today to schedule a site visit.")
   - "why": Fact-grounded rationale explaining why this action is essential.
   - "when": Urgency timeframe ("Today", "Within 24 Hours", "This Week", or "Next Week").
   - "callStrategy": 3-4 bullet points outlining key talking points for the call.
5. Provide a professional, warm, non-pushy Suggested Response that the agent can copy and send directly.

OUTPUT FORMAT: Return ONLY valid, minified or formatted JSON without markdown code fences or backticks.
`;

// Helper for deterministic rule-based analysis fallback if API key is missing or fails
export function generateFallbackAnalysis(input: LeadIntakeInput): AIAnalysis {
  const msgLower = (input.customerMessage + ' ' + input.buyingTimeline).toLowerCase();
  
  let priority: 'HOT' | 'WARM' | 'COLD' = 'WARM';
  let score = 65;
  let when = 'Within 24 Hours';
  let what = 'Call customer within 24 hours to confirm budget and location specs.';

  if (
    msgLower.includes('1 month') ||
    msgLower.includes('immediate') ||
    msgLower.includes('urgent') ||
    msgLower.includes('soon') ||
    msgLower.includes('this week')
  ) {
    priority = 'HOT';
    score = 92;
    when = 'Today';
    what = `Call ${input.customerName} today to schedule a site visit for ${input.propertyRequirement}.`;
  } else if (
    msgLower.includes('1-3 months') ||
    msgLower.includes('2 months') ||
    msgLower.includes('3 months')
  ) {
    priority = 'HOT';
    score = 82;
    when = 'Within 24 Hours';
    what = `Send curated options for ${input.propertyRequirement} in ${input.location} and follow up tomorrow.`;
  } else if (
    msgLower.includes('6+') ||
    msgLower.includes('exploring') ||
    msgLower.includes('no hurry') ||
    msgLower.includes('just looking')
  ) {
    priority = 'COLD';
    score = 45;
    when = 'Next Week';
    what = `Send general brochure for ${input.location} and schedule a low-priority follow up.`;
  }

  const reqs: string[] = [];
  if (input.propertyRequirement) reqs.push(`Requirement: ${input.propertyRequirement}`);
  if (input.location) reqs.push(`Target Location: ${input.location}`);
  if (input.budget) reqs.push(`Budget: ${input.budget}`);
  if (input.buyingTimeline) reqs.push(`Buying Timeline: ${input.buyingTimeline}`);

  return {
    summary: `${input.customerName} is looking for ${input.propertyRequirement} in ${input.location} with a budget of ${input.budget} on a ${input.buyingTimeline} timeline.`,
    intent: priority === 'HOT' 
      ? 'High readiness to purchase — immediate intent detected.' 
      : priority === 'WARM' 
      ? 'Active market comparison — good purchase potential.' 
      : 'Exploratory interest — nurturing required.',
    keyRequirements: reqs,
    objections: [
      `Need verification of inventory matching ${input.budget} budget limit`,
      `Requires confirmation of location proximity & possession date`
    ],
    recommendedNextAction: what,
    suggestedResponse: `Hi ${input.customerName}, thank you for reaching out to DealDisha! I noticed your inquiry for ${input.propertyRequirement} in ${input.location} with a budget of ${input.budget}. We have top-rated options ready for viewings. When would be a convenient time for a brief call to discuss floor plans?`,
    priority,
    score,
    nextMove: {
      what,
      why: `${input.customerName} has specified a clear budget of ${input.budget} and a buying timeline of ${input.buyingTimeline} in ${input.location}.`,
      when,
      callStrategy: [
        `Confirm preferred sub-locality within ${input.location}`,
        `Present properties fitting ${input.budget} budget ceiling`,
        `Address timeline expectations (${input.buyingTimeline})`,
        `Propose a concrete date for site inspection`
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
    const prompt = `
Lead Data:
- Customer Name: ${input.customerName}
- Location: ${input.location}
- Requirement: ${input.propertyRequirement}
- Budget: ${input.budget}
- Timeline: ${input.buyingTimeline}
- Customer Message: "${input.customerMessage}"

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: LEAD_ANALYSIS_SYSTEM_PROMPT + '\n\n' + prompt }] }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

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
