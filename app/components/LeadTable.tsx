'use client';

import React from 'react';
import { Lead } from '@/lib/types';
import { PhoneCall, ArrowRight, Trash2, Building2, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  title?: string;
  subtitle?: string;
  onSelectLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string, event: React.MouseEvent) => void;
  showRecentSection?: boolean;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  title = 'Needs Attention',
  subtitle = 'Prioritized opportunities requiring immediate action',
  onSelectLead,
  onDeleteLead,
  showRecentSection = true,
}) => {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Building2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-bold text-slate-900">No leads match your pipeline view</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Your next opportunity starts here. Try adjusting your search query or add a new lead.
        </p>
      </div>
    );
  }

  // Separate priority leads (HOT/WARM) from recent/cold leads for editorial hierarchy
  const priorityLeads = leads.filter((l) => (l.analysis?.score || 0) >= 60);
  const recentLeads = showRecentSection ? leads.filter((l) => (l.analysis?.score || 0) < 60) : [];

  return (
    <div className="space-y-6">
      {/* Primary Section: Needs Attention */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
            <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            {leads.length} Leads
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3">Priority</th>
                <th scope="col" className="px-4 py-3">Customer</th>
                <th scope="col" className="px-4 py-3">Requirement & Location</th>
                <th scope="col" className="px-4 py-3">Budget & Timeline</th>
                <th scope="col" className="px-4 py-3 text-center">Score</th>
                <th scope="col" className="px-4 py-3">Next Move</th>
                <th scope="col" className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => {
                const priority = lead.analysis?.priority || 'WARM';
                const score = lead.analysis?.score || 50;
                const nextMoveText = lead.analysis?.nextMove?.what || lead.analysis?.recommendedNextAction || 'Call customer today';

                let priorityBullet = (
                  <span className="inline-flex items-center gap-1.5 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> WARM
                  </span>
                );

                if (priority === 'HOT') {
                  priorityBullet = (
                    <span className="inline-flex items-center gap-1.5 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[10px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" /> HOT
                    </span>
                  );
                } else if (priority === 'COLD') {
                  priorityBullet = (
                    <span className="inline-flex items-center gap-1.5 font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> COLD
                    </span>
                  );
                }

                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="group cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Priority Indicator */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {priorityBullet}
                    </td>

                    {/* Customer Name */}
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block">
                        {lead.customerName}
                      </span>
                    </td>

                    {/* Requirement & Location */}
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800 block line-clamp-1">
                        {lead.propertyRequirement}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        {lead.location}
                      </span>
                    </td>

                    {/* Budget & Timeline */}
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-emerald-700 block">
                        {lead.budget}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                        {lead.buyingTimeline}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-slate-100 text-slate-700 border border-slate-200">
                        {score}
                      </span>
                    </td>

                    {/* Next Move (Visually Actionable) */}
                    <td className="px-4 py-3.5 max-w-[220px]">
                      <span className="text-xs font-semibold text-slate-800 line-clamp-1 block">
                        {nextMoveText}
                      </span>
                      {lead.analysis?.nextMove?.when && (
                        <span className="text-[10px] font-medium text-indigo-600 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> Execute: {lead.analysis.nextMove.when}
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => onDeleteLead(lead.id, e)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectLead(lead)}
                          className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors"
                        >
                          <span>Action</span>
                          <ArrowRight className="h-3 w-3" />
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
    </div>
  );
};
