'use client';

import React from 'react';
import { Target, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { NextMove } from '@/lib/types';

interface NextMoveCardProps {
  nextMove?: NextMove;
  fallbackAction?: string;
}

export const NextMoveCard: React.FC<NextMoveCardProps> = ({ nextMove, fallbackAction }) => {
  const what = nextMove?.what || fallbackAction || 'Call the customer today.';
  const why = nextMove?.why || 'Customer has a clear requirement, defined budget, and short buying timeline.';
  const when = nextMove?.when || 'Today';
  const callStrategy = nextMove?.callStrategy || [
    'Confirm exact location preference',
    'Discuss available options matching budget',
    'Address metro/school proximity & site visit date'
  ];

  return (
    <div className="rounded-xl border border-slate-900 bg-slate-900 p-5 shadow-sm text-white space-y-4">
      {/* Header Tag */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-500/20 text-indigo-400">
            <Target className="h-3.5 w-3.5" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            NEXT MOVE
          </span>
        </div>
        <div className="flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/20">
          <Clock className="h-3 w-3" />
          <span>WHEN: {when.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Hero: WHAT TO DO */}
      <div>
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
          {what}
        </h3>
      </div>

      {/* Rationale: WHY */}
      <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          WHY
        </span>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {why}
        </p>
      </div>

      {/* Call Talking Points */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          CALL TALKING POINTS
        </span>
        <ul className="space-y-1.5">
          {callStrategy.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
