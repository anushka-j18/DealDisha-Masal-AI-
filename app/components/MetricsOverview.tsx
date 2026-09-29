'use client';

import React from 'react';
import { Lead } from '@/lib/types';
import { Users, Flame, Clock, Award } from 'lucide-react';

interface MetricsOverviewProps {
  leads: Lead[];
  activePriorityFilter: string;
  onSelectPriority: (priority: string) => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  leads,
  activePriorityFilter,
  onSelectPriority,
}) => {
  const total = leads.length;
  const hotCount = leads.filter((l) => l.analysis?.priority === 'HOT').length;
  const followUpsToday = leads.filter(
    (l) => l.analysis?.nextMove?.when === 'Today' || l.buyingTimeline.toLowerCase().includes('1 month')
  ).length;

  const avgScore =
    total > 0
      ? Math.round(leads.reduce((acc, l) => acc + (l.analysis?.score || 0), 0) / total)
      : 0;

  return (
    <div className="space-y-4">
      {/* Editorial Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Good morning, Anushka
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Here&apos;s where your pipeline stands today.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md self-start sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time AI Pipeline Active</span>
        </div>
      </div>

      {/* Compact Summary Metric Blocks */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Leads */}
        <button
          onClick={() => onSelectPriority('ALL')}
          className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
            activePriorityFilter === 'ALL'
              ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Leads
            </span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">{total}</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600">
            <Users className="h-3.5 w-3.5" />
          </div>
        </button>

        {/* Hot Leads */}
        <button
          onClick={() => onSelectPriority('HOT')}
          className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
            activePriorityFilter === 'HOT'
              ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500'
              : 'border-slate-200 bg-white hover:border-rose-200'
          }`}
        >
          <div>
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              Hot Leads
            </span>
            <span className="text-xl font-bold text-rose-700 mt-0.5 block">{hotCount}</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-100 text-rose-600">
            <Flame className="h-3.5 w-3.5" />
          </div>
        </button>

        {/* Follow-ups Today */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-left">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Follow-ups Today
            </span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">{followUpsToday}</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-600">
            <Clock className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Avg. Lead Score */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-left">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Avg. Lead Score
            </span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">
              {avgScore} <span className="text-xs font-normal text-slate-400">/100</span>
            </span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
            <Award className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
