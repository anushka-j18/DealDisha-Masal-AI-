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

export interface Lead {
  id: string;
  customerName: string;
  location: string;
  propertyRequirement: string;
  budget: string;
  buyingTimeline: string;
  customerMessage: string;
  createdAt: string;      // ISO string
  updatedAt: string;
  analysis?: AIAnalysis;
  chatHistory?: ChatMessage[];
}

export interface LeadIntakeInput {
  customerName: string;
  location: string;
  propertyRequirement: string;
  budget: string;
  buyingTimeline: string;
  customerMessage: string;
}
