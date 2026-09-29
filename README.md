# DealDisha — AI-Powered Real Estate Sales Intelligence Platform

> **Tagline:** *"Know the lead. Choose the next move."*  
> **Purpose:** AI-powered sales assistant that turns raw real estate lead inquiries into structured intent analysis, priority scoring, tactical "Next Move" action recommendations, and lead-grounded conversational co-piloting.

---

## 🌟 Executive Overview

DealDisha is a B2B sales intelligence platform designed specifically for real estate teams handling high volumes of inbound property buyer leads. Rather than acting as a generic chatbot, DealDisha operates as a strategic command center that answers the core sales question:

> **"Which lead should I focus on right now, why is it important, and what should I do next?"**

---

## ⚡ Core Assignment Features Implemented

### 1. Lead Intake & Storage (`/api/leads`)
- Flexible lead creation capturing: **Customer Name**, **Location**, **Property Requirement**, **Budget**, **Buying Timeline**, and **Customer Message / Inquiry**.
- Includes **1-Click Demo Presets** (e.g., Bangalore ₹80L 2BHK, Mumbai ₹2.2Cr Luxury 3BHK, Hyderabad ₹3.5Cr Villa Relocation, Gurgaon ₹1.5Cr Plot Investment) for instantaneous testing.
- Persistent zero-config storage (`dealdisha_leads.json`).

### 2. AI Lead Analysis (`lib/ai.ts`)
- Leverages Google Gemini 2.5 API (`@google/genai`) to generate structured JSON sales intelligence:
  - **Executive Summary**
  - **Customer Intent Level**
  - **Extracted Key Requirements**
  - **Objections & Hesitations**
  - **Recommended Immediate Next Step**
  - **Suggested Customer Response**
  - **Numeric Lead Score (0–100)**
  - **Priority Rating (`HOT`, `WARM`, `COLD`)**
  - **Signature "Next Move"**
- Fact-grounded analysis strict guidelines prohibiting invented property specs or budget details.

### 3. Lead Prioritization Matrix (`app/components/LeadTable.tsx`)
- Priority Leads Matrix automatically sorting leads by urgency score.
- High-contrast B2B SaaS badges:
  - 🔥 **HOT (Score 80–100):** Urgent timeline (<1 month), explicit budget, clear location preference. Immediate call required.
  - ⚡ **WARM (Score 50–79):** Timeline 1–3 months, active comparison phase.
  - ❄️ **COLD (Score <50):** Timeline 3–6+ months, exploratory interest.
- Interactive metric cards for instant status filtering.

### 4. Detailed Lead Workspace (`app/components/LeadWorkspace.tsx`)
- Split-screen workspace rendering:
  - **Customer Snapshot Header** (Name, Location, Budget, Timeline, Priority Badge, Score ring).
  - **Signature "NEXT MOVE" Card** (WHAT TO DO, WHY, WHEN, and Tactical Call Strategy checklist).
  - **Original Inbound Message Card**.
  - **AI Analysis Breakdown & Concerns**.
  - **Suggested Customer Response** with 1-Click Copy button.

### 5. Lead-Specific AI Conversation / Co-pilot (`app/components/LeadCopilotChat.tsx`)
- Interactive strategy assistant grounded strictly in the active lead's context.
- Quick prompt buttons:
  - *"What should I emphasize on the call?"*
  - *"Make my reply more assertive."*
  - *"What are the customer's biggest concerns?"*
  - *"Should I call this lead now?"*
  - *"Give me 3 talking points for the call."*
- Remembers transcript history per lead.

### 6. Signature Feature: "NEXT MOVE" (`app/components/NextMoveCard.tsx`)
- Direct sales action guidance specifying:
  - **WHAT TO DO:** Concrete action (e.g., *"Call the customer today to schedule an immediate site visit."*)
  - **WHY:** Grounded rationale citing budget, timeline, and location facts.
  - **WHEN:** Execution urgency (*Today*, *Within 24 Hours*, *This Week*).
  - **CONCISE CALL STRATEGY:** 3–4 tactical bullet points for phone preparation.

---

## 🛠️ Recommended Tech Stack & Architecture

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, React 19) | Server-rendered API routes + Client Components for seamless responsiveness. |
| **Language** | TypeScript | Strict type safety for AI JSON payloads and lead entities. |
| **Styling** | Tailwind CSS v4 | B2B SaaS dark theme aesthetic, glowing badges, glassmorphism cards. |
| **Icons** | Lucide React | Clean, crisp B2B icon system. |
| **AI Integration** | `@google/genai` (Google Gemini 2.5 API) | Fast, structured JSON generation with fallback deterministic scoring engine. |
| **Data Persistence**| Node.js File System JSON Store | Zero-configuration local database that works out of the box on Vercel/Netlify. |

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/anushka-j18/DealDisha-Masal-AI-.git
cd DealDisha-Masal-AI-

# Install dependencies
npm install
```

### 2. Environment Setup (Optional)
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If no API key is provided, DealDisha automatically runs its intelligent fallback analysis engine so the app operates seamlessly out of the box!*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 Interview Walkthrough & Explanation Guide

When explaining DealDisha in an interview:

1. **Product Purpose:** DealDisha converts chaotic inbound customer inquiries into prioritized sales moves. Real estate agents waste 70% of their time reading repetitive inquiries; DealDisha highlights who to call right now.
2. **Architecture Simplicity:** We chose Next.js App Router to co-locate API endpoints (`/api/leads`, `/api/chat`) with UI components, eliminating backend setup overhead while ensuring sub-second response times.
3. **Structured AI Integration:** Rather than unstructured text responses, our AI pipeline enforces JSON outputs (`responseMimeType: 'application/json'`). This allows the frontend to reliably render badges, scores, and call strategy bullet points without parsing errors.
4. **Context-Grounded Co-pilot:** The Lead Co-pilot uses a custom system prompt that injects the lead's exact budget, timeline, location, and previous AI findings into every prompt, ensuring answers are tailored to that specific deal.
5. **Zero-Setup Persistence:** The database layer (`lib/db.ts`) reads and writes to `dealdisha_leads.json` with pre-loaded real estate seed data (Rahul Sharma, Priya Shah, etc.), ensuring the app works out of the box without requiring database credentials.
