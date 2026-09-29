'use client';

import React from 'react';
import { Lead } from '@/lib/types';
import { NextMoveCard } from './NextMoveCard';
import { SuggestedResponseCard } from './SuggestedResponseCard';
import { LeadCopilotChat } from './LeadCopilotChat';
import {
  ArrowLeft,
  Flame,
  Zap,
  Snowflake,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  FileText,
  User,
  Trash2,
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
      <Zap className="h-3.5 w-3.5 fill-amber-400/20" /> WARM LEAD
    </span>
  );

  if (priority === 'HOT') {
    priorityBadge = (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/40 animate-pulse">
        <Flame className="h-3.5 w-3.5 fill-rose-400" /> HOT LEAD
      </span>
    );
  } else if (priority === 'COLD') {
    priorityBadge = (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
        <Snowflake className="h-3.5 w-3.5" /> COLD LEAD
      </span>
    );
  }

  let scoreColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  if (score >= 80) scoreColor = 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  else if (score < 50) scoreColor = 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => onDelete(lead.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400 hover:border-rose-500/40 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Lead</span>
        </button>
      </div>

      {/* Customer Header Snapshot Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-lg shadow-md shadow-indigo-600/20">
              {lead.customerName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {lead.customerName}
                </h2>
                {priorityBadge}
              </div>
              <p className="mt-1 text-sm font-medium text-indigo-300 flex items-center gap-1.5">
                <Building className="h-4 w-4" />
                <span>{lead.propertyRequirement}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 border-t border-slate-800 pt-4 lg:border-t-0 lg:pt-0">
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Budget
              </span>
              <span className="text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
                <DollarSign className="h-3.5 w-3.5" />
                {lead.budget}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Location
              </span>
              <span className="text-sm font-semibold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                {lead.location}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Timeline
              </span>
              <span className="text-sm font-semibold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                {lead.buyingTimeline}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Lead Score
              </span>
              <span className={`text-base font-black px-2 py-0.5 rounded-lg border ${scoreColor} inline-block mt-0.5`}>
                {score} <span className="text-[10px] font-medium text-slate-400">/ 100</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Left Workspace (65%) & Right Co-pilot Chat (35%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Intelligence Workspace (8 cols) */}
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          {/* FEATURE 6: Signature "NEXT MOVE" Card */}
          <NextMoveCard
            nextMove={analysis?.nextMove}
            fallbackAction={analysis?.recommendedNextAction}
          />

          {/* Customer Inquiry Text Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Original Inbound Customer Inquiry
              </h4>
            </div>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/80 p-4 rounded-lg border border-slate-950 italic">
              &quot;{lead.customerMessage}&quot;
            </p>
          </div>

          {/* Executive AI Analysis & Intent Breakdown */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* AI Summary Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-indigo-400" />
                AI Lead Executive Summary
              </span>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {analysis?.summary || 'Analysis pending...'}
              </p>
            </div>

            {/* Customer Intent Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Customer Intent Level
              </span>
              <p className="mt-2 text-xs font-semibold text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/20">
                {analysis?.intent || 'Intent analyzed.'}
              </p>
            </div>
          </div>

          {/* Key Requirements & Objections Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Key Requirements */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Extracted Key Requirements
              </span>
              <ul className="space-y-2">
                {analysis?.keyRequirements && analysis.keyRequirements.length > 0 ? (
                  analysis.keyRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400">No specific requirements listed.</li>
                )}
              </ul>
            </div>

            {/* Objections / Concerns */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                Identified Objections & Hesitations
              </span>
              <ul className="space-y-2">
                {analysis?.objections && analysis.objections.length > 0 ? (
                  analysis.objections.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-rose-200 bg-rose-950/20 p-2 rounded-lg border border-rose-500/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400">No major objections identified.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Suggested Customer Response Card */}
          <SuggestedResponseCard
            response={analysis?.suggestedResponse}
            customerName={lead.customerName}
          />
        </div>

        {/* Right Column: Lead-Specific Conversational Co-pilot (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 h-[680px]">
          <LeadCopilotChat
            lead={lead}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    </div>
  );
};
