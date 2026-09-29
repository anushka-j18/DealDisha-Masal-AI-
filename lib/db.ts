import fs from 'fs';
import path from 'path';
import { Lead } from './types';

const DATA_FILE_PATH = path.join(process.cwd(), 'dealdisha_leads.json');

// Default initial realistic leads for Indian B2B Real Estate sales
const SEED_LEADS: Lead[] = [
  {
    id: 'lead-1',
    customerName: 'Rahul Sharma',
    location: 'Bangalore',
    propertyRequirement: '2BHK apartment near Whitefield',
    budget: '₹80 Lakhs',
    buyingTimeline: 'Within 1 month',
    customerMessage: 'Looking for a 2BHK for my family near Whitefield. My budget is around 80L. We are planning to buy soon. Prefer something close to metro and schools.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    analysis: {
      summary: 'High-urgency family buyer looking for a 2BHK in Whitefield, Bangalore with an ₹80L budget and immediate buying intent.',
      intent: 'Immediate Purchase Intent — High readiness to close.',
      keyRequirements: [
        '2BHK Apartment configuration',
        'Location: Whitefield, Bangalore',
        'Budget: ₹80 Lakhs',
        'Close to Metro station',
        'Proximity to reputable schools'
      ],
      objections: [
        'Must strictly stay near Metro & school infrastructure',
        'Need family-ready amenities and prompt possession'
      ],
      recommendedNextAction: 'Call customer today to schedule a site visit for 2BHK inventory near Whitefield metro corridor.',
      suggestedResponse: 'Hi Rahul, thank you for reaching out! We have 2 excellent 2BHK properties near Whitefield Metro station within your ₹80L budget, located right next to top international schools. Would you be available for a brief call today at 4 PM to review floor plans and arrange a site visit?',
      priority: 'HOT',
      score: 94,
      nextMove: {
        what: 'Call the customer today to schedule an immediate site visit.',
        why: 'The customer has a ₹80L budget and plans to purchase within 1 month. They have specified precise location (Whitefield) and key lifestyle triggers (metro/schools), indicating top-tier purchase readiness.',
        when: 'Today',
        callStrategy: [
          'Confirm exact sub-locality preference within Whitefield (e.g., Hope Farm vs ITPL corridor)',
          'Present 2-3 shortlisted 2BHK projects right at ₹78L–₹82L range',
          'Highlight metro walking distance and nearby school credentials',
          'Lock in a concrete date/time for an in-person site visit this weekend'
        ]
      }
    },
    chatHistory: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'What should I emphasize on the call with Rahul?',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Emphasize metro accessibility (under 10 mins walk) and school proximity, as Rahul specifically mentioned buying for his family. Keep discussions tightly focused on ready-to-move or near-possession 2BHK units under ₹80L to match his 1-month timeline.',
        timestamp: new Date(Date.now() - 3590000).toISOString()
      }
    ]
  },
  {
    id: 'lead-2',
    customerName: 'Priya Shah',
    location: 'Mumbai',
    propertyRequirement: '3BHK luxury apartment in Powai / Kanjurmarg',
    budget: '₹2.2 Crores',
    buyingTimeline: '1-3 months',
    customerMessage: 'We are expanding our search for a spacious 3BHK in Powai or Kanjurmarg West. Budget up to 2.2Cr. Need a gated community with clubhouse and security. Buying in 1 to 3 months.',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    analysis: {
      summary: 'High-value premium buyer interested in a 3BHK luxury unit in Powai/Kanjurmarg with a ₹2.2Cr budget.',
      intent: 'Active Comparison Phase — Moderate to High intent.',
      keyRequirements: [
        '3BHK Luxury Apartment',
        'Location: Powai or Kanjurmarg West, Mumbai',
        'Budget: Up to ₹2.2 Crores',
        'Gated community with premium clubhouse & 24/7 security'
      ],
      objections: [
        'Wants comprehensive gated security and premium lifestyle facilities',
        'Needs verification of actual carpet area vs super built-up area'
      ],
      recommendedNextAction: 'Send curated digital brochure & floorplan comparison of premium Powai projects within ₹2.2Cr.',
      suggestedResponse: 'Hello Priya, thank you for contacting DealDisha! We specialize in Powai and Kanjurmarg West premium townships. I have put together a brochure featuring 3 luxury 3BHK residences with state-of-the-art clubhouses within your ₹2.2Cr budget. May I email this to you and follow up with a short call tomorrow?',
      priority: 'HOT',
      score: 86,
      nextMove: {
        what: 'Send project brochures today and schedule a video walkthrough or call tomorrow.',
        why: 'Strong financial capability (₹2.2Cr) and clear 1-3 month decision window. Highly specific amenity preferences indicate serious intent.',
        when: 'Within 24 Hours',
        callStrategy: [
          'Briefly compare Powai lake-view towers vs Kanjurmarg West modern complexes',
          'Highlight gated security protocols and clubhouse amenities',
          'Confirm carpet area expectations and parking slot allocation'
        ]
      }
    },
    chatHistory: []
  },
  {
    id: 'lead-3',
    customerName: 'Aman Verma',
    location: 'Gurgaon',
    propertyRequirement: 'Residential plot / villa in Sector 57 or 65',
    budget: '₹1.5 Crores',
    buyingTimeline: '3-6 months',
    customerMessage: 'Hi, I am looking to invest in a residential plot or independent villa floor along Golf Course Extension Road (Sec 57/65). Budget around 1.5Cr. Planning in 3 to 6 months.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    analysis: {
      summary: 'Investor/end-user seeking plot or villa floor on Golf Course Ext Rd with a ₹1.5Cr budget on a 3-6 month horizon.',
      intent: 'Evaluation & Market Research Phase.',
      keyRequirements: [
        'Residential Plot or Builder Floor',
        'Location: Golf Course Extension Road (Sec 57/65, Gurgaon)',
        'Budget: ₹1.5 Crores',
        'Clear title plot / gated township'
      ],
      objections: [
        'Longer buying timeline (3-6 months)',
        'Price appreciation sensitivity and title verification concern'
      ],
      recommendedNextAction: 'Add to Golf Course Ext Road investment newsletter and share current market rate trends.',
      suggestedResponse: 'Hi Aman! Sector 57 and 65 along Golf Course Ext Road are experiencing high capital appreciation. We have a few verified builder floor options and plots right around ₹1.5Cr. I would love to send over our quarterly micro-market trend report to help your planning. When is a good time to connect?',
      priority: 'WARM',
      score: 68,
      nextMove: {
        what: 'Send market evaluation report and set a follow-up reminder for next week.',
        why: 'Clear budget (₹1.5Cr) and target zone, but decision window is 3-6 months. Direct sales pitch might be premature without providing value first.',
        when: 'This Week',
        callStrategy: [
          'Discuss land rate trends in Sec 57 vs Sec 65',
          'Determine if primary driver is self-use construction or capital gains',
          'Offer to register interest for upcoming builder floor launches'
        ]
      }
    },
    chatHistory: []
  },
  {
    id: 'lead-4',
    customerName: 'Ananya Roy',
    location: 'Hyderabad',
    propertyRequirement: 'Gated community villa in Gachibowli / Tellapur',
    budget: '₹3.5 Crores',
    buyingTimeline: 'Within 1 month',
    customerMessage: 'Urgent inquiry: Relocating to Hyderabad next month. Need a 4BHK gated villa in Tellapur or Gachibowli area. Budget 3.5Cr max. Need immediate possession.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    analysis: {
      summary: 'High-urgency relocation buyer needing immediate possession 4BHK villa in Gachibowli/Tellapur with a ₹3.5Cr budget.',
      intent: 'Immediate Relocation Necessity — Extremely High Intent.',
      keyRequirements: [
        '4BHK Villa in Gachibowli or Tellapur',
        'Budget: ₹3.5 Crores',
        'Immediate possession / Ready to Move',
        'Gated community setup'
      ],
      objections: [
        'Non-negotiable requirement for immediate possession due to job transfer',
        'Demands high security & family recreation facilities'
      ],
      recommendedNextAction: 'Immediate phone call to arrange private villa tour tomorrow.',
      suggestedResponse: 'Hi Ananya, welcome to Hyderabad! We have 2 luxury ready-to-move 4BHK villas in Tellapur within gated communities available immediately at ₹3.4Cr. I can coordinate a private walkthrough tomorrow morning. Please let me know if I can call you now to confirm details.',
      priority: 'HOT',
      score: 97,
      nextMove: {
        what: 'Call immediately and schedule an emergency villa walkthrough.',
        why: 'Relocation deadline creates maximum purchase urgency (<1 month). Strong ₹3.5Cr budget with ready-to-move mandate.',
        when: 'Today',
        callStrategy: [
          'Verify exact relocation move-in date',
          'Present 2 ready-to-occupy villa options in Tellapur',
          'Confirm possession documentation & immediate handover timeline'
        ]
      }
    },
    chatHistory: []
  },
  {
    id: 'lead-5',
    customerName: 'Vikram Malhotra',
    location: 'Delhi NCR',
    propertyRequirement: 'Commercial shop / studio apartment in Noida Sec 132',
    budget: '₹45 Lakhs',
    buyingTimeline: '6+ months',
    customerMessage: 'Looking around for commercial shops or studio apartments in Noida Expressway for passive rental income. Budget around 45L. No hurry, just exploring options.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    analysis: {
      summary: 'Casual retail investor exploring commercial passive income options in Noida Expressway with a ₹45L budget.',
      intent: 'Exploratory / Casual Browsing.',
      keyRequirements: [
        'Commercial shop or studio apartment',
        'Location: Noida Expressway (Sec 132/142)',
        'Budget: ₹45 Lakhs',
        'Assured rental income return'
      ],
      objections: [
        'Very distant timeline (6+ months)',
        'Low immediate commitment'
      ],
      recommendedNextAction: 'Add to low-frequency email drip campaign with rental yield calculators.',
      suggestedResponse: 'Hi Vikram, Noida Expressway offers great commercial rental yields of 7-9%. We have a catalog of lease-assisted studio apartments starting from ₹42L. I will send over our ROI calculator document for your review whenever you are ready.',
      priority: 'COLD',
      score: 42,
      nextMove: {
        what: 'Send passive rental yield guide and schedule low-priority check-in next month.',
        why: 'Explicitly stated "no hurry, just exploring" with a 6+ month timeline. Sales energy should be prioritized on HOT leads.',
        when: 'Next Week',
        callStrategy: [
          'Share expected commercial lease yield percentages',
          'Offer monthly market update subscription'
        ]
      }
    },
    chatHistory: []
  }
];

