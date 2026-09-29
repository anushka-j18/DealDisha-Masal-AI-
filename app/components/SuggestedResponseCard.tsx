'use client';

import React, { useState } from 'react';
import { MessageSquare, Copy, Check, RefreshCw } from 'lucide-react';

interface SuggestedResponseCardProps {
  response?: string;
  customerName: string;
  onRegenerate?: () => void;
}

export const SuggestedResponseCard: React.FC<SuggestedResponseCardProps> = ({
  response,
  customerName,
  onRegenerate,
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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            SUGGESTED RESPONSE
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Regenerate</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy response</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800 leading-relaxed font-sans font-medium whitespace-pre-line">
        {textToCopy}
      </div>
    </div>
  );
};
