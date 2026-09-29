'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, Sparkles, User, HelpCircle } from 'lucide-react';
import { Lead, ChatMessage } from '@/lib/types';

interface LeadCopilotChatProps {
  lead: Lead;
  onSendMessage: (leadId: string, message: string) => Promise<string>;
}

const QUICK_PROMPTS = [
  'What should I emphasize on the call?',
  'Make my reply more assertive.',
  "What are the customer's biggest concerns?",
  'Give me 3 talking points for the call.',
  'How should I handle the objection?',
];

export const LeadCopilotChat: React.FC<LeadCopilotChatProps> = ({
  lead,
  onSendMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(lead.chatHistory || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync state if lead changes
  useEffect(() => {
    setMessages(lead.chatHistory || []);
    setChatError(null);
  }, [lead]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText: string) => {
    const text = questionText.trim();
    if (!text || isLoading) return;

    setChatError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const replyText = await onSendMessage(lead.id, text);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatError(err?.message || 'Failed to connect to AI Co-pilot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Copilot Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>DealDisha Co-pilot</span>
              <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                Lead-Aware
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Strategy coach for <strong className="text-slate-200">{lead.customerName}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="border-b border-slate-800/80 bg-slate-950/40 p-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
          <HelpCircle className="h-3 w-3 text-indigo-400" />
          Quick Strategy Questions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSend(prompt)}
              className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-950/30 hover:text-indigo-200 transition-all text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Transcript */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[300px] max-h-[460px]">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-6 text-slate-500">
            <Sparkles className="h-8 w-8 text-indigo-400/40 mb-2" />
            <p className="text-xs font-medium text-slate-400">
              Ask DealDisha Co-pilot anything about handling <strong className="text-slate-200">{lead.customerName}</strong>.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Example: &quot;What should I emphasize on the call?&quot; or &quot;Make reply more assertive&quot;
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-line'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 mt-0.5">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Bot className="h-3.5 w-3.5 animate-pulse" />
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
              <span>Analyzing lead context...</span>
            </div>
          </div>
        )}
        {chatError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
            {chatError}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="border-t border-slate-800 bg-slate-950/90 p-3"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={`Ask co-pilot about ${lead.customerName}...`}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-3.5 pr-10 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