// Helper to ensure data directory & file exist
function getLeadsFromFile(): Lead[] {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(SEED_LEADS, null, 2), 'utf-8');
      return SEED_LEADS;
    }
    const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const leads: Lead[] = JSON.parse(rawData);
    return Array.isArray(leads) && leads.length > 0 ? leads : SEED_LEADS;
  } catch (error) {
    console.error('Error reading leads from file system:', error);
    return SEED_LEADS;
  }
}

function saveLeadsToFile(leads: Lead[]): void {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing leads to file system:', error);
  }
}

export const db = {
  getAllLeads(): Lead[] {
    const leads = getLeadsFromFile();
    // Sort leads by numeric score descending by default
    return leads.sort((a, b) => (b.analysis?.score || 0) - (a.analysis?.score || 0));
  },

  getLeadById(id: string): Lead | undefined {
    const leads = getLeadsFromFile();
    return leads.find(l => l.id === id);
  },

  createLead(lead: Lead): Lead {
    const leads = getLeadsFromFile();
    leads.unshift(lead);
    saveLeadsToFile(leads);
    return lead;
  },

  updateLead(id: string, updatedFields: Partial<Lead>): Lead | undefined {
    const leads = getLeadsFromFile();
    const index = leads.findIndex(l => l.id === id);
    if (index === -1) return undefined;
    
    leads[index] = {
      ...leads[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    saveLeadsToFile(leads);
    return leads[index];
  },

  deleteLead(id: string): boolean {
    const leads = getLeadsFromFile();
    const filtered = leads.filter(l => l.id !== id);
    if (filtered.length === leads.length) return false;
    saveLeadsToFile(filtered);
    return true;
  },

  addChatMessage(leadId: string, role: 'user' | 'assistant', content: string): Lead | undefined {
    const lead = this.getLeadById(leadId);
    if (!lead) return undefined;

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      role,
      content,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...(lead.chatHistory || []), newMsg];
    return this.updateLead(leadId, { chatHistory: updatedHistory });
  }
};
