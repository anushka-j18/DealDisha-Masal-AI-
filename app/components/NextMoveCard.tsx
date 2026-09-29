'use client';

import React from 'react';
import { Target, Clock, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { NextMove } from '@/lib/types';

interface NextMoveCardProps {
  nextMove?: NextMove;
  fallbackAction?: string;
}

export const NextMoveCard: React.FC<NextMoveCardProps> = ({ nextMove, fallbackAction }) => {
  const what = nextMove?.what || fallbackAction || 'Call customer today.';
  const why = nextMove?.why || 'Ground-truth analysis based on budget, timeline, and location requirement.';
  const when = nextMove?.when || 'Today';
  const callStrategy = nextMove?.callStrategy || [
    'Confirm exact sub-locality & configuration preference',
    'Discuss shortlisted options matching the customer budget ceiling',
    'Address key objections or amenity preferences',
    'Lock in a concrete date for an in-person site visit'
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-slate-950 p-6 shadow-xl shadow-indigo-950/40 backdrop-blur-md">
      {/* Top Tag & Time Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Target className="h-4 w-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
            DEALDISHA SIGNATURE FEATURE
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
          <Clock className="h-3.5 w-3.5" />
          <span>EXECUTE: {when.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Hero: NEXT MOVE (WHAT TO DO) */}
      <div className="mt-4">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
          NEXT MOVE
        </span>
        <h3 className="mt-1 text-xl font-extrabold text-white tracking-tight leading-snug">
          {what}
        </h3>
      </div>

      {/* Rationale: WHY */}
      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            WHY
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            WHEN: <strong className="text-amber-300">{when}</strong>
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-300 leading-relaxed font-normal">
          {why}
        </p>
      </div>

      {/* Tactical Talking Points */}
      <div className="mt-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          CONCISE TALKING POINTS ({callStrategy.length})
        </span>
        <ul className="space-y-2">
          {callStrategy.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
