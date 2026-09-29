'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, User, HelpCircle } from 'lucide-react';
import { Lead, ChatMessage } from '@/lib/types';

interface LeadCopilotChatProps {
  lead: Lead;
  onSendMessage: (leadId: string, message: string) => Promise<string>;
}

const QUICK_PROMPTS = [
  'What should I emphasize?',
  'How should I handle the objection?',
  'Make the response more assertive',
  'Give me call talking points',
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
      setChatError(err?.message || 'Failed to connect to AI Co-pilot.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Copilot Header */}
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Ask about this lead
          </h4>
        </div>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
          Get sales guidance based on {lead.customerName}&apos;s lead context.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="border-b border-slate-100 bg-white p-2.5">
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSend(prompt)}
              className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Messages Transcript */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[220px] max-h-[360px]">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-4 text-slate-400">
            <HelpCircle className="h-6 w-6 text-slate-300 mb-1" />
            <p className="text-xs font-medium text-slate-500">
              Click a quick prompt above or ask any strategy question.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[90%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 whitespace-pre-line'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-xs text-slate-500 flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
              <span>Formulating strategy...</span>
            </div>
          </div>
        )}

        {chatError && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
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
        className="border-t border-slate-100 bg-slate-50 p-2.5"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={`Ask about ${lead.customerName}...`}
            className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      </form>
    </div>
  );
};
