# DealDisha — AI-Powered Real Estate Sales Intelligence Platform

> **Tagline:** *"Know the lead. Choose the next move."*  
> **Purpose:** AI-powered sales assistant that turns raw real estate inbound lead inquiries into structured intent analysis, priority scoring, tactical "Next Move" action recommendations, and lead-grounded conversational co-piloting.

---

## 1. Project Overview
DealDisha is a B2B sales intelligence platform designed specifically for real estate teams handling high volumes of inbound property buyer inquiries. Rather than operating as a generic chatbot, DealDisha operates as a strategic command center that answers the core sales question:
*"Which lead should I focus on right now, why is it important, and what should I do next?"*

---

## 2. Problem Statement
Real estate salespeople receive hundreds of inbound inquiries across WhatsApp, web forms, and portals. Manually reading each inquiry, extracting key constraints, determining buyer urgency, and deciding the appropriate next action consumes up to 70% of an agent's workday. High-intent, high-budget buyers are often delayed while low-intent inquiries are processed.

---

## 3. Solution
DealDisha automates lead intake, intent extraction, urgency scoring, and action planning. Using structured AI analysis, DealDisha instantly converts raw messages into prioritized leads (`HOT`, `WARM`, `COLD`), outputs a signature **"Next Move"** recommendation (*WHAT TO DO*, *WHY*, *WHEN*, *Call Strategy*), and provides an embedded **Lead Co-pilot** assistant grounded in the specific lead's context.

---

## 4. Key Features
- **Lead Intake Form**: Captures Customer Name, Target Location, Property Requirement, Budget, Buying Timeline, and Customer Inquiry Message, supported by 1-click demo presets.
- **AI Lead Analysis**: Extracts Executive Summary, Intent Level, Key Requirements, Objections & Hesitations, Recommended Action, and Copyable Customer Response.
- **Lead Prioritization Matrix**: Displays leads sorted by numeric score (0–100) with visual badges (`HOT`, `WARM`, `COLD`).
- **Signature "NEXT MOVE" Feature**: Gives explicit guidance on *WHAT TO DO*, *WHY*, *WHEN*, and 2–4 concise talking points.
- **Lead Detail Workspace**: Single-view sales workspace presenting full customer snapshot, original inquiry, analysis, and response card.
- **Lead-Specific AI Co-pilot**: Embedded strategy chat assistant grounded strictly in the active lead's budget, location, and message context.
- **Real-Time Search & Filtering**: Multi-field search, priority pill filters, timeline filters, and multi-criterion sorting.

---

## 5. How DealDisha Works
1. **Intake**: Salesperson submits an inbound inquiry (or selects a demo preset).
2. **Analysis**: Serverless API sends lead payload to Google Gemini API (`gemini-2.5-flash`) for structured JSON extraction.
3. **Prioritization**: Lead is scored on a 0–100 scale and categorized into Hot, Warm, or Cold priority tiers.
4. **Action**: Dashboard highlights the lead; opening the Lead Detail Workspace displays the **"Next Move"** call strategy and ready-to-send customer response.
5. **Strategy**: Salesperson can ask the embedded AI Co-pilot targeted questions (*"What should I emphasize on the call?"*, *"How should I handle the objection?"*).

---

## 6. Architecture Overview
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (BROWSER)                           │
│  ┌────────────────────┐  ┌───────────────────────┐  ┌────────────────────┐ │
│  │ Sales Dashboard    │  │ Lead Workspace        │  │ Lead Intake Form   │ │
│  │ - Metrics Overview │  │ - Next Move Feature   │  │ - Quick Presets    │ │
│  │ - Priority Table   │  │ - AI Co-pilot Chat    │  │ - Field Validation │ │
│  └─────────┬──────────┘  └───────────┬───────────┘  └──────────┬─────────┘ │
└────────────┼─────────────────────────┼─────────────────────────┼───────────┘
             │                         │                         │
             ▼                         ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS API ROUTE LAYER                           │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│  │ POST /api/leads      │ │ GET /api/leads/[id]  │ │ POST /api/chat       │ │
│  │ - Structured AI Call │ │ - Fetch Single Lead  │ │ - Lead-Aware CoPilot │ │
│  └──────────┬───────────┘ └──────────┬───────────┘ └──────────┬───────────┘ │
└─────────────┼────────────────────────┼────────────────────────┼─────────────┘
              │                        │                        │
              ▼                        ▼                        ▼
