'use client';

import React from 'react';
import { Target, Plus, Zap, RefreshCw, LogOut } from 'lucide-react';

interface HeaderProps {
  onOpenIntakeModal: () => void;
  totalLeadsCount: number;
  hotLeadsCount: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenIntakeModal,
  totalLeadsCount,
  hotLeadsCount,
  onRefresh,
  isRefreshing = false,
}) => {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Target className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-mono">
                Deal<span className="text-indigo-400">Disha</span>
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300 border border-indigo-500/20">
                <Zap className="h-3 w-3 text-amber-400" />
                Sales Intelligence v2.5
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              &quot;Know the lead. Choose the next move.&quot;
            </p>
          </div>
        </div>

        {/* Live Intelligence Stats & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-xs bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Engine Status: <strong className="text-emerald-400 font-medium">Active AI</strong></span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="text-slate-400">
              Total Managed: <span className="font-semibold text-white">{totalLeadsCount}</span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="text-amber-400 font-medium">
              Urgent HOT: <span className="font-bold text-amber-300">{hotLeadsCount}</span>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh Leads Data"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <button
            onClick={onOpenIntakeModal}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-indigo-400 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer"
            title="Sign out of DealDisha"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
