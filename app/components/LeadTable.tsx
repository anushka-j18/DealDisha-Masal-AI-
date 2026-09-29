'use client';

import React from 'react';
import { Lead } from '@/lib/types';
import { Flame, Zap, Snowflake, MapPin, Calendar, ArrowRight, User, PhoneCall, Trash2, FileText } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string, event: React.MouseEvent) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onSelectLead,
  onDeleteLead,
}) => {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
          <User className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">No leads match your criteria</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-sm">
          Try clearing your search query or filters, or add a new lead using the intake form.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/70 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3.5">Customer & Location</th>
              <th scope="col" className="px-4 py-3.5">Requirement & Budget</th>
              <th scope="col" className="px-4 py-3.5">Timeline</th>
              <th scope="col" className="px-4 py-3.5 text-center">Priority</th>
              <th scope="col" className="px-4 py-3.5 text-center">Score</th>
              <th scope="col" className="px-4 py-3.5">AI Summary</th>
              <th scope="col" className="px-4 py-3.5">Next Move Strategy</th>
              <th scope="col" className="px-4 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {leads.map((lead) => {
              const priority = lead.analysis?.priority || 'WARM';
              const score = lead.analysis?.score || 50;

              let priorityBadge = (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                  <Zap className="h-3 w-3 fill-amber-400/20" /> WARM
                </span>
              );

              if (priority === 'HOT') {
                priorityBadge = (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-bold text-rose-300 border border-rose-500/30 animate-pulse">
                    <Flame className="h-3 w-3 fill-rose-400" /> HOT
                  </span>
                );
              } else if (priority === 'COLD') {
                priorityBadge = (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/20">
                    <Snowflake className="h-3 w-3" /> COLD
                  </span>
                );
              }

              let scoreColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
              if (score >= 80) scoreColor = 'text-rose-400 border-rose-500/40 bg-rose-500/10';
              else if (score < 50) scoreColor = 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';

              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="group cursor-pointer transition-colors hover:bg-slate-800/50"
                >
                  {/* Customer & Location */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                      <span>{lead.customerName}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <span>{lead.location}</span>
                    </div>
                  </td>

                  {/* Property Requirement & Budget */}
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-200 line-clamp-1 max-w-[200px]">
                      {lead.propertyRequirement}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-emerald-400">
                      Budget: {lead.budget}
                    </div>
                  </td>

                  {/* Buying Timeline */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium whitespace-nowrap">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{lead.buyingTimeline}</span>
                    </div>
                  </td>

                  {/* Priority Badge */}
                  <td className="px-4 py-3.5 text-center">
                    {priorityBadge}
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3.5 text-center">
                    <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${scoreColor}`}>
                      {score}
                    </div>
                  </td>

                  {/* Short AI Summary */}
                  <td className="px-4 py-3.5 max-w-[220px]">
                    <div className="flex items-start gap-1 text-xs text-slate-300">
                      <FileText className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-slate-400">
                        {lead.analysis?.summary || 'Lead inquiry analyzed.'}
                      </span>
                    </div>
                  </td>

                  {/* Recommended Next Action */}
                  <td className="px-4 py-3.5 max-w-[240px]">
                    <div className="flex items-start gap-1.5 text-xs text-slate-300 font-medium">
                      <PhoneCall className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-indigo-200">
                        {lead.analysis?.nextMove?.what || lead.analysis?.recommendedNextAction || 'Call customer today.'}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => onDeleteLead(lead.id, e)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onSelectLead(lead)}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all whitespace-nowrap"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