┌─────────────────────────────┐ ┌──────────────────────────────┐ ┌─────────────┐
│  LLM SERVICE (Gemini API)   │ │  DATA PERSISTENCE LAYER      │ │  SEED DATA  │
│  - gemini-2.5-flash         │ │  - Node File System Store    │ │  - Preloaded│
│  - Structured JSON Output   │ │  - Fallback Scoring Engine   │ │    B2B Leads│
└─────────────────────────────┘ └──────────────────────────────┘ └─────────────┘
```

---

## 7. Tech Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript (Strict typing for Lead entities & AI JSON schemas)
- **Styling**: Tailwind CSS v4 (Dark B2B SaaS theme, responsive design)
- **Icons**: Lucide React
- **AI SDK**: `@google/genai` (Google Gemini 2.5 API)
- **Testing**: Vitest (`npm test`)
- **Data Persistence**: Local SQLite database powered by Prisma ORM (`prisma/schema.prisma`, `dev.db`)

---

## 8. AI Model/API Used
- **Primary AI Provider**: Google Gemini API via `@google/genai` SDK.
- **Target Model**: `gemini-2.5-flash`.
- **Configuration**: `responseMimeType: 'application/json'` enforcing structured output validation.
- **Safety & Timeout**: 10-second timeout race logic with automatic fallback to a deterministic 6-factor scoring engine.

---

## 9. AI Analysis Flow
1. Lead metadata (Customer Name, Location, Requirement, Budget, Timeline, Message) is sanitized.
2. Prompt is dispatched to `gemini-2.5-flash` with strict system instructions prohibiting factual inventions.
3. Raw JSON response is parsed and validated against an 8-field schema (`summary`, `intent`, `keyRequirements`, `objections`, `recommendedNextAction`, `suggestedResponse`, `score`, `priority`, `nextMove`).
4. Validated analysis payload is saved with the lead record in storage.

---

## 10. Lead Scoring Approach
DealDisha uses an objective, explainable 6-factor evaluation model:
1. **Buying Timeline Urgency (Max 35 pts)**: `<1 month` = +35; `1–3 months` = +25; `3–6 months` = +15; `>6 months` = +5.
2. **Budget Clarity (Max 20 pts)**: Specific figure (*e.g., ₹80L, ₹2.2Cr*) = +20; flexible = +12.
3. **Property Requirement Clarity (Max 20 pts)**: Explicit config & location (*e.g., 2BHK in Whitefield*) = +20; general = +10.
4. **Purchase Intent & Urgency (Max 15 pts)**: Mentions relocation, site visit request, family purchase, or ready possession = +15.
5. **Objections Adjustment (-3 to -15 pts)**: Severe financial or structural constraints reduce score slightly.

**Priority Tiers**:
- 🔥 **HOT (Score 80–100)**: Immediate timeline (<1 month), explicit budget, top purchase intent.
- ⚡ **WARM (Score 50–79)**: 1–3 month timeline, active comparison phase.
- ❄️ **COLD (Score <50)**: 3–6+ month timeline or casual exploratory inquiry.

---

## 11. Next Move Feature
Instead of generic sales summaries, DealDisha provides direct action guidance:
- **WHAT TO DO**: Concrete action (*"Call Rahul Sharma today to schedule an immediate site visit."*).
- **WHY**: Grounded rationale citing budget fit, timeline urgency, and location triggers.
- **WHEN**: Urgency timeframe (*TODAY*, *WITHIN 24 HOURS*, *THIS WEEK*).
- **CONCISE TALKING POINTS**: 2–4 tactical bullet points for phone preparation.

---

## 12. Project Structure
```
DealDisha-Masal-AI-/
├── __tests__/
│   └── core.test.ts          # Vitest suite testing validation, DB CRUD, scoring & API
├── app/
│   ├── api/
│   │   ├── leads/
│   │   │   ├── route.ts      # GET (list leads), POST (create + analyze lead)
│   │   │   └── [id]/
│   │   │       └── route.ts  # GET, DELETE individual lead
│   │   └── chat/
│   │       └── route.ts      # POST (lead-specific AI co-pilot Q&A)
│   ├── components/
│   │   ├── Header.tsx        # Top navigation header & status metrics
│   │   ├── MetricsOverview.tsx # KPI metric cards (Total, Hot, Warm, Cold)
│   │   ├── LeadFilters.tsx   # Search bar, priority pills, timeline filter, sort dropdown
│   │   ├── LeadTable.tsx     # Prioritized Leads Matrix table
│   │   ├── LeadIntakeModal.tsx # Intake modal with validation & demo presets
│   │   ├── LeadWorkspace.tsx # Lead detail workspace container
│   │   ├── NextMoveCard.tsx  # Signature "NEXT MOVE" feature component
│   │   ├── SuggestedResponseCard.tsx # Copyable customer response card
│   │   └── LeadCopilotChat.tsx # Lead-aware AI strategy chat assistant
│   ├── globals.css           # Tailwind CSS v4 styling & dark theme tokens
│   ├── layout.tsx            # Root Next.js layout
│   └── page.tsx              # Main dashboard view orchestrator
├── lib/
│   ├── ai.ts                 # Gemini API integration, JSON schemas & fallback engine
│   ├── db.ts                 # Node file system lead storage engine & seed data
│   └── types.ts              # TypeScript interfaces (Lead, AIAnalysis, NextMove, ChatMessage)
├── .env.example              # Environment variables template
├── dealdisha_leads.json      # Persistent lead JSON data file
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 13. Environment Variables
Create a `.env.local` file in the project root:
```env
# Google Gemini API Key (Required for live AI Lead Analysis & Co-pilot Chat)
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If no API key is set, DealDisha logs a server warning and runs its deterministic fallback scoring engine so the application works out of the box in any environment.*

---

## 14. Local Setup Instructions
1. **Clone Repository**:
   ```bash
   git clone https://github.com/anushka-j18/DealDisha-Masal-AI-.git
   cd DealDisha-Masal-AI-
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment** (Optional):
   ```bash
   cp .env.example .env.local
   ```

---

## 15. How to Run the Project
- **Development Server**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Run Core Tests**:
  ```bash
  npm test
  ```

- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

---

## 16. Deployment Information
DealDisha is built with zero external database setup dependencies and is 100% ready to deploy on Vercel, Netlify, or AWS Amplify:
1. Push repository to GitHub.
2. Import repository into Vercel.
3. Add `GEMINI_API_KEY` to Vercel Environment Variables.
4. Deploy!

---

## 17. Known Limitations
- Storage uses a local JSON file (`dealdisha_leads.json`) suited for single-instance / small team deployments. For multi-tenant production scaling, connecting PostgreSQL via Prisma ORM is recommended.
- Customer response copy relies on browser `navigator.clipboard` permissions.

---

## 18. AI Usage Disclosure
DealDisha uses Google Gemini AI (`gemini-2.5-flash`) for natural language intent extraction and strategic sales coaching. AI outputs are strictly grounded in user-provided lead inquiries and validated against structured JSON schemas before presentation.
