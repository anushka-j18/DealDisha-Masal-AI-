'use client';

import React from 'react';
import { Lead } from '@/lib/types';
import { NextMoveCard } from './NextMoveCard';
import { SuggestedResponseCard } from './SuggestedResponseCard';
import { LeadCopilotChat } from './LeadCopilotChat';
import {
  ArrowLeft,
  Building2,
  AlertTriangle,
  MessageSquare,
  FileText,
  Trash2,
  PhoneCall,
  Zap,
} from 'lucide-react';

interface LeadWorkspaceProps {
  lead: Lead;
  onBack: () => void;
  onDelete: (leadId: string) => void;
  onSendMessage: (leadId: string, message: string) => Promise<string>;
}

export const LeadWorkspace: React.FC<LeadWorkspaceProps> = ({
  lead,
  onBack,
  onDelete,
  onSendMessage,
}) => {
  const analysis = lead.analysis;
  const priority = analysis?.priority || 'WARM';
  const score = analysis?.score || 50;

  let priorityBadge = (
    <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs border border-amber-300">
      WARM
    </span>
  );

  if (priority === 'HOT') {
    priorityBadge = (
      <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-xs border border-rose-300">
        HOT
      </span>
    );
  } else if (priority === 'COLD') {
    priorityBadge = (
      <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-300">
        COLD
      </span>
    );
  }

  // Generate requirements chips/tags
  const reqChips = analysis?.keyRequirements || [
    lead.propertyRequirement,
    lead.location,
    lead.budget,
    lead.buyingTimeline,
  ];

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-150">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Leads</span>
        </button>

        <button
          onClick={() => onDelete(lead.id)}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete lead</span>
        </button>
      </div>

      {/* Lead Workspace Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {lead.customerName}
              </h2>
              {priorityBadge}
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Score {score} / 100
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-1">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              <span>{lead.propertyRequirement} · {lead.location}</span>
            </p>
          </div>

          {/* Quick Action Area */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${lead.customerName}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Call Customer</span>
            </a>
            <button
              onClick={() => {
                const el = document.getElementById('suggested-response-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5 text-indigo-600" />
              <span>Send Response</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (60%) & Right Column (40%) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column (7 cols) */}
        <div className="space-y-5 lg:col-span-7">
          {/* AI SUMMARY */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              AI SUMMARY
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-normal">
              {analysis?.summary || `${lead.customerName} is inquiring about ${lead.propertyRequirement} in ${lead.location} with a ${lead.budget} budget and ${lead.buyingTimeline} timeline.`}
            </p>
          </div>

          {/* CUSTOMER INTENT */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              CUSTOMER INTENT
            </span>
            <div className="rounded-md bg-amber-50 border border-amber-200 p-2.5 text-xs font-semibold text-amber-900">
              {analysis?.intent || 'High readiness to purchase — active inquiry.'}
            </div>
          </div>

          {/* KEY REQUIREMENTS CHIPS */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              KEY REQUIREMENTS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {reqChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 border border-slate-200"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* OBJECTIONS */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
              OBJECTIONS & CONCERNS
            </span>
            <ul className="space-y-1.5">
              {analysis?.objections && analysis.objections.length > 0 ? (
                analysis.objections.map((obj, idx) => (
                  <li key={idx} className="text-xs text-rose-800 bg-rose-50 p-2 rounded-md border border-rose-200 flex items-start gap-2 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-500">No major objections identified.</li>
              )}
            </ul>
          </div>

          {/* Original Inquiry */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              ORIGINAL CUSTOMER MESSAGE
            </span>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200 italic leading-relaxed">
              &quot;{lead.customerMessage}&quot;
            </p>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="space-y-5 lg:col-span-5">
          {/* NEXT MOVE HERO */}
          <NextMoveCard
            nextMove={analysis?.nextMove}
            fallbackAction={analysis?.recommendedNextAction}
          />

          {/* SUGGESTED RESPONSE */}
          <div id="suggested-response-section">
            <SuggestedResponseCard
              response={analysis?.suggestedResponse}
              customerName={lead.customerName}
            />
          </div>

          {/* AI ASSISTANT ("Ask about this lead") */}
          <LeadCopilotChat
            lead={lead}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    </div>
  );
};
