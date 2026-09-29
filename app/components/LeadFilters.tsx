'use client';

import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface LeadFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  selectedTimeline: string;
  onTimelineChange: (timeline: string) => void;
  sortBy: 'score_desc' | 'score_asc' | 'date_newest' | 'date_oldest';
  onSortChange: (sort: 'score_desc' | 'score_asc' | 'date_newest' | 'date_oldest') => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  selectedTimeline,
  onTimelineChange,
  sortBy,
  onSortChange,
}) => {
  const hasActiveFilters = searchQuery !== '' || selectedPriority !== 'ALL' || selectedTimeline !== 'ALL';

  const resetFilters = () => {
    onSearchChange('');
    onPriorityChange('ALL');
    onTimelineChange('ALL');
    onSortChange('score_desc');
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by customer name, location, or requirement..."
          className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Priority Filter Pills */}
        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'HOT', label: '🔥 Hot' },
            { id: 'WARM', label: '⚡ Warm' },
            { id: 'COLD', label: '❄️ Cold' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onPriorityChange(item.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedPriority === item.id
                  ? item.id === 'HOT'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : item.id === 'WARM'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : item.id === 'COLD'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Timeline Dropdown */}
        <div className="relative">
          <select
            value={selectedTimeline}
            onChange={(e) => onTimelineChange(e.target.value)}
            className="appearance-none rounded-lg border border-slate-800 bg-slate-950 py-2 pl-3.5 pr-8 text-xs font-medium text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Timelines</option>
            <option value="1_month">&lt; 1 Month (Urgent)</option>
            <option value="1_3_months">1–3 Months</option>
            <option value="3_6_months">3–6 Months</option>
            <option value="6_plus_months">&gt; 6 Months</option>
          </select>
          <Filter className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="appearance-none rounded-lg border border-slate-800 bg-slate-950 py-2 pl-3.5 pr-8 text-xs font-medium text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="score_desc">Sort: Highest Score</option>
            <option value="score_asc">Sort: Lowest Score</option>
            <option value="date_newest">Sort: Newest Leads</option>
            <option value="date_oldest">Sort: Oldest Leads</option>
          </select>
          <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
