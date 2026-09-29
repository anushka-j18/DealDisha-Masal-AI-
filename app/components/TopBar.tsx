'use client';

import React from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenIntakeModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle = 'AI-Powered Sales Intelligence',
  searchQuery = '',
  onSearchChange,
  onOpenIntakeModal,
}) => {
  return (
    <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{title}</h1>
        <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {onSearchChange && (
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search leads, locations..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        )}

        <button className="relative p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" title="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-600" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
            AJ
          </div>
        </div>
      </div>
    </header>
  );
};
