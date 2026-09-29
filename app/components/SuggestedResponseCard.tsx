'use client';

import React, { useState } from 'react';
import { MessageSquare, Copy, Check } from 'lucide-react';

interface SuggestedResponseCardProps {
  response?: string;
  customerName: string;
}

export const SuggestedResponseCard: React.FC<SuggestedResponseCardProps> = ({
  response,
  customerName,
}) => {
  const [copied, setCopied] = useState(false);

  const textToCopy =
    response ||
    `Hi ${customerName}, thank you for reaching out! We have options matching your requirements ready for review. When would be a good time to connect over a brief call?`;

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Suggested Customer Response
          </h4>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Response</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-3 rounded-lg border border-slate-950 bg-slate-950/90 p-4 text-sm text-slate-200 leading-relaxed font-sans">
        {textToCopy}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Click &quot;Copy Response&quot; to send directly via WhatsApp, Email, or SMS.
      </p>
    </div>
  );
};
