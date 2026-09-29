'use client';

import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';

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
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads, customer names, locations, requirements..."
          className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Priority Filter Pills */}
        <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 p-0.5">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'HOT', label: 'Hot' },
            { id: 'WARM', label: 'Warm' },
            { id: 'COLD', label: 'Cold' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onPriorityChange(item.id)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                selectedPriority === item.id
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="appearance-none rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-7 text-xs font-medium text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none"
          >
            <option value="score_desc">Sort: Highest Score</option>
            <option value="score_asc">Sort: Lowest Score</option>
            <option value="date_newest">Sort: Newest First</option>
            <option value="date_oldest">Sort: Oldest First</option>
          </select>
          <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
