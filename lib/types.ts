export type Priority = 'HOT' | 'WARM' | 'COLD';

export interface NextMove {
  what: string;           // Action e.g., "Call the customer today."
  why: string;            // Rationale e.g., "Customer has ₹80L budget and plans to buy within 1 month..."
  when: string;           // Timeframe e.g., "Today", "Within 24 Hours", "This Week"
  callStrategy: string[]; // List of specific tactical talking points for the call
}

export interface AIAnalysis {
  summary: string;
  intent: string;
  keyRequirements: string[];
  objections: string[];
  recommendedNextAction: string;
  suggestedResponse: string;
  priority: Priority;
  score: number;          // 0 to 100
  nextMove: NextMove;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/**
 * DealDisha Core Lead Data Model
 */
export interface Lead {
  id: string;                  // Unique identifier
  userId?: string;             // User identifier owner
  customerName: string;        // Customer name
  location: string;            // Preferred location (e.g. Whitefield, Bangalore)
  propertyRequirement: string; // Property requirement (e.g. 2BHK apartment)
  budget: string;              // Budget (e.g. ₹80 Lakhs)
  buyingTimeline: string;      // Buying timeline (e.g. Within 1 month)
  customerMessage: string;     // Customer message / raw inquiry
  analysis?: AIAnalysis;       // AI analysis fields (summary, intent, keyRequirements, objections, recommendedNextAction, suggestedResponse)
  score?: number;              // Lead score (0 to 100)
  priority?: Priority;         // Lead priority: HOT | WARM | COLD
  nextMove?: NextMove;         // Signature Next Move recommendation (what, why, when, callStrategy)
  createdAt: string;           // Creation timestamp (ISO string)
  updatedAt: string;           // Update timestamp (ISO string)
  chatHistory?: ChatMessage[]; // Lead-specific AI conversation transcript
}

export interface LeadIntakeInput {
  customerName: string;
  location: string;
  propertyRequirement: string;
  budget: string;
  buyingTimeline: string;
  customerMessage: string;
}
