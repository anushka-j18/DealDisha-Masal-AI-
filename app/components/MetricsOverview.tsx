'use client';

import React from 'react';
import { Flame, Zap, Snowflake, Users, TrendingUp, Compass } from 'lucide-react';
import { Lead } from '@/lib/types';

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
  const warmCount = leads.filter((l) => l.analysis?.priority === 'WARM').length;
  const coldCount = leads.filter((l) => l.analysis?.priority === 'COLD').length;

  const hotPercentage = total > 0 ? Math.round((hotCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Leads Card */}
      <button
        onClick={() => onSelectPriority('ALL')}
        className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
          activePriorityFilter === 'ALL'
            ? 'border-indigo-500/50 bg-indigo-950/20 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Leads
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{total}</span>
          <span className="text-xs text-slate-400">active in pipeline</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
          <Compass className="h-3.5 w-3.5" />
          <span>Real-time AI Intake</span>
        </div>
      </button>

      {/* Hot Leads Card */}
      <button
        onClick={() => onSelectPriority('HOT')}
        className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
          activePriorityFilter === 'HOT'
            ? 'border-rose-500/50 bg-rose-950/30 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/50'
            : 'border-slate-800 bg-slate-900/60 hover:border-rose-500/30 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            Hot Leads
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 group-hover:scale-110 transition-transform">
            <Flame className="h-4 w-4 fill-rose-500/20" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-300">{hotCount}</span>
          <span className="text-xs text-rose-400/80 font-medium">({hotPercentage}% of total)</span>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-rose-400 font-semibold">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Immediate Call Required</span>
        </div>
      </button>

      {/* Warm Leads Card */}
      <button
        onClick={() => onSelectPriority('WARM')}
        className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
          activePriorityFilter === 'WARM'
            ? 'border-amber-500/50 bg-amber-950/30 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
            : 'border-slate-800 bg-slate-900/60 hover:border-amber-500/30 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Warm Leads
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
            <Zap className="h-4 w-4 fill-amber-500/20" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-300">{warmCount}</span>
          <span className="text-xs text-slate-400">1–3 months timeline</span>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-amber-400 font-medium">
          <span>Active option comparison</span>
        </div>
      </button>

      {/* Cold Leads Card */}
      <button
        onClick={() => onSelectPriority('COLD')}
        className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
          activePriorityFilter === 'COLD'
            ? 'border-cyan-500/50 bg-cyan-950/30 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
            : 'border-slate-800 bg-slate-900/60 hover:border-cyan-500/30 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Cold Leads
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 group-hover:scale-110 transition-transform">
            <Snowflake className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyan-300">{coldCount}</span>
          <span className="text-xs text-slate-400">3–6+ mos timeline</span>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-cyan-400/80 font-medium">
          <span>Scheduled drip nurture</span>
        </div>
      </button>
    </div>
  );
};
